import { useState, useEffect, useRef } from 'react';
import { Account, Chain, ViewState, WalletState, Vault } from '@types';
import { chatService, ChatMessage } from '@services/chatService';
import { LockScreen } from '@components/LockScreen';
import { Sidebar } from '@components/Sidebar';
import { Landing } from '@components/Landing';
import { ManageWallets } from '@components/ManageWallets';
import { WalletView } from '@components/WalletView';
import { BulkTransfer } from '@components/BulkTransfer';
import { MultiSig } from '@components/MultiSig';
import { ImportModal } from '@components/ImportModal';
import { ManageAccountModal } from '@components/ManageAccountModal';
import { TransferModal } from '@components/TransferModal';
import { ReceiveModal } from '@components/ReceiveModal';
import { HistoryModal } from '@components/HistoryModal';
import { SignRequest } from '@components/SignRequest';
import { HelpView } from '@components/HelpView';
import { ChatView } from '@components/ChatView';
import { BridgeModal } from '@components/BridgeModal';
import { SyncPayload } from '@types';
// NotificationToast is now handled by NotificationProvider


import {
  fetchBalances as serviceFetchBalances,
  broadcastTransfer,
  detectWeb3Context
} from '@services/chainService';
import {
  saveVault,
  getVault,
  clearCryptoCache,
  tryRestoreSession,
  enablePasswordless,
  unlockVault,
  loadInternalKeyWithPin,
  hasPinProtectedKey
} from '@services/cryptoService';
import { benchmarkNodes } from '@services/nodeService';
import { bridgeService } from '@services/bridgeService';
import { LanguageProvider, useTranslation } from '@contexts/LanguageContext';
import { NotificationProvider, useNotification } from '@contexts/NotificationContext';
import { storageService } from '@services/storageService';

declare const chrome: any;

