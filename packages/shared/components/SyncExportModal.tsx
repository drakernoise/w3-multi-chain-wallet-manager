import React, { useEffect, useMemo, useState } from 'react';
import { Account, SyncPayload } from '../types';
import { deviceTransferService } from '../services/deviceTransferService';
import { storageService } from '../services/storageService';

interface SyncExportModalProps {
    accounts: Account[];
    walletConfig: any;
    onClose: () => void;
}

type ExportStatus = 'idle' | 'connecting' | 'paired' | 'sending' | 'sent' | 'error';

export const SyncExportModal: React.FC<SyncExportModalProps> = ({ accounts, walletConfig, onClose }) => {
    const [pairCode, setPairCode] = useState('');
    const [status, setStatus] = useState<ExportStatus>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        deviceTransferService.onStatusChange((nextStatus, detail) => {
            if (nextStatus === 'connecting' || nextStatus === 'waiting') setStatus('connecting');
            if (nextStatus === 'paired') setStatus('paired');
            if (nextStatus === 'transferred') setStatus('sent');
            if (nextStatus === 'error') {
                setStatus('error');
                setErrorMsg(detail || 'Transfer failed');
            }
        });

        return () => {
            deviceTransferService.onStatusChange(null);
            deviceTransferService.disconnect();
        };
    }, []);

    const payloadSummary = useMemo(() => {
        return {
            accountCount: accounts.length,
            chatIdentity: !!localStorage.getItem('gravity_chat_registration'),
            settingsCount: [
                walletConfig?.useGoogleAuth,
                walletConfig?.useBiometrics,
                walletConfig?.useDeviceAuth,
                walletConfig?.useTOTP
            ].filter((value) => typeof value !== 'undefined').length
        };
    }, [accounts, walletConfig]);

    const buildPayload = async (): Promise<SyncPayload> => {
        const payload: SyncPayload = {
            timestamp: Date.now(),
            accounts,
            settings: {
                useGoogleAuth: walletConfig?.useGoogleAuth,
                useBiometrics: walletConfig?.useBiometrics,
                useDeviceAuth: walletConfig?.useDeviceAuth,
                useTOTP: walletConfig?.useTOTP
            }
        };

        const registrationRaw = localStorage.getItem('gravity_chat_registration');
        const privateKey = await storageService.getItem('gravity_chat_key');
        const publicKey = await storageService.getItem('gravity_chat_pub');

        if (registrationRaw && privateKey && publicKey) {
            try {
                const registration = JSON.parse(registrationRaw);
                if (registration?.username && registration?.id) {
                    payload.chatIdentity = {
                        username: registration.username,
                        id: registration.id,
                        privateKey,
                        publicKey
                    };
                }
            } catch (e) {}
        }

        return payload;
    };

    const handleConnect = async () => {
        setErrorMsg('');
        setStatus('connecting');
        try {
            await deviceTransferService.connectToSession(pairCode);
        } catch (e: any) {
            setStatus('error');
            setErrorMsg(e?.message || 'Unable to pair with target device');
        }
    };

    const handleSend = async () => {
        setErrorMsg('');
        setStatus('sending');
        try {
            const payload = await buildPayload();
            await deviceTransferService.sendPayload(payload);
        } catch (e: any) {
            setStatus('error');
            setErrorMsg(e?.message || 'Unable to send encrypted wallet');
        }
    };

    const normalizedCode = deviceTransferService.normalizeCode(pairCode);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn overflow-y-auto">
            <div className="bg-dark-800 border border-dark-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar my-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h3 className="text-xl font-black text-white mb-2">Send to Another Device</h3>
                <p className="text-xs text-slate-400 mb-6">Enter the pairing code shown on the destination device. Nothing is sent until you confirm it here.</p>

                <div className="space-y-4">
                    <input
                        value={pairCode}
                        onChange={(event) => setPairCode(event.target.value.toUpperCase())}
                        placeholder="ABCDE-FGHIJ"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck={false}
                        className="w-full bg-dark-900 border border-dark-700 rounded-xl p-4 text-center text-lg tracking-[0.35em] font-mono text-slate-100 focus:border-purple-500 outline-none uppercase"
                    />

                    <div className="bg-dark-900/70 border border-dark-700 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Accounts</span>
                            <span className="font-bold text-white">{payloadSummary.accountCount}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Settings</span>
                            <span className="font-bold text-white">{payloadSummary.settingsCount ? 'Included' : 'Basic only'}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Chat identity</span>
                            <span className="font-bold text-white">{payloadSummary.chatIdentity ? 'Included' : 'Not found'}</span>
                        </div>
                    </div>

                    {errorMsg && <p className="text-red-400 text-xs font-bold text-center">{errorMsg}</p>}

                    {status === 'idle' || status === 'error' ? (
                        <button
                            onClick={handleConnect}
                            disabled={normalizedCode.length !== 10}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${normalizedCode.length !== 10 ? 'bg-dark-700 text-slate-500' : 'bg-purple-600 text-white shadow-lg active:scale-95'}`}
                        >
                            Pair Devices
                        </button>
                    ) : null}

                    {status === 'connecting' && (
                        <div className="w-full py-4 rounded-xl bg-dark-900 text-center text-sm font-bold text-slate-300 border border-dark-700">
                            Waiting for secure handshake...
                        </div>
                    )}

                    {status === 'paired' && (
                        <button
                            onClick={handleSend}
                            className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all bg-blue-600 text-white shadow-lg active:scale-95"
                        >
                            Approve and Send
                        </button>
                    )}

                    {status === 'sending' && (
                        <div className="w-full py-4 rounded-xl bg-dark-900 text-center text-sm font-bold text-slate-300 border border-dark-700">
                            Encrypting and sending wallet...
                        </div>
                    )}

                    {status === 'sent' && (
                        <div className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                            <div className="font-black text-green-400 uppercase tracking-widest text-sm">Transfer Complete</div>
                            <div className="text-[11px] text-slate-400 mt-1">The destination device can import the wallet now.</div>
                        </div>
                    )}

                    <div className="pt-2 text-center text-[10px] text-slate-500">
                        End-to-end encrypted manual transfer
                    </div>
                </div>
            </div>
        </div>
    );
};
