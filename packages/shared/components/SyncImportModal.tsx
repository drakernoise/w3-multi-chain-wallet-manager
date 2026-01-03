import React, { useState } from 'react';
import { syncService } from '../services/syncService';
import { SyncPayload } from '../types';

interface SyncImportModalProps {
    onClose: () => void;
    onImport: (payload: SyncPayload) => Promise<void>;
}

export const SyncImportModal: React.FC<SyncImportModalProps> = ({ onClose, onImport }) => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'scanning' | 'syncing' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSync = async () => {
        if (!code) return;
        setStatus('syncing');
        setErrorMsg('');

        try {
            const payload = await syncService.startImportSession(code);
            await onImport(payload);
            onClose();
        } catch (e: any) {
            setStatus('error');
            setErrorMsg(e.message || "Sync Failed");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-dark-800 border border-dark-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h3 className="text-xl font-black text-white mb-2">Import Sync Code</h3>
                <p className="text-xs text-slate-400 mb-6">Paste the sync code from the other device (Mobile/Desktop).</p>

                <div className="space-y-4">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Paste gravity:sync:... code here"
                        className="w-full bg-dark-900 border border-dark-700 rounded-xl p-4 text-xs font-mono text-slate-200 focus:border-purple-500 outline-none h-24 resize-none"
                    />

                    {errorMsg && <p className="text-red-400 text-xs font-bold text-center">{errorMsg}</p>}

                    <button
                        onClick={handleSync}
                        disabled={!code || status === 'syncing'}
                        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${!code || status === 'syncing' ? 'bg-dark-700 text-slate-500' : 'bg-purple-600 text-white shadow-lg active:scale-95'}`}
                    >
                        {status === 'syncing' ? (
                            <div className="flex flex-col items-center">
                                <span>Connecting...</span>
                                <span className="text-[8px] opacity-70 normal-case mt-1">Keep Desktop Export screen OPEN</span>
                            </div>
                        ) : 'Start Sync'}
                    </button>

                    <div className="pt-2 text-center text-[10px] text-slate-500">
                        Secure End-to-End Encrypted Transfer
                    </div>
                </div>
            </div>
        </div>
    );
};
