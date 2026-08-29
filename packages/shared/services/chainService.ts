import { Chain } from '../types';
import { PrivateKey as HivePrivateKey, cryptoUtils, Memo as HiveMemo } from '@hiveio/dhive';
import { Client as SteemClient, PrivateKey as SteemPrivateKey, cryptoUtils as steemCryptoUtils } from 'dsteem';
import { BLURT_CANDIDATES, getActiveNode, getActiveNodeAsync, HIVE_CANDIDATES, STEEM_CANDIDATES } from './nodeService';
import { getChainConfig } from '../config/chainConfig';
import * as blurt from '@blurtfoundation/blurtjs';
import { requiresActiveAuthority } from '../utils/authority';

export interface ChainAccountData {
    name: string;
    posting: {
        key_auths: [string, number][];
        account_auths: [string, number][];
        weight_threshold: number;
    };
    active: {
        key_auths: [string, number][];
        account_auths: [string, number][];
        weight_threshold: number;
    };
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

export interface MultiSigAuthority {
    threshold: number;
    keyAuths: [string, number][];
    accountAuths: [string, number][];
}

export interface MultisigProgress {
    currentWeight: number;
    threshold: number;
    canBroadcast: boolean;
}

export interface PartialTransactionSignature {
    username: string;
    pubKey: string;
    signature: string;
}

export interface CustomJsonEvent {
    block: number;
    timestamp: string;
    trxId: string;
    account: string;
    requiredAuths: string[];
    requiredPostingAuths: string[];
    id: string;
    json: any;
}

const getSignatureWeight = (auth: MultiSigAuthority, sig: PartialTransactionSignature): number => {
    const accountWeight = auth.accountAuths.find((entry) => entry[0] === sig.username)?.[1] || 0;
    const keyWeight = auth.keyAuths.find((entry) => entry[0] === sig.pubKey)?.[1] || 0;
    return Math.max(accountWeight, keyWeight);
};

// --- HELPER: Parse JSON response with HTML error detection ---
const parseJsonResponse = async (response: Response, nodeUrl: string): Promise<any> => {
    const text = await response.text();

    // Detect HTML responses (Cloudflare, nginx error pages, etc.)
    if (text.trim().startsWith('<') || text.includes('<!DOCTYPE') || text.includes('<html')) {
        throw new Error(`Node ${nodeUrl} returned HTML instead of JSON (likely maintenance or Cloudflare error)`);
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`Unable to parse endpoint data. Response: ${text.substring(0, 100)}...`);
    }
};

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
            'Content-Type': 'application/json'
        }
    });

    if (!propsResponse.ok) {
        throw new Error(`Node ${nodeUrl} returned HTTP ${propsResponse.status}`);
    }

    const propsJson = await parseJsonResponse(propsResponse, nodeUrl);
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
            'Content-Type': 'application/json'
        }
    });

    if (!broadcastResponse.ok) {
        throw new Error(`Node ${nodeUrl} returned HTTP ${broadcastResponse.status}`);
    }

    const broadcastResult = await parseJsonResponse(broadcastResponse, nodeUrl);
    if (broadcastResult.error) {
        throw new Error(broadcastResult.error.message || JSON.stringify(broadcastResult.error));
    }

    return {
        ...broadcastResult.result,
        signatures: signedTx.signatures,
        signedTx,
        transaction: signedTx
    }; // Returns broadcast result plus the signed transaction envelope
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
                'Content-Type': 'application/json'
            }
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

const normalizeOperations = (operations: any[]): any[] => {
    const normalizedOps = (operations || []).map(op => {
        if (Array.isArray(op)) return op;
        if (op && typeof op === 'object') {
            const type = op.type || op.operation || op.method;
            const data = op.data || op.op || op.operation_data || (({ type: _t, operation: _o, method: _m, ...rest }) => rest)(op);
            if (type) return [type, data];
        }
        return op;
    });

    return normalizedOps.map(op => {
        if (Array.isArray(op) && op.length >= 2 && typeof op[1] === 'object') {
            const data = { ...op[1] };
            Object.keys(data).forEach(key => {
                if (key.startsWith('__')) delete data[key];
            });
            return [op[0], data];
        }
        return op;
    });
};

const convertAssetSymbolRecursively = (value: any, fromSymbol: string, toSymbol: string): any => {
    if (typeof value === 'string') {
        return value.replace(new RegExp(` ${fromSymbol}`, 'g'), ` ${toSymbol}`);
    }
    if (Array.isArray(value)) {
        return value.map((entry) => convertAssetSymbolRecursively(entry, fromSymbol, toSymbol));
    }
    if (value !== null && typeof value === 'object') {
        const converted: any = {};
        for (const key in value) {
            converted[key] = convertAssetSymbolRecursively(value[key], fromSymbol, toSymbol);
        }
        return converted;
    }
    return value;
};

const normalizeBlockchainExpiration = (expiration?: string): string => {
    if (!expiration) {
        return new Date(Date.now() + 60 * 1000).toISOString().slice(0, -5);
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(expiration)) {
        return expiration;
    }

    const parsed = new Date(expiration);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, -5);
    }

    return expiration;
};

export const getHeadBlockNumber = async (chain: Chain): Promise<number | null> => {
    const props = await fetchGlobalProps(chain);
    const head = props?.head_block_number;
    return typeof head === 'number' ? head : null;
};

