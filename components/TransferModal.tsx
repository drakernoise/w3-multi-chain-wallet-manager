import React, { useState } from 'react';
import { Account } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface TransferModalProps {
    account: Account;
    accounts: Account[]; // All accounts to allow switching
    onClose: () => void;
    onTransfer: (from: Account, to: string, amount: string, memo: string, symbol?: string) => Promise<void>;
    disableAccountSelection?: boolean;
}

import { fetchAccountData } from '../services/chainService';

export const TransferModal: React.FC<TransferModalProps> = ({ account: initialAccount, accounts, onClose, onTransfer, disableAccountSelection }) => {
    const { t } = useTranslation();
    // Allow switching sending account
    const [selectedAccount, setSelectedAccount] = useState<Account>(initialAccount);

    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');
    const [currency, setCurrency] = useState<string>(
        initialAccount.chain === 'HIVE' ? 'HIVE' : initialAccount.chain === 'STEEM' ? 'STEEM' : 'BLURT'
    );
    const [isSending, setIsSending] = useState(false);

    // Reset currency when chain changes
    React.useEffect(() => {
        const c = selectedAccount.chain;
        if (c === 'HIVE') setCurrency('HIVE');
        else if (c === 'STEEM') setCurrency('STEEM');
        else setCurrency('BLURT');
    }, [selectedAccount.chain]);

    const [error, setError] = useState<string | null>(null);

    // Validation State
    const [isValidRecipient, setIsValidRecipient] = useState<boolean | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    // Debounced Validation
    React.useEffect(() => {
        setError(null); // Clear error on input change
        const check = async () => {
            if (!to || to.length < 3) {
                setIsValidRecipient(null);
                setIsValidating(false);
                return;
            }
            setIsValidating(true);
            try {
                const data = await fetchAccountData(selectedAccount.chain, to.replace(/^@/, ''));
                setIsValidRecipient(!!data);
            } catch {
                setIsValidRecipient(false);
            } finally {
                setIsValidating(false);
            }
        };
        const timer = setTimeout(check, 500);
        return () => clearTimeout(timer);
    }, [to, selectedAccount.chain]);

    // Clear error on amount change
    React.useEffect(() => {
        if (error) setError(null);
    }, [amount]);

    // Filter accounts to only show those of the same chain as the currently selected one?
    // Or allow switching chain too? Let's allow switching chain by selecting different account.

    const hasActiveKey = !!selectedAccount.activeKey;

    const [step, setStep] = useState<'input' | 'review'>('input');

    const handleReview = () => {
        setError(null);
        if (!to) {
            setError(t('validation.required'));
            return;
        }
        if (isValidRecipient === false) {
            // Inline error is already shown, but let's reinforce or just return
            return;
        }

        const val = parseFloat(amount);
        if (!amount || isNaN(val) || val <= 0) {
            setError(t('validation.invalid_amount'));
            return;
        }

        setStep('review');
    };

    const handleConfirm = async () => {
        setIsSending(true);
        await onTransfer(selectedAccount, to, amount, memo, currency);
        setIsSending(false);
        onClose();
    };

    if (step === 'review') {
        // ... review render (unchanged)
        return (
            <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <div className="bg-dark-900 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col animate-fadeIn">
                    <h2 className="text-xl font-bold text-white mb-4">{t('transfer.review_title')}</h2>

                    <div className="bg-dark-950 p-4 rounded-lg border border-dark-700 space-y-4 mb-6">
                        <div className="flex justify-between items-center border-b border-dark-800 pb-2">
                            <span className="text-xs text-slate-500 uppercase font-bold">{t('sign.from')}</span>
                            <span className="text-sm font-bold text-white">@{selectedAccount.name}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-dark-800 pb-2">
                            <span className="text-xs text-slate-500 uppercase font-bold">{t('sign.to')}</span>
                            <span className="text-sm font-bold text-white">@{to}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-dark-800 pb-2">
                            <span className="text-xs text-slate-500 uppercase font-bold">{t('bulk.amount')}</span>
                            <span className="text-lg font-bold text-blue-400">{amount} {currency}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-bold block mb-1">{t('bulk.memo')}</span>
                            <div className="text-xs text-slate-300 italic bg-dark-900 p-2 rounded break-all max-h-20 overflow-y-auto">
                                {memo || t('transfer.no_memo')}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep('input')}
                            disabled={isSending}
                            className="flex-1 py-3 rounded-lg font-bold bg-dark-800 text-slate-400 hover:bg-dark-700 transition-colors"
                        >
                            {t('transfer.back')}
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isSending}
                            className="flex-1 py-3 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg flex justify-center items-center gap-2"
                        >
                            {isSending ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : t('wallet.send')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Input Step handles... (rest of the component)


    // Input Step
    return (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {t('wallet.send')} {selectedAccount.chain}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="p-3 bg-dark-900 rounded-lg border border-dark-700">
                        <label className="text-xs text-slate-500 block mb-1">{t('sign.from')}</label>
                        {disableAccountSelection ? (
                            <div className="w-full bg-dark-800 text-slate-400 border border-dark-600 rounded p-2 text-sm font-bold flex items-center gap-2 cursor-not-allowed">
                                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                                @{selectedAccount.name}
                            </div>
                        ) : (
                            <select
                                value={`${selectedAccount.chain}-${selectedAccount.name}`}
                                onChange={(e) => {
                                    const [c, n] = e.target.value.split('-');
                                    const acc = accounts.find(a => a.chain === c && a.name === n);
                                    if (acc) setSelectedAccount(acc);
                                }}
                                className="w-full bg-dark-800 text-white border border-dark-600 rounded p-2 text-sm outline-none focus:border-blue-500"
                            >
                                {accounts.map(a => (
                                    <option key={`${a.chain}-${a.name}`} value={`${a.chain}-${a.name}`}>
                                        @{a.name} ({a.chain})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {!hasActiveKey && (
                        <div className="bg-red-900/20 text-red-400 p-2 rounded text-xs text-center border border-red-500/30">
                            {t('sign.keys_missing')}
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between">
                            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">{t('sign.to')}</label>
                            {isValidating && <span className="text-[10px] text-blue-400 animate-pulse">{t('bulk.checking')}</span>}
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-500">@</span>
                            <input
                                value={to}
                                onChange={(e) => {
                                    const val = e.target.value.toLowerCase().replace(/[@\s\u200B-\u200D\uFEFF]/g, '');
                                    setTo(val);
                                }}
                                className={`w-full bg-dark-900 border rounded-lg py-2 pl-7 pr-8 text-sm outline-none transition-colors ${isValidRecipient === false ? 'border-red-500/50 focus:border-red-500' :
                                    isValidRecipient === true ? 'border-green-500/50 focus:border-green-500' :
                                        'border-dark-600 focus:border-blue-500'
                                    }`}
                                placeholder={t('import.placeholder_username')}
                            />
                            <div className="absolute right-3 top-2.5 text-xs">
                                {isValidRecipient === true && <span className="text-green-400">✓</span>}
                                {isValidRecipient === false && <span className="text-red-400 font-bold">✕</span>}
                            </div>
                        </div>
                        {isValidRecipient === false && <p className="text-[10px] text-red-400 mt-1">{t('validation.account_not_found').replace('{chain}', selectedAccount.chain)}</p>}
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">{t('bulk.amount')}</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg py-2 pl-3 pr-20 text-sm focus:border-blue-500 outline-none"
                                placeholder="0.000"
                            />
                            <div className="absolute right-1 top-1 bottom-1 flex items-center">
                                {(selectedAccount.chain === 'HIVE' || selectedAccount.chain === 'STEEM') ? (
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="h-full bg-dark-800 text-xs font-bold text-white border-l border-dark-600 rounded-r-lg px-2 outline-none cursor-pointer hover:bg-dark-700"
                                    >
                                        {selectedAccount.chain === 'HIVE' ? (
                                            <>
                                                <option value="HIVE">HIVE</option>
                                                <option value="HBD">HBD</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="STEEM">STEEM</option>
                                                <option value="SBD">SBD</option>
                                            </>
                                        )}
                                    </select>
                                ) : (
                                    <span className="px-3 text-xs font-bold text-slate-500">{selectedAccount.chain}</span>
                                )}
                            </div>
                        </div>
                        {(() => {
                            const bal = (currency === 'HBD' || currency === 'SBD') ? selectedAccount.secondaryBalance : selectedAccount.balance;
                            if (bal !== undefined) {
                                return (
                                    <p className="text-[10px] text-slate-500 mt-1 text-right">
                                        {t('transfer.available')} <span className="font-bold text-white">{bal.toFixed(3)} {currency}</span>
                                    </p>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">{t('bulk.memo')} {t('transfer.optional')}</label>
                        <input
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg py-2 px-3 text-sm focus:border-blue-500 outline-none"
                            placeholder={t('transfer.memo_placeholder')}
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-red-400 text-xs text-center font-bold mb-3 animate-pulse bg-red-900/20 p-2 rounded border border-red-500/30">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleReview}
                    disabled={isSending || !to || !amount || !hasActiveKey}
                    className="w-full py-3 h-auto min-h-[48px] rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 whitespace-normal leading-tight"
                >
                    {isSending ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            {t('bulk.sign_broadcast')}...
                        </>
                    ) : (
                        t('transfer.review_btn')
                    )}
                </button>
            </div>
        </div>
    );
};
