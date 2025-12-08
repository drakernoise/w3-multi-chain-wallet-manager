import React, { useState, useEffect } from 'react';
import { Account, Chain } from '../types';
import { fetchAccountData, ChainAccountData } from '../services/chainService';
import { validateUsername, validatePrivateKey, verifyKeyAgainstChain } from '../services/validationService';

interface ImportModalProps {
  onClose: () => void;
  onImport: (accounts: Account[]) => void;
  initialChain?: Chain;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImport, initialChain }) => {
  const [method, setMethod] = useState<'manual' | 'file'>('manual');

  const [selectedChain, setSelectedChain] = useState<Chain>(initialChain || Chain.HIVE);
  const [username, setUsername] = useState('');
  const [postingKey, setPostingKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [memoKey, setMemoKey] = useState('');

  // Validation State
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [chainData, setChainData] = useState<ChainAccountData | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Debounce username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username.length > 2) {
        verifyUsername();
      } else {
        setChainData(null);
        setUsernameError(null);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [username, selectedChain]);

  const verifyUsername = async () => {
    const formatError = validateUsername(username);
    if (formatError) {
      setUsernameError(formatError);
      setChainData(null);
      return;
    }

    setIsVerifying(true);
    setUsernameError(null);
    const data = await fetchAccountData(selectedChain, username.trim().toLowerCase());
    setIsVerifying(false);

    if (data) {
      setChainData(data);
    } else {
      setChainData(null);
      setUsernameError(`Account not found on ${selectedChain}`);
    }
  };

  const processManualImport = async () => {
    setGeneralError(null);

    // 1. Username Validation
    if (usernameError || !chainData) {
      setGeneralError("Please enter a valid, existing username.");
      return;
    }

    // 2. Key Format Validation
    const postingErr = validatePrivateKey(postingKey);
    const activeErr = validatePrivateKey(activeKey);
    const memoErr = validatePrivateKey(memoKey);

    if (postingErr || activeErr || memoErr) {
      setGeneralError("One or more keys have an invalid format.");
      return;
    }

    // 3. Requirement Check
    if (!postingKey && !activeKey && !memoKey) {
      setGeneralError("You must provide at least one private key.");
      return;
    }

    setIsSaving(true);

    // 4. Verify Keys against Chain
    if (postingKey) {
      const isValid = await verifyKeyAgainstChain(selectedChain, username, postingKey, 'posting');
      if (!isValid) {
        setGeneralError("Posting Key does not match the account on chain.");
        setIsSaving(false);
        // Optionally clear the invalid key or highlight it
        return;
      }
    }

    if (activeKey) {
      const isValid = await verifyKeyAgainstChain(selectedChain, username, activeKey, 'active');
      if (!isValid) {
        setGeneralError("Active Key does not match the account on chain.");
        setIsSaving(false);
        return;
      }
    }

    if (memoKey) {
      const isValid = await verifyKeyAgainstChain(selectedChain, username, memoKey, 'memo');
      if (!isValid) {
        setGeneralError("Memo Key does not match the account on chain.");
        setIsSaving(false);
        return;
      }
    }

    // 5. Create Account
    const newAccount: Account = {
      name: chainData.name,
      chain: selectedChain,
      publicKey: 'IMPORTED', // Placeholder
      postingKey: postingKey.trim() || undefined,
      activeKey: activeKey.trim() || undefined,
      memoKey: memoKey.trim() || undefined
    };

    onImport([newAccount]);
    setIsSaving(false);
  };

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col max-h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Import Wallet</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
        </div>

        <div className="flex gap-4 mb-5 text-sm border-b border-dark-700">
          <button className={`pb-2 border-b-2 px-2 transition-colors ${method === 'manual' ? 'border-blue-500 text-white font-medium' : 'border-transparent text-slate-500'}`} onClick={() => setMethod('manual')}>
            Manual Entry
          </button>
          <button className={`pb-2 border-b-2 px-2 transition-colors ${method === 'file' ? 'border-blue-500 text-white font-medium' : 'border-transparent text-slate-500'}`} onClick={() => setMethod('file')}>
            Upload File
          </button>
        </div>

        {method === 'manual' ? (
          <div className="space-y-4 overflow-y-auto custom-scrollbar pr-1">

            {/* Chain Selector */}
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">Select Chain</label>
              <div className="grid grid-cols-3 gap-2">
                {[Chain.HIVE, Chain.STEEM, Chain.BLURT].map(chain => (
                  <button
                    key={chain}
                    onClick={() => { setSelectedChain(chain); setChainData(null); }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all border ${selectedChain === chain
                      ? chain === Chain.HIVE ? 'bg-hive border-hive text-white'
                        : chain === Chain.STEEM ? 'bg-steem border-steem text-white'
                          : 'bg-blurt border-blurt text-white'
                      : 'bg-dark-900 border-dark-700 text-slate-400 hover:bg-dark-700'
                      }`}
                  >
                    {chain}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <div className="flex justify-between">
                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Username</label>
                {isVerifying && <span className="text-xs text-blue-400 animate-pulse">Checking chain...</span>}
                {chainData && !isVerifying && <span className="text-xs text-green-400 font-bold">✓ Found on Chain</span>}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full bg-dark-900 border ${usernameError ? 'border-red-500' : (chainData ? 'border-green-500' : 'border-dark-600')} rounded-lg py-2 pl-7 pr-3 text-sm text-white focus:outline-none`}
                  placeholder="username"
                  disabled={isSaving}
                />
              </div>
              {usernameError && <p className="text-[10px] text-red-400 mt-1">{usernameError}</p>}
            </div>

            {/* Keys */}
            <div className="space-y-3 pt-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider border-b border-dark-700 pb-1">Private Keys (Paste at least one)</p>

              <div>
                <label className="text-[10px] text-blue-400 mb-1 block flex justify-between">
                  <span>POSTING KEY</span>
                  {validatePrivateKey(postingKey) && postingKey.length > 0 && <span className="text-red-400">Invalid Format</span>}
                </label>
                <input
                  type="password"
                  value={postingKey}
                  onChange={(e) => setPostingKey(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none"
                  placeholder="Starts with 5..."
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="text-[10px] text-green-400 mb-1 block flex justify-between">
                  <span>ACTIVE KEY</span>
                  {validatePrivateKey(activeKey) && activeKey.length > 0 && <span className="text-red-400">Invalid Format</span>}
                </label>
                <input
                  type="password"
                  value={activeKey}
                  onChange={(e) => setActiveKey(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none"
                  placeholder="Starts with 5..."
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 mb-1 block flex justify-between">
                  <span>MEMO KEY</span>
                  {validatePrivateKey(memoKey) && memoKey.length > 0 && <span className="text-red-400">Invalid Format</span>}
                </label>
                <input
                  type="password"
                  value={memoKey}
                  onChange={(e) => setMemoKey(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none"
                  placeholder="Starts with 5..."
                  disabled={isSaving}
                />
              </div>
            </div>

            {generalError && <div className="bg-red-900/20 border border-red-500/50 p-2 rounded text-xs text-red-200 text-center">{generalError}</div>}

            <button
              onClick={processManualImport}
              disabled={!chainData || !!usernameError || isSaving}
              className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg mt-2 ${!chainData || !!usernameError || isSaving ? 'bg-dark-700 text-slate-500 cursor-not-allowed' :
                selectedChain === Chain.HIVE ? 'bg-hive hover:bg-red-700 text-white' :
                  selectedChain === Chain.STEEM ? 'bg-steem hover:bg-blue-800 text-white' : 'bg-blurt hover:bg-orange-700 text-white'
                }`}
            >
              {isSaving ? 'Verifying Keys...' : `Save ${selectedChain} Account`}
            </button>

          </div>
        ) : (
          <div className="h-64 border-2 border-dashed border-dark-600 rounded-lg flex flex-col items-center justify-center mb-4 bg-dark-900/50">
            <span className="text-slate-500 text-xs">File import not implemented in demo.</span>
          </div>
        )}
      </div>
    </div>
  );
};