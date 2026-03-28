import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { bridgeService } from '../services/bridgeService';

interface BridgeModalProps {
    onClose: () => void;
    onSync?: () => void;
}

export const BridgeModal: React.FC<BridgeModalProps> = ({ onClose, onSync }) => {
    const [qrData, setQrData] = useState<string | null>(null);
    const [status, setStatus] = useState<'generating' | 'waiting' | 'connected'>('generating');
    const [serverStatus, setServerStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const updateCompact = () => {
            setIsCompact(window.innerHeight < 720);
        };

        updateCompact();
        window.addEventListener('resize', updateCompact);
        return () => window.removeEventListener('resize', updateCompact);
    }, []);

    useEffect(() => {
        bridgeService.onStatusChange = (s) => {
            if (s === 'connected') setServerStatus('connected');
            else if (s === 'error') setServerStatus('error');
            else if (s === 'paired') setStatus('connected');
            else setServerStatus('connecting');
        };

        const initBridge = async () => {
            const data = await bridgeService.createBridgeSession();
            setQrData(data);
            setStatus('waiting');

            await bridgeService.waitForSigner();
        };

        initBridge();
    }, []);

    const qrSize = isCompact ? 164 : 200;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-3 sm:p-4 bg-dark-900/90 backdrop-blur-md animate-fadeIn">
            <div className={`bg-dark-800 border border-dark-600 rounded-[28px] max-w-sm w-full shadow-2xl relative my-auto max-h-[calc(100vh-1.5rem)] flex flex-col ${isCompact ? 'p-5' : 'p-8'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className={`text-center shrink-0 ${isCompact ? 'mb-5' : 'mb-8'}`}>
                    <div className="flex justify-center mb-2">
                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
                            serverStatus === 'connected'
                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                : serverStatus === 'error'
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                            }`}>
                            <div className={`w-1 h-1 rounded-full ${
                                serverStatus === 'connected'
                                    ? 'bg-green-500 animate-pulse'
                                    : serverStatus === 'error'
                                        ? 'bg-red-500'
                                        : 'bg-slate-500 animate-pulse'
                                }`} />
                            {serverStatus === 'connected' ? 'Server Linked' : serverStatus === 'error' ? 'Link Error' : 'Linking...'}
                        </div>
                    </div>
                    <h2 className="text-xl font-black text-white mb-2 tracking-tight">Pair Phone</h2>
                    <p className="text-xs text-slate-500 font-medium">Pair your mobile device for remote signing</p>
                </div>

                <div className={`flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar flex flex-col items-center ${isCompact ? 'space-y-5' : 'space-y-8'}`}>
                    {status === 'connected' ? (
                        <div className="flex flex-col items-center py-6 animate-bounceFast w-full">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mb-4 border border-green-500/30">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <p className="font-black text-green-400 uppercase tracking-widest text-sm">Linked Successfully</p>
                            <p className="text-[10px] text-slate-500 mt-2 text-center">You can now sign transactions on your phone.</p>

                            <div className="flex gap-2 mt-6 w-full">
                                <button onClick={onSync} className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                                    Sync Accounts
                                </button>
                                <button onClick={onClose} className="px-4 py-3 bg-dark-700 hover:bg-dark-600 rounded-xl text-xs font-bold transition-all border border-dark-600">
                                    Done
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={`${isCompact ? 'p-3' : 'p-4'} bg-white rounded-3xl shadow-inner-xl animate-scaleIn shrink-0`}>
                                {qrData ? (
                                    <QRCodeSVG value={qrData} size={qrSize} level="H" />
                                ) : (
                                    <div style={{ width: qrSize, height: qrSize }} className="flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>

                            <div className="w-full space-y-3">
                                <div className="flex items-center gap-3 bg-dark-900/50 p-3 rounded-2xl border border-dark-700/50">
                                    <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-[10px] font-black italic shrink-0">1</div>
                                    <span className="text-[10px] text-slate-400 font-bold">Open Gravity Mobile App</span>
                                </div>
                                <div className="flex items-center gap-3 bg-dark-900/50 p-3 rounded-2xl border border-dark-700/50">
                                    <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-[10px] font-black italic shrink-0">2</div>
                                    <span className="text-[10px] text-slate-400 font-bold">Tap "Pair" and Scan QR Code</span>
                                </div>
                            </div>

                            {qrData && (
                                <div className="w-full p-3 bg-dark-900/80 rounded-2xl border border-dark-700/50 animate-fadeIn">
                                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2 opacity-70">Manual Pairing String</p>
                                    <div className="flex gap-2">
                                        <code className="flex-1 text-[9px] text-purple-400 font-mono break-all line-clamp-3 select-all cursor-pointer bg-black/40 p-2 rounded-lg border border-purple-500/10">
                                            {qrData}
                                        </code>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(qrData)}
                                            className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-slate-400 transition-colors shrink-0 flex items-center justify-center border border-dark-600 self-stretch"
                                            title="Copy to clipboard"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className={`${isCompact ? 'mt-4 pt-4' : 'mt-8 pt-6'} border-t border-dark-700 text-center shrink-0`}>
                    <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest leading-relaxed">
                        End-to-End Encrypted Secure Connection
                    </p>
                </div>
            </div>
        </div>
    );
};
