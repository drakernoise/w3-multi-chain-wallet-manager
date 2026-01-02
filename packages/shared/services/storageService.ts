import { Preferences } from '@capacitor/preferences';

declare const chrome: any;

const isNativePlatform = () => {
    if (typeof window === 'undefined') return false;
    const cap = (window as any).Capacitor;
    if (!cap) return false;

    // Check if we are in a truly native environment (Android/iOS)
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
                        if (chrome.runtime?.lastError) {
                            console.warn('Chrome Storage Error:', chrome.runtime.lastError);
                            resolve(null);
                        } else {
                            resolve(result && result[key] !== undefined ? result[key] : null);
                        }
                    });
                } catch (e) {
                    console.warn('Chrome Storage Access Error:', e);
                    resolve(null);
                }
            });
        }
        return localStorage.getItem(key);
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
                        if (chrome.runtime?.lastError) {
                            console.warn('Chrome Storage Set Error:', chrome.runtime.lastError);
                        }
                        resolve();
                    });
                } catch (e) {
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
                        resolve();
                    });
                } catch (e) {
                    resolve();
                }
            });
        }
        localStorage.removeItem(key);
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
                        resolve();
                    });
                } catch (e) {
                    resolve();
                }
            });
        }
        localStorage.clear();
    }
};
