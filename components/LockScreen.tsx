
import React, { useState, useEffect } from 'react';
import { WalletState } from '../types';
import { isBiometricsAvailable, authenticateWithGoogle, authenticateWithDevice } from '../services/authService';
import { initVault, initVaultWithGeneratedKey, unlockVault, getInternalKey, hasPinProtectedKey, loadInternalKeyWithPin } from '../services/cryptoService';
import { verifyTOTP, hasTOTPConfigured, getTOTPSecret } from '../services/totpService';
import { calculatePasswordStrength, getStrengthLabel } from '../utils/passwordStrength';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const isFirstRun = !walletState.encryptedMaster;

  const [error, setError] = useState(lockReason || '');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // PIN Modal State
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinMode, setPinMode] = useState<'create' | 'unlock' | 'totp'>('unlock');
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  useEffect(() => {
    // We just check if it's available for potential later use or settings
    isBiometricsAvailable();
  }, []);

  // Update error if lockReason changes
  useEffect(() => {
    if (lockReason) setError(lockReason);
  }, [lockReason]);

  // Auto-Submit PIN
  useEffect(() => {
    if ((pinMode === 'unlock' || pinMode === 'totp') && pinValue.length === 6 && !isLoading) {
      submitPin();
    }
  }, [pinValue, pinMode]);

  const handlePasswordSubmit = async () => {
    if (isFirstRun) {
      if (password.length < 10) {
        setError("Password must be at least 10 characters long.");
        return;
      }
      const strength = calculatePasswordStrength(password);
      if (strength < 3) {
        setError("Password is too weak. Please include uppercase, numbers, and symbols.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setIsLoading(true);
      setStatusMessage(t('lock.processing'));

      // If the user uses a password, we just init the vault with that password.
      await initVault(password);

      setWalletState(prev => ({
        ...prev,
        encryptedMaster: true
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

  const handleTOTPAuth = async () => {
    setError("");
    const hasConfig = await hasTOTPConfigured();

    if (hasConfig) {
      setPinMode('totp');
      setPinValue('');
      setShowPinModal(true);
    } else {
      setError(t('lock.error_totp_not_configured'));
    }
  };

  const performSetupWithoutPassword = async (method: 'Google' | 'Device') => {
    try {
      setStatusMessage(`Initializing Passwordless Vault (${method})...`);
      // We generate a high-entropy key and store it locally
      const { vault } = await initVaultWithGeneratedKey();

      setWalletState(prev => ({
        ...prev,
        encryptedMaster: true,
        useGoogleAuth: method === 'Google',
        useDeviceAuth: method === 'Device'
      }));

      setIsLoading(false);
      onUnlock(vault.accounts);
    } catch (e) {
      console.error("Setup failed", e);
      setError(t('lock.error_setup_failed'));
      setIsLoading(false);
    }
  };

  const performLegacyUnlock = async (methodName: string) => {
    const internalKey = await getInternalKey();
    if (internalKey) {
      const vault = await unlockVault(internalKey);
      setIsLoading(false);
      if (vault) {
        onUnlock(vault.accounts);
      } else {
        setError(t('lock.error_decrypt_failed', { method: methodName }));
      }
    } else {
      setIsLoading(false);
      setError(t('lock.error_no_auth_data', { method: methodName }));
    }
  };

  const handleDeviceAuth = async () => {
    setError("");
    setIsLoading(true);
    setStatusMessage("Verifying Device...");
    const user = await authenticateWithDevice();

    if (user) {
      if (isFirstRun) {
        await performSetupWithoutPassword('Device');
      } else {
        const hasPin = await hasPinProtectedKey();
        if (hasPin) {
          setIsLoading(false);
          setPinMode('unlock');
          setPinValue('');
          setShowPinModal(true);
        } else {
          await performLegacyUnlock('Device');
        }
      }
    } else {
      setIsLoading(false);
      setError(t('lock.error_auth_failed', { method: 'Device' }));
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setIsLoading(true);
    setStatusMessage(t('lock.connecting_google'));
    const user = await authenticateWithGoogle();

    if (user) {
      if (isFirstRun) {
        await performSetupWithoutPassword('Google');
      } else {
        const hasPin = await hasPinProtectedKey();
        if (hasPin) {
          setIsLoading(false);
          setPinMode('unlock');
          setPinValue('');
          setShowPinModal(true);
        } else {
          await performLegacyUnlock('Google');
        }
      }
    } else {
      setIsLoading(false);
      setError(t('lock.error_auth_failed', { method: 'Google' }));
    }
  };

  const submitPin = async () => {
    if (pinMode === 'totp') {
      if (pinValue.length < 6) return;
      setIsLoading(true);
      const secret = await getTOTPSecret();

      if (!secret) {
        setError("Configuration Error (Secret missing)");
        setIsLoading(false);
        return;
      }

      const isValid = verifyTOTP(pinValue, secret);

      if (isValid) {
        setShowPinModal(false);
        const hasPin = await hasPinProtectedKey();
        if (hasPin) {
          setPinMode('unlock');
          setPinValue('');
          setShowPinModal(true);
          setIsLoading(false);
          setStatusMessage("TOTP Verified. Enter PIN.");
        } else {
          // Fallback to legacy
          const internalKey = await getInternalKey();
          if (internalKey) {
            const vault = await unlockVault(internalKey);
            if (vault) onUnlock(vault.accounts);
          } else {
            setError("No secure key found after TOTP.");
          }
        }
      } else {
        setIsLoading(false);
        setError("Invalid Code");
        setPinValue('');
      }
      return;
    }

    if (pinMode === 'create') {
      if (pinValue.length < 6) return;
      setIsLoading(true);
      setShowPinModal(false);

      try {
        const { vault } = await initVaultWithGeneratedKey(pinValue);
        setWalletState(prev => ({ ...prev, encryptedMaster: true, useGoogleAuth: true }));
        onUnlock(vault.accounts);
      } catch (e) {
        setError(t('lock.error_init_pin_failed'));
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 100));
      const internalKey = await loadInternalKeyWithPin(pinValue);

      if (internalKey) {
        const vault = await unlockVault(internalKey);
        if (vault) {
          onUnlock(vault.accounts);
        } else {
          setError(t('lock.error_decryption_corrupt'));
          setIsLoading(false);
          setShowPinModal(true);
        }
      } else {
        setIsLoading(false);
        setError(t('lock.error_incorrect_pin'));
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
              {pinMode === 'create' ? 'Create Security PIN' : pinMode === 'totp' ? 'Authenticator Code' : 'Enter Security PIN'}
            </h3>
            <p className="text-xs text-slate-400 mb-6 text-center">
              {pinMode === 'create'
                ? 'Set a 6-digit PIN to encrypt your wallet key. You will need this to login securely.'
                : pinMode === 'totp' ? 'Enter the 6-digit code from your Aegis/Auth app.' : 'Enter your 6-digit PIN to decrypt your wallet.'}
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

          {isFirstRun && password.length > 0 && (
            <div className="px-1 space-y-1 mb-3">
              <div className="flex h-1 rounded-full overflow-hidden bg-dark-700">
                <div
                  className={`h-full transition-all duration-300 ${getStrengthLabel(calculatePasswordStrength(password)).color}`}
                  style={{ width: `${(calculatePasswordStrength(password) + 1) * 20}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Security</span>
                <span className={`${getStrengthLabel(calculatePasswordStrength(password)).color.replace('bg-', 'text-')} font-bold uppercase`}>
                  {getStrengthLabel(calculatePasswordStrength(password)).label}
                </span>
              </div>
            </div>
          )}

          {isFirstRun && (
            <div className="bg-dark-900/50 border border-dark-700/50 rounded-xl p-3 mb-2 space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Requirements</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  { label: "10+ Characters", met: password.length >= 10 },
                  { label: "One Uppercase", met: /[A-Z]/.test(password) },
                  { label: "One Number", met: /[0-9]/.test(password) },
                  { label: "One Symbol", met: /[^A-Za-z0-9]/.test(password) }
                ].map((req, i) => (
                  <div key={i} className={`flex items-center gap-1.5 transition-colors ${req.met ? 'text-green-400' : 'text-slate-600'}`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={req.met ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} /></svg>
                    <span className="text-[9px] font-medium leading-none">{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isFirstRun && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-dark-900 border ${confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-dark-600'} rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors mb-2`}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
          )}

          <button
            onClick={handlePasswordSubmit}
            disabled={isLoading || (isFirstRun && (password.length < 10 || calculatePasswordStrength(password) < 3 || password !== confirmPassword))}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
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

        <div className="grid grid-cols-3 gap-2">
          {/* Google */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="bg-white hover:bg-slate-50 text-gray-700 border border-gray-300 rounded-lg py-2 transition-colors flex flex-col items-center justify-center gap-1 text-[10px] disabled:opacity-50"
            title={isFirstRun ? t('lock.google_title') : t('lock.google_unlock_title')}
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-4 h-4" />
            <span className="font-bold">{t('lock.google')}</span>
            <span className="text-[8px] opacity-70 leading-none">{isFirstRun ? t('lock.signup') : t('lock.unlock_label')}</span>
          </button>

          {/* Device Auth */}
          <button
            onClick={handleDeviceAuth}
            disabled={isLoading}
            className="bg-dark-700 hover:bg-dark-600 text-white rounded-lg py-2 transition-colors flex flex-col items-center justify-center gap-1 text-[10px] border border-dark-600"
            title={isFirstRun ? t('lock.device_title') : t('lock.device_unlock_title')}
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span className="font-bold uppercase tracking-tighter">{t('lock.device')}</span>
            <span className="text-[8px] opacity-70 leading-none">{isFirstRun ? t('lock.signup') : t('lock.unlock_label')}</span>
          </button>

          {/* TOTP or Multi-factor Indicator */}
          {!isFirstRun ? (
            <button
              onClick={handleTOTPAuth}
              disabled={isLoading}
              className="bg-dark-700 text-slate-300 rounded-lg py-2 hover:bg-dark-600 transition-colors flex flex-col items-center justify-center gap-1 text-[10px] border border-dark-600"
            >
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span className="font-bold uppercase">{t('lock.2fa')}</span>
            </button>
          ) : (
            <div className="bg-dark-900/30 rounded-lg border border-dark-700/50 flex flex-col items-center justify-center text-[8px] text-slate-600 uppercase font-bold tracking-widest px-2 text-center leading-tight">
              {t('lock.secure_by_design')}
            </div>
          )}
        </div>

        {statusMessage && !error && (
          <div className="text-center text-xs text-blue-400 mt-2 animate-pulse font-medium">
            {statusMessage}
          </div>
        )}

        <div className="text-center mt-4">
          <button
            onClick={() => setShowResetConfirmation(true)}
            className="text-[10px] underline text-slate-500 hover:text-red-400 transition-colors"
          >
            {t('lock.clear_reset')}
          </button>
        </div>
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