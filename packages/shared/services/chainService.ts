import { Chain } from '../types';
import { PrivateKey as HivePrivateKey, cryptoUtils } from '@hiveio/dhive';
import { Client as SteemClient, PrivateKey as SteemPrivateKey } from 'dsteem';
import { getActiveNode } from './nodeService';
import { getChainConfig } from '../config/chainConfig';
import * as blurt from '@blurtfoundation/blurtjs';

export interface ChainAccountData {
    name: string;
    posting: { key_auths: [string, number][] };
    active: { key_auths: [string, number][] };
    memo_key: string;
    balance?: string;
    savings_balance?: string;
    hbd_balance?: string;
    sbd_balance?: string;
    next_vesting_withdrawal?: string;
    vesting_withdraw_rate?: string;
    to_withdraw?: string;
    withdrawn?: string;
}

// --- HELPER: Manual Fetch for HIVE (Service Worker Compatible) ---
const broadcastHiveTransaction = async (nodeUrl: string, operations: any[], key: string): Promise<any> => {
    // 1. Get Dynamic Global Properties
    const propsResponse = await fetch(nodeUrl, {
        method: 'POST',
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'condenser_api.get_dynamic_global_properties',
            params: [],
            id: 1
        }),
        headers: { 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive' // Hint for connection reuse (browser handles automatically)
        }
    });
    const propsJson = await propsResponse.json();
    if (!propsJson.result) throw new Error("Failed to fetch props from " + nodeUrl);
    const props = propsJson.result;

    // 2. Prepare Transaction Data
    const ref_block_num = props.head_block_number & 0xFFFF;
    const ref_block_prefix = Buffer.from(props.head_block_id, 'hex').readUInt32LE(4);
    // 1 min expiration is standard for interactive signing
    const expiration = new Date(Date.now() + 60 * 1000).toISOString().slice(0, -5);

    const tx = {
        ref_block_num,
        ref_block_prefix,
        expiration,
        operations,
        extensions: []
    };

    // 3. Sign (Offline using dhive crypto)
    const privateKey = HivePrivateKey.fromString(key);
    const signedTx = cryptoUtils.signTransaction(tx, [privateKey]);

    // 4. Broadcast Synchronous
    const broadcastResponse = await fetch(nodeUrl, {
        method: 'POST',
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'condenser_api.broadcast_transaction_synchronous',
            params: [signedTx],
            id: 1
        }),
        headers: { 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive' // Hint for connection reuse (browser handles automatically)
        }
    });

    const broadcastResult = await broadcastResponse.json();
    if (broadcastResult.error) {
        throw new Error(broadcastResult.error.message || JSON.stringify(broadcastResult.error));
    }

    return broadcastResult.result; // Returns { id: "txid", block_num: 123, ... }
};


// --- PUBLIC API ---

// Simple in-memory cache for global properties (safe, short TTL)
const globalPropsCache: Map<string, { data: any; timestamp: number }> = new Map();
const GLOBAL_PROPS_CACHE_TTL = 3000; // 3 seconds - properties change frequently but not instantly

const fetchGlobalProps = async (chain: Chain): Promise<any> => {
    const cacheKey = chain;
    const cached = globalPropsCache.get(cacheKey);
    const now = Date.now();
    
    // Return cached data if still valid (reduces redundant requests)
    if (cached && (now - cached.timestamp) < GLOBAL_PROPS_CACHE_TTL) {
        return cached.data;
    }
    
    try {
        const nodeUrl = await getActiveNode(chain);
        const response = await fetch(nodeUrl, {
            method: 'POST',
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'condenser_api.get_dynamic_global_properties',
                params: [],
                id: 1
            }),
            headers: { 
                'Content-Type': 'application/json',
                'Connection': 'keep-alive' // Hint to browser for connection reuse
            },
            // Browser handles keep-alive automatically, but we can hint it
        });
        
        if (!response.ok) {
            // Silently handle HTTP errors (node might be temporarily unavailable)
            return cached?.data || null; // Return stale cache if available
        }
        
        const json = await response.json();
        const result = json.result;
        
        // Cache the result
        if (result) {
            globalPropsCache.set(cacheKey, { data: result, timestamp: now });
        }
        
        return result;
    } catch (error: any) {
        // Only log unexpected errors, not network failures (which are common)
        if (error.name !== 'TypeError' || !error.message.includes('Failed to fetch')) {
            console.error(`Error fetching global props for ${chain}:`, error);
        }
        // Return stale cache if available on error
        return cached?.data || null;
    }
};

const convertToVests = async (chain: Chain, amountInPower: number): Promise<string> => {
    const props = await fetchGlobalProps(chain);
    if (!props) throw new Error("Could not fetch global properties for conversion");

    const totalVestingFund = parseFloat(String(props.total_vesting_fund_hive || props.total_vesting_fund_steem || props.total_vesting_fund_blurt || "0").split(' ')[0]);
    const totalVestingShares = parseFloat(String(props.total_vesting_shares).split(' ')[0]);

    if (totalVestingFund === 0) return "0.000000 VESTS";
    const vests = (amountInPower * totalVestingShares) / totalVestingFund;
    return `${vests.toFixed(6)} VESTS`;
};

