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

    /**
     * Main provider class implementing Keychain/WhaleVault API
     */
    class GravityProvider {
        private callbacks: Map<string, Function>;
        public readonly name: string;
        public readonly version: string;

        constructor() {
            this.name = PROVIDER_CONFIG.name;
            this.version = PROVIDER_CONFIG.version;
            this.callbacks = new Map();
            this.setupListener();
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
                    if (callback) {
                        callback(data.response);
                        this.callbacks.delete(data.id);
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
                    appName: PROVIDER_CONFIG.name
                }, window.location.origin);
            };

            if (callback) {
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
         */
        requestHandshake = (callback?: Function): Promise<ProviderResponse> | void => {
            const response: ProviderResponse = {
                success: true,
                message: 'Handshake successful',
                version: this.version,
                name: this.name
            };

            if (callback) {
                // Immediate callback response
                setTimeout(() => callback(response), 0);
            } else {
                return Promise.resolve(response);
            }
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
                            reject(response?.error || 'Unknown error');
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
         * Alias for requestSignBuffer (WhaleVault compatibility)
         */
        requestVerifyKey = (
            username: string,
            message: string,
            key: string,
            callback?: Function
        ): Promise<any> | void => {
            return this.requestSignBuffer(username, message, key, callback);
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
    }

    // ==================== Initialization ====================

    /**
     * Initialize the provider and set up global aliases
     */
    function initializeProvider(): void {
        const provider = new GravityProvider();

        // Set main gravity object
        (window as any).gravity = provider;
        (window as any)._gravityProvider = provider;

        // Set up wallet aliases for compatibility
        WALLET_ALIASES.forEach(alias => {
            const existing = (window as any)[alias];
            // Only inject if doesn't exist or is a placeholder without methods
            if (!existing || typeof existing.requestHandshake !== 'function') {
                (window as any)[alias] = provider;
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
