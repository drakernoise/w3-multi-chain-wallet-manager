import React, { useState, useEffect } from 'react';
import { Account, Chain } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { broadcastRCDelegate, broadcastRCUndelegate, fetchAccountData } from '../services/chainService';

interface RCModalProps {
    account: Account;
    type: 'delegate' | 'undelegate';
    onClose: () => void;
    onSuccess: () => void;
}

export const RCModal: React.FC<RCModalProps> = ({ account, type, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [delegatee, setDelegatee] = useState('');
    const [amountHP, setAmountHP] = useState('');
    const [processing, setProcessing] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [recentRecipients, setRecentRecipients] = useState<string[]>([]);
    const [showRecent, setShowRecent] = useState(false);

    // Prevent background scrolling and load history
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        chrome.storage?.local.get(['recentRecipients'], (result: { recentRecipients?: string[] }) => {
            if (result.recentRecipients) setRecentRecipients(result.recentRecipients);
        });

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (account.chain !== Chain.HIVE) {
            setError(t('rc.hive_only'));
            return;
        }

        const cleanDelegatee = delegatee.trim().replace('@', '').toLowerCase();
        if (!cleanDelegatee) {
            setError(t('rc.invalid_delegatee'));
            return;
        }

        if (type === 'delegate' && (!amountHP || parseFloat(amountHP) <= 0)) {
            setError(t('rc.invalid_amount'));
            return;
        }

        if (!account.activeKey) {
            setError(t('rc.active_key_required'));
            return;
        }

        setProcessing(true);
        setIsValidating(true);
        setError('');

        try {
            // 1. Validate Account
            const accData = await fetchAccountData(account.chain, cleanDelegatee);
            if (!accData) {
                setError(t('common.account_not_found') || "Account not found");
                setProcessing(false);
                setIsValidating(false);
                return;
            }
            setIsValidating(false);

            // 2. Perform operation
            let response;
            if (type === 'delegate') {
                response = await broadcastRCDelegate(account.chain, account.name, account.activeKey, cleanDelegatee, parseFloat(amountHP));
            } else {
                response = await broadcastRCUndelegate(account.chain, account.name, account.activeKey, cleanDelegatee);
            }

            if (response.success) {
                saveRecipient(cleanDelegatee);
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                setError(response.error || t('rc.operation_failed'));
            }
        } catch (err: any) {
            setError(err.message || t('rc.operation_failed'));
        } finally {
            setProcessing(false);
            setIsValidating(false);
        }
    };

    const saveRecipient = (name: string) => {
        chrome.storage?.local.get(['recentRecipients'], (result: { recentRecipients?: string[] }) => {
            const list = result.recentRecipients || [];
            if (!list.includes(name)) {
                const newList = [name, ...list].slice(0, 10);
                chrome.storage.local.set({ recentRecipients: newList });
            }
        });
    };

    if (account.chain !== Chain.HIVE) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('rc.not_available')}</h3>
                        <p className="text-slate-400 mb-6">{t('rc.hive_only')}</p>
                        <button
                            onClick={onClose}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            {t('common.close')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-dark-700 shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">
                            {type === 'delegate' ? t('rc.delegate_title') : t('rc.undelegate_title')}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                        {type === 'delegate' ? t('rc.delegate_desc') : t('rc.undelegate_desc')}
                    </p>
                </div>

                {/* Body with auto scroll */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Account Info */}
                        <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-700">
                            <div className="text-xs text-slate-400 mb-1">{t('rc.from_account')}</div>
                            <div className="text-white font-bold">@{account.name}</div>
                            <div className="text-xs text-slate-400 mt-1">Hive</div>
                            {account.stakedBalance !== undefined && (
                                <div className="mt-2 pt-2 border-t border-dark-700 flex justify-between">
                                    <span className="text-[10px] text-slate-500 uppercase">Hive Power</span>
                                    <span className="text-[10px] text-blue-400 font-bold">{account.stakedBalance.toFixed(3)} HP</span>
                                </div>
                            )}
                        </div>

                        {/* Delegatee */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                {t('rc.delegatee')}
                            </label>
                            <input
                                type="text"
                                value={delegatee}
                                onChange={(e) => setDelegatee(e.target.value)}
                                onFocus={() => setShowRecent(true)}
                                onBlur={() => setTimeout(() => setShowRecent(false), 200)}
                                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                placeholder={t('rc.delegatee_placeholder')}
                                required
                            />
                            {showRecent && recentRecipients.length > 0 && !delegatee && (
                                <div className="absolute z-10 w-full mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden">
                                    <div className="text-[10px] text-slate-500 font-bold px-3 py-2 border-b border-dark-700 uppercase">
                                        {t('common.recent_recipients') || "Recent Recipients"}
                                    </div>
                                    {recentRecipients.map(name => (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => setDelegatee(name)}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white transition-colors"
                                        >
                                            @{name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Amount HP (only for delegation) */}
                        {type === 'delegate' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    {t('rc.max_rc')}
                                </label>
                                <input
                                    type="number"
                                    value={amountHP}
                                    onChange={(e) => setAmountHP(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="10.000"
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-2">
                                    {t('rc.max_rc_hint')}
                                </p>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-300 leading-tight">
                                    {type === 'delegate' ? t('rc.delegate_info') : t('rc.undelegate_info')}
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
                                {t('rc.success')}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing || success}
                            >
                                {processing ? (isValidating ? "Validating..." : t('common.processing')) : t('common.confirm')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
