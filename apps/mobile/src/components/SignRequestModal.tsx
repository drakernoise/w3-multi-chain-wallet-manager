import React, { useMemo, useState } from 'react';
import { SignRequest } from '../services/mobileProvider';
import { useTranslation } from 'gravity-shared/contexts/LanguageContext';
import { Account, Chain } from '@types';

interface SignRequestModalProps {
    request: SignRequest;
    accounts: Account[];
    suggestedAccount: Account | null;
    suggestedChain: Chain | null;
    onApprove: (requestId: string, rememberDuration?: '1day' | '1week' | '1month', selectedAccount?: Account) => void;
    onReject: (requestId: string) => void;
}

export const SignRequestModal: React.FC<SignRequestModalProps> = ({ request, accounts, suggestedAccount, suggestedChain, onApprove, onReject }) => {
    const { t } = useTranslation();
    const [rememberPermission, setRememberPermission] = useState(false);
    const [duration, setDuration] = useState<'1day' | '1week' | '1month'>('1day');
    const getDomainDisplay = () => {
        try {
            return new URL(request.domain).hostname;
        } catch {
            return request.domain;
        }
    };

    const getOperationDisplay = () => {
        const operations: Record<string, string> = {
            'transfer': t('mobile.operation_transfer') || 'Transfer',
            'vote': t('mobile.operation_vote') || 'Vote',
            'post': t('mobile.operation_post') || 'Post',
            'comment': t('mobile.operation_comment') || 'Comment',
            'delegate': t('mobile.operation_delegate') || 'Delegate',
            'powerup': t('mobile.operation_powerup') || 'Power Up',
            'powerdown': t('mobile.operation_powerdown') || 'Power Down'
        };
        return operations[request.operation] || request.operation;
    };

    const availableAccounts = useMemo(() => {
        const exactChain = suggestedChain
            ? accounts.filter((account) => account.chain === suggestedChain)
            : [];
        return exactChain.length > 0 ? exactChain : accounts;
    }, [accounts, suggestedChain]);

    const selectedAccount = useMemo(
        () => {
            if (suggestedAccount) {
                const exactSuggested = availableAccounts.find(
                    (account) => account.name === suggestedAccount.name && account.chain === suggestedAccount.chain
                );
                if (exactSuggested) return exactSuggested;
            }

            return availableAccounts[0] || null;
        },
        [availableAccounts, suggestedAccount]
    );

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-dark-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{t('mobile.sign_request') || 'Sign Request'}</h2>
                            <p className="text-sm text-slate-400">{getDomainDisplay()}</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Operation Details */}
                    <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-700">
                        <div className="text-xs text-slate-400 mb-2">{t('mobile.operation') || 'Operation'}</div>
                        <div className="text-lg font-bold text-white">{getOperationDisplay()}</div>
                    </div>

                    <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-700">
                        <div className="text-xs text-slate-400 mb-3">{t('mobile.account') || 'Account'}</div>
                        <div className="rounded-xl border border-dark-600 bg-dark-800 px-4 py-3">
                            <div className="text-base font-semibold text-white">
                                {selectedAccount ? `@${selectedAccount.name}` : (t('mobile.no_account_detected') || 'No account detected')}
                            </div>
                            {selectedAccount && (
                                <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                    {selectedAccount.chain}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Parameters */}
                    <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-700">
                        <div className="text-xs text-slate-400 mb-3">{t('mobile.details') || 'Details'}</div>
                        <div className="space-y-2 text-sm">
                            {Object.entries(request.params).map(([key, value]) => {
                                if (key === 'domain' || key === 'operation' || key === 'callback') return null;
                                return (
                                    <div key={key} className="flex justify-between">
                                        <span className="text-slate-400 capitalize">{key}:</span>
                                        <span className="text-white font-medium">{String(value)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Remember Permission */}
                    <div className="bg-blue-900/10 border border-blue-500/30 rounded-lg p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberPermission}
                                onChange={(e) => setRememberPermission(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-blue-500 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                                <div className="text-sm font-medium text-white mb-1">
                                    {t('mobile.remember_permission') || 'Remember this permission'}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {t('mobile.remember_permission_desc') || 'Auto-approve future requests from this site'}
                                </div>
                            </div>
                        </label>

                        {rememberPermission && (
                            <div className="mt-3 pt-3 border-t border-blue-500/20">
                                <div className="text-xs text-slate-400 mb-2">{t('mobile.duration') || 'Duration'}</div>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['1day', '1week', '1month'] as const).map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => setDuration(d)}
                                            className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${duration === d
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-dark-700 text-slate-400 hover:bg-dark-600'
                                                }`}
                                        >
                                            {d === '1day' && (t('mobile.1day') || '1 Day')}
                                            {d === '1week' && (t('mobile.1week') || '1 Week')}
                                            {d === '1month' && (t('mobile.1month') || '1 Month')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                        <div className="flex gap-2">
                            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs text-yellow-300">
                                {t('mobile.sign_warning') || 'Only approve if you trust this site. This action cannot be undone.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-dark-700 flex gap-3">
                    <button
                        onClick={() => onReject(request.id)}
                        className="flex-1 bg-dark-700 hover:bg-dark-600 text-white font-bold py-4 rounded-xl transition-colors"
                    >
                        {t('common.reject') || 'Reject'}
                    </button>
                    <button
                        onClick={() => onApprove(request.id, rememberPermission ? duration : undefined, selectedAccount || undefined)}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors"
                    >
                        {t('common.approve') || 'Approve'}
                    </button>
                </div>
            </div>
        </div>
    );
};
