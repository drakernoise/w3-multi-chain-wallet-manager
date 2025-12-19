import React, { useState, useEffect } from 'react';
import { Account, Chain } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { broadcastSavingsDeposit, broadcastSavingsWithdraw } from '../services/chainService';

interface SavingsModalProps {
    account: Account;
    type: 'deposit' | 'withdraw';
    onClose: () => void;
    onSuccess: () => void;
}

export const SavingsModal: React.FC<SavingsModalProps> = ({ account, type, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Prevent background scrolling
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const getStablecoinSymbol = () => {
        if (account.chain === Chain.HIVE) return 'HBD';
        if (account.chain === Chain.STEEM) return 'SBD';
        return '';
    };

    const getAvailableBalance = () => {
        return account.secondaryBalance || 0;
    };

    const handleMaxClick = () => {
        setAmount(getAvailableBalance().toFixed(3));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (account.chain === Chain.BLURT) {
            setError(t('savings.blurt_not_supported'));
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError(t('savings.invalid_amount'));
            return;
        }

        if (!account.activeKey) {
            setError(t('savings.active_key_required'));
            return;
        }

        setProcessing(true);
        setError('');

        try {
            const stablecoin = getStablecoinSymbol();
            const formattedAmount = `${parseFloat(amount).toFixed(3)} ${stablecoin}`;

            let response;
            if (type === 'deposit') {
                response = await broadcastSavingsDeposit(account.chain, account.name, account.activeKey, formattedAmount);
            } else {
                const requestId = Date.now();
                response = await broadcastSavingsWithdraw(account.chain, account.name, account.activeKey, formattedAmount, requestId);
            }

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                setError(response.error || t('savings.operation_failed'));
            }
        } catch (err: any) {
            setError(err.message || t('savings.operation_failed'));
        } finally {
            setProcessing(false);
        }
    };

    if (account.chain === Chain.BLURT) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('savings.not_available')}</h3>
                        <p className="text-slate-400 mb-6">{t('savings.blurt_not_supported')}</p>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-dark-700 shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">
                            {type === 'deposit' ? t('savings.deposit_title') : t('savings.withdraw_title')}
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
                        {type === 'deposit'
                            ? t('savings.deposit_desc').replace('{token}', getStablecoinSymbol())
                            : t('savings.withdraw_desc').replace('{token}', getStablecoinSymbol())
                        }
                    </p>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Account Info */}
                        <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-700">
                            <div className="text-xs text-slate-400 mb-1">{t('savings.account')}</div>
                            <div className="text-white font-bold">@{account.name}</div>
                            <div className="text-xs text-slate-400 mt-1">{account.chain}</div>
                            <div className="mt-3 pt-3 border-t border-dark-700">
                                <div
                                    className="flex justify-between items-center cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
                                    onClick={handleMaxClick}
                                    title="Click to use max balance"
                                >
                                    <span className="text-[10px] text-slate-500 uppercase">{t('wallet.balance')}</span>
                                    <span className="text-sm font-bold text-blue-400">{getAvailableBalance().toFixed(3)} {getStablecoinSymbol()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                {t('savings.amount').replace('{token}', getStablecoinSymbol())}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.001"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none pr-16"
                                    placeholder="0.000"
                                    required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                    {getStablecoinSymbol()}
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-300 leading-tight">
                                    {type === 'deposit'
                                        ? t('savings.deposit_info')
                                        : t('savings.withdraw_info')
                                    }
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
                                {t('savings.success')}
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
                                {processing ? t('common.processing') : t('common.confirm')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
