import { Chain } from '../types';
import { PrivateKey as HivePrivateKey, cryptoUtils } from '@hiveio/dhive';
import { Client as SteemClient, PrivateKey as SteemPrivateKey } from 'dsteem';
// @ts-ignore
import blurt from '@blurtfoundation/blurtjs';
import { getActiveNode } from './nodeService';
import { getChainConfig } from '../config/chainConfig';

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
// This bypasses 'dhive' networking to avoid "WorkerGlobalScope: Illegal invocation" errors.
// It performs standard Hive RPC calls using native fetch.
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
        headers: { 'Content-Type': 'application/json' }
    });
    const propsJson = await propsResponse.json();
    if (!propsJson.result) throw new Error("Failed to fetch props from " + nodeUrl);
    const props = propsJson.result;

    // 2. Prepare Transaction Data
    const ref_block_num = props.head_block_number & 0xFFFF;

    // BROWSER-COMPATIBLE: Use Uint8Array + DataView instead of Buffer
    // Buffer.from() is not available in browser/Service Worker environments
    const hexBytes = props.head_block_id.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16));
    const blockIdBuffer = new Uint8Array(hexBytes);
    const dataView = new DataView(blockIdBuffer.buffer);
    const ref_block_prefix = dataView.getUint32(4, true); // true = little-endian
    // 1 min expiration is standard for interactive signing
    const expiration = new Date(Date.now() + 60 * 1000).toISOString().slice(0, -5);

    const tx = {
        ref_block_num,
        ref_block_prefix,
        expiration,
        operations,
        extensions: []
    };

    // 3. Sign with HF26-compatible serialization
    // Hive mainnet chain ID (required for HF26+)
    const HIVE_CHAIN_ID = 'beeab0de00000000000000000000000000000000000000000000000000000000';
    const privateKey = HivePrivateKey.fromString(key);

    // BROWSER-COMPATIBLE: Convert chainId hex string to Uint8Array, then to Buffer
    // dhive includes a Buffer polyfill, so Buffer.from() works in the browser
    const chainIdHexBytes = HIVE_CHAIN_ID.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16));
    const chainIdUint8 = new Uint8Array(chainIdHexBytes);
    const chainIdBuffer = Buffer.from(chainIdUint8);

    // Use signTransaction with explicit chain ID for HF26 compatibility
    const signedTx = cryptoUtils.signTransaction(tx, [privateKey], chainIdBuffer);

    // 4. Broadcast Synchronous
    const broadcastResponse = await fetch(nodeUrl, {
        method: 'POST',
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'condenser_api.broadcast_transaction_synchronous',
            params: [signedTx],
            id: 1
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    const broadcastResult = await broadcastResponse.json();
    if (broadcastResult.error) {
        throw new Error(broadcastResult.error.message || JSON.stringify(broadcastResult.error));
    }

    return broadcastResult.result; // Returns { id: "txid", block_num: 123, ... }
};



// --- HELPER: Manual Fetch for BLURT ---
// CRITICAL FIX: @blurtfoundation/blurtjs doesn't work in the browser (not packaged as ES6 module)
// WORKAROUND: Use dhive to sign with STEEM symbol, then replace with BLURT after signing
// This works because STEEM and BLURT both have 3 decimals (identical serialization)
const broadcastBlurtTransaction = async (nodeUrl: string, operations: any[], key: string): Promise<any> => {
    // IMPORT SAFETY: Ensure we get the correct 'blurt' instance from CommonJS bundle
    // @ts-ignore
    const blurtInstance = blurt.default || blurt;

    // Configure Blurt globally - FORCE set before every transaction to avoid stale state
    const BLURT_CHAIN_ID = 'cd8d90f29ae273abec3eaa7731e25934c63eb654d55080caff2ebb7f5df6381f';
    const BLURT_PREFIX = 'BLT';

    // DEBUG: Check environment
    console.log('[Blurt] Environment:', {
        hasBuffer: typeof Buffer !== 'undefined',
        hasWindow: typeof window !== 'undefined',
        blurtConfigChainId: blurtInstance.config.get('chain_id')
    });

    // Ensure config is set on the instance
    blurtInstance.config.set('address_prefix', BLURT_PREFIX);
    blurtInstance.config.set('chain_id', BLURT_CHAIN_ID);

    // DEBUG: Verify config was set
    const currentChainId = blurtInstance.config.get('chain_id');

    if (currentChainId !== BLURT_CHAIN_ID) {
        console.warn('[Blurt] WARNING: Chain ID mismatch! Forcing config set again.');
        blurtInstance.config.set('chain_id', BLURT_CHAIN_ID);
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
        headers: { 'Content-Type': 'application/json' }
    });
    const propsJson = await propsResponse.json();
    if (!propsJson.result) throw new Error("Failed to fetch props from " + nodeUrl);
    const props = propsJson.result;

    // 2. Prepare Transaction Data
    const ref_block_num = props.head_block_number & 0xFFFF;

    // BROWSER-COMPATIBLE: Use Uint8Array + DataView instead of Buffer
    const hexBytes = props.head_block_id.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16));
    const blockIdBuffer = new Uint8Array(hexBytes);
    const dataView = new DataView(blockIdBuffer.buffer);
    const ref_block_prefix = dataView.getUint32(4, true); // true = little-endian

    // 1 min expiration - ensure strict format
    // some nodes are picky about the Z or milliseconds, but standard ISO slice is usually safe.
    const expiration = new Date(Date.now() + 60 * 1000).toISOString().slice(0, -5);

    const tx = {
        ref_block_num,
        ref_block_prefix,
        expiration,
        operations,
        extensions: []
    };

    // CRITICAL FIX: Sanitize operations to ensure no JSON-serialized Buffers remain
    // This matches the logic from signMessage that resolved previous serialization issues
    const sanitizeValue = (value: any): any => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if (parsed && parsed.type === 'Buffer' && Array.isArray(parsed.data)) {
                    return Buffer.from(parsed.data).toString('utf-8'); // Or 'hex' if preferred, but usually string
                }
            } catch (e) {
                // Not JSON
            }
        }
        if (typeof value === 'object' && value !== null) {
            if (value.type === 'Buffer' && Array.isArray(value.data)) {
                return Buffer.from(value.data);
            }
            if (Array.isArray(value)) {
                return value.map(sanitizeValue);
            }
            const cleanObj: any = {};
            for (const k in value) {
                cleanObj[k] = sanitizeValue(value[k]);
            }
            return cleanObj;
        }
        return value;
    };

    tx.operations = tx.operations.map(sanitizeValue);

    console.log('[Blurt] Signing Transaction Data:', JSON.stringify(tx, null, 2));

    // 3. Sign using blurtjs directly
    // Ensure key is private key object if possible, or string
    let privateKey = key;

    const signedTx = blurtInstance.auth.signTransaction(tx, [privateKey]);

    // DEBUG: Verify Signature Locally and Recover Key
    if (signedTx.signatures && signedTx.signatures.length > 0) {
        // CRITICAL FIX: Ensure signatures are hex strings, not Buffers
        // Vite/Polyfills might return Buffers which JSON.stringify serializes as {type:'Buffer', data:...}
        // The RPC node expects hex strings.
        signedTx.signatures = signedTx.signatures.map((sig: any) => {
            if (typeof sig === 'string') return sig;
            if (Buffer.isBuffer(sig)) return sig.toString('hex');
            // Handle JSON-serialized Buffer { type: 'Buffer', data: [...] }
            if (sig && sig.type === 'Buffer' && Array.isArray(sig.data)) {
                return Buffer.from(sig.data).toString('hex');
            }
            // Handle Uint8Array or other array-likes
            if (ArrayBuffer.isView(sig)) {
                return Buffer.from(sig.buffer, sig.byteOffset, sig.byteLength).toString('hex');
            }
            return String(sig);
        });

        const sigHex = signedTx.signatures[0];
        console.log('[Blurt] Generated Signature:', sigHex);

        try {
            // 1. Calculate Digest (uses blurtInstance internal config)
            // @ts-ignore
            const serializer = blurtInstance.auth.serializer;
            // @ts-ignore
            const digest = blurtInstance.auth.transactionDigest(tx);

            console.log('---------------- BLURT DIAGNOSTICS ----------------');
            console.log('[Blurt] Config ChainID:', blurtInstance.config.get('chain_id'));
            console.log('[Blurt] Expected ChainID:', BLURT_CHAIN_ID);
            console.log('[Blurt] Ref Block Num:', ref_block_num);
            console.log('[Blurt] Ref Block Prefix:', ref_block_prefix);
            console.log('[Blurt] Expiration:', expiration);

            // Log serialized buffer
            try {
                // @ts-ignore
                const buf = serializer.toBuffer(serializer.types.transaction, tx);
                console.log('[Blurt] Serialized Tx Buffer (Hex):', buf.toString('hex'));
            } catch (e) { console.error('[Blurt] Serializer Error:', e); }

            console.log('[Blurt] Tx Digest (Hex):', digest.toString('hex'));
            console.log('---------------------------------------------------');

            // 2. Recover Public Key using this digest
            // @ts-ignore
            const Signature = blurtInstance.auth.ecc.Signature;

            // Handle potential Buffer input for fromHex/fromBuffer
            const sig = Buffer.isBuffer(sigHex) || (typeof sigHex === 'object')
                ? Signature.fromBuffer(Buffer.from(sigHex, 'hex')) // Re-bufferize if needed or handle appropriately
                : Signature.fromHex(sigHex);

            const recoveredPubKey = sig.recover(digest).toString();
            console.log('[Blurt] Recovered PubKey:', recoveredPubKey);

            // 3. Expected Public Key
            // @ts-ignore
            const expectedPubKey = blurtInstance.auth.wifToPublic(key);
            console.log('[Blurt] Expected PubKey:', expectedPubKey);

            if (recoveredPubKey !== expectedPubKey) {
                console.error('[Blurt] CRITICAL: Signature mismatch! The library might be using the wrong Chain ID internally.');
                console.error('[Blurt] Diagnostic: Check if "Serialized Tx Buffer" matches what the tests produce.');
            } else {
                console.log('[Blurt] Signature verification PASSED locally.');
            }

        } catch (e) {
            console.error('[Blurt] Verification Debug Error:', e);
        }
    } else {
        console.warn('[Blurt] No signature generated!');
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
        headers: { 'Content-Type': 'application/json' }
    });

    const broadcastResult = await broadcastResponse.json();
    if (broadcastResult.error) {
        console.error('[Blurt] Broadcast Error Response:', JSON.stringify(broadcastResult));
        console.error('[Blurt] Tx Signed Content:', JSON.stringify(signedTx));
        throw new Error(broadcastResult.error.message || JSON.stringify(broadcastResult.error));
    }

    return broadcastResult.result;
};

