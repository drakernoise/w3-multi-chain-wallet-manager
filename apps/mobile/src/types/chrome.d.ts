declare global {
    const chrome: {
        storage: {
            local: {
                get: (keys: string[] | string, callback: (result: any) => void) => void;
                set: (items: Record<string, any>, callback?: () => void) => void;
            };
        };
        runtime: {
            sendMessage: (message: any, callback?: (response: any) => void) => void;
            lastError?: { message: string };
        };
    };
}

export { };
