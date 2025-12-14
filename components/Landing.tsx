import React from 'react';
import { Chain } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface LandingProps {
  onSelectChain: (chain: Chain) => void;
  onManage: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onSelectChain, onManage }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 relative p-4 overflow-y-auto custom-scrollbar">

      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-white/5 backdrop-blur-sm animate-float">
          <img src="/logowallet.png" alt="App Logo" className="w-10 h-10 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500" />
        </div>
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
          {t('landing.welcome') || "Welcome Back"}
        </h1>
        <p className="text-slate-400 text-xs max-w-[200px] mx-auto leading-relaxed">{t('landing.subtitle') || "Select a network to manage your assets"}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full max-w-[240px]">
        <button
          onClick={() => onSelectChain(Chain.BLURT)}
          title={`${t('action.select_network')} BLURT`}
          className="bg-dark-800 hover:bg-blurt/20 border border-dark-700 hover:border-blurt/50 p-4 rounded-xl flex items-center gap-4 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-blurt/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
            <img src="/logoblurt.png" alt="Blurt" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-lg group-hover:text-blurt transition-colors">BLURT</span>
          <svg className="w-5 h-5 ml-auto text-dark-600 group-hover:text-blurt transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        <button
          onClick={() => onSelectChain(Chain.HIVE)}
          title={`${t('action.select_network')} HIVE`}
          className="bg-dark-800 hover:bg-hive/20 border border-dark-700 hover:border-hive/50 p-4 rounded-xl flex items-center gap-4 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-hive/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
            <img src="/Logo_hive.png" alt="Hive" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-lg group-hover:text-hive transition-colors">HIVE</span>
          <svg className="w-5 h-5 ml-auto text-dark-600 group-hover:text-hive transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        <button
          onClick={() => onSelectChain(Chain.STEEM)}
          title={`${t('action.select_network')} STEEM`}
          className="bg-dark-800 hover:bg-steem/20 border border-dark-700 hover:border-steem/50 p-4 rounded-xl flex items-center gap-4 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-steem/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
            <img src="/logosteem.png" alt="Steem" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-lg group-hover:text-steem transition-colors">STEEM</span>
          <svg className="w-5 h-5 ml-auto text-dark-600 group-hover:text-steem transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full max-w-[240px] pt-4 border-t border-dark-700/50 pb-8">
        <button
          onClick={onManage}
          title={t('action.manage_keys')}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 text-slate-400 hover:text-white transition-colors border border-transparent hover:border-dark-600 gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">{t('landing.manage_keys') || "Keys"}</span>
        </button>
      </div>
    </div>
  );
};