// --- PUBLIC API ---

const fetchGlobalProps = async (chain: Chain): Promise<any> => {
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
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await response.json();
        return json.result;
    } catch (error) {
        console.error(`Error fetching global props for ${chain}:`, error);
        return null;
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
            headers: { 'Content-Type': 'application/json' }
        });

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
    } catch (error) {
        console.error(`Error fetching balance for ${username} on ${chain}:`, error);
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
            headers: { 'Content-Type': 'application/json' }
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
            const transfer = ['transfer', { from, to, amount: `${formattedAmount} ${symbol}`, memo }];
            const result = await broadcastBlurtTransaction(nodeUrl, [transfer], activeKey);
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
            console.log("[DEBUG] Steem Vote:", voter, author, permlink, weight);
            const result = await client.broadcast.vote({ voter, author, permlink, weight }, privateKey);
            console.log("[DEBUG] Steem Vote Result:", JSON.stringify(result));
            return { success: true, txId: result.id, opResult: result };
        } else if (chain === Chain.BLURT) {
            const vote = ['vote', { voter, author, permlink, weight }];
            const result = await broadcastBlurtTransaction(nodeUrl, [vote], key);
            return { success: true, txId: result.id, opResult: result };
        }
        return { success: false, error: "Chain not supported" };
    } catch (e: any) {
        return { success: false, error: e.message || "Vote failed" };
    }
};