export const fetchBalances = async (chain: Chain, username: string): Promise<{ primary: number; secondary: number; staked: number; powerDownActive?: boolean; nextPowerDown?: string; powerDownAmount?: number }> => {
    const nodeUrl = getActiveNode(chain);
    try {
        const response = await fetch(nodeUrl, {
            method: 'POST',
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'condenser_api.get_accounts',
                params: [[username]],
                id: 1
            }),
            headers: { 
                'Content-Type': 'application/json',
                'Connection': 'keep-alive' // Hint for connection reuse
            }
        });

        if (!response.ok) {
            // Silently handle HTTP errors (node might be temporarily unavailable)
            return { primary: 0, secondary: 0, staked: 0 };
        }

        const json = await response.json();
        if (!json.result || json.result.length === 0) return { primary: 0, secondary: 0, staked: 0 };

        const acc = json.result[0];
        const config = getChainConfig(chain);

        // Fetch Global Properties for VESTS conversion
        const props = await fetchGlobalProps(chain);
        let stakedPower = 0;

        if (props) {
            const totalVests = parseFloat(acc.vesting_shares.split(' ')[0]);
            const totalFund = parseFloat(props.total_vesting_fund_steem || props.total_vesting_fund_hive || props.total_vesting_fund_blurt || '0');
            const totalVestingShares = parseFloat(props.total_vesting_shares.split(' ')[0]);
            if (totalVestingShares > 0) {
                stakedPower = (totalVests * totalFund) / totalVestingShares;
            }
        }

        const primaryStr = acc[config.api.balanceFields.primary] || '0';
        const secondaryStr = config.api.balanceFields.secondary ? acc[config.api.balanceFields.secondary] || '0' : '0';

        // Power down info
        const nextWithdrawal = acc.next_vesting_withdrawal;
        const powerDownActive = nextWithdrawal && !nextWithdrawal.startsWith('1969') && !nextWithdrawal.startsWith('1970');
        let powerDownAmount = 0;
        if (powerDownActive && props) {
            const withdrawRateVests = parseFloat(acc.vesting_withdraw_rate.split(' ')[0]);
            const totalFund = parseFloat(props.total_vesting_fund_steem || props.total_vesting_fund_hive || props.total_vesting_fund_blurt || '0');
            const totalVestingShares = parseFloat(props.total_vesting_shares.split(' ')[0]);
            powerDownAmount = (withdrawRateVests * totalFund) / totalVestingShares;
        }

        return {
            primary: parseFloat(String(primaryStr).split(' ')[0]),
            secondary: parseFloat(String(secondaryStr).split(' ')[0]),
            staked: stakedPower,
            powerDownActive,
            nextPowerDown: nextWithdrawal,
            powerDownAmount: powerDownAmount
        };
    } catch (error: any) {
        // Only log unexpected errors, not network failures (which are common when nodes are temporarily unavailable)
        if (error.name !== 'TypeError' || !error.message.includes('Failed to fetch')) {
            console.error(`Error fetching balance for ${username} on ${chain}:`, error);
        }
        return { primary: 0, secondary: 0, staked: 0 };
    }
};

export const fetchAccountData = async (chain: Chain, username: string): Promise<ChainAccountData | null> => {
    const nodeUrl = getActiveNode(chain);
    try {
        const response = await fetch(nodeUrl, {
            method: 'POST',
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'condenser_api.get_accounts',
                params: [[username]],
                id: 1
            }),
            headers: { 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive' // Hint for connection reuse (browser handles automatically)
        }
        });
        const json = await response.json();
        if (json.result && json.result.length > 0) {
            return json.result[0];
        }
        return null;
    } catch (error) {
        console.error(`Error fetching account data for ${username} on ${chain}:`, error);
        return null;
    }
};

export const validateAccountKeys = async (chain: Chain, username: string, keys: { active?: string, posting?: string, memo?: string }): Promise<{ valid: boolean, error?: string }> => {
    try {
        const accountData = await fetchAccountData(chain, username);
        if (!accountData) return { valid: false, error: "Account not found or network error" };

        const config = getChainConfig(chain);
        const prefix = config.addressPrefix;
        let errors: string[] = [];

        const verifyKey = (keyStr: string, auths: [string, number][], type: string) => {
            try {
                // Get public key and replace default prefix if needed
                let pub = HivePrivateKey.fromString(keyStr).createPublic().toString();
                if (prefix !== 'STM' && pub.startsWith('STM')) {
                    pub = prefix + pub.substring(3);
                }

                const found = auths.some(auth => auth[0] === pub);
                if (!found) errors.push(`${type} key does not match account`);
            } catch (e) {
                errors.push(`Invalid ${type} key format`);
            }
        };

        if (keys.active) verifyKey(keys.active, accountData.active.key_auths, "Active");
        if (keys.posting) verifyKey(keys.posting, accountData.posting.key_auths, "Posting");
        if (keys.memo && keys.memo !== accountData.memo_key) {
            try {
                let pub = HivePrivateKey.fromString(keys.memo).createPublic().toString();
                if (prefix !== 'STM' && pub.startsWith('STM')) {
                    pub = prefix + pub.substring(3);
                }
                if (pub !== accountData.memo_key) errors.push("Memo key does not match");
            } catch (e) { errors.push("Invalid Memo key format"); }
        }

        if (errors.length > 0) return { valid: false, error: errors.join(', ') };
        return { valid: true };

    } catch (e: any) {
        return { valid: false, error: e.message };
    }
};

