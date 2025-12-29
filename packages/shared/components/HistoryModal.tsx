import React, { useEffect, useState } from 'react';
import { Account } from '../types';
import { fetchAccountHistory, HistoryItem } from '../services/chainService';
import { useTranslation } from '../contexts/LanguageContext';

interface HistoryModalProps {
    account: Account;
    onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ account, onClose }) => {
    const { t } = useTranslation();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'received' | 'sent' | 'powerup' | 'powerdown'>('all');

    useEffect(() => {
        setLoading(true);
        fetchAccountHistory(account.chain, account.name)
            .then(data => setHistory(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [account]);

    const filteredHistory = history.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'received') return item.type === 'receive';
        if (filter === 'sent') return item.type === 'send';
        if (filter === 'powerup') return item.type === 'powerup_in' || item.type === 'powerup_out';
        if (filter === 'powerdown') return item.type === 'powerdown';
        return true;
    });

    const getTypeBadgeClass = (type: string) => {
        switch (type) {
            case 'receive':
            case 'powerup_in':
                return 'bg-green-500/10 text-green-400';
            case 'send':
            case 'powerup_out':
            case 'powerdown':
                return 'bg-red-500/10 text-red-400';
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
            default: return type;
        }
    };

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
                // Power Up Icon (Direct Match)
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                );
            case 'powerdown':
                // Power Down Icon (Composite: Bolt + X, Direct Match)
                return (
                    <div className="relative w-5 h-5 flex items-center justify-center">
                        <svg className="w-5 h-5 absolute inset-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <svg className="w-3 h-3 text-red-500 absolute top-0 right-0 bg-dark-800 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
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
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-700 text-slate-400 hover:text-white transition-colors">
                            &times;
                        </button>
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
                            {['all', 'received', 'sent', 'powerup', 'powerdown'].map((f) => (
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
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-dark-900/40">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-3 mt-8">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-75">{t('history.loading')}</span>
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
                            {filteredHistory.map((item, idx) => (
                                <div key={idx} className="p-4 hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-wider ${getTypeBadgeClass(item.type)}`}>
                                            {getTypeLabel(item.type)}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-600 group-hover:text-slate-500 transition-colors">
                                            {new Date(item.date).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-xs text-slate-400 font-medium">
                                            {item.type === 'receive' || item.type === 'powerup_in' ? (
                                                <>{t('history.from')} <span className="text-slate-200 font-bold hover:text-blue-400 cursor-pointer transition-colors">@{item.from}</span></>
                                            ) : (
                                                <>{t('history.to')} <span className="text-slate-200 font-bold hover:text-blue-400 cursor-pointer transition-colors">@{item.to}</span></>
                                            )}
                                        </div>
                                        <div className={`font-mono font-black text-sm tracking-tight ${item.type === 'receive' || item.type === 'powerup_in' ? 'text-green-400' : 'text-red-400'}`}>
                                            {item.type === 'receive' || item.type === 'powerup_in' ? '+' : '-'}{item.amount}
                                        </div>
                                    </div>
                                    {item.memo && (
                                        <div className="text-[11px] text-slate-400 bg-dark-800 p-2.5 rounded-lg border border-dark-700/50 break-all font-medium leading-relaxed shadow-inner">
                                            <span className="opacity-75">{item.memo}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
