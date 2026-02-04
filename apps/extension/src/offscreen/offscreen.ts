
import { io, Socket } from "socket.io-client";

interface ChatCreds {
    username: string;
    publicKey: string;
    privateKey: string;
}

let socket: Socket | null = null;
const SERVER_URL = 'https://chat.gravitywallet.com'; // Updated from old Render URL

declare var chrome: any;

// Listen for messages from Background
chrome.runtime.onMessage.addListener((msg: any, _sender: any, _sendResponse: any) => {
    if (msg.type === 'INIT_CHAT') {
        initChat(msg.creds);
    } else if (msg.type === 'DISCONNECT_CHAT') {
        disconnectChat();
    }
});

function hexToBuffer(hexString: string): ArrayBuffer {
    if (!hexString) return new Uint8Array().buffer;
    const bytes = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    return bytes.buffer;
}

async function signChallenge(challenge: string, privateKeyHex: string): Promise<string | null> {
    try {
        const privateKeyBuffer = hexToBuffer(privateKeyHex);
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
        return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
        console.error('Offscreen: Signing Failed', e);
        return null;
    }
}

async function initChat(creds: ChatCreds) {
    if (socket && socket.connected) {
        socket.disconnect();
    }

    console.log('Offscreen: Connecting...', creds.username);

    socket = io(SERVER_URL, {
        reconnection: true,
        transports: ['websocket'],
        query: {
            username: creds.username,
            publicKey: creds.publicKey
        }
    });

    socket.on('connect', () => {
        console.log('Offscreen: Connected, requesting challenge');
        socket?.emit('request_challenge', { username: creds.username });
    });

    socket.on('auth_challenge', async (challenge: string) => {
        const signature = await signChallenge(challenge, creds.privateKey);
        if (signature) socket?.emit('verify_signature', { signature });
    });

    socket.on('auth_success', (data: any) => {
        console.log('Offscreen: Authenticated');
        if (data.rooms && Array.isArray(data.rooms)) {
            data.rooms.forEach((r: any) => socket?.emit('join_room', r.id));
        }
    });

    socket.on('new_message', (data: any) => {
        const sender = data.message?.senderName || '';
        const myName = creds.username || '';
        // Ignore own messages
        if (sender.toLowerCase() === myName.toLowerCase()) return;

        // Notify Background to increment Badge
        chrome.runtime.sendMessage({ type: 'OFFSCREEN_NEW_MESSAGE' });
    });

    socket.on('message_notification', () => {
        chrome.runtime.sendMessage({ type: 'OFFSCREEN_NEW_MESSAGE' });
    });
}

function disconnectChat() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

// Auto-start if creds exist
// Auto-start if creds exist
try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['gravity_chat_creds'], (res: any) => {
            if (res && res.gravity_chat_creds) {
                initChat(res.gravity_chat_creds);
            }
        });
    }
} catch (e) {
    console.error("Offscreen: Storage init error", e);
}