export const broadcastTransfer = async (
    chain: Chain,
    from: string,
    activeKey: string,
    to: string,
    amount: string,
    memo: string,
    tokenSymbol?: string
): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    const formattedAmount = parseFloat(amount).toFixed(3);
    const nodeUrl = getActiveNode(chain);
    const defaultToken = chain === Chain.HIVE ? 'HIVE' : chain === Chain.STEEM ? 'STEEM' : 'BLURT';
    const symbol = tokenSymbol || defaultToken;

    try {
        if (chain === Chain.HIVE) {
            const transfer = ['transfer', { from, to, amount: `${formattedAmount} ${symbol}`, memo }];
            const result = await broadcastHiveTransaction(nodeUrl, [transfer], activeKey);
            return { success: true, txId: result.id, opResult: result };
        }
        else if (chain === Chain.STEEM) {
            const client = new SteemClient(nodeUrl);
            const key = SteemPrivateKey.fromString(activeKey);
            const transfer = { from, to, amount: `${formattedAmount} ${symbol}`, memo };
            const result = await client.broadcast.transfer(transfer, key);
            return { success: true, txId: result.id };
        }
        else if (chain === Chain.BLURT) {
            const config = getChainConfig(Chain.BLURT);
            blurt.config.set('address_prefix', config.addressPrefix);
            blurt.config.set('chain_id', config.chainId);
            blurt.api.setOptions({ url: nodeUrl, useAppbaseApi: true });
            const result = await new Promise<any>((resolve, reject) => {
                blurt.broadcast.transfer(activeKey, from, to, `${formattedAmount} BLURT`, memo, (err: any, res: any) => {
                    if (err) reject(err); else resolve(res);
                });
            });
            return { success: true, txId: result.id };
        }
        return { success: false, error: "Chain not supported" };
    } catch (e: any) {
        console.error("Transfer Error:", e);
        return { success: false, error: e.message || "Broadcast failed" };
    }
};

export const broadcastVote = async (chain: Chain, voter: string, key: string, author: string, permlink: string, weight: number): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    const nodeUrl = getActiveNode(chain);
    try {
        if (chain === Chain.HIVE) {
            const vote = ['vote', { voter, author, permlink, weight }];
            const result = await broadcastHiveTransaction(nodeUrl, [vote], key);
            return { success: true, txId: result.id, opResult: result };
        } else if (chain === Chain.STEEM) {
            const client = new SteemClient(nodeUrl);
            const privateKey = SteemPrivateKey.fromString(key);
            const result = await client.broadcast.vote({ voter, author, permlink, weight }, privateKey);
            return { success: true, txId: result.id };
        } else if (chain === Chain.BLURT) {
            const config = getChainConfig(Chain.BLURT);
            blurt.config.set('address_prefix', config.addressPrefix);
            blurt.config.set('chain_id', config.chainId);
            blurt.api.setOptions({ url: nodeUrl, useAppbaseApi: true });
            const result = await new Promise<any>((resolve, reject) => {
                blurt.broadcast.vote(key, voter, author, permlink, weight, (err: any, res: any) => {
                    if (err) reject(err); else resolve(res);
                });
            });
            return { success: true, txId: result.id };
        }
        return { success: false, error: "Chain not supported" };
    } catch (e: any) {
        return { success: false, error: e.message || "Vote failed" };
    }
};

export const broadcastCustomJson = async (chain: Chain, username: string, key: string, id: string, json: string, keyType: 'Posting' | 'Active'): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    const nodeUrl = getActiveNode(chain);
    try {
        const required_auths = keyType === 'Active' ? [username] : [];
        const required_posting_auths = keyType === 'Posting' ? [username] : [];

        if (chain === Chain.HIVE) {
            const op: any = ['custom_json', {
                required_auths,
                required_posting_auths,
                id,
                json: typeof json === 'string' ? json : JSON.stringify(json)
            }];
            const result = await broadcastHiveTransaction(nodeUrl, [op], key);
            return { success: true, txId: result.id, opResult: result };

        } else if (chain === Chain.STEEM) {
            const client = new SteemClient(nodeUrl);
            const privateKey = SteemPrivateKey.fromString(key);
            const result = await client.broadcast.json({ id, json, required_auths, required_posting_auths }, privateKey);
            return { success: true, txId: result.id };
        } else if (chain === Chain.BLURT) {
            const config = getChainConfig(Chain.BLURT);
            blurt.config.set('address_prefix', config.addressPrefix);
            blurt.config.set('chain_id', config.chainId);
            blurt.api.setOptions({ url: nodeUrl, useAppbaseApi: true });
            const result = await new Promise<any>((resolve, reject) => {
                blurt.broadcast.customJson(key, required_auths, required_posting_auths, id, json, (err: any, res: any) => {
                    if (err) reject(err); else resolve(res);
                });
            });
            return { success: true, txId: result.id };
        }
        return { success: false, error: "Chain not supported" };
    } catch (e: any) {
        return { success: false, error: e.message || "Custom JSON failed" };
    }
};

