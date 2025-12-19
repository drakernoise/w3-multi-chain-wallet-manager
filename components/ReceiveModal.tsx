import React, { useState, useEffect } from 'react';
import { Account } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ReceiveModalProps {
  account: Account;
  accounts: Account[];
  onClose: () => void;
}

export const ReceiveModal: React.FC<ReceiveModalProps> = ({ account: initialAccount, onClose }) => {
  const { t } = useTranslation();
  const [selectedAccount] = useState<Account>(initialAccount);
  const [copied, setCopied] = useState(false);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedAccount.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 shadow-2xl flex flex-col overflow-hidden relative">
        {/* Header with X Close */}
        <div className="p-4 border-b border-dark-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{t('receive.title')}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 flex flex-col items-center text-center">

          <div className="w-full mb-4">
            <div className="bg-dark-900 border border-dark-600 rounded px-2 py-1 text-xs text-white mx-auto inline-block font-bold">
              @{selectedAccount.name} ({selectedAccount.chain})
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-6">{t('receive.scan_qr').replace('{chain}', selectedAccount.chain)}</p>

          <div className="bg-white p-2 rounded-lg mb-6">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedAccount.name}`}
              alt="QR Code"
              className="w-32 h-32"
            />
          </div>

          <label className="text-xs text-slate-500 uppercase font-bold mb-2">{t('receive.account_name')}</label>
          <div
            onClick={handleCopy}
            className="w-full bg-dark-900 border border-dark-600 rounded-lg py-3 px-4 flex justify-between items-center cursor-pointer hover:border-blue-500 transition-colors group"
          >
            <span className="font-mono text-lg text-white">@{selectedAccount.name}</span>
            <span className={`text-xs ${copied ? 'text-green-400' : 'text-slate-500 group-hover:text-white'}`}>
              {copied ? t('receive.copied') : t('receive.copy')}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
