import React, { useState, useEffect } from 'react';
import { Chain, Account, BulkItem } from '../types';
import { fetchAccountData, broadcastBulkTransfer } from '../services/chainService';
import { ConfirmationModal } from './ConfirmationModal';
import { useTranslation } from '../contexts/LanguageContext';

interface BulkTransferFormProps {
    chain: Chain;
    account: Account;
    mode: 'single' | 'multi';
    onClose: () => void;
    onSuccess: () => void;
}

export const BulkTransferForm: React.FC<BulkTransferFormProps> = ({ chain, account, mode, onClose, onSuccess }) => {
    const { t } = useTranslation();

    // Form States
    const [singleAmount, setSingleAmount] = useState<number | string>(0);
    const [singleMemo, setSingleMemo] = useState<string>('');
    const [recipientsText, setRecipientsText] = useState<string>('');

    // Token State
    const [selectedToken, setSelectedToken] = useState<string>(
        chain === Chain.HIVE ? 'HIVE' : chain === Chain.STEEM ? 'STEEM' : 'BLURT'
    );

    // Sync token on chain change (though chain shouldn't change in modal context, good for safety)
    useEffect(() => {
        if (chain === Chain.HIVE) setSelectedToken('HIVE');
        else if (chain === Chain.STEEM) setSelectedToken('STEEM');
        else setSelectedToken('BLURT');
    }, [chain]);

    // Multi Mode State
    const [items, setItems] = useState<BulkItem[]>([{ to: '', amount: 0, memo: '' }]);

    const [validationStatus, setValidationStatus] = useState<{ valid: string[], invalid: string[], checking: boolean }>({ valid: [], invalid: [], checking: false });

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, message: React.ReactNode, title: string, type: 'info' | 'warning' | 'error' | 'success' } | null>(null);
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    // Calculate total amount
    const totalAmount = mode === 'single'
        ? (Number(singleAmount) * recipientsText.split(/[\s,]+/).filter(s => s).length)
        : items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    // Count recipients
    const recipientCount = mode === 'single'
        ? recipientsText.split(/[\s,]+/).filter(s => s.trim()).length
        : items.filter(i => i.to).length;

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                if (mode === 'single') {
                    // For single mode, just extract usernames
                    const names = text.split(/[\s,]+/).map(s => s.trim()).filter(s => s);
                    setRecipientsText(names.join(', '));
                } else {
                    // For multi mode, try to parse full rows
                    const lines = text.split(/\r?\n/);
                    const newItems: BulkItem[] = [];
                    lines.forEach(line => {
                        const parts = line.trim().split(/[\s,]+/);
                        if (parts.length >= 2) {
                            newItems.push({
                                to: parts[0],
                                amount: parseFloat(parts[1]) || 0,
                                memo: parts.slice(2).join(' ')
                            });
                        }
                    });
                    if (newItems.length > 0) {
                        setItems(newItems);
                        setToast({ msg: t('import.bulk_summary').replace('{count}', String(newItems.length)), type: 'success' });
                    } else {
                        setToast({ msg: t('import.no_valid_accounts'), type: 'error' });
                    }
                }
            };
            reader.readAsText(file);
        }
    };

    const [toast, setToast] = useState<{ msg: string, type: 'error' | 'success' | 'warning' } | null>(null);

    // Auto-Verify with Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            const hasData = mode === 'single'
                ? recipientsText.trim().length > 0
                : items.some(i => i.to.trim().length > 0);

            if (hasData) {
                verifyAccounts(true);
            } else {
                setValidationStatus({ valid: [], invalid: [], checking: false });
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [recipientsText, items, mode, chain]);

    // Toast Timer
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const verifyAccounts = async (isAuto = false) => {
        setValidationStatus(prev => ({ ...prev, checking: true }));

        let usernamesToCheck: string[] = [];
        if (mode === 'single') {
            usernamesToCheck = recipientsText.split(/[\s,]+/).map(s => s.trim()).filter(s => s).map(u => u.replace(/^@/, ''));
        } else {
            usernamesToCheck = items.map(i => i.to.trim()).filter(s => s).map(u => u.replace(/^@/, ''));
        }

        usernamesToCheck = [...new Set(usernamesToCheck)];

        if (usernamesToCheck.length === 0) {
            setValidationStatus({ valid: [], invalid: [], checking: false });
            return;
        }

        const valid: string[] = [];
        const invalid: string[] = [];

        const CHUNK_SIZE = 5;
        for (let i = 0; i < usernamesToCheck.length; i += CHUNK_SIZE) {
            const chunk = usernamesToCheck.slice(i, i + CHUNK_SIZE);
            await Promise.all(chunk.map(async (user) => {
                try {
                    const data = await fetchAccountData(chain, user);
                    if (data) valid.push(user);
                    else invalid.push(user);
                } catch (e) {
                    invalid.push(user);
                }
            }));
        }

        setValidationStatus({ valid, invalid, checking: false });

        if (isAuto && invalid.length > 0) {
            setToast({
                msg: t('bulk.warn_not_found').replace('{n}', String(invalid.length)).replace('{chain}', chain),
                type: 'warning'
            });
        }
    };

    const addNewRow = () => setItems([...items, { to: '', amount: 0, memo: '' }]);
    const removeRow = (idx: number) => setItems(items.filter((_, i) => i !== idx));



    const handleInitiateSend = () => {
        if (mode === 'single' && recipientCount === 0) return;
        if (mode === 'multi' && items.length === 0) return;

        if (validationStatus.invalid.length > 0) {
            setConfirmModal({
                isOpen: true,
                title: t('bulk.validation_error'),
                message: t('bulk.error_remove_invalid'),
                type: 'error'
            });
            return;
        }

        const recipientsList = mode === 'single'
            ? recipientsText.split(/[\s,]+/).map(s => s.trim()).filter(s => s)
            : [];

        const details = mode === 'single' ? (
            <div className="text-xs space-y-3">
                <div className="bg-dark-950 p-3 rounded border border-dark-700">
                    <div className="flex justify-between border-b border-dark-700 pb-2 mb-2">
                        <span className="text-slate-500">{t('sign.from')}</span>
                        <span className="text-white font-bold">@{account.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-dark-700 pb-2 mb-2">
                        <span className="text-slate-500">{t('transfer.total_amount')}</span>
                        <span className="text-blue-400 font-bold">{totalAmount.toFixed(3)} {selectedToken}</span>
                    </div>

                    <p className="text-slate-500 mb-1 font-bold">{t('bulk.recipients')} {recipientsList.length}</p>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto mb-3 custom-scrollbar">
                        {recipientsList.map((u, i) => (
                            <span key={i} className="bg-dark-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">@{u.replace(/^@/, '')}</span>
                        ))}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 bg-dark-900 p-2 rounded">
                        <span>{t('transfer.per_user')} <span className="text-white">{singleAmount} {selectedToken}</span></span>
                        <span className="italic max-w-[150px] truncate" title={singleMemo}>{singleMemo || "No Memo"}</span>
                    </div>
                </div>
                <p className="text-slate-500 text-center italic">{t('transfer.please_review')}</p>
            </div>
        ) : (
            <div className="text-xs space-y-3">
                <div className="bg-dark-950 p-3 rounded border border-dark-700">
                    <div className="flex justify-between border-b border-dark-700 pb-2 mb-2">
                        <span className="text-slate-500">{t('sign.from')}</span>
                        <span className="text-white font-bold">@{account.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-dark-700 pb-2 mb-2">
                        <span className="text-slate-500">{t('transfer.total_amount')}</span>
                        <span className="text-blue-400 font-bold">{totalAmount.toFixed(3)} {selectedToken}</span>
                    </div>

                    <p className="text-slate-500 mb-1 font-bold">{t('transfer.operations')} ({items.length})</p>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex flex-col bg-dark-900 p-2 rounded border border-dark-800">
                                <div className="flex justify-between font-bold mb-1">
                                    <span className="text-white">@{item.to.replace(/^@/, '')}</span>
                                    <span className="text-green-400">{item.amount} {selectedToken}</span>
                                </div>
                                <span className="text-[10px] text-slate-500 italic truncate" title={item.memo}>{item.memo || "No Memo"}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

        setConfirmModal({
            isOpen: true,
            title: t('bulk.title'),
            message: details,
            type: 'warning'
        });
    };

    const executeSend = async () => {
        setIsBroadcasting(true);
        let finalItems: { to: string; amount: number; memo: string }[] = [];

        if (mode === 'single') {
            const names = recipientsText.split(/[\s,]+/).map(s => s.trim()).filter(s => s).map(u => u.replace(/^@/, ''));
            finalItems = names.map(name => ({
                to: name,
                amount: Number(singleAmount),
                memo: singleMemo
            }));
        } else {
            finalItems = items
                .filter(i => i.to && Number(i.amount) > 0)
                .map(i => ({
                    to: i.to.replace(/^@/, ''),
                    amount: Number(i.amount),
                    memo: i.memo
                }));
        }

        try {
            if (!account.activeKey) throw new Error(t('bulk.error_no_active'));

            const result = await broadcastBulkTransfer(chain, account.name, account.activeKey, finalItems, selectedToken);

            if (result.success) {
                setConfirmModal({
                    isOpen: true,
                    title: t('bulk.success_title'),
                    message: t('bulk.success_msg').replace('{n}', String(finalItems.length)).replace('{txid}', result.txId?.slice(0, 8) || '???'),
                    type: 'success'
                });
                onSuccess();
            } else {
                throw new Error(result.error);
            }

        } catch (e: any) {
            setConfirmModal({
                isOpen: true,
                title: t('bulk.error_title'),
                message: e.message || t('bulk.error_failed'),
                type: 'error'
            });
        } finally {
            setIsBroadcasting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-dark-900 w-full max-w-2xl h-[90vh] rounded-2xl shadow-2xl flex flex-col border border-dark-700 animate-slide-up relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white z-10 p-2 bg-dark-800 rounded-full hover:bg-dark-700 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Toast Notification */}
                {toast && (
                    <div className={`absolute top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-xl text-xs font-bold transition-opacity duration-500 animate-slide-down backdrop-blur-md ${toast.type === 'error' || toast.type === 'warning' ? 'bg-red-500/80 text-white' : 'bg-green-500/80 text-white'}`}>
                        {toast.msg}
                    </div>
                )}

                {/* Header */}
                <div className="p-4 border-b border-dark-700 bg-dark-800 rounded-t-2xl">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {mode === 'single' ? t('bulk.title_single') : t('bulk.title_multi')}
                    </h2>
                    <p className="text-slate-400 text-xs mt-0.5 mb-2">
                        {t('bulk.sending_from')} <span className="text-blue-400 font-bold">@{account.name}</span>
                    </p>

                    {/* Token Selector & Balance Row */}
                    {(chain === Chain.HIVE || chain === Chain.STEEM) && (
                        <div className="flex items-center justify-between bg-dark-900/50 p-2 rounded-lg border border-dark-700">
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 font-bold">{t('bulk.asset')}</span>
                                <div className="flex gap-2">
                                    <label className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="token"
                                            value={chain === Chain.HIVE ? "HIVE" : "STEEM"}
                                            checked={selectedToken === "HIVE" || selectedToken === "STEEM"}
                                            onChange={() => setSelectedToken(chain === Chain.HIVE ? "HIVE" : "STEEM")}
                                            className="accent-blue-500"
                                        />
                                        <span className="text-[10px] text-white font-mono">{chain === Chain.HIVE ? "HIVE" : "STEEM"}</span>
                                    </label>
                                    <label className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="token"
                                            value={chain === Chain.HIVE ? "HBD" : "SBD"}
                                            checked={selectedToken === "HBD" || selectedToken === "SBD"}
                                            onChange={() => setSelectedToken(chain === Chain.HIVE ? "HBD" : "SBD")}
                                            className="accent-blue-500"
                                        />
                                        <span className="text-[10px] text-white font-mono">{chain === Chain.HIVE ? "HBD" : "SBD"}</span>
                                    </label>
                                </div>
                            </div>

                            {/* Balance */}
                            <div className="text-[10px] text-slate-400">
                                {t('bulk.available')} <span className="text-green-400 font-bold font-mono">
                                    {((selectedToken === 'HBD' || selectedToken === 'SBD') ? account.secondaryBalance : account.balance)?.toFixed(3)}
                                </span> {selectedToken}
                            </div>
                        </div>
                    )}
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-dark-900">

                    {/* File Import Button */}
                    <div className="flex justify-end">
                        <div className="relative overflow-hidden cursor-pointer group">
                            <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase border border-blue-500/30 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                {t('bulk.import')} CSV/TXT
                            </span>
                            <input type="file" onChange={handleFileImport} className="absolute inset-0 opacity-0 cursor-pointer" accept=".csv,.txt" />
                        </div>
                    </div>

                    {mode === 'single' ? (
                        <div className="space-y-6">
                            {/* Amount Input */}
                            <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                                <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">{t('bulk.amount')} per user</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="0.000"
                                        value={singleAmount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(',', '.');
                                            if (val === '' || !isNaN(Number(val)) || val.endsWith('.')) {
                                                setSingleAmount(val as any);
                                            }
                                        }}
                                        className="w-full bg-dark-950 border border-dark-600 rounded-lg p-3 text-lg font-mono text-white focus:border-blue-500 outline-none transition-colors"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">{selectedToken}</span>
                                </div>
                            </div>

                            {/* Recipients Input */}
                            <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('bulk.recipients')}</label>
                                    {validationStatus.checking && <span className="text-xs text-blue-400 animate-pulse font-mono">Verifying...</span>}
                                </div>
                                <textarea
                                    value={recipientsText}
                                    onChange={(e) => setRecipientsText(e.target.value.replace(/[\u200B-\u200D\uFEFF]/g, ''))}
                                    className="w-full h-32 bg-dark-950 border border-dark-600 rounded-lg p-3 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none resize-none custom-scrollbar"
                                    placeholder={`user1, user2\nuser3`}
                                />
                                <div className="flex flex-wrap gap-1 mt-3 max-h-24 overflow-y-auto custom-scrollbar">
                                    {recipientsText.split(/[\s,]+/).filter(s => s.trim()).map((user, i) => {
                                        const clean = user.replace(/^@/, '');
                                        const isValid = validationStatus.valid.includes(clean);
                                        const isInvalid = validationStatus.invalid.includes(clean);
                                        let color = "bg-slate-700 text-slate-400";
                                        let icon = "";
                                        if (isValid) { color = "bg-green-900/40 text-green-400 border border-green-500/30"; icon = "✓"; }
                                        if (isInvalid) { color = "bg-red-900/40 text-red-400 border border-red-500/30"; icon = "✕"; }
                                        return (
                                            <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full ${color} flex items-center gap-1`}>
                                                {icon} {clean}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Memo Input */}
                            <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                                <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">{t('bulk.memo')}</label>
                                <textarea
                                    value={singleMemo}
                                    onChange={(e) => setSingleMemo(e.target.value)}
                                    className="w-full h-20 bg-dark-950 border border-dark-600 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none resize-none"
                                    placeholder="Public Memo..."
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item, idx) => {
                                const clean = item.to.replace(/^@/, '');
                                const isValid = validationStatus.valid.includes(clean);
                                const isInvalid = validationStatus.invalid.includes(clean);

                                return (
                                    <div key={idx} className="bg-dark-800/50 p-3 rounded-xl border border-dark-700 relative hover:border-dark-600 transition-colors group">
                                        <div className="flex gap-3 mb-3">
                                            <div className="flex-1 relative">
                                                <input
                                                    placeholder={t('import.username')}
                                                    value={item.to}
                                                    onChange={e => {
                                                        const newItems = [...items];
                                                        newItems[idx].to = e.target.value.toLowerCase().replace(/[\s\u200B-\u200D\uFEFF]/g, '');
                                                        setItems(newItems);
                                                    }}
                                                    className={`w-full bg-dark-950 border rounded-lg px-3 py-2 text-xs outline-none text-white placeholder-slate-600 ${isValid ? 'border-green-500/50' : isInvalid ? 'border-red-500/50' : 'border-dark-600'}`}
                                                />
                                                <div className="absolute right-2 top-2 text-[10px]">
                                                    {isValid && <span className="text-green-400">✓</span>}
                                                    {isInvalid && <span className="text-red-400 font-bold">✕</span>}
                                                </div>
                                            </div>
                                            <div className="w-1/3 relative">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    placeholder="0.000"
                                                    value={item.amount}
                                                    onChange={e => {
                                                        const val = e.target.value.replace(',', '.');
                                                        if (val === '' || !isNaN(Number(val)) || val.endsWith('.')) {
                                                            const newItems = [...items];
                                                            newItems[idx].amount = val;
                                                            setItems(newItems);
                                                        }
                                                    }}
                                                    className="w-full bg-dark-950 border border-dark-600 rounded-lg px-3 py-2 text-xs outline-none text-white placeholder-slate-600 font-mono"
                                                />
                                                <span className="absolute right-2 top-2 text-[10px] text-slate-500">{selectedToken}</span>
                                            </div>
                                            <button
                                                onClick={() => removeRow(idx)}
                                                className="text-red-400 hover:text-red-200 hover:bg-red-500/10 rounded w-8 flex items-center justify-center transition-colors"
                                                title="Remove row"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="w-full">
                                            <textarea
                                                rows={3}
                                                placeholder={t('bulk.memo')}
                                                value={item.memo}
                                                onChange={e => {
                                                    const newItems = [...items];
                                                    newItems[idx].memo = e.target.value;
                                                    setItems(newItems);
                                                }}
                                                className="w-full bg-dark-950 border border-dark-600 rounded-lg px-3 py-2 text-xs outline-none text-white placeholder-slate-600 resize-none custom-scrollbar"
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                            <button onClick={addNewRow} className="w-full py-3 bg-dark-800 border-2 border-dashed border-dark-600 rounded-xl text-slate-400 text-xs font-bold hover:border-blue-500/50 hover:text-blue-400 transition-all">
                                + {t('bulk.add_row')}
                            </button>
                        </div>
                    )}

                    {/* Action Button (Centered & Small) */}
                    <div className="pt-6 pb-4 flex justify-center">
                        <button
                            onClick={handleInitiateSend}
                            disabled={validationStatus.invalid.length > 0 || validationStatus.checking || isBroadcasting}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-dark-600 disabled:to-dark-600 disabled:text-slate-500 text-white font-bold py-2 px-6 h-auto min-h-[40px] rounded-full shadow-lg transition-all transform active:scale-[0.98] text-xs tracking-wide whitespace-normal leading-tight max-w-[200px]"
                        >
                            {isBroadcasting ? 'Broadcasting...' : t('bulk.sign_broadcast')}
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!confirmModal}
                title={confirmModal?.title || ''}
                message={confirmModal?.message || ''}
                type={confirmModal?.type}
                onConfirm={() => {
                    if (confirmModal?.type === 'success') { // Close all on success
                        setConfirmModal(null);
                        onClose();
                    } else if (confirmModal?.type === 'error') {
                        setConfirmModal(null);
                    } else {
                        executeSend();
                    }
                }}
                onCancel={() => setConfirmModal(null)}
                isLoading={isBroadcasting}
                confirmLabel={confirmModal?.type === 'warning' ? 'Confirm Send' : 'OK'}
                cancelLabel={confirmModal?.type === 'warning' ? 'Cancel' : 'Close'}
            />
        </div>
    );
};