const formatChainError = (error: any): string => {
    // If it's an object with error.message, use that. Or just stringify.
    const msg = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));

    // Handle "min_delegation" error
    if (msg.includes('op.vesting_shares >= min_delegation')) {
        try {
            const match = msg.match(/minimum delegation amount of ({.*})/);
            if (match && match[1]) {
                const data = JSON.parse(match[1]);
                const amount = (parseFloat(data.amount) / Math.pow(10, data.precision)).toFixed(6);
                return `Delegation too small. Minimum required: ${amount} VESTS (roughly 35 BLURT/BP)`;
            }
        } catch (e) { }
        return "Delegation amount is too small. Please enter a larger amount (at least ~35 BP for Blurt).";
    }

    // Handle Fee / Balance error
    // Handle Fee / Balance error
    if (msg.includes('balance >= fee')) {
        return "Insufficient funds to pay transaction fee (Blurt fees depend on message size).";
    }
    if (msg.includes('sufficient funds')) {
        return "Insufficient funds. You do not have enough balance for this operation.";
    }

    // Handle other common errors
    if (msg.includes('balance')) return "Insufficient balance for this operation.";
    if (msg.includes('authority')) return "Missing required authority. Check your Active key.";

    // Handle signature errors with hints
    if (msg.includes('Error Signature') || msg.includes('32602')) {
        return `Signature/Params Error (-32602). Node response: ${msg}`;
    }

    return msg;
};

// Manual Blurt Broadcast to avoid library issues
const broadcastBlurtTransaction = async (nodeUrl: string, operations: any[], key: string): Promise<any> => {
    // Trim the key to remove any whitespace issues
    const trimmedKey = key ? key.trim() : key;
    if (trimmedKey !== key) {
        key = trimmedKey;
    }
    
    // 1. Get Dynamic Global Properties
    const propsResponse = await fetch(nodeUrl, {
        method: 'POST',
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'condenser_api.get_dynamic_global_properties',
            params: [],
            id: 1
        }),
        headers: { 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive' // Hint for connection reuse (browser handles automatically)
        }
    });
    const propsJson = await propsResponse.json();
    if (!propsJson.result) throw new Error("Failed to fetch props from " + nodeUrl);
    const props = propsJson.result;

    // 2. Prepare Transaction Data
    const ref_block_num = props.head_block_number & 0xFFFF;
    const ref_block_prefix = Buffer.from(props.head_block_id, 'hex').readUInt32LE(4);
    const expiration = new Date(Date.now() + 60 * 1000).toISOString().slice(0, -5);

    // 3. Sign (using blurtjs auth)
    const config = getChainConfig(Chain.BLURT);
    blurt.config.set('address_prefix', config.addressPrefix);
    blurt.config.set('chain_id', config.chainId);

    // CRITICAL FIX: Convert operations from STEEM to BLURT BEFORE signing
    // The blurtjs serializer accepts BLURT, so we convert before creating the transaction
    // This ensures the signature is calculated over BLURT from the start
    const operationsWithBlurt = operations.map((op: any) => {
        const opName = op[0];
        const opData = { ...op[1] };
        
        const convertSteemToBlurt = (value: any): any => {
            if (typeof value === 'string') {
                return value.replace(/ STEEM/g, ' BLURT');
            } else if (Array.isArray(value)) {
                return value.map(convertSteemToBlurt);
            } else if (value !== null && typeof value === 'object') {
                const converted: any = {};
                for (const k in value) {
                    converted[k] = convertSteemToBlurt(value[k]);
                }
                return converted;
            }
            return value;
        };
        
        return [opName, convertSteemToBlurt(opData)];
    });
    
    const txWithBlurt = {
        ref_block_num,
        ref_block_prefix,
        expiration,
        operations: operationsWithBlurt,
        extensions: []
    };

    // Sign with BLURT - blurtjs serializer accepts BLURT directly
    // However, if blurtjs internally uses @hiveio/dhive serializer, it may reject BLURT
    // In that case, we fall back to signing with STEEM and converting after
    let signedTx;
    try {
        console.log('[Blurt] Attempting to sign with BLURT...');
        signedTx = blurt.auth.signTransaction(txWithBlurt, [key]);
        console.log('[Blurt] Successfully signed with BLURT');
    } catch (e: any) {
        console.error('[Blurt] Error signing with BLURT:', e.message || e);
        // If signing with BLURT fails (serializer doesn't accept BLURT), try with STEEM
        if (e.message && (e.message.includes('Invalid asset symbol') || e.message.includes('Unable to serialize'))) {
            console.warn('[Blurt] BLURT signing failed, falling back to STEEM for serialization');
            
            // Convert back to STEEM for signing
            const operationsWithSteem = operations.map((op: any) => {
                const opName = op[0];
                const opData = { ...op[1] };
                
                const convertBlurtToSteem = (value: any): any => {
                    if (typeof value === 'string') {
                        return value.replace(/ BLURT/g, ' STEEM');
                    } else if (Array.isArray(value)) {
                        return value.map(convertBlurtToSteem);
                    } else if (value !== null && typeof value === 'object') {
                        const converted: any = {};
                        for (const k in value) {
                            converted[k] = convertBlurtToSteem(value[k]);
                        }
                        return converted;
                    }
                    return value;
                };
                
                return [opName, convertBlurtToSteem(opData)];
            });
            
            const txWithSteem = {
                ref_block_num,
                ref_block_prefix,
                expiration,
                operations: operationsWithSteem,
                extensions: []
            };
            
            // Sign with STEEM
            signedTx = blurt.auth.signTransaction(txWithSteem, [key]);
            
            // Convert STEEM back to BLURT in the signed transaction JSON
            // This is safe because STEEM and BLURT serialize to identical bytes
            const convertSteemToBlurtInJson = (obj: any): any => {
                if (typeof obj === 'string') {
                    return obj.replace(/ STEEM/g, ' BLURT');
                } else if (Array.isArray(obj)) {
                    return obj.map(convertSteemToBlurtInJson);
                } else if (obj !== null && typeof obj === 'object') {
                    const converted: any = {};
                    for (const k in obj) {
                        converted[k] = convertSteemToBlurtInJson(obj[k]);
                    }
                    return converted;
                }
                return obj;
            };
            
            // Create deep copy and convert operations back to BLURT
            signedTx = JSON.parse(JSON.stringify(signedTx));
            if (signedTx.operations) {
                signedTx.operations = convertSteemToBlurtInJson(signedTx.operations);
            }
        } else {
            // Re-throw if it's a different error
            throw e;
        }
    }

    // 4. Broadcast Synchronous
    const broadcastResponse = await fetch(nodeUrl, {
        method: 'POST',
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'condenser_api.broadcast_transaction_synchronous',
            params: [signedTx],
            id: 1
        }),
        headers: { 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive' // Hint for connection reuse (browser handles automatically)
        }
    });

    const broadcastResult = await broadcastResponse.json();
    if (broadcastResult.error) {
        console.error("FULL RPC ERROR:", JSON.stringify(broadcastResult.error, null, 2));

        // Enhance error message
        const err = broadcastResult.error;
        let msg = err.message || JSON.stringify(err);

        // Translate obscure node errors to user-friendly messages
        if (msg.includes('unknown key')) {
            msg = "Account not found or invalid key. Please check the username.";
        }

        const data = err.data ? JSON.stringify(err.data) : '';
        throw new Error(`${msg} ${data}`);
    }

    return broadcastResult.result;
};

