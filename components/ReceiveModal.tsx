import React, { useState } from 'react';
import { Account } from '../types';

interface ReceiveModalProps {
  account: Account;
  accounts: Account[];
  onClose: () => void;
}

export const ReceiveModal: React.FC<ReceiveModalProps> = ({ account: initialAccount, accounts, onClose }) => {
  const [selectedAccount, setSelectedAccount] = useState<Account>(initialAccount);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedAccount.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col items-center text-center">
        <h2 className="text-xl font-bold mb-1">Receive Funds</h2>
        
        <div className="w-full mb-4">
            <select 
                value={`${selectedAccount.chain}-${selectedAccount.name}`}
                onChange={(e) => {
                    const [c, n] = e.target.value.split('-');
                    const acc = accounts.find(a => a.chain === c && a.name === n);
                    if(acc) setSelectedAccount(acc);
                }}
                className="bg-dark-900 border border-dark-600 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500 mx-auto block"
            >
                {accounts.map(a => (
                    <option key={`${a.chain}-${a.name}`} value={`${a.chain}-${a.name}`}>
                        @{a.name} ({a.chain})
                    </option>
                ))}
            </select>
        </div>

        <p className="text-xs text-slate-400 mb-6">Scan QR to send {selectedAccount.chain} to this account</p>

        <div className="bg-white p-2 rounded-lg mb-6">
            <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedAccount.name}`} 
                alt="QR Code" 
                className="w-32 h-32"
            />
        </div>

        <label className="text-xs text-slate-500 uppercase font-bold mb-2">Account Name</label>
        <div 
            onClick={handleCopy}
            className="w-full bg-dark-900 border border-dark-600 rounded-lg py-3 px-4 flex justify-between items-center cursor-pointer hover:border-blue-500 transition-colors group"
        >
            <span className="font-mono text-lg text-white">@{selectedAccount.name}</span>
            <span className={`text-xs ${copied ? 'text-green-400' : 'text-slate-500 group-hover:text-white'}`}>
                {copied ? 'Copied!' : 'Copy'}
            </span>
        </div>

        <button onClick={onClose} className="mt-8 text-slate-400 hover:text-white">Close</button>
      </div>
    </div>
  );
};