export const fetchCustomJsonEvents = async (
    chain: Chain,
    fromBlock: number,
    toBlock: number,
    expectedId?: string
): Promise<CustomJsonEvent[]> => {
    const nodeUrl = getActiveNode(chain);
    const events: CustomJsonEvent[] = [];
    const safeFrom = Math.max(1, Math.floor(fromBlock));
    const safeTo = Math.max(safeFrom, Math.floor(toBlock));

    for (let blockNum = safeFrom; blockNum <= safeTo; blockNum += 1) {
        try {
            const response = await fetch(nodeUrl, {
                method: 'POST',
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'condenser_api.get_ops_in_block',
                    params: [blockNum, false],
                    id: 1
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) continue;
            const json = await response.json();
            const result = Array.isArray(json?.result) ? json.result : [];

            result.forEach((entry: any) => {
                const op = entry?.op;
                if (!Array.isArray(op) || op[0] !== 'custom_json' || !op[1]) return;

                const opData = op[1];
                if (expectedId && opData.id !== expectedId) return;

                let parsedJson: any = opData.json;
                try {
                    parsedJson = typeof opData.json === 'string' ? JSON.parse(opData.json) : opData.json;
                } catch {
                    parsedJson = opData.json;
                }

                events.push({
                    block: blockNum,
                    timestamp: entry?.timestamp || '',
                    trxId: entry?.trx_id || '',
                    account: opData.required_posting_auths?.[0] || opData.required_auths?.[0] || '',
                    requiredAuths: Array.isArray(opData.required_auths) ? opData.required_auths : [],
                    requiredPostingAuths: Array.isArray(opData.required_posting_auths) ? opData.required_posting_auths : [],
                    id: opData.id,
                    json: parsedJson
                });
            });
        } catch (error) {
            console.warn(`Failed to fetch custom_json events for ${chain} block ${blockNum}:`, error);
        }
    }

    return events;
};

export const fetchCustomJsonEventsForAccounts = async (
    chain: Chain,
    usernames: string[],
    expectedId?: string,
    limit: number = 200
): Promise<CustomJsonEvent[]> => {
    const uniqueUsernames = Array.from(new Set((usernames || []).map((name) => name.trim()).filter(Boolean)));
    const activeNode = await getActiveNodeAsync(chain);
    const fallbackNodesByChain: Record<Chain, string[]> = {
        [Chain.HIVE]: HIVE_CANDIDATES,
        [Chain.STEEM]: STEEM_CANDIDATES,
        [Chain.BLURT]: BLURT_CANDIDATES
    };
    const candidateNodes = Array.from(new Set([
        activeNode,
        ...(fallbackNodesByChain[chain] || [])
    ].filter(Boolean)));

    const fetchEventsFromNode = async (node: string): Promise<CustomJsonEvent[]> => {
        const events: CustomJsonEvent[] = [];

        for (const username of uniqueUsernames) {
            try {
                const response = await fetch(node, {
                    method: 'POST',
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'condenser_api.get_account_history',
                        params: [username, -1, limit],
                        id: 1
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) continue;
                const json = await response.json();
                const result = Array.isArray(json?.result) ? json.result : [];

                result.forEach((historyEntry: any) => {
                    const payload = historyEntry?.[1];
                    const op = payload?.op;
                    if (!Array.isArray(op) || op[0] !== 'custom_json' || !op[1]) return;

                    const opData = op[1];
                    if (expectedId && opData.id !== expectedId) return;

                    let parsedJson: any = opData.json;
                    try {
                        parsedJson = typeof opData.json === 'string' ? JSON.parse(opData.json) : opData.json;
                    } catch {
                        parsedJson = opData.json;
                    }

                    events.push({
                        block: payload?.block || 0,
                        timestamp: payload?.timestamp || '',
                        trxId: payload?.trx_id || '',
                        account: opData.required_posting_auths?.[0] || opData.required_auths?.[0] || username,
                        requiredAuths: Array.isArray(opData.required_auths) ? opData.required_auths : [],
                        requiredPostingAuths: Array.isArray(opData.required_posting_auths) ? opData.required_posting_auths : [],
                        id: opData.id,
                        json: parsedJson
                    });
                });
            } catch (error) {
                console.warn(`Failed to fetch custom_json account history for ${chain} @${username} from ${node}:`, error);
            }
        }

        return events;
    };

    let events: CustomJsonEvent[] = [];

    for (const node of candidateNodes) {
        const nodeEvents = await fetchEventsFromNode(node);
        events = [...events, ...nodeEvents];
        if (chain !== Chain.STEEM && nodeEvents.length > 0) {
            break;
        }
    }

    const seen = new Set<string>();
    return events.filter((event) => {
        const key = event.trxId || `${event.block}:${event.account}:${JSON.stringify(event.json)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

export const createUnsignedTransaction = async (
    chain: Chain,
    operations: any[],
    expiration?: string
): Promise<any> => {
    const props = await fetchGlobalProps(chain);
    if (!props) throw new Error(`Could not fetch global properties for ${chain}`);

    const cleanOperations = normalizeOperations(operations);
    return {
        ref_block_num: props.head_block_number & 0xFFFF,
        ref_block_prefix: Buffer.from(props.head_block_id, 'hex').readUInt32LE(4),
        expiration: normalizeBlockchainExpiration(expiration),
        operations: cleanOperations,
        extensions: []
    };
};

export const signTransactionEnvelope = async (
    chain: Chain,
    transaction: any,
    key: string,
    username: string
): Promise<{ success: boolean; signedTx?: any; publicKey?: string; signature?: string; username?: string; error?: string }> => {
    try {
        let signedTx: any;
        const cleanKey = key.trim();
        const config = getChainConfig(chain);
        const baseKey = HivePrivateKey.fromString(cleanKey);
        let publicKey = baseKey.createPublic().toString();
        if (config.addressPrefix !== 'STM' && publicKey.startsWith('STM')) {
            publicKey = config.addressPrefix + publicKey.substring(3);
        }

        if (chain === Chain.HIVE) {
            signedTx = cryptoUtils.signTransaction(transaction, [baseKey]);
        } else if (chain === Chain.STEEM) {
            signedTx = steemCryptoUtils.signTransaction(transaction, SteemPrivateKey.fromString(cleanKey));
        } else if (chain === Chain.BLURT) {
            blurt.config.set('address_prefix', config.addressPrefix);
            blurt.config.set('chain_id', config.chainId);

            try {
                const txWithBlurt = {
                    ...transaction,
                    operations: convertAssetSymbolRecursively(transaction.operations, 'STEEM', 'BLURT')
                };
                signedTx = blurt.auth.signTransaction(txWithBlurt, [cleanKey]);
            } catch (error: any) {
                if (error?.message && (error.message.includes('Invalid asset symbol') || error.message.includes('Unable to serialize'))) {
                    const txWithSteem = {
                        ...transaction,
                        operations: convertAssetSymbolRecursively(transaction.operations, 'BLURT', 'STEEM')
                    };
                    signedTx = blurt.auth.signTransaction(txWithSteem, [cleanKey]);
                    signedTx = JSON.parse(JSON.stringify(signedTx));
                    signedTx.operations = convertAssetSymbolRecursively(signedTx.operations, 'STEEM', 'BLURT');
                } else {
                    throw error;
                }
            }
        } else {
            throw new Error('Chain not supported');
        }

        const signatures = signedTx?.signatures || [];
        return {
            success: true,
            signedTx,
            publicKey,
            signature: signatures[signatures.length - 1],
            username
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || 'Failed to sign transaction'
        };
    }
};

export const broadcastSignedTransaction = async (
    chain: Chain,
    signedTransaction: any
): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any; signatures?: string[]; transaction?: any; signedTx?: any }> => {
    try {
        const normalizedTransaction = {
            ...signedTransaction,
            expiration: normalizeBlockchainExpiration(signedTransaction?.expiration)
        };
        const nodeUrl = getActiveNode(chain);
        if (chain === Chain.HIVE) {
            const response = await fetch(nodeUrl, {
                method: 'POST',
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'condenser_api.broadcast_transaction_synchronous',
                    params: [normalizedTransaction],
                    id: 1
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Node ${nodeUrl} returned HTTP ${response.status}`);
            const json = await parseJsonResponse(response, nodeUrl);
            if (json.error) throw new Error(json.error.message || JSON.stringify(json.error));
            return {
                success: true,
                txId: json.result?.id,
                opResult: json.result,
                signatures: normalizedTransaction.signatures,
                transaction: normalizedTransaction,
                signedTx: normalizedTransaction
            };
        }

        if (chain === Chain.STEEM) {
            const client = new SteemClient(nodeUrl);
            const result = await client.broadcast.send(normalizedTransaction);
            return {
                success: true,
                txId: result.id,
                opResult: result,
                signatures: normalizedTransaction.signatures,
                transaction: normalizedTransaction,
                signedTx: normalizedTransaction
            };
        }

        if (chain === Chain.BLURT) {
            const response = await fetch(nodeUrl, {
                method: 'POST',
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'condenser_api.broadcast_transaction_synchronous',
                    params: [normalizedTransaction],
                    id: 1
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();
            if (json.error) throw new Error(json.error.message || JSON.stringify(json.error));
            return {
                success: true,
                txId: json.result?.id,
                opResult: json.result,
                signatures: normalizedTransaction.signatures,
                transaction: normalizedTransaction,
                signedTx: normalizedTransaction
            };
        }

        throw new Error('Chain not supported');
    } catch (error: any) {
        return { success: false, error: error?.message || 'Broadcast failed' };
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
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
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

export const getAccountAuthorities = async (chain: Chain, username: string, type: 'active' | 'posting' = 'active'): Promise<MultiSigAuthority | null> => {
    try {
        const accountData = await fetchAccountData(chain, username);
        if (!accountData) return null;

        const auth = type === 'active' ? accountData.active : accountData.posting;
        return {
            threshold: auth.weight_threshold,
            keyAuths: auth.key_auths,
            accountAuths: auth.account_auths
        };
    } catch (e) {
        console.error('Failed to fetch authorities:', e);
        return null;
    }
};

/** Public key for a WIF, or null if the WIF is unusable on this chain. */
export const derivePublicKey = (chain: Chain, key: string): string | null => {
    try {
        if (chain === Chain.BLURT) return blurt.auth.wifToPublic(key);
        const prefix = getChainConfig(chain).addressPrefix;
        if (chain === Chain.HIVE) return HivePrivateKey.fromString(key).createPublic(prefix).toString();
        if (chain === Chain.STEEM) return SteemPrivateKey.fromString(key).createPublic(prefix).toString();
    } catch {
        return null;
    }
    return null;
};

/** The account whose authority the node is checking for these operations. */
const getAuthorizingAccount = (operations: any[]): string | null => {
    for (const op of operations || []) {
        const data = Array.isArray(op) ? op[1] : op;
        if (!data || typeof data !== 'object') continue;
        // voter before author: a `vote` carries both, and the signer is the voter.
        // Reading author first blamed the post's author, telling the user to
        // re-import a key for somebody else's account.
        const name =
            data.required_posting_auths?.[0] ||
            data.required_auths?.[0] ||
            data.voter || data.author || data.from || data.account;
        if (typeof name === 'string' && name) return name;
    }
    return null;
};

/**
 * The node rejected the signature. Say why in terms the user can act on: usually
 * the stored key simply is not the one the account's authority lists (a rotated
 * key), which the raw "missing required posting authority" never makes obvious.
 */
const diagnoseAuthorityFailure = async (chain: Chain, key: string, operations: any[]): Promise<string | null> => {
    const username = getAuthorizingAccount(operations);
    const publicKey = derivePublicKey(chain, key);
    if (!username || !publicKey) return null;

    const type = requiresActiveAuthority(operations) ? 'active' : 'posting';
    const auth = await getAccountAuthorities(chain, username, type);
    if (!auth) return null;

    const label = type === 'active' ? 'Active' : 'Posting';
    const onChainKeys = (auth.keyAuths || []).map((entry: any) => entry[0]);

    if (!onChainKeys.includes(publicKey)) {
        // The authority needed comes from the operations, but the key that signed is
        // whatever the caller passed. Those can disagree — a dApp may explicitly ask
        // for Active on a posting operation — and reporting "your Posting key is
        // wrong" about an Active key is both false and unactionable. Check the other
        // authority before blaming the key.
        const otherType = type === 'active' ? 'posting' : 'active';
        const otherAuth = await getAccountAuthorities(chain, username, otherType);
        if ((otherAuth?.keyAuths || []).some((entry: any) => entry[0] === publicKey)) {
            const otherLabel = otherType === 'active' ? 'Active' : 'Posting';
            return `This operation needs the ${label} authority of @${username}, but the wallet signed it ` +
                `with that account's ${otherLabel} key (${publicKey}). Import the ${label} key for @${username}.`;
        }

        return `The ${label} key stored for @${username} is not the one this account uses on ${chain}. ` +
            `The wallet signed with ${publicKey}, but the account's ${type} authority is ${onChainKeys.join(', ') || 'empty'}. ` +
            `Re-import the current ${label} key for @${username}.`;
    }

    if ((auth.threshold || 1) > 1 || (auth.accountAuths || []).length > 0) {
        return `@${username} needs more than one signature for this operation (${label} threshold ${auth.threshold}).`;
    }

    // The key IS the account's key and the node still refused the signature. Say so
    // loudly rather than falling back to a generic message that blames the key.
    return `The node rejected the signature even though the ${label} key stored for @${username} (${publicKey}) ` +
        `is the one its ${type} authority lists. The signed bytes did not match what the node verified. ` +
        `Operations: ${(operations || []).map((op: any) => (Array.isArray(op) ? op[0] : op?.type)).join(', ')}.`;
};

export const calculateThresholdProgress = (auth: MultiSigAuthority, signatures: any[]): MultisigProgress => {
    let currentWeight = 0;
    const seenSigners = new Set<string>();

    (signatures || []).forEach(sig => {
        if (!sig?.signature) return;

        const signerId = sig.username || sig.pubKey || sig.signature;
        if (seenSigners.has(signerId)) return;
        seenSigners.add(signerId);

        currentWeight += getSignatureWeight(auth, sig);
    });

    return {
        currentWeight,
        threshold: auth.threshold,
        canBroadcast: currentWeight >= auth.threshold
    };
};

export const selectBroadcastSignatures = (
    auth: MultiSigAuthority,
    signatures: PartialTransactionSignature[]
): PartialTransactionSignature[] => {
    const remaining = [...(signatures || [])]
        .filter((sig) => !!sig?.signature)
        .sort((left, right) => getSignatureWeight(auth, right) - getSignatureWeight(auth, left));

    const selected: PartialTransactionSignature[] = [];
    const usedSigners = new Set<string>();
    let currentWeight = 0;

    for (const sig of remaining) {
        const signerId = sig.username || sig.pubKey || sig.signature;
        if (usedSigners.has(signerId)) continue;

        const weight = getSignatureWeight(auth, sig);
        if (weight <= 0) continue;

        selected.push(sig);
        usedSigners.add(signerId);
        currentWeight += weight;

        if (currentWeight >= auth.threshold) break;
    }

    return selected;
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
            return { success: true, txId: result.id, opResult: result };
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
            return { success: true, txId: result.id, opResult: result };
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
            return { success: true, txId: result.id, opResult: result };
        } else if (chain === Chain.BLURT) {
            const vote = ['vote', { voter, author, permlink, weight }];
            const result = await broadcastOperations(Chain.BLURT, key, [vote]);
            if (!result.success) throw new Error(result.error || "Vote failed");
            return result;
        }
        return { success: false, error: "Chain not supported" };
    } catch (e: any) {
        const errorMsg = e.message || (typeof e === 'string' ? e : "Vote failed");
        return { success: false, error: errorMsg };
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
            return { success: true, txId: result.id, opResult: result };
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
            return { success: true, txId: result.id, opResult: result };
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
    if (msg.includes('balance >= fee')) {
        return "Insufficient funds to pay transaction fee (Blurt fees depend on message size).";
    }
    if (msg.includes('sufficient funds')) {
        return "Insufficient funds. You do not have enough balance for this operation.";
    }

    // Handle other common errors
    if (msg.includes('balance')) return "Insufficient balance for this operation.";
    if (msg.includes('posting authority')) return "Missing required posting authority. Check the Posting key imported for this account.";
    if (msg.includes('authority')) return "Missing required authority. Check the keys imported for this account.";

    // Handle Blurt specific assertion errors
    if (msg.includes('Assert Exception') && msg.includes("doesn't exist")) {
        return "Blockchain error: Account or data not found on the current node. Try switching RPC nodes.";
    }

    if (msg.includes('comment_is_required') || (msg.includes('Assert Exception') && msg.includes('comment'))) {
        return "Comment or post not found. If you just created it, please wait a few seconds for blockchain synchronization and try again.";
    }

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
            'Content-Type': 'application/json'
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
            'Content-Type': 'application/json'
        }
    });

    const broadcastResult = await broadcastResponse.json();
    if (broadcastResult.error) {
        console.error("FULL RPC ERROR:", JSON.stringify(broadcastResult.error, null, 2));

        // Enhance error message
        const err = broadcastResult.error;
        let msg = err.message || JSON.stringify(err);
        const rawData = err.data ? JSON.stringify(err.data) : '';

        // Translate obscure node errors to user-friendly messages
        if (msg.includes('unknown key')) {
            if (rawData.includes('"method":"get_comment"')) {
                msg = "Parent post or comment not found on the node. The reply target may be invalid or not yet available on this RPC node.";
            } else {
                msg = "Unknown key or missing blockchain object in node response.";
            }
        }

        throw new Error(`${msg} ${rawData}`);
    }

    return {
        ...broadcastResult.result,
        signatures: signedTx.signatures,
        signedTx,
        transaction: signedTx
    };
};

export const broadcastOperations = async (
    chain: Chain,
    activeKey: string,
    operations: any[]
): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any; signatures?: string[]; transaction?: any; signedTx?: any }> => {
    const nodeUrl = getActiveNode(chain);
    console.log('[BroadcastOps] Chain:', chain, 'NodeUrl:', nodeUrl, 'Operations:', operations);

    // 1. ROBUST NORMALIZATION: Handle both array [name, data] and object { type, ... }
    // Some dApps (like blurt.blog) send operations as objects inside requestBroadcast
    const cleanOperations = normalizeOperations(operations);

    // 3. Get fallback nodes for retry (prioritized by reliability)
    const getFallbackNodes = (chain: Chain): string[] => {
        const nodes: Record<Chain, string[]> = {
            [Chain.HIVE]: ['https://api.deathwing.me', 'https://techcoderx.com', 'https://rpc.mahdiyari.info', 'https://hive-api.3speak.tv'],
            [Chain.STEEM]: ['https://api.steemit.com', 'https://api.steem.fans', 'https://api.justyy.com'],
            [Chain.BLURT]: ['https://rpc.drakernoise.com', 'https://api.blurt.blog', 'https://blurt-rpc.saboin.com', 'https://rpc.mahdiyari.info']
        };
        return nodes[chain] || [];
    };

    // Check if an error is an authority/key error (don't retry these)
    const isAuthorityError = (errorMsg: string): boolean => {
        const authorityPatterns = [
            'missing required active authority',
            'missing required posting authority',
            'Missing Active Authority',
            'Missing Posting Authority',
            'check_authority',
            'Invalid key',
            'Key not found'
        ];
        return authorityPatterns.some(p => errorMsg.toLowerCase().includes(p.toLowerCase()));
    };

    const tryBroadcast = async (node: string): Promise<any> => {
        if (chain === Chain.HIVE) {
            return await broadcastHiveTransaction(node, cleanOperations, activeKey);
        } else if (chain === Chain.STEEM) {
            const client = new SteemClient(node);
            const key = SteemPrivateKey.fromString(activeKey);
            return await client.broadcast.sendOperations(cleanOperations, key);
        } else if (chain === Chain.BLURT) {
            return await broadcastBlurtTransaction(node, cleanOperations, activeKey);
        }
        throw new Error("Chain not supported");
    };

    // Try primary node first, then fallbacks
    const nodesToTry = [nodeUrl, ...getFallbackNodes(chain).filter(n => n !== nodeUrl)];
    let lastError: any = null;

    for (const node of nodesToTry) {
        try {
            console.log('[BroadcastOps] Trying node:', node);
            const result = await tryBroadcast(node);
            console.log('[BroadcastOps] Success with node:', node);
            return {
                success: true,
                txId: result.id,
                opResult: result,
                signatures: result.signatures,
                transaction: result.transaction || result.signedTx,
                signedTx: result.signedTx
            };
        } catch (e: any) {
            const errMsg = e.message || String(e);
            console.warn('[BroadcastOps] Node failed:', node, errMsg);

            // If it's an authority error, don't retry - it will fail on all nodes.
            // Explain which key was actually used instead of the node's opaque message.
            if (isAuthorityError(errMsg)) {
                const diagnosis = await diagnoseAuthorityFailure(chain, activeKey, cleanOperations);
                if (diagnosis) {
                    console.error('[BroadcastOps] Authority failure:', diagnosis);
                    return { success: false, error: diagnosis };
                }
                lastError = e;
                break;
            }

            // BLURT SPECIFIC: retry "comment not found" errors on DIFFERENT nodes
            // This often happens if the dApp tries to vote immediately after posting
            if (chain === Chain.BLURT && (errMsg.includes('comment_is_required') || errMsg.includes('comment'))) {
                console.log('[BroadcastOps] Blurt sync issue detected, waiting 2s before retry on next node...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                lastError = e;
                continue;
            }

            // Skip nodes returning HTML (Cloudflare errors, maintenance pages)
            if (errMsg.includes('Unexpected token') && errMsg.includes('<')) {
                console.warn('[BroadcastOps] Node returned HTML, skipping:', node);
            }

            lastError = e;
        }
    }

    console.error("Broadcast Ops Error:", lastError);

    return { success: false, error: formatChainError(lastError) };
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
                'Content-Type': 'application/json'
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
export const broadcastWitnessVote = async (chain: Chain, username: string, activeKey: string, witness: string, approve: boolean): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    const op: any = ['account_witness_vote', {
        account: username,
        witness: witness,
        approve: approve
    }];
    return broadcastOperations(chain, activeKey, [op]);
};

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
    type: 'send' | 'receive' | 'powerup_in' | 'powerup_out' | 'powerdown' | 'delegate_out' | 'delegate_in' | 'undelegate_out' | 'rc_delegate_out' | 'rc_delegate_in' | 'savings_in' | 'savings_out' | 'savings_cancel' | 'reward' | 'producer_reward';
    txId: string;
}