export const broadcastCustomJson = async (chain: Chain, username: string, key: string, id: string, json: string, keyType: 'Posting' | 'Active'): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    const nodeUrl = getActiveNode(chain);
    try {
        // Ensure keyType is valid, default to 'Posting' if undefined
        const validKeyType = (keyType === 'Active' || keyType === 'Posting') ? keyType : 'Posting';

        // Ensure these are always arrays, never undefined
        const required_auths = validKeyType === 'Active' ? [username] : [];
        const required_posting_auths = validKeyType === 'Posting' ? [username] : [];

        if (chain === Chain.HIVE) {
            // Ensure json is a string
            const jsonString = typeof json === 'string' ? json : JSON.stringify(json);

            const op: any = ['custom_json', {
                required_auths: required_auths,  // Explicitly set
                required_posting_auths: required_posting_auths,  // Explicitly set
                id: id,
                json: jsonString
            }];

            const result = await broadcastHiveTransaction(nodeUrl, [op], key);
            return { success: true, txId: result.id, opResult: result };

        } else if (chain === Chain.STEEM) {
            const client = new SteemClient(nodeUrl);
            const privateKey = SteemPrivateKey.fromString(key);
            const result = await client.broadcast.json({ id, json, required_auths, required_posting_auths }, privateKey);
            return { success: true, txId: result.id };
        } else if (chain === Chain.BLURT) {
            const op: any = ['custom_json', {
                required_auths: required_auths,
                required_posting_auths: required_posting_auths,
                id: id,
                json: json // custom_json usually expects string in simple serialize, but dsteem might want parsed? 
                // Manual build: json should be string
            }];
            // Ensure json is a string
            op[1].json = typeof json === 'string' ? json : JSON.stringify(json);

            const result = await broadcastBlurtTransaction(nodeUrl, [op], key);
            return { success: true, txId: result.id, opResult: result };
        }
        return { success: false, error: "Chain not supported" };
    } catch (e: any) {
        console.error('Custom JSON Error:', e);
        return { success: false, error: e.message || "Custom JSON failed" };
    }
};

