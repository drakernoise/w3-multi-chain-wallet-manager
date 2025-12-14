import React from 'react';
import { Chain, Account } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface MultiSigProps {
  chain: Chain;
  accounts: Account[];
}

export const MultiSig: React.FC<MultiSigProps> = () => {
  const { t } = useTranslation();
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-64 h-64 mb-8 group">
        <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-700"></div>
        <img
          src="/construction_worker.png"
          alt="Under Construction"
          className="relative w-full h-full object-contain drop-shadow-2xl animate-float"
        />
      </div>

      <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight">
        {t('multisig.construction_title')}
      </h2>

      <p className="text-slate-400 max-w-sm text-lg leading-relaxed">
        {t('multisig.construction_desc')}
      </p>

      <div className="mt-8 flex gap-3 opacity-75">
        <span className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-3 h-3 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
};