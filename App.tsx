
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
import { HistoryModal } from './components/HistoryModal';
import { SignRequest } from './components/SignRequest';
import { NotificationToast } from './components/NotificationToast'; // Added
import { detectWeb3Context, getAccountBalance, broadcastTransfer } from './services/chainService';
import { saveVault, getVault, clearCryptoCache, tryRestoreSession } from './services/cryptoService';
import { benchmarkNodes } from './services/nodeService';
import { LanguageProvider, useTranslation } from './contexts/LanguageContext';

declare const chrome: any;

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { t } = useTranslation();
  /* State */
  const [walletState, setWalletState] = useState<WalletState>({
    accounts: [],
    encryptedMaster: false,
    useGoogleAuth: false,
    useBiometrics: false
  });

  const [activeChain, setActiveChain] = useState<Chain>(Chain.HIVE);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);

  // Modals / Specific Flow States
  const [showImport, setShowImport] = useState(false);
  const [managingAccount, setManagingAccount] = useState<Account | null>(null);
  const [transferAccount, setTransferAccount] = useState<Account | null>(null);
  const [receiveAccount, setReceiveAccount] = useState<Account | null>(null);
  const [historyAccount, setHistoryAccount] = useState<Account | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [needsSave, setNeedsSave] = useState(false);
  const [web3Context, setWeb3Context] = useState<string | null>(null);

  // Notifications
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [lockReason, setLockReason] = useState<string | null>(null);

  // Signing Request ID
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const req = params.get('requestId');
    if (req) setRequestId(req);
  }, []);

  // 1. Load Initial State & Session
  useEffect(() => {
    const loadState = async () => {
      // Load Vault Metadata
      const vaultData = await getVault();
      if (vaultData) {
        setWalletState(prev => ({
          ...prev,
          accounts: [], // Keys are encrypted
          encryptedMaster: true,
          useGoogleAuth: false,
          useBiometrics: false
        }));
      }

      // Check Active Session (chrome.storage.session)
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
        // Try to restore crypto session first
        const restored = await tryRestoreSession();

        chrome.storage.session.get(['session_accounts'], (res: any) => {
          if (res.session_accounts && res.session_accounts.length > 0) {

            if (restored) {
              setWalletState(prev => ({ ...prev, accounts: res.session_accounts }));
              setIsLocked(false);
              setTimeout(fetchBalances, 500);
            } else {
              console.warn("Session accounts found but crypto key missing. Forcing re-login.");
              chrome.storage.session.remove('session_accounts');
            }

            setIsDataLoaded(true);
            return;
          }
          setIsDataLoaded(true);
        });
      } else {
        setIsDataLoaded(true);
      }

      // Also load walletConfig
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
        });
      }

      const context = detectWeb3Context();
      if (context) setWeb3Context(context);

      benchmarkNodes();
    };
    loadState();
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
      saveVault('cached', vault)
        .then(() => setNeedsSave(false))
        .catch(err => {
          console.warn("Auto-save failed:", err);
          if (err.message && err.message.includes('cache is empty')) {
            setLockReason("Session expired. Please unlock to save changes.");
            setIsLocked(true); // Identify lost session -> Lock
          }
        });
    }
  }, [walletState.accounts, isLocked, needsSave]);

  // 4. Poll Balances automatically
  useEffect(() => {
    let interval: any;
    if (!isLocked && walletState.accounts.length > 0) {
      interval = setInterval(fetchBalances, 12000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked, walletState.accounts.length]);

  const fetchBalances = async () => {
    if (isLocked || walletState.accounts.length === 0) return;
    setIsRefreshing(true);

    const updatedAccounts = await Promise.all(walletState.accounts.map(async (acc) => {
      const balances = await getAccountBalance(acc.chain, acc.name);
      return { ...acc, balance: balances.primary, secondaryBalance: balances.secondary };
    }));

    setWalletState(prev => ({ ...prev, accounts: updatedAccounts }));
    setIsRefreshing(false);
  };

  const handleUnlock = (decryptedAccounts: Account[]) => {
    setWalletState(prev => ({ ...prev, accounts: decryptedAccounts }));
    setIsLocked(false);

    // Save to Session
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
      chrome.storage.session.set({ session_accounts: decryptedAccounts });
    }

    setTimeout(() => fetchBalances(), 500);
  };

  const handleImport = async (newAccounts: Account[]) => {
    const withBalance = await Promise.all(newAccounts.map(async acc => {
      const balances = await getAccountBalance(acc.chain, acc.name);
      return {
        ...acc,
        balance: balances.primary,
        secondaryBalance: balances.secondary
      };
    }));

    setWalletState(prev => ({
      ...prev,
      accounts: [...prev.accounts, ...withBalance]
    }));
    setNeedsSave(true);
    setNotification({ msg: 'Account imported successfully', type: 'success' });
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

  const handleTransfer = async (fromAcc: Account, to: string, amount: string, memo: string, symbol?: string) => {
    if (!fromAcc.activeKey) {
      setNotification({ msg: "No active key found for this account.", type: 'error' });
      return;
    }

    try {
      const result = await broadcastTransfer(
        fromAcc.chain,
        fromAcc.name,
        fromAcc.activeKey,
        to,
        amount,
        memo,
        symbol
      );

      if (result.success) {
        setNotification({ msg: `TX: ${result.txId?.substring(0, 8)}...`, type: 'success' });
        fetchBalances();
      } else {
        setNotification({ msg: `Failed: ${result.error}`, type: 'error' });
      }
    } catch (e) {
      setNotification({ msg: "Unexpected error during broadcast.", type: 'error' });
    }
  };

  const isContextRelevant = (context: string, chain: Chain) => {
    if (chain === Chain.STEEM && context.includes('steemit')) return true;
    if (chain === Chain.HIVE && context.includes('hive')) return true;
    if (chain === Chain.BLURT && context.includes('blurt')) return true;
    return false;
  };

  /* Detached Window State */
  const [isDetached, setIsDetached] = useState(false);

  useEffect(() => {
    const isDetachedMode = typeof window !== 'undefined' && window.location.search.includes('detached=true');
    const TARGET_WIDTH = 360;
    const TARGET_HEIGHT = 700;
    const OUTER_WIDTH = 376;
    const OUTER_HEIGHT = 739;

    if (isDetachedMode) {
      setIsDetached(true);
      document.body.style.width = `${TARGET_WIDTH}px`;
      document.body.style.height = `${TARGET_HEIGHT}px`;
      document.body.style.overflow = 'hidden';

      let animationFrameId: number;
      const lockSize = () => {
        if (window.innerWidth <= 380 && window.innerHeight <= 750 && window.innerWidth >= 350) {
          animationFrameId = requestAnimationFrame(lockSize);
          return;
        }
        const screenW = window.screen.availWidth || window.screen.width;
        const screenH = window.screen.availHeight || window.screen.height;
        const left = Math.round((screenW - OUTER_WIDTH) / 2);
        const top = Math.round((screenH - OUTER_HEIGHT) / 2);
        try {
          window.resizeTo(OUTER_WIDTH, OUTER_HEIGHT);
          window.moveTo(left, top);
        } catch (e) { }

        if (typeof chrome !== 'undefined' && chrome.windows) {
          chrome.windows.getCurrent((win: any) => {
            if (win.state === 'maximized' || win.width > 400 || win.height > 800) {
              chrome.windows.update(win.id, {
                state: 'normal',
                width: OUTER_WIDTH,
                height: OUTER_HEIGHT,
                left: left,
                top: top
              });
            }
          });
        }
        animationFrameId = requestAnimationFrame(lockSize);
      };
      window.addEventListener('resize', lockSize);
      lockSize();
      return () => {
        window.removeEventListener('resize', lockSize);
        cancelAnimationFrame(animationFrameId);
      };
    } else {
      if (typeof chrome !== 'undefined' && chrome.extension) {
        const views = chrome.extension.getViews();
        const detachedView = views.find((v: any) => v.location.href.includes('detached=true'));
        if (detachedView) {
          detachedView.focus();
          window.close();
        }
      }
    }
  }, []);

  const handleToggleDetach = () => {
    if (isDetached) {
      window.close();
    } else {
      const width = 376;
      const height = 739;
      const left = Math.round((window.screen.width / 2) - (width / 2));
      const top = Math.round((window.screen.height / 2) - (height / 2));

      if (typeof chrome !== 'undefined' && chrome.windows) {
        chrome.windows.create({
          url: 'index.html?detached=true',
          type: 'popup',
          width: width,
          height: height,
          left: left,
          top: top,
          focused: true
        });
        window.close();
      } else {
        window.open(
          'index.html?detached=true',
          'GravityWalletDetached',
          `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no,status=no`
        );
        window.close();
      }
    }
  };

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const listener = (changes: any, area: string) => {
        if (area === 'session' && changes.session_accounts) {
          if (!changes.session_accounts.newValue) {
            setIsLocked(true);
            setWalletState(prev => ({ ...prev, accounts: [] }));
          }
        }
      };
      chrome.storage.onChanged.addListener(listener);
      return () => chrome.storage.onChanged.removeListener(listener);
    }
  }, []);

  if (!isDataLoaded) {
    return <div className="h-full bg-dark-900 flex items-center justify-center text-slate-500">Loading...</div>;
  }

  if (isLocked) {
    return (
      <LockScreen
        onUnlock={handleUnlock}
        walletState={walletState}
        setWalletState={setWalletState}
        lockReason={lockReason}
      />
    );
  }

  // SIGNING REQUEST UI
  if (requestId) {
    return <SignRequest requestId={requestId} accounts={walletState.accounts} onComplete={() => window.close()} />;
  }

  return (
    <div className="flex h-full bg-dark-900 text-slate-200 font-sans">
      <Sidebar
        currentView={currentView}
        onChangeView={setCurrentView}
        onLock={() => {
          setWalletState(prev => ({ ...prev, accounts: [] }));
          clearCryptoCache();
          setIsLocked(true);
          if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
            chrome.storage.session.remove('session_accounts');
          }
        }}
        isDetached={isDetached}
        onToggleDetach={handleToggleDetach}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-14 border-b border-dark-700 flex items-center justify-between px-4 bg-dark-800 shadow-md z-10">
          <div className="flex items-center gap-2">
            {currentView === ViewState.LANDING ? (
              <h1 className="font-bold tracking-wider text-sm">{t('sidebar.home').toUpperCase()}</h1>
            ) : currentView === ViewState.MANAGE ? (
              <h1 className="font-bold tracking-wider text-sm text-slate-200">{t('settings.title').toUpperCase()}</h1>
            ) : (
              <>
                <img
                  src={activeChain === Chain.HIVE ? '/Logo_hive.png' : activeChain === Chain.STEEM ? '/logosteem.png' : '/logoblurt.png'}
                  alt={activeChain}
                  className={`w-5 h-5 object-contain ${isRefreshing ? 'animate-spin' : ''}`}
                />
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
              title={t('header.add')}
            >
              {t('header.add')}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
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
              onHistory={(acc) => setHistoryAccount(acc)}
              onRefresh={fetchBalances}
              onAddAccount={() => setShowImport(true)}
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
            <BulkTransfer
              chain={activeChain}
              accounts={walletState.accounts.filter(a => a.chain === activeChain)}
              refreshBalance={fetchBalances}
              onChangeChain={setActiveChain}
            />
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
          accounts={walletState.accounts}
          onTransfer={handleTransfer}
        />
      )}

      {historyAccount && (
        <HistoryModal
          account={historyAccount}
          onClose={() => setHistoryAccount(null)}
        />
      )}

      {receiveAccount && (
        <ReceiveModal
          account={receiveAccount}
          onClose={() => setReceiveAccount(null)}
          accounts={walletState.accounts}
        />
      )}

      {notification && (
        <NotificationToast
          message={notification.msg}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
