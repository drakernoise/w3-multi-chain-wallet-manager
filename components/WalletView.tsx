import React, { useState } from 'react';
import { Chain, Account } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { PowerModal } from './PowerModal';
import { SavingsModal } from './SavingsModal';
import { RCModal } from './RCModal';

interface WalletViewProps {
  chain: Chain;
  onChainChange: (chain: Chain) => void;
  accounts: Account[];
  onManage?: (account: Account) => void;
  onSend?: (account: Account) => void;
  onReceive?: (account: Account) => void;
  onHistory?: (account: Account) => void;
  onRefresh?: () => void;
  onAddAccount?: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  chain,
  onChainChange,
  accounts,
  onManage,
  onSend,
  onReceive,
  onHistory,
  onRefresh,
  onAddAccount
}) => {
  const { t } = useTranslation();

  // Modal state
  const [modalState, setModalState] = useState<{
    type: 'powerup' | 'powerdown' | 'delegate' | 'savings-deposit' | 'savings-withdraw' | 'rc-delegate' | 'rc-undelegate' | null;
    account: Account | null;
  }>({ type: null, account: null });

  const openModal = (type: typeof modalState.type, account: Account) => {
    setModalState({ type, account });
  };

  const closeModal = () => {
    setModalState({ type: null, account: null });
  };

  return (
    <div className="space-y-4 relative h-full overflow-y-auto p-4 custom-scrollbar">
      {/* Header with Network Refresh */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
          {t('wallet.network_label')}
        </h2>
        <button
          onClick={onRefresh}
          className="p-2 bg-dark-800 rounded-full hover:bg-dark-700 hover:text-blue-400 transition-colors border border-dark-700"
          title={t('wallet.refresh_tooltip')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>

      {/* Chain Selector Tabs */}
      <div className="flex p-1 bg-dark-800 rounded-xl mb-6 border border-dark-700">
        {[Chain.BLURT, Chain.HIVE, Chain.STEEM].map((c) => (
          <button
            key={c}
            onClick={() => onChainChange(c)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${chain === c
              ? c === Chain.HIVE ? 'bg-hive text-white shadow-lg' : c === Chain.STEEM ? 'bg-steem text-white shadow-lg' : 'bg-blurt text-white shadow-lg'
              : 'text-slate-500 hover:text-slate-300'
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-10 opacity-50 bg-dark-800/50 rounded-xl border border-dashed border-dark-700 flex flex-col items-center gap-4">
          <p className="text-sm">{t('wallet.no_accounts_chain').replace('{chain}', chain)}</p>
          {onAddAccount && (
            <button
              onClick={onAddAccount}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg text-xs transition-colors shadow-lg whitespace-normal leading-tight h-auto max-w-[200px]"
            >
              {t('wallet.add_one')}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map(account => {
            const hasActive = !!account.activeKey;
            const hasPosting = !!account.postingKey;

            return (
              <div key={account.name} className="relative bg-dark-800 p-5 rounded-2xl border border-dark-700 shadow-xl overflow-hidden group hover:border-dark-600 transition-all">

                {/* Background Decoration Logo */}
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 opacity-5 pointer-events-none transform rotate-12 group-hover:opacity-10 transition-opacity duration-500 blur-sm">
                  <img
                    src={chain === Chain.HIVE ? "/Logo_hive.png" : chain === Chain.STEEM ? "/logosteem.png" : "/logoblurt.png"}
                    alt={chain}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-col mb-4 relative z-10 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      @{account.name}
                      <div className="flex gap-1">
                        {hasActive && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" title={t('wallet.active_key_tooltip')}></span>}
                        {hasPosting && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" title={t('wallet.posting_key_tooltip')}></span>}
                      </div>
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {/* Primary Balance */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-slate-500 text-xs tracking-wide">{chain}</span>
                      <span className={`w-1 h-1 rounded-full ${chain === Chain.HIVE ? 'bg-red-500' : chain === Chain.STEEM ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
                      <span className="font-bold text-white text-lg tracking-tight" title={String(account.balance)}>
                        {account.balance !== undefined ? account.balance.toFixed(3) : '0.000'}
                      </span>
                    </div>

                    {/* Secondary Balance (HBD/SBD) */}
                    {(chain === Chain.HIVE || chain === Chain.STEEM) && (
                      <div className="flex items-baseline gap-1.5 ml-1">
                        <span className="text-slate-600 font-bold text-[10px]">•</span>
                        <span className="font-bold text-slate-400 text-sm" title={String(account.secondaryBalance)}>
                          {account.secondaryBalance !== undefined ? account.secondaryBalance.toFixed(3) : '0.000'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {chain === Chain.HIVE ? 'HBD' : 'SBD'}
                        </span>
                      </div>
                    )}

                    {/* Staked Power Balance (HP/SP/BP) */}
                    <div className="flex items-baseline gap-1.5 ml-1">
                      <span className="text-slate-600 font-bold text-[10px]">/</span>
                      <span className="font-bold text-blue-400 text-sm" title={String(account.stakedBalance)}>
                        {account.stakedBalance !== undefined ? account.stakedBalance.toFixed(3) : '0.000'}
                      </span>
                      <span className="text-[10px] font-bold text-blue-500/80">
                        {chain === Chain.HIVE ? 'HP' : chain === Chain.STEEM ? 'SP' : 'BP'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Grid */}
                <div className="grid grid-cols-4 gap-2 mt-4 relative z-10 w-full">
                  <button
                    onClick={() => onSend && onSend(account)}
                    className="relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-blue-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn"
                    aria-label={t('wallet.send')}
                  >
                    <svg className="w-5 h-5 text-slate-400 group-hover/btn:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50">
                      {t('wallet.send')}
                    </span>
                  </button>
                  <button
                    onClick={() => onReceive && onReceive(account)}
                    className="relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-green-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn"
                    aria-label={t('wallet.receive')}
                  >
                    <svg className="w-5 h-5 text-slate-400 group-hover/btn:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50">
                      {t('wallet.receive')}
                    </span>
                  </button>
                  <button
                    onClick={() => onHistory && onHistory(account)}
                    className="relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-purple-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn"
                    aria-label={t('wallet.history')}
                  >
                    <svg className="w-5 h-5 text-slate-400 group-hover/btn:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50">
                      {t('wallet.history')}
                    </span>
                  </button>
                  <button
                    onClick={() => onManage && onManage(account)}
                    className="relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-orange-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn"
                    aria-label={t('wallet.keys')}
                  >
                    <svg className="w-5 h-5 text-slate-400 group-hover/btn:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50">
                      {t('wallet.keys')}
                    </span>
                  </button>
                </div>

                {/* Second Row - Power & Savings Operations */}
                {hasActive && (
                  <div className="grid grid-cols-3 gap-2 mt-2 relative z-10 w-full">
                    {/* Power Up */}
                    <button
                      onClick={() => openModal('powerup', account)}
                      className="relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-cyan-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn"
                      aria-label="Power Up"
                    >
                      <svg className="w-5 h-5 text-slate-400 group-hover/btn:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50">
                        Power Up
                      </span>
                    </button>
                    {/* Power Down */}
                    <button
                      onClick={() => openModal('powerdown', account)}
                      className="relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-yellow-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn"
                      aria-label="Power Down"
                    >
                      <div className="relative w-5 h-5">
                        <svg className="w-5 h-5 text-slate-400 group-hover/btn:text-yellow-400 transition-colors absolute inset-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <svg className="w-3 h-3 text-red-500 group-hover/btn:text-red-400 transition-colors absolute top-0 right-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </div>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50">
                        Power Down
                      </span>
                    </button>
                    {/* Delegate */}
                    <button
                      onClick={() => openModal('delegate', account)}
                      className="relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-pink-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn"
                      aria-label="Delegate"
                    >
                      <svg className="w-5 h-5 text-slate-400 group-hover/btn:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50">
                        Delegate
                      </span>
                    </button>
                  </div>
                )}

                {/* Third Row - Savings & RC (chain-specific) */}
                {hasActive && (
                  <div className="grid grid-cols-3 gap-2 mt-2 relative z-10 w-full">
                    {/* Savings (HBD/SBD - Hive & Steem only) */}
                    {(chain === Chain.HIVE || chain === Chain.STEEM) && (
                      <button
                        onClick={() => openModal('savings-deposit', account)}
                        className="relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-emerald-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn"
                        aria-label="Savings"
                      >
                        <svg className="w-5 h-5 text-slate-400 group-hover/btn:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50">
                          Savings
                        </span>
                      </button>
                    )}
                    {/* RC Delegation (Hive only) */}
                    {chain === Chain.HIVE && (
                      <button
                        onClick={() => openModal('rc-delegate', account)}
                        className="relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-indigo-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn"
                        aria-label="Delegate RC"
                      >
                        <svg className="w-5 h-5 text-slate-400 group-hover/btn:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50">
                          Delegate RC
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {modalState.account && modalState.type && (
        <>
          {(modalState.type === 'powerup' || modalState.type === 'powerdown' || modalState.type === 'delegate') && (
            <PowerModal
              account={modalState.account}
              type={modalState.type}
              onClose={closeModal}
              onSuccess={() => {
                closeModal();
                onRefresh?.();
              }}
            />
          )}
          {(modalState.type === 'savings-deposit' || modalState.type === 'savings-withdraw') && (
            <SavingsModal
              account={modalState.account}
              type={modalState.type === 'savings-deposit' ? 'deposit' : 'withdraw'}
              onClose={closeModal}
              onSuccess={() => {
                closeModal();
                onRefresh?.();
              }}
            />
          )}
          {(modalState.type === 'rc-delegate' || modalState.type === 'rc-undelegate') && (
            <RCModal
              account={modalState.account}
              type={modalState.type === 'rc-delegate' ? 'delegate' : 'undelegate'}
              onClose={closeModal}
              onSuccess={() => {
                closeModal();
                onRefresh?.();
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
