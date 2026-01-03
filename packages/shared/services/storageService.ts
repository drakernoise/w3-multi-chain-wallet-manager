import { Preferences } from '@capacitor/preferences';

declare const chrome: any;

const isNativePlatform = () => {
    if (typeof window === 'undefined') return false;
    const cap = (window as any).Capacitor;
    if (!cap) return false;

    if (typeof cap.isNativePlatform === 'function') {
        return cap.isNativePlatform();
    }

    return cap.getPlatform && cap.getPlatform() !== 'web';
};

export const storageService = {
    async getItem(key: string): Promise<string | null> {
        if (!key) return null;

        if (isNativePlatform()) {
            try {
                const { value } = await Preferences.get({ key });
                return value;
            } catch (e) {
                console.warn('Capacitor Storage Get Error:', e);
                return null;
            }
        }

        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                try {
                    chrome.storage.local.get([key], (result: any) => {
                        const value = result && result[key] ? result[key] : null;
                        if (value === null) {
                            // Fallback 1: localStorage direct
                            let local = localStorage.getItem(key);
                            // Fallback 2: Capacitor default web prefix (Rescue migrated data)
                            if (local === null) {
                                local = localStorage.getItem(`CapacitorStorage.${key}`);
                            }
                            resolve(local);
                        } else {
                            resolve(value);
                        }
                    });
                } catch (e) {
                    let local = localStorage.getItem(key);
                    if (local === null) {
                        local = localStorage.getItem(`CapacitorStorage.${key}`);
                    }
                    resolve(local);
                }
            });
        }

        let local = localStorage.getItem(key);
        if (local === null) {
            local = localStorage.getItem(`CapacitorStorage.${key}`);
        }
        return local;
    },

    async setItem(key: string, value: string): Promise<void> {
        if (!key) return;

        if (isNativePlatform()) {
            try {
                await Preferences.set({ key, value });
            } catch (e) {
                console.warn('Capacitor Storage Set Error:', e);
            }
            return;
        }

        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                try {
                    chrome.storage.local.set({ [key]: value }, () => {
                        resolve();
                    });
                } catch (e) {
                    try { localStorage.setItem(key, value); } catch (err) { }
                    resolve();
                }
            });
        }
        localStorage.setItem(key, value);
    },

    async removeItem(key: string): Promise<void> {
        if (!key) return;

        if (isNativePlatform()) {
            try {
                await Preferences.remove({ key });
            } catch (e) {
                console.warn('Capacitor Storage Remove Error:', e);
            }
            return;
        }

        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                try {
                    chrome.storage.local.remove([key], () => {
                        localStorage.removeItem(key);
                        localStorage.removeItem(`CapacitorStorage.${key}`); // Cleanup both
                        resolve();
                    });
                } catch (e) {
                    localStorage.removeItem(key);
                    localStorage.removeItem(`CapacitorStorage.${key}`);
                    resolve();
                }
            });
        }
        localStorage.removeItem(key);
        localStorage.removeItem(`CapacitorStorage.${key}`);
    },

    async clear(): Promise<void> {
        if (isNativePlatform()) {
            try {
                await Preferences.clear();
            } catch (e) {
                console.warn('Capacitor Storage Clear Error:', e);
            }
            return;
        }

        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                try {
                    chrome.storage.local.clear(() => {
                        localStorage.clear();
                        resolve();
                    });
                } catch (e) {
                    localStorage.clear();
                    resolve();
                }
            });
        }
        localStorage.clear();
    }
};