export const broadcastOperations = async (
    chain: Chain,
    activeKey: string,
    operations: any[]
): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    const nodeUrl = getActiveNode(chain);

    try {
        if (chain === Chain.HIVE) {
            const result = await broadcastHiveTransaction(nodeUrl, operations, activeKey);
            return { success: true, txId: result.id, opResult: result };
        } else if (chain === Chain.STEEM) {
            const client = new SteemClient(nodeUrl);
            const key = SteemPrivateKey.fromString(activeKey);
            const result = await client.broadcast.sendOperations(operations, key);
            return { success: true, txId: result.id, opResult: result };
        } else if (chain === Chain.BLURT) {
            // Using manual broadcast implementation for better reliability

            // Helper function to convert BLURT to STEEM in asset strings
            // This is needed because @hiveio/dhive serializers don't recognize BLURT symbol
            // BLURT and STEEM have identical serialization (3 decimals), so this is safe
            const convertBlurtToSteem = (value: any): any => {
                if (typeof value === 'string') {
                    // Convert asset strings like "1.000 BLURT" to "1.000 STEEM"
                    if (value.includes(' BLURT')) {
                        return value.replace(/ BLURT/g, ' STEEM');
                    }
                    return value;
                } else if (Array.isArray(value)) {
                    return value.map(convertBlurtToSteem);
                } else if (value !== null && typeof value === 'object') {
                    const converted: any = {};
                    for (const key in value) {
                        converted[key] = convertBlurtToSteem(value[key]);
                    }
                    return converted;
                }
                return value;
            };

            // VALIDATION & CLEANUP: Some dApps (like BeBlurt) might send malformed metadata
            const cleanOperations = operations.map(op => {
                const opName = op[0];
                const opData = { ...op[1] }; // Shallow copy to avoid mutating original

                // 0. Convert BLURT to STEEM in all asset fields (CRITICAL FIX for witness_update)
                // This must happen before other cleanup to ensure asset serialization works
                const convertedOpData = convertBlurtToSteem(opData);

                // 1. Handle Metadata Fields
                const metadataFields = ['json_metadata', 'posting_json_metadata'];
                metadataFields.forEach(field => {
                    if (convertedOpData[field] !== undefined && convertedOpData[field] !== null) {
                        // If it's an object, stringify it
                        if (typeof convertedOpData[field] === 'object') {
                            try {
                                convertedOpData[field] = JSON.stringify(convertedOpData[field]);
                            } catch (e) {
                                console.error(`[ChainService] Failed to stringify ${field}:`, e);
                            }
                        }
                    } else {
                        // Ensure it's at least an empty string if referenced by dApp but null/undefined
                        // Actually, better to just leave it if it's not there, but some nodes prefer ""
                        if (opName === 'comment' && field === 'json_metadata') {
                            convertedOpData[field] = "";
                        }
                    }
                });

                // 2. Extra safety for 'tags' (Common issue with BeBlurt and similar dApps)
                // If 'tags' exists as a top-level field, it MUST be moved to json_metadata
                if (convertedOpData.tags) {
                    try {
                        let meta = {};
                        if (convertedOpData.json_metadata) {
                            try {
                                meta = typeof convertedOpData.json_metadata === 'string'
                                    ? JSON.parse(convertedOpData.json_metadata)
                                    : convertedOpData.json_metadata;
                            } catch (e) { /* ignore parse error, use empty */ }
                        }
                        // Merge tags into metadata
                        (meta as any).tags = convertedOpData.tags;
                        convertedOpData.json_metadata = JSON.stringify(meta);
                        delete convertedOpData.tags;
                    } catch (e) {
                        console.error("[ChainService] Error merging tags into metadata:", e);
                    }
                }

                // 3. Ensure extensions is an array
                if (convertedOpData.extensions !== undefined && !Array.isArray(convertedOpData.extensions)) {
                    convertedOpData.extensions = [];
                }

                return [opName, convertedOpData];
            });

            const result = await broadcastBlurtTransaction(nodeUrl, cleanOperations, activeKey);
            return { success: true, txId: result.id, opResult: result };
        }
        return { success: false, error: "Chain not supported" };
    } catch (e: any) {
        console.error("Broadcast Ops Error:", e);
        return { success: false, error: formatChainError(e) };
    }
};

