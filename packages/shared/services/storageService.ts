import { Preferences } from '@capacitor/preferences';

declare const chrome: any;

const isCapacitor = () => {
    return typeof window !== 'undefined' && (window as any).Capacitor !== undefined;
};

export const storageService = {
    async getItem(key: string): Promise<string | null> {
        if (isCapacitor()) {
            const { value } = await Preferences.get({ key });
            return value;
        }
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                chrome.storage.local.get([key], (result: any) => {
                    resolve(result[key] || null);
                });
            });
        }
        return localStorage.getItem(key);
    },

    async setItem(key: string, value: string): Promise<void> {
        if (isCapacitor()) {
            await Preferences.set({ key, value });
            return;
        }
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [key]: value }, () => {
                    resolve();
                });
            });
        }
        localStorage.setItem(key, value);
    },

    async removeItem(key: string): Promise<void> {
        if (isCapacitor()) {
            await Preferences.remove({ key });
            return;
        }
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                chrome.storage.local.remove([key], () => {
                    resolve();
                });
            });
        }
        localStorage.removeItem(key);
    },

    async clear(): Promise<void> {
        if (isCapacitor()) {
            await Preferences.clear();
            return;
        }
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                chrome.storage.local.clear(() => {
                    resolve();
                });
            });
        }
        localStorage.clear();
    }
};
