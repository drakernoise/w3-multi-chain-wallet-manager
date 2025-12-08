import React, { useState, useEffect } from 'react';
import { Chain, Account, MultiSigRequest } from '../types';

interface MultiSigProps {
    chain: Chain;
    accounts: Account[];
}

// Define available operation types
type OpType = 'transfer' | 'delegate_vesting_shares' | 'transfer_to_vesting' | 'withdraw_vesting' | 'custom';

export const MultiSig: React.FC<MultiSigProps> = ({ chain: initialChain, accounts }) => {
    // Local state for the chain selected in this view
    const [selectedChain, setSelectedChain] = useState<Chain>(initialChain);

    // Filter accounts that match the selected chain
    const chainAccounts = accounts.filter(a => a.chain === selectedChain);

    const [request, setRequest] = useState<MultiSigRequest>({
        initiator: chainAccounts[0]?.name || '',
        signers: [],
        threshold: 2,
        operation: '{}'
    });

    // Reset initiator if chain changes
    useEffect(() => {
        setRequest(prev => ({
            ...prev,
            initiator: chainAccounts[0]?.name || '',
            signers: [],
            threshold: 1
        }));
    }, [selectedChain]); // Only run when chain changes

    const [newSigner, setNewSigner] = useState('');

    // Form state for structured ops
    const [opType, setOpType] = useState<OpType>('transfer');
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');

    // Update the raw JSON operation whenever form fields change
    useEffect(() => {
        let opData: any = {};
        const asset = selectedChain === Chain.HIVE ? 'HIVE' : selectedChain === Chain.STEEM ? 'STEEM' : 'BLURT';

        // Helper to format amount
        const fmtAmount = (amt: string) => {
            const val = parseFloat(amt || '0').toFixed(3);
            return `${val} ${asset}`;
        };

        switch (opType) {
            case 'transfer':
                opData = [
                    'transfer',
                    {
                        from: request.initiator,
                        to: to,
                        amount: fmtAmount(amount),
                        memo: memo
                    }
                ];
                break;
            case 'delegate_vesting_shares':
                // Note: Vesting shares usually require VESTS symbol
                opData = [
                    'delegate_vesting_shares',
                    {
                        delegator: request.initiator,
                        delegatee: to,
                        vesting_shares: `${parseFloat(amount || '0').toFixed(6)} VESTS`
                    }
                ];
                break;
            case 'transfer_to_vesting':
                opData = [
                    'transfer_to_vesting',
                    {
                        from: request.initiator,
                        to: to || request.initiator, // default to self if empty
                        amount: fmtAmount(amount)
                    }
                ];
                break;
            case 'withdraw_vesting':
                opData = [
                    'withdraw_vesting',
                    {
                        account: request.initiator,
                        vesting_shares: `${parseFloat(amount || '0').toFixed(6)} VESTS`
                    }
                ];
                break;
            case 'custom':
                // Don't overwrite if custom is selected, handle manually in textarea
                return;
        }

        // Update the request operation string formatted nicely
        setRequest(prev => ({ ...prev, operation: JSON.stringify(opData, null, 2) }));

    }, [opType, to, amount, memo, request.initiator, selectedChain]);

    const addSigner = () => {
        if (newSigner && !request.signers.includes(newSigner)) {
            setRequest({ ...request, signers: [...request.signers, newSigner] });
            setNewSigner('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="bg-orange-500/20 text-orange-400 p-1 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </span>
                    MultiSig Builder
                </h2>
                {/* Chain Selector */}
                <select
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value as Chain)}
                    className="bg-dark-800 border border-dark-600 rounded p-1 text-xs font-bold text-slate-300 outline-none focus:border-blue-500"
                >
                    <option value={Chain.HIVE}>HIVE</option>
                    <option value={Chain.STEEM}>STEEM</option>
                    <option value={Chain.BLURT}>BLURT</option>
                </select>
            </div>

            <div className="bg-dark-800 p-4 rounded-xl space-y-4 border border-dark-700">

                {/* Initiator Selection */}
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold">Initiator (From)</label>
                    <select
                        value={request.initiator}
                        onChange={(e) => setRequest({ ...request, initiator: e.target.value })}
                        className="w-full bg-dark-900 border border-dark-600 rounded p-2 text-sm mt-1 focus:border-blue-500 outline-none"
                    >
                        {chainAccounts.length === 0 && <option value="">No accounts found for {selectedChain}</option>}
                        {chainAccounts.map(a => <option key={a.name} value={a.name}>@{a.name}</option>)}
                    </select>
                    {chainAccounts.length === 0 && (
                        <p className="text-[10px] text-red-400 mt-1">Please import a {selectedChain} account first.</p>
                    )}
                </div>

                {/* Signers */}
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold">Signers</label>
                    <div className="flex gap-2 mt-1">
                        <input
                            value={newSigner}
                            onChange={e => setNewSigner(e.target.value)}
                            className="flex-1 bg-dark-900 border border-dark-600 rounded p-2 text-sm focus:border-blue-500 outline-none"
                            placeholder="Username or Key"
                        />
                        <button onClick={addSigner} className="bg-dark-700 px-3 rounded hover:bg-dark-600 transition-colors">
                            +
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {request.signers.length === 0 && <span className="text-xs text-slate-600 italic">No signers added yet</span>}
                        {request.signers.map(s => (
                            <span key={s} className="bg-dark-900 border border-dark-600 text-xs px-2 py-1 rounded flex items-center gap-1">
                                {s}
                                <button onClick={() => setRequest({ ...request, signers: request.signers.filter(x => x !== s) })} className="text-red-400 hover:text-red-300">×</button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Threshold */}
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold">Threshold</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="number"
                            min="1"
                            max={request.signers.length + 1}
                            value={request.threshold}
                            onChange={e => setRequest({ ...request, threshold: parseInt(e.target.value) })}
                            className="w-20 bg-dark-900 border border-dark-600 rounded p-2 text-sm focus:border-blue-500 outline-none"
                        />
                        <span className="text-xs text-slate-500">Signatures required out of {request.signers.length}</span>
                    </div>
                </div>

                <div className="border-t border-dark-700 my-4" />

                {/* Operation Builder */}
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold">Operation Type</label>
                    <select
                        value={opType}
                        onChange={(e) => setOpType(e.target.value as OpType)}
                        className="w-full bg-dark-900 border border-dark-600 rounded p-2 text-sm mt-1 mb-3 focus:border-blue-500 outline-none"
                    >
                        <option value="transfer">Transfer (Send Funds)</option>
                        <option value="delegate_vesting_shares">Delegate Power (Vests)</option>
                        <option value="transfer_to_vesting">Power Up</option>
                        <option value="withdraw_vesting">Power Down</option>
                        <option value="custom">Custom Raw JSON</option>
                    </select>

                    {/* Dynamic Fields */}
                    {opType !== 'custom' && (
                        <div className="space-y-3 p-3 bg-dark-900/50 rounded-lg border border-dark-700/50">
                            {opType !== 'withdraw_vesting' && (
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Target Account (@)</label>
                                    <input
                                        value={to}
                                        onChange={e => setTo(e.target.value)}
                                        placeholder={opType === 'transfer_to_vesting' ? `Default: @${request.initiator}` : "username"}
                                        className="w-full bg-dark-800 border border-dark-600 rounded p-2 text-sm focus:border-blue-500 outline-none"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">
                                    {opType === 'delegate_vesting_shares' || opType === 'withdraw_vesting' ? 'Amount (VESTS)' : `Amount (${selectedChain})`}
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="0.000"
                                    className="w-full bg-dark-800 border border-dark-600 rounded p-2 text-sm focus:border-blue-500 outline-none"
                                />
                            </div>

                            {opType === 'transfer' && (
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Memo</label>
                                    <input
                                        value={memo}
                                        onChange={e => setMemo(e.target.value)}
                                        placeholder="Optional note"
                                        className="w-full bg-dark-800 border border-dark-600 rounded p-2 text-sm focus:border-blue-500 outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Generated JSON Preview */}
                    <div className="mt-3">
                        <label className="text-xs text-slate-500 uppercase font-bold flex justify-between">
                            <span>Operation Preview</span>
                            {opType !== 'custom' && <span className="text-[10px] text-blue-400">Read Only (Edit fields above)</span>}
                        </label>
                        <textarea
                            className={`w-full bg-dark-950 border border-dark-600 rounded p-2 text-[10px] font-mono h-24 mt-1 focus:border-blue-500 outline-none ${opType !== 'custom' ? 'text-slate-400' : 'text-white'}`}
                            value={request.operation}
                            onChange={e => opType === 'custom' && setRequest({ ...request, operation: e.target.value })}
                            readOnly={opType !== 'custom'}
                        />
                    </div>
                </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
                Initiate Proposal
            </button>
        </div>
    );
};
