
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STORAGE_DIR = process.env.DB_PATH || __dirname;
const DB_PATH = path.join(STORAGE_DIR, 'chat_db.json');

const app = express();
app.use(cors());

// Health check for cloud deployment services (like Render/Railway)
app.get('/', (req, res) => res.send('Gravity Chat Server is Online'));
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date() }));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// --- Gravity Chat State ---
let users = {};
let usernames = {};
let rooms = {
    'global-lobby': {
        id: 'global-lobby',
        name: 'Global Lobby',
        desc: 'Official Gravity Community',
        type: 'public',
        owner: 'system',
        admins: [],
        members: [],
        bans: [],
        mutes: [],
        messages: []
    }
};

function loadData() {
    try {
        if (fs.existsSync(DB_PATH)) {
            const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
            users = data.users || {};
            usernames = data.usernames || {};
            // Merge rooms with default global-lobby
            rooms = { ...rooms, ...(data.rooms || {}) };
            console.log('Loaded chat data from disk.');
        }
    } catch (err) {
        console.error('Failed to load data:', err);
    }
}

function saveData() {
    try {
        const data = { users, usernames, rooms };
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Failed to save data:', err);
    }
}

loadData();

const connectedSockets = {}; // socketId -> userId
const authChallenges = {}; // socketId -> { challenge, timestamp }

// Helper: Verify ECDSA signature
function verifySignature(publicKeyHex, challenge, signatureHex) {
    try {
        // Convert hex strings to buffers
        const publicKeyBuffer = Buffer.from(publicKeyHex, 'hex');
        const signatureBuffer = Buffer.from(signatureHex, 'hex');

        // Create verifier
        const verify = crypto.createVerify('SHA256');
        verify.update(challenge);

        // Construct public key in PEM format for ECDSA secp256k1
        // The publicKeyHex should be 65 bytes (130 hex chars) for uncompressed key
        const publicKeyPem = `-----BEGIN PUBLIC KEY-----
${publicKeyBuffer.toString('base64')}
-----END PUBLIC KEY-----`;

        return verify.verify(publicKeyPem, signatureBuffer);
    } catch (err) {
        console.error('Signature verification error:', err);
        return false;
    }
}

