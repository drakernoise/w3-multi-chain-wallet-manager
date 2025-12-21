/**
 * Chain Configuration
 * 
 * Centralized configuration for all supported blockchain networks.
 * This makes the wallet easily expandable to new chains without modifying core logic.
 */

import { Chain } from '../types';

/**
 * Configuration for a single blockchain
 */
export interface ChainConfig {
    /** Chain identifier */
    chain: Chain;

    /** Display name */
    name: string;

    /** Primary token symbol (e.g., HIVE, STEEM, BLURT) */
    primaryToken: string;

    /** Secondary token symbol (e.g., HBD, SBD) - null if chain doesn't have one */
    secondaryToken: string | null;

    /** Vesting token symbol (e.g., VESTS) */
    vestingToken: string;

    /** Address prefix for public keys (e.g., STM, BLT) */
    addressPrefix: string;

    /** Chain ID for transaction signing */
    chainId: string;

    /** Default RPC node candidates */
    rpcNodes: string[];

    /** Block explorer URL template (use {tx} for transaction ID, {account} for username) */
    explorerUrl: {
        transaction: string;
        account: string;
    };

    /** API-specific configuration */
    api: {
        /** Whether this chain uses HBD/SBD or just primary token */
        hasSecondaryToken: boolean;

        /** Field names in account data response */
        balanceFields: {
            primary: string;
            secondary?: string;
            savings?: string;
        };
    };
}

/**
 * All supported chain configurations
 */
export const CHAIN_CONFIGS: Record<Chain, ChainConfig> = {
    [Chain.HIVE]: {
        chain: Chain.HIVE,
        name: 'Hive',
        primaryToken: 'HIVE',
        secondaryToken: 'HBD',
        vestingToken: 'VESTS',
        addressPrefix: 'STM',
        chainId: 'beeab0de00000000000000000000000000000000000000000000000000000000',
        rpcNodes: [
            'https://api.hive.blog',
            'https://api.deathwing.me',
            'https://hive-api.arcange.eu',
            'https://api.openhive.network'
        ],
        explorerUrl: {
            transaction: 'https://hivexplorer.com/tx/{tx}',
            account: 'https://hivexplorer.com/@{account}'
        },
        api: {
            hasSecondaryToken: true,
            balanceFields: {
                primary: 'balance',
                secondary: 'hbd_balance',
                savings: 'savings_balance'
            }
        }
    },

    [Chain.BLURT]: {
        chain: Chain.BLURT,
        name: 'Blurt',
        primaryToken: 'BLURT',
        secondaryToken: null,
        vestingToken: 'VESTS',
        addressPrefix: 'BLT',
        chainId: 'cd8d90f29ae273abec3eaa7731e25934c63eb654d55080caff2ebb7f5df6381f',
        rpcNodes: [
            'https://rpc.beblurt.com',
            'https://blurt-rpc.saboin.com',
            'https://rpc.blurt.world',
            'https://api.blurt.blog'
        ],
        explorerUrl: {
            transaction: 'https://blocks.blurtwallet.com/#/tx/{tx}',
            account: 'https://blurtwallet.com/@{account}'
        },
        api: {
            hasSecondaryToken: false,
            balanceFields: {
                primary: 'balance'
            }
        }
    },

    [Chain.STEEM]: {
        chain: Chain.STEEM,
        name: 'Steem',
        primaryToken: 'STEEM',
        secondaryToken: 'SBD',
        vestingToken: 'VESTS',
        addressPrefix: 'STM',
        chainId: '0000000000000000000000000000000000000000000000000000000000000000',
        rpcNodes: [
            'https://api.steem.fans',
            'https://api.steemit.com'
        ],
        explorerUrl: {
            transaction: 'https://steemit.com/tx/{tx}',
            account: 'https://steemit.com/@{account}'
        },
        api: {
            hasSecondaryToken: true,
            balanceFields: {
                primary: 'balance',
                secondary: 'sbd_balance',
                savings: 'savings_balance'
            }
        }
    }
};

/**
 * Get configuration for a specific chain
 */
export function getChainConfig(chain: Chain): ChainConfig {
    return CHAIN_CONFIGS[chain];
}

/**
 * Get all supported chains
 */
export function getSupportedChains(): Chain[] {
    return Object.values(Chain);
}

/**
 * Check if a chain is supported
 */
export function isChainSupported(chain: string): chain is Chain {
    return Object.values(Chain).includes(chain as Chain);
}

/**
 * Format amount with chain-specific token
 */
export function formatAmount(chain: Chain, amount: number | string, isSecondary: boolean = false): string {
    const config = getChainConfig(chain);
    const token = isSecondary && config.secondaryToken ? config.secondaryToken : config.primaryToken;
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${numAmount.toFixed(3)} ${token}`;
}

/**
 * Parse amount string and extract numeric value
 */
export function parseAmount(amountString: string): number {
    return parseFloat(amountString.split(' ')[0] || '0');
}

/**
 * Get explorer URL for transaction
 */
export function getTransactionUrl(chain: Chain, txId: string): string {
    const config = getChainConfig(chain);
    return config.explorerUrl.transaction.replace('{tx}', txId);
}

/**
 * Get explorer URL for account
 */
export function getAccountUrl(chain: Chain, username: string): string {
    const config = getChainConfig(chain);
    return config.explorerUrl.account.replace('{account}', username);
}
