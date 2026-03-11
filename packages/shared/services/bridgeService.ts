import { io, Socket } from "socket.io-client";
import {
    generateEncryptionKeys,
    exportKeyToBase64,
    importKeyFromBase64,
    deriveSharedSecret,
    encryptMessage,
    decryptMessage
} from './cryptoService';

export interface SignRequest {
    id: string;
    method: string;
    params: any;
    origin: string;
    chain: string;
    payload: any;
}

export interface SignResponse {
    id: string;
    success: boolean;
    result?: any;
    error?: string;
}

class BridgeService {
    private socket: Socket | null = null;
    private serverUrl = 'https://gravity-chat-serve.onrender.com'; // Reusing chat server for demo
    private sessionId: string | null = null;
    private sharedKey: CryptoKey | null = null;
    private myKeyPair: CryptoKeyPair | null = null;

    public onStatusChange: ((status: string) => void) | null = null;
    public onSignRequest: ((request: SignRequest) => void) | null = null;
    public onSyncAccounts: ((accounts: any[]) => void) | null = null;
    public onValidatePIN: ((pin: string) => void) | null = null;

    public async init() {
        if (this.socket?.connected) return;

        console.log('[Bridge] Initializing socket connection to:', this.serverUrl);
        this.socket = io(this.serverUrl, {
            transports: ['polling', 'websocket'], // Try polling first for better compatibility
            autoConnect: true,
            reconnectionAttempts: 5,
            timeout: 10000
        });

        this.socket.on('connect', () => {
            console.log('[Bridge] Socket connected! ID:', this.socket?.id);
            if (this.onStatusChange) this.onStatusChange('connected');
        });

        this.socket.on('connect_error', (err) => {
            console.error('[Bridge] Socket connection error:', err.message);
            if (this.onStatusChange) this.onStatusChange('error: ' + err.message);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('[Bridge] Socket disconnected. Reason:', reason);
            if (this.onStatusChange) this.onStatusChange('disconnected');
        });

        this.socket.on('bridge_request', async (data: { encrypted: string }) => {
            if (!this.sharedKey) return;
            try {
                const decrypted = await decryptMessage(data.encrypted, this.sharedKey);
                const request = JSON.parse(decrypted);
                if (this.onSignRequest) this.onSignRequest(request);
            } catch (e) {
                console.error("Bridge decryption failed", e);
            }
        });

        this.socket.on('bridge_sync_accounts', async (data: { encrypted: string }) => {
            if (!this.sharedKey) return;
            try {
                const decrypted = await decryptMessage(data.encrypted, this.sharedKey);
                const accounts = JSON.parse(decrypted);
                if (this.onSyncAccounts) this.onSyncAccounts(accounts);
            } catch (e) {
                console.error("Bridge accounts sync failed", e);
            }
        });

        this.socket.on('bridge_validate_pin', async (data: { encrypted: string }) => {
            if (!this.sharedKey) return;
            try {
                const decrypted = await decryptMessage(data.encrypted, this.sharedKey);
                const { pin } = JSON.parse(decrypted);
                if (this.onValidatePIN) this.onValidatePIN(pin);
            } catch (e) {
                console.error("Bridge PIN validation failed", e);
            }
        });
    }

    // --- MOBILE SIDE (SIGNER) ---
    public async connectToExtension(qrData: string) {
        // qrData format: "gravity:bridge:<sessionId>:<extensionPublicKey>"
        const parts = qrData.split(':');
        if (parts[0] !== 'gravity' || parts[1] !== 'bridge') return;

        this.sessionId = parts[2];
        const extPubKeyB64 = parts[3];

        if (!this.socket) await this.init();

        // 1. Generate my keys
        this.myKeyPair = await generateEncryptionKeys();
        const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);

        // 2. Derive shared secret
        const extPubKey = await importKeyFromBase64(extPubKeyB64, 'public');
        this.sharedKey = await deriveSharedSecret(this.myKeyPair.privateKey, extPubKey);

        // 3. Join bridge room and announce myself
        this.socket?.emit('bridge_join', { sessionId: this.sessionId, publicKey: myPubB64 });
    }

    public async sendResponse(response: SignResponse) {
        if (!this.socket || !this.sharedKey || !this.sessionId) return;
        const encrypted = await encryptMessage(JSON.stringify(response), this.sharedKey);
        this.socket.emit('bridge_response', { sessionId: this.sessionId, encrypted });
    }

    // --- EXTENSION SIDE (REQUESTER) ---
    public async createBridgeSession(): Promise<string> {
        if (!this.socket) await this.init();

        this.sessionId = Math.random().toString(36).substring(2, 12);
        this.myKeyPair = await generateEncryptionKeys();
        const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);

        return `gravity:bridge:${this.sessionId}:${myPubB64}`;
    }

    public async waitForSigner(): Promise<void> {
        return new Promise((resolve) => {
            this.socket?.once('bridge_signer_ready', async (data: { publicKey: string }) => {
                if (this.myKeyPair) {
                    const signerPubKey = await importKeyFromBase64(data.publicKey, 'public');
                    this.sharedKey = await deriveSharedSecret(this.myKeyPair.privateKey, signerPubKey);
                    resolve();
                }
            });
        });
    }

    public async sendRequest(request: SignRequest): Promise<SignResponse> {
        if (!this.socket || !this.sharedKey || !this.sessionId) throw new Error("Bridge not ready");

        const encrypted = await encryptMessage(JSON.stringify(request), this.sharedKey);
        this.socket.emit('bridge_request', { sessionId: this.sessionId, encrypted });

        return new Promise((resolve) => {
            this.socket?.once('bridge_response', async (data: { encrypted: string }) => {
                const decrypted = await decryptMessage(data.encrypted, this.sharedKey!);
                resolve(JSON.parse(decrypted));
            });
        });
    }

    public async syncAccounts(accounts: any[]) {
        if (!this.socket || !this.sharedKey || !this.sessionId) throw new Error("Bridge not ready");
        const encrypted = await encryptMessage(JSON.stringify(accounts), this.sharedKey);
        this.socket.emit('bridge_sync_accounts', { sessionId: this.sessionId, encrypted });
    }

    public async validatePairing(pin: string) {
        if (!this.socket || !this.sharedKey || !this.sessionId) throw new Error("Bridge not ready");
        const encrypted = await encryptMessage(JSON.stringify({ pin }), this.sharedKey);
        this.socket.emit('bridge_validate_pin', { sessionId: this.sessionId, encrypted });
    }
}

export const bridgeService = new BridgeService();
