import React, { useState } from 'react';
import { Account, Chain, WalletState } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { TOTPSetupModal } from './TOTPSetupModal';
import { BiometricSetupModal } from './BiometricSetupModal';
import { SyncExportModal } from './SyncExportModal';
import { SyncImportModal } from './SyncImportModal';
import { SyncPayload } from '../types';
import { storageService } from '../services/storageService';

interface ManageWalletsProps {
  accounts: Account[];
  walletState: WalletState;
  setWalletState: React.Dispatch<React.SetStateAction<WalletState>>;
  onEdit: (account: Account) => void;
  onImport: () => void;
}

export const ManageWallets: React.FC<ManageWalletsProps> = ({ accounts, walletState, setWalletState, onEdit, onImport }) => {
  const { t } = useTranslation();
  const [showTOTP, setShowTOTP] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [showSyncExport, setShowSyncExport] = useState(false);
  const [showSyncImport, setShowSyncImport] = useState(false);

  const handleSyncImport = async (payload: SyncPayload) => {
    // Merge Accounts
    const mergedAccounts = [...walletState.accounts];
    let added = 0;
    payload.accounts.forEach(acc => {
      if (!mergedAccounts.find(a => a.name === acc.name && a.chain === acc.chain)) {
        mergedAccounts.push(acc);
        added++;
      }
    });

    const newConfig = { ...walletState };
    if (payload.settings) {
      if (payload.settings.useGoogleAuth !== undefined) newConfig.useGoogleAuth = payload.settings.useGoogleAuth;
      if (payload.settings.useBiometrics !== undefined) newConfig.useBiometrics = payload.settings.useBiometrics;
      if (payload.settings.useDeviceAuth !== undefined) newConfig.useDeviceAuth = payload.settings.useDeviceAuth;
      if (payload.settings.useTOTP !== undefined) newConfig.useTOTP = payload.settings.useTOTP;
    }

    setWalletState({ ...newConfig, accounts: mergedAccounts });

    // Save Chat Identity
    if (payload.chatIdentity) {
      await storageService.setItem('gravity_chat_key', payload.chatIdentity.privateKey);
      await storageService.setItem('gravity_chat_pub', payload.chatIdentity.publicKey);
      localStorage.setItem('gravity_chat_username', payload.chatIdentity.username);
      localStorage.setItem('gravity_chat_registration', JSON.stringify({
        id: payload.chatIdentity.id,
        username: payload.chatIdentity.username,
        timestamp: payload.timestamp
      }));
    }

    alert(`Sync Successful! Added ${added} new accounts.`);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center p-4 border-b border-dark-700">
        <h2 className="text-lg font-bold">{t('settings.accounts_title')}</h2>
        <button
          onClick={onImport}
          className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-white font-bold transition-colors"
        >
          {t('settings.add_new')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {accounts.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            <p>{t('settings.no_accounts')}</p>
          </div>
        ) : (
          accounts.map((acc, idx) => (
            <div key={`${acc.chain}-${acc.name}-${idx}`} className="bg-dark-800 border border-dark-700 rounded-lg p-3 flex justify-between items-center group hover:border-dark-600">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${acc.chain === Chain.HIVE ? 'bg-hive' :
                  acc.chain === Chain.STEEM ? 'bg-steem' : 'bg-blurt'
                  }`} />
                <div>
                  <h3 className="font-bold text-sm text-slate-200">@{acc.name}</h3>
                  <div className="flex gap-2 text-[10px] text-slate-500 uppercase tracking-wider">
                    <span>{acc.chain}</span>
                    {acc.activeKey && <span className="text-green-500">• Active</span>}
                    {acc.postingKey && <span className="text-blue-500">• Posting</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onEdit(acc)}
                className="p-2 hover:bg-dark-700 rounded-lg text-slate-500 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 pt-2 border-t border-dark-700 mt-auto space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Cross-Device Sync</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowSyncExport(true)}
            className="bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex flex-col items-center gap-2 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <span className="font-bold text-xs">Export</span>
          </button>
          <button
            onClick={() => setShowSyncImport(true)}
            className="bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex flex-col items-center gap-2 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 group-hover:bg-green-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </div>
            <span className="font-bold text-xs">Import</span>
          </button>
        </div>

        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1 mt-4">Security</h3>

        <button
          onClick={() => setShowTOTP(true)}
          className="w-full bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex items-center gap-3 transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm">Authenticator App (2FA)</div>
            <div className="text-[10px] text-slate-500">Enable Aegis, Google Auth, or Authy</div>
          </div>
          <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${walletState.useTOTP ? 'bg-green-500/20 text-green-500' : 'bg-slate-700 text-slate-400'}`}>
            {walletState.useTOTP ? 'Enabled' : 'Off'}
          </div>
        </button>

        <button
          onClick={() => setWalletState(prev => ({ ...prev, useDeviceAuth: !prev.useDeviceAuth }))}
          className="w-full bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex items-center gap-3 transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm">Device Auth</div>
            <div className="text-[10px] text-slate-500">Persistent secure device key</div>
          </div>
          <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${walletState.useDeviceAuth ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-700 text-slate-400'}`}>
            {walletState.useDeviceAuth ? 'Enabled' : 'Off'}
          </div>
        </button>

        <button
          onClick={() => setShowBio(true)}
          className="w-full bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex items-center gap-3 transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-500/20 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" /></svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm">Fingerprint / FaceID</div>
            <div className="text-[10px] text-slate-500">Fast biometric unlock</div>
          </div>
          <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${walletState.useBiometrics ? 'bg-green-500/20 text-green-500' : 'bg-slate-700 text-slate-400'}`}>
            {walletState.useBiometrics ? 'Enabled' : 'Off'}
          </div>
        </button>
      </div>

      {showTOTP && (
        <TOTPSetupModal
          accounts={accounts}
          onClose={() => setShowTOTP(false)}
          onComplete={() => setShowTOTP(false)}
        />
      )}

      {showBio && (
        <BiometricSetupModal
          accounts={accounts}
          walletState={walletState}
          setWalletState={setWalletState}
          onClose={() => setShowBio(false)}
          onComplete={() => setShowBio(false)}
        />
      )}

      {showSyncExport && (
        <SyncExportModal
          accounts={accounts}
          walletConfig={walletState}
          onClose={() => setShowSyncExport(false)}
        />
      )}

      {showSyncImport && (
        <SyncImportModal
          onClose={() => setShowSyncImport(false)}
          onImport={handleSyncImport}
        />
      )}
    </div>
  );
};