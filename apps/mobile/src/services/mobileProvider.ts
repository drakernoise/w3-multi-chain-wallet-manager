import { App, URLOpenListenerEvent } from '@capacitor/app';

export interface DAppPermission {
    domain: string;
    operations: string[]; // ['transfer', 'vote', 'post', etc.]
    expiresAt: number; // timestamp
    grantedAt: number;
}

export interface SignRequest {
    id: string;
    domain: string;
    operation: string;
    params: any;
    timestamp: number;
    callbackUrl?: string;
}

class MobileProviderService {
    private permissions: Map<string, DAppPermission> = new Map();
    private pendingRequests: Map<string, SignRequest> = new Map();
    private listeners: ((request: SignRequest) => void)[] = [];

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
        try {
            const parsedUrl = new URL(url);

            // gravitywallet://sign?domain=example.com&operation=transfer&amount=10&to=user&callback=https://...
            if (parsedUrl.protocol === 'gravitywallet:' && parsedUrl.host === 'sign') {
                const params = Object.fromEntries(parsedUrl.searchParams);
                const request: SignRequest = {
                    id: Date.now().toString(),
                    domain: params.domain || 'unknown',
                    operation: params.operation || 'unknown',
                    params: params,
                    timestamp: Date.now(),
                    callbackUrl: params.callback
                };

                this.pendingRequests.set(request.id, request);
                this.notifyListeners(request);
            }
        } catch (e) {
            console.error('[MobileProvider] Failed to parse deep link:', e);
        }
    }

    public onSignRequest(callback: (request: SignRequest) => void) {
        this.listeners.push(callback);
    }

    public async grantPermission(domain: string, operations: string[], duration: '1day' | '1week' | '1month') {
        const now = Date.now();
        const durations = {
            '1day': 24 * 60 * 60 * 1000,
            '1week': 7 * 24 * 60 * 60 * 1000,
            '1month': 30 * 24 * 60 * 60 * 1000
        };

        const permission: DAppPermission = {
            domain,
            operations,
            expiresAt: now + durations[duration],
            grantedAt: now
        };

        this.permissions.set(domain, permission);
        await this.savePermissions();
    }

    public revokePermission(domain: string) {
        this.permissions.delete(domain);
        this.savePermissions();
    }

    public hasPermission(domain: string, operation: string): boolean {
        const permission = this.permissions.get(domain);
        if (!permission) return false;

        // Check if expired
        if (Date.now() > permission.expiresAt) {
            this.revokePermission(domain);
            return false;
        }

        return permission.operations.includes(operation) || permission.operations.includes('*');
    }

    public getPermissions(): DAppPermission[] {
        return Array.from(this.permissions.values());
    }

    public approveRequest(requestId: string, signature: string) {
        const request = this.pendingRequests.get(requestId);
        if (!request) return;

        if (request.callbackUrl) {
            // Redirect back to dApp with signature
            const callbackUrl = new URL(request.callbackUrl);
            callbackUrl.searchParams.set('signature', signature);
            callbackUrl.searchParams.set('success', 'true');

            window.location.href = callbackUrl.toString();
        }

        this.pendingRequests.delete(requestId);
    }

    public rejectRequest(requestId: string) {
        const request = this.pendingRequests.get(requestId);
        if (!request) return;

        if (request.callbackUrl) {
            const callbackUrl = new URL(request.callbackUrl);
            callbackUrl.searchParams.set('success', 'false');
            callbackUrl.searchParams.set('error', 'User rejected');

            window.location.href = callbackUrl.toString();
        }

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
