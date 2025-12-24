
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

declare const chrome: any;

// Configure otplib
authenticator.options = { window: 1 }; // Allow 1 step window (30s margin)

const STORAGE_KEY = 'device_totp_secret';

export const generateSetup = async (accountName: string = 'GravityWallet'): Promise<{ secret: string, qrCode: string }> => {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(accountName, 'Gravity Wallet', secret);

    try {
        const qrCode = await QRCode.toDataURL(otpauth);
        return { secret, qrCode };
    } catch (err) {
        console.error("QR Gen Error:", err);
        throw err;
    }
};

export const verifyTOTP = (token: string, secret: string): boolean => {
    try {
        return authenticator.check(token, secret);
    } catch (e) {
        return false;
    }
};

export const saveTOTPSecret = async (secret: string): Promise<void> => {
    // In a real production app, this should be encrypted with the Master Password/PIN.
    // Following existing pattern of 'device_auth_struct', we store it locally 
    // to allow "passwordless" style unlock (Unlock via Phone).

    // Simple obfuscation to prevent casual reading (Standard Base64)
    const storedValue = btoa(secret);

    if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({ [STORAGE_KEY]: storedValue });
    } else {
        localStorage.setItem(STORAGE_KEY, storedValue);
    }
};

export const getTOTPSecret = async (): Promise<string | null> => {
    let val: string | null | undefined;

    if (typeof chrome !== 'undefined' && chrome.storage) {
        const res = await chrome.storage.local.get([STORAGE_KEY]);
        val = res[STORAGE_KEY];
    } else {
        val = localStorage.getItem(STORAGE_KEY);
    }

    if (!val) return null;

    try {
        return atob(val);
    } catch (e) {
        return val; // Fallback if raw
    }
};

export const hasTOTPConfigured = async (): Promise<boolean> => {
    const secret = await getTOTPSecret();
    return !!secret;
};

export const removeTOTPSecret = async (): Promise<void> => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.remove(STORAGE_KEY);
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
};
