/**
 * Gravity Wallet Provider
 * 
 * This script provides a standard-compliant API for interacting with Graphene-based blockchains
 * (Hive, Blurt, Steem). It implements compatibility with Hive Keychain and WhaleVault APIs.
 * 
 * @version 1.0.5
 */

// Prevent multiple injections
if (!(window as any)._gravityProvider) {

    // Configuration
    const PROVIDER_CONFIG = {
        name: 'Gravity',
        version: '1.0.5',
        messageType: 'gravity_request',
        responseType: 'gravity_response'
    } as const;

    // Supported wallet aliases for multi-chain compatibility
    const WALLET_ALIASES = [
        'hive_keychain',
        'whalevault',
        'blurt_keychain',
        'blurt',
        'steem_keychain'
    ] as const;

    // Handshake events for wallet detection
    const HANDSHAKE_EVENTS = [
        'hive_keychain_handshake',
        'whalevault_handshake',
        'steem_keychain_handshake',
        'blurt_keychain_handshake'
    ] as const;

    /**
     * Response interface for API calls
     */
    interface ProviderResponse {
        success: boolean;
        message?: string;
        result?: any;
        error?: string;
        [key: string]: any;
    }

    class GravityProvider {
        private callbacks: Map<string, Function>;
        public readonly name: string;
        public readonly version: string;
        public current_rpc: string;
        private readonly chainHint: 'HIVE' | 'BLURT' | 'STEEM' | null;

        constructor(chainHint: 'HIVE' | 'BLURT' | 'STEEM' | null = null) {
            this.name = PROVIDER_CONFIG.name;
            this.version = PROVIDER_CONFIG.version;
            this.callbacks = new Map();
            this.chainHint = chainHint;
            this.setupListener();

            // Synchronous RPC Discovery from injected dataset (provided by content script)
            let activeNodes: any = {};
            try {
                const datasetRpc = document.documentElement.dataset.gravityActiveRpc;
                if (datasetRpc) {
                    activeNodes = JSON.parse(datasetRpc);
                }
            } catch (e) { }

            // Detect current chain from URL to avoid cross-chain RPC leaks
            const host = window.location.hostname.toLowerCase();
            let chain = 'HIVE';
            if (host.includes('blurt')) chain = 'BLURT';
            else if (host.includes('steem')) chain = 'STEEM';

            // Set default RPC based on detected chain or injected nodes
            const defaults: Record<string, string> = {
                'HIVE': 'https://api.hive.blog',
                'STEEM': 'https://api.steemit.com',
                'BLURT': 'https://rpc.drakernoise.com'
            };

            this.current_rpc = activeNodes[chain] || defaults[chain];
        }

        /**
         * Set up message listener for responses from the extension
         */
        private setupListener(): void {
            window.addEventListener('message', (event: MessageEvent) => {
                // Security: only accept messages from same window
                if (event.source !== window) return;

                const data = event.data;
                if (data?.type === PROVIDER_CONFIG.responseType) {
                    const callback = this.callbacks.get(data.id);
                    if (callback && typeof callback === 'function') {
                        callback(data.response);
                        this.callbacks.delete(data.id);

                        // Dispatch compatibility events for dApps that listen to events instead of callbacks
                        try {
                            const responseEvent = new CustomEvent('hive_keychain_response', {
                                detail: { ...data.response, request_id: data.id }
                            });
                            window.dispatchEvent(responseEvent);
                            document.dispatchEvent(responseEvent);
                        } catch (e) {
                            // Ignore event dispatch errors
                        }
                    }
                }
            });
        }

        /**
         * Generate a unique request ID
         */
        private generateId(): string {
            const randomBytes = new Uint32Array(1);
            window.crypto.getRandomValues(randomBytes);
            return `${Date.now()}-${randomBytes[0]}`;
        }

        /**
         * Send a request to the extension
         */
        private send(method: string, params: any[], callback?: Function): Promise<any> | void {
            const id = this.generateId();

            const sendMessage = (): void => {
                window.postMessage({
                    type: PROVIDER_CONFIG.messageType,
                    id,
                    method,
                    params,
                    appName: PROVIDER_CONFIG.name,
                    requestChain: this.chainHint
                }, window.location.origin);
            };

            if (typeof callback === 'function') {
                this.callbacks.set(id, callback);
                sendMessage();
            } else {
                return new Promise((resolve, reject) => {
                    this.callbacks.set(id, (response: ProviderResponse) => {
                        if (response.success) {
                            resolve(response);
                        } else {
                            reject(response);
                        }
                    });
                    sendMessage();
                });
            }
        }

        // ==================== API Methods ====================

        /**
         * Handshake to verify extension is installed and ready
         * Supports both (callback) and (appId, callback) for WhaleVault parity
         */
        requestHandshake = (appIdOrCallback?: string | Function, callback?: Function): Promise<ProviderResponse> | void => {
            const actualCallback = typeof appIdOrCallback === 'function' ? appIdOrCallback : callback;
            
            const response: ProviderResponse = {
                success: true,
                message: 'Handshake successful',
                version: this.version,
                name: this.name,
                rpc: this.current_rpc
            };

            if (actualCallback) {
                setTimeout(() => actualCallback(response), 0);
            } else {
                return Promise.resolve(response);
            }
        }

        /**
         * Decode a memo encrypted with a private key
         */
        decodeMemo = (
            username: string,
            memo: string,
            key: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.send('decodeMemo', [username, memo, key], callback);
        }

        /**
         * Encode a memo for a recipient
         */
        encodeMemo = (
            username: string,
            receiver: string,
            memo: string,
            key: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.send('encodeMemo', [username, receiver, memo, key], callback);
        }

        /**
         * Request a transfer transaction
         */
        requestTransfer = (
            username: string,
            to: string,
            amount: string,
            memo: string,
            currency: string,
            callback?: Function,
            enforceEndpoint?: boolean
        ): Promise<any> | void => {
            return this.send('requestTransfer', [username, to, amount, memo, currency, enforceEndpoint], callback);
        }

        /**
         * Request a vote transaction
         */
        requestVote = (
            username: string,
            permlink: string,
            author: string,
            weight: number,
            callback?: Function
        ): Promise<any> | void => {
            return this.send('requestVote', [username, permlink, author, weight], callback);
        }

        /**
         * Request a post/comment transaction
         */
        requestPost = (
            username: string,
            title: string,
            body: string,
            parentPerm: string,
            parentAuthor: string,
            jsonMetadata: any,
            permlink: string,
            commentOptions?: any,
            callback?: Function,
            _rpc?: string
        ): Promise<any> | void => {
            // Handle flexible callback parameter position
            const actualCallback = typeof commentOptions === 'function' ? commentOptions : callback;

            if (actualCallback) {
                return this.send('requestPost', [username, title, body, parentPerm, parentAuthor, jsonMetadata, permlink], actualCallback);
            } else {
                return new Promise((resolve, reject) => {
                    this.send('requestPost', [username, title, body, parentPerm, parentAuthor, jsonMetadata, permlink], (response: ProviderResponse) => {
                        if (response?.success) {
                            resolve({ success: true, result: response.result });
                        } else {
                            reject(response);
                        }
                    });
                });
            }
        }

        /**
         * Request a custom JSON transaction
         */
        requestCustomJson = (
            username: string,
            id: string,
            key: string,
            json: string,
            display_msg: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.send('requestCustomJson', [username, id, key, json, display_msg], callback);
        }

        /**
         * Request message signing
         */
        requestSignBuffer = (
            username: string,
            message: string,
            key: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.send('requestSignBuffer', [username, message, key], callback);
        }

        /**
         * Decrypt an encrypted challenge to prove ownership of a private key.
         *
         * Keychain semantics: `encryptedMessage` is an encrypted memo (starts with '#')
         * that gets DECODED with the account's private key — it is not signed. dApps use
         * it for proof-of-key login: they encrypt a nonce to the account's public key and
         * check that the returned plaintext matches.
         */
        requestVerifyKey = (
            username: string,
            encryptedMessage: string,
            key: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.send('requestVerifyKey', [username, encryptedMessage, key], callback);
        }

        /**
         * Request transaction broadcast
         */
        requestBroadcast = (
            username: string,
            operations: any[],
            key: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.send('requestBroadcast', [username, operations, key], callback);
        }

        /**
         * Alias for requestBroadcast
         */
        requestSignTx = (
            username: string,
            operations: any[],
            key: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.requestBroadcast(username, operations, key, callback);
        }

        /**
         * Request signed call (BlurtWallet/Blurt Keychain specific)
         * This method is required by BlurtWallet's hasCompatibleKeychain() check
         */
        requestSignedCall = (
            username: string,
            method: string,
            params: any,
            key: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.send('requestSignedCall', [username, method, params, key], callback);
        }

        /**
         * Request Power Up (Staking)
         */
        requestPowerUp = (
            username: string,
            to: string,
            amount: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.send('requestPowerUp', [username, to, amount], callback);
        }

        /**
         * Request Power Down (Unstaking)
         */
        requestPowerDown = (
            username: string,
            vestingShares: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.send('requestPowerDown', [username, vestingShares], callback);
        }

        /**
         * Request Delegation
         */
        requestDelegation = (
            username: string,
            delegatee: string,
            amount: string,
            unit: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.send('requestDelegation', [username, delegatee, amount, unit], callback);
        }

        /**
         * Get the current RPC node being used by the wallet
         */
        requestRpc = (callback?: Function): Promise<any> | void => {
            if (typeof callback === 'function') {
                callback({ rpc: this.current_rpc });
            } else {
                return Promise.resolve({ rpc: this.current_rpc });
            }
        }

        /**
         * Request the wallet to switch to a different RPC node
         */
        requestSwitchRpc = (rpc: string, callback?: Function): Promise<any> | void => {
            this.current_rpc = rpc;
            if (typeof callback === 'function') {
                callback({ success: true, message: 'RPC switch requested' });
            } else {
                return Promise.resolve({ success: true, message: 'RPC switch requested' });
            }
        }

    }

    // ==================== Initialization ====================

    /**
     * Initialize the provider and set up global aliases
     */
    function initializeProvider(): void {
        const hiveProvider = new GravityProvider('HIVE');
        const blurtProvider = new GravityProvider('BLURT');
        const steemProvider = new GravityProvider('STEEM');
        const defaultProvider = hiveProvider;

        // Set main gravity object
        (window as any).gravity = defaultProvider;
        (window as any)._gravityProvider = defaultProvider;

        const aliasProviders: Record<typeof WALLET_ALIASES[number], GravityProvider> = {
            hive_keychain: hiveProvider,
            whalevault: blurtProvider,
            blurt_keychain: blurtProvider,
            blurt: blurtProvider,
            steem_keychain: steemProvider
        };

        WALLET_ALIASES.forEach(alias => {
            const existing = (window as any)[alias];
            if (!existing || typeof existing.requestHandshake !== 'function') {
                (window as any)[alias] = aliasProviders[alias];
            }
        });
    }

    /**
     * Dispatch handshake events to notify dApps of wallet presence
     */
    function dispatchHandshakeEvents(): void {
        const detail = {
            version: PROVIDER_CONFIG.version,
            name: PROVIDER_CONFIG.name
        };

        HANDSHAKE_EVENTS.forEach(eventName => {
            // Dispatch on both window and document for maximum compatibility
            window.dispatchEvent(new CustomEvent(eventName, { detail }));
            document.dispatchEvent(new CustomEvent(eventName, { detail }));
        });
    }

    /**
     * Set up event dispatching with retries for race condition handling
     */
    function setupEventDispatching(): void {
        // Immediate dispatch
        dispatchHandshakeEvents();

        // Dispatch on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', dispatchHandshakeEvents);
        }

        // Dispatch on window load
        window.addEventListener('load', dispatchHandshakeEvents);

        // Delayed dispatches for apps that initialize asynchronously
        setTimeout(dispatchHandshakeEvents, 100);
        setTimeout(dispatchHandshakeEvents, 500);
        setTimeout(dispatchHandshakeEvents, 1000);
        setTimeout(dispatchHandshakeEvents, 2000);
    }

    // Initialize everything
    initializeProvider();
    setupEventDispatching();
}
