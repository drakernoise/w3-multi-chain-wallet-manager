import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { syncService } from '../services/syncService';
import { Account } from '../types';

interface SyncExportModalProps {
    accounts: Account[];
    walletConfig: any;
    onClose: () => void;
}

export const SyncExportModal: React.FC<SyncExportModalProps> = ({ accounts, walletConfig, onClose }) => {
    const [qrData, setQrData] = useState<string | null>(null);
    const [status, setStatus] = useState<'initializing' | 'ready' | 'synced' | 'error'>('initializing');
    const [copied, setCopied] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        let mounted = true;

        const start = async () => {
            try {
                const { qrData } = await syncService.startExportSession(
                    accounts,
                    walletConfig,
                    () => { if (mounted) setStatus('synced'); }
                );
                if (mounted) {
                    setQrData(qrData);
                    setStatus('ready');
                }
            } catch (e: any) {
                console.error("Sync Export Error:", e);
                if (mounted) {
                    setStatus('error');
                    setErrorMsg(e.message || String(e));
                }
            }
        };
        start();

        const interval = setInterval(() => {
            setSocketConnected(syncService.isConnected());
        }, 1000);

        return () => {
            mounted = false;
            syncService.disconnect();
            clearInterval(interval);
        }
    }, []);

    const handleCopy = () => {
        if (qrData) {
            navigator.clipboard.writeText(qrData);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-dark-800 border border-dark-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h3 className="text-xl font-black text-white mb-2">Sync to Mobile</h3>
                <p className="text-xs text-slate-400 mb-6">Scan with your mobile app to transfer your accounts.</p>

                <div className="flex flex-col items-center justify-center space-y-6">
                    {status === 'initializing' && (
                        <div className="w-48 h-48 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                        </div>
                    )}

                    {status === 'ready' && qrData && (
                        <div className="bg-white p-4 rounded-xl flex flex-col items-center">
                            <QRCodeSVG value={qrData} size={192} level="M" />
                            <div className={`text-[10px] font-bold mt-2 flex items-center gap-1 ${socketConnected ? 'text-green-600' : 'text-orange-500'}`}>
                                <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} />
                                {socketConnected ? 'Server Connected' : 'Connecting to Server...'}
                            </div>
                        </div>
                    )}

                    {status === 'synced' && (
                        <div className="w-48 h-48 flex flex-col items-center justify-center text-green-400">
                            <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="font-bold">Sync Complete!</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-red-400 font-bold text-center">
                            <p>Connection Error.</p>
                            <p className="text-[10px] font-mono mt-2 bg-black/20 p-2 rounded max-w-[250px] break-words">{errorMsg}</p>
                        </div>
                    )}
                </div>

                {status === 'ready' && (
                    <div className="mt-6">
                        <div className="text-[10px] text-center text-slate-500 mb-2 uppercase font-bold tracking-widest">Or copy code manually</div>
                        <button
                            onClick={handleCopy}
                            className="w-full py-3 bg-dark-700 hover:bg-dark-600 rounded-xl font-mono text-xs text-purple-300 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                    Copy Sync Code
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