export const broadcastBulkTransfer = async (
    chain: Chain,
    from: string,
    activeKey: string,
    items: { to: string; amount: number | string; memo: string; symbol?: string }[],
    tokenSymbol?: string
): Promise<{ success: boolean; txId?: string; error?: string }> => {
    // Determine default token if not provided
    const defaultToken = chain === Chain.HIVE ? 'HIVE' : chain === Chain.STEEM ? 'STEEM' : 'BLURT';
    const fallbackSymbol = tokenSymbol || defaultToken;

    const ops = items.map(item => {
        const symbol = item.symbol || fallbackSymbol;
        const amt = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
        return ['transfer', {
            from,
            to: item.to,
            amount: `${amt.toFixed(3)} ${symbol}`,
            memo: item.memo
        }];
    });

    return broadcastOperations(chain, activeKey, ops);
};

// Export for UI validation
export const checkAccountExists = async (chain: Chain, username: string): Promise<boolean> => {
    try {
        const nodeUrl = getActiveNode(chain);

        const response = await fetch(nodeUrl, {
            method: 'POST',
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'condenser_api.get_accounts',
                params: [[username]],
                id: 1
            }),
            headers: { 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive' // Hint for connection reuse (browser handles automatically)
        }
        });
        const json = await response.json();

        if (json.error) {
            console.warn(`[CheckAccount] Node error for @${username}:`, json.error);
            const msg = json.error.message || '';
            if (msg.includes('unknown key')) return false;
            return false;
        }

        return json.result && json.result.length > 0;
    } catch (e) {
        console.warn("[ChainService] Account check network failed, skipping validation:", e);
        return true;
    }
};

export const broadcastPowerUp = async (chain: Chain, username: string, activeKey: string, to: string, amount: string): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    // Validate recipient exists
    console.log(`[PowerUp] Validating recipient @${to} on ${chain}...`);
    const exists = await checkAccountExists(chain, to);
    console.log(`[PowerUp] Validation result for @${to}: ${exists}`);

    if (!exists) {
        return { success: false, error: `Account @${to} does not exist on ${chain}. Please check the username.` };
    }

    const op: any = ['transfer_to_vesting', {
        from: username,
        to: to,
        amount: amount
    }];
    return broadcastOperations(chain, activeKey, [op]);
};

export const broadcastPowerDown = async (chain: Chain, username: string, activeKey: string, amountPower: number | string): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    try {
        let vestingShares: string;
        if (typeof amountPower === 'string' && amountPower.includes('VESTS')) {
            vestingShares = amountPower;
        } else {
            const numericAmount = typeof amountPower === 'string' ? parseFloat(amountPower) : amountPower;
            vestingShares = numericAmount === 0 ? "0.000000 VESTS" : await convertToVests(chain, numericAmount);
        }

        const op: any = ['withdraw_vesting', {
            account: username,
            vesting_shares: vestingShares
        }];
        return broadcastOperations(chain, activeKey, [op]);
    } catch (e: any) {
        return { success: false, error: e.message || "Failed to convert power to vests" };
    }
};

