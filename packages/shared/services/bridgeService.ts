import { io, Socket } from "socket.io-client";
import { SyncPayload } from '../types';
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
    private serverUrl = 'https://chat.gravitywallet.drakernoise.com';
    private sessionId: string | null = null;
    private sharedKey: CryptoKey | null = null;
    private myKeyPair: CryptoKeyPair | null = null;

    public onStatusChange: ((status: string) => void) | null = null;
    public onSignRequest: ((request: SignRequest) => void) | null = null;
    public onSyncAccounts: ((payload: SyncPayload) => void) | null = null;
    public onValidatePIN: ((pin: string) => void) | null = null;
    public onLog: ((msg: string) => void) | null = null;

    private logs: string[] = [];

    private addLog(msg: string) {
        const timestamp = new Date().toLocaleTimeString();
        const formattedLog = `[${timestamp}] ${msg}`;
        this.logs.push(formattedLog);
        this.onLog?.(formattedLog);
        console.log(`[BridgeService] ${msg}`);
    }

    public getLogs() {
        return this.logs;
    }

    public async init() {
        if (this.socket?.connected) return;

        this.addLog(`Initializing connection to ${this.serverUrl}`);
        this.socket = io(this.serverUrl, {
            transports: ['polling', 'websocket'],
            autoConnect: true,
            reconnectionAttempts: 5,
            timeout: 10000
        });

        this.socket.on('connect', () => {
            this.addLog('Socket connected successfully');
            this.onStatusChange?.('connected');
        });

        this.socket.on('connect_error', (err) => {
            this.addLog(`Socket connection error: ${err.message}`);
            this.onStatusChange?.('error');
        });

        this.socket.on('disconnect', (reason) => {
            this.addLog(`Socket disconnected: ${reason}`);
            this.onStatusChange?.('disconnected');
        });

        this.socket.on('bridge_signer_ready', () => {
            this.addLog('Received bridge_signer_ready (Signer appeared)');
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
                const parsed = JSON.parse(decrypted);
                const payload: SyncPayload = Array.isArray(parsed)
                    ? { timestamp: Date.now(), accounts: parsed }
                    : parsed;
                if (this.onSyncAccounts) this.onSyncAccounts(payload);
            } catch (e) {
                console.error("Bridge accounts sync failed", e);
            }
        });

        this.socket.on('bridge_validate_pin', async (data: { encrypted: string }) => {
            if (!this.sharedKey) return;
            try {
                const decrypted = await decryptMessage(data.encrypted, this.sharedKey);
                const { pin } = JSON.parse(decrypted);
                this.addLog('Decrypted PIN request from mobile');
                if (this.onValidatePIN) await this.onValidatePIN(pin);
            } catch (e) {
                console.error("Bridge PIN validation failed", e);
            }
        });
    }

    // --- MOBILE SIDE (SIGNER) ---
    public async connectToExtension(qrData: string) {
        const parts = qrData.split(':');
        if (parts[0] !== 'gravity' || parts[1] !== 'bridge') return;

        this.sessionId = parts[2];
        const extPubKeyB64 = parts[3];

        if (!this.socket) await this.init();

        this.myKeyPair = await generateEncryptionKeys();
        const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);

        const extPubKey = await importKeyFromBase64(extPubKeyB64, 'public');
        this.sharedKey = await deriveSharedSecret(this.myKeyPair.privateKey, extPubKey);

        this.addLog(`Joining bridge room: ${this.sessionId} with publicKey`);
        this.socket?.emit('bridge_join', { sessionId: this.sessionId, publicKey: myPubB64 });
        this.addLog('Sent bridge_join event');
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
        this.addLog(`Created new bridge session: ${this.sessionId}`);
        
        this.myKeyPair = await generateEncryptionKeys();
        const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);

        this.addLog(`Extension joining bridge room: ${this.sessionId}`);
        this.socket?.emit('bridge_join', { sessionId: this.sessionId, publicKey: myPubB64 }); // Sending publicKey here so server relays it later

        return `gravity:bridge:${this.sessionId}:${myPubB64}`;
    }

    public async waitForSigner(): Promise<void> {
        return new Promise((resolve) => {
            this.socket?.once('bridge_signer_ready', async (data: { publicKey: string }) => {
                if (this.myKeyPair) {
                    const signerPubKey = await importKeyFromBase64(data.publicKey, 'public');
                    this.sharedKey = await deriveSharedSecret(this.myKeyPair.privateKey, signerPubKey);
                    this.addLog('Shared key derived with signer');
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

    public async syncAccounts(payload: SyncPayload | any[]) {
        if (!this.socket || !this.sharedKey || !this.sessionId) throw new Error("Bridge not ready");
        const normalizedPayload: SyncPayload = Array.isArray(payload)
            ? { timestamp: Date.now(), accounts: payload }
            : payload;
        const encrypted = await encryptMessage(JSON.stringify(normalizedPayload), this.sharedKey);
        this.socket.emit('bridge_sync_accounts', { sessionId: this.sessionId, encrypted });
        this.addLog(`Sent bridge_sync_accounts with ${normalizedPayload.accounts.length} accounts`);
        this.onStatusChange?.('paired');
    }

    public async validatePairing(pin: string) {
        if (!this.socket || !this.sharedKey || !this.sessionId) throw new Error("Bridge not ready");
        const encrypted = await encryptMessage(JSON.stringify({ pin }), this.sharedKey);
        this.socket.emit('bridge_validate_pin', { sessionId: this.sessionId, encrypted });
        this.addLog('Sent bridge_validate_pin to extension');
    }
}

export const bridgeService = new BridgeService();