export default function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
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
    useBiometrics: false,
    useDeviceAuth: false
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

  const buildBridgeSyncPayload = (accounts: Account[]): SyncPayload => ({
    timestamp: Date.now(),
    accounts,
    chatIdentity: chatService.getSyncIdentity() || undefined,
    settings: {
      useGoogleAuth: walletState.useGoogleAuth,
      useBiometrics: walletState.useBiometrics,
      useDeviceAuth: walletState.useDeviceAuth,
      useTOTP: walletState.useTOTP
    }
  });
  const [web3Context, setWeb3Context] = useState<string | null>(null);

  // Notifications
  const { showNotification } = useNotification();
  const [lockReason, setLockReason] = useState<string | null>(null);

  // Signing Request ID
  const [requestId, setRequestId] = useState<string | null>(null);
  const [showBridge, setShowBridge] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const req = params.get('requestId');
    if (req) setRequestId(req);
  }, []);

  useEffect(() => {
    const handleOpenBridge = () => setShowBridge(true);
    const handleOpenPair = () => setShowBridge(true);
    window.addEventListener('open-bridge', handleOpenBridge);
    window.addEventListener('open-pair', handleOpenPair);
    return () => {
      window.removeEventListener('open-bridge', handleOpenBridge);
      window.removeEventListener('open-pair', handleOpenPair);
    };
  }, []);

  // 1. Global Chat Listeners for Toasts
  useEffect(() => {
    chatService.init();

    // Set up a global onMessage handler for toasts
    const chatListener = (_roomId: string, message: ChatMessage) => {
      // If message is not from US, show toast
      const myUser = chatService.getCurrentUser();
      if (myUser && message.senderId !== myUser.id) {
        showNotification(`${message.senderName}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`, 'info');
      }
    };

    chatService.addMessageListener(chatListener);
    return () => chatService.removeMessageListener(chatListener);
  }, [showNotification]);

  // 1.5. Bridge PIN Validation Listener
  useEffect(() => {
    bridgeService.onValidatePIN = async (pin) => {
      try {
        // Step 1: Try direct unlock (Password mode)
        let vault = await unlockVault(pin);

        // Step 2: Try PIN-protected internal key resolution (for PIN mode)
        if (!vault && pin && pin.length === 6) {
          const hasPin = await hasPinProtectedKey();
          if (hasPin) {
            const internalKey = await loadInternalKeyWithPin(pin);
            if (internalKey) {
              vault = await unlockVault(internalKey);
            }
          }
        }

        if (vault) {
          bridgeService.syncAccounts(buildBridgeSyncPayload(vault.accounts));
          showNotification("Mobile device paired and synced!", "success");
        } else {
          showNotification("Pairing failed: Invalid PIN or Password", "error");
        }
      } catch (e) {
        showNotification("Pairing failed: Error validating credentials", "error");
      }
    };
  }, [showNotification]);

  // 2. Load Initial State & Session
  useEffect(() => {
    console.log("Gravity: App useEffect mounted");
    const loadState = async () => {
      console.log("Gravity: loadState started");
      try {
        // Load Vault Metadata
        const vaultData = await getVault();
        console.log("Gravity: getVault result:", !!vaultData);
        if (vaultData) {
          setWalletState(prev => ({
            ...prev,
            accounts: [], // Keys are encrypted
            encryptedMaster: true,
            useGoogleAuth: false,
            useBiometrics: false,
            useDeviceAuth: false
          }));
        }

        // Check Active Session (chrome.storage.session)
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
          // Try to restore crypto session first
          const restored = await tryRestoreSession();

          await new Promise<void>((resolve) => {
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
              }
              resolve();
            });
          });
        }

        // Also load walletConfig
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          await new Promise<void>((resolve) => {
            chrome.storage.local.get(['walletConfig'], (result: any) => {
              if (result.walletConfig) {
                setWalletState(prev => ({
                  ...prev,
                  encryptedMaster: result.walletConfig.encryptedMaster,
                  useGoogleAuth: result.walletConfig.useGoogleAuth,
                  useBiometrics: result.walletConfig.useBiometrics,
                  useDeviceAuth: result.walletConfig.useDeviceAuth,
                  useTOTP: result.walletConfig.useTOTP
                }));
              }
              resolve();
            });
          });
        }

        const context = detectWeb3Context();
        if (context) setWeb3Context(context);

        benchmarkNodes();
        setIsDataLoaded(true);
        console.log("Gravity: loadState COMPLETE");
      } catch (e) {
        console.error("Gravity: loadState FAILED", e);
        setIsDataLoaded(true);
      }
    };
    loadState();
  }, []);

  // 2. Save Config when it changes
  useEffect(() => {
    if (isDataLoaded) {
      const config = {
        encryptedMaster: walletState.encryptedMaster,
        useGoogleAuth: walletState.useGoogleAuth,
        useBiometrics: walletState.useBiometrics,
        useDeviceAuth: walletState.useDeviceAuth,
        useTOTP: walletState.useTOTP
      };
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ walletConfig: config });
      }
    }
  }, [walletState.encryptedMaster, walletState.useGoogleAuth, walletState.useBiometrics, walletState.useDeviceAuth, walletState.useTOTP, isDataLoaded]);

  useEffect(() => {
    if (!isLocked && walletState.accounts.length > 0) {
      // 1. Sync to Session Storage (Fixes disappearance on popup close)
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
        chrome.storage.session.set({ session_accounts: walletState.accounts });
      }

      // 2. Sync to Persistent Vault (if needed)
      if (needsSave && walletState.encryptedMaster) {
        const vault: Vault = { accounts: walletState.accounts, lastUpdated: Date.now() };
        saveVault('cached', vault)
          .then(() => setNeedsSave(false))
          .catch((err: Error) => {
            console.warn("Auto-save failed:", err);
            if (err.message && err.message.includes('cache is empty')) {
              setLockReason("Session expired. Please unlock to save changes.");
              setIsLocked(true);
            }
          });
      }
    }
  }, [walletState.accounts, isLocked, needsSave, walletState.encryptedMaster]);

  // 4. Poll Balances automatically (Safe closure pattern)
  const fetchBalancesRef = useRef<() => void>();
  const isRefreshingRef = useRef(false);
  useEffect(() => {
    fetchBalancesRef.current = fetchBalances;
  });

  useEffect(() => {
    if (!isLocked && walletState.accounts.length > 0) {
      const id = setInterval(() => {
        if (fetchBalancesRef.current) fetchBalancesRef.current();
      }, 5000);
      return () => clearInterval(id);
    }
  }, [isLocked, walletState.accounts.length > 0]);

  const fetchBalances = async () => {
    if (isLocked || walletState.accounts.length === 0 || isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setIsRefreshing(true);

    try {
      const updatedAccounts = await Promise.all(walletState.accounts.map(async (acc) => {
        const balances = await serviceFetchBalances(acc.chain, acc.name);
        return {
          ...acc,
          balance: balances.primary,
          secondaryBalance: balances.secondary,
          stakedBalance: balances.staked,
          powerDownActive: balances.powerDownActive,
          nextPowerDown: balances.nextPowerDown,
          powerDownAmount: balances.powerDownAmount
        };
      }));

      setWalletState(prev => ({ ...prev, accounts: updatedAccounts }));
    } catch (err) {
      console.warn("Poll balances failed:", err);
    } finally {
      isRefreshingRef.current = false;
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (currentView === ViewState.WALLET && !isLocked && walletState.accounts.length > 0) {
      fetchBalances();
    }
  }, [currentView, activeChain, isLocked, walletState.accounts.length]);

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
      const balances = await serviceFetchBalances(acc.chain, acc.name);
      return {
        ...acc,
        balance: balances.primary,
        secondaryBalance: balances.secondary,
        stakedBalance: balances.staked,
        powerDownActive: balances.powerDownActive,
        nextPowerDown: balances.nextPowerDown,
        powerDownAmount: balances.powerDownAmount
      };
    }));

    const updatedAccounts = [...walletState.accounts, ...withBalance];

    try {
      if (!walletState.encryptedMaster) {
        // First account setup: Initialize Vault with Passwordless key
        await enablePasswordless(updatedAccounts);
        setWalletState(prev => ({ ...prev, accounts: updatedAccounts, encryptedMaster: true }));
      } else {
        // Standard save
        await saveVault('cached', { accounts: updatedAccounts, lastUpdated: Date.now() });
        setWalletState(prev => ({ ...prev, accounts: updatedAccounts }));
      }

      showNotification('Account imported successfully', 'success');
      setShowImport(false);
    } catch (e) {
      console.error("Import Save Failed:", e);
      showNotification('Failed to save account. Please try again.', 'error');
    }
  };

  const handleDeviceSyncImport = async (payload: SyncPayload) => {
    const mergedAccounts = [...walletState.accounts];
    let added = 0;

    payload.accounts.forEach((account) => {
      if (!mergedAccounts.find((candidate) => candidate.name === account.name && candidate.chain === account.chain)) {
        mergedAccounts.push(account);
        added += 1;
      }
    });

    const nextState: WalletState = {
      ...walletState,
      accounts: mergedAccounts,
      useGoogleAuth: payload.settings?.useGoogleAuth ?? walletState.useGoogleAuth,
      useBiometrics: payload.settings?.useBiometrics ?? walletState.useBiometrics,
      useDeviceAuth: payload.settings?.useDeviceAuth ?? walletState.useDeviceAuth,
      useTOTP: payload.settings?.useTOTP ?? walletState.useTOTP,
      encryptedMaster: walletState.encryptedMaster || mergedAccounts.length > 0
    };

    if (payload.chatIdentity) {
      await storageService.setItem('gravity_chat_key', payload.chatIdentity.privateKey);
      await storageService.setItem('gravity_chat_pub', payload.chatIdentity.publicKey);
      localStorage.setItem('gravity_chat_username', payload.chatIdentity.username);
      localStorage.setItem('gravity_chat_registration', JSON.stringify({
        id: payload.chatIdentity.id,
        username: payload.chatIdentity.username,
        timestamp: payload.timestamp
      }));
    }

    setWalletState(nextState);

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
      chrome.storage.session.set({ session_accounts: mergedAccounts });
    }

    try {
      if (!walletState.encryptedMaster) {
        await enablePasswordless(mergedAccounts);
      } else {
        await saveVault('cached', { accounts: mergedAccounts, lastUpdated: Date.now() });
      }
      showNotification(`Transfer complete. Added ${added} account${added === 1 ? '' : 's'}.`, 'success');
    } catch (error) {
      console.error('Device transfer save failed:', error);
      showNotification('The wallet was received but could not be persisted safely.', 'error');
      throw error;
    }
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
      showNotification("No active key found for this account.", 'error');
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
        showNotification(`TX: ${result.txId?.substring(0, 8)}...`, 'success');
        fetchBalances();
      } else {
        showNotification(`Failed: ${result.error}`, 'error');
      }
    } catch (e) {
      showNotification("Unexpected error during broadcast.", 'error');
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
    const OUTER_WIDTH = 416;
    const OUTER_HEIGHT = 639;

    if (isDetachedMode) {
      setIsDetached(true);
      document.documentElement.style.width = '100%';
      document.documentElement.style.height = '100%';
      document.body.style.width = '100vw';
      document.body.style.height = '100vh';
      document.body.style.minHeight = '100vh';
      document.body.style.overflow = 'hidden';
      const root = document.getElementById('root');
      if (root) {
        root.style.width = '100%';
        root.style.height = '100%';
        root.style.minHeight = '100vh';
      }

      let animationFrameId: number;
      const lockSize = () => {
        if (window.innerWidth <= 420 && window.innerHeight <= 650 && window.innerWidth >= 390) {
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
            if (win.state === 'maximized' || win.width > 450 || win.height > 700) {
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
      const width = 416;
      const height = 639;
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
    return (
      <div style={{
        height: isDetached ? '100vh' : '600px',
        width: '100%',
        background: '#050505',
        color: '#00ffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontFamily: 'monospace'
      }}>
        <h2 style={{ margin: 0 }}>LOADING DATA...</h2>
        <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.7 }}>Initializing Storage</div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <LockScreen
        onUnlock={handleUnlock}
        walletState={walletState}
        setWalletState={setWalletState}
        lockReason={lockReason}
        onToggleDetach={handleToggleDetach}
      />
    );
  }



  // SIGNING REQUEST UI
  if (requestId) {
    return <SignRequest requestId={requestId} accounts={walletState.accounts} onComplete={() => window.close()} />;
  }

  return (
    <div className="flex h-full w-full bg-dark-900 text-slate-200 font-sans overflow-hidden">
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

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-dark-900">
        <header className="h-14 border-b border-dark-700 flex items-center justify-between px-4 bg-dark-800 shadow-md z-10">
          <div className="flex items-center gap-2">
            {currentView === ViewState.LANDING ? (
              <h1 className="font-bold tracking-wider text-sm">{t('sidebar.home').toUpperCase()}</h1>
            ) : currentView === ViewState.MANAGE ? (
              <h1 className="font-bold tracking-wider text-sm text-slate-200">{t('settings.title').toUpperCase()}</h1>
            ) : currentView === ViewState.HELP ? (
              <h1 className="font-bold tracking-wider text-sm text-slate-200">{t('help.title').toUpperCase()}</h1>
            ) : currentView === ViewState.CHAT ? (
              <h1 className="font-bold tracking-wider text-sm text-purple-400">GRAVITY CHAT</h1>
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
            {currentView !== ViewState.CHAT && web3Context && currentView !== ViewState.LANDING && isContextRelevant(web3Context, activeChain) && (
              <div className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded border border-green-800 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                {web3Context}
              </div>
            )}
            {currentView !== ViewState.CHAT && (
              <button
                onClick={() => setShowImport(true)}
                className="text-xs bg-dark-700 hover:bg-dark-600 px-2 py-1 rounded text-slate-300 transition-colors"
                title={t('header.add')}
              >
                {t('header.add')}
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {currentView === ViewState.LANDING && (
            <Landing
              onSelectChain={(chain: Chain) => {
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
              isRefreshing={isRefreshing}
              onManage={(acc: Account) => setManagingAccount(acc)}
              onSend={(acc: Account) => setTransferAccount(acc)}
              onReceive={(acc: Account) => setReceiveAccount(acc)}
              onHistory={(acc: Account) => setHistoryAccount(acc)}
              onRefresh={fetchBalances}
              onAddAccount={() => setShowImport(true)}
            />
          )}

          {currentView === ViewState.MANAGE && (
            <ManageWallets
              accounts={walletState.accounts}
              walletState={walletState}
              setWalletState={setWalletState}
              onEdit={(acc: Account) => setManagingAccount(acc)}
              onImport={() => setShowImport(true)}
              onSyncImport={handleDeviceSyncImport}
            />
          )}

          {currentView === ViewState.BULK && (
            <BulkTransfer
              chain={activeChain}
              accounts={walletState.accounts.filter(a => a.chain === activeChain)}
              refreshBalance={fetchBalances}
              onChangeChain={setActiveChain}
              onAddAccount={() => setShowImport(true)}
            />
          )}

          {currentView === ViewState.MULTISIG && (
            <MultiSig
              chain={activeChain}
              accounts={walletState.accounts}
              onChainChange={setActiveChain}
            />
          )}

          {currentView === ViewState.HELP && (
            <HelpView />
          )}

          {currentView === ViewState.CHAT && (
            <ChatView
              onClose={() => setCurrentView(ViewState.LANDING)}
            />
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
          disableAccountSelection={true}
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

      {showBridge && (
        <BridgeModal
          onClose={() => setShowBridge(false)}
          onSync={() => bridgeService.syncAccounts(buildBridgeSyncPayload(walletState.accounts))}
        />
      )}
    </div>
  );
}
