import React, { useState, useEffect, useRef } from 'react';
import { chatService, ChatRoom, ChatMessage, ChatUser } from '../services/chatService';
import { useTranslation } from '../contexts/LanguageContext';

export const ChatView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useTranslation();
    // Identity State
    const [user, setUser] = useState<ChatUser | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [regError, setRegError] = useState<string | null>(null);
    const [socketStatus, setSocketStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'authenticated'>('disconnected');
    const [lastError, setLastError] = useState<string | null>(null);

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
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [chatModal, setChatModal] = useState<{ type: 'invite' | 'confirm_delete' | 'confirm_kick' | 'confirm_ban', data?: any } | null>(null);
    const [modalInput, setModalInput] = useState('');

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
        chatService.init(); // CRITICAL: Start connection
        setSocketStatus(chatService.getCurrentUser() ? 'authenticated' : 'connecting');

        // Check if already logged in
        const existing = chatService.getCurrentUser();
        if (existing) {
            setUser(existing);
            setSocketStatus('authenticated');
        }

        chatService.onAuthSuccess = (u) => {
            setUser(u);
            setIsRegistering(false);
            setSocketStatus('authenticated');
        };

        chatService.onStatusChange = (status, errMsg) => {
            setSocketStatus(status as any);
            if (errMsg) setLastError(errMsg);
            // If the server explicitly says "Username already taken" or "Session expired", we should allow the user to see the Choose Username screen
            if (errMsg && (errMsg.includes('taken') || errMsg.includes('expired'))) {
                setIsRegistering(false);
            }
        };

        chatService.onRoomAdded = (room) => {
            if (room.type === 'dm' || room.type === 'private') {
                setNotification({
                    msg: t('chat.invited_to', { room: room.name }),
                    type: 'success'
                });
                setTimeout(() => setNotification(null), 5000);
            }
        };

        chatService.onRoomUpdated = (updatedRooms) => {
            setRooms(updatedRooms);
        };

        chatService.onMessage = (roomId, msg) => {
            if (roomId === activeRoomId) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
            }
        };

        chatService.onError = (err) => {
            setNotification({ msg: err, type: 'error' });
            setIsRegistering(false);
        };

        // Custom event for search results
        const handleSearch = (e: any) => {
            setSearchResults(e.detail);
        };
        const handleKicked = (e: any) => {
            if (e.detail.roomId === activeRoomId) {
                setActiveRoomId(null);
                setNotification({ msg: 'You have been removed from this room', type: 'warning' });
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

    // Notification Timer
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

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

    const handleModalAction = () => {
        if (!chatModal) return;
        const { type, data } = chatModal;

        switch (type) {
            case 'invite':
                if (modalInput.trim() && activeRoomId) {
                    chatService.inviteUser(activeRoomId, modalInput.trim());
                    setNotification({ msg: `Invitation sent to ${modalInput}`, type: 'success' });
                }
                break;
            case 'confirm_delete':
                if (activeRoomId) {
                    chatService.closeRoom(activeRoomId);
                    setActiveRoomId(null);
                    setNotification({ msg: 'Room deleted', type: 'info' });
                }
                break;
            case 'confirm_kick':
                if (activeRoomId && data) {
                    chatService.kickUser(activeRoomId, data.id);
                    setNotification({ msg: `Kicked @${data.username}`, type: 'warning' });
                }
                break;
            case 'confirm_ban':
                if (activeRoomId && data) {
                    chatService.banUser(activeRoomId, data.id);
                    setNotification({ msg: `Banned @${data.username} permanently`, type: 'error' });
                }
                break;
        }

        setChatModal(null);
        setModalInput('');
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

    // --- Render: Loading & Error States ---
    if (!user && (socketStatus === 'connecting' || socketStatus === 'disconnected')) {
        return (
            <div className="flex flex-col h-full bg-dark-900 text-white items-center justify-center p-6 text-center">
                {socketStatus === 'connecting' ? (
                    <>
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 animate-pulse font-medium">{t('chat.status_connecting')}</p>
                        <p className="text-[10px] text-slate-600 mt-2 max-w-[200px]">Establishing secure connection with Gravity Servers.</p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <p className="text-red-400 font-bold mb-1">Connection Failed</p>
                        <p className="text-[10px] text-slate-500 mb-2">Could not reach the chat server.</p>
                        {lastError && <p className="text-[9px] text-red-500/70 mb-6 italic max-w-xs">{lastError}</p>}
                        <button
                            onClick={() => { setSocketStatus('connecting'); setLastError(null); chatService.init(); }}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-bold transition-all active:scale-95 mb-4"
                        >
                            Retry Connection
                        </button>
                    </>
                )}
                <button onClick={onClose} className="text-slate-600 text-xs hover:text-white transition-colors mt-2 underline">{t('common.close')}</button>
            </div>
        );
    }

    // --- Render: Login Screen ---
    if (!user) {
        return (
            <div className="flex flex-col h-full bg-dark-900 text-white items-center justify-center p-6 animate-fadeIn">
                <div className="w-full max-w-sm bg-dark-800 p-8 rounded-2xl border border-dark-700 shadow-xl text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{t('chat.title')}</h2>
                    <p className="text-slate-400 text-sm mb-6">Create a unique username to join the community. This ID is separate from your wallets.</p>

                    {regError && (
                        <div className="bg-red-500/10 text-red-400 text-xs p-3 rounded-lg mb-4 border border-red-500/20 flex flex-col gap-2">
                            <span>{regError}</span>
                            <button
                                onClick={() => { chatService.logout(); window.location.reload(); }}
                                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-3 py-1.5 rounded text-[9px] font-black uppercase self-center transition-colors"
                            >
                                {t('chat.clear_identity')}
                            </button>
                        </div>
                    )}

                    <input
                        className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white mb-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-slate-600"
                        placeholder={t('chat.placeholder_username')}
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                    />

                    <button
                        onClick={handleRegister}
                        disabled={isRegistering}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-lg shadow-purple-900/20"
                    >
                        {isRegistering ? t('common.processing') : t('chat.btn_join')}
                    </button>

                    <button onClick={onClose} className="mt-4 text-slate-500 text-xs hover:text-white underline">{t('common.cancel')}</button>
                </div>
            </div>
        );
    }

    // --- Render: Main Chat ---
    return (
        <div className="flex h-full bg-dark-900 text-white overflow-hidden animate-fadeIn">
            {/* Left Sidebar: Rooms & Search */}
            <div className={`w-80 flex flex-col border-r border-dark-700 bg-dark-850 ${activeRoomId ? 'hidden md:flex' : 'flex w-full'}`}>
                {/* Sidebar Header (Profile) */}
                <div className="p-3 border-b border-dark-700 bg-dark-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold shadow-sm">
                            {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xs truncate max-w-[100px]">{user.username}</span>
                            <span className="text-[9px] text-green-400 flex items-center gap-1">● Online</span>
                        </div>
                    </div>
                    <button onClick={() => setIsCreating(true)} className="p-1.5 bg-dark-700 hover:bg-purple-600/20 text-slate-400 hover:text-purple-400 rounded-lg transition-all" title="New Room">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>

                {/* Unified Search Bar */}
                <div className="p-3 border-b border-dark-700 bg-dark-900/20">
                    <div className="relative">
                        <input
                            className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-8 pr-4 py-1.5 text-xs outline-none focus:border-purple-500 transition-all placeholder-slate-600"
                            placeholder="Find ID or Room..."
                            value={searchQuery}
                            onChange={(e) => handleSearchUsers(e.target.value)}
                        />
                        <svg className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>

                    {/* Search Overlay */}
                    {searchResults.length > 0 && (
                        <div className="absolute left-2 right-2 mt-1 z-50 bg-dark-800 border border-dark-600 rounded-xl shadow-2xl overflow-hidden animate-slideDown">
                            <div className="p-2 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                                <span className="text-[9px] font-bold text-slate-500 uppercase">Search Results</span>
                                <button onClick={() => setSearchResults([])} className="text-slate-500 hover:text-white">✕</button>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {searchResults.map(u => (
                                    <div key={u.id} onClick={() => startDM(u.id)} className="px-3 py-2 hover:bg-purple-900/20 cursor-pointer flex items-center gap-2 border-b border-dark-700/50 last:border-0 transition-colors group">
                                        <div className="w-6 h-6 bg-dark-700 group-hover:bg-purple-600 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-400 group-hover:text-white transition-colors">
                                            {u.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium">@{u.username}</span>
                                            <span className="text-[9px] text-slate-500">Click to start DM</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Create Room Form (Inline) */}
                {isCreating && (
                    <div className="m-3 p-3 bg-dark-800 rounded-xl border border-purple-500/30 animate-fadeIn shadow-lg">
                        <input
                            autoFocus
                            className="w-full bg-dark-950 border border-dark-700 rounded-lg px-3 py-2 text-xs mb-3 focus:border-purple-500 outline-none"
                            placeholder="My awesome room..."
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateRoom();
                                if (e.key === 'Escape') setIsCreating(false);
                            }}
                        />
                        <div className="flex items-center mb-3 group cursor-pointer" onClick={() => setIsPrivateRoom(!isPrivateRoom)}>
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center mr-2 transition-colors ${isPrivateRoom ? 'bg-purple-600 border-purple-600' : 'border-dark-600 bg-dark-900/50'}`}>
                                {isPrivateRoom && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                            </div>
                            <label className="text-[10px] text-slate-400 cursor-pointer group-hover:text-slate-200">Private (Invite Only)</label>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => { setIsCreating(false); setIsPrivateRoom(false); }} className="text-[10px] py-1.5 px-3 rounded-lg hover:bg-dark-700 text-slate-400 transition-colors">Cancel</button>
                            <button onClick={handleCreateRoom} className="text-[10px] py-1.5 px-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold transition-all shadow-md">Create Room</button>
                        </div>
                    </div>
                )}

                {/* Room List */}
                <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2 mt-2">{t('chat.rooms')}</div>
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
                        <div className="text-xs text-slate-500 p-4 text-center italic">{t('chat.no_rooms')}</div>
                    )}
                </div>
            </div>

            {/* Right: Active Chat Area */}
            <div className={`flex-1 flex flex-col bg-dark-900 ${!activeRoomId ? 'hidden md:flex' : 'flex'}`}>
                {!activeRoomId ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600 opacity-50">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8S21 7.582 21 12z" /></svg>
                        <p>Select a room to start chatting</p>
                    </div>
                ) : (() => {
                    const room = rooms.find(r => r.id === activeRoomId);
                    if (!room) return null;

                    const isOwner = room.owner === user?.id;
                    const isDM = room.type === 'dm';
                    const cleanName = isDM
                        ? room.name.replace(user?.username || '', '').replace(' & ', '').replace(user?.username || '', '').trim()
                        : room.name;

                    return (
                        <>
                            {/* Chat Header */}
                            <div className="h-14 border-b border-dark-700 flex items-center px-4 bg-dark-800 justify-between shrink-0 shadow-md">
                                <div className="flex items-center gap-3 min-w-0">
                                    <button onClick={() => setActiveRoomId(null)} className="md:hidden p-1 text-slate-400 hover:text-white hover:bg-dark-700 rounded-lg transition-all active:scale-90">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <h3 className="font-bold flex items-center gap-2 truncate">
                                        {room.type === 'dm' ? (
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] shadow-lg font-black text-white shrink-0">
                                                {cleanName.substring(0, 1).toUpperCase()}
                                            </div>
                                        ) : (
                                            <span className="text-slate-500 text-lg font-mono">#</span>
                                        )}
                                        <div className="flex flex-col truncate">
                                            <span className="truncate text-sm md:text-base text-slate-100 font-bold tracking-tight">
                                                {cleanName}
                                            </span>
                                            {(room.type === 'private' || isOwner) && (
                                                <div className="flex items-center gap-1.5 -mt-0.5">
                                                    {room.type === 'private' && <span className="text-[8px] text-orange-400/80 flex items-center gap-0.5 uppercase tracking-tighter">🔒 Private</span>}
                                                    {isOwner && <span className="text-[8px] text-purple-400 font-bold flex items-center gap-0.5 uppercase tracking-tighter">☆ Owner</span>}
                                                </div>
                                            )}
                                        </div>
                                    </h3>
                                </div>
                                <div className="flex gap-1.5 items-center shrink-0 ml-2">
                                    <button
                                        onClick={() => setShowParticipants(!showParticipants)}
                                        className={`p-2 rounded-lg transition-all active:scale-95 ${showParticipants ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:bg-dark-700'}`}
                                        title="View Members"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    </button>

                                    {(room.type === 'private' && isOwner) && (
                                        <button
                                            onClick={() => setChatModal({ type: 'invite' })}
                                            className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors active:scale-95"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                            Invite
                                        </button>
                                    )}

                                    {(isOwner && room.id !== 'global-lobby') && (
                                        <button
                                            onClick={() => setChatModal({ type: 'confirm_delete' })}
                                            className="bg-red-900/40 hover:bg-red-600 border border-red-700/50 text-red-100 text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95"
                                            title="Delete Room"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Close
                                        </button>
                                    )}
                                    <button onClick={onClose} className="text-slate-400 hover:text-white hidden md:block p-1.5 transition-colors">✕</button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                {messages.map((msg, i) => {
                                    const isMe = msg.senderId === user.id;
                                    const showAvatar = i === 0 || messages[i - 1].senderId !== msg.senderId;

                                    return (
                                        <div key={msg.id || i} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold ${showAvatar ? (isMe ? 'bg-purple-600' : 'bg-slate-600') : 'opacity-0'}`}>
                                                {msg.senderName.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                {showAvatar && <span className="text-[9px] text-slate-500 mb-0.5 px-1">{msg.senderName}</span>}
                                                <div className={`px-3 py-1.5 rounded-xl text-sm leading-relaxed ${isMe ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-dark-700 text-slate-200 rounded-tl-sm'}`}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[9px] text-slate-600 mt-0.5 px-1 opacity-70">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-2 md:p-3 bg-dark-800 border-t border-dark-700">
                                <div className="flex items-center gap-2 bg-dark-900 border border-dark-600 rounded-xl px-2 py-1.5 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
                                    <input
                                        className="flex-1 bg-transparent px-1 text-white placeholder-slate-600 outline-none text-sm min-w-0"
                                        placeholder={room.type === 'dm' ? `Message ${cleanName}...` : `Message #${room.name}...`}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputText.trim()}
                                        className="p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:bg-dark-700 shrink-0"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    )
                })()}
            </div>

            {/* User List Sidebar */}
            {activeRoomId && showParticipants && (
                <div className="w-64 bg-dark-800 border-l border-dark-700 flex flex-col animate-slideInRight">
                    <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500">Participants</span>
                        <button onClick={() => setShowParticipants(false)} className="text-slate-500 hover:text-white">✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {rooms.find(r => r.id === activeRoomId)?.memberDetails?.map(member => (
                            <div key={member.id} className="flex flex-col gap-2 p-2 rounded hover:bg-dark-700/50 transition-colors border border-transparent hover:border-dark-600">
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${member.id === user?.id ? 'text-purple-400 font-bold' : 'text-slate-300'}`}>
                                        @{member.username}
                                        {rooms.find(r => r.id === activeRoomId)?.owner === member.id && <span className="ml-1 text-[8px] bg-orange-900/30 border border-orange-500/30 px-1 rounded text-orange-400">Owner</span>}
                                    </span>
                                </div>
                                {rooms.find(r => r.id === activeRoomId)?.owner === user?.id && member.id !== user?.id && (
                                    <div className="flex gap-1 mt-1">
                                        <button onClick={() => { chatService.muteUser(activeRoomId, member.id); setNotification({ msg: `User @${member.username} muted`, type: 'info' }); }} className="flex-1 text-[9px] bg-dark-900 border border-dark-600 hover:bg-slate-700 px-1.5 py-1 rounded text-slate-400 hover:text-white transition-colors">Mute</button>
                                        <button onClick={() => setChatModal({ type: 'confirm_kick', data: member })} className="flex-1 text-[9px] bg-dark-900 border border-dark-600 hover:bg-red-900/20 px-1.5 py-1 rounded text-slate-400 hover:text-red-400 transition-colors">Kick</button>
                                        <button onClick={() => setChatModal({ type: 'confirm_ban', data: member })} className="flex-1 text-[9px] bg-red-900/40 border border-red-700 hover:bg-red-800 px-1.5 py-1 rounded text-white transition-colors font-bold">Ban</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* In-App Modals */}
            {chatModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={() => setChatModal(null)}></div>
                    <div className="relative w-full max-w-xs bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                        <h4 className="text-lg font-bold mb-2">
                            {chatModal.type === 'invite' && 'Invite Member'}
                            {chatModal.type === 'confirm_delete' && 'Delete Room?'}
                            {chatModal.type === 'confirm_kick' && `Kick @${chatModal.data?.username}?`}
                            {chatModal.type === 'confirm_ban' && `Ban @${chatModal.data?.username}?`}
                        </h4>
                        <p className="text-sm text-slate-400 mb-6 font-medium">
                            {chatModal.type === 'invite' && 'Type the username of the person you want to invite to this private room.'}
                            {chatModal.type === 'confirm_delete' && 'This action is permanent. All messages and room history will be lost.'}
                            {chatModal.type === 'confirm_kick' && 'This user will be removed from the room but can rejoin if it is a public room.'}
                            {chatModal.type === 'confirm_ban' && 'This user will be permanently banned from this room.'}
                        </p>
                        {chatModal.type === 'invite' && <input autoFocus className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white mb-6 outline-none focus:border-purple-500" placeholder="Username..." value={modalInput} onChange={(e) => setModalInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleModalAction()} />}
                        <div className="flex gap-3">
                            <button onClick={() => { setChatModal(null); setModalInput(''); }} className="flex-1 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-slate-300 font-bold transition-all">Cancel</button>
                            <button onClick={handleModalAction} className={`flex-1 py-2 rounded-lg font-bold transition-all ${chatModal.type === 'invite' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-red-600 hover:bg-red-500'} text-white`}>{chatModal.type === 'invite' ? 'Invite' : 'Confirm'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* In-App Notifications */}
            {notification && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] max-w-[90%] w-auto animate-slideUp">
                    <div className={`px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 ${notification.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-100' : notification.type === 'success' ? 'bg-green-900/90 border-green-500 text-green-100' : notification.type === 'warning' ? 'bg-orange-900/90 border-orange-500 text-orange-100' : 'bg-blue-900/90 border-blue-500 text-blue-100'}`}>
                        <span className="text-sm font-medium">{notification.msg}</span>
                        <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70 transition-opacity">✕</button>
                    </div>
                </div>
            )}
        </div>
    );
};
