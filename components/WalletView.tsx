import React from 'react';
import { Chain, Account } from '../types';

interface WalletViewProps {
  chain: Chain;
  onChainChange: (chain: Chain) => void;
  accounts: Account[];
  onManage?: (account: Account) => void;
  onSend?: (account: Account) => void;
  onReceive?: (account: Account) => void;
  onRefresh?: () => void; // New prop to trigger balance reload
}

export const WalletView: React.FC<WalletViewProps> = ({
  chain,
  onChainChange,
  accounts,
  onManage,
  onSend,
  onReceive,
  onRefresh
}) => {
  return (
    <div className="space-y-4">
      {/* Header with Network Selector and Refresh */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Network</h2>
          <select
            value={chain}
            onChange={(e) => onChainChange(e.target.value as Chain)}
            className="bg-dark-800 border border-dark-600 rounded-lg px-2 py-1 text-sm font-bold text-white focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value={Chain.HIVE}>HIVE</option>
            <option value={Chain.STEEM}>STEEM</option>
            <option value={Chain.BLURT}>BLURT</option>
          </select>
        </div>

        <button
          onClick={onRefresh}
          className="p-2 bg-dark-800 rounded-full hover:bg-dark-700 hover:text-blue-400 text-slate-400 transition-colors"
          title="Refresh Balances"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-4 border border-dashed border-dark-700 rounded-xl bg-dark-800/30">
          <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <div className="text-center">
            <p className="font-bold">No {chain} accounts found</p>
            <p className="text-xs mt-1">Select a different network or add an account.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => {
            // Use the real balance stored in state, default to 0 if loading
            const balance = account.balance || 0;
            const hasActive = !!account.activeKey;
            const hasPosting = !!account.postingKey;

            return (
              <div key={`${account.chain}-${account.name}`} className="bg-dark-800 rounded-xl p-4 border border-dark-700 shadow-sm relative overflow-hidden group">
                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white to-transparent opacity-5 rounded-bl-full pointer-events-none ${chain === Chain.HIVE ? 'from-hive' : chain === Chain.STEEM ? 'from-steem' : 'from-blurt'
                  }`} />

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      @{account.name}
                      <div className="flex gap-1">
                        {hasActive && <span className="w-2 h-2 rounded-full bg-green-500" title="Active Key Present"></span>}
                        {hasPosting && <span className="w-2 h-2 rounded-full bg-blue-500" title="Posting Key Present"></span>}
                      </div>
                    </h3>
                    <button
                      onClick={() => onManage && onManage(account)}
                      className="text-[10px] bg-dark-900/50 hover:bg-dark-700 text-slate-400 hover:text-white px-2 py-1 rounded border border-dark-600 mt-1 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                      Manage Keys
                    </button>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="text-2xl font-mono font-bold">{balance.toFixed(3)}</p>
                    <p className="text-xs text-slate-400 font-bold tracking-wider mb-1">{chain} COIN</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => onSend && onSend(account)}
                    className="bg-dark-700 hover:bg-dark-600 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    Send
                  </button>
                  <button
                    onClick={() => onReceive && onReceive(account)}
                    className="bg-dark-700 hover:bg-dark-600 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Receive
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
