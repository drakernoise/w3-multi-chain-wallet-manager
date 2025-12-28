
import React, { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { registerBiometrics, isBiometricsAvailable } from '../services/authService';
import { enablePasswordless } from '../services/cryptoService';
import { Account, WalletState } from '../types';

interface BiometricSetupModalProps {
    accounts: Account[];
    walletState: WalletState;
    setWalletState: React.Dispatch<React.SetStateAction<WalletState>>;
    onClose: () => void;
    onComplete: () => void;
}

export const BiometricSetupModal: React.FC<BiometricSetupModalProps> = ({ accounts, setWalletState, onClose, onComplete }) => {
    const { } = useTranslation();
    const [step, setStep] = useState<'intro' | 'loading' | 'success' | 'error'>('intro');
    const [error, setError] = useState('');

    const handleSetup = async () => {
        setStep('loading');
        setError('');

        try {
            const isAvailable = await isBiometricsAvailable();
            if (!isAvailable) {
                setStep('error');
                setError("Biometrics not supported on this device or browser context.");
                return;
            }

            const success = await registerBiometrics();
            if (success) {
                // MIGRATION: Switch Vault to Passwordless (Device Key) mode if not already
                // This will store the key in a location only accessible after system auth
                await enablePasswordless(accounts);

                setWalletState(prev => ({
                    ...prev,
                    useBiometrics: true
                }));

                setStep('success');
                setTimeout(() => {
                    onComplete();
                }, 1500);
            } else {
                setStep('error');
                setError("Registration failed. Please try again.");
            }
        } catch (e: any) {
            setStep('error');
            setError(e.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-dark-900/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in text-white text-center">
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
                <div className="flex justify-end mb-2 absolute top-4 right-4">
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {step === 'intro' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-black mb-2">Enable Biometrics</h3>
                            <p className="text-sm text-slate-400">
                                Use your fingerprint or face scan to unlock your wallet faster and more securely.
                            </p>
                        </div>
                        <button
                            onClick={handleSetup}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
                        >
                            Setup Now
                        </button>
                    </div>
                )}

                {step === 'loading' && (
                    <div className="py-12 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-blue-400 font-bold animate-pulse">Waiting for system...</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="py-8 space-y-4 animate-bounce-in">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-black text-white">Verified!</h3>
                        <p className="text-slate-400">Biometrics enabled successfully.</p>
                    </div>
                )}

                {step === 'error' && (
                    <div className="py-8 space-y-4">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Error</h3>
                        <p className="text-red-400 text-sm">{error}</p>
                        <button
                            onClick={() => setStep('intro')}
                            className="w-full bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-xl mt-4"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
