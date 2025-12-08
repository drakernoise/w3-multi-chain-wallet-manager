import { useState, useEffect } from 'react';
import { Chain, ViewState, Account, WalletState, Vault } from './types';
import { LockScreen } from './components/LockScreen';
import { Sidebar } from './components/Sidebar';
import { Landing } from './components/Landing';
import { ManageWallets } from './components/ManageWallets';
import { WalletView } from './components/WalletView';
import { BulkTransfer } from './components/BulkTransfer';
import { MultiSig } from './components/MultiSig';
import { ImportModal } from './components/ImportModal';
import { ManageAccountModal } from './components/ManageAccountModal';
import { TransferModal } from './components/TransferModal';
import { ReceiveModal } from './components/ReceiveModal';
import { detectWeb3Context, getAccountBalance, broadcastTransfer } from './services/chainService';
import { saveVault } from './services/cryptoService';
import { benchmarkNodes } from './services/nodeService';

declare const chrome: any;

export default function App() {
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [activeChain, setActiveChain] = useState<Chain>(Chain.HIVE);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);

  // Modal States
  const [showImport, setShowImport] = useState<boolean>(false);
  const [managingAccount, setManagingAccount] = useState<Account | null>(null);
  const [transferAccount, setTransferAccount] = useState<Account | null>(null);
  const [receiveAccount, setReceiveAccount] = useState<Account | null>(null);

  const [web3Context, setWeb3Context] = useState<string | null>(null);

  // Wallet State
  const [walletState, setWalletState] = useState<WalletState>({
    accounts: [],
    encryptedMaster: false,
    useGoogleAuth: false,
    useBiometrics: false
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [needsSave, setNeedsSave] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Load Initial State
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['walletConfig'], (result: any) => {
        if (result.walletConfig) {
          setWalletState(prev => ({
            ...prev,
            encryptedMaster: result.walletConfig.encryptedMaster,
            useGoogleAuth: result.walletConfig.useGoogleAuth,
            useBiometrics: result.walletConfig.useBiometrics
          }));
        }
        setIsDataLoaded(true);
      });
    } else {
      setIsDataLoaded(true);
    }

    const context = detectWeb3Context();
    if (context) setWeb3Context(context);

    // Start Node Benchmark in background
    benchmarkNodes();
  }, []);

  // 2. Save Config when it changes
  useEffect(() => {
    if (isDataLoaded) {
      const config = {
        encryptedMaster: walletState.encryptedMaster,
        useGoogleAuth: walletState.useGoogleAuth,
        useBiometrics: walletState.useBiometrics
      };
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ walletConfig: config });
      }
    }
  }, [walletState.encryptedMaster, walletState.useGoogleAuth, walletState.useBiometrics, isDataLoaded]);

  // 3. Save Vault when accounts change
  useEffect(() => {
    if (!isLocked && needsSave && walletState.encryptedMaster) {
      const vault: Vault = { accounts: walletState.accounts, lastUpdated: Date.now() };
      saveVault('cached', vault).then(() => setNeedsSave(false));
    }
  }, [walletState.accounts, isLocked, needsSave]);

  // 4. Poll Balances when unlocked
  const fetchBalances = async () => {
    if (isLocked || walletState.accounts.length === 0) return;
    setIsRefreshing(true);

    const updatedAccounts = await Promise.all(walletState.accounts.map(async (acc) => {
      // Only fetch if chain matches current view to save bandwidth, OR fetch all?
      // Let's fetch all so totals are correct.
      const balance = await getAccountBalance(acc.chain, acc.name);
      return { ...acc, balance };
    }));

    setWalletState(prev => ({ ...prev, accounts: updatedAccounts }));
    setIsRefreshing(false);
    // Note: We generally don't persist balances to vault to avoid excessive writes,
    // but if we wanted to cache them offline, we would setNeedsSave(true) here.
  };

  const handleUnlock = (decryptedAccounts: Account[]) => {
    setWalletState(prev => ({ ...prev, accounts: decryptedAccounts }));
    setIsLocked(false);
    // Trigger balance fetch shortly after unlock
    setTimeout(() => fetchBalances(), 500);
  };

  const handleImport = async (newAccounts: Account[]) => {
    // Fetch initial balance for new account immediately
    const withBalance = await Promise.all(newAccounts.map(async acc => ({
      ...acc,
      balance: await getAccountBalance(acc.chain, acc.name)
    })));

    setWalletState(prev => ({
      ...prev,
      accounts: [...prev.accounts, ...withBalance]
    }));
    setNeedsSave(true);
    setShowImport(false);
  };

  const handleUpdateAccount = (updatedAccount: Account) => {
    setWalletState(prev => ({
      ...prev,
      accounts: prev.accounts.map(acc =>
        (acc.name === updatedAccount.name && acc.chain === updatedAccount.chain)
          ? updatedAccount
          : acc
      )
    }));
    setNeedsSave(true);
    setManagingAccount(null);
  };

  const handleDeleteAccount = (accountToDelete: Account) => {
    setWalletState(prev => ({
      ...prev,
      accounts: prev.accounts.filter(acc =>
        !(acc.name === accountToDelete.name && acc.chain === accountToDelete.chain)
      )
    }));
    setNeedsSave(true);
    setManagingAccount(null);
  };

  // BROADCAST TO BLOCKCHAIN
  const handleTransfer = async (fromAcc: Account, to: string, amount: string, memo: string) => {
    if (!fromAcc.activeKey) {
      alert("No active key found for this account.");
      return;
    }

    try {
      const result = await broadcastTransfer(
        fromAcc.chain,
        fromAcc.name,
        fromAcc.activeKey,
        to,
        amount,
        memo
      );

      if (result.success) {
        alert(`Transaction Successful! TX: ${result.txId?.substring(0, 8)}...`);
        fetchBalances(); // Refresh to show new balance
      } else {
        alert(`Transaction Failed: ${result.error}`);
      }
    } catch (e) {
      alert("Unexpected error during broadcast.");
    }
  };

  const isContextRelevant = (context: string, chain: Chain) => {
    if (chain === Chain.STEEM && context.includes('steemit')) return true;
    if (chain === Chain.HIVE && context.includes('hive')) return true;
    if (chain === Chain.BLURT && context.includes('blurt')) return true;
    return false;
  };

  if (!isDataLoaded) {
    return <div className="h-full bg-dark-900 flex items-center justify-center text-slate-500">Loading...</div>;
  }

  if (isLocked) {
    return (
      <LockScreen
        onUnlock={handleUnlock}
        walletState={walletState}
        setWalletState={setWalletState}
      />
    );
  }

  return (
    <div className="flex h-full bg-dark-900 text-slate-200 font-sans">
      <Sidebar
        currentView={currentView}
        onChangeView={setCurrentView}
        onLock={() => {
          setWalletState(prev => ({ ...prev, accounts: [] }));
          setIsLocked(true);
        }}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-14 border-b border-dark-700 flex items-center justify-between px-4 bg-dark-800 shadow-md z-10">
          <div className="flex items-center gap-2">
            {currentView === ViewState.LANDING ? (
              <h1 className="font-bold tracking-wider text-sm">HOME</h1>
            ) : (
              <>
                <div className={`w-3 h-3 rounded-full ${activeChain === Chain.HIVE ? 'bg-hive' :
                  activeChain === Chain.STEEM ? 'bg-steem' : 'bg-blurt'
                  } ${isRefreshing ? 'animate-spin' : ''} shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
                <h1 className="font-bold tracking-wider text-sm">{activeChain} NETWORK</h1>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {web3Context && currentView !== ViewState.LANDING && isContextRelevant(web3Context, activeChain) && (
              <div className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded border border-green-800 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                {web3Context}
              </div>
            )}
            <button
              onClick={() => setShowImport(true)}
              className="text-xs bg-dark-700 hover:bg-dark-600 px-2 py-1 rounded text-slate-300 transition-colors"
            >
              + Add
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {currentView === ViewState.LANDING && (
            <Landing
              onSelectChain={(chain) => {
                setActiveChain(chain);
                setCurrentView(ViewState.WALLET);
              }}
              onManage={() => setCurrentView(ViewState.MANAGE)}
            />
          )}

          {currentView === ViewState.WALLET && (
            <WalletView
              chain={activeChain}
              onChainChange={setActiveChain}
              accounts={walletState.accounts.filter(a => a.chain === activeChain)}
              onManage={(acc) => setManagingAccount(acc)}
              onSend={(acc) => setTransferAccount(acc)}
              onReceive={(acc) => setReceiveAccount(acc)}
              onRefresh={fetchBalances}
            />
          )}

          {currentView === ViewState.MANAGE && (
            <ManageWallets
              accounts={walletState.accounts}
              onEdit={(acc) => setManagingAccount(acc)}
              onImport={() => setShowImport(true)}
            />
          )}

          {currentView === ViewState.BULK && (
            <BulkTransfer chain={activeChain} accounts={walletState.accounts} />
          )}

          {currentView === ViewState.MULTISIG && (
            <MultiSig chain={activeChain} accounts={walletState.accounts} />
          )}
        </div>
      </main>

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImport={handleImport}
          initialChain={activeChain}
        />
      )}

      {managingAccount && (
        <ManageAccountModal
          account={managingAccount}
          onClose={() => setManagingAccount(null)}
          onSave={handleUpdateAccount}
          onDelete={handleDeleteAccount}
        />
      )}

      {transferAccount && (
        <TransferModal
          account={transferAccount}
          onClose={() => setTransferAccount(null)}
          accounts={walletState.accounts} // Pass all accounts for switcher
          onTransfer={handleTransfer}
        />
      )}

      {receiveAccount && (
        <ReceiveModal
          account={receiveAccount}
          onClose={() => setReceiveAccount(null)}
          accounts={walletState.accounts} // Pass all accounts for switcher
        />
      )}
    </div>
  );
}
