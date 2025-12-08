import { Chain } from '../types';
import { Client as HiveClient, PrivateKey as HivePrivateKey } from '@hiveio/dhive';
import { Client as SteemClient, PrivateKey as SteemPrivateKey } from 'dsteem';
import { getActiveNode } from './nodeService';

export interface ChainAccountData {
    name: string;
    posting: { key_auths: [string, number][] };
    active: { key_auths: [string, number][] };
    memo_key: string;
    balance?: string; // "10.000 HIVE"
    savings_balance?: string;
}

// --- PUBLIC API ---

export const getAccountBalance = async (chain: Chain, username: string): Promise<number> => {
    try {
        const data = await fetchAccountData(chain, username);
        if (!data) return 0;

        let balanceStr = "0";
        if (chain === Chain.HIVE || chain === Chain.STEEM) {
            // Hive/Steem return "10.000 HIVE"
            balanceStr = data.balance || "0";
        } else if (chain === Chain.BLURT) {
            // Blurt JSON structure varies slightly depending on the RPC
            balanceStr = (data as any).balance || "0";
        }

        return parseFloat(balanceStr.split(' ')[0]);
    } catch (e) {
        console.error(`Failed to get balance for ${username}:`, e);
        return 0;
    }
};

// Helper for timeout
const withTimeout = <T>(promise: Promise<T>, ms: number = 5000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms))
    ]);
};

export const fetchAccountData = async (chain: Chain, username: string): Promise<ChainAccountData | null> => {
    const nodeUrl = getActiveNode(chain);
    try {
        if (chain === Chain.HIVE) {
            const client = new HiveClient(nodeUrl);
            try {
                const accounts = await withTimeout(client.database.getAccounts([username]));
                return accounts.length > 0 ? (accounts[0] as unknown as ChainAccountData) : null;
            } catch (err) {
                console.warn(`Hive client failed on ${nodeUrl}, trying fallback fetch`, err);

                // Fallback to raw fetch using the specific active node (or we could try others, but benchmark should handle that)
                try {
                    const response: any = await withTimeout(fetch(nodeUrl, {
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
                    return (json.result && json.result.length > 0) ? json.result[0] : null;
                } catch (rawErr) {
                    console.error("Raw fetch fallback also failed", rawErr);
                    return null;
                }
            }
        }
        else if (chain === Chain.STEEM) {
            const client = new SteemClient(nodeUrl);
            const accounts = await withTimeout(client.database.getAccounts([username]));
            return accounts.length > 0 ? (accounts[0] as unknown as ChainAccountData) : null;
        }
        else if (chain === Chain.BLURT) {
            // Using raw fetch for Blurt
            const response: any = await withTimeout(fetch(nodeUrl, {
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
            return (json.result && json.result.length > 0) ? json.result[0] : null;
        }
        return null;
    } catch (error) {
        console.warn(`Error fetching account from ${chain} on node ${nodeUrl}:`, error);
        return null;
    }
};

export const broadcastTransfer = async (
    chain: Chain,
    from: string,
    activeKey: string,
    to: string,
    amount: string,
    memo: string
): Promise<{ success: boolean; txId?: string; error?: string }> => {

    // Ensure 3 decimals
    const formattedAmount = parseFloat(amount).toFixed(3);
    const nodeUrl = getActiveNode(chain);

    try {
        if (chain === Chain.HIVE) {
            const client = new HiveClient(nodeUrl);
            const key = HivePrivateKey.fromString(activeKey);
            const transfer = {
                from,
                to,
                amount: `${formattedAmount} HIVE`,
                memo
            };

            const result = await client.broadcast.transfer(transfer, key);
            return { success: true, txId: result.id };
        }
        else if (chain === Chain.STEEM) {
            const client = new SteemClient(nodeUrl);
            const key = SteemPrivateKey.fromString(activeKey);
            const transfer = {
                from,
                to,
                amount: `${formattedAmount} STEEM`,
                memo
            };

            const result = await client.broadcast.transfer(transfer, key);
            return { success: true, txId: result.id };
        }
        else if (chain === Chain.BLURT) {
            // Blurt signing is complex without the specific blurt library.
            // For this production-ready demo, we will throw an error to prompt user.
            // Integrating @blurtfoundation/blurtjs requires patching global window objects.
            return { success: false, error: "Blurt signing requires @blurtfoundation/blurtjs" };
        }

        return { success: false, error: "Chain not supported" };
    } catch (e: any) {
        console.error("Transfer Error:", e);
        return { success: false, error: e.message || "Broadcast failed" };
    }
};

export const detectWeb3Context = (): string | null => {
    // Real implementation would check window.location if injected as content script
    // Or query active tab via chrome.tabs (requires permissions)
    return null;
};