export const getHistoryItemKey = (item: HistoryItem): string => [
    item.txId || '',
    item.date || '',
    item.type || '',
    item.from || '',
    item.to || '',
    item.amount || '',
    item.memo || ''
].join('|');

interface FetchAccountHistoryOptions {
    incremental?: boolean;
    knownItemKeys?: string[];
    maxPages?: number;
    /** Aborts the whole walk when the caller goes away (popup closing, unmount). */
    signal?: AbortSignal;
    /** Per-request ceiling so one silent node cannot stall the node loop. */
    requestTimeoutMs?: number;
}

const HISTORY_REQUEST_TIMEOUT_MS = 15000;

/**
 * A node that accepts the connection and never answers used to block the walk until
 * Chrome's own network timeout, so every request gets its own deadline. The caller's
 * signal is folded in so an unmount stops the walk instead of orphaning it.
 *
 * Abort reasons stay distinguishable on purpose: TimeoutError means the node is at
 * fault and we should fail over, AbortError means the caller left and we should stop.
 */
const createRequestSignal = (external?: AbortSignal) => {
    const controller = new AbortController();
    const onExternalAbort = () => controller.abort(external?.reason);

    if (external) {
        if (external.aborted) controller.abort(external.reason);
        else external.addEventListener('abort', onExternalAbort, { once: true });
    }

    const timer = setTimeout(
        () => controller.abort(new DOMException('History request timed out', 'TimeoutError')),
        HISTORY_REQUEST_TIMEOUT_MS
    );

    return {
        signal: controller.signal,
        cleanup: () => {
            clearTimeout(timer);
            external?.removeEventListener('abort', onExternalAbort);
        }
    };
};