export const broadcastDelegation = async (chain: Chain, username: string, activeKey: string, delegatee: string, amountPower: number | string): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    try {
        let vestingShares: string;
        if (typeof amountPower === 'string' && amountPower.includes('VESTS')) {
            vestingShares = amountPower;
        } else {
            const numericAmount = typeof amountPower === 'string' ? parseFloat(amountPower) : amountPower;
            vestingShares = numericAmount === 0 ? "0.000000 VESTS" : await convertToVests(chain, numericAmount);
        }

        const op: any = ['delegate_vesting_shares', {
            delegator: username,
            delegatee: delegatee,
            vesting_shares: vestingShares
        }];
        return broadcastOperations(chain, activeKey, [op]);
    } catch (e: any) {
        return { success: false, error: e.message || "Failed to convert power to vests" };
    }
};

// HBD/SBD Savings (Staking) - Blurt doesn't have this feature
export const broadcastSavingsDeposit = async (chain: Chain, username: string, activeKey: string, amount: string): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    if (chain === Chain.BLURT) {
        return { success: false, error: 'Blurt does not support savings' };
    }

    const op: any = ['transfer_to_savings', {
        from: username,
        to: username,
        amount: amount,
        memo: ''
    }];
    return broadcastOperations(chain, activeKey, [op]);
};

export const broadcastSavingsWithdraw = async (chain: Chain, username: string, activeKey: string, amount: string, requestId: number): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    if (chain === Chain.BLURT) {
        return { success: false, error: 'Blurt does not support savings' };
    }

    const op: any = ['transfer_from_savings', {
        from: username,
        request_id: requestId,
        to: username,
        amount: amount,
        memo: ''
    }];
    return broadcastOperations(chain, activeKey, [op]);
};

// RC (Resource Credits) Delegation - Hive only
export const broadcastRCDelegate = async (chain: Chain, username: string, activeKey: string, delegatee: string, amountHP: number): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    if (chain !== Chain.HIVE) {
        return { success: false, error: 'RC delegation is only available on Hive' };
    }

    try {
        const vestingShares = await convertToVests(chain, amountHP);
        const maxRC = parseInt(vestingShares.split(' ')[0].replace('.', '')); // Simplified magnitude for RC

        const op: any = ['delegate_rc', {
            from: username,
            delegatees: [delegatee],
            max_rc: maxRC
        }];
        return broadcastOperations(chain, activeKey, [op]);
    } catch (e: any) {
        return { success: false, error: e.message || "Failed to convert HP to RC" };
    }
};

export const broadcastRCUndelegate = async (chain: Chain, username: string, activeKey: string, delegatee: string): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    if (chain !== Chain.HIVE) {
        return { success: false, error: 'RC delegation is only available on Hive' };
    }

    // To undelegate, set max_rc to 0
    const op: any = ['delegate_rc', {
        from: username,
        delegatees: [delegatee],
        max_rc: 0
    }];
    return broadcastOperations(chain, activeKey, [op]);
};


export interface HistoryItem {
    date: string;
    from: string;
    to: string;
    amount: string;
    memo: string;
    type: 'send' | 'receive' | 'powerup_in' | 'powerup_out' | 'powerdown';
    txId: string;
}

export const fetchAccountHistory = async (chain: Chain, username: string): Promise<HistoryItem[]> => {
    const node = getActiveNode(chain);
    const processOp = (op: any, timestamp: string, trx_id: string): HistoryItem | null => {
        const type = op[0];
        const data = op[1];
        if (type === 'transfer') {
            if (data.from === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: data.memo, type: 'send', txId: trx_id };
            if (data.to === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: data.memo, type: 'receive', txId: trx_id };
        }
        if (type === 'transfer_to_vesting') {
            if (data.from === username && data.to === username) return { date: timestamp, from: data.from, to: 'VESTING', amount: data.amount, memo: 'Power Up (Self)', type: 'powerup_out', txId: trx_id };
            if (data.from === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: 'Power Up', type: 'powerup_out', txId: trx_id };
            if (data.to === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: 'Power Up Received', type: 'powerup_in', txId: trx_id };
        }
        if (type === 'withdraw_vesting') {
            if (data.account === username) return { date: timestamp, from: data.account, to: 'LIQUID', amount: data.vesting_shares, memo: 'Power Down', type: 'powerdown', txId: trx_id };
        }
        return null;
    };

    try {
        // Calculate date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        if (chain === Chain.HIVE) {
            // Use native fetch for history in SW
            const response = await fetch(node, {
                method: 'POST',
                body: JSON.stringify({ jsonrpc: '2.0', method: 'condenser_api.get_account_history', params: [username, -1, 1000], id: 1 }),
                headers: { 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive' // Hint for connection reuse (browser handles automatically)
        }
            });
            const json = await response.json();
            if (json.result) {
                const allHistory = json.result
                    .map((h: any) => processOp(h[1].op, h[1].timestamp, h[1].trx_id))
                    .filter((h: any) => h !== null)
                    .reverse();

                // Filter to last 30 days
                return allHistory.filter((item: HistoryItem) => new Date(item.date) >= thirtyDaysAgo);
            }
        }
        if (chain === Chain.STEEM) {
            const client = new SteemClient(node);
            const history = await client.database.call('get_account_history', [username, -1, 1000]);
            const allHistory = history
                .map((h: any) => processOp(h[1].op, h[1].timestamp, h[1].trx_id))
                .filter((h: any) => h !== null)
                .reverse();

            // Filter to last 30 days
            return allHistory.filter((item: HistoryItem) => new Date(item.date) >= thirtyDaysAgo);
        }
        if (chain === Chain.BLURT) {
            const response = await fetch(node, {
                method: 'POST',
                body: JSON.stringify({ jsonrpc: '2.0', method: 'condenser_api.get_account_history', params: [username, -1, 1000], id: 1 }),
                headers: { 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive' // Hint for connection reuse (browser handles automatically)
        }
            });
            const json = await response.json();
            if (json.result) {
                const allHistory = json.result
                    .map((h: any) => processOp(h[1].op, h[1].timestamp, h[1].trx_id))
                    .filter((h: any) => h !== null)
                    .reverse();

                // Filter to last 30 days
                return allHistory.filter((item: HistoryItem) => new Date(item.date) >= thirtyDaysAgo);
            }
        }
    } catch (e) { console.error("Fetch History Error:", e); }
    return [];
};

