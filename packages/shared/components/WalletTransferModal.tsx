import React, { useState } from 'react';
import { Account, SyncPayload } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { SyncExportModal } from './SyncExportModal';
import { SyncImportModal } from './SyncImportModal';

interface WalletTransferModalProps {
  accounts: Account[];
  walletConfig: any;
  onClose: () => void;
  onImport: (payload: SyncPayload) => Promise<void>;
}

type TransferRole = 'send' | 'receive' | null;

export const WalletTransferModal: React.FC<WalletTransferModalProps> = ({
  accounts,
  walletConfig,
  onClose,
  onImport
}) => {
  const { t } = useTranslation();
  const [role, setRole] = useState<TransferRole>(null);

  if (role === 'send') {
    return <SyncExportModal accounts={accounts} walletConfig={walletConfig} onClose={onClose} />;
  }

  if (role === 'receive') {
    return <SyncImportModal onClose={onClose} onImport={onImport} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-dark-800 border border-dark-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-black text-white mb-2">{t('pair.choose_title')}</h3>
        <p className="text-xs text-slate-400 mb-6">{t('pair.choose_subtitle')}</p>

        <div className="space-y-3">
          <button
            onClick={() => setRole('send')}
            disabled={accounts.length === 0}
            className="w-full bg-dark-900 hover:bg-dark-700 disabled:opacity-40 disabled:hover:bg-dark-900 border border-dark-600 p-4 rounded-2xl flex items-center gap-4 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16V4m0 0L8 8m4-4l4 4M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm text-white">{t('pair.role_send')}</div>
              <div className="text-[10px] text-slate-500 mt-1">{t('pair.role_send_hint')}</div>
            </div>
          </button>

          <button
            onClick={() => setRole('receive')}
            className="w-full bg-dark-900 hover:bg-dark-700 border border-dark-600 p-4 rounded-2xl flex items-center gap-4 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm text-white">{t('pair.role_receive')}</div>
              <div className="text-[10px] text-slate-500 mt-1">{t('pair.role_receive_hint')}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
