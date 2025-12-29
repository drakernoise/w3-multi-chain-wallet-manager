import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { bridgeService } from '../services/bridgeService';

interface BridgeModalProps {
    onClose: () => void;
}

export const BridgeModal: React.FC<BridgeModalProps> = ({ onClose }) => {
    const [qrData, setQrData] = useState<string | null>(null);
    const [status, setStatus] = useState<'generating' | 'waiting' | 'connected'>('generating');

    useEffect(() => {
        const initBridge = async () => {
            const data = await bridgeService.createBridgeSession();
            setQrData(data);
            setStatus('waiting');

            await bridgeService.waitForSigner();
            setStatus('connected');
        };
        initBridge();
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-900/90 backdrop-blur-md animate-fadeIn">
            <div className="bg-dark-800 border border-dark-600 rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-xl font-black text-white mb-2 tracking-tight">Gravity Bridge</h2>
                    <p className="text-xs text-slate-500 font-medium">Pair your mobile device for remote signing</p>
                </div>

                <div className="flex flex-col items-center justify-center space-y-8">
                    {status === 'connected' ? (
                        <div className="flex flex-col items-center py-10 animate-bounceFast">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mb-4 border border-green-500/30">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <p className="font-black text-green-400 uppercase tracking-widest text-sm">Linked Successfully</p>
                            <p className="text-[10px] text-slate-500 mt-2">You can now sign transactions on your phone.</p>
                            <button onClick={onClose} className="mt-8 px-6 py-2 bg-dark-700 hover:bg-dark-600 rounded-xl text-xs font-bold transition-all">Continue</button>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 bg-white rounded-3xl shadow-inner-xl animate-scaleIn">
                                {qrData ? (
                                    <QRCodeSVG value={qrData} size={200} level="H" />
                                ) : (
                                    <div className="w-[200px] h-[200px] flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>

                            <div className="w-full space-y-3">
                                <div className="flex items-center gap-3 bg-dark-900/50 p-3 rounded-2xl border border-dark-700/50">
                                    <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-[10px] font-black italic">1</div>
                                    <span className="text-[10px] text-slate-400 font-bold">Open Gravity Mobile App</span>
                                </div>
                                <div className="flex items-center gap-3 bg-dark-900/50 p-3 rounded-2xl border border-dark-700/50">
                                    <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-[10px] font-black italic">2</div>
                                    <span className="text-[10px] text-slate-400 font-bold">Tap "Pair" and Scan QR Code</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-dark-700 text-center">
                    <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest leading-relaxed">
                        End-to-End Encrypted Secure Connection
                    </p>
                </div>
            </div>
        </div>
    );
};
