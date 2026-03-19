import { io, Socket } from 'socket.io-client';
import {
  decryptMessage,
  deriveSharedSecret,
  encryptMessage,
  exportKeyToBase64,
  generateEncryptionKeys,
  importKeyFromBase64
} from './cryptoService';
import { SyncPayload } from '../types';

const BRIDGE_SERVER_URL = 'http://136.243.80.162:3030';
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 10;

type TransferStatus = 'idle' | 'connecting' | 'waiting' | 'paired' | 'transferred' | 'error';

class DeviceTransferService {
  private socket: Socket | null = null;
  private sessionId: string | null = null;
  private sharedKey: CryptoKey | null = null;
  private myKeyPair: CryptoKeyPair | null = null;
  private myPublicKeyB64: string | null = null;
  private incomingPayloadResolver: ((payload: SyncPayload) => void) | null = null;
  private statusListener: ((status: TransferStatus, detail?: string) => void) | null = null;
  private hasEchoedPublicKey = false;

  public onStatusChange(callback: ((status: TransferStatus, detail?: string) => void) | null) {
    this.statusListener = callback;
  }

  private emitStatus(status: TransferStatus, detail?: string) {
    this.statusListener?.(status, detail);
  }

  private createSessionCode() {
    const bytes = window.crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
    let result = '';
    for (let index = 0; index < CODE_LENGTH; index += 1) {
      result += CODE_ALPHABET[bytes[index] % CODE_ALPHABET.length];
    }
    return result;
  }

  private formatCode(code: string) {
    const normalized = this.normalizeCode(code);
    return normalized.replace(/(.{5})/g, '$1-').replace(/-$/, '');
  }

  public normalizeCode(code: string) {
    return String(code || '')
      .toUpperCase()
      .replace(/[^A-Z2-9]/g, '')
      .slice(0, CODE_LENGTH);
  }

  private ensureSocket() {
    if (this.socket) return;

    this.socket = io(BRIDGE_SERVER_URL, {
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
      timeout: 10000
    });

    this.socket.on('connect', () => {
      this.emitStatus(this.sharedKey ? 'paired' : 'connecting');
    });

    this.socket.on('connect_error', (err) => {
      this.emitStatus('error', err.message || 'Connection error');
    });

    this.socket.on('disconnect', (reason) => {
      if (reason !== 'io client disconnect') {
        this.emitStatus('error', `Disconnected: ${reason}`);
      }
    });

    this.socket.on('bridge_signer_ready', async (data: { publicKey: string }) => {
      if (!this.myKeyPair || !data?.publicKey) return;
      try {
        const remotePublicKey = await importKeyFromBase64(data.publicKey, 'public');
        this.sharedKey = await deriveSharedSecret(this.myKeyPair.privateKey, remotePublicKey);
        if (!this.hasEchoedPublicKey && this.sessionId && this.myPublicKeyB64) {
          this.hasEchoedPublicKey = true;
          this.socket?.emit('bridge_join', { sessionId: this.sessionId, publicKey: this.myPublicKeyB64 });
        }
        this.emitStatus('paired');
      } catch (error: any) {
        this.emitStatus('error', error?.message || 'Handshake failed');
      }
    });

    this.socket.on('bridge_sync_accounts', async (data: { encrypted: string }) => {
      if (!this.sharedKey || !data?.encrypted) return;
      try {
        const decrypted = await decryptMessage(data.encrypted, this.sharedKey);
        const payload = JSON.parse(decrypted) as SyncPayload;
        this.emitStatus('transferred');
        this.incomingPayloadResolver?.(payload);
        this.incomingPayloadResolver = null;
      } catch (error: any) {
        this.emitStatus('error', error?.message || 'Import failed');
      }
    });
  }

  public async startReceiveSession(): Promise<{ code: string }> {
    this.disconnect();
    this.ensureSocket();
    this.sessionId = this.createSessionCode();
    this.myKeyPair = await generateEncryptionKeys();
    this.sharedKey = null;
    this.hasEchoedPublicKey = false;

    const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);
    this.myPublicKeyB64 = myPubB64;
    this.emitStatus('waiting');
    this.socket?.emit('bridge_join', { sessionId: this.sessionId, publicKey: myPubB64 });

    return { code: this.formatCode(this.sessionId) };
  }

  public async waitForIncomingPayload(timeoutMs: number = 5 * 60 * 1000): Promise<SyncPayload> {
    return new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        this.incomingPayloadResolver = null;
        reject(new Error('Transfer timed out'));
      }, timeoutMs);

      this.incomingPayloadResolver = (payload) => {
        clearTimeout(timeoutId);
        resolve(payload);
      };
    });
  }

  public async connectToSession(rawCode: string, timeoutMs: number = 30000): Promise<void> {
    const code = this.normalizeCode(rawCode);
    if (code.length !== CODE_LENGTH) {
      throw new Error('Invalid transfer code');
    }

    this.disconnect();
    this.ensureSocket();
    this.sessionId = code;
    this.myKeyPair = await generateEncryptionKeys();
    this.sharedKey = null;
    this.hasEchoedPublicKey = false;

    const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);
    this.myPublicKeyB64 = myPubB64;
    this.emitStatus('connecting');

    const pairedPromise = new Promise<void>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        reject(new Error('Target device did not respond in time'));
      }, timeoutMs);

      const previousListener = this.statusListener;
      this.statusListener = (status, detail) => {
        previousListener?.(status, detail);
        if (status === 'paired') {
          clearTimeout(timeoutId);
          this.statusListener = previousListener;
          resolve();
        } else if (status === 'error') {
          clearTimeout(timeoutId);
          this.statusListener = previousListener;
          reject(new Error(detail || 'Pairing failed'));
        }
      };
    });

    this.socket?.emit('bridge_join', { sessionId: this.sessionId, publicKey: myPubB64 });
    await pairedPromise;
  }

  public async sendPayload(payload: SyncPayload) {
    if (!this.socket || !this.sharedKey || !this.sessionId) {
      throw new Error('Transfer session not ready');
    }

    const encrypted = await encryptMessage(JSON.stringify(payload), this.sharedKey);
    this.socket.emit('bridge_sync_accounts', { sessionId: this.sessionId, encrypted });
    this.emitStatus('transferred');
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.sessionId = null;
    this.sharedKey = null;
    this.myKeyPair = null;
    this.myPublicKeyB64 = null;
    this.hasEchoedPublicKey = false;
    this.incomingPayloadResolver = null;
    this.emitStatus('idle');
  }
}

export const deviceTransferService = new DeviceTransferService();
