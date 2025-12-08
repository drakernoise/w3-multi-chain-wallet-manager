import React, { useState, useEffect } from 'react';
import { WalletState } from '../types';
import { authenticateWithGoogle, authenticateWithBiometrics, registerBiometrics, isBiometricsAvailable } from '../services/authService';
import { initVault, initVaultWithGeneratedKey, unlockVault, getInternalKey } from '../services/cryptoService';

interface LockScreenProps {
  onUnlock: (accounts: any[]) => void;
  walletState: WalletState;
  setWalletState: React.Dispatch<React.SetStateAction<WalletState>>;
}

declare const chrome: any;

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, walletState, setWalletState }) => {
  const [password, setPassword] = useState('');
  // Check if we are in "First Run" mode (no encryptedMaster set)
  const isFirstRun = !walletState.encryptedMaster;

  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [enableBiometrics, setEnableBiometrics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    isBiometricsAvailable().then(setBiometricsAvailable);
  }, []);

  // Standard Password Setup/Login
  const handlePasswordSubmit = async () => {
    if (isFirstRun) {
      // SETUP MODE
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      setIsLoading(true);
      setStatusMessage("Encrypting new wallet...");

      // 1. Register Biometrics if requested
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

      // 2. Initialize Vault
      await initVault(password);

      // 3. Update State
      setWalletState(prev => ({
        ...prev,
        encryptedMaster: true, // Mark as initialized
        useBiometrics: bioSuccess
      }));

      setIsLoading(false);
      onUnlock([]); // Empty accounts initially
    } else {
      // UNLOCK MODE
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

        if (isFirstRun) {
          // Setup with Google - No password yet
          // Generate a safe internal key and SAVE IT to local storage
          const { vault } = await initVaultWithGeneratedKey();

          setWalletState(prev => ({ ...prev, encryptedMaster: true, useGoogleAuth: true }));
          onUnlock(vault.accounts);
        } else {
          // Login with Google

          // SECOND LAYER: Biometric/Device Auth
          // As requested by user: "a second layer appeared asking for device credentials"
          if (biometricsAvailable) {
            setStatusMessage("Verifying Device Credentials...");
            const bioSuccess = await authenticateWithBiometrics();
            if (!bioSuccess) {
              setError("Device Authentication Failed.");
              setIsLoading(false);
              return;
            }
            setStatusMessage("Device Verified. Unlocking...");
          }

          // Retrieve the stored internal key
          const internalKey = await getInternalKey();

          console.log("DEBUG: Internal Key retrieved:", internalKey);
          if (typeof internalKey === 'object') {
            console.log("DEBUG: Key is object, trying to stringify or access properties");
          }

          if (internalKey) {
            const vault = await unlockVault(internalKey);
            if (vault) {
              onUnlock(vault.accounts);
            } else {
              setError("Could not decrypt data (Invalid Key).");
            }
            // Fallback: If user switched from password to Google but didn't set up internal key properly
            // Or if key is lost.
            setError("No Google Auth data found. Try Password.");

            // Allow user to reset if they want to start fresh (as requested)
            // Debugging: Check what keys exist in storage
            if (typeof chrome !== 'undefined' && chrome.storage) {
              chrome.storage.local.get(null, (items: any) => {
                console.log("STORAGE KEYS:", Object.keys(items));
                setError(`No Google Auth data found. Keys: ${Object.keys(items).join(', ')}`);
              });
            }
          }
        }
      }
    } catch (e) {
      setError("Google Auth Failed");
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  const handleBiometricAuth = async () => {
    setError("");
    setIsLoading(true);
    setStatusMessage("Waiting for verification...");
    const success = await authenticateWithBiometrics();

    if (success) {
      // Similar to Google Auth: retrieve key
      const internalKey = await getInternalKey();
      if (internalKey) {
        const vault = await unlockVault(internalKey);
        setIsLoading(false);
        if (vault) {
          onUnlock(vault.accounts);
        } else {
          setError("Decryption failed.");
        }
      } else {
        setIsLoading(false);
        setError("Biometric key not found.");
      }
    } else {
      setIsLoading(false);
      setError("Biometric verification failed");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" /></svg>
      </div>

      <h1 className="text-2xl font-bold mb-1 tracking-tight">Web3 Multi-Chain Wallet</h1>
      <p className="text-slate-500 text-sm mb-8">{isFirstRun ? "Create Master Password" : "Unlock Your Wallet"}</p>

      <div className="w-full space-y-4">

        {/* Main Password Input */}
        <div className="space-y-2">
          <input
            type="password"
            placeholder={isFirstRun ? "Set Master Password" : "Enter Master Password"}
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
            {isLoading ? "Processing..." : (isFirstRun ? "Create Wallet" : "Unlock")}
          </button>
        </div>

        {/* Alternative Auth Methods */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-700"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-dark-800 px-2 text-slate-500">
            {isFirstRun ? "Or sign up with" : "Or unlock with"}
          </span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Google Button */}
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
              title={isFirstRun ? "Use checkbox above to enable" : "Use FaceID/TouchID"}
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

        {error && (
          <div className="text-center text-xs text-red-400 mt-2 flex flex-col items-center gap-1">
            <span>{error}</span>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear LOCAL WALLET DATA? You will need your master password or recover from seed.")) {
                  if (typeof chrome !== 'undefined' && chrome.storage) {
                    chrome.storage.local.clear(() => window.location.reload());
                  } else {
                    localStorage.clear();
                    window.location.reload();
                  }
                }
              }}
              className="text-[10px] underline text-slate-500 hover:text-slate-300"
            >
              Clear Local Data & Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};