import { Chain } from '../types';
import { PrivateKey as HivePrivateKey, cryptoUtils } from '@hiveio/dhive';
import { Client as SteemClient, PrivateKey as SteemPrivateKey } from 'dsteem';
import { getActiveNode, HIVE_CANDIDATES, STEEM_CANDIDATES, BLURT_CANDIDATES } from './nodeService';
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

export const getAccountBalance = async (chain: Chain, username: string): Promise<{ primary: number, secondary: number }> => {
    try {
        const data = await fetchAccountData(chain, username);
        if (!data) return { primary: 0, secondary: 0 };

        let primaryStr = "0";
        let secondaryStr = "0";

        if (chain === Chain.HIVE) {
            primaryStr = data.balance || "0";
            secondaryStr = data.hbd_balance || "0";
        } else if (chain === Chain.STEEM) {
            primaryStr = data.balance || "0";
            secondaryStr = data.sbd_balance || "0";
        } else if (chain === Chain.BLURT) {
            primaryStr = (data as any).balance || "0";
            secondaryStr = "0";
        }

        return {
            primary: parseFloat(primaryStr.split(' ')[0]),
            secondary: parseFloat(secondaryStr.split(' ')[0])
        };
    } catch (e) {
        console.error(`Failed to get balance for ${username}:`, e);
        return { primary: 0, secondary: 0 };
    }
};

const withTimeout = <T>(promise: Promise<T>, ms: number = 8000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms))
    ]);
};

export const fetchAccountData = async (chain: Chain, username: string): Promise<ChainAccountData | null> => {
    const activeNode = getActiveNode(chain);
    let candidates: string[] = [];
    if (chain === Chain.HIVE) candidates = [activeNode, ...HIVE_CANDIDATES.filter(n => n !== activeNode)];
    else if (chain === Chain.STEEM) candidates = [activeNode, ...STEEM_CANDIDATES.filter(n => n !== activeNode)];
    else if (chain === Chain.BLURT) candidates = [activeNode, ...BLURT_CANDIDATES.filter(n => n !== activeNode)];

    const maxRetries = 3;

    const safeFetch = (url: string, opts: any): Promise<Response> => {
        // Service Worker environment (MV3) does not have XMLHttpRequest. Use fetch.
        if (typeof XMLHttpRequest === 'undefined') {
            return fetch(url, {
                method: opts.method || 'GET',
                headers: opts.headers,
                body: opts.body
            }).then(res => {
                return res;
            });
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(opts.method || 'GET', url);
            if (opts.headers) {
                Object.keys(opts.headers).forEach(key => {
                    xhr.setRequestHeader(key, opts.headers[key]);
                });
            }
            xhr.onload = () => {
                resolve(new Response(xhr.responseText, {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: new Headers(xhr.getAllResponseHeaders().split('\r\n').reduce((acc: any, line) => {
                        const parts = line.split(': ');
                        if (parts.length === 2) acc[parts[0]] = parts[1];
                        return acc;
                    }, {}))
                }));
            };
            xhr.onerror = () => reject(new TypeError('Network request failed via XHR'));
            xhr.ontimeout = () => reject(new TypeError('Network request timed out via XHR'));
            xhr.send(opts.body);
        });
    };

    for (let i = 0; i < Math.min(candidates.length, maxRetries); i++) {
        const nodeUrl = candidates[i];
        try {
            if (chain === Chain.HIVE) {
                // Use fetch for HIVE to be safe
                const response: any = await withTimeout(safeFetch(nodeUrl, {
                    method: 'POST',
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'condenser_api.get_accounts',
                        params: [[username]],
                        id: 1
                    }),
                    headers: { 'Content-Type': 'application/json' }
                }));
                const json = await response.json();
                if (json.result && json.result.length > 0) return json.result[0];
            }
            else if (chain === Chain.STEEM) {
                const client = new SteemClient(nodeUrl);
                const accounts = await withTimeout(client.database.getAccounts([username]));
                if (accounts.length > 0) return (accounts[0] as unknown as ChainAccountData);
            }
            else if (chain === Chain.BLURT) {
                const response: any = await withTimeout(safeFetch(nodeUrl, {
                    method: 'POST',
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'condenser_api.get_accounts',
                        params: [[username]],
                        id: 1
                    }),
                    headers: { 'Content-Type': 'application/json' }
                }));
                const json = await response.json();
                if (json.result && json.result.length > 0) return json.result[0];
            }
        } catch (e) {
            // console.warn(`Node ${nodeUrl} failed:`, e);
        }
    }
    return null;
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

export const broadcastPowerDown = async (chain: Chain, username: string, activeKey: string, vestingShares: string): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    const op: any = ['withdraw_vesting', {
        account: username,
        vesting_shares: vestingShares
    }];
    return broadcastOperations(chain, activeKey, [op]);
};

export const broadcastDelegation = async (chain: Chain, username: string, activeKey: string, delegatee: string, vestingShares: string): Promise<{ success: boolean; txId?: string; error?: string; opResult?: any }> => {
    const op: any = ['delegate_vesting_shares', {
        delegator: username,
        delegatee: delegatee,
        vesting_shares: vestingShares
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
                body: JSON.stringify({ jsonrpc: '2.0', method: 'condenser_api.get_account_history', params: [username, -1, 50], id: 1 }),
                headers: { 'Content-Type': 'application/json' }
            });
            const json = await response.json();
            if (json.result) return json.result.map((h: any) => processOp(h[1].op, h[1].timestamp, h[1].trx_id)).filter((h: any) => h !== null).reverse();
        }
        if (chain === Chain.STEEM) {
            const client = new SteemClient(node);
            const history = await client.database.call('get_account_history', [username, -1, 50]);
            return history.map((h: any) => processOp(h[1].op, h[1].timestamp, h[1].trx_id)).filter((h: any) => h !== null).reverse();
        }
        if (chain === Chain.BLURT) {
            const response = await fetch(node, { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', method: 'condenser_api.get_account_history', params: [username, -1, 50], id: 1 }), headers: { 'Content-Type': 'application/json' } });
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
