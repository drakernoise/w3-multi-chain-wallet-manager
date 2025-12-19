import React, { useState, useEffect } from 'react';
import { Account, Chain } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { broadcastPowerUp, broadcastPowerDown, broadcastDelegation } from '../services/chainService';

interface PowerModalProps {
    account: Account;
    type: 'powerup' | 'powerdown' | 'delegate';
    onClose: () => void;
    onSuccess: () => void;
}

export const PowerModal: React.FC<PowerModalProps> = ({ account, type, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState(account.name); // For power up
    const [delegatee, setDelegatee] = useState(''); // For delegation
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isStoppingPowerDown, setIsStoppingPowerDown] = useState(false); // For stop power down mode
    const [recentRecipients, setRecentRecipients] = useState<string[]>([]);
    const [showRecent, setShowRecent] = useState<'recipient' | 'delegatee' | null>(null);

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

    const getTokenSymbol = () => {
        if (account.chain === Chain.HIVE) return 'HIVE';
        if (account.chain === Chain.STEEM) return 'STEEM';
        return 'BLURT';
    };

    const getPowerSymbol = () => {
        if (account.chain === Chain.HIVE) return 'HP';
        if (account.chain === Chain.STEEM) return 'SP';
        return 'BP';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Skip amount validation if we're stopping power down
        if (!isStoppingPowerDown && (!amount || parseFloat(amount) <= 0)) {
            setError(t('power.invalid_amount'));
            return;
        }

        if (type === 'delegate' && !delegatee.trim()) {
            setError(t('power.invalid_recipient'));
            return;
        }

        if (!account.activeKey) {
            setError(t('power.active_key_required'));
            return;
        }

        setProcessing(true);
        setError('');

        try {
            let response;
            const tokenSymbol = getTokenSymbol();

            if (type === 'powerup') {
                const formattedAmount = `${parseFloat(amount).toFixed(3)} ${tokenSymbol}`;
                response = await broadcastPowerUp(account.chain, account.name, account.activeKey, recipient, formattedAmount);
            } else if (type === 'powerdown') {
                if (isStoppingPowerDown) {
                    response = await broadcastPowerDown(account.chain, account.name, account.activeKey, 0);
                } else {
                    response = await broadcastPowerDown(account.chain, account.name, account.activeKey, parseFloat(amount));
                }
            } else {
                response = await broadcastDelegation(account.chain, account.name, account.activeKey, delegatee, parseFloat(amount));
            }

            if (response.success) {
                // Save recipient to history
                if (type === 'powerup' && recipient !== account.name) saveRecipient(recipient);
                if (type === 'delegate') saveRecipient(delegatee);

                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                setError(response.error || t('power.operation_failed'));
            }
        } catch (err: any) {
            setError(err.message || t('power.operation_failed'));
        } finally {
            setProcessing(false);
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

    const handleStopPowerDown = () => {
        // Set the mode to stopping and trigger submit
        setIsStoppingPowerDown(true);
        setError('');
        // The form will be submitted automatically
    };

    const getTitle = () => {
        if (type === 'powerup') return t('power.powerup_title');
        if (type === 'powerdown') return t('power.powerdown_title');
        return t('power.delegate_title');
    };

    const getDescription = () => {
        if (type === 'powerup') return t('power.powerup_desc').replace('{token}', getTokenSymbol()).replace('{power}', getPowerSymbol());
        if (type === 'powerdown') return t('power.powerdown_desc').replace('{power}', getPowerSymbol());
        return t('power.delegate_desc').replace('{power}', getPowerSymbol());
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-dark-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">{getDescription()}</p>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Account Info */}
                    <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-700">
                        <div className="text-xs text-slate-400 mb-1">{t('power.from_account')}</div>
                        <div className="text-white font-bold">@{account.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{account.chain}</div>
                        {account.stakedBalance !== undefined && (
                            <div className="mt-3 pt-3 border-t border-dark-700">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400">{t('power.available_power').replace('{power}', getPowerSymbol())}</span>
                                    <span className="text-sm font-bold text-blue-400">{account.stakedBalance.toFixed(3)} {getPowerSymbol()}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recipient (for Power Up) */}
                    {type === 'powerup' && (
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                {t('power.recipient')}
                            </label>
                            <input
                                type="text"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value.replace('@', ''))}
                                onFocus={() => setShowRecent('recipient')}
                                onBlur={() => setTimeout(() => setShowRecent(null), 200)}
                                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                placeholder={t('power.recipient_placeholder')}
                            />
                            {showRecent === 'recipient' && recentRecipients.length > 0 && !recipient && (
                                <div className="absolute z-10 w-full mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden">
                                    <div className="text-[10px] text-slate-500 font-bold px-3 py-2 border-b border-dark-700 uppercase">
                                        {t('common.recent_recipients') || "Recent Recipients"}
                                    </div>
                                    {recentRecipients.map(name => (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => setRecipient(name)}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white transition-colors"
                                        >
                                            @{name}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-slate-400 mt-1">{t('power.recipient_hint')}</p>
                        </div>
                    )}

                    {/* Delegatee (for Delegation) */}
                    {type === 'delegate' && (
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                {t('power.delegatee')}
                            </label>
                            <input
                                type="text"
                                value={delegatee}
                                onChange={(e) => setDelegatee(e.target.value.replace('@', ''))}
                                onFocus={() => setShowRecent('delegatee')}
                                onBlur={() => setTimeout(() => setShowRecent(null), 200)}
                                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                placeholder={t('power.delegatee_placeholder')}
                                required
                            />
                            {showRecent === 'delegatee' && recentRecipients.length > 0 && !delegatee && (
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
                    )}

                    {/* Amount - Hidden when stopping power down */}
                    {!isStoppingPowerDown && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                {type === 'powerup'
                                    ? t('power.amount_token').replace('{token}', getTokenSymbol())
                                    : t('power.amount_vests').replace('{power}', getPowerSymbol())}
                            </label>
                            <input
                                type="number"
                                step="0.001"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                placeholder="0.000"
                                required
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                {type === 'powerup'
                                    ? t('power.powerup_hint').replace('{token}', getTokenSymbol()).replace('{power}', getPowerSymbol())
                                    : type === 'powerdown'
                                        ? t('power.powerdown_hint').replace('{power}', getPowerSymbol())
                                        : t('power.delegate_hint').replace('{power}', getPowerSymbol())
                                }
                            </p>
                        </div>
                    )}

                    {/* Stop Power Down Warning */}
                    {isStoppingPowerDown && type === 'powerdown' && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div className="text-sm text-yellow-300">
                                    {t('power.stop_powerdown_warning')}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
                            {t('power.success')}
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
                        {type === 'powerdown' && !isStoppingPowerDown && (
                            <button
                                type="button"
                                onClick={handleStopPowerDown}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing || success}
                            >
                                {t('power.stop_powerdown')}
                            </button>
                        )}
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
    );
};
