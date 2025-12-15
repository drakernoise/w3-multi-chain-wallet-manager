import React, { useState } from 'react';
import { Chain, Account } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { BulkTransferForm } from './BulkTransferForm'; // Import the form component

interface BulkTransferProps {
    chain: Chain;
    accounts: Account[];
    refreshBalance?: () => void;
    onChangeChain?: (chain: Chain) => void;
    onAddAccount?: () => void;
}

export const BulkTransfer: React.FC<BulkTransferProps> = ({ chain, accounts, refreshBalance, onChangeChain, onAddAccount }) => {
    const { t } = useTranslation();

    // State to manage which modal is open
    const [activeModal, setActiveModal] = useState<{ account: Account, mode: 'single' | 'multi' } | null>(null);

    // Filter accounts for current chain
    const currentChainAccounts = accounts.filter(a => a.chain === chain);

    return (
        <div className="h-full flex flex-col bg-dark-900 overflow-hidden relative">

            {/* Header / Chain Selector (Similar to WalletView) */}
            <div className="p-6 pb-2">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400 mb-4">
                    {t('bulk.title')}
                </h2>

                {/* Chain Selector Tabs */}
                <div className="flex p-1 bg-dark-800 rounded-xl mb-4 border border-dark-700">
                    {[Chain.HIVE, Chain.STEEM, Chain.BLURT].map((c) => (
                        <button
                            key={c}
                            onClick={() => onChangeChain && onChangeChain(c)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${chain === c
                                ? c === Chain.HIVE ? 'bg-hive text-white shadow-lg' : c === Chain.STEEM ? 'bg-steem text-white shadow-lg' : 'bg-blurt text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Account List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-4">
                {currentChainAccounts.length === 0 ? (
                    <div className="text-center py-12 opacity-50 bg-dark-800/50 rounded-xl border border-dashed border-dark-700 flex flex-col items-center gap-4">
                        <p className="text-sm font-medium text-slate-400">{t('bulk.no_accounts').replace('{chain}', chain)}</p>
                        {onAddAccount && (
                            <button
                                onClick={onAddAccount}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg text-xs transition-colors shadow-lg"
                            >
                                {t('wallet.add_one')}
                            </button>
                        )}
                    </div>
                ) : (
                    currentChainAccounts.map(account => (
                        <div key={account.name} className="relative bg-dark-800 p-5 rounded-2xl border border-dark-700 shadow-xl overflow-hidden group hover:border-dark-600 transition-all">
                            {/* Background Decoration Logo */}
                            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 opacity-5 pointer-events-none transform rotate-12 group-hover:opacity-10 transition-opacity duration-500 blur-sm">
                                <img
                                    src={chain === Chain.HIVE ? "/Logo_hive.png" : chain === Chain.STEEM ? "/logosteem.png" : "/logoblurt.png"}
                                    alt={chain}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="relative z-10">
                                {/* Account Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                            @{account.name}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-bold tracking-wider mt-1">{chain} COIN</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-baseline gap-1 justify-end">
                                            <span className="text-xl font-black text-white block truncate">
                                                {account.balance !== undefined ? account.balance.toFixed(3) : '0.000'}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-500">{chain}</span>
                                        </div>
                                        {(chain === Chain.HIVE || chain === Chain.STEEM) && (
                                            <div className="flex items-baseline gap-1 justify-end mt-[-2px]">
                                                <span className="text-sm font-bold text-slate-400 block truncate">
                                                    {account.secondaryBalance !== undefined ? account.secondaryBalance.toFixed(3) : '0.000'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-600">
                                                    {chain === Chain.HIVE ? 'HBD' : 'SBD'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setActiveModal({ account, mode: 'single' })}
                                        className="bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-blue-500/50 py-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-2 group/btn relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                        <div className="p-2 bg-dark-800 rounded-full group-hover/btn:scale-110 transition-transform">
                                            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        </div>
                                        <span className="text-slate-300 group-hover/btn:text-white relative z-10">{t('bulk.same_amount')}</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveModal({ account, mode: 'multi' })}
                                        className="bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-purple-500/50 py-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-2 group/btn relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                        <div className="p-2 bg-dark-800 rounded-full group-hover/btn:scale-110 transition-transform">
                                            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                        </div>
                                        <span className="text-slate-300 group-hover/btn:text-white relative z-10">{t('bulk.diff_amount')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Overlay */}
            {activeModal && (
                <BulkTransferForm
                    chain={chain}
                    account={activeModal.account}
                    mode={activeModal.mode}
                    onClose={() => setActiveModal(null)}
                    onSuccess={() => {
                        setActiveModal(null);
                        if (refreshBalance) refreshBalance();
                    }}
                />
            )}
        </div>
    );
};