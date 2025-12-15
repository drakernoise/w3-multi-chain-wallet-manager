(function () {
    // IMPORTANT: Set this to the exact origin your app is served from
    // e.g. 'https://example.com'
    const TRUSTED_ORIGIN = 'https://example.com';
    console.log('Gravity: Initializing native provider (Clean JS)...');

    class GravityProvider {
        constructor(chainHint = null) {
            this.callbacks = new Map();
            this.version = "1.0"; // Mimic version
            this.name = "Gravity";
            this.chainHint = chainHint; // 'HIVE', 'BLURT', or null
            this.setupListener();
        }

        setupListener() {
            window.addEventListener('message', (event) => {
                if (event.source !== window) return;
                const data = event.data;
                if (data && data.type === 'gravity_response') {
                    // Only process if THIS provider has the callback (avoids conflict between Hive/Blurt instances)
                    const callback = this.callbacks.get(data.id);
                    if (callback) {
                        // console.log('Gravity Debug: Received response from background:', data.response);
                        callback(data.response);
                        this.callbacks.delete(data.id);
                    }
                }
            });
        }

        requestHandshake(callback) {
            console.log('Gravity: requestHandshake called');
            if (callback) callback();
        }

        requestTransfer(username, to, amount, memo, currency, callback, enforceEndpoint) {
            this.send('requestTransfer', [username, to, amount, memo, currency, enforceEndpoint], callback);
        }

        requestVote(username, permlink, author, weight, callback) {
            this.send('requestVote', [username, permlink, author, weight], callback);
        }

        requestPost(username, title, body, parentPerm, parentAuthor, jsonMetadata, permlink, callback) {
            this.send('requestPost', [username, title, body, parentPerm, parentAuthor, jsonMetadata, permlink], callback);
        }

        requestCustomJson(username, id, key, json, display_msg, callback) {
            this.send('requestCustomJson', [username, id, key, json, display_msg], callback);
        }

        requestSignBuffer(username, message, key, callback) {
            this.send('requestSignBuffer', [username, message, key], callback);
        }

        requestBroadcast(username, operations, key, callback) {
            this.send('requestBroadcast', [username, operations, key], callback);
        }

        requestSignTx(username, operations, key, callback) {
            this.send('requestBroadcast', [username, operations, key], callback);
        }

        // Add dummy methods for compatibility if checked
        requestAddAccount(username, keys, callback) { this.send('requestAddAccount', [username, keys], callback); }
        requestEncodeMessage(username, receiver, message, key, callback) { this.send('requestEncodeMessage', [username, receiver, message, key], callback); }
        requestVerifyKey(username, key, callback) { this.send('requestVerifyKey', [username, key], callback); }
        requestDelegation(username, delegatee, amount, unit, callback) { this.send('requestDelegation', [username, delegatee, amount, unit], callback); }
        requestPowerUp(username, to, amount, callback) { this.send('requestPowerUp', [username, to, amount], callback); }
        requestPowerDown(username, amount, callback) { this.send('requestPowerDown', [username, amount], callback); }
        requestWitnessVote(username, witness, vote, callback) { this.send('requestWitnessVote', [username, witness, vote], callback); }
        requestProxy(username, proxy, callback) { this.send('requestProxy', [username, proxy], callback); }
        requestSignedCall(account, method, params, key, callback) { this.send('requestSignedCall', [account, method, params, key], callback); }

        send(method, params, callback) {
            // console.log(`Gravity Debug: send called for ${method}`, params);
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            const id = Date.now().toString() + array[0].toString();
            if (callback) {
                this.callbacks.set(id, callback);
            }
            window.postMessage({
                type: 'gravity_request',
                id,
                method,
                params,
                appName: 'GravityWallet',
                requestChain: this.chainHint // Pass the hint to background
            }, TRUSTED_ORIGIN);
        }
    }

    // Create chain-specific instances
    const hiveProvider = new GravityProvider('HIVE');
    const blurtProvider = new GravityProvider('BLURT');

    // Fallback?
    const defaultProvider = hiveProvider;

    // Create Proxies
    const createProxy = (provider) => new Proxy(provider, {
        get: function (target, prop, receiver) {
            if (prop in target) {
                return Reflect.get(target, prop, receiver);
            }
            if (typeof prop === 'string') {
                // console.warn(`Gravity Debug: DApp tried to access MISSING property: '${prop}'`);
            }
            return undefined;
        }
    });

    const hiveProxy = createProxy(hiveProvider);
    const blurtProxy = createProxy(blurtProvider);

    // Expose globally
    window.gravity = hiveProxy; // Default gravity uses HIVE logic? Or maybe we want Blurt users to use 'gravity'? 
    // Usually 'gravity' is generic. Let's make it Hive for now as it's the dominant.

    // Force Aliases
    window.hive_keychain = hiveProxy;
    window.steem_keychain = hiveProxy; // Steem behaves like Hive (STM prefix)

    window.blurt_keychain = blurtProxy;
    window.whalevault = blurtProxy; // Whalevault is often Blurt-related? Or just generic.

    console.log('Gravity: Aliases enforced with Proxy logger.');

    // Dispatch Handshake
    // Dispatch Handshake
    const dispatchHandshake = () => {
        window.dispatchEvent(new CustomEvent('hive_keychain_handshake', { detail: { keychain: hiveProxy } }));
        window.dispatchEvent(new CustomEvent('steem_keychain_handshake', { detail: { keychain: hiveProxy } }));

        window.dispatchEvent(new CustomEvent('blurt_keychain_handshake', { detail: { keychain: blurtProxy } }));
        window.dispatchEvent(new CustomEvent('whalevault_handshake', { detail: { keychain: blurtProxy } })); // or hive?

        console.log('Gravity: Handshake dispatched.');
    };

    dispatchHandshake();

    // Retry
    window.addEventListener('load', dispatchHandshake);
    setTimeout(dispatchHandshake, 500);
    setTimeout(dispatchHandshake, 2000);

})();
