
import React, { useState, useEffect } from 'react';
import { Account, Chain } from '../types';
import { fetchAccountData, ChainAccountData } from '../services/chainService';
import { validateUsername, validatePrivateKey, verifyKeyAgainstChain } from '../services/validationService';
import { useTranslation } from '../contexts/LanguageContext';

interface ImportModalProps {
  onClose: () => void;
  onImport: (accounts: Account[]) => void;
  initialChain?: Chain;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImport, initialChain }) => {
  const { t } = useTranslation();
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

  // Drag State
  const [isDragging, setIsDragging] = useState(false);

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

  const processFileContent = (text: string) => {
    try {
      let newAccounts: Account[] = [];

      // Simple JSON
      if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
        const json = JSON.parse(text);
        const list = Array.isArray(json) ? json : (json.list || json.accounts || [json]);
        newAccounts = list.map((item: any) => ({
          name: item.name || item.username || item.account,
          chain: selectedChain,
          publicKey: 'IMPORTED',
          postingKey: item.postingKey || item.posting || item.privatePostingKey,
          activeKey: item.activeKey || item.active || item.privateActiveKey,
          memoKey: item.memoKey || item.memo || item.privateMemoKey
        })).filter((a: Account) => a.name && (a.postingKey || a.activeKey));
      } else {
        // CSV/Lines: username,key1,key2...
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        newAccounts = lines.map(line => {
          const parts = line.replace(/"/g, '').split(/[,;\t]/).map(s => s.trim());
          if (parts.length < 2) return null;
          return {
            name: parts[0],
            chain: selectedChain,
            publicKey: 'IMPORTED',
            postingKey: parts[1],
            activeKey: parts[2],
            memoKey: parts[3]
          };
        }).filter(Boolean) as Account[];
      }

      if (newAccounts.length > 0) {
        onImport(newAccounts);
        onClose();
      } else {
        setGeneralError(t('import.no_valid_accounts'));
      }
    } catch (err) {
      setGeneralError(t('import.error_file_read'));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => processFileContent(ev.target?.result as string);
      reader.readAsText(file);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col max-h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('import.title')}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
        </div>

        <div className="flex gap-4 mb-5 text-sm border-b border-dark-700">
          <button className={`pb-2 border-b-2 px-2 transition-colors ${method === 'manual' ? 'border-blue-500 text-white font-medium' : 'border-transparent text-slate-500'}`} onClick={() => setMethod('manual')}>
            {t('import.manual')}
          </button>
          <button className={`pb-2 border-b-2 px-2 transition-colors ${method === 'file' ? 'border-blue-500 text-white font-medium' : 'border-transparent text-slate-500'}`} onClick={() => setMethod('file')}>
            {t('import.file')}
          </button>
        </div>

        {method === 'manual' ? (
          <>
            <div className="space-y-4 overflow-y-auto custom-scrollbar pr-1 flex-1">

              {/* Chain Selector */}
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">{t('import.select_chain')}</label>
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
                  <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">{t('import.username')}</label>
                  {isVerifying && <span className="text-xs text-blue-400 animate-pulse">{t('import.checking')}</span>}
                  {chainData && !isVerifying && <span className="text-xs text-green-400 font-bold">{t('import.found')}</span>}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[@\s\u200B-\u200D\uFEFF]/g, ''))}
                    className={`w-full bg-dark-900 border ${usernameError ? 'border-red-500' : (chainData ? 'border-green-500' : 'border-dark-600')} rounded-lg py-2 pl-7 pr-3 text-sm text-white focus:outline-none`}
                    placeholder={t('import.placeholder_username')}
                    disabled={isSaving}
                  />
                </div>
                {usernameError && <p className="text-[10px] text-red-400 mt-1">{usernameError}</p>}
              </div>

              {/* Keys */}
              <div className="space-y-3 pt-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider border-b border-dark-700 pb-1">{t('import.private_keys')}</p>

                <div>
                  <label className="text-[10px] text-blue-400 mb-1 block flex justify-between">
                    <span>{t('import.key_posting')}</span>
                    {validatePrivateKey(postingKey) && postingKey.length > 0 && <span className="text-red-400">{t('import.invalid_format')}</span>}
                  </label>
                  <input
                    type="password"
                    value={postingKey}
                    onChange={(e) => { setPostingKey(e.target.value); setGeneralError(null); }}
                    className="w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none"
                    placeholder={t('import.placeholder_key')}
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-green-400 mb-1 block flex justify-between">
                    <span>{t('import.key_active')}</span>
                    {validatePrivateKey(activeKey) && activeKey.length > 0 && <span className="text-red-400">{t('import.invalid_format')}</span>}
                  </label>
                  <input
                    type="password"
                    value={activeKey}
                    onChange={(e) => { setActiveKey(e.target.value); setGeneralError(null); }}
                    className="w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none"
                    placeholder={t('import.placeholder_key')}
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 mb-1 block flex justify-between">
                    <span>{t('import.key_memo')}</span>
                    {validatePrivateKey(memoKey) && memoKey.length > 0 && <span className="text-red-400">{t('import.invalid_format')}</span>}
                  </label>
                  <input
                    type="password"
                    value={memoKey}
                    onChange={(e) => { setMemoKey(e.target.value); setGeneralError(null); }}
                    className="w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none"
                    placeholder={t('import.placeholder_key')}
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-dark-700">
              {generalError && <div className="bg-red-900/20 border border-red-500/50 p-2 rounded text-xs text-red-200 text-center mb-2">{generalError}</div>}
              <button
                onClick={processManualImport}
                disabled={!chainData || !!usernameError || isSaving}
                className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg ${!chainData || !!usernameError || isSaving ? 'bg-dark-700 text-slate-500 cursor-not-allowed' :
                  selectedChain === Chain.HIVE ? 'bg-hive hover:bg-red-700 text-white' :
                    selectedChain === Chain.STEEM ? 'bg-steem hover:bg-blue-800 text-white' : 'bg-blurt hover:bg-orange-700 text-white'
                  }`}
              >
                {isSaving ? t('import.verifying') : t('import.save')}
              </button>
            </div>
          </>
        ) : (
          <div
            className={`h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center mb-4 transition-colors relative group ${isDragging ? 'bg-blue-900/20 border-blue-500' : 'bg-dark-900/50 border-dark-600 hover:bg-dark-800'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <svg className={`w-12 h-12 mb-3 transition-opacity ${isDragging ? 'text-blue-400 scale-110' : 'text-blue-500 opacity-50 group-hover:opacity-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p className="text-sm text-slate-300 font-bold pointer-events-none">{t('import.drag_drop')}</p>
            <p className="text-xs text-slate-500 mt-1 pointer-events-none">{t('import.click_upload')}</p>
            {generalError && <p className="text-xs text-red-400 mt-2 absolute bottom-4 w-full text-center px-4">{generalError}</p>}

            <input
              type="file"
              accept=".json,.csv,.txt"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => processFileContent(ev.target?.result as string);
                  reader.readAsText(file);
                }
              }}
            />
          </div>
        )}
      </div>
    </div >
  );
};