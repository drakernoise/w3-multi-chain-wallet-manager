import { App, URLOpenListenerEvent } from '@capacitor/app';

export interface DAppPermission {
    domain: string;
    operations: string[]; // ['transfer', 'vote', 'post', etc.]
    expiresAt: number; // timestamp
    grantedAt: number;
    defaultAccount?: string;
}

export interface SignRequest {
    id: string;
    domain: string;
    operation: string;
    params: any;
    timestamp: number;
    callbackUrl?: string;
    preConfirmed?: boolean;
    rememberDuration?: '1day' | '1week' | '1month';
}

class MobileProviderService {
    private permissions: Map<string, DAppPermission> = new Map();
    private pendingRequests: Map<string, SignRequest> = new Map();
    private listeners: ((request: SignRequest) => void)[] = [];
    private bridgeCallbacks: Map<string, (res: any) => void> = new Map();

    constructor() {
        this.loadPermissions();
        this.setupDeepLinkListener();
    }

    private setupDeepLinkListener() {
        App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
            console.log('[MobileProvider] Deep link received:', event.url);
            this.handleDeepLink(event.url);
        });
    }

    private handleDeepLink(url: string) {
        console.log('[MobileProvider] handleDeepLink called with:', url);
        try {
            const parsedUrl = new URL(url);
            const scheme = parsedUrl.protocol.replace(':', '').toLowerCase();
            const validSchemes = ['gravitywallet', 'whalevault', 'hive', 'steem', 'blurt'];

            if (!validSchemes.includes(scheme)) {
                console.log('[MobileProvider] Unsupported scheme:', scheme);
                return;
            }

            console.log(`[MobileProvider] Handling ${scheme} protocol`);

            const params: any = {};
            // Extract query params
            parsedUrl.searchParams.forEach((value, key) => {
                params[key] = value;
            });

            // Protocol Mapping (Normalization)
            let domain = params.domain || params.app || 'unknown';
            let operation = params.operation || params.op || 'unknown';
            
            // Handle hive://sign/voters/... style path params if needed
            if (!params.operation && parsedUrl.pathname.includes('/sign/')) {
                const parts = parsedUrl.pathname.split('/');
                operation = parts[2]; // hive://sign/transfer -> transfer
            }

            const request: SignRequest = {
                id: params.id || Date.now().toString(),
                domain: domain,
                operation: operation,
                params: params,
                timestamp: Date.now(),
                callbackUrl: params.callback || params.redirect_uri
            };

            console.log('[MobileProvider] Created normalized request:', request.id, 'Op:', request.operation);
            this.pendingRequests.set(request.id, request);
            this.notifyListeners(request);
        } catch (e) {
            console.error('[MobileProvider] Failed to parse deep link:', e);
        }
    }

    /**
     * Handles requests from the In-App Browser bridge
     */
    public handleBridgeRequest(data: any, sendResponse: (res: any) => void) {
        console.log('[MobileProvider] Bridge request received:', JSON.stringify(data));
        console.log('[GWDBG][mobile-provider:bridge-request]', JSON.stringify({ id: data?.id, method: data?.method, domain: data?.domain, hasParams: !!data?.params }));
        
        if (!data.method || !data.id) {
            console.error('[MobileProvider] Invalid bridge request data');
            console.error('[GWDBG][mobile-provider:invalid-bridge-request]', JSON.stringify(data));
            return;
        }

        const request: SignRequest = {
            id: data.id,
            domain: data.domain || 'in-app-browser',
            operation: data.method,
            params: data.params,
            timestamp: Date.now(),
            preConfirmed: data.preConfirmed,
            rememberDuration: data?.params?.rememberDuration
        };

        console.log(`[MobileProvider] Normalized bridge request: ${request.id} (${request.operation})`);
        console.log('[GWDBG][mobile-provider:normalized-request]', JSON.stringify({ id: request.id, operation: request.operation, domain: request.domain, preConfirmed: request.preConfirmed, rememberDuration: request.rememberDuration || null }));
        
        // Store callback for this specific request
        this.bridgeCallbacks.set(request.id, sendResponse);
        
        this.pendingRequests.set(request.id, request);
        this.notifyListeners(request);
    }

    public onSignRequest(callback: (request: SignRequest) => void) {
        console.log('[MobileProvider] Registering sign request listener');
        console.log('[MobileProvider] Pending requests count:', this.pendingRequests.size);
        this.listeners.push(callback);
        // Replay pending requests immediately
        this.pendingRequests.forEach(req => {
            console.log('[MobileProvider] Replaying pending request:', req.id);
            callback(req);
        });
    }

    public async grantPermission(domain: string, operations: string[], duration: '1day' | '1week' | '1month', defaultAccount?: string) {
        const now = Date.now();
        const durations = {
            '1day': 24 * 60 * 60 * 1000,
            '1week': 7 * 24 * 60 * 60 * 1000,
            '1month': 30 * 24 * 60 * 60 * 1000
        };

        const existing = this.permissions.get(domain);
        const mergedOperations = Array.from(new Set([...(existing?.operations || []), ...operations]));

        const permission: DAppPermission = {
            domain,
            operations: mergedOperations,
            expiresAt: now + durations[duration],
            grantedAt: existing?.grantedAt || now,
            defaultAccount: defaultAccount || existing?.defaultAccount
        };

        this.permissions.set(domain, permission);
        await this.savePermissions();
    }

    public revokePermission(domain: string) {
        this.permissions.delete(domain);
        this.savePermissions();
    }

    public hasPermission(domain: string, operation: string): boolean {
        const permission = this.getPermission(domain);
        if (!permission) return false;

        return permission.operations.includes(operation) || permission.operations.includes('*');
    }

    public getPermission(domain: string): DAppPermission | null {
        const permission = this.permissions.get(domain);
        if (!permission) return null;

        // Check if expired
        if (Date.now() > permission.expiresAt) {
            this.revokePermission(domain);
            return null;
        }

        return permission;
    }

    public getPermissions(): DAppPermission[] {
        return Array.from(this.permissions.values());
    }

    public getPendingRequest(id: string) {
        return this.pendingRequests.get(id);
    }

    public approveRequest(requestId: string, result: any) {
        console.log(`[MobileProvider] approving request: ${requestId}`);
        console.log('[GWDBG][mobile-provider:approve]', JSON.stringify({ requestId, hasResult: !!result, resultType: typeof result }));
        const request = this.pendingRequests.get(requestId);
        if (!request) return;

        // Check if it's a bridge request
        const bridgeCallback = this.bridgeCallbacks.get(requestId);
        if (bridgeCallback) {
            console.log(`[MobileProvider] Sending APPROVE to bridge: ${requestId}`);
            console.log('[GWDBG][mobile-provider:approve-bridge-callback]', JSON.stringify({ requestId }));
            const payload =
                result && typeof result === 'object'
                    ? { id: requestId, success: true, ...result }
                    : { id: requestId, success: true, result: result };
            console.log('[GWDBG][mobile-provider:approve-payload]', JSON.stringify({
                requestId,
                payloadKeys: Object.keys(payload),
                hasPublicKey: !!payload.publicKey,
                resultType: typeof payload.result
            }));
            bridgeCallback(payload);
            this.bridgeCallbacks.delete(requestId);
        }

        // For bridge requests, the callback is handled via bridgeCallback
        // For standard deep links, we just clear the request. 
        // We REMOVE window.location.href redirects as they are unsafe in mobile/hybrid context.
        this.pendingRequests.delete(requestId);
    }

    public rejectRequest(requestId: string) {
        console.log(`[MobileProvider] rejecting request: ${requestId}`);
        console.log('[GWDBG][mobile-provider:reject]', JSON.stringify({ requestId }));
        const request = this.pendingRequests.get(requestId);
        if (!request) return;

        // Check if it's a bridge request
        const bridgeCallback = this.bridgeCallbacks.get(requestId);
        if (bridgeCallback) {
            console.log(`[MobileProvider] Sending REJECT to bridge: ${requestId}`);
            console.log('[GWDBG][mobile-provider:reject-bridge-callback]', JSON.stringify({ requestId }));
            bridgeCallback({ id: requestId, success: false, error: 'User rejected' });
            this.bridgeCallbacks.delete(requestId);
        }

        // For bridge requests, the callback is handled via bridgeCallback
        // For standard deep links, we just clear the request.
        this.pendingRequests.delete(requestId);
    }

    private async loadPermissions() {
        try {
            const stored = localStorage.getItem('gravity_mobile_permissions');
            if (stored) {
                const data = JSON.parse(stored);
                this.permissions = new Map(Object.entries(data));
            }
        } catch (e) {
            console.error('[MobileProvider] Failed to load permissions:', e);
        }
    }

    private async savePermissions() {
        try {
            const data = Object.fromEntries(this.permissions);
            localStorage.setItem('gravity_mobile_permissions', JSON.stringify(data));
        } catch (e) {
            console.error('[MobileProvider] Failed to save permissions:', e);
        }
    }

    private notifyListeners(request: SignRequest) {
        this.listeners.forEach(listener => listener(request));
    }
}

export const mobileProvider = new MobileProviderService();
