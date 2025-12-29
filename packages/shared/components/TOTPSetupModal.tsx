
import React, { useState, useEffect } from 'react';
import { generateSetup, verifyTOTP, saveTOTPSecret } from '../services/totpService';
import { enablePasswordless } from '../services/cryptoService';
import { Account } from '../types';
// import { useTranslation } from '../contexts/LanguageContext';

interface TOTPSetupModalProps {
    accounts: Account[];
    onClose: () => void;
    onComplete: () => void;
}

export const TOTPSetupModal: React.FC<TOTPSetupModalProps> = ({ accounts, onClose, onComplete }) => {
    // const { t } = useTranslation();
    const [step, setStep] = useState<'loading' | 'scan' | 'verify' | 'success'>('loading');
    const [secret, setSecret] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                const { secret, qrCode } = await generateSetup();
                setSecret(secret);
                setQrCode(qrCode);
                setStep('scan');
            } catch (e) {
                setError("Failed to generate QR Code");
            }
        };
        init();
    }, []);

    const handleVerify = async () => {
        if (verifyTOTP(token, secret)) {
            await saveTOTPSecret(secret);

            // MIGRATION: Switch Vault to Passwordless (Device Key) mode
            await enablePasswordless(accounts);

            setStep('success');
            setTimeout(() => {
                onComplete();
            }, 1500);
        } else {
            setError("Invalid code. Please try again.");
            setToken('');
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-dark-900/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Setup Authenticator</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {step === 'loading' && (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {step === 'scan' && (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-400">
                            Scan this QR code with <strong>Aegis</strong>, <strong>Google Authenticator</strong>, or any TOTP app.
                        </p>

                        <div className="bg-white p-2 rounded-lg mx-auto w-fit">
                            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                        </div>

                        <div className="bg-dark-900 p-2 rounded text-center">
                            <p className="text-[10px] text-slate-500 mb-1">Backup Key (Manual Entry)</p>
                            <code className="text-blue-400 font-mono text-sm break-all">{secret}</code>
                        </div>

                        <button
                            onClick={() => setStep('verify')}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 'verify' && (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-400">Enter the 6-digit code from your app to verify.</p>

                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            autoFocus
                            value={token}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setToken(val);
                                setError('');
                            }}
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-4 text-center text-2xl tracking-[0.5em] text-white font-mono outline-none focus:border-blue-500"
                            placeholder="000000"
                            onKeyDown={(e) => e.key === 'Enter' && token.length === 6 && handleVerify()}
                        />

                        {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('scan')}
                                className="flex-1 py-3 text-slate-400 hover:text-white"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleVerify}
                                disabled={token.length !== 6}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg disabled:opacity-50"
                            >
                                Verify
                            </button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
                        <p className="text-slate-400 text-sm">Authenticator configured successfully.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