// Generate authentication challenge
function generateChallenge() {
    return crypto.randomBytes(32).toString('hex');
}

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // --- 0. Challenge-Response Authentication (Optional Enhanced Security) ---
    socket.on('request_challenge', (data) => {
        const { userId } = data;
        const user = users[userId];

        if (!user || !user.publicKey) {
            socket.emit('error', 'User not found or no public key registered');
            return;
        }

        const challenge = generateChallenge();
        authChallenges[socket.id] = {
            challenge,
            userId,
            timestamp: Date.now()
        };

        // Challenge expires in 5 minutes
        setTimeout(() => {
            delete authChallenges[socket.id];
        }, 5 * 60 * 1000);

        socket.emit('auth_challenge', { challenge });
    });

    socket.on('verify_signature', (data) => {
        const { signature } = data;
        const challengeData = authChallenges[socket.id];

        if (!challengeData) {
            socket.emit('error', 'No active challenge or challenge expired');
            return;
        }

        const user = users[challengeData.userId];
        if (!user) {
            socket.emit('error', 'User not found');
            return;
        }

        const isValid = verifySignature(user.publicKey, challengeData.challenge, signature);

        if (!isValid) {
            socket.emit('error', 'Invalid signature');
            delete authChallenges[socket.id];
            return;
        }

        // Signature verified - authenticate user
        socket.user = user;
        connectedSockets[socket.id] = user.id;
        delete authChallenges[socket.id];

        const availableRooms = getAvailableRooms(user.id);

        socket.emit('auth_success', {
            id: user.id,
            username: user.username,
            rooms: availableRooms
        });

        // Auto-join ALL available rooms (public + private memberships)
        availableRooms.forEach(r => {
            socket.join(r.id);
            socket.to(r.id).emit('user_online', user.id);
        });
    });

    // --- 1. Registration / Login ---
    socket.on('register', (data) => {
        const { username, publicKey, existingId } = data;

        // If trying to restore an existing session
        if (existingId) {
            const user = users[existingId];
            if (user) {
                socket.user = user;
                connectedSockets[socket.id] = user.id;

                const availableRooms = getAvailableRooms(user.id);
                socket.emit('auth_success', {
                    id: user.id,
                    username: user.username,
                    rooms: availableRooms
                });

                // Auto-join ALL available rooms
                availableRooms.forEach(r => {
                    socket.join(r.id);
                });
                return;
            }
            if (username) {
                // If ID is provided but user record is lost, check if the username matches the ID in usernames map
                const storedId = usernames[username.toLowerCase()];
                if (storedId === existingId) {
                    console.log(`Recovering user record for ${username}`);
                    // Re-create the user record
                    const newUser = {
                        id: existingId,
                        username,
                        publicKey,
                        rooms: ['global-lobby']
                    };
                    users[existingId] = newUser;
                    saveData();
                    socket.user = newUser;
                    connectedSockets[socket.id] = existingId;

                    const availableRooms = getAvailableRooms(existingId);
                    socket.emit('auth_success', {
                        id: existingId,
                        username,
                        rooms: availableRooms
                    });

                    // Auto-join ALL available rooms
                    availableRooms.forEach(r => {
                        socket.join(r.id);
                        socket.to(r.id).emit('user_online', existingId);
                    });
                    return;
                }
            }
        }

        // Helper: Validate username
        if (!username || username.length < 3) {
            socket.emit('error', 'Username too short');
            return;
        }

        const existingStoredId = usernames[username.toLowerCase()];
        if (existingStoredId && existingStoredId !== existingId) {
            socket.emit('error', 'Username already taken by another user');
            return;
        }

        // Create New User
        const newId = uuidv4();
        const newUser = {
            id: newId,
            username,
            publicKey, // stored for future auth challenges
            rooms: ['global-lobby']
        };

        users[newId] = newUser;
        usernames[username.toLowerCase()] = newId;

        socket.user = newUser;
        connectedSockets[socket.id] = newId;

        saveData();

        socket.emit('auth_success', {
            id: newId,
            username,
            rooms: getAvailableRooms(newId)
        });

        // Auto-join Global Lobby
        socket.join('global-lobby');
        socket.to('global-lobby').emit('user_online', newId);

        const lobbyData = {
            ...rooms['global-lobby'],
            memberDetails: rooms['global-lobby'].members.map(id => ({
                id,
                username: users[id]?.username,
                isOnline: Object.values(connectedSockets).includes(id)
            }))
        };
        socket.emit('joined_room', { roomId: 'global-lobby', roomData: lobbyData });
    });

    // --- 2. User Discovery ---
    socket.on('search_users', (query) => {
        if (!socket.user) return;
        if (!query || query.length < 2) return;

        const results = Object.values(users)
            .filter(u => u.username.toLowerCase().includes(query.toLowerCase()) && u.id !== socket.user.id)
            .map(u => ({ id: u.id, username: u.username }))
            .slice(0, 10); // Limit results

        socket.emit('search_results', results);
    });

    // --- 3. Messaging ---
    socket.on('join_room', (roomId) => {
        if (!socket.user) return;
        const room = rooms[roomId];
        if (!room) return;

        // Check for bans
        if (room.bans && room.bans.includes(socket.user.id)) {
            socket.emit('error', 'You are banned from this room');
            return;
        }

        socket.join(roomId);
        // Track member
        if (!room.members.includes(socket.user.id)) {
            room.members.push(socket.user.id);
            saveData();
            // Notify others a new member joined
            io.to(roomId).emit('member_joined', { roomId, userId: socket.user.id, username: socket.user.username });
        }

        // Send history
        socket.emit('room_history', {
            roomId,
            messages: room.messages.slice(-50),
            memberDetails: room.members.map(id => ({
                id,
                username: users[id]?.username,
                isOnline: Object.values(connectedSockets).includes(id)
            }))
        });
    });

    socket.on('send_message', (data) => {
        if (!socket.user) return;
        const { roomId, content } = data;
        const room = rooms[roomId];

        if (!room) return;

        // Check for mutes
        if (room.mutes && room.mutes.includes(socket.user.id)) {
            socket.emit('error', 'You are muted in this room');
            return;
        }

        const msg = {
            id: uuidv4(),
            senderId: socket.user.id,
            senderName: socket.user.username,
            content,
            timestamp: new Date().toISOString()
        };

        room.messages.push(msg);
        if (room.messages.length > 200) room.messages.shift();

        saveData();

        io.to(roomId).emit('new_message', { roomId, message: msg });
    });

    // --- 4. Direct Messages (Create Room) ---
    socket.on('create_dm', (targetUserId) => {
        if (!socket.user) return;
        const targetUser = users[targetUserId];
        if (!targetUser) return;

        // Check if DM already exists
        const existingRoom = Object.values(rooms).find(r =>
            r.type === 'dm' &&
            r.members.includes(socket.user.id) &&
            r.members.includes(targetUserId)
        );

        if (existingRoom) {
            socket.emit('dm_created', { roomId: existingRoom.id });
            return;
        }

        const newRoomId = uuidv4();
        const newRoom = {
            id: newRoomId,
            name: `${socket.user.username} & ${targetUser.username}`, // Dynamic name usually handled by client
            type: 'dm',
            owner: socket.user.id,
            members: [socket.user.id, targetUserId],
            messages: []
        };

        rooms[newRoomId] = newRoom;

        saveData();

        // Notify both users
        // Use io.to() with socket IDs. We need to find target's socket(s)
        const targetSockets = Object.keys(connectedSockets).filter(sId => connectedSockets[sId] === targetUserId);

        // Notify Sender
        socket.emit('room_added', newRoom);
        socket.join(newRoomId);

        // Notify Receiver
        targetSockets.forEach(sId => {
            const s = io.sockets.sockets.get(sId);
            if (s) {
                s.join(newRoomId);
                s.emit('room_added', newRoom);
            }
        });
    });

    // --- 5. Custom Rooms (User Created) ---
    socket.on('create_room', (data) => {
        if (!socket.user) return;
        const { name, isPrivate } = data;

        if (!name || name.length < 3) {
            socket.emit('error', 'Room name too short');
            return;
        }

        const newId = uuidv4();
        const newRoom = {
            id: newId,
            name,
            type: isPrivate ? 'private' : 'public',
            owner: socket.user.id, // Only owner can close
            members: [socket.user.id],
            admins: [socket.user.id],
            bans: [],
            mutes: [],
            messages: []
        };

        rooms[newId] = newRoom;

        saveData();

        // Broadcast to owner
        socket.join(newId);
        socket.emit('room_added', newRoom);

        // If public, broadcast to everyone else
        if (!isPrivate) {
            socket.broadcast.emit('room_added', newRoom);
        }
    });

    socket.on('invite_user', (data) => {
        if (!socket.user) return;
        const { roomId, targetUsername } = data;
        const room = rooms[roomId];

        if (!room) return;
        if (room.owner !== socket.user.id && !room.admins?.includes(socket.user.id)) {
            socket.emit('error', 'Unauthorized');
            return;
        }

        const targetUserId = usernames[targetUsername.toLowerCase()];
        if (!targetUserId) {
            socket.emit('error', 'User not found');
            return;
        }

        // Add to members
        if (!room.members.includes(targetUserId)) {
            room.members.push(targetUserId);
            saveData();
        }

        // Notify Target
        Object.keys(connectedSockets).forEach(sId => {
            if (connectedSockets[sId] === targetUserId) {
                const s = io.sockets.sockets.get(sId);
                if (s) {
                    s.join(roomId);
                    s.emit('room_added', room);
                }
            }
        });
        socket.emit('success', `Invited ${targetUsername}`);
    });

    // --- 6. Moderation ---
    socket.on('kick_user', (data) => {
        const { roomId, targetUserId } = data;
        const room = rooms[roomId];
        if (!room) return;
        if (room.owner !== socket.user.id && !room.admins?.includes(socket.user.id)) return;

        // Notify the user they were kicked
        io.to(roomId).emit('user_kicked', { roomId, userId: targetUserId });

        // Find their sockets and force leave
        Object.keys(connectedSockets).forEach(sId => {
            if (connectedSockets[sId] === targetUserId) {
                const s = io.sockets.sockets.get(sId);
                if (s) s.leave(roomId);
            }
        });
    });

    socket.on('ban_user', (data) => {
        const { roomId, targetUserId } = data;
        const room = rooms[roomId];
        if (!room) return;
        if (room.owner !== socket.user.id && !room.admins?.includes(socket.user.id)) return;

        if (!room.bans.includes(targetUserId)) {
            room.bans.push(targetUserId);
            saveData();
        }

        io.to(roomId).emit('user_banned', { roomId, userId: targetUserId });

        // Force leave
        Object.keys(connectedSockets).forEach(sId => {
            if (connectedSockets[sId] === targetUserId) {
                const s = io.sockets.sockets.get(sId);
                if (s) s.leave(roomId);
            }
        });
    });

    socket.on('unban_user', (data) => {
        const { roomId, targetUserId } = data;
        const room = rooms[roomId];
        if (!room) return;
        if (room.owner !== socket.user.id && !room.admins?.includes(socket.user.id)) return;

        room.bans = room.bans.filter(id => id !== targetUserId);
        saveData();
    });

    socket.on('mute_user', (data) => {
        const { roomId, targetUserId } = data;
        const room = rooms[roomId];
        if (!room) return;
        if (room.owner !== socket.user.id && !room.admins?.includes(socket.user.id)) return;

        if (!room.mutes.includes(targetUserId)) {
            room.mutes.push(targetUserId);
            saveData();
        }
        io.to(roomId).emit('user_muted', { roomId, userId: targetUserId });
    });

    socket.on('unmute_user', (data) => {
        const { roomId, targetUserId } = data;
        const room = rooms[roomId];
        if (!room) return;
        if (room.owner !== socket.user.id && !room.admins?.includes(socket.user.id)) return;

        room.mutes = room.mutes.filter(id => id !== targetUserId);
        saveData();
        io.to(roomId).emit('user_unmuted', { roomId, userId: targetUserId });
    });

    socket.on('close_room', (roomId) => {
        if (!socket.user) return;
        const room = rooms[roomId];

        if (!room) return;

        // Security Check
        // global-lobby cannot be closed
        if (room.id === 'global-lobby') {
            socket.emit('error', 'Cannot close Global Lobby');
            return;
        }

        if (room.owner !== socket.user.id) {
            socket.emit('error', 'Only the room creator can close this room.');
            return;
        }

        // Delete Room
        delete rooms[roomId];

        saveData();

        // Notify all clients to remove from list and kick users
        io.to(roomId).emit('room_closed', roomId);
        io.in(roomId).socketsLeave(roomId); // Force all sockets to leave
        io.emit('room_removed', roomId); // Update lists for everyone
    });

    socket.on('disconnecting', () => {
        if (socket.user) {
            // socket.rooms is a Set containing the socket ID and joined rooms
            for (const roomId of socket.rooms) {
                if (roomId !== socket.id) {
                    socket.to(roomId).emit('user_offline', socket.user.id);
                }
            }
        }
    });

    socket.on('disconnect', () => {
        delete connectedSockets[socket.id];
    });
});

function getAvailableRooms(userId) {
    // Return Public Rooms + Private Rooms user is member of
    return Object.values(rooms).filter(r =>
        r.type === 'public' || r.members?.includes(userId)
    ).map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        owner: r.owner
    }));
}

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
    console.log(`Gravity Chat Server running on port ${PORT}`);
});
