import React from 'react';
import { Account, Chain } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { TOTPSetupModal } from './TOTPSetupModal';
import { useState } from 'react';

interface ManageWalletsProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onImport: () => void;
}

export const ManageWallets: React.FC<ManageWalletsProps> = ({ accounts, onEdit, onImport }) => {
  const { t } = useTranslation();
  const [showTOTP, setShowTOTP] = useState(false);

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

      <div className="p-4 pt-2 border-t border-dark-700 mt-auto">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Security</h3>
        <button
          onClick={() => setShowTOTP(true)}
          className="w-full bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-lg flex items-center gap-3 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm">Authenticator App (2FA)</div>
            <div className="text-[10px] text-slate-500">Configure Aegis, Google Auth, or Authy</div>
          </div>
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {showTOTP && (
        <TOTPSetupModal
          accounts={accounts}
          onClose={() => setShowTOTP(false)}
          onComplete={() => setShowTOTP(false)}
        />
      )}
    </div>
  );
};