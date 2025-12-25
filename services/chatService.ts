
import { io, Socket } from "socket.io-client";

// Define Chat Types
export interface ChatUser {
    id: string;
    username: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
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
    public onError: ((err: string) => void) | null = null;
    public onStatusChange: ((status: string, errMsg?: string) => void) | null = null;

    private rooms: ChatRoom[] = [];

    constructor() { }

    public init() {
        if (this.socket) return;

        // Connect to production server on Render
        const BACKEND_URL = 'https://gravity-chat-serve.onrender.com';
        this.socket = io(BACKEND_URL, {
            reconnectionAttempts: 7,
            timeout: 30000,
            autoConnect: true
        });

        this.socket.on('connect', () => {
            console.log('Connected to Chat Server');
            if (this.onStatusChange) this.onStatusChange('connected');
            this.tryAutoLogin();
        });

        this.socket.on('disconnect', () => {
            if (this.onStatusChange) this.onStatusChange('disconnected');
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            if (this.onStatusChange) this.onStatusChange('disconnected', err.message);
        });

        this.socket.on('auth_success', (data: any) => {
            this.userId = data.id;
            this.username = data.username;

            // Initial rooms list
            this.rooms = data.rooms.map((r: any) => ({
                ...r,
                messages: [],
                unreadCount: 0
            }));

            if (this.onAuthSuccess) this.onAuthSuccess({ id: data.id, username: data.username });
            if (this.onRoomUpdated) this.onRoomUpdated(this.rooms);

            // Persist Identity
            this.saveIdentity(data.id, data.username);
        });

        this.socket.on('new_message', (data: { roomId: string, message: ChatMessage }) => {
            this.handleNewMessage(data.roomId, data.message);
        });

        this.socket.on('room_history', (data: { roomId: string, messages: ChatMessage[], memberDetails: ChatUser[] }) => {
            const room = this.rooms.find(r => r.id === data.roomId);
            if (room) {
                room.messages = data.messages;
                room.memberDetails = data.memberDetails;
                if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]); // Trigger re-render
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

        this.socket.on('room_added', (roomData: any) => {
            // Check if exists
            if (this.rooms.find(r => r.id === roomData.id)) return;

            const newRoom = {
                ...roomData,
                messages: [],
                unreadCount: 0
            };
            this.rooms.push(newRoom);
            if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
            if (this.onRoomAdded) this.onRoomAdded(newRoom);
        });

        this.socket.on('room_removed', (roomId: string) => {
            this.rooms = this.rooms.filter(r => r.id !== roomId);
            if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
        });

        this.socket.on('user_kicked', (data: { roomId: string, userId: string }) => {
            if (data.userId === this.userId) {
                if (this.onError) this.onError(`You were kicked from room`);
                // UI should react by closing the room
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
            if (this.onError) this.onError(msg);
        });

        this.socket.on('search_results', (results: ChatUser[]) => {
            // Handled by specific promise usually, but for simple architecture we can use event or callback
            // This simple service might deliver via a specialized subscription or just a global event
            // For now we will broadcast custom event
            window.dispatchEvent(new CustomEvent('chat-search-results', { detail: results }));
        });
    }

    public register(username: string) {
        if (!this.socket) this.init();
        this.socket?.emit('register', { username });
    }

    public sendMessage(roomId: string, content: string) {
        this.socket?.emit('send_message', { roomId, content });
    }

    public joinRoom(roomId: string) {
        this.socket?.emit('join_room', roomId);
    }

    public createDM(targetUserId: string) {
        this.socket?.emit('create_dm', targetUserId);
    }

    public searchUsers(query: string) {
        this.socket?.emit('search_users', query);
    }

    public getRooms() {
        return this.rooms;
    }

    public createRoom(name: string, isPrivate: boolean = false) {
        this.socket?.emit('create_room', { name, isPrivate });
    }

    public inviteUser(roomId: string, targetUsername: string) {
        this.socket?.emit('invite_user', { roomId, targetUsername });
    }

    public closeRoom(roomId: string) {
        this.socket?.emit('close_room', roomId);
    }

    public kickUser(roomId: string, targetUserId: string) {
        this.socket?.emit('kick_user', { roomId, targetUserId });
    }

    public banUser(roomId: string, targetUserId: string) {
        this.socket?.emit('ban_user', { roomId, targetUserId });
    }

    public muteUser(roomId: string, targetUserId: string) {
        this.socket?.emit('mute_user', { roomId, targetUserId });
    }

    public unmuteUser(roomId: string, targetUserId: string) {
        this.socket?.emit('unmute_user', { roomId, targetUserId });
    }

    public getCurrentUser(): ChatUser | null {
        if (this.userId && this.username) return { id: this.userId, username: this.username };
        return null;
    }

    public logout() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.remove(['gravity_chat_id', 'gravity_chat_username']);
        }
        this.userId = null;
        this.username = null;
        this.rooms = [];
        this.socket?.disconnect();
        this.socket = null;
    }

    private saveIdentity(id: string, username: string) {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ gravity_chat_id: id, gravity_chat_username: username });
        }
    }

    private tryAutoLogin() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['gravity_chat_id', 'gravity_chat_username'], (res: any) => {
                if (res.gravity_chat_id && res.gravity_chat_username) {
                    this.socket?.emit('register', {
                        existingId: res.gravity_chat_id,
                        username: res.gravity_chat_username
                    });
                }
            });
        }
    }

    private handleNewMessage(roomId: string, message: ChatMessage) {
        const room = this.rooms.find(r => r.id === roomId);
        if (room) {
            room.messages.push(message);
            // Increment unread if not active? (Logic handled by UI state)

            if (this.onMessage) this.onMessage(roomId, message);
            if (this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
        }
    }
}

export const chatService = new ChatService();
