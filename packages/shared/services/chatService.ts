import { io, Socket } from "socket.io-client";
import { generateEncryptionKeys, exportKeyToBase64, importKeyFromBase64, deriveSharedSecret, encryptMessage, decryptMessage } from './cryptoService';

declare var chrome: any;

// Define Chat Types
export interface ChatUser {
    id: string;
    username: string;
    isOnline?: boolean;
    encryptionPublicKey?: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    isVerified?: boolean;
    isEncrypted?: boolean;
    isEdited?: boolean;
    editTimestamp?: string;
}

export interface ChatRoom {
    id: string;
    name: string;
    type: 'public' | 'private' | 'dm';
    owner?: string;
    messages: ChatMessage[];
    members?: string[];
    memberDetails?: ChatUser[];
    unreadCount?: number;
}

class ChatService {
    private socket: Socket | null = null;
    private userId: string | null = null;
    private username: string | null = null;

    // Callbacks for UI updates
    public onMessage: ((roomId: string, message: ChatMessage) => void) | null = null;
    public onRoomUpdated: ((rooms: ChatRoom[]) => void) | null = null;
    public onRoomAdded: ((room: ChatRoom) => void) | null = null;
    public onAuthSuccess: ((user: ChatUser) => void) | null = null;
    public onAuthenticated: ((userId: string, username: string) => void) | null = null; // Alias for AuthSuccess
    public onError: ((err: string) => void) | null = null;
    public onStatusChange: ((status: string, errMsg?: string) => void) | null = null;

    private rooms: ChatRoom[] = [];
    private serverUrl = 'https://gravity-chat-serve.onrender.com';
    private roomUpdateDebounceTimer: any = null;

    public init() {
        if (this.socket?.connected) return;

        this.socket = io(this.serverUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true
        });

