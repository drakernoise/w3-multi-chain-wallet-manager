
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'chat_db.json');

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

        saveData();

        socket.emit('auth_success', {
            id: newId,
            username,
            rooms: getAvailableRooms(newId)
        });

        // Auto-join Global Lobby
        socket.join('global-lobby');
        const lobbyData = {
            ...rooms['global-lobby'],
            memberDetails: rooms['global-lobby'].members.map(id => ({ id, username: users[id]?.username }))
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
            memberDetails: room.members.map(id => ({ id, username: users[id]?.username }))
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

const PORT = 3030;
server.listen(PORT, () => {
    console.log(`Gravity Chat Server (Standalone) running on port ${PORT}`);
});