export const mergeHistoryItems = (existing: HistoryItem[], incoming: HistoryItem[]): HistoryItem[] => {
    const byKey = new Map<string, HistoryItem>();
    [...incoming, ...existing].forEach((item) => {
        byKey.set(getHistoryItemKey(item), item);
    });

    return Array.from(byKey.values())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 250);
};

export const fetchAccountHistory = async (chain: Chain, username: string, options: FetchAccountHistoryOptions = {}): Promise<HistoryItem[]> => {
    const node = await getActiveNodeAsync(chain);
    const maxVisibleItems = 50;
    const minRelevantItems = maxVisibleItems;
    const knownItemKeys = new Set(options.knownItemKeys || []);
    const normalizeHistoryEntries = (raw: any): any[] => {
        if (Array.isArray(raw)) return raw;
        if (Array.isArray(raw?.history)) return raw.history;
        if (Array.isArray(raw?.result)) return raw.result;
        if (Array.isArray(raw?.result?.history)) return raw.result.history;
        return [];
    };
    const normalizeOp = (op: any): [string, any] | null => {
        if (Array.isArray(op)) return [op[0], op[1] || {}];
        if (op && typeof op === 'object') {
            const rawType = op.type || op.operation || op.name;
            const type = typeof rawType === 'string' ? rawType.replace(/_operation$/, '') : '';
            return type ? [type, op.value || op.data || op] : null;
        }
        return null;
    };
    const processOp = (op: any, timestamp: string, trx_id: string): HistoryItem | null => {
        const normalizedOp = normalizeOp(op);
        if (!normalizedOp) return null;
        const [type, data] = normalizedOp;
        const compactAmounts = (...amounts: any[]) => amounts
            .filter((amount) => amount && !String(amount).startsWith('0.000 '))
            .map(String)
            .join(' + ');

        if (type === 'transfer') {
            if (data.from === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: data.memo, type: 'send', txId: trx_id };
            if (data.to === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: data.memo, type: 'receive', txId: trx_id };
        }
        if (type === 'transfer_to_savings' || type === 'transfer_from_savings') {
            const memo = type === 'transfer_to_savings' ? 'Transfer to Savings' : 'Transfer from Savings';
            if (data.from === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo, type: 'savings_out', txId: trx_id };
            if (data.to === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo, type: 'savings_in', txId: trx_id };
        }
        if (type === 'cancel_transfer_from_savings' && data.account === username) {
            return {
                date: timestamp,
                from: data.account,
                to: 'SAVINGS',
                amount: data.amount || '',
                memo: `Cancel Savings Transfer${data.request_id !== undefined ? ` #${data.request_id}` : ''}`,
                type: 'savings_cancel',
                txId: trx_id
            };
        }
        if (type === 'transfer_to_vesting') {
            if (data.from === username && data.to === username) return { date: timestamp, from: data.from, to: 'VESTING', amount: data.amount, memo: 'Power Up (Self)', type: 'powerup_out', txId: trx_id };
            if (data.from === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: 'Power Up', type: 'powerup_out', txId: trx_id };
            if (data.to === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: 'Power Up Received', type: 'powerup_in', txId: trx_id };
        }
        if (type === 'withdraw_vesting') {
            if (data.account === username) return { date: timestamp, from: data.account, to: 'LIQUID', amount: data.vesting_shares, memo: 'Power Down', type: 'powerdown', txId: trx_id };
        }
        if (type === 'fill_vesting_withdraw') {
            if (data.from_account === username) return { date: timestamp, from: data.from_account, to: data.to_account, amount: data.deposited || data.withdrawn, memo: 'Power Down Payment', type: 'powerdown', txId: trx_id };
            if (data.to_account === username) return { date: timestamp, from: data.from_account, to: data.to_account, amount: data.deposited || data.withdrawn, memo: 'Power Down Received', type: 'powerup_in', txId: trx_id };
        }
        if (type === 'delegate_vesting_shares') {
            const vestingShares = data.vesting_shares || '0.000000 VESTS';
            const isUndelegate = String(vestingShares).startsWith('0.000000');
            if (data.delegator === username) {
                return {
                    date: timestamp,
                    from: data.delegator,
                    to: data.delegatee,
                    amount: vestingShares,
                    memo: isUndelegate ? 'Undelegate Power' : 'Delegate Power',
                    type: isUndelegate ? 'undelegate_out' : 'delegate_out',
                    txId: trx_id
                };
            }
            if (!isUndelegate && data.delegatee === username) {
                return {
                    date: timestamp,
                    from: data.delegator,
                    to: data.delegatee,
                    amount: vestingShares,
                    memo: 'Power Delegation Received',
                    type: 'delegate_in',
                    txId: trx_id
                };
            }
        }
        if (type === 'return_vesting_delegation' && data.account === username) {
            return {
                date: timestamp,
                from: 'VESTING',
                to: data.account,
                amount: data.vesting_shares,
                memo: 'Delegation Returned',
                type: 'undelegate_out',
                txId: trx_id
            };
        }
        if (type === 'delegate_rc') {
            const amount = data.max_rc !== undefined ? String(data.max_rc) : '';
            if (data.from === username) {
                return {
                    date: timestamp,
                    from: data.from,
                    to: Array.isArray(data.delegatees) ? data.delegatees.join(', ') : '',
                    amount,
                    memo: amount === '0' ? 'RC Delegation Removed' : 'RC Delegation',
                    type: 'rc_delegate_out',
                    txId: trx_id
                };
            }
            if (Array.isArray(data.delegatees) && data.delegatees.includes(username)) {
                return {
                    date: timestamp,
                    from: data.from,
                    to: username,
                    amount,
                    memo: 'RC Delegation Received',
                    type: 'rc_delegate_in',
                    txId: trx_id
                };
            }
        }
        if (type === 'claim_reward_balance' && data.account === username) {
            return {
                date: timestamp,
                from: 'rewards',
                to: data.account,
                amount: compactAmounts(data.reward_blurt, data.reward_hive, data.reward_steem, data.reward_hbd, data.reward_sbd, data.reward_vests),
                memo: 'Claim Rewards',
                type: 'reward',
                txId: trx_id
            };
        }
        if (type === 'curation_reward' && data.curator === username) {
            return { date: timestamp, from: 'rewards', to: data.curator, amount: data.reward, memo: 'Curation Reward', type: 'reward', txId: trx_id };
        }
        if ((type === 'author_reward' || type === 'comment_reward') && data.author === username) {
            return {
                date: timestamp,
                from: 'rewards',
                to: data.author,
                amount: compactAmounts(data.blurt_payout, data.hive_payout, data.steem_payout, data.hbd_payout, data.sbd_payout, data.vesting_payout),
                memo: 'Author Reward',
                type: 'reward',
                txId: trx_id
            };
        }
        if (type === 'comment_benefactor_reward' && data.benefactor === username) {
            return { date: timestamp, from: 'rewards', to: data.benefactor, amount: data.reward, memo: 'Benefactor Reward', type: 'reward', txId: trx_id };
        }
        if (type === 'producer_reward' && data.producer === username) {
            return {
                date: timestamp,
                from: 'network',
                to: data.producer,
                amount: data.vesting_shares,
                memo: 'Producer Reward',
                type: 'producer_reward',
                txId: trx_id
            };
        }
        return null;
    };

    const selectVisibleHistory = (allHistory: HistoryItem[]) => {
        const relevantHistory = allHistory.filter((item) => item.type !== 'reward' && item.type !== 'producer_reward');
        if (relevantHistory.length > 0) {
            return relevantHistory.slice(0, maxVisibleItems);
        }

        return allHistory.slice(0, maxVisibleItems);
    };

    const buildHistoryItems = (rawHistory: any) => {
        const entries = normalizeHistoryEntries(rawHistory);
        return entries
            .map((h: any) => processOp(h[1]?.op, h[1]?.timestamp, h[1]?.trx_id || h[1]?.trxId || ''))
            .filter((h: HistoryItem | null): h is HistoryItem => h !== null)
            .reverse();
    };

    const processHistoryEntries = (rawHistory: any) => {
        const allHistory = buildHistoryItems(rawHistory);
        if (options.incremental && knownItemKeys.size > 0) {
            return allHistory.filter((item) => !knownItemKeys.has(getHistoryItemKey(item)));
        }
        return selectVisibleHistory(allHistory);
    };

    const getCandidateNodes = () => {
        const candidates: Record<Chain, string[]> = {
            [Chain.HIVE]: HIVE_CANDIDATES,
            [Chain.STEEM]: STEEM_CANDIDATES,
            [Chain.BLURT]: BLURT_CANDIDATES
        };
        return [node, ...candidates[chain].filter((candidate) => candidate !== node)];
    };

    const fetchHistoryPage = async (rpcNode: string, from: number, limit: number) => {
        const { signal, cleanup } = createRequestSignal(options.signal);
        try {
            const response = await fetch(rpcNode, {
                method: 'POST',
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'condenser_api.get_account_history',
                    params: [username, from, limit],
                    id: 1
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                signal
            });
            if (response.status === 429) throw new Error(`Node ${rpcNode} rate limited history requests`);
            if (!response.ok) throw new Error(`Node ${rpcNode} returned HTTP ${response.status}`);
            const json = await response.json();
            if (json.error) throw new Error(json.error.message || JSON.stringify(json.error));
            return normalizeHistoryEntries(json);
        } finally {
            cleanup();
        }
    };

    try {
        const collected: any[] = [];
        const pageSize = 100;
        const maxPages = options.maxPages || (options.incremental ? 5 : chain === Chain.BLURT ? 200 : chain === Chain.HIVE ? 120 : 80);

        for (const rpcNode of getCandidateNodes()) {
            let from = -1;
            collected.length = 0;

            try {
                for (let page = 0; page < maxPages; page += 1) {
                    const pageEntries = await fetchHistoryPage(rpcNode, from, pageSize);
                    if (pageEntries.length === 0) break;

                    collected.unshift(...pageEntries);
                    const allItems = buildHistoryItems(collected);
                    const reachedKnownItem = options.incremental && knownItemKeys.size > 0 && allItems.some((item) => knownItemKeys.has(getHistoryItemKey(item)));
                    if (reachedKnownItem) {
                        return allItems.filter((item) => !knownItemKeys.has(getHistoryItemKey(item)));
                    }

                    const hasEnoughRelevantItems = allItems.filter((item) => item.type !== 'reward' && item.type !== 'producer_reward').length >= minRelevantItems;
                    const oldestIndex = Number(pageEntries[0]?.[0]);

                    if (hasEnoughRelevantItems || !Number.isFinite(oldestIndex) || oldestIndex <= 0) {
                        return selectVisibleHistory(allItems);
                    }

                    from = oldestIndex - 1;
                }
            } catch (nodeError) {
                // The caller went away (popup closed, component unmounted). The node is
                // innocent, and there is nobody left to hand results to, so stop instead
                // of blaming it and walking the remaining candidates for nothing.
                if (options.signal?.aborted) throw nodeError;
                console.warn(`History node failed for ${chain} at ${rpcNode}:`, nodeError);
                continue;
            }

            const parsed = processHistoryEntries(collected);
            if (parsed.length > 0) return parsed;
        }
    } catch (e) {
        // Let an abort surface so the caller can tell "you cancelled me" apart from
        // "every node failed" and skip writing a bogus error into its cache.
        if (options.signal?.aborted) throw e;
        console.error("Fetch History Error:", e);
    }
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

export const encodeMemo = async (chain: Chain, _username: string, receiver: string, memo: string, key: string): Promise<string> => {
    try {
        if (chain === Chain.HIVE || chain === Chain.STEEM) {
            const privateKey = HivePrivateKey.fromString(key);
            // In Hive/Sttem, if the memo doesn't start with #, it's not encrypted
            if (!memo.startsWith('#')) memo = '#' + memo;
            
            // To encode, we need the receiver's memo key. 
            // For simplicity in this provider, we assume the dApp might have provided it 
            // OR we'anak fetch it. But standard WhaleVault expects the provider to handle it.
            const receiverData = await fetchAccountData(chain, receiver);
            if (!receiverData) throw new Error("Receiver account not found");
            const receiverMemoKey = receiverData.memo_key;
            
            return HiveMemo.encode(privateKey, receiverMemoKey, memo);
        } else if (chain === Chain.BLURT) {
            const config = getChainConfig(Chain.BLURT);
            blurt.config.set('address_prefix', config.addressPrefix);
            
            const receiverData = await fetchAccountData(chain, receiver);
            if (!receiverData) throw new Error("Receiver account not found");
            
            return blurt.memo.encode(key, receiverData.memo_key, memo);
        }
        throw new Error("Chain not supported for memo encoding");
    } catch (e: any) {
        console.error("Encode memo error:", e);
        throw e;
    }
};

export const decodeMemo = async (chain: Chain, _username: string, encodedMemo: string, key: string): Promise<string> => {
    try {
        if (chain === Chain.HIVE || chain === Chain.STEEM) {
            const privateKey = HivePrivateKey.fromString(key);
            return HiveMemo.decode(privateKey, encodedMemo);
        } else if (chain === Chain.BLURT) {
            const config = getChainConfig(Chain.BLURT);
            blurt.config.set('address_prefix', config.addressPrefix);
            return blurt.memo.decode(key, encodedMemo);
        }
        throw new Error("Chain not supported for memo decoding");
    } catch (e: any) {
        console.error("Decode memo error:", e);
        throw e;
    }
};
