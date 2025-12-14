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

    useEffect(() => {
        setLoading(true);
        fetchAccountHistory(account.chain, account.name)
            .then(data => setHistory(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [account]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col border border-dark-700 shadow-2xl">
                <div className="p-4 border-b border-dark-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">{t('history.title').replace('{user}', account.name)}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-dark-900/50">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-slate-600 border-t-white rounded-full animate-spin"></div>
                            <span>{t('history.loading')}</span>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">{t('history.empty')}</div>
                    ) : (
                        <div className="divide-y divide-dark-700">
                            {history.map((item, idx) => (
                                <div key={idx} className="p-3 hover:bg-dark-700/50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${item.type === 'receive' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {item.type === 'receive' ? t('history.received') : t('history.sent')}
                                        </span>
                                        <span className="text-[10px] text-slate-500">{new Date(item.date).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="text-xs text-slate-300">
                                            {item.type === 'receive' ? (
                                                <>{t('history.from')} <span className="text-white font-bold hover:text-blue-400 cursor-pointer">@{item.from}</span></>
                                            ) : (
                                                <>{t('history.to')} <span className="text-white font-bold hover:text-blue-400 cursor-pointer">@{item.to}</span></>
                                            )}
                                        </div>
                                        <div className={`font-mono font-bold text-sm ${item.type === 'receive' ? 'text-green-400' : 'text-red-400'}`}>
                                            {item.type === 'receive' ? '+' : '-'}{item.amount}
                                        </div>
                                    </div>
                                    {item.memo && (
                                        <div className="text-[10px] text-slate-400 italic bg-dark-900/50 p-1.5 rounded border border-dark-700/50 break-all">
                                            {item.memo}
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
