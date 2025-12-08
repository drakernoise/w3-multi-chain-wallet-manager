import React, { useState } from 'react';
import { Account } from '../types';
import { validatePrivateKey } from '../services/validationService';

interface ManageAccountModalProps {
  account: Account;
  onClose: () => void;
  onSave: (updatedAccount: Account) => void;
  onDelete: (account: Account) => void;
}

export const ManageAccountModal: React.FC<ManageAccountModalProps> = ({ account, onClose, onSave, onDelete }) => {
  const [postingKey, setPostingKey] = useState(account.postingKey || '');
  const [activeKey, setActiveKey] = useState(account.activeKey || '');
  const [memoKey, setMemoKey] = useState(account.memoKey || '');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setError(null);
    const pErr = validatePrivateKey(postingKey);
    const aErr = validatePrivateKey(activeKey);
    const mErr = validatePrivateKey(memoKey);

    if (pErr && postingKey) return setError("Invalid Posting Key format");
    if (aErr && activeKey) return setError("Invalid Active Key format");
    if (mErr && memoKey) return setError("Invalid Memo Key format");

    onSave({
      ...account,
      postingKey: postingKey.trim() || undefined,
      activeKey: activeKey.trim() || undefined,
      memoKey: memoKey.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col max-h-full">
        <div className="flex justify-between items-center mb-4">
          <div>
             <h2 className="text-xl font-bold">Manage Account</h2>
             <p className="text-xs text-slate-500">@{account.name} • {account.chain}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
        </div>

        {!showConfirmDelete ? (
            <>
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-[10px] text-blue-400 mb-1 block uppercase font-bold">Posting Key</label>
                        <input 
                            type="password"
                            value={postingKey}
                            onChange={(e) => setPostingKey(e.target.value)}
                            className={`w-full bg-dark-900 border ${validatePrivateKey(postingKey) && postingKey ? 'border-red-500' : 'border-dark-600'} rounded p-2 text-xs font-mono text-slate-300 focus:outline-none`}
                            placeholder="Add Posting Private Key"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] text-green-400 mb-1 block uppercase font-bold">Active Key</label>
                        <input 
                            type="password"
                            value={activeKey}
                            onChange={(e) => setActiveKey(e.target.value)}
                            className={`w-full bg-dark-900 border ${validatePrivateKey(activeKey) && activeKey ? 'border-red-500' : 'border-dark-600'} rounded p-2 text-xs font-mono text-slate-300 focus:outline-none`}
                            placeholder="Add Active Private Key"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] text-slate-400 mb-1 block uppercase font-bold">Memo Key</label>
                        <input 
                            type="password"
                            value={memoKey}
                            onChange={(e) => setMemoKey(e.target.value)}
                            className={`w-full bg-dark-900 border ${validatePrivateKey(memoKey) && memoKey ? 'border-red-500' : 'border-dark-600'} rounded p-2 text-xs font-mono text-slate-300 focus:outline-none`}
                            placeholder="Add Memo Private Key"
                        />
                    </div>
                </div>

                {error && <p className="text-xs text-red-400 text-center mb-2">{error}</p>}

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleSave} 
                        className="w-full py-3 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg"
                    >
                        Save Changes
                    </button>
                    
                    <button 
                        onClick={() => setShowConfirmDelete(true)}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                    >
                        Remove Account
                    </button>
                </div>
            </>
        ) : (
            <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <h3 className="font-bold text-white mb-2">Remove @{account.name}?</h3>
                <p className="text-xs text-slate-400 mb-6">This will remove the account and all associated keys. This cannot be undone.</p>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowConfirmDelete(false)}
                        className="flex-1 py-2 rounded bg-dark-700 hover:bg-dark-600 text-slate-300 text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onDelete(account)}
                        className="flex-1 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-sm"
                    >
                        Remove
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};