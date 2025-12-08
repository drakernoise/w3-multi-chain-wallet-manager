import React, { useState } from 'react';
import { Account } from '../types';

interface TransferModalProps {
    account: Account;
    accounts: Account[]; // All accounts to allow switching
    onClose: () => void;
    onTransfer: (from: Account, to: string, amount: string, memo: string) => Promise<void>;
}

export const TransferModal: React.FC<TransferModalProps> = ({ account: initialAccount, accounts, onClose, onTransfer }) => {
    // Allow switching sending account
    const [selectedAccount, setSelectedAccount] = useState<Account>(initialAccount);

    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Filter accounts to only show those of the same chain as the currently selected one?
    // Or allow switching chain too? Let's allow switching chain by selecting different account.

    const hasActiveKey = !!selectedAccount.activeKey;

    const handleSend = async () => {
        if (!to || !amount) return;
        setIsSending(true);
        await onTransfer(selectedAccount, to, amount, memo);
        setIsSending(false);
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Send {selectedAccount.chain}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="p-3 bg-dark-900 rounded-lg border border-dark-700">
                        <label className="text-xs text-slate-500 block mb-1">From Account</label>
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
                    </div>

                    {!hasActiveKey && (
                        <div className="bg-red-900/20 text-red-400 p-2 rounded text-xs text-center border border-red-500/30">
                            Active Key required to send funds.
                        </div>
                    )}

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">To</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-500">@</span>
                            <input
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg py-2 pl-7 pr-3 text-sm focus:border-blue-500 outline-none"
                                placeholder="recipient"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Amount</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg py-2 pl-3 pr-16 text-sm focus:border-blue-500 outline-none"
                                placeholder="0.000"
                            />
                            <span className="absolute right-3 top-2 text-xs font-bold text-slate-500 pt-0.5">{selectedAccount.chain}</span>
                        </div>
                        {selectedAccount.balance !== undefined && (
                            <p className="text-[10px] text-slate-500 mt-1 text-right">Available: {selectedAccount.balance.toFixed(3)}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Memo (Optional)</label>
                        <input
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg py-2 px-3 text-sm focus:border-blue-500 outline-none"
                            placeholder="Public note"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSend}
                    disabled={isSending || !to || !amount || !hasActiveKey}
                    className="w-full py-3 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {isSending ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Broadcasting...
                        </>
                    ) : (
                        "Confirm Transfer"
                    )}
                </button>
            </div>
        </div>
    );
};
