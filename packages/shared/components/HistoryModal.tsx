import React, { useState } from 'react';
import { Account } from '../types';
import { HistoryItem } from '../services/chainService';
import { useTranslation } from '../contexts/LanguageContext';

interface HistoryModalProps {
    account: Account;
    history: HistoryItem[];
    loading: boolean;
    loadError?: string | null;
    lastUpdated?: number;
    onClose: () => void;
    onRefresh?: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ account, history, loading, loadError, lastUpdated, onClose, onRefresh }) => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<'all' | 'received' | 'sent' | 'powerup' | 'powerdown' | 'delegate'>('all');
    const [showProducerRewards, setShowProducerRewards] = useState(false);
    const incomingTypes = ['receive', 'powerup_in', 'delegate_in', 'rc_delegate_in', 'savings_in', 'reward', 'producer_reward'];
    const outgoingTypes = ['send', 'powerup_out', 'powerdown', 'delegate_out', 'undelegate_out', 'rc_delegate_out', 'savings_out', 'savings_cancel'];
    const isProducerReward = (item: HistoryItem) => item.type === 'producer_reward' || (item.type === 'reward' && item.memo === 'Producer Reward');
    const hasProducerRewards = history.some(isProducerReward);

    const filteredHistory = history.filter(item => {
        if (isProducerReward(item) && !showProducerRewards) return false;
        if (filter === 'all') return true;
        if (filter === 'received') return incomingTypes.includes(item.type);
        if (filter === 'sent') return outgoingTypes.includes(item.type);
        if (filter === 'powerup') return item.type === 'powerup_in' || item.type === 'powerup_out';
        if (filter === 'powerdown') return item.type === 'powerdown';
        if (filter === 'delegate') return item.type === 'delegate_in' || item.type === 'delegate_out' || item.type === 'undelegate_out' || item.type === 'rc_delegate_in' || item.type === 'rc_delegate_out';
        return true;
    });

    const getTypeBadgeClass = (type: string) => {
        switch (type) {
            case 'receive':
            case 'powerup_in':
            case 'savings_in':
                return 'bg-green-500/10 text-green-400';
            case 'send':
            case 'powerup_out':
            case 'powerdown':
            case 'delegate_out':
            case 'undelegate_out':
            case 'savings_out':
            case 'savings_cancel':
                return 'bg-red-500/10 text-red-400';
            case 'delegate_in':
            case 'rc_delegate_in':
            case 'rc_delegate_out':
                return 'bg-blue-500/10 text-blue-400';
            case 'reward':
            case 'producer_reward':
                return 'bg-amber-500/10 text-amber-400';
            default:
                return 'bg-slate-500/10 text-slate-400';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'receive': return t('history.received');
            case 'send': return t('history.sent');
            case 'powerup_in': return t('history.type_powerup_in');
            case 'powerup_out': return t('history.type_powerup_out');
            case 'powerdown': return t('history.type_powerdown');
            case 'delegate_in': return t('history.type_delegate_in');
            case 'delegate_out': return t('history.type_delegate_out');
            case 'undelegate_out': return t('history.type_undelegate_out');
            case 'rc_delegate_in': return t('history.type_rc_delegate_in');
            case 'rc_delegate_out': return t('history.type_rc_delegate_out');
            case 'savings_in': return t('history.type_savings_in');
            case 'savings_out': return t('history.type_savings_out');
            case 'savings_cancel': return t('history.type_savings_cancel');
            case 'reward': return t('history.type_reward');
            case 'producer_reward': return t('history.type_producer_reward');
            default: return type;
        }
    };

    const getHistoryTypeLabel = (item: HistoryItem) => isProducerReward(item)
        ? t('history.type_producer_reward')
        : getTypeLabel(item.type);

    const getFilterIcon = (type: string) => {
        switch (type) {
            case 'all':
                // History Icon (Clock)
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                );
            case 'received':
                // Receive Icon (Direct Match)
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                );
            case 'sent':
                // Send Icon (Direct Match)
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                );
            case 'powerup':
                return (
                    <svg className="w-5 h-5 transition-colors" viewBox="0 0 24 24">
                        <rect x="3" y="7" width="16" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        <rect x="5.5" y="9.5" width="10" height="5" rx="1" fill="currentColor" opacity="0.85" />
                        <rect x="19.5" y="10" width="1.8" height="4" rx="0.8" fill="currentColor" />
                    </svg>
                );
            case 'powerdown':
                return (
                    <svg className="w-5 h-5 transition-colors" viewBox="0 0 24 24">
                        <rect x="3" y="7" width="16" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        <rect x="5.5" y="11" width="4" height="3" rx="0.8" fill="currentColor" opacity="0.85" />
                        <rect x="19.5" y="10" width="1.8" height="4" rx="0.8" fill="currentColor" />
                    </svg>
                );
            case 'delegate':
                return (
                    <svg className="w-5 h-5 transition-colors" viewBox="0 0 24 24">
                        <rect x="4" y="3" width="6" height="14" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                        <rect x="5.5" y="6" width="3" height="8" rx="0.8" fill="currentColor" opacity="0.85" />
                        <rect x="6" y="1.5" width="2" height="1.5" rx="0.5" fill="currentColor" />
                        <rect x="14" y="7" width="6" height="14" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                        <rect x="15.5" y="10" width="3" height="8" rx="0.8" fill="currentColor" opacity="0.85" />
                        <rect x="16" y="5.5" width="2" height="1.5" rx="0.5" fill="currentColor" />
                        <path d="M10.5 8.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M13 6.5l2 2-2 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.5 15.5h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M12 13.5l-2 2 2 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
            <div className="bg-dark-800 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col border border-dark-600 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Fixed Header & Filters Container */}
                <div className="bg-dark-800 border-b border-dark-600">
                    <div className="p-4 flex justify-between items-center bg-dark-700/30">
                        <h3 className="font-black text-lg text-white tracking-tight">
                            {t('history.title').replace('{user}', account.name)}
                        </h3>
                        <div className="flex items-center gap-2">
                            {lastUpdated && (
                                <span className="text-[10px] text-slate-500" title={new Date(lastUpdated).toLocaleString()}>
                                    {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                            {onRefresh && (
                                <button
                                    onClick={onRefresh}
                                    disabled={loading}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-700 text-slate-400 hover:text-blue-400 disabled:opacity-50 transition-colors"
                                    title={t('wallet.refresh_tooltip')}
                                >
                                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                </button>
                            )}
                            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-700 text-slate-400 hover:text-white transition-colors">
                                &times;
                            </button>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="px-3 py-2 bg-dark-900 flex items-center gap-2 overflow-x-auto no-scrollbar justify-between">
                        {/* Filter Icon Label */}
                        <div className="text-blue-500 shrink-0 flex items-center mr-2" title={t('history.filter_label')}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex gap-2 flex-1 justify-end">
                            {['all', 'received', 'sent', 'powerup', 'powerdown', 'delegate'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    title={t(`history.filter_${f}`)}
                                    className={`p-2 rounded-lg transition-all border flex items-center justify-center w-9 h-9 ${filter === f
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                                        : 'bg-dark-800 border-dark-700 text-slate-500 hover:border-dark-500 hover:text-slate-300'
                                        }`}
                                >
                                    {getFilterIcon(f)}
                                </button>
                            ))}
                        </div>
                    </div>
                    {hasProducerRewards && (
                        <div className="px-3 pb-3 bg-dark-900 flex justify-end">
                            <button
                                onClick={() => setShowProducerRewards((value) => !value)}
                                className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border transition-colors ${showProducerRewards
                                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                    : 'bg-dark-800 text-slate-500 border-dark-700 hover:text-amber-300 hover:border-amber-500/30'
                                    }`}
                            >
                                {showProducerRewards ? t('history.hide_producer_rewards') : t('history.show_producer_rewards')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-dark-900/40">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-3 mt-8">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-75">{t('history.loading')}</span>
                        </div>
                    ) : loadError ? (
                        <div className="p-4 text-center text-red-300 text-xs bg-red-950/20 m-4 rounded-xl border border-red-500/20">
                            {loadError}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="p-12 text-center text-slate-600 font-bold text-sm bg-dark-900/50 m-4 rounded-xl border border-dark-800 border-dashed">
                            {t('history.empty')}
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <div className="p-12 text-center text-slate-600 font-bold text-sm bg-dark-900/50 m-4 rounded-xl border border-dark-800 border-dashed">
                            {t('history.empty')}
                        </div>
                    ) : (
                        <div className="divide-y divide-dark-800/50">
                            {filteredHistory.map((item, idx) => {
                                const isIncoming = incomingTypes.includes(item.type);
                                const amountSign = item.amount ? (isIncoming ? '+' : '-') : '';
                                return (
                                <div key={idx} className="p-4 hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-wider ${getTypeBadgeClass(item.type)}`}>
                                            {getHistoryTypeLabel(item)}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-600 group-hover:text-slate-500 transition-colors">
                                            {new Date(item.date).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-xs text-slate-400 font-medium">
                                            {isIncoming ? (
                                                <>{t('history.from')} <span className="text-slate-200 font-bold hover:text-blue-400 cursor-pointer transition-colors">@{item.from}</span></>
                                            ) : (
                                                <>{t('history.to')} <span className="text-slate-200 font-bold hover:text-blue-400 cursor-pointer transition-colors">@{item.to}</span></>
                                            )}
                                        </div>
                                        <div className={`font-mono font-black text-sm tracking-tight ${isIncoming ? 'text-green-400' : 'text-red-400'}`}>
                                            {amountSign}{item.amount}
                                        </div>
                                    </div>
                                    {item.memo && (
                                        <div className="text-[11px] text-slate-400 bg-dark-800 p-2.5 rounded-lg border border-dark-700/50 break-all font-medium leading-relaxed shadow-inner">
                                            <span className="opacity-75">{item.memo}</span>
                                        </div>
                                    )}
                                </div>
                            )})}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
