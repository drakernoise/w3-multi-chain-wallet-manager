// Polyfill for chrome API in mobile environment
declare global {
    interface Window {
        chrome: any;
    }
}

if (typeof window !== 'undefined' && !window.chrome) {
    window.chrome = {
        storage: {
            local: {
                get: (keys: string[] | string, callback: (result: any) => void) => {
                    const result: any = {};
                    const keysArray = Array.isArray(keys) ? keys : [keys];
                    keysArray.forEach(key => {
                        const value = localStorage.getItem(key);
                        if (value) {
                            try {
                                result[key] = JSON.parse(value);
                            } catch {
                                result[key] = value;
                            }
                        }
                    });
                    callback(result);
                },
                set: (items: Record<string, any>, callback?: () => void) => {
                    Object.entries(items).forEach(([key, value]) => {
                        localStorage.setItem(key, JSON.stringify(value));
                    });
                    if (callback) callback();
                }
            }
        },
        runtime: {
            sendMessage: (message: any, callback?: (response: any) => void) => {
                console.log('[Chrome Polyfill] sendMessage called:', message);
                // In mobile, we don't have background scripts, so just call callback with empty response
                if (callback) callback({});
            },
            lastError: undefined
        }
    };
}

export { };
