
import React, { useState, useEffect } from 'react';
import { WalletState } from '../types';
import { authenticateWithBiometrics, registerBiometrics, isBiometricsAvailable, authenticateWithGoogle } from '../services/authService';
import { initVault, initVaultWithGeneratedKey, unlockVault, getInternalKey, hasPinProtectedKey, loadInternalKeyWithPin, enablePasswordless } from '../services/cryptoService';
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
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [enableBiometrics, setEnableBiometrics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // PIN Modal State
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinMode, setPinMode] = useState<'create' | 'unlock' | 'totp'>('unlock');
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

      if (bioSuccess) {
        await enablePasswordless([]); // Initialize device key storage
      }

      setWalletState(prev => ({
        ...prev,
        encryptedMaster: true,
        useBiometrics: bioSuccess,
        useGoogleAuth: bioSuccess
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
      // Show Code Input
      setPinMode('totp');
      setPinValue('');
      setShowPinModal(true);
    } else {
      // If no TOTP config, we can't use it.
      // But maybe we fallback to "Google" mock if it was setting it up? 
      // No, let's just say "Not configured".
      setError("Authenticator not configured. Please unlock with password and configure it in Settings.");
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setIsLoading(true);
    setStatusMessage("Connecting to Google...");
    const user = await authenticateWithGoogle();

    if (user) {
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
      setError("Google authentication failed");
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
    if (pinMode === 'totp') {
      if (pinValue.length < 6) return;
      setIsLoading(true);

      // Verify Logic
      const secret = await getTOTPSecret();

      if (!secret) {
        setError("Configuration Error (Secret missing)");
        setIsLoading(false);
        return;
      }

      const isValid = verifyTOTP(pinValue, secret);

      if (isValid) {
        // Success! Unlock using internal key (if available)
        // We assume if generic TOTP is set up, we allow access to the internal key (legacy/insecure storage)
        // OR we require PIN?
        // The "Google Auth" flow previously required PIN if present.
        // So, TOTP essentially replaces the "Google Sign In" step.
        setShowPinModal(false);

        const hasPin = await hasPinProtectedKey();
        if (hasPin) {
          // Now ask for PIN to decrypt
          setPinMode('unlock');
          setPinValue('');
          setShowPinModal(true);
          setIsLoading(false);
          setStatusMessage("TOTP Verified. Enter PIN.");
        } else {
          await performLegacyUnlock();
        }
      } else {
        setIsLoading(false);
        setError("Invalid Code");
        setPinValue('');
      }
      return;
    }

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
              {pinMode === 'create' ? 'Create Security PIN' : pinMode === 'totp' ? 'Authenticator Code' : 'Enter Security PIN'}
            </h3>
            <p className="text-xs text-slate-400 mb-6 text-center">
              {pinMode === 'create'
                ? 'Set a 6-digit PIN to encrypt your wallet key. You will need this to login with Google/Biometrics.'
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

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="bg-white hover:bg-slate-50 text-gray-700 border border-gray-300 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-4 h-4" />
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
            <button
              onClick={handleTOTPAuth}
              disabled={isLoading}
              className="bg-dark-700 text-slate-300 font-medium py-2.5 rounded-lg hover:bg-dark-600 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              TOTP
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
          </div>
        )}

        {/* Always visible Reset Link */}
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