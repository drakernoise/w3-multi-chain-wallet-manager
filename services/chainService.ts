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
        headers: { 'Content-Type': 'application/json' }
    });

    const broadcastResult = await broadcastResponse.json();
    if (broadcastResult.error) {
        throw new Error(broadcastResult.error.message || JSON.stringify(broadcastResult.error));
    }

    return broadcastResult.result; // Returns { id: "txid", block_num: 123, ... }
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

export const getAccountBalance = async (chain: Chain, username: string): Promise<{ primary: number, secondary: number, staked: number }> => {
    try {
        const [accountData, globalProps] = await Promise.all([
            fetchAccountData(chain, username),
            fetchGlobalProps(chain)
        ]);

        if (!accountData) return { primary: 0, secondary: 0, staked: 0 };

        // Handle different API response formats
        const account = (accountData as any).account || (Array.isArray((accountData as any).accounts) ? (accountData as any).accounts[0] : accountData);
        if (!account) return { primary: 0, secondary: 0, staked: 0 };

        const config = getChainConfig(chain);
        const primaryField = config.api.balanceFields.primary;
        const secondaryField = config.api.balanceFields.secondary;

        const primaryStr = (account as any)[primaryField] || "0";
        const secondaryStr = secondaryField ? ((account as any)[secondaryField] || "0") : "0";

        // Get vesting_shares
        const vestingSharesStr = (account as any)['vesting_shares'] || "0";
        const vestingShares = parseFloat(String(vestingSharesStr).split(' ')[0]);

        // Exact Power Calculation based on Global Properties
        let stakedPower = 0;
        if (globalProps) {
            const totalVestingFund = parseFloat(String(globalProps.total_vesting_fund_hive || globalProps.total_vesting_fund_steem || globalProps.total_vesting_fund_blurt || "0").split(' ')[0]);
            const totalVestingShares = parseFloat(String(globalProps.total_vesting_shares).split(' ')[0]);

            if (totalVestingShares > 0) {
                stakedPower = (vestingShares * totalVestingFund) / totalVestingShares;
            }
        } else {
            // Fallback approximation
            stakedPower = vestingShares / 1950;
        }

        console.log(`Gravity: Balances for ${username}:`, { primary: primaryStr, secondary: secondaryStr, staked: stakedPower });

        return {
            primary: parseFloat(String(primaryStr).split(' ')[0]),
            secondary: parseFloat(String(secondaryStr).split(' ')[0]),
            staked: stakedPower
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

        let errors: string[] = [];

        const verifyKey = (keyStr: string, auths: [string, number][], type: string) => {
            try {
                let publicKeys: string[] = [];
                // Use HivePrivateKey for generic WIF parsing on graphene chains
                publicKeys = [HivePrivateKey.fromString(keyStr).createPublic().toString()];

                const found = auths.some(auth => publicKeys.includes(auth[0]));
                if (!found) errors.push(`${type} key does not match account`);
            } catch (e) {
                errors.push(`Invalid ${type} key format`);
            }
        };

        if (keys.active) verifyKey(keys.active, accountData.active.key_auths, "Active");
        if (keys.posting) verifyKey(keys.posting, accountData.posting.key_auths, "Posting");
        if (keys.memo && keys.memo !== accountData.memo_key) {
            try {
                const pub = HivePrivateKey.fromString(keys.memo).createPublic().toString();
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
            // MANUAL BROADCAST for Reliability in Service Worker (Fixes 'Illegal invocation' fetch error)
            const op: any = ['custom_json', {
                required_auths,
                required_posting_auths,
                id,
                json
            }];
            const result = await broadcastHiveTransaction(nodeUrl, [op], key);
            return { success: true, txId: result.id, opResult: result };

        } else if (chain === Chain.STEEM) {
            const client = new SteemClient(nodeUrl);
            const privateKey = SteemPrivateKey.fromString(key);
            const result = await client.broadcast.json({ id, json, required_auths, required_posting_auths }, privateKey);
            return { success: true, txId: result.id };
        } else if (chain === Chain.BLURT) {
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

export const broadcastOperations = async (
    chain: Chain,
    activeKey: string,
    operations: any[]
): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    const nodeUrl = getActiveNode(chain);

    try {
        if (chain === Chain.HIVE) {
            // FULLY MANUAL APPROACH
            // Use broadcastHiveTransaction
            const result = await broadcastHiveTransaction(nodeUrl, operations, activeKey);

            return {
                success: true,
                txId: result.id,
                opResult: result
            };

        } else if (chain === Chain.STEEM) {
            const client = new SteemClient(nodeUrl);
            const key = SteemPrivateKey.fromString(activeKey);

            const result = await client.broadcast.sendOperations(operations, key);

            return {
                success: true,
                txId: result.id,
                opResult: result
            };
        } else if (chain === Chain.BLURT) {
            blurt.api.setOptions({ url: nodeUrl, useAppbaseApi: true });
            const result = await new Promise<any>((resolve, reject) => {
                blurt.broadcast.send({ extensions: [], operations: operations }, [activeKey], (err: any, res: any) => {
                    if (err) reject(err); else resolve(res);
                });
            });
            return { success: true, txId: result.id, opResult: result };
        }
        return { success: false, error: "Chain not supported" };
    } catch (e: any) {
        console.error("Broadcast Ops Error:", e);
        return { success: false, error: e.message || "Broadcast failed" };
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

export const broadcastPowerDown = async (chain: Chain, username: string, activeKey: string, amountPower: number): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    try {
        const vestingShares = amountPower === 0 ? "0.000000 VESTS" : await convertToVests(chain, amountPower);
        const op: any = ['withdraw_vesting', {
            account: username,
            vesting_shares: vestingShares
        }];
        return broadcastOperations(chain, activeKey, [op]);
    } catch (e: any) {
        return { success: false, error: e.message || "Failed to convert power to vests" };
    }
};

export const broadcastDelegation = async (chain: Chain, username: string, activeKey: string, delegatee: string, amountPower: number): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    try {
        const vestingShares = amountPower === 0 ? "0.000000 VESTS" : await convertToVests(chain, amountPower);
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
        let key: any;
        let buf: Buffer;

        // Check if message is a serialized Buffer (common in DApp requests for binary signing)
        try {
            if (typeof message === 'string' && message.includes('"type":"Buffer"') && message.includes('"data":[')) {
                const parsed = JSON.parse(message);
                if (parsed.type === 'Buffer' && Array.isArray(parsed.data)) {
                    buf = Buffer.from(parsed.data);
                } else {
                    buf = Buffer.from(message);
                }
            } else if (typeof message === 'object') {
                if ((message as any).type === 'Buffer' && Array.isArray((message as any).data)) {
                    buf = Buffer.from((message as any).data);
                } else {
                    // If it's a plain object, stringify it
                    buf = Buffer.from(JSON.stringify(message));
                }
            } else {
                buf = Buffer.from(message);
            }
        } catch (e) {
            buf = Buffer.from(message);
        }

        let signature = "";
        let publicKey = "";

        if (chain === Chain.HIVE) {
            // ** LEGACY + ROBUST PAYLOAD STRATEGY **
            // Hypothesis: dsteem works for Tribaldex (proven in Step 3572).
            // We use dsteem for signing, but keep the robust object handling.

            try {
                const key = SteemPrivateKey.fromString(keyStr);

                let msgBuf: Buffer;
                // Robust normalization (PeakD sends Objects, Tribaldex sends Strings)
                if (typeof message === 'object' && !Buffer.isBuffer(message) && !((message as any).type === 'Buffer')) {
                    msgBuf = Buffer.from(JSON.stringify(message));
                } else if (typeof message === 'object' && (message as any).type === 'Buffer' && Array.isArray((message as any).data)) {
                    msgBuf = Buffer.from((message as any).data);
                } else {
                    msgBuf = Buffer.isBuffer(message) ? message : Buffer.from(message);
                }

                // Use dhive's cryptoUtils for reliable SHA256 (same algorithm), but dsteem for signing
                const hash = cryptoUtils.sha256(msgBuf);
                const sig = key.sign(hash);

                signature = sig.toString(); // dsteem signature (Legacy Hex)
                publicKey = key.createPublic().toString();


            } catch (e) {
                console.error("dsteem signing failed:", e);
                throw e;
            }
        }
        else if (chain === Chain.STEEM) {
            key = SteemPrivateKey.fromString(keyStr);
            signature = key.sign(cryptoUtils.sha256(buf)).toString();
            publicKey = key.createPublic().toString();
        }
        else if (chain === Chain.BLURT) {
            // Use native blurt library for signing to ensure full compatibility
            // (prefixes, hashing, signature format)
            try {
                // @ts-ignore
                if (blurt.auth && blurt.auth.sign) {
                    // blurt.auth.sign returns hex string usually? or Signature object?
                    // Expected: blurt.auth.sign(message, keyWif)
                    // @ts-ignore
                    signature = blurt.auth.sign(message, keyStr);
                } else {
                    // Fallback to manual if method signature differs
                    key = HivePrivateKey.fromString(keyStr);
                    signature = key.sign(cryptoUtils.sha256(buf)).toString();
                }

                // Public Key Generation (also native)
                // @ts-ignore
                if (blurt.auth && blurt.auth.wifToPublic) {
                    // @ts-ignore
                    publicKey = blurt.auth.wifToPublic(keyStr);
                } else {
                    key = HivePrivateKey.fromString(keyStr);
                    publicKey = key.createPublic().toString().replace(/^STM/, 'BLT');
                }
            } catch (err) {
                // Final verify fallback
                key = HivePrivateKey.fromString(keyStr);
                signature = key.sign(cryptoUtils.sha256(buf)).toString();
                publicKey = key.createPublic().toString().replace(/^STM/, 'BLT');
            }
        }
        else {
            return { success: false, error: "Chain not supported" };
        }

        return { success: true, result: signature, publicKey };

    } catch (e: any) {
        return { success: false, error: e.message };
    }
};
