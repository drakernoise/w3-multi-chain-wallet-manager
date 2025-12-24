
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// --- Gravity Chat State ---
// Users: { id: string, username: string, publicKey: string, rooms: string[] }
// Mapped by UserID (UUID)
const users = {};
const usernames = {}; // username -> userId (for uniqueness check)

// Rooms: { id: string, name: string, type: 'public'|'private'|'dm', members: string[], owner: string, admins: string[] }
const rooms = {
    'global-lobby': {
        id: 'global-lobby',
        name: 'Global Lobby',
        desc: 'Official Gravity Community',
        type: 'public',
        owner: 'system',
        admins: [],
        members: [], // Public room usually doesn't need persistent members list if open, but good for tracking
        messages: []
    }
};

const connectedSockets = {}; // socketId -> userId

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // --- 1. Registration / Login ---
    socket.on('register', (data) => {
        const { username, publicKey, existingId } = data;

        // If trying to restore an existing session
        if (existingId && users[existingId]) {
            // Validation: In real app, challenge with signature using publicKey
            // For MVP: Trust ID if it matches
            const user = users[existingId];
            socket.user = user;
            connectedSockets[socket.id] = user.id;
            socket.emit('auth_success', {
                id: user.id,
                username: user.username,
                rooms: getAvailableRooms(user.id)
            });
            return;
        }

        // Helper: Validate username
        if (!username || username.length < 3) {
            socket.emit('error', 'Username too short');
            return;
        }
        if (usernames[username.toLowerCase()]) {
            socket.emit('error', 'Username already taken');
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

        socket.emit('auth_success', {
            id: newId,
            username,
            rooms: getAvailableRooms(newId)
        });

        // Auto-join Global Lobby
        socket.join('global-lobby');
        socket.emit('joined_room', { roomId: 'global-lobby', roomData: rooms['global-lobby'] });
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

        // Check permissions (bans, private rooms, etc)
        // For public rooms, anyone can join
        // For DMs, must be member

        socket.join(roomId);
        // Send history
        socket.emit('room_history', {
            roomId,
            messages: room.messages.slice(-50)
        });
    });

    socket.on('send_message', (data) => {
        if (!socket.user) return;
        const { roomId, content } = data;
        const room = rooms[roomId];

        if (!room) return;

        const msg = {
            id: uuidv4(),
            senderId: socket.user.id,
            senderName: socket.user.username,
            content,
            timestamp: new Date().toISOString()
        };

        room.messages.push(msg);
        if (room.messages.length > 200) room.messages.shift();

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
            members: [socket.user.id, targetUserId],
            messages: []
        };

        rooms[newRoomId] = newRoom;

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
        type: r.type
    }));
}

const PORT = 3030;
server.listen(PORT, () => {
    console.log(`Gravity Chat Server (Standalone) running on port ${PORT}`);
});