        this.socket.on('connect', async () => {
            console.log('Connected to Chat Server');
            if (this.onStatusChange) this.onStatusChange('connected');
            window.dispatchEvent(new Event('chat-connected'));

            // Auto-Login Logic with Cryptographic Signature
            const storedUser = localStorage.getItem('gravity_chat_username');
            const storedKey = localStorage.getItem('gravity_chat_priv');
            const storedId = localStorage.getItem('gravity_chat_id');

            if (storedUser && storedKey) {
                console.log('Auto-logging in as', storedUser);

                // Sync keys with Background/Service Worker so it can maintain connection
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                    const pubKey = localStorage.getItem('gravity_chat_pub') || '';
                    chrome.runtime.sendMessage({
                        type: 'CHAT_SYNC_CREDS',
                        data: {
                            username: storedUser,
                            privateKey: storedKey,
                            publicKey: pubKey
                        }
                    }).catch(() => {
                        // It's normal for this to fail if the extension context is invalid or reloading
                    });
                }

                // Attempt authentication. If we have ID, use it. If not, use Username (Recovery).
                await this.authenticateWithSignature(storedId, storedUser);
            }
        });



        this.setupListeners();
    }

    public syncPushSubscription(sub: any) {
        if (this.socket?.connected) {
            console.log('Chat: Manual Push Sync');
            this.socket.emit('store_push_subscription', sub);
        }
    }

    private setupListeners() {
        if (!this.socket) return;

        this.socket.on('disconnect', () => {
            if (this.onStatusChange) this.onStatusChange('disconnected');
            window.dispatchEvent(new Event('chat-disconnected'));
        });

        this.socket.on('connect_error', (err) => {
            if (this.onStatusChange) this.onStatusChange('disconnected', err.message);
        });

        // Auth & Identity
        this.socket.on('auth_challenge', async (data: { challenge: string }) => {
            console.log('Received auth challenge');
            // Check if we have a key to sign this
            const storedKey = localStorage.getItem('gravity_chat_priv');
            if (storedKey) {
                try {
                    const signature = await this.signChallenge(data.challenge, storedKey);
                    this.socket?.emit('verify_signature', { signature });
                } catch (e) {
                    console.error("Auto-signing challenge failed", e);
                }
            }
        });

        this.socket.on('auth_success', (data: any) => {
            // Prevent duplicate auth_success from triggering infinite updates
            if (this.userId === data.id && this.rooms.length > 0) {
                console.log(`Ignoring duplicate auth_success for ${data.username}`);
                return;
            }

            this.userId = data.id;
            this.username = data.username;

            // Update Rooms
            this.rooms = data.rooms.map((r: any) => ({
                ...r,
                messages: [],
                unreadCount: 0
            }));

            console.log(`Auth Success! Received ${this.rooms.length} rooms:`, this.rooms.map(r => r.name));

            // Handle pending invites
            if (data.pendingInvites && data.pendingInvites.length > 0) {
                console.log(`Received ${data.pendingInvites.length} pending invites`);

                // Update badge
                if (typeof chrome !== 'undefined' && chrome.runtime) {
                    chrome.runtime.sendMessage({
                        type: 'UPDATE_BADGE',
                        count: data.pendingInvites.length
                    }).catch(() => { }); // Ignore if background script not ready
                }

                // Notify UI about each invite
                data.pendingInvites.forEach((invite: any) => {
                    if (this.onError) {
                        this.onError(`You were invited to "${invite.roomName}" by ${invite.invitedBy}`);
                    }
                });
            }

            // Persist
            localStorage.setItem('gravity_chat_id', data.id);
            localStorage.setItem('gravity_chat_username', data.username);

            // --- SYNC PUSH SUBSCRIPTION ---
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.get(['gravity_push_sub'], (res: any) => {
                    if (res && res.gravity_push_sub) {
                        try {
                            const sub = JSON.parse(res.gravity_push_sub);
                            console.log('Chat: Syncing WebPush Sub');
                            this.socket?.emit('store_push_subscription', sub);
                        } catch (e) { }
                    }
                });
            }

            // Notify UI
            if (this.onAuthSuccess) this.onAuthSuccess({ id: data.id, username: data.username });
            if (this.onAuthenticated) this.onAuthenticated(data.id, data.username);
            this.notifyRoomUpdate(); // Use debounced update
        });

        // Chat Events
        this.socket.on('new_message', (data: { roomId: string, message: ChatMessage }) => {
            this.handleNewMessage(data.roomId, data.message);
        });

        this.socket.on('room_history', async (data: { roomId: string, messages: ChatMessage[], memberDetails: ChatUser[] }) => {
            const room = this.rooms.find(r => r.id === data.roomId);
            if (room) {
                // Update members first to ensure keys are available for decryption
                const hadMembers = room.memberDetails && room.memberDetails.length > 0;
                room.memberDetails = data.memberDetails;

                const hadMessages = room.messages.length > 0;

                // Process/Decrypt messages
                room.messages = await Promise.all(data.messages.map(m => this.processIncomingMessage(data.roomId, m)));

                // Trigger update if this is the first time loading messages OR if members changed
                if ((!hadMessages && data.messages.length > 0) || (!hadMembers && data.memberDetails && data.memberDetails.length > 0)) {
                    this.notifyRoomUpdate();
                }
            }
        });

        this.socket.on('member_joined', (data: { roomId: string, userId: string, username: string }) => {
            const room = this.rooms.find(r => r.id === data.roomId);
            if (room) {
                if (!room.memberDetails) room.memberDetails = [];
                if (!room.memberDetails.find(u => u.id === data.userId)) {
                    room.memberDetails.push({ id: data.userId, username: data.username });
                    this.notifyRoomUpdate();
                }
            }
        });

        // Rooms management
        this.socket.on('room_added', (roomData: ChatRoom) => {
            console.log(`room_added event received:`, roomData);
            if (this.rooms.find(r => r.id === roomData.id)) {
                console.log(`Room ${roomData.name} already exists, skipping`);
                return;
            }
            // Add to local list
            const newRoom = { ...roomData, messages: [], unreadCount: 0 };
            this.rooms.push(newRoom);
            console.log(`Added room to local list. Total rooms: ${this.rooms.length}`);
            this.notifyRoomUpdate();
            if (this.onRoomAdded) this.onRoomAdded(newRoom);
        });

        this.socket.on('room_joined', (roomData: ChatRoom) => {
            if (this.rooms.find(r => r.id === roomData.id)) return;
            // Merge
            const newRoom = { ...roomData, messages: [], unreadCount: 0 };
            this.rooms.push(newRoom);
            this.notifyRoomUpdate();
            if (this.onRoomAdded) this.onRoomAdded(newRoom);
        });

        this.socket.on('room_removed', (roomId: string) => {
            this.rooms = this.rooms.filter(r => r.id !== roomId);
            this.notifyRoomUpdate();
        });

        // Moderation
        this.socket.on('user_kicked', (data: { roomId: string, userId: string }) => {
            if (data.userId === this.userId) {
                if (this.onError) this.onError(`You were kicked from room`);
                window.dispatchEvent(new CustomEvent('chat-room-kicked', { detail: data }));
            }
        });

        this.socket.on('user_banned', (data: { roomId: string, userId: string }) => {
            if (data.userId === this.userId) {
                if (this.onError) this.onError(`You were BANNED from room`);
                window.dispatchEvent(new CustomEvent('chat-room-kicked', { detail: data }));
            }
        });

        this.socket.on('message_edited', (data: { roomId: string, messageId: string, content: string, editTimestamp: string }) => {
            const room = this.rooms.find(r => r.id === data.roomId);
            if (room) {
                const msg = room.messages.find(m => m.id === data.messageId);
                if (msg) {
                    msg.content = data.content;
                    msg.isEdited = true;
                    msg.editTimestamp = data.editTimestamp;
                    this.notifyRoomUpdate();
                }
            }
        });

        this.socket.on('message_deleted', (data: { roomId: string, messageId: string }) => {
            const room = this.rooms.find(r => r.id === data.roomId);
            if (room) {
                room.messages = room.messages.filter(m => m.id !== data.messageId);
                this.notifyRoomUpdate();
            }
        });

        this.socket.on('error', (msg: string) => {
            console.error("Socket Error:", msg);

            // If identity is lost on server, clear local stale data so user can re-register
            if (msg.includes('User not found') || msg.includes('no public key registered')) {
                console.warn("Server identity lost. Clearing local chat identity.");

                const storedName = localStorage.getItem('gravity_chat_username');

                localStorage.removeItem('gravity_chat_id');
                localStorage.removeItem('gravity_chat_priv');
                localStorage.removeItem('gravity_chat_pub');

                // CRITICAL: Disconnect socket completely to clear server-side state
                if (this.socket) {
                    this.socket.disconnect();
                    this.socket = null;
                }
                this.userId = null;
                this.username = null;
                this.rooms = [];

                // AUTO-REPAIR: If we have a name, try to re-register as fresh user
                if (storedName && !storedName.startsWith('!RESET!')) {
                    console.log(`Auto-repairing identity for ${storedName}...`);
                    // Increased delay to ensure server cleanup is fully complete AND socket reconnects
                    setTimeout(() => {
                        this.init(); // Reconnect socket
                        setTimeout(() => {
                            this.register(storedName).catch(console.error);
                        }, 500); // Additional delay after reconnect
                    }, 2000);
                    return;
                }
            }

            if (this.onError) this.onError(msg);
        });

        this.socket.on('search_results', (results: ChatUser[]) => {
            window.dispatchEvent(new CustomEvent('chat-search-results', { detail: results }));
        });

        // Presence
        this.socket.on('user_online', (userId: string) => this.handleUserStatusChange(userId, true));
        this.socket.on('user_offline', (userId: string) => this.handleUserStatusChange(userId, false));
    }

    // --- CRYPTO & AUTH ---

    // --- CRYPTO & AUTH ---

    private async generateAndSaveIdentity(): Promise<{ publicKey: string, privateKey: string, encryptionPublicKey: string, encryptionPrivateKey: string }> {
        // 1. Signing Keys (ECDSA)
        const signKeys = await crypto.subtle.generateKey(
            { name: 'ECDSA', namedCurve: 'P-256' },
            true,
            ['sign', 'verify']
        );
        const signPubInfo = await crypto.subtle.exportKey('spki', signKeys.publicKey);
        const signPrivInfo = await crypto.subtle.exportKey('pkcs8', signKeys.privateKey);

        const publicKeyHex = this.bufferToHex(new Uint8Array(signPubInfo));
        const privateKeyHex = this.bufferToHex(new Uint8Array(signPrivInfo));

        // 2. Encryption Keys (ECDH)
        const encKeys = await generateEncryptionKeys();
        const encPubB64 = await exportKeyToBase64(encKeys.publicKey);
        const encPrivB64 = await exportKeyToBase64(encKeys.privateKey);

        // Save All
        localStorage.setItem('gravity_chat_priv', privateKeyHex);
        localStorage.setItem('gravity_chat_pub', publicKeyHex);
        localStorage.setItem('gravity_chat_enc_priv', encPrivB64);
        localStorage.setItem('gravity_chat_enc_pub', encPubB64);

        // Sync with background script for notifications
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({
                type: 'CHAT_SYNC_CREDS',
                data: {
                    privateKey: privateKeyHex,
                    publicKey: publicKeyHex,
                    // We don't necessarily need to sync enc keys to BG unless BG does decryption, 
                    // but good for consistency.
                    encPrivateKey: encPrivB64,
                    encPublicKey: encPubB64
                }
            });
        }

        return {
            publicKey: publicKeyHex,
            privateKey: privateKeyHex,
            encryptionPublicKey: encPubB64,
            encryptionPrivateKey: encPrivB64
        };
    }

    private async ensureEncryptionKeys(): Promise<string | null> {
        let encPub = localStorage.getItem('gravity_chat_enc_pub');
        let encPriv = localStorage.getItem('gravity_chat_enc_priv');

        if (!encPub || !encPriv) {
            console.log("Generating missing E2EE Encryption Keys...");
            const encKeys = await generateEncryptionKeys();
            encPub = await exportKeyToBase64(encKeys.publicKey);
            encPriv = await exportKeyToBase64(encKeys.privateKey);
            localStorage.setItem('gravity_chat_enc_priv', encPriv);
            localStorage.setItem('gravity_chat_enc_pub', encPub);
        }
        return encPub;
    }

    public async authenticateWithSignature(userId?: string | null, username?: string | null): Promise<void> {
        if (!this.socket) return;
        // Ensure we send encryption key during auth too, to backfill server if needed
        const encPub = await this.ensureEncryptionKeys();

        this.socket.emit('request_challenge', { userId, username, encryptionPublicKey: encPub });
    }

    private async signChallenge(challenge: string, privateKeyHex: string): Promise<string> {
        const privateKeyBuffer = this.hexToBuffer(privateKeyHex);
        const privateKey = await crypto.subtle.importKey(
            'pkcs8',
            privateKeyBuffer,
            { name: 'ECDSA', namedCurve: 'P-256' },
            false,
            ['sign']
        );
        const encoder = new TextEncoder();
        const data = encoder.encode(challenge);
        const signature = await crypto.subtle.sign(
            { name: 'ECDSA', hash: { name: 'SHA-256' } },
            privateKey,
            data
        );
        return this.bufferToHex(new Uint8Array(signature));
    }

    private hexToBuffer(hex: string): ArrayBuffer {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes.buffer;
    }

    private bufferToHex(buffer: Uint8Array): string {
        return Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Helper to debounce room updates and prevent infinite loops
    private notifyRoomUpdate() {
        if (this.roomUpdateDebounceTimer) {
            clearTimeout(this.roomUpdateDebounceTimer);
        }
        this.roomUpdateDebounceTimer = setTimeout(() => {
            if (this.onRoomUpdated) {
                this.onRoomUpdated([...this.rooms]);
            }
        }, 100); // 100ms debounce
    }

    // --- PUBLIC METHODS ---

    public createRoom(name: string, isPrivate: boolean = false) {
        this.socket?.emit('create_room', { name, isPrivate });
    }

    public getCurrentUser(): ChatUser | null {
        if (this.userId && this.username) return { id: this.userId, username: this.username };
        return null;
    }

    public getRooms(): ChatRoom[] {
        return [...this.rooms]; // Return a copy
    }

    public async register(username: string) {
        if (!this.socket) await this.init();

        const storedUser = this.getStoredUsername();
        const storedKey = this.getStoredPrivateKey();

        // FIXED: If we already have keys for this username, don't register, just LOGIN
        if (storedUser?.toLowerCase() === username.toLowerCase() && storedKey) {
            console.log("Local keys found, performing cryptographic login recovery...");
            await this.ensureEncryptionKeys();

            // Sync with background
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                chrome.runtime.sendMessage({
                    type: 'CHAT_SYNC_CREDS',
                    data: { username: storedUser, privateKey: storedKey, publicKey: localStorage.getItem('gravity_chat_pub') }
                });
            }
            return this.authenticateWithSignature(null, username);
        }

        // Generate new keys for BRAND NEW registration
        const keys = await this.generateAndSaveIdentity();

        // Don't save admin commands as username!
        if (!username.startsWith('!RESET!')) {
            localStorage.setItem('gravity_chat_username', username);
            // Sync username with background
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                chrome.runtime.sendMessage({
                    type: 'CHAT_SYNC_CREDS',
                    data: { username, privateKey: keys.privateKey, publicKey: keys.publicKey }
                });
            }
        }

        this.socket?.emit('register', {
            username,
            publicKey: keys.publicKey,
            encryptionPublicKey: keys.encryptionPublicKey
        });
    }

    public async sendMessage(roomId: string, content: string, isEncrypted: boolean = false) {
        if (!this.socket) return;
        const privateKeyHex = localStorage.getItem('gravity_chat_priv');

        if (!privateKeyHex) {
            if (this.onError) this.onError("Security Error: No identity found. Please re-login.");
            return;
        }

        try {
            const timestamp = new Date().toISOString();
            const messageToSign = content + timestamp;

            const publicKeyHex = localStorage.getItem('gravity_chat_pub');
            console.log('[SIGN] Public Key (first 20):', publicKeyHex?.substring(0, 20));
            console.log('[SIGN] Private Key (first 20):', privateKeyHex?.substring(0, 20));
            console.log('[SIGN] Message to sign:', messageToSign);

            const signature = await this.signChallenge(messageToSign, privateKeyHex);
            console.log('[SIGN] Signature (first 20):', signature?.substring(0, 20));

            this.socket.emit('send_message', {
                roomId,
                content,
                timestamp,
                signature,
                isEncrypted
            });
        } catch (err) {
            console.error('Failed to sign message:', err);
            if (this.onError) this.onError('Failed to securely sign message.');
        }
    }

    public async sendDirectMessage(roomId: string, content: string, recipientPublicKeyBase64: string) {
        try {
            // 1. Get my Private Encryption Key
            const myPrivBase64 = localStorage.getItem('gravity_chat_enc_priv');
            if (!myPrivBase64) throw new Error("Encryption keys missing");

            const myPrivKey = await importKeyFromBase64(myPrivBase64, 'private');
            const recipientPubKey = await importKeyFromBase64(recipientPublicKeyBase64, 'public');

            // 2. Derive Shared Secret (AES-GCM)
            const sharedKey = await deriveSharedSecret(myPrivKey, recipientPubKey);

            // 3. Encrypt Content
            const encryptedContent = await encryptMessage(content, sharedKey);

            // 4. Send as normal message but marked encrypted
            await this.sendMessage(roomId, encryptedContent, true);

        } catch (e) {
            console.error("E2EE Failed:", e);
            if (this.onError) this.onError("Encryption failed: " + (e as Error).message);
        }
    }

    public async editMessage(roomId: string, messageId: string, newContent: string) {
        if (!this.socket) return;
        const privateKeyHex = localStorage.getItem('gravity_chat_priv');
        if (!privateKeyHex) return;

        try {
            const timestamp = new Date().toISOString();
            const messageToSign = newContent + timestamp;
            const signature = await this.signChallenge(messageToSign, privateKeyHex);

            this.socket.emit('edit_message', {
                roomId,
                messageId,
                content: newContent,
                timestamp,
                signature
            });
        } catch (err) {
            console.error('Failed to sign edit:', err);
        }
    }

    public deleteMessage(roomId: string, messageId: string) {
        this.socket?.emit('delete_message', { roomId, messageId });
    }

    public joinRoom(roomId: string) { this.socket?.emit('join_room', roomId); }
    public createDM(targetId: string) { this.socket?.emit('create_dm', targetId); }
    public searchUsers(query: string) { this.socket?.emit('search_users', query); }
    public inviteUser(roomId: string, user: string) { this.socket?.emit('invite_user', { roomId, targetUsername: user }); }
    public closeRoom(roomId: string) { this.socket?.emit('close_room', roomId); }
    public kickUser(roomId: string, userId: string) { this.socket?.emit('kick_user', { roomId, targetUserId: userId }); }
    public banUser(roomId: string, userId: string) { this.socket?.emit('ban_user', { roomId, targetUserId: userId }); }
    public muteUser(roomId: string, userId: string) { this.socket?.emit('mute_user', { roomId, targetUserId: userId }); }
    public unmuteUser(roomId: string, userId: string) { this.socket?.emit('unmute_user', { roomId, targetUserId: userId }); }

    public logout() {
        localStorage.removeItem('gravity_chat_id');
        localStorage.removeItem('gravity_chat_username');
        localStorage.removeItem('gravity_chat_priv');
        localStorage.removeItem('gravity_chat_pub');
        this.userId = null;
        this.username = null;
        this.rooms = [];
        this.socket?.disconnect();
        this.socket = null;

        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ type: 'CHAT_LOGOUT' });
        }
    }

    private async handleNewMessage(roomId: string, message: ChatMessage) {
        const processedMsg = await this.processIncomingMessage(roomId, message);

        const room = this.rooms.find(r => r.id === roomId);
        if (room) {
            // Prevent duplicates
            if (room.messages.find(m => m.id === processedMsg.id)) return;

            room.messages.push(processedMsg);

            // UI Handler
            if (this.onMessage) this.onMessage(roomId, processedMsg);
            if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);

            // Trigger notification only if message is NOT from me
            if (processedMsg.senderId !== this.userId) {
                // Dispatch global event for Badge (Sidebar)
                window.dispatchEvent(new CustomEvent('chat-unread', { detail: { roomId } }));

                // Direct DOM manipulation fallback for Sidebar Badge
                const badge = document.getElementById('chat-badge');
                if (badge) badge.classList.remove('hidden');
            }
        }
    }

    private async processIncomingMessage(roomId: string, message: ChatMessage): Promise<ChatMessage> {
        if (!message.isEncrypted) return message;

        try {
            // Find sender's public key
            const room = this.rooms.find(r => r.id === roomId);
            const sender = room?.memberDetails?.find(u => u.id === message.senderId);

            console.log('[ChatService] Decrypting message:', {
                roomId,
                roomType: room?.type,
                senderId: message.senderId,
                myId: this.userId,
                hasSender: !!sender,
                hasEncryptionKey: !!sender?.encryptionPublicKey,
                memberDetails: room?.memberDetails?.map(m => ({ id: m.id, username: m.username, hasKey: !!m.encryptionPublicKey }))
            });

            if (!sender?.encryptionPublicKey) {
                // If I sent this message, show placeholder
                if (message.senderId === this.userId) {
                    return { ...message, content: "(Encrypted Message sent by you)" };
                }

                console.error('[ChatService] Missing encryption key for sender:', message.senderId);
                return { ...message, content: `Encrypted Message (Key not found for ${message.senderName})` };
            }

            const myPrivBase64 = localStorage.getItem('gravity_chat_enc_priv');
            if (!myPrivBase64) {
                console.error('[ChatService] Missing my private encryption key');
                return { ...message, content: "Encrypted Message (You lack keys)" };
            }

            const myPrivKey = await importKeyFromBase64(myPrivBase64, 'private');
            const senderPubKey = await importKeyFromBase64(sender.encryptionPublicKey, 'public');

            const sharedKey = await deriveSharedSecret(myPrivKey, senderPubKey);
            const decrypted = await decryptMessage(message.content, sharedKey);

            console.log('[ChatService] Successfully decrypted message');
            return { ...message, content: decrypted };

        } catch (e) {
            console.error("[ChatService] Decryption error:", e);
            return { ...message, content: "Decryption Failed" };
        }
    }

    private getStoredPrivateKey(): string | null {
        return localStorage.getItem('gravity_chat_priv');
    }

    private getStoredUsername(): string | null {
        return localStorage.getItem('gravity_chat_username');
    }

    private handleUserStatusChange(userId: string, isOnline: boolean) {
        let updated = false;
        this.rooms.forEach(room => {
            const member = room.memberDetails?.find(m => m.id === userId);
            if (member) {
                member.isOnline = isOnline;
                updated = true;
            }
        });
        if (updated && this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
    }
}

export const chatService = new ChatService();
