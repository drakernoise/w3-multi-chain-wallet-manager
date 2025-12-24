import React, { useState, useEffect } from 'react';
import { Account, Chain } from '../types';
import { fetchMessages, ChatMessage, decodeMessage, encodeMessage } from '../services/messagingService';
import { fetchAccountData, broadcastTransfer } from '../services/chainService';
import { useTranslation } from '../contexts/LanguageContext';

interface ChatProps {
    account: Account;
    activeChain: Chain;
    onClose: () => void;
}

export const ChatView: React.FC<ChatProps> = ({ account, activeChain, onClose }) => {
    const { } = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedPeer, setSelectedPeer] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [memoKey, setMemoKey] = useState<string | null>(null);

    // Load Messages
    useEffect(() => {
        loadMessages();
    }, [account, activeChain]);

    // Load Memo Key
    useEffect(() => {
        // Fix: Use correct property from Account interface. account.memoKey exists in types.ts
        if (account && account.memoKey) {
            setMemoKey(account.memoKey);
        }
    }, [account]);


    const loadMessages = async () => {
        if (!account) return;
        setIsLoading(true);
        try {
            const msgs = await fetchMessages(activeChain, account.name);
            setMessages(msgs);
        } catch (e) {
            console.error("Failed to load messages", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!processMessage() || !selectedPeer || !memoKey) return;
        setIsSending(true);

        try {
            // 1. Get Peer's Public Memo Key
            const peerData = await fetchAccountData(activeChain, selectedPeer);
            if (!peerData) throw new Error("Peer not found");
            const peerPubKey = peerData.memo_key;

            // 2. Encrypt
            const encrypted = encodeMessage(memoKey, peerPubKey, newMessage);

            // 3. Broadcast (0.001 transfer)
            // Using Active Key (required for transfer)
            if (!account.activeKey) {
                alert("Active Key required to send messages (transfers)");
                return;
            }

            const result = await broadcastTransfer(
                activeChain,
                account.name,
                account.activeKey,
                selectedPeer,
                "0.001", // Minimum amount usually
                encrypted
            );

            if (result.success) {
                setNewMessage('');
                loadMessages(); // Refresh
            } else {
                alert("Failed to send: " + result.error);
            }

        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            setIsSending(false);
        }
    };

    // Group messages by Peer
    const conversations = messages.reduce((acc, msg) => {
        const peer = msg.type === 'sent' ? msg.to : msg.from;
        if (!acc[peer]) acc[peer] = [];
        acc[peer].push(msg);
        return acc;
    }, {} as Record<string, ChatMessage[]>);

    const sortedPeers = Object.keys(conversations).sort((a, b) => {
        // Sort by latest message timestamp (desc)
        const lastA = conversations[a][0].timestamp; // Assuming fetchMessages returns reverse order
        const lastB = conversations[b][0].timestamp;
        return lastA > lastB ? -1 : 1;
    });

    // Helper for input
    const processMessage = () => newMessage.trim().length > 0;

    return (
        <div className="flex flex-col h-full bg-dark-900 text-white relative">
            <div className="flex items-center justify-between p-4 border-b border-dark-700 bg-dark-800">
                <h2 className="text-lg font-bold">Secure Messages</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Peer List */}
                <div className={`w-1/3 border-r border-dark-700 overflow-y-auto ${selectedPeer ? 'hidden md:block' : 'w-full'}`}>
                    {isLoading && <div className="p-4 text-center text-slate-500">Loading...</div>}
                    {!isLoading && sortedPeers.length === 0 && (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No encrypted messages found. <br />
                            Start a conversation by sending 0.001 {activeChain} with an encrypted memo.
                        </div>
                    )}

                    {/* New Chat Button */}
                    <div className="p-2">
                        <input
                            className="w-full bg-dark-800 border border-dark-600 rounded p-2 text-sm text-white placeholder-slate-500"
                            placeholder="Enter username to chat..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSelectedPeer(e.currentTarget.value);
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                    </div>

                    {sortedPeers.map(peer => (
                        <div
                            key={peer}
                            onClick={() => setSelectedPeer(peer)}
                            className={`p-3 border-b border-dark-700 cursor-pointer hover:bg-dark-700 ${selectedPeer === peer ? 'bg-blue-900/20 border-l-4 border-blue-500' : ''}`}
                        >
                            <div className="font-bold text-sm">@{peer}</div>
                            <div className="text-xs text-slate-400 truncate">
                                {conversations[peer][0].isEncrypted ? '🔒 Encrypted Message' : conversations[peer][0].message}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Window */}
                <div className={`flex-1 flex flex-col ${!selectedPeer ? 'hidden md:flex bg-dark-900 justify-center items-center text-slate-600' : ''}`}>
                    {!selectedPeer ? (
                        <div>Select a conversation</div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="p-3 bg-dark-800 border-b border-dark-700 flex justify-between items-center">
                                <button onClick={() => setSelectedPeer(null)} className="md:hidden text-slate-400 mr-2">←</button>
                                <span className="font-bold">@{selectedPeer}</span>
                                <span className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> On-Chain
                                </span>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col-reverse">
                                {/* Note: Standard array map displays top-down, but chat is usually bottom-up. 
                                     fetchMessages returns [newest, ..., oldest].
                                     So we map normally? No, newest is usually at bottom.
                                     Let's reverse for display.
                                 */}
                                {(conversations[selectedPeer] || []).map((msg) => {
                                    const decrypted = msg.isEncrypted && memoKey
                                        ? decodeMessage(msg.message, memoKey)
                                        : (msg.isEncrypted ? "*** Locked (Missing Memo Key) ***" : msg.message);

                                    return (
                                        <div key={msg.id} className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.type === 'sent' ? 'self-end bg-blue-600 text-white' : 'self-start bg-dark-700 text-slate-200'}`}>
                                            {decrypted.startsWith('***') ? <span className="text-yellow-400 text-xs">{decrypted}</span> : decrypted}
                                            <div className={`text-[10px] mt-1 opacity-70 ${msg.type === 'sent' ? 'text-blue-200' : 'text-slate-400'}`}>
                                                {new Date(msg.timestamp + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {msg.isEncrypted && ' 🔒'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input */}
                            <div className="p-3 bg-dark-800 border-t border-dark-700">
                                {!memoKey && (
                                    <div className="mb-2 text-xs text-red-400 bg-red-900/20 p-2 rounded">
                                        ⚠️ Access Restricted: Import your <b>Memo Key</b> in Settings to read/write encrypted messages.
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 bg-dark-900 border border-dark-600 rounded-full px-4 py-2 text-sm text-white focus:border-blue-500 outline-none"
                                        placeholder={memoKey ? "Type an encrypted message..." : "Memo Key missing"}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        disabled={!memoKey || isSending}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!memoKey || isSending || !newMessage.trim()}
                                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 transition-colors"
                                    >
                                        {isSending ? '...' : '➤'}
                                    </button>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1 text-center">
                                    Cost: 0.001 {activeChain} • Messages are public (encrypted) on blockchain.
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