const formatChainError = (error: any): string => {
    const msg = error.message || String(error);

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

    // Handle other common errors
    if (msg.includes('balance')) return "Insufficient balance for this operation.";
    if (msg.includes('authority')) return "Missing required authority. Check your Active key.";

    return msg;
};

export const broadcastOperations = async (
    chain: Chain,
    activeKey: string,
    operations: any[]
): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    const nodeUrl = getActiveNode(chain);

    // Clean operations from frontend-specific properties (like __config, __rshares)
    const cleanOperations = operations.map(op => {
        if (Array.isArray(op) && op.length >= 2 && typeof op[1] === 'object') {
            const data = { ...op[1] };
            Object.keys(data).forEach(key => {
                if (key.startsWith('__')) delete data[key];
            });
            return [op[0], data];
        }
        return op;
    });

    try {
        if (chain === Chain.HIVE) {
            const result = await broadcastHiveTransaction(nodeUrl, cleanOperations, activeKey);
            return { success: true, txId: result.id, opResult: result };
        } else if (chain === Chain.STEEM) {
            const client = new SteemClient(nodeUrl);
            const key = SteemPrivateKey.fromString(activeKey);
            console.log("[DEBUG] Steem Ops (Cleaned):", JSON.stringify(cleanOperations));
            const result = await client.broadcast.sendOperations(cleanOperations, key);
            console.log("[DEBUG] Steem Result:", JSON.stringify(result));
            return { success: true, txId: result.id, opResult: result };
        } else if (chain === Chain.BLURT) {
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
    items: { to: string; amount: number; memo: string }[],
    tokenSymbol?: string
): Promise<{ success: boolean; txId?: string; error?: string }> => {
    // Determine default token if not provided
    const defaultToken = chain === Chain.HIVE ? 'HIVE' : chain === Chain.STEEM ? 'STEEM' : 'BLURT';
    const symbol = tokenSymbol || defaultToken;

    const ops = items.map(item => {
        return ['transfer', {
            from,
            to: item.to,
            amount: `${item.amount.toFixed(3)} ${symbol}`,
            memo: item.memo
        }];
    });

    return broadcastOperations(chain, activeKey, ops);
};

export const broadcastPowerUp = async (chain: Chain, username: string, activeKey: string, to: string, amount: string): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
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
    type: 'send' | 'receive';
    txId: string;
}

export const fetchAccountHistory = async (chain: Chain, username: string): Promise<HistoryItem[]> => {
    const node = getActiveNode(chain);
    const processOp = (op: any, timestamp: string, trx_id: string): HistoryItem | null => {
        if (!op || !Array.isArray(op) || op.length < 2) return null;
        const type = op[0];
        const data = op[1];
        if (type === 'transfer') {
            if (data.from === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: data.memo, type: 'send', txId: trx_id };
            if (data.to === username) return { date: timestamp, from: data.from, to: data.to, amount: data.amount, memo: data.memo, type: 'receive', txId: trx_id };
        }
        return null;
    };

    try {
        if (chain === Chain.HIVE) {
            // Use native fetch for history in SW
            const response = await fetch(node, {
                method: 'POST',
                body: JSON.stringify({ jsonrpc: '2.0', method: 'condenser_api.get_account_history', params: [username, -1, 500], id: 1 }),
                headers: { 'Content-Type': 'application/json' }
            });
            const json = await response.json();
            if (json.result) return json.result.map((h: any) => processOp(h[1].op, h[1].timestamp, h[1].trx_id)).filter((h: any) => h !== null).reverse();
        }
        if (chain === Chain.STEEM) {
            const client = new SteemClient(node);
            const history = await client.database.call('get_account_history', [username, -1, 500]);
            return history.map((h: any) => processOp(h[1].op, h[1].timestamp, h[1].trx_id)).filter((h: any) => h !== null).reverse();
        }
        if (chain === Chain.BLURT) {
            const response = await fetch(node, { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', method: 'condenser_api.get_account_history', params: [username, -1, 500], id: 1 }), headers: { 'Content-Type': 'application/json' } });
            const json = await response.json();
            if (json.result) return json.result.map((h: any) => processOp(h[1].op, h[1].timestamp, h[1].trx_id)).filter((h: any) => h !== null).reverse();
        }
    } catch (e: any) { console.error("Fetch History Error:", JSON.stringify(e, null, 2) || e); }
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
            if (typeof message === 'object' && message !== null && !Buffer.isBuffer(message)) {
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
