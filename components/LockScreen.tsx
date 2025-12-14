
import React, { useState, useEffect } from 'react';
import { WalletState } from '../types';
import { authenticateWithGoogle, authenticateWithBiometrics, registerBiometrics, isBiometricsAvailable } from '../services/authService';
import { initVault, initVaultWithGeneratedKey, unlockVault, getInternalKey, hasPinProtectedKey, loadInternalKeyWithPin } from '../services/cryptoService';
import { useTranslation } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface LockScreenProps {
  onUnlock: (accounts: any[]) => void;
  walletState: WalletState;
  setWalletState: React.Dispatch<React.SetStateAction<WalletState>>;
  lockReason?: string | null;
}

declare const chrome: any;

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, walletState, setWalletState, lockReason }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const isFirstRun = !walletState.encryptedMaster;

  const [error, setError] = useState(lockReason || '');
  const [statusMessage, setStatusMessage] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [enableBiometrics, setEnableBiometrics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // PIN Modal State
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinMode, setPinMode] = useState<'create' | 'unlock'>('unlock');
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  useEffect(() => {
    isBiometricsAvailable().then(setBiometricsAvailable);
  }, []);

  // Update error if lockReason changes
  useEffect(() => {
    if (lockReason) setError(lockReason);
  }, [lockReason]);

  // Auto-Submit PIN
  useEffect(() => {
    if (pinMode === 'unlock' && pinValue.length === 6 && !isLoading) {
      submitPin();
    }
  }, [pinValue, pinMode]);

  const handlePasswordSubmit = async () => {
    if (isFirstRun) {
      if (password.length < 8) {
        setError(t('lock.error_length'));
        return;
      }
      setIsLoading(true);
      setStatusMessage(t('lock.processing'));

      let bioSuccess = false;
      if (enableBiometrics) {
        setStatusMessage("Please verify biometrics...");
        bioSuccess = await registerBiometrics();
        if (!bioSuccess) {
          console.warn("Biometric setup failed, continuing...");
          setError("Biometrics setup failed. Wallet created with password only.");
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      await initVault(password);

      setWalletState(prev => ({
        ...prev,
        encryptedMaster: true,
        useBiometrics: bioSuccess
      }));

      setIsLoading(false);
      onUnlock([]);
    } else {
      setIsLoading(true);
      const vault = await unlockVault(password);
      setIsLoading(false);

      if (vault) {
        onUnlock(vault.accounts);
      } else {
        setError("Incorrect password");
      }
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setIsLoading(true);
    setStatusMessage("Contacting Google Auth...");

    try {
      const user = await authenticateWithGoogle();
      if (user) {
        setStatusMessage("Authenticated!");

        // PIN Flow Integration
        if (isFirstRun) {
          // New Setup: Prompt to Create PIN
          setIsLoading(false); // Stop globally loading to show modal
          setPinMode('create');
          setPinValue('');
          setShowPinModal(true);
        } else {
          // Unlocking
          const hasPin = await hasPinProtectedKey();
          if (hasPin) {
            setIsLoading(false);
            setPinMode('unlock');
            setPinValue('');
            setShowPinModal(true);
          } else {
            // Legacy / Insecure Fallback (No PIN)
            await performLegacyUnlock();
          }
        }
      }
    } catch (e) {
      setError("Google Auth Failed");
      setIsLoading(false);
    }
  };

  const performLegacyUnlock = async () => {
    const internalKey = await getInternalKey();
    if (internalKey) {
      const vault = await unlockVault(internalKey);
      setIsLoading(false);
      if (vault) {
        onUnlock(vault.accounts);
      } else {
        setError("Could not decrypt data (Invalid Key).");
      }
    } else {
      setIsLoading(false);
      setError("No Google Auth data found. Try Password.");
    }
  };

  const handleBiometricAuth = async () => {
    setError("");
    setIsLoading(true);
    setStatusMessage("Waiting for verification...");
    const success = await authenticateWithBiometrics();

    if (success) {
      const hasPin = await hasPinProtectedKey();
      if (hasPin) {
        setIsLoading(false);
        setPinMode('unlock');
        setPinValue('');
        setShowPinModal(true);
      } else {
        await performLegacyUnlock();
      }
    } else {
      setIsLoading(false);
      setError("Biometric verification failed");
    }
  };

  const submitPin = async () => {
    if (pinMode === 'create') {
      if (pinValue.length < 6) {
        alert("PIN must be at least 6 digits");
        return;
      }
      setIsLoading(true); // Show loading processing
      setShowPinModal(false);

      try {
        const { vault } = await initVaultWithGeneratedKey(pinValue);
        setWalletState(prev => ({ ...prev, encryptedMaster: true, useGoogleAuth: true }));
        onUnlock(vault.accounts);
      } catch (e) {
        setError("Failed to initialize PIN wallet.");
        setIsLoading(false);
      }

    } else {
      // Unlock
      setIsLoading(true);

      // Small delay to let UI render the last digit
      await new Promise(r => setTimeout(r, 100));

      const internalKey = await loadInternalKeyWithPin(pinValue);

      if (internalKey) {
        const vault = await unlockVault(internalKey);
        if (vault) {
          onUnlock(vault.accounts); // Success
        } else {
          setError("Decryption failed (Corrupt Vault?)");
          setIsLoading(false);
          setShowPinModal(true); // Re-show input
        }
      } else {
        setIsLoading(false);
        setError("Incorrect PIN");
        setTimeout(() => { setError(''); setPinValue(''); }, 1000);
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">

      {/* PIN Modal Overlay */}
      {showPinModal && (
        <div className="absolute inset-0 z-50 bg-dark-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="bg-dark-800 p-6 rounded-2xl border border-dark-600 shadow-2xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-2 text-center">
              {pinMode === 'create' ? 'Create Security PIN' : 'Enter Security PIN'}
            </h3>
            <p className="text-xs text-slate-400 mb-6 text-center">
              {pinMode === 'create'
                ? 'Set a 6-digit PIN to encrypt your wallet key. You will need this to login with Google/Biometrics.'
                : 'Enter your 6-digit PIN to decrypt your wallet.'}
            </p>

            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              value={pinValue}
              onChange={(e) => setPinValue(e.target.value.replace(/[^0-9]/g, ''))}
              className={`w-full bg-dark-900 border ${error && pinMode === 'unlock' ? 'border-red-500' : 'border-blue-500/50'} rounded-lg px-4 py-4 text-center text-2xl tracking-[1em] text-white font-mono mb-6 outline-none focus:ring-2 ring-blue-500`}
              placeholder="••••••"
              onKeyDown={(e) => e.key === 'Enter' && pinValue.length >= 6 && submitPin()}
            />
            {error && pinMode === 'unlock' && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowPinModal(false); setIsLoading(false); setStatusMessage(''); setPinValue(''); setError(''); }}
                className="flex-1 py-3 rounded-lg border border-dark-600 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitPin}
                disabled={pinValue.length < 6}
                className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pinMode === 'create' ? 'Set PIN' : 'Unlock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      {/* Background Shapes */}
      <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="w-24 h-24 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)] border border-white/10 backdrop-blur-md animate-float">
        <img src="/logowallet.png" alt="Gravity Wallet" className="w-16 h-16 object-contain drop-shadow-lg" />
      </div>

      <h1 className="text-3xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
        Gravity Wallet
      </h1>
      <p className="text-slate-500 text-sm mb-8">{isFirstRun ? t('lock.create_title') : t('lock.unlock_title')}</p>

      <div className="w-full space-y-4">

        <div className="space-y-2">
          {error && !showPinModal && <div className="p-2 mb-2 bg-red-900/40 border border-red-500/50 rounded text-center text-xs text-red-200">{error}</div>}

          <input
            type="password"
            placeholder={isFirstRun ? t('lock.placeholder_create') : t('lock.placeholder_enter')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
          />

          {isFirstRun && biometricsAvailable && (
            <div className="flex items-center gap-2 px-1 py-1">
              <input
                type="checkbox"
                id="bioSetup"
                checked={enableBiometrics}
                onChange={(e) => setEnableBiometrics(e.target.checked)}
                className="accent-blue-500 w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="bioSetup" className="text-xs text-slate-400 cursor-pointer select-none">
                Enable Biometric Unlock (TouchID / FaceID)
              </label>
            </div>
          )}

          <button
            onClick={handlePasswordSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('lock.processing') : (isFirstRun ? t('lock.create_btn') : t('lock.unlock_btn'))}
          </button>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-700"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-dark-800 px-2 text-slate-500">
            {isFirstRun ? t('lock.or_sign_up') : t('lock.or_unlock')}
          </span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="bg-white hover:bg-slate-50 text-gray-700 border border-gray-300 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Google</span>
          </button>

          {(biometricsAvailable && (walletState.useBiometrics || isFirstRun)) ? (
            <button
              onClick={handleBiometricAuth}
              disabled={isFirstRun || isLoading}
              className={`bg-dark-700 text-white font-medium py-2.5 rounded-lg hover:bg-dark-600 transition-colors flex items-center justify-center gap-2 text-sm ${isFirstRun ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" /></svg>
              Biometrics
            </button>
          ) : (
            <button disabled className="bg-dark-700 text-slate-600 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm cursor-not-allowed opacity-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              N/A
            </button>
          )}
        </div>

        {statusMessage && !error && (
          <div className="text-center text-xs text-blue-400 mt-2 animate-pulse">
            {statusMessage}
          </div>
        )}

        {/* Generic Error / Lock Reason */}
        {error && !showPinModal && (
          <div className="text-center text-xs text-red-400 mt-2 flex flex-col items-center gap-1">
            <span>{error}</span>
            <button
              onClick={() => setShowResetConfirmation(true)}
              className="text-[10px] underline text-slate-500 hover:text-slate-300"
            >
              {t('lock.clear_reset')}
            </button>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirmation && (
        <div className="absolute inset-0 z-[60] bg-dark-900/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-dark-800 border border-red-500/30 p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete all data?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              This action cannot be undone. All encrypted storage (Master Key, PIN, Accounts) will be permanently wiped from this device.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirmation(false)}
                className="flex-1 py-3 rounded-lg border border-dark-600 text-slate-300 hover:bg-dark-700 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (typeof chrome !== 'undefined' && chrome.storage) {
                    chrome.storage.local.clear(() => window.location.reload());
                  } else {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors text-sm shadow-lg shadow-red-900/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};