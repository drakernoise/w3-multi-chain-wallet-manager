
// Gravity Provider API
// This script is injected into the web page context.

// CHANGE THIS to your trusted parent/origin, e.g., the domain of your extension/page.
const GRAVITY_TRUSTED_ORIGIN = "https://gravitywallet.io";
interface GravityRequest {
    id: string;
    method: string;
    params: any[];
    type: string;
}

class GravityProvider {
    callbacks: Map<string, Function>;

    constructor() {
        this.callbacks = new Map();
        this.setupListener();
    }

    setupListener() {
        window.addEventListener('message', (event) => {
            if (event.source !== window) return;

            const data = event.data;
            if (data && data.type === 'gravity_response') {
                console.log('[Gravity Provider] Received response:', data);
                const callback = this.callbacks.get(data.id);
                if (callback) {
                    console.log('[Gravity Provider] Executing callback for ID:', data.id);
                    console.log('[Gravity Provider] Callback will receive:', data.response);
                    callback(data.response);
                    console.log('[Gravity Provider] Callback executed successfully');
                    this.callbacks.delete(data.id);
                } else {
                    console.warn('[Gravity Provider] No callback found for ID:', data.id, 'Available IDs:', Array.from(this.callbacks.keys()));
                }
            }
        });
    }

    // --- Hive Keychain API Compatibility ---

    requestHandshake(callback?: Function) {
        // Immediate local response
        if (callback) callback();
    }

    requestTransfer(username: string, to: string, amount: string, memo: string, currency: string, callback?: Function, enforceEndpoint?: boolean) {
        this.send('requestTransfer', [username, to, amount, memo, currency, enforceEndpoint], callback);
    }

    requestVote(username: string, permlink: string, author: string, weight: number, callback?: Function) {
        this.send('requestVote', [username, permlink, author, weight], callback);
    }

    requestPost(username: string, title: string, body: string, parentPerm: string, parentAuthor: string, jsonMetadata: any, permlink: string, commentOptions?: any, callback?: Function, _rpc?: string): Promise<any> | void {
        // Handle flexible parameter positions - callback can be at position 8 or 9
        let actualCallback = callback;
        if (typeof commentOptions === 'function') {
            // commentOptions is actually the callback (old signature)
            actualCallback = commentOptions;
        }

        if (actualCallback) {
            this.send('requestPost', [username, title, body, parentPerm, parentAuthor, jsonMetadata, permlink], actualCallback);
        } else {
            // Return a Promise for async/await usage
            return new Promise((resolve, reject) => {
                this.send('requestPost', [username, title, body, parentPerm, parentAuthor, jsonMetadata, permlink], (response: any) => {
                    if (response && response.success) {
                        // Resolve with Hive Keychain compatible format
                        resolve({ success: true, result: response.result });
                    } else {
                        reject(response?.error || 'Unknown error');
                    }
                });
            });
        }
    }

    requestCustomJson(username: string, id: string, key: string, json: string, display_msg: string, callback?: Function) {
        this.send('requestCustomJson', [username, id, key, json, display_msg], callback);
    }

    requestSignBuffer(username: string, message: string, key: string, callback?: Function) {
        this.send('requestSignBuffer', [username, message, key], callback);
    }

    requestBroadcast(username: string, operations: any[], key: string, callback?: Function) {
        this.send('requestBroadcast', [username, operations, key], callback);
    }

    requestSignTx(username: string, operations: any[], key: string, callback?: Function) {
        this.send('requestBroadcast', [username, operations, key], callback);
    }

    // Generic Send
    private send(method: string, params: any[], callback?: Function) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        const id = Date.now().toString() + array[0].toString();

        if (callback) {
            console.log('[Gravity Provider] Registering callback for ID:', id, 'Method:', method);
            this.callbacks.set(id, callback);
        } else {
            console.warn('[Gravity Provider] No callback provided for method:', method);
        }

        // Security fix: restrict message target to the same origin where the script is running
        console.log('[Gravity Provider] Sending request:', { id, method, params });
        window.postMessage({
            type: 'gravity_request',
            id,
            method,
            params,
            appName: 'GravityWallet'
        }, window.location.origin);
    }
}

// Expose globally
(window as any).gravity = new GravityProvider();

// Hive Keychain Alias (Compatibility Mode)
if (!(window as any).hive_keychain) {
    (window as any).hive_keychain = (window as any).gravity;
}

// WhaleVault Alias (Blurt Compatibility)
if (!(window as any).whalevault) {
    (window as any).whalevault = (window as any).gravity;
}

// Blurt Keychain Alias (Specific for BeBlurt and others)
if (!(window as any).blurt_keychain) {
    // console.log('Gravity: Injecting blurt_keychain alias');
    (window as any).blurt_keychain = (window as any).gravity;
}

// Steem Keychain Alias
if (!(window as any).steem_keychain) {
    (window as any).steem_keychain = (window as any).gravity;
}
// Dispatch Handshake Events (Announce Presence)
const dispatchHandshake = () => {
    window.dispatchEvent(new CustomEvent('hive_keychain_handshake'));
    window.dispatchEvent(new CustomEvent('whalevault_handshake'));
    window.dispatchEvent(new CustomEvent('steem_keychain_handshake'));
    window.dispatchEvent(new CustomEvent('blurt_keychain_handshake'));
    // console.log('Gravity: Handshake dispatched.');
};

dispatchHandshake();

// Retry on load to ensure listeners are ready
window.addEventListener('load', dispatchHandshake);

// Just in case, one more time after a short delay (common fix for race conditions)
setTimeout(dispatchHandshake, 1000);
