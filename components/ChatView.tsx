import React, { useState, useEffect, useRef } from 'react';
import { chatService, ChatRoom, ChatMessage, ChatUser } from '../services/chatService';

export const ChatView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // Identity State
    const [user, setUser] = useState<ChatUser | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [regError, setRegError] = useState<string | null>(null);

    // Chat State
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ChatUser[]>([]);

    // Create Room State
    const [isCreating, setIsCreating] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [isPrivateRoom, setIsPrivateRoom] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleCreateRoom = () => {
        if (newRoomName.trim().length < 3) return;
        chatService.createRoom(newRoomName.trim(), isPrivateRoom);
        setNewRoomName('');
        setIsPrivateRoom(false);
        setIsCreating(false);
    };

    // Init & Listeners
    useEffect(() => {
        // Check if already logged in
        const existing = chatService.getCurrentUser();
        if (existing) {
            setUser(existing);
        } else {
            // Service tries auto-login on init
            // We can listen for success
        }

        chatService.onAuthSuccess = (u) => {
            setUser(u);
            setIsRegistering(false);
        };

        chatService.onRoomUpdated = (updatedRooms) => {
            setRooms(updatedRooms);
            // If active room exists, update active room messages reference if needed
            // But active room is just an ID. 
        };

        chatService.onMessage = (roomId, msg) => {
            if (roomId === activeRoomId) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
            }
        };

        chatService.onError = (err) => {
            setRegError(err);
            setIsRegistering(false);
        };

        // Custom event for search results
        const handleSearch = (e: any) => {
            setSearchResults(e.detail);
        };
        const handleKicked = (e: any) => {
            if (e.detail.roomId === activeRoomId) {
                setActiveRoomId(null);
                alert('You have been removed from this room.');
            }
        };
        window.addEventListener('chat-search-results', handleSearch);
        window.addEventListener('chat-room-kicked', handleKicked);

        // Connect
        chatService.init();

        return () => {
            window.removeEventListener('chat-search-results', handleSearch);
            window.removeEventListener('chat-room-kicked', handleKicked);
        };
    }, [activeRoomId]);

    // Effect to load messages when active room changes
    useEffect(() => {
        if (activeRoomId) {
            const room = rooms.find(r => r.id === activeRoomId);
            if (room) {
                setMessages(room.messages);
                scrollToBottom();
            }
        }
    }, [activeRoomId, rooms]);

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const handleRegister = () => {
        if (usernameInput.trim().length < 3) {
            setRegError("Username must be at least 3 chars");
            return;
        }
        setIsRegistering(true);
        setRegError(null);
        chatService.register(usernameInput.trim());
    };

    const handleSend = () => {
        if (!activeRoomId || !inputText.trim()) return;
        chatService.sendMessage(activeRoomId, inputText);
        setInputText('');
    };

    const handleSearchUsers = (q: string) => {
        setSearchQuery(q);
        if (q.length > 1) {
            chatService.searchUsers(q);
        } else {
            setSearchResults([]);
        }
    };

    const startDM = (targetId: string) => {
        chatService.createDM(targetId);
        setSearchQuery('');
        setSearchResults([]);
    };

    // --- Render: Login Screen ---
    if (!user) {
        return (
            <div className="flex flex-col h-full bg-dark-900 text-white items-center justify-center p-6 animate-fadeIn">
                <div className="w-full max-w-sm bg-dark-800 p-8 rounded-2xl border border-dark-700 shadow-xl text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Gravity Chat</h2>
                    <p className="text-slate-400 text-sm mb-6">Create a unique username to join the community. This ID is separate from your wallets.</p>

                    {regError && (
                        <div className="bg-red-500/10 text-red-400 text-xs p-3 rounded-lg mb-4 border border-red-500/20">
                            {regError}
                        </div>
                    )}

                    <input
                        className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white mb-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-slate-600"
                        placeholder="Choose a username..."
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                    />

                    <button
                        onClick={handleRegister}
                        disabled={isRegistering}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-lg shadow-purple-900/20"
                    >
                        {isRegistering ? 'Joining...' : 'Join Chat'}
                    </button>

                    <button onClick={onClose} className="mt-4 text-slate-500 text-xs hover:text-white">Cancel</button>
                </div>
            </div>
        );
    }

    // --- Render: Main Chat ---
    return (
        <div className="flex h-full bg-dark-900 text-white overflow-hidden animate-fadeIn">
            {/* Left Sidebar: Rooms & Search */}
            <div className={`w-80 flex flex-col border-r border-dark-700 bg-dark-850 ${activeRoomId ? 'hidden md:flex' : 'flex w-full'}`}>
                {/* Header */}
                <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                            {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">{user.username}</span>
                            <span className="text-[10px] text-green-400 flex items-center gap-1">● Online</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="md:hidden text-slate-400">✕</button>
                </div>

                {/* Search */}
                {/* Search & Create */}
                <div className="p-3 space-y-2">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:border-purple-500 outline-none"
                                placeholder="Find ID or Room..."
                                value={searchQuery}
                                onChange={(e) => handleSearchUsers(e.target.value)}
                            />
                            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white p-2 rounded-lg transition-colors"
                            title="Create Room"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                    </div>

                    {/* Create Room Form */}
                    {isCreating && (
                        <div className="bg-dark-800 p-3 rounded-lg border border-dark-600 animate-fadeIn">
                            <input
                                autoFocus
                                className="w-full bg-dark-900 border border-dark-700 rounded p-2 text-sm mb-2"
                                placeholder="Room Name..."
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateRoom();
                                    if (e.key === 'Escape') setIsCreating(false);
                                }}
                            />
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="privateRoom"
                                    className="mr-2"
                                    checked={isPrivateRoom}
                                    onChange={(e) => setIsPrivateRoom(e.target.checked)}
                                />
                                <label htmlFor="privateRoom" className="text-xs text-slate-300">Private (Invite Only)</label>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => { setIsCreating(false); setIsPrivateRoom(false); }} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                                <button onClick={handleCreateRoom} className="text-xs bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-white">Create</button>
                            </div>
                        </div>
                    )}

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="mt-2 bg-dark-800 border border-dark-700 rounded-lg shadow-lg overflow-hidden">
                            {searchResults.map(u => (
                                <div key={u.id} onClick={() => startDM(u.id)} className="p-2 hover:bg-dark-700 cursor-pointer flex justify-between items-center group">
                                    <span className="text-sm">@{u.username}</span>
                                    <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100">Message</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Room List */}
                <div className="flex-1 overflow-y-auto px-2 space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2 mt-2">Rooms</div>
                    {rooms.filter(r => r.type === 'public' || r.type === 'private').map(room => (
                        <div
                            key={room.id}
                            onClick={() => setActiveRoomId(room.id)}
                            className={`p-3 rounded-lg cursor-pointer flex flex-col transition-colors ${activeRoomId === room.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-dark-700 text-slate-300'}`}
                        >
                            <div className="font-bold text-sm flex items-center gap-2">
                                <span className="opacity-70 text-xs">{room.type === 'public' ? '#' : '🔒'}</span> {room.name}
                            </div>
                        </div>
                    ))}

                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2 mt-4">Direct Messages</div>
                    {rooms.filter(r => r.type === 'dm').map(room => (
                        <div
                            key={room.id}
                            onClick={() => setActiveRoomId(room.id)}
                            className={`p-3 rounded-lg cursor-pointer flex flex-col transition-colors ${activeRoomId === room.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-dark-700 text-slate-300'}`}
                        >
                            <div className="font-bold text-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                {room.name.replace(user.username, '').replace(' & ', '').trim() || 'Chat'}
                            </div>
                        </div>
                    ))}

                    {rooms.length === 0 && (
                        <div className="text-xs text-slate-500 p-4 text-center italic">No active conversations.</div>
                    )}
                </div>
            </div>

            {/* Right: Active Chat Area */}
            <div className={`flex-1 flex flex-col bg-dark-900 ${!activeRoomId ? 'hidden md:flex' : 'flex'}`}>
                {!activeRoomId ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600 opacity-50">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p>Select a room to start chatting</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="h-14 border-b border-dark-700 flex items-center px-6 bg-dark-800 justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setActiveRoomId(null)} className="md:hidden text-slate-400 hover:text-white mr-2">←</button>
                                <h3 className="font-bold flex items-center gap-2">
                                    {rooms.find(r => r.id === activeRoomId)?.type === 'public' && <span className="text-slate-400">#</span>}
                                    {rooms.find(r => r.id === activeRoomId)?.type === 'private' && <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                                    {rooms.find(r => r.id === activeRoomId)?.name.replace(user.username, '').replace(' & ', '').replace(user.username, '').trim()}
                                </h3>
                            </div>
                            <div className="flex gap-4 items-center">
                                <button
                                    onClick={() => setShowParticipants(!showParticipants)}
                                    className={`p-2 rounded-lg transition-colors ${showParticipants ? 'bg-dark-600 text-purple-400' : 'text-slate-400 hover:bg-dark-700'}`}
                                    title="View Members"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </button>
                                {/* Invite Action for Private Rooms */}
                                {rooms.find(r => r.id === activeRoomId)?.type === 'private' && rooms.find(r => r.id === activeRoomId)?.owner === user.id && (
                                    <button
                                        onClick={() => {
                                            const target = prompt('Enter username to invite:');
                                            if (target) chatService.inviteUser(activeRoomId!, target);
                                        }}
                                        className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 border border-purple-900/50 bg-purple-900/20 px-2 py-1 rounded"
                                    >
                                        + Invite
                                    </button>
                                )}
                                {/* Owner Actions */}
                                {rooms.find(r => r.id === activeRoomId)?.owner === user.id && rooms.find(r => r.id === activeRoomId)?.id !== 'global-lobby' && (
                                    <button
                                        onClick={() => {
                                            if (confirm('Delete this room permanently?')) {
                                                chatService.closeRoom(activeRoomId!);
                                                setActiveRoomId(null);
                                            }
                                        }}
                                        className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 border border-red-900/50 bg-red-900/20 px-2 py-1 rounded"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        Close
                                    </button>
                                )}
                                <button onClick={onClose} className="text-slate-400 hover:text-white hidden md:block">✕</button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, i) => {
                                const isMe = msg.senderId === user.id;
                                const showAvatar = i === 0 || messages[i - 1].senderId !== msg.senderId;

                                return (
                                    <div key={msg.id || i} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${showAvatar ? (isMe ? 'bg-purple-600' : 'bg-slate-600') : 'opacity-0'}`}>
                                            {msg.senderName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                            {showAvatar && <span className="text-[10px] text-slate-400 mb-1 px-1">{msg.senderName}</span>}
                                            <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-dark-700 text-slate-200 rounded-tl-sm'}`}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[10px] text-slate-600 mt-1 px-1">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-dark-800 border-t border-dark-700">
                            <div className="flex items-center gap-2 bg-dark-900 border border-dark-600 rounded-xl px-2 py-2 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
                                <input
                                    className="flex-1 bg-transparent px-2 text-white placeholder-slate-500 outline-none text-sm"
                                    placeholder={`Message ${rooms.find(r => r.id === activeRoomId)?.type === 'public' ? '#' + rooms.find(r => r.id === activeRoomId)?.name : 'User'}...`}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputText.trim()}
                                    className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:bg-dark-700"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* User List Sidebar (Participants) */}
            {activeRoomId && showParticipants && (
                <div className="w-64 bg-dark-800 border-l border-dark-700 flex flex-col animate-slideInRight">
                    <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500">Participants</span>
                        <button onClick={() => setShowParticipants(false)} className="text-slate-500 hover:text-white">✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {rooms.find(r => r.id === activeRoomId)?.memberDetails?.map(member => (
                            <div key={member.id} className="flex flex-col gap-2 p-2 rounded hover:bg-dark-700/50 transition-colors border border-transparent hover:border-dark-600">
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${member.id === user?.id ? 'text-purple-400 font-bold' : 'text-slate-300'}`}>
                                        @{member.username}
                                        {rooms.find(r => r.id === activeRoomId)?.owner === member.id && <span className="ml-1 text-[8px] bg-orange-900/30 border border-orange-500/30 px-1 rounded text-orange-400">Owner</span>}
                                    </span>
                                </div>
                                {/* Mod Controls */}
                                {rooms.find(r => r.id === activeRoomId)?.owner === user?.id && member.id !== user?.id && (
                                    <div className="flex gap-1 mt-1">
                                        <button
                                            onClick={() => chatService.muteUser(activeRoomId, member.id)}
                                            className="flex-1 text-[9px] bg-dark-900 border border-dark-600 hover:bg-slate-700 px-1.5 py-1 rounded text-slate-400 hover:text-white transition-colors"
                                        >
                                            Mute
                                        </button>
                                        <button
                                            onClick={() => { if (confirm('Kick user?')) chatService.kickUser(activeRoomId, member.id) }}
                                            className="flex-1 text-[9px] bg-dark-900 border border-dark-600 hover:bg-red-900/20 px-1.5 py-1 rounded text-slate-400 hover:text-red-400 transition-colors"
                                        >
                                            Kick
                                        </button>
                                        <button
                                            onClick={() => { if (confirm('Ban user permanently?')) chatService.banUser(activeRoomId, member.id) }}
                                            className="flex-1 text-[9px] bg-red-900/40 border border-red-700 hover:bg-red-800 px-1.5 py-1 rounded text-white transition-colors font-bold"
                                        >
                                            Ban
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