export const detectWeb3Context = (): string | null => {
    if (typeof window === 'undefined') return null;
    let hostname: string;
    try {
        hostname = new URL(window.location.href).hostname;
    } catch {
        return null;
    }
    // Check for steemit context
    if (hostname === 'steemit.com' || hostname.endsWith('.steemit.com')) return 'steemit';
    // Check for hive context
    if (hostname === 'hive.blog' || hostname.endsWith('.hive.blog') ||
        hostname === 'peakd.com' || hostname.endsWith('.peakd.com')) return 'hive';
    // Check for blurt context
    if (hostname === 'blurt.blog' || hostname.endsWith('.blurt.blog') ||
        hostname === 'beblurt.com' || hostname.endsWith('.beblurt.com')) return 'blurt';
    return null;
};

export const signMessage = (
    chain: Chain,
    message: string | any,
    keyStr: string,
    _useLegacySigner: boolean = false
): { success: boolean; result?: string; publicKey?: string; error?: string } => {
    try {
        if (chain === Chain.HIVE || chain === Chain.STEEM || chain === Chain.BLURT) {
            const key = HivePrivateKey.fromString(keyStr);
            const prefix = getChainConfig(chain).addressPrefix;

            // Convert message to buffer
            let msgBuf: Buffer;
            if (typeof message === 'object' && !Buffer.isBuffer(message)) {
                if ((message as any).type === 'Buffer' && Array.isArray((message as any).data)) {
                    msgBuf = Buffer.from((message as any).data);
                } else {
                    msgBuf = Buffer.from(JSON.stringify(message));
                }
            } else if (Buffer.isBuffer(message)) {
                msgBuf = message;
            } else if (typeof message === 'string') {
                // CRITICAL FIX: Check if the string is a JSON-serialized Buffer
                // This happens when dApps send Buffer objects through chrome.runtime.sendMessage
                try {
                    const parsed = JSON.parse(message);
                    if (parsed.type === 'Buffer' && Array.isArray(parsed.data)) {
                        msgBuf = Buffer.from(parsed.data);
                    } else {
                        msgBuf = Buffer.from(message);
                    }
                } catch (e) {
                    // Not JSON, treat as regular string
                    msgBuf = Buffer.from(message);
                }
            } else {
                msgBuf = Buffer.from(String(message));
            }

            // Hash and sign
            // BLURT IMAGE UPLOAD: The img-upload server expects signatures over:
            // SHA256('ImageSigningChallenge' + imageBuffer)

            // Special handling for Blurt Hex Strings (some dApps send images as hex)
            if (chain === Chain.BLURT && typeof message === 'string' && message.length > 200 && /^[0-9a-fA-F]+$/.test(message)) {
                try {
                    msgBuf = Buffer.from(message, 'hex');
                } catch (e) {
                    // Fallback to standard conversion if hex fails
                }
            }

            let hash: Buffer;

            // We detect image uploads by checking if it's a large binary buffer (> 200 bytes is safe threshold for image)
            if (chain === Chain.BLURT && msgBuf.length > 200) {
                // Check if the buffer already starts with 'ImageSigningChallenge'
                const challengePrefix = Buffer.from('ImageSigningChallenge', 'utf-8');
                const alreadyHasPrefix = msgBuf.slice(0, challengePrefix.length).equals(challengePrefix);

                if (alreadyHasPrefix) {
                    // dApp already included the prefix, just hash it
                    hash = cryptoUtils.sha256(msgBuf);
                } else {
                    // Prepend the challenge string required by Blurt's image upload server
                    const combined = Buffer.concat([challengePrefix, msgBuf]);
                    hash = cryptoUtils.sha256(combined);
                }
            } else {
                // Standard message signing
                hash = cryptoUtils.sha256(msgBuf);
            }

            const sig = key.sign(hash);
            const signature = sig.toString();

            // Get public key with correct prefix
            let publicKey = key.createPublic().toString();
            if (prefix !== 'STM' && publicKey.startsWith('STM')) {
                publicKey = prefix + publicKey.substring(3);
            }

            return { success: true, result: signature, publicKey };
        } else {
            return { success: false, error: "Chain not supported" };
        }
    } catch (e: any) {
        return { success: false, error: e.message };
    }
};
