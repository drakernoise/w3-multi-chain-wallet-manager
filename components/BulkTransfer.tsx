import React, { useState } from 'react';
import { Chain, Account, BulkItem } from '../types';
import { analyzeTransaction } from '../services/geminiService';

interface BulkTransferProps {
    chain: Chain;
    accounts: Account[];
}

export const BulkTransfer: React.FC<BulkTransferProps> = ({ chain, accounts }) => {
    const [items, setItems] = useState<BulkItem[]>([
        { to: '', amount: 0, memo: '' }
    ]);
    const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.name || '');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

    const addNewRow = () => {
        setItems([...items, { to: '', amount: 0, memo: '' }]);
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                // Split by newlines first
                const lines = text.split(/\r?\n/);
                const newItems: BulkItem[] = [];

                lines.forEach(line => {
                    const trimmed = line.trim();
                    if (!trimmed) return;

                    // Split by comma or one-or-more spaces
                    // Supports: "user, 10, memo" OR "user 10 memo" OR just "user"
                    const parts = trimmed.split(/[\s,]+/);

                    if (parts.length > 0 && parts[0]) {
                        const to = parts[0];
                        const amount = parts[1] ? parseFloat(parts[1]) : 0;
                        // Join the rest as memo
                        const memo = parts.slice(2).join(' ') || '';

                        if (!isNaN(amount)) {
                            newItems.push({ to, amount, memo });
                        }
                    }
                });

                if (newItems.length > 0) {
                    setItems(newItems);
                } else {
                    alert("No valid data found in file. Use format: username amount memo");
                }
            };
            reader.readAsText(file);
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAiAnalysis(null);
        try {
            const result = await analyzeTransaction(chain, selectedAccount, items);
            setAiAnalysis(result);
        } catch (e) {
            setAiAnalysis("Could not complete analysis.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (accounts.length === 0) return <div className="p-4 text-center text-slate-500">Add an account first.</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Bulk Transfer</h2>

            <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                <label className="text-xs text-slate-500 uppercase block mb-1">From Account</label>
                <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 rounded p-2 text-sm outline-none focus:border-blue-500"
                >
                    {accounts.map(a => <option key={a.name} value={a.name}>@{a.name}</option>)}
                </select>
            </div>

            <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400">Recipients (CSV or TXT)</label>
                <div className="relative overflow-hidden inline-block">
                    <button className="text-xs text-blue-400 hover:text-blue-300">Import File</button>
                    <input type="file" onChange={handleFileImport} className="absolute left-0 top-0 opacity-0 cursor-pointer w-full h-full" accept=".csv,.txt" />
                </div>
            </div>

            <div className="space-y-2">
                {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                        <input
                            placeholder="Username"
                            value={item.to}
                            onChange={e => {
                                const newItems = [...items];
                                newItems[idx].to = e.target.value;
                                setItems(newItems);
                            }}
                            className="bg-dark-800 border border-dark-700 rounded p-2 text-xs w-1/3 outline-none"
                        />
                        <input
                            type="number"
                            placeholder="0.000"
                            value={item.amount || ''}
                            onChange={e => {
                                const newItems = [...items];
                                newItems[idx].amount = parseFloat(e.target.value);
                                setItems(newItems);
                            }}
                            className="bg-dark-800 border border-dark-700 rounded p-2 text-xs w-1/4 outline-none"
                        />
                        <input
                            placeholder="Memo"
                            value={item.memo}
                            onChange={e => {
                                const newItems = [...items];
                                newItems[idx].memo = e.target.value;
                                setItems(newItems);
                            }}
                            className="bg-dark-800 border border-dark-700 rounded p-2 text-xs flex-1 outline-none"
                        />
                    </div>
                ))}
            </div>

            <button onClick={addNewRow} className="w-full py-2 border border-dashed border-dark-600 rounded text-slate-400 text-xs hover:bg-dark-800 transition-colors">
                + Add Recipient
            </button>

            {/* AI Analysis Section */}
            <div className="pt-2">
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 mb-2 disabled:opacity-50"
                >
                    {isAnalyzing ? (
                        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    )}
                    Analyze Safety with AI
                </button>

                {aiAnalysis && (
                    <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded text-xs text-purple-200">
                        <p className="font-bold mb-1">Gemini Analysis:</p>
                        {aiAnalysis}
                    </div>
                )}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg mt-4">
                Sign & Broadcast ({items.length})
            </button>
        </div>
    );
};