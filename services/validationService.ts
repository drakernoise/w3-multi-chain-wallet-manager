import { PrivateKey as HivePrivateKey } from '@hiveio/dhive';
import { PrivateKey as SteemPrivateKey } from 'dsteem';
import { Chain } from '../types';
import { fetchAccountData } from './chainService';

export const validateUsername = (username: string): string | null => {
    if (!username) return "Username is required";
    const trimmed = username.trim().toLowerCase();
    const usernameRegex = /^[a-z][a-z0-9\-.]{2,15}$/;
    if (!usernameRegex.test(trimmed)) {
        return "Invalid username format (3-16 chars, lowercase)";
    }
    return null;
};

export const validatePrivateKey = (key: string): string | null => {
    if (!key) return null;
    const trimmed = key.trim();
    // WIF check
    const wifRegex = /^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/;
    if (!wifRegex.test(trimmed)) {
        return "Invalid Private Key format";
    }
    return null;
};

// Cryptographically verify if the provided Private Key belongs to the on-chain account
export const verifyKeyAgainstChain = async (
    chain: Chain,
    username: string,
    privateKey: string,
    type: 'posting' | 'active' | 'memo'
): Promise<boolean> => {
    try {
        if (!privateKey) return true; // Optional keys are "valid" if empty

        // 1. Fetch on-chain authority data
        const accountData = await fetchAccountData(chain, username);
        if (!accountData) return false;

        let derivedPub: string;

        // 2. Derive Public Key from Private Key
        if (chain === Chain.HIVE || chain === Chain.BLURT) {
            // Blurt usually uses same curve as Hive/Steem
            derivedPub = HivePrivateKey.fromString(privateKey).createPublic().toString();
        } else {
            derivedPub = SteemPrivateKey.fromString(privateKey).createPublic().toString();
        }

        // 3. Check if derived key exists in the account's auths
        if (type === 'memo') {
            return accountData.memo_key === derivedPub;
        } else {
            const auths = type === 'active' ? accountData.active.key_auths : accountData.posting.key_auths;
            // auths is an array of [key, weight], e.g. [["STM5...", 1]]
            return auths.some(auth => auth[0] === derivedPub);
        }

    } catch (e) {
        console.error("Key Verification Error:", e);
        return false;
    }
};
