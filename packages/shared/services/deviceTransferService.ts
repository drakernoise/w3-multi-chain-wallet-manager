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

const BRIDGE_SERVER_URL = 'https://chat.gravitywallet.drakernoise.com';
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 10;

type TransferStatus = 'idle' | 'connecting' | 'waiting' | 'paired' | 'sending' | 'delivered' | 'transferred' | 'error';
type TransferRole = 'source' | 'destination';
type TransferAckPhase = 'received' | 'imported' | 'failed';

export interface IncomingDeviceTransfer {
  payload: SyncPayload;
  confirmImported: () => void;
  rejectImport: (message?: string) => void;
}

class DeviceTransferService {
  private socket: Socket | null = null;
  private sessionId: string | null = null;
  private role: TransferRole | null = null;
  private sharedKey: CryptoKey | null = null;
  private myKeyPair: CryptoKeyPair | null = null;
  private myPublicKeyB64: string | null = null;
  private incomingPayloadResolver: ((transfer: IncomingDeviceTransfer) => void) | null = null;
  private queuedIncomingTransfer: IncomingDeviceTransfer | null = null;
  private pendingIncomingTransferId: string | null = null;
  private completedIncomingTransferId: string | null = null;
  private pendingTransferId: string | null = null;
  private pendingEncryptedPayload: string | null = null;
  private pendingTransferResolver: (() => void) | null = null;
  private pendingTransferRejecter: ((error: Error) => void) | null = null;
  private retryTimer: number | null = null;
  private transferTimeout: number | null = null;
  private payloadReceived = false;
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
      this.emitJoin();
      if (this.pendingTransferId) {
        this.emitStatus(this.payloadReceived ? 'delivered' : 'sending');
      } else {
        this.emitStatus(this.sharedKey ? 'paired' : this.role === 'destination' ? 'waiting' : 'connecting');
      }
    });

    this.socket.on('connect_error', (err) => {
      this.emitStatus('error', err.message || 'Connection error');
    });

    this.socket.on('disconnect', (reason) => {
      if (reason !== 'io client disconnect') {
        this.emitStatus('error', `Disconnected: ${reason}`);
      }
    });

    this.socket.on('bridge_session_error', (data: { error?: string }) => {
      this.emitStatus('error', data?.error || 'Unable to join transfer session');
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
        if (this.pendingEncryptedPayload && !this.payloadReceived) {
          this.emitStatus('sending');
          this.emitPendingPayload();
        } else {
          this.emitStatus('paired');
        }
      } catch (error: any) {
        this.emitStatus('error', error?.message || 'Handshake failed');
      }
    });

    this.socket.on('bridge_sync_accounts', async (data: { encrypted: string; transferId?: string }) => {
      if (!this.sharedKey || !data?.encrypted || !data?.transferId) return;

      if (this.completedIncomingTransferId === data.transferId) {
        this.emitTransferAck(data.transferId, 'imported');
        return;
      }

      if (this.pendingIncomingTransferId === data.transferId) {
        this.emitTransferAck(data.transferId, 'received');
        return;
      }

      try {
        const decrypted = await decryptMessage(data.encrypted, this.sharedKey);
        const payload = JSON.parse(decrypted) as SyncPayload;
        this.pendingIncomingTransferId = data.transferId;
        this.emitTransferAck(data.transferId, 'received');

        const transfer: IncomingDeviceTransfer = {
          payload,
          confirmImported: () => this.finishIncomingTransfer(data.transferId!, 'imported'),
          rejectImport: (message?: string) => this.finishIncomingTransfer(data.transferId!, 'failed', message)
        };

        if (this.incomingPayloadResolver) {
          this.incomingPayloadResolver(transfer);
          this.incomingPayloadResolver = null;
        } else {
          this.queuedIncomingTransfer = transfer;
        }
      } catch (error: any) {
        this.emitTransferAck(data.transferId, 'failed', error?.message || 'Unable to decrypt wallet');
        this.emitStatus('error', error?.message || 'Import failed');
      }
    });

    this.socket.on('bridge_sync_ack', (data: { transferId?: string; phase?: TransferAckPhase; error?: string }) => {
      if (!data?.transferId || data.transferId !== this.pendingTransferId) return;

      if (data.phase === 'received') {
        this.payloadReceived = true;
        this.emitStatus('delivered');
        return;
      }

      if (data.phase === 'imported') {
        this.finishOutgoingTransfer();
        return;
      }

      if (data.phase === 'failed') {
        this.failOutgoingTransfer(data.error || 'The destination device could not import the wallet');
      }
    });
  }

  public async startReceiveSession(): Promise<{ code: string }> {
    this.disconnect();
    this.sessionId = this.createSessionCode();
    this.role = 'destination';
    this.myKeyPair = await generateEncryptionKeys();
    this.sharedKey = null;
    this.hasEchoedPublicKey = false;

    const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);
    this.myPublicKeyB64 = myPubB64;
    this.emitStatus('waiting');
    this.ensureSocket();
    this.emitJoin();

    return { code: this.formatCode(this.sessionId) };
  }

  public async waitForIncomingPayload(timeoutMs: number = 5 * 60 * 1000): Promise<IncomingDeviceTransfer> {
    if (this.queuedIncomingTransfer) {
      const transfer = this.queuedIncomingTransfer;
      this.queuedIncomingTransfer = null;
      return transfer;
    }

    return new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        this.incomingPayloadResolver = null;
        reject(new Error('Transfer timed out'));
      }, timeoutMs);

      this.incomingPayloadResolver = (transfer) => {
        clearTimeout(timeoutId);
        resolve(transfer);
      };
    });
  }

  public async connectToSession(rawCode: string, timeoutMs: number = 30000): Promise<void> {
    const code = this.normalizeCode(rawCode);
    if (code.length !== CODE_LENGTH) {
      throw new Error('Invalid transfer code');
    }

    this.disconnect();
    this.sessionId = code;
    this.role = 'source';
    this.myKeyPair = await generateEncryptionKeys();
    this.sharedKey = null;
    this.hasEchoedPublicKey = false;

    const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);
    this.myPublicKeyB64 = myPubB64;
    this.emitStatus('connecting');
    this.ensureSocket();

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

    this.emitJoin();
    await pairedPromise;
  }

  public async sendPayload(payload: SyncPayload, timeoutMs: number = 90000) {
    if (!this.socket || !this.sharedKey || !this.sessionId) {
      throw new Error('Transfer session not ready');
    }

    this.clearOutgoingTransfer();
    this.pendingTransferId = window.crypto.randomUUID();
    this.pendingEncryptedPayload = await encryptMessage(JSON.stringify(payload), this.sharedKey);
    this.payloadReceived = false;
    this.emitStatus('sending');

    return new Promise<void>((resolve, reject) => {
      this.pendingTransferResolver = resolve;
      this.pendingTransferRejecter = reject;
      this.transferTimeout = window.setTimeout(() => {
        this.failOutgoingTransfer(
          this.payloadReceived
            ? 'The destination received the wallet but did not confirm the import'
            : 'The destination device did not receive the wallet in time'
        );
      }, timeoutMs);

      this.emitPendingPayload();
      this.retryTimer = window.setInterval(() => {
        this.emitPendingPayload();
      }, 2500);
    });
  }

  private emitJoin() {
    if (!this.socket?.connected || !this.sessionId || !this.myPublicKeyB64) return;
    this.socket.emit('bridge_join', {
      sessionId: this.sessionId,
      publicKey: this.myPublicKeyB64,
      role: this.role ? `device-transfer-${this.role}` : undefined
    }, (response?: { success?: boolean; error?: string }) => {
      if (response && response.success === false) {
        this.emitStatus('error', response.error || 'Unable to join transfer session');
      }
    });
  }

  private emitPendingPayload() {
    if (!this.socket?.connected || !this.sessionId || !this.pendingTransferId || !this.pendingEncryptedPayload) return;
    this.socket.emit('bridge_sync_accounts', {
      sessionId: this.sessionId,
      transferId: this.pendingTransferId,
      encrypted: this.pendingEncryptedPayload
    });
  }

  private emitTransferAck(transferId: string, phase: TransferAckPhase, error?: string) {
    if (!this.socket?.connected || !this.sessionId) return;
    this.socket.emit('bridge_sync_ack', { sessionId: this.sessionId, transferId, phase, error });
  }

  private finishIncomingTransfer(transferId: string, phase: 'imported' | 'failed', error?: string) {
    if (this.pendingIncomingTransferId !== transferId) return;
    this.emitTransferAck(transferId, phase, error);
    if (phase === 'imported') {
      this.completedIncomingTransferId = transferId;
      this.emitStatus('transferred');
    } else {
      this.emitStatus('error', error || 'Wallet import failed');
    }
    this.pendingIncomingTransferId = null;
  }

  private finishOutgoingTransfer() {
    const resolve = this.pendingTransferResolver;
    this.clearOutgoingTransfer();
    this.emitStatus('transferred');
    resolve?.();
  }

  private failOutgoingTransfer(message: string) {
    const reject = this.pendingTransferRejecter;
    this.clearOutgoingTransfer();
    this.emitStatus('error', message);
    reject?.(new Error(message));
  }

  private clearRetryTimer() {
    if (this.retryTimer !== null) {
      window.clearInterval(this.retryTimer);
      this.retryTimer = null;
    }
  }

  private clearOutgoingTransfer() {
    this.clearRetryTimer();
    if (this.transferTimeout !== null) {
      window.clearTimeout(this.transferTimeout);
      this.transferTimeout = null;
    }
    this.pendingTransferId = null;
    this.pendingEncryptedPayload = null;
    this.pendingTransferResolver = null;
    this.pendingTransferRejecter = null;
    this.payloadReceived = false;
  }

  public disconnect() {
    if (this.pendingTransferRejecter) {
      this.pendingTransferRejecter(new Error('Transfer cancelled'));
    }
    this.clearOutgoingTransfer();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.sessionId = null;
    this.role = null;
    this.sharedKey = null;
    this.myKeyPair = null;
    this.myPublicKeyB64 = null;
    this.hasEchoedPublicKey = false;
    this.incomingPayloadResolver = null;
    this.queuedIncomingTransfer = null;
    this.pendingIncomingTransferId = null;
    this.completedIncomingTransferId = null;
    this.emitStatus('idle');
  }
}

export const deviceTransferService = new DeviceTransferService();
