
import { Chain } from '../types';
import { getActiveNode } from './nodeService';
import * as hive from '@hiveio/hive-js';

// Setup Hive-JS config
hive.api.setOptions({ useAppbaseApi: true });

export interface ChatMessage {
    id: string; // Trx ID
    from: string;
    to: string;
    message: string;
    timestamp: string;
    isEncrypted: boolean;
    type: 'sent' | 'received';
}

export const fetchMessages = async (chain: Chain, username: string, limit: number = 50): Promise<ChatMessage[]> => {
    // Currently relying on condenser_api.get_account_history
    // TODO: Support Steem/Blurt specifics if different
    const node = getActiveNode(chain);
    hive.api.setOptions({ url: node });

    return new Promise((resolve, reject) => {
        hive.api.getAccountHistory(username, -1, limit, (err: any, result: any[]) => {
            if (err) {
                reject(err);
                return;
            }

            const messages: ChatMessage[] = [];

            // Result is [[seq, op]]
            // op is [opType, opData]
            // We look for 'transfer' where memo != ''

            result.forEach((item: any) => {
                const trxId = item[1].trx_id;
                const timestamp = item[1].timestamp;
                const op = item[1].op;
                const type = op[0];
                const data = op[1];

                if (type === 'transfer' && data.memo && data.memo.length > 0) {
                    const isEncrypted = data.memo.startsWith('#');
                    const isSent = data.from === username;

                    messages.push({
                        id: trxId,
                        from: data.from,
                        to: data.to,
                        message: data.memo, // Still encrypted
                        timestamp,
                        isEncrypted,
                        type: isSent ? 'sent' : 'received'
                    });
                }
            });

            resolve(messages.reverse()); // Newest first
        });
    });
};

export const decodeMessage = (memo: string, privateMemoKey: string): string => {
    if (!memo.startsWith('#')) return memo;
    try {
        return hive.memo.decode(privateMemoKey, memo);
    } catch (e) {
        console.error("Failed to decode memo", e);
        return "** Decryption Failed **";
    }
};

export const encodeMessage = (privateMemoKey: string, publicMemoKeyTo: string, message: string): string => {
    if (!message.startsWith('#')) {
        return hive.memo.encode(privateMemoKey, publicMemoKeyTo, `#${message}`);
    }
    return message; // Already encrypted?
};
