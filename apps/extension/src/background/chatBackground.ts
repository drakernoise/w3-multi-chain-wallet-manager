
import { io, Socket } from "socket.io-client";

// Define strict types for the background chat service
interface ChatCreds {
    username: string;
    publicKey: string;
    privateKey: string;
}

let socket: Socket | null = null;
let unreadCount = 0;
const SERVER_URL = 'https://gravity-chat-serve.onrender.com'; // Production URL

// --- CRYPTO UTILS (Duplicated from ChatService to run in pure SW context) ---
function hexToBuffer(hexString: string): ArrayBuffer {
    if (!hexString) return new Uint8Array().buffer;
    const bytes = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    return bytes.buffer;
}

async function signChallenge(challenge: string, privateKeyHex: string): Promise<string | null> {
    try {
        const privateKeyBuffer = hexToBuffer(privateKeyHex);

        // Robust Cross-Environment Check
        // In Service Workers, 'crypto' should be globally available.
        // If not, we fall back to 'globalThis.crypto'.
        const cryptoLib =
            (typeof crypto !== 'undefined' ? crypto : null) ||
            (typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto : null);

        if (!cryptoLib || !cryptoLib.subtle) {
            console.error('BG: Crypto Subtle API NOT available in this context');
            return null;
        }

        const privateKey = await cryptoLib.subtle.importKey(
            'pkcs8',
            privateKeyBuffer,
            { name: 'ECDSA', namedCurve: 'P-256' },
            false,
            ['sign']
        );
        const encoder = new TextEncoder();
        const data = encoder.encode(challenge);
        const signature = await cryptoLib.subtle.sign(
            { name: 'ECDSA', hash: { name: 'SHA-256' } },
            privateKey,
            data
        );
        return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
        console.error('BG: Signing Failed', e);
        return null;
    }
}

// --- BADGE MANAGEMENT ---
function updateBadge() {
    // Determine text and color based on count
    const text = unreadCount > 0 ? (unreadCount > 9 ? '9+' : String(unreadCount)) : '';
    const color = '#9333EA'; // Gravity Purple

    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color });
}

// --- SOCKET LOGIC ---
async function initChatSocket() {
    // 1. Get Creds
    const data = await chrome.storage.local.get(['gravity_chat_creds']);
    const creds: ChatCreds = data.gravity_chat_creds;

    if (!creds || !creds.username || !creds.privateKey) {
        console.log("BG Chat: No credentials found. Chat disabled.");
        if (socket) {
            socket.disconnect();
            socket = null;
        }
        return;
    }

    if (socket && socket.connected) {
        // Already connected
        return;
    }

    console.log("BG Chat: Connecting as", creds.username);

    socket = io(SERVER_URL, {
        transports: ['websocket'], // Force websocket in SW
        reconnection: true,
        reconnectionDelay: 5000,
        query: {
            username: creds.username,
            publicKey: creds.publicKey
        }
    });

    socket.on('connect', () => {
        console.log("BG Chat: Connected!");
        // We might need to authenticate if the server requires it for receiving notifications
        // Usually, 'register' or 'login' involves a challenge.
        // Let's trigger auth flow.
        socket?.emit('request_challenge', { username: creds.username });
    });

    socket.on('auth_challenge', async (challenge: string) => {
        console.log("BG Chat: Received challenge to sign");
        const signature = await signChallenge(challenge, creds.privateKey);
        if (signature && socket) {
            socket.emit('verify_signature', { signature });
        }
    });

    socket.on('auth_success', (data: any) => {
        console.log("BG Chat: Authenticated! Rooms:", data.rooms);
        // Explicitly join rooms just in case server auto-join failed for this socket
        if (data.rooms && Array.isArray(data.rooms)) {
            data.rooms.forEach((r: any) => {
                socket?.emit('join_room', r.id);
            });
        }
        updateBadge();
    });

    socket.on('new_message', (data: any) => {
        // Check if message is from ME. If so, ignore.
        console.log("BG Chat: New Message", data);
        if (data.message && data.message.senderName === creds.username) return;

        unreadCount++;
        updateBadge();
    });

    socket.on('message_notification', (_data: any) => {
        // If server sends specific streamlined events
        unreadCount++;
        updateBadge();
    });

    socket.on('disconnect', () => {
        console.log("BG Chat: Disconnected");
    });
}

// --- EXPORTED HANDLERS ---
export function setupChatListeners() {
    // Listen for credential sync
    chrome.runtime.onMessage.addListener((request: any, _sender: any, _sendResponse: any) => {
        if (request.type === 'CHAT_SYNC_CREDS') {
            console.log("BG Chat: Syncing credentials...");
            chrome.storage.local.set({ gravity_chat_creds: request.data }).then(() => {
                unreadCount = 0; // Reset on login
                updateBadge();
                initChatSocket();
            });
        }

        if (request.type === 'CHAT_LOGOUT') {
            console.log("BG Chat: Logging out...");
            chrome.storage.local.remove(['gravity_chat_creds']).then(() => {
                unreadCount = 0;
                updateBadge();
                if (socket) {
                    socket.disconnect();
                    socket = null;
                }
            });
        }

        // When UI opens, it might send 'CHAT_READ_ALL'
        if (request.type === 'CHAT_UI_OPENED') {
            unreadCount = 0;
            updateBadge();
            // Optional: Pause socket to save resources while UI handles it?
            // Actually better to keep it alive or let UI take over.
            // If UI and BG both have sockets, user gets double events?
            // Socket.io handles multiple sockets for same user fine (multiple tabs).
        }
    });

    // Initialize on startup
    initChatSocket();

    // Keep alive alarm?
    chrome.alarms.create('keepChatAlive', { periodInMinutes: 1 });
    chrome.alarms.onAlarm.addListener((alarm: any) => {
        if (alarm.name === 'keepChatAlive') {
            // Check connection
            if (!socket || !socket.connected) {
                console.log("BG Chat: Alarm triggered check - Reconnecting...");
                initChatSocket();
            }
        }
    });
}
