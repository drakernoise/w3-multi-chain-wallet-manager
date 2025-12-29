
import { Chain } from '../types';
import { getActiveNode } from './nodeService';
import * as hive from '@hiveio/hive-js';
import * as blurt from '@blurtfoundation/blurtjs';
import { Client as SteemClient } from 'dsteem';
import { getChainConfig } from '../config/chainConfig';

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
    const node = getActiveNode(chain);

    // Helper to process ops from standard condenser_api.get_account_history response
    const processHistory = (result: any[]) => {
        const messages: ChatMessage[] = [];
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
        return messages.reverse(); // Newest first
    };

    if (chain === Chain.HIVE) {
        hive.api.setOptions({ url: node });
        return new Promise((resolve, reject) => {
            hive.api.getAccountHistory(username, -1, limit, (err: any, result: any[]) => {
                if (err) reject(err);
                else resolve(processHistory(result));
            });
        });
    } else if (chain === Chain.BLURT) {
        const config = getChainConfig(Chain.BLURT);
        blurt.config.set('address_prefix', config.addressPrefix);
        blurt.config.set('chain_id', config.chainId);
        blurt.api.setOptions({ url: node, useAppbaseApi: true });

        return new Promise((resolve, reject) => {
            blurt.api.getAccountHistory(username, -1, limit, (err: any, result: any[]) => {
                if (err) reject(err);
                else resolve(processHistory(result));
            });
        });
    } else if (chain === Chain.STEEM) {
        const client = new SteemClient(node);
        const history = await client.database.call('get_account_history', [username, -1, limit]);
        return processHistory(history);
    }

    return [];
};

export const decodeMessage = (memo: string, privateMemoKey: string): string => {
    if (!memo.startsWith('#')) return memo;

    // Detect prefix from key? Or just try both?
    try {
        // Try Hive/Steem (STM) first as it is default
        return hive.memo.decode(privateMemoKey, memo);
    } catch (e) {
        // If failed, try Blurt
        try {
            return blurt.memo.decode(privateMemoKey, memo);
        } catch (e2) {
            console.error("Failed to decode memo", e2);
            return "** Decryption Failed **";
        }
    }
};

export const encodeMessage = (privateMemoKey: string, publicMemoKeyTo: string, message: string): string => {
    if (!message.startsWith('#')) {
        // Check prefix of destination key
        if (publicMemoKeyTo.startsWith('BLT')) {
            return blurt.memo.encode(privateMemoKey, publicMemoKeyTo, `#${message}`);
        } else {
            return hive.memo.encode(privateMemoKey, publicMemoKeyTo, `#${message}`);
        }
    }
    return message; // Already encrypted?
};
