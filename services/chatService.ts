import { io, Socket } from "socket.io-client";

// Define Chat Types
export interface ChatUser {
    id: string;
    username: string;
    isOnline?: boolean;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    isVerified?: boolean;
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
                // Attempt authentication. If we have ID, use it. If not, use Username (Recovery).
                await this.authenticateWithSignature(storedId, storedUser);
            }
        });

        this.setupListeners();
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
            this.userId = data.id;
            this.username = data.username;

            // Update Rooms
            this.rooms = data.rooms.map((r: any) => ({
                ...r,
                messages: [],
                unreadCount: 0
            }));

            // Persist
            localStorage.setItem('gravity_chat_id', data.id);
            localStorage.setItem('gravity_chat_username', data.username);

            // Notify UI
            if (this.onAuthSuccess) this.onAuthSuccess({ id: data.id, username: data.username });
            if (this.onAuthenticated) this.onAuthenticated(data.id, data.username);
            if (this.onRoomUpdated) this.onRoomUpdated(this.rooms);
        });

        // Chat Events
        this.socket.on('new_message', (data: { roomId: string, message: ChatMessage }) => {
            this.handleNewMessage(data.roomId, data.message);
        });

        this.socket.on('room_history', (data: { roomId: string, messages: ChatMessage[], memberDetails: ChatUser[] }) => {
            const room = this.rooms.find(r => r.id === data.roomId);
            if (room) {
                room.messages = data.messages;
                room.memberDetails = data.memberDetails;
                if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
            }
        });

        this.socket.on('member_joined', (data: { roomId: string, userId: string, username: string }) => {
            const room = this.rooms.find(r => r.id === data.roomId);
            if (room) {
                if (!room.memberDetails) room.memberDetails = [];
                if (!room.memberDetails.find(u => u.id === data.userId)) {
                    room.memberDetails.push({ id: data.userId, username: data.username });
                    if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
                }
            }
        });

        // Rooms management
        this.socket.on('room_joined', (roomData: ChatRoom) => {
            if (this.rooms.find(r => r.id === roomData.id)) return;
            // Merge
            const newRoom = { ...roomData, messages: [], unreadCount: 0 };
            this.rooms.push(newRoom);
            if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
            if (this.onRoomAdded) this.onRoomAdded(newRoom);
        });

        this.socket.on('room_removed', (roomId: string) => {
            this.rooms = this.rooms.filter(r => r.id !== roomId);
            if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
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

        this.socket.on('error', (msg: string) => {
            console.error("Socket Error:", msg);
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

    private async generateAndSaveIdentity(): Promise<{ publicKey: string, privateKey: string }> {
        const keyPair = await crypto.subtle.generateKey(
            { name: 'ECDSA', namedCurve: 'P-256' },
            true,
            ['sign', 'verify']
        );
        const exportedPub = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        const exportedPriv = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

        const publicKeyHex = this.bufferToHex(new Uint8Array(exportedPub));
        const privateKeyHex = this.bufferToHex(new Uint8Array(exportedPriv));

        localStorage.setItem('gravity_chat_priv', privateKeyHex);
        localStorage.setItem('gravity_chat_pub', publicKeyHex);

        return { publicKey: publicKeyHex, privateKey: privateKeyHex };
    }

    public async authenticateWithSignature(userId?: string | null, username?: string | null): Promise<void> {
        if (!this.socket) return;
        // Trigger server to send challenge. 
        // We can now request by ID or by Username (for recovery)
        this.socket.emit('request_challenge', { userId, username });
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

    // --- PUBLIC METHODS ---

    public createRoom(name: string, isPrivate: boolean = false) {
        this.socket?.emit('create_room', { name, isPrivate });
    }

    public getCurrentUser(): ChatUser | null {
        if (this.userId && this.username) return { id: this.userId, username: this.username };
        return null;
    }

    public async register(username: string) {
        if (!this.socket) await this.init();

        const storedUser = this.getStoredUsername();
        const storedKey = this.getStoredPrivateKey();

        // FIXED: If we already have keys for this username, don't register, just LOGIN
        if (storedUser?.toLowerCase() === username.toLowerCase() && storedKey) {
            console.log("Local keys found, performing cryptographic login recovery...");
            return this.authenticateWithSignature(null, username);
        }

        // Generate new keys for BRAND NEW registration
        const keys = await this.generateAndSaveIdentity();
        localStorage.setItem('gravity_chat_username', username);

        this.socket?.emit('register', {
            username,
            publicKey: keys.publicKey
        });
    }

    public async sendMessage(roomId: string, content: string) {
        if (!this.socket) return;
        const privateKeyHex = localStorage.getItem('gravity_chat_priv');

        if (!privateKeyHex) {
            if (this.onError) this.onError("Security Error: No identity found. Please re-login.");
            return;
        }

        try {
            const timestamp = new Date().toISOString();
            const messageToSign = content + timestamp;
            const signature = await this.signChallenge(messageToSign, privateKeyHex);

            this.socket.emit('send_message', {
                roomId,
                content,
                timestamp,
                signature
            });
        } catch (err) {
            console.error('Failed to sign message:', err);
            if (this.onError) this.onError('Failed to securely sign message.');
        }
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
    }

    private handleNewMessage(roomId: string, message: ChatMessage) {
        const room = this.rooms.find(r => r.id === roomId);
        if (room) {
            room.messages.push(message);
            if (this.onMessage) this.onMessage(roomId, message);
            if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
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
