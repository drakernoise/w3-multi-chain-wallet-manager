import React, { useState, useEffect } from 'react';
import { Chain, Account, BulkItem } from '../types';
import { analyzeTransaction } from '../services/geminiService';
import { fetchAccountData, broadcastBulkTransfer } from '../services/chainService';
import { ConfirmationModal } from './ConfirmationModal';
import { useTranslation } from '../contexts/LanguageContext';

interface BulkTransferProps {
    chain: Chain;
    accounts: Account[];
    refreshBalance?: () => void;
    onChangeChain?: (chain: Chain) => void;
}

export const BulkTransfer: React.FC<BulkTransferProps> = ({ chain, accounts, refreshBalance, onChangeChain }) => {
    const { t } = useTranslation();
    const [mode, setMode] = useState<'single' | 'multi'>('single');

    // Form States
    const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.name || '');
    const [singleAmount, setSingleAmount] = useState<number | string>(0);
    const [singleMemo, setSingleMemo] = useState<string>('');
    const [recipientsText, setRecipientsText] = useState<string>('');

    // Token State
    const [selectedToken, setSelectedToken] = useState<string>(
        chain === Chain.HIVE ? 'HIVE' : chain === Chain.STEEM ? 'STEEM' : 'BLURT'
    );

    // Sync token on chain change
    useEffect(() => {
        if (chain === Chain.HIVE) setSelectedToken('HIVE');
        else if (chain === Chain.STEEM) setSelectedToken('STEEM');
        else setSelectedToken('BLURT');
    }, [chain]);

    // Multi Mode State
    const [items, setItems] = useState<BulkItem[]>([{ to: '', amount: 0, memo: '' }]);

    // Analysis & Validation
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [validationStatus, setValidationStatus] = useState<{ valid: string[], invalid: string[], checking: boolean }>({ valid: [], invalid: [], checking: false });

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, message: React.ReactNode, title: string, type: 'info' | 'warning' | 'error' | 'success' } | null>(null);
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    // Sync selected account if accounts change
    useEffect(() => {
        if (accounts.length > 0 && !accounts.find(a => a.name === selectedAccount)) {
            setSelectedAccount(accounts[0].name);
        }
    }, [accounts]);

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
                // Clear validation if empty
                setValidationStatus({ valid: [], invalid: [], checking: false });
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [recipientsText, items, mode, chain]);

    // Toast Timer
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000); // 4 seconds
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

        // Remove duplicates
        usernamesToCheck = [...new Set(usernamesToCheck)];

        if (usernamesToCheck.length === 0) {
            setValidationStatus({ valid: [], invalid: [], checking: false });
            return;
        }

        const valid: string[] = [];
        const invalid: string[] = [];

        // Batch checking
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

        // Show Toast only if invalid found and mode is auto (to prompt user)
        if (isAuto && invalid.length > 0) {
            setToast({
                msg: `⚠ Warning: ${invalid.length} username(s) not found on ${chain} chain.`,
                type: 'warning'
            });
        }
    };

    const addNewRow = () => setItems([...items, { to: '', amount: 0, memo: '' }]);
    const removeRow = (idx: number) => setItems(items.filter((_, i) => i !== idx));

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAiAnalysis(null);
        try {
            // Build temporary item list for analysis
            const itemsToAnalyze = mode === 'single'
                ? recipientsText.split(/[\s,]+/).filter(Boolean).map(r => ({ to: r, amount: Number(singleAmount), memo: singleMemo }))
                : items;

            const result = await analyzeTransaction(chain, selectedAccount, itemsToAnalyze, t('security.analysis_prompt'));
            setAiAnalysis(result);
        } catch (e) {
            setAiAnalysis("Could not complete analysis.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleInitiateSend = () => {
        if (mode === 'single' && recipientCount === 0) return;
        if (mode === 'multi' && items.length === 0) return;

        if (validationStatus.invalid.length > 0) {
            setConfirmModal({
                isOpen: true,
                title: 'Validation Error',
                message: 'Please remove invalid accounts before sending.',
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
                        <span className="text-white font-bold">@{selectedAccount}</span>
                    </div>
                    <div className="flex justify-between border-b border-dark-700 pb-2 mb-2">
                        <span className="text-slate-500">{t('transfer.total_amount')}</span>
                        <span className="text-blue-400 font-bold">{totalAmount.toFixed(3)} {chain}</span>
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
                        <span className="text-white font-bold">@{selectedAccount}</span>
                    </div>
                    <div className="flex justify-between border-b border-dark-700 pb-2 mb-2">
                        <span className="text-slate-500">{t('transfer.total_amount')}</span>
                        <span className="text-blue-400 font-bold">{totalAmount.toFixed(3)} {chain}</span>
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
        // Prepare items
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
            // Retrieve Active Key from component props (which are decrypted in App.tsx -> WalletState)
            const account = accounts.find(a => a.name === selectedAccount);
            if (!account) throw new Error("Account not found");

            if (!account.activeKey) throw new Error("Active key not found for this account. Please add it in settings.");

            const activeKey = account.activeKey;



            const result = await broadcastBulkTransfer(chain, selectedAccount, activeKey, finalItems, selectedToken);

            if (result.success) {
                setConfirmModal({
                    isOpen: true,
                    title: 'Success!',
                    message: `Sent ${finalItems.length} transfers successfully. TXID: ${result.txId?.slice(0, 8)}...`,
                    type: 'success'
                });

                if (refreshBalance) refreshBalance();

                // Clear form
                if (mode === 'single') {
                    setRecipientsText('');
                    setSingleAmount(0);
                    setSingleMemo('');
                } else {
                    setItems([{ to: '', amount: 0, memo: '' }]);
                }
            } else {
                throw new Error(result.error);
            }

        } catch (e: any) {
            setConfirmModal({
                isOpen: true,
                title: 'Error',
                message: e.message || "Failed to send",
                type: 'error'
            });
        } finally {
            setIsBroadcasting(false);
        }
    };

    if (accounts.length === 0) return <div className="p-8 text-center text-slate-500">Please add an account first.</div>;

    return (
        <div className="flex flex-col h-full bg-dark-900 text-slate-200 relative overflow-hidden">
            {/* Toast Notification */}
            {toast && (
                <div className={`absolute top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-xl text-xs font-bold transition-opacity duration-500 animate-slide-down backdrop-blur-md ${toast.type === 'error' || toast.type === 'warning' ? 'bg-red-500/80 text-white' : 'bg-green-500/80 text-white'
                    }`}>
                    {toast.msg}
                </div>
            )}

            {/* Header / Account Select */}
            <div className="p-4 border-b border-dark-700 bg-dark-800">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-white">{t('bulk.title')}</h2>
                    <div className="flex gap-2">
                        {[Chain.HIVE, Chain.STEEM, Chain.BLURT].map(c => (
                            <button
                                key={c}
                                onClick={() => onChangeChain && onChangeChain(c)}
                                title={t('bulk.switch_network')}
                                className={`w-5 h-5 rounded-full overflow-hidden transition-all border border-transparent ${chain === c ? 'ring-2 ring-blue-500 scale-110 bg-dark-900 shadow-lg' : 'opacity-40 hover:opacity-100 grayscale hover:grayscale-0'}`}
                            >
                                <img src={c === Chain.HIVE ? '/Logo_hive.png' : c === Chain.STEEM ? '/logosteem.png' : '/logoblurt.png'} alt={c} className="w-full h-full object-contain" />
                            </button>
                        ))}
                    </div>
                </div>
                <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none"
                >
                    {accounts.map(a => <option key={a.name} value={a.name}>@{a.name}</option>)}
                </select>

                {/* Token Selector */}
                {(chain === Chain.HIVE || chain === Chain.STEEM) && (
                    <div className="mt-2 flex items-center justify-end gap-2">
                        <span className="text-xs text-slate-400">Asset:</span>
                        <select
                            value={selectedToken}
                            onChange={(e) => setSelectedToken(e.target.value)}
                            className="bg-dark-900 border border-dark-600 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                        >
                            {chain === Chain.HIVE ? (
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
                    </div>
                )}
                {/* Optional Balance Display */}
                {accounts.find(a => a.name === selectedAccount)?.balance !== undefined && (
                    <div className="text-[10px] text-slate-400 mt-1 text-right">
                        Balance: <span className="text-green-400 font-mono">{accounts.find(a => a.name === selectedAccount)?.balance}</span>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-dark-700">
                <button
                    onClick={() => setMode('single')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${mode === 'single' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {t('bulk.same_amount')}
                </button>
                <button
                    onClick={() => setMode('multi')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${mode === 'multi' ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {t('bulk.diff_amount')}
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">

                {/* File Import Header */}
                <div className="flex justify-end">
                    <div className="relative overflow-hidden cursor-pointer group">
                        <span className="text-[10px] text-blue-400 font-bold uppercase border border-blue-500/30 px-2 py-1 rounded hover:bg-blue-500/10 transition-colors">📄 {t('bulk.import')}</span>
                        <input type="file" onChange={handleFileImport} className="absolute inset-0 opacity-0 cursor-pointer" accept=".csv,.txt" />
                    </div>
                </div>

                {mode === 'single' ? (
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-slate-400 mb-1 block">{t('bulk.recipients')}</label>
                                {validationStatus.checking && <span className="text-xs text-blue-400 animate-pulse font-mono">Verifying...</span>}
                            </div>
                            <textarea
                                value={recipientsText}
                                onChange={(e) => setRecipientsText(e.target.value)}
                                className="w-full h-24 bg-dark-800 border border-dark-600 rounded-lg p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none resize-none"
                                placeholder={`user1, user2\nuser3`}
                            />
                            {/* Visual Feedback Text/Tags */}
                            <div className="flex flex-wrap gap-1 mt-2">
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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-1 block">{t('bulk.amount')} ({selectedToken})</label>
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
                                    className="w-full bg-dark-800 border border-dark-600 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-1 block">{t('bulk.memo')}</label>
                                <input
                                    type="text"
                                    value={singleMemo}
                                    onChange={(e) => setSingleMemo(e.target.value)}
                                    className="w-full bg-dark-800 border border-dark-600 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none"
                                    placeholder="Public Memo"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map((item, idx) => {
                            const clean = item.to.replace(/^@/, '');
                            const isValid = validationStatus.valid.includes(clean);
                            const isInvalid = validationStatus.invalid.includes(clean);

                            return (
                                <div key={idx} className="flex gap-2 items-start bg-dark-800/50 p-2 rounded-lg border border-dark-700/50 relative">
                                    <div className="grid grid-cols-12 gap-2 flex-1">
                                        <div className="col-span-4 relative">
                                            <input
                                                placeholder={t('import.username')}
                                                value={item.to}
                                                onChange={e => {
                                                    const newItems = [...items];
                                                    newItems[idx].to = e.target.value;
                                                    setItems(newItems);
                                                }}
                                                className={`w-full bg-dark-900 border rounded px-2 py-1 text-xs outline-none text-white placeholder-slate-600 ${isValid ? 'border-green-500/50' : isInvalid ? 'border-red-500/50' : 'border-dark-600'
                                                    }`}
                                            />
                                            {/* Status Icon */}
                                            <div className="absolute right-2 top-1.5 text-[10px]">
                                                {isValid && <span className="text-green-400">✓</span>}
                                                {isInvalid && <span className="text-red-400 font-bold">✕</span>}
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="0.000"
                                                value={item.amount}
                                                onChange={e => {
                                                    const val = e.target.value.replace(',', '.');
                                                    // Allow empty, numbers, or "0."
                                                    if (val === '' || !isNaN(Number(val)) || val.endsWith('.')) {
                                                        const newItems = [...items];
                                                        newItems[idx].amount = val;
                                                        setItems(newItems);
                                                    }
                                                }}
                                                onBlur={_ => {
                                                    const val = parseFloat(item.amount.toString());
                                                    if (!isNaN(val)) {
                                                        const newItems = [...items];
                                                        newItems[idx].amount = val;
                                                        setItems(newItems);
                                                    }
                                                }}
                                                className="w-full bg-dark-900 border border-dark-600 rounded px-2 py-1 text-xs outline-none text-white placeholder-slate-600"
                                            />
                                        </div>
                                        <div className="col-span-5">
                                            <input
                                                placeholder={t('bulk.memo')}
                                                value={item.memo}
                                                onChange={e => {
                                                    const newItems = [...items];
                                                    newItems[idx].memo = e.target.value;
                                                    setItems(newItems);
                                                }}
                                                className="w-full bg-dark-900 border border-dark-600 rounded px-2 py-1 text-xs outline-none text-white placeholder-slate-600"
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-200 mt-1">✕</button>
                                </div>
                            )
                        })}
                        <div className="flex gap-2 mt-2">
                            <button onClick={addNewRow} className="flex-1 py-2 bg-dark-800 border border-dashed border-dark-600 rounded text-slate-400 text-xs hover:border-slate-400 transition-colors">
                                {t('bulk.add_row')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Validation Results Alert */}
                {(validationStatus.valid.length > 0 || validationStatus.invalid.length > 0) && (
                    <div className={`text-xs p-3 rounded-lg border ${validationStatus.invalid.length > 0 ? 'bg-red-900/20 border-red-500/50' : 'bg-green-900/20 border-green-500/50'}`}>
                        {validationStatus.invalid.length > 0 && (
                            <div className="text-red-300 font-bold mb-1">
                                ⚠ Invalid Users ({validationStatus.invalid.length}): {validationStatus.invalid.join(', ')}
                            </div>
                        )}
                        <div className="text-green-400">
                            ✓ Valid Users: {validationStatus.valid.length}
                        </div>
                    </div>
                )}

                {/* AI Analysis */}
                <div className="pt-2">
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="text-xs text-purple-400 hover:text-purple-300 underline"
                    >
                        {isAnalyzing ? t('bulk.analyzing') : t('bulk.analyze')}
                    </button>
                    {aiAnalysis && (
                        <div className="bg-purple-900/40 border border-purple-500/40 p-3 rounded-lg text-xs leading-relaxed text-purple-100">
                            {aiAnalysis}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-dark-800 border-t border-dark-700">
                <div className="flex justify-between items-end mb-2 text-xs">
                    <span className="text-slate-400">{t('bulk.total')}</span>
                    <span className="text-lg font-bold text-white">{totalAmount.toFixed(3)} <span className="text-sm font-normal text-slate-500">{selectedToken}</span></span>
                </div>
                <button
                    onClick={handleInitiateSend}
                    disabled={validationStatus.invalid.length > 0 || validationStatus.checking || isBroadcasting}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-dark-600 disabled:text-slate-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all transform active:scale-95"
                >
                    {isBroadcasting ? 'Broadcasting...' : t('bulk.sign_broadcast')}
                </button>
            </div>

            <ConfirmationModal
                isOpen={!!confirmModal}
                title={confirmModal?.title || ''}
                message={confirmModal?.message || ''}
                type={confirmModal?.type}
                onConfirm={() => {
                    if (confirmModal?.type === 'success' || confirmModal?.type === 'error') {
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