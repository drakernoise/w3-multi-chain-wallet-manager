import { io, Socket } from "socket.io-client";
import { SyncPayload, Account } from '../types';
import { exportKeyToBase64 } from './cryptoService';
import { chatService } from './chatService';
import { storageService } from './storageService';

class SyncService {
    private socket: Socket | null = null;
    private serverUrl = 'https://gravity-chat-serve.onrender.com';

    // EXPORT FLOW (Sender)
    public async startExportSession(
        accounts: Account[],
        settings: any,
        onSuccess?: () => void
    ): Promise<{ syncId: string, sessionKey: string, qrData: string }> {

        // A. Generate Credentials
        const syncId = Math.random().toString(36).substring(2, 15);
        const sessionKeyRaw = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const sessionKey = await exportKeyToBase64(sessionKeyRaw);

        // B. Prepare Data Payload
        const payload: SyncPayload = {
            timestamp: Date.now(),
            accounts,
            settings: {
                useGoogleAuth: settings?.useGoogleAuth,
                useBiometrics: settings?.useBiometrics,
                useDeviceAuth: settings?.useDeviceAuth,
                useTOTP: settings?.useTOTP
            }
        };

        const user = chatService.getCurrentUser();
        const privat = await storageService.getItem('gravity_chat_key');
        const publick = await storageService.getItem('gravity_chat_pub');

        if (user && privat && publick) {
            payload.chatIdentity = {
                username: user.username,
                id: user.id,
                privateKey: privat,
                publicKey: publick
            };
        }

        // C. Connect & Listen
        this.connect();

        const onConnect = () => {
            console.log('[SyncService] Export: Joining room', syncId);
            this.socket?.emit('bridge_join', { sessionId: syncId });
        };

        if (this.socket?.connected) {
            onConnect();
        } else {
            this.socket?.on('connect', onConnect);
        }

        const encryptedData = await this.encryptPayload(payload, sessionKeyRaw);

        // Wait for importer to say "I'm here" (via bridge_request)
        this.socket?.on('bridge_request', (_msg: { encrypted: string }) => {
            console.log("Sync peer detected. Sending payload...");
            this.socket?.emit('bridge_response', { sessionId: syncId, encrypted: encryptedData });

            if (onSuccess) onSuccess();

            setTimeout(() => this.disconnect(), 5000);
        });

        // Data for QR
        const qrData = `gravity:sync:${syncId}:${sessionKey}`;

        return { syncId, sessionKey, qrData };
    }

    // IMPORT FLOW (Receiver)
    public async startImportSession(qrCodeOrText: string): Promise<SyncPayload> {
        const parts = qrCodeOrText.trim().split(':');
        // Format: gravity:sync:ID:KEY
        if (parts[0] !== 'gravity' || parts[1] !== 'sync' || !parts[2] || !parts[3]) {
            throw new Error("Invalid Sync Code Format");
        }

        const syncId = parts[2];
        const keyB64 = parts[3];
        const key = await this.importAesKey(keyB64);

        this.connect();

        return new Promise((resolve, reject) => {
            const onConnect = () => {
                console.log('[SyncService] Import: Joining room', syncId);
                this.socket?.emit('bridge_join', { sessionId: syncId });

                // Signal readiness after short delay
                setTimeout(() => {
                    console.log('[SyncService] Import: Sending bridge_request');
                    this.socket?.emit('bridge_request', { sessionId: syncId, encrypted: "HELO" });
                }, 1500); // Increased slightly to ensure room join
            };

            if (this.socket?.connected) {
                onConnect();
            } else {
                this.socket?.on('connect', onConnect);
            }

            this.socket?.on('bridge_response', async (msg: { encrypted: string }) => {
                console.log('[SyncService] Import: Received response!');
                try {
                    // This is our payload
                    const decrypted = await this.decryptPayload(msg.encrypted, key);
                    this.disconnect();
                    resolve(decrypted);
                } catch (e) {
                    console.error("Sync decryption failed", e);
                    reject("Decryption Failed: Invalid Key or Data");
                }
            });

            // Timeout
            setTimeout(() => {
                this.disconnect();
                reject("Sync Timeout: No connection from peer.");
            }, 60000);
        });
    }

    // UTILS
    private connect() {
        if (this.socket) this.disconnect();
        this.socket = io(this.serverUrl, { transports: ['websocket'] });

        this.socket.on('connect', () => console.log('[SyncService] Socket Connected:', this.socket?.id));
        this.socket.on('connect_error', (err) => console.error('[SyncService] Socket Connection Error:', err));
        this.socket.on('disconnect', (reason) => console.log('[SyncService] Socket Disconnected:', reason));
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public isConnected(): boolean {
        return this.socket?.connected || false;
    }

    private async importAesKey(b64: string): Promise<CryptoKey> {
        const raw = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        return window.crypto.subtle.importKey("raw", raw, "AES-GCM", true, ["encrypt", "decrypt"]);
    }

    private async encryptPayload(payload: SyncPayload, key: CryptoKey): Promise<string> {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const enc = new TextEncoder().encode(JSON.stringify(payload));
        const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc);

        const bundle = new Uint8Array(iv.length + encrypted.byteLength);
        bundle.set(iv, 0);
        bundle.set(new Uint8Array(encrypted), 12);
        return btoa(String.fromCharCode(...bundle));
    }

    private async decryptPayload(b64: string, key: CryptoKey): Promise<SyncPayload> {
        const data = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        const iv = data.slice(0, 12);
        const ciphertext = data.slice(12);

        const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
        return JSON.parse(new TextDecoder().decode(decrypted));
    }
}

export const syncService = new SyncService();
