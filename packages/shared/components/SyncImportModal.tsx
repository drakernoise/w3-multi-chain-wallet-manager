import React, { useEffect, useRef, useState } from 'react';
import { SyncPayload } from '../types';
import { deviceTransferService } from '../services/deviceTransferService';

interface SyncImportModalProps {
    onClose: () => void;
    onImport: (payload: SyncPayload) => Promise<void>;
}

type ImportStatus = 'preparing' | 'waiting' | 'importing' | 'done' | 'error';

export const SyncImportModal: React.FC<SyncImportModalProps> = ({ onClose, onImport }) => {
    const [pairCode, setPairCode] = useState('');
    const [status, setStatus] = useState<ImportStatus>('preparing');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const onCloseRef = useRef(onClose);
    const onImportRef = useRef(onImport);

    useEffect(() => {
        onCloseRef.current = onClose;
        onImportRef.current = onImport;
    }, [onClose, onImport]);

    useEffect(() => {
        let mounted = true;

        deviceTransferService.onStatusChange((nextStatus, detail) => {
            if (!mounted) return;
            if (nextStatus === 'waiting') setStatus('waiting');
            if (nextStatus === 'paired') setStatus('waiting');
            if (nextStatus === 'error') {
                setStatus('error');
                setErrorMsg(detail || 'Transfer failed');
            }
        });

        const prepare = async () => {
            try {
                const { code } = await deviceTransferService.startReceiveSession();
                if (!mounted) return;
                setPairCode(code);
                setStatus('waiting');

                const payload = await deviceTransferService.waitForIncomingPayload();
                if (!mounted) return;
                setStatus('importing');
                await onImportRef.current(payload);
                if (!mounted) return;
                setSuccessMsg(`Wallet received successfully. Imported ${payload.accounts.length} account${payload.accounts.length === 1 ? '' : 's'}.`);
                setStatus('done');
            } catch (e: any) {
                if (!mounted) return;
                setStatus('error');
                setErrorMsg(e?.message || 'Unable to receive data');
            }
        };

        prepare();

        return () => {
            mounted = false;
            deviceTransferService.onStatusChange(null);
            deviceTransferService.disconnect();
        };
    }, []);

    const handleCopy = async () => {
        if (!pairCode) return;
        await navigator.clipboard.writeText(pairCode);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn overflow-y-auto">
            <div className="bg-dark-800 border border-dark-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar my-auto">
                <button
                    onClick={() => onCloseRef.current()}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h3 className="text-xl font-black text-white mb-2">Receive from Another Device</h3>
                <p className="text-xs text-slate-400 mb-6">Open the source device, choose send, and enter this pairing code there.</p>

                <div className="space-y-4">
                    <div className="w-full bg-dark-900 border border-dark-700 rounded-2xl p-5 text-center">
                        <div className="text-[10px] uppercase tracking-[0.28em] font-black text-slate-500 mb-3">Pairing code</div>
                        <div className="text-2xl font-mono tracking-[0.32em] text-white select-all">{pairCode || '----- -----'}</div>
                    </div>

                    <button
                        onClick={handleCopy}
                        disabled={!pairCode}
                        className="w-full py-3 bg-dark-700 hover:bg-dark-600 rounded-xl font-mono text-xs text-purple-300 transition-all active:scale-95"
                    >
                        Copy Code
                    </button>

                    {status === 'preparing' && (
                        <div className="w-full py-4 rounded-xl bg-dark-900 text-center text-sm font-bold text-slate-300 border border-dark-700">
                            Preparing secure session...
                        </div>
                    )}

                    {status === 'waiting' && (
                        <div className="w-full py-4 rounded-xl bg-dark-900 text-center text-sm font-bold text-slate-300 border border-dark-700">
                            Waiting for source device...
                        </div>
                    )}

                    {status === 'importing' && (
                        <div className="w-full py-4 rounded-xl bg-dark-900 text-center text-sm font-bold text-slate-300 border border-dark-700">
                            Receiving and importing encrypted wallet...
                        </div>
                    )}

                    {status === 'done' && (
                        <div className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center px-4">
                            <div className="font-black text-green-400 uppercase tracking-widest text-sm">Import Complete</div>
                            <div className="text-xs text-slate-300 mt-2">{successMsg}</div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                            <div className="font-black text-red-400 uppercase tracking-widest text-sm">Transfer Error</div>
                            <div className="text-[11px] text-slate-400 mt-1">{errorMsg}</div>
                        </div>
                    )}

                    <div className="pt-2 text-center text-[10px] text-slate-500">
                        This device never exposes the private data in plain text.
                    </div>

                    {status === 'done' && (
                        <button
                            onClick={() => onCloseRef.current()}
                            className="w-full py-3 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 rounded-xl font-bold text-sm text-green-300 transition-all active:scale-95"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
