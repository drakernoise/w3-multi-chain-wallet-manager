import './polyfills/chrome'
import { useState, useEffect } from 'react'
import { Chain, WalletState, Account, Vault } from '@types'
import { LanguageProvider } from '@contexts/LanguageContext'
import { LockScreen } from '@components/LockScreen'
import { bridgeService, SignRequest, SignResponse } from '@services/bridgeService'
import { broadcastTransfer, broadcastOperations } from '@services/chainService'
import { getVault, saveVault, tryRestoreSession } from '@services/cryptoService'
import { mobileProvider, SignRequest as MobileSignRequest } from './services/mobileProvider'
import { SignRequestModal } from './components/SignRequestModal'
import { PermissionsManager } from './components/PermissionsManager'
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning'
import 'gravity-shared/styles/global.css'

// Shared Components
import { WalletView } from '@components/WalletView'
import { ChatView } from '@components/ChatView'
import { TransferModal } from '@components/TransferModal'
import { ReceiveModal } from '@components/ReceiveModal'
import { HistoryModal } from '@components/HistoryModal'
import { ImportModal } from '@components/ImportModal'
import { ManageAccountModal } from '@components/ManageAccountModal'
import { ManageWallets } from '@components/ManageWallets'

function App() {
  return (
    <LanguageProvider>
      <MobileContent />
    </LanguageProvider>
  )
}

function MobileContent() {
  const [isLocked, setIsLocked] = useState(true)
  const [walletState, setWalletState] = useState<WalletState>({
    accounts: [],
    encryptedMaster: false,
    useGoogleAuth: false,
    useBiometrics: false,
    useDeviceAuth: false
  })
  const [needsSave, setNeedsSave] = useState(false)

  // Navigation & View State
  const [currentView, setCurrentView] = useState<'wallets' | 'bridge' | 'chat' | 'settings'>('wallets')
  const [activeChain, setActiveChain] = useState<Chain>(Chain.HIVE)

  // Bridge State
  const [activeRequest, setActiveRequest] = useState<SignRequest | null>(null)
  const [bridgeStatus, setBridgeStatus] = useState('disconnected')

  // Mobile Provider State
  const [mobileSignRequest, setMobileSignRequest] = useState<MobileSignRequest | null>(null)
  const [showPermissions, setShowPermissions] = useState(false)

  const [activeModal, setActiveModal] = useState<'transfer' | 'receive' | 'history' | 'import' | 'manage' | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  // QR & PIN Pairing State
  const [isScanning, setIsScanning] = useState(false)
  const [showPinPrompt, setShowPinPrompt] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [pinValue, setPinValue] = useState('')

  useEffect(() => {
    // 1. Initialize Services
    bridgeService.onStatusChange = (status) => setBridgeStatus(status)
    bridgeService.onSignRequest = (req) => {
      setActiveRequest(req)
      setCurrentView('bridge')
    }
    bridgeService.onSyncAccounts = (accounts) => {
      console.log('[Mobile] Sync accounts received:', accounts)
      setWalletState(prev => ({ ...prev, accounts, encryptedMaster: true }))
      setNeedsSave(true)
      setIsVerifying(false)
      setShowPinPrompt(false)
      alert("Accounts imported from extension successfully!")
    }
    bridgeService.init()

    mobileProvider.onSignRequest((req) => {
      console.log('[Mobile] Sign request received:', req)
      if (mobileProvider.hasPermission(req.domain, req.operation)) {
        handleMobileApprove(req.id, undefined)
      } else {
        setMobileSignRequest(req)
      }
    })

    // 2. Load Persisted State
    const loadState = async () => {
      try {
        console.log('[Mobile] Checking for existing vault...');
        const vaultData = await getVault();
        if (vaultData) {
          console.log('[Mobile] Vault found, showing lock screen');
          setWalletState(prev => ({
            ...prev,
            accounts: [],
            encryptedMaster: true,
          }));
          setIsLocked(true);
        } else {
          console.log('[Mobile] No vault found, showing onboarding');
          setIsLocked(false);
          setCurrentView('bridge');
        }
      } catch (e) {
        console.error("Failed to load state", e);
        setIsLocked(false);
        setCurrentView('bridge');
      }
    };
    loadState();

  }, [])

  // 3. Auto-Save Logic
  useEffect(() => {
    if (!isLocked && needsSave && walletState.encryptedMaster) {
      const vault: Vault = { accounts: walletState.accounts, lastUpdated: Date.now() };
      saveVault('cached', vault)
        .then(() => setNeedsSave(false))
        .catch(err => console.error("Auto-save failed", err));
    }
  }, [walletState.accounts, isLocked, needsSave, walletState.encryptedMaster])


  const handleUnlock = (accounts: any[]) => {
    setWalletState(prev => ({ ...prev, accounts, encryptedMaster: true }))
    setIsLocked(false)
    if (accounts.length > 0) {
      setCurrentView('wallets');
    } else {
      setCurrentView('bridge');
    }
  }

  const handleRefresh = async () => {
    console.log("Refreshing balances...")
  }

  // --- Bridge Handlers ---
  const handleApprove = async () => {
    if (!activeRequest) return
    const account = walletState.accounts.find(a => a.chain === activeRequest.chain && a.name === activeRequest.payload.username)

    if (!account || !account.activeKey) {
      alert("Account not found or missing active key")
      return
    }

    try {
      const result = await broadcastTransfer(
        activeRequest.chain as Chain,
        account.name,
        account.activeKey,
        activeRequest.payload.to,
        activeRequest.payload.amount,
        activeRequest.payload.memo,
        activeRequest.payload.symbol
      )

      const response: SignResponse = {
        id: activeRequest.id,
        success: result.success,
        result: result.success ? { txId: result.txId } : undefined,
        error: result.success ? undefined : result.error
      }

      await bridgeService.sendResponse(response)
      setActiveRequest(null)
    } catch (e) {
      console.error("Signing failed", e)
      alert("Signing failed: " + e)
    }
  }

  const handleReject = async () => {
    if (!activeRequest) return
    const response: SignResponse = {
      id: activeRequest.id,
      success: false,
      error: "User rejected request"
    }
    await bridgeService.sendResponse(response)
    setActiveRequest(null)
  }

  // --- Mobile Provider Handlers ---
  const handleMobileApprove = async (requestId: string, duration?: '1day' | '1week' | '1month') => {
    const request = mobileSignRequest
    if (!request) return

    if (duration) {
      await mobileProvider.grantPermission(request.domain, [request.operation], duration)
    }

    // 1. Find suitable account
    let account = walletState.accounts.find(a => a.name === request.params.username || a.name === request.params.from);
    if (!account) account = walletState.accounts[0];

    if (!account) {
      alert("No accounts found. Please import an account first.");
      mobileProvider.rejectRequest(requestId);
      setMobileSignRequest(null);
      return;
    }

    // 2. Identify required key type and get the key
    const postingOps = ['vote', 'comment', 'post', 'custom_json'];
    const needsPosting = postingOps.includes(request.operation);
    const signingKey = needsPosting ? account.postingKey : account.activeKey;

    if (!signingKey) {
      alert(`Missing ${needsPosting ? 'Posting' : 'Active'} key for @${account.name}. Please update your account keys.`);
      mobileProvider.rejectRequest(requestId);
      setMobileSignRequest(null);
      return;
    }

    try {
      let result;

      // Use specialized broadcast for transfer if needed, or generic broadcastOperations
      if (request.operation === 'transfer') {
        result = await broadcastTransfer(
          account.chain as Chain,
          account.name,
          signingKey,
          request.params.to,
          request.params.amount,
          request.params.memo || '',
          request.params.symbol || (account.chain === Chain.HIVE ? 'HIVE' : account.chain === Chain.STEEM ? 'STEEM' : 'BLURT')
        )
      } else {
        // Generic operation handling
        // Convert request params to standard operation array [type, data]
        const { domain, operation, callback, ...opData } = request.params;

        // Specific normalization for some ops if needed
        if (operation === 'vote') {
          opData.weight = parseInt(opData.weight) || 10000;
        }

        const op = [operation, opData];
        result = await broadcastOperations(
          account.chain as Chain,
          signingKey,
          [op]
        );
      }

      if (result?.success) {
        const signature = result.txId || 'signed'
        mobileProvider.approveRequest(requestId, signature)
      } else {
        alert("Operation failed: " + (result?.error || 'Unknown error'));
        mobileProvider.rejectRequest(requestId)
      }
    } catch (e: any) {
      console.error('[Mobile] Operation failed:', e)
      alert("Error: " + (e.message || String(e)));
      mobileProvider.rejectRequest(requestId)
    }
    setMobileSignRequest(null)
  }

  const handleMobileReject = (requestId: string) => {
    mobileProvider.rejectRequest(requestId)
    setMobileSignRequest(null)
  }

  const startScan = async () => {
    try {
      console.log('[Scanner] Checking ML Kit module availability...');
      const isAvailable = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      if (!isAvailable.available) {
        console.log('[Scanner] ML Kit module not found. Installing...');
        alert("Preparing scanner... (Downloading assets, please wait)");
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      }

      // 1. Check Permissions
      const status = await BarcodeScanner.checkPermissions();
      if (status.camera !== 'granted') {
        const req = await BarcodeScanner.requestPermissions();
        if (req.camera !== 'granted') {
          alert("Camera permission is required to scan QR codes.");
          return;
        }
      }

      // 2. Start Scanning
      console.log('[Scanner] Starting scan sequence...');
      document.documentElement.classList.add('barcode-scanner-active');
      document.body.classList.add('barcode-scanner-active');
      setIsScanning(true);

      // Radical delay to ensure all CSS classes are parsed and applied
      await new Promise(r => setTimeout(r, 500));

      const listener = await BarcodeScanner.addListener('barcodeScanned', async (result) => {
        console.log('[Scanner] Barcode detected!', result.barcode.displayValue);

        await BarcodeScanner.stopScan();
        document.documentElement.classList.remove('barcode-scanner-active');
        document.body.classList.remove('barcode-scanner-active');
        setIsScanning(false);
        listener.remove();

        const qrData = result.barcode.displayValue;
        if (qrData.startsWith('gravity:bridge:')) {
          console.log('[Scanner] Valid Gravity Bridge QR found');
          try {
            await bridgeService.connectToExtension(qrData);
            setShowPinPrompt(true);
          } catch (err) {
            console.error('[Scanner] Bridge connection failed', err);
            alert("Connection failed: " + err);
          }
        } else {
          alert("Invalid QR Code: Not a Gravity Bridge session");
        }
      });

      console.log('[Scanner] Calling BarcodeScanner.startScan()...');
      await BarcodeScanner.startScan({
        formats: [BarcodeFormat.QrCode]
      });

    } catch (e) {
      console.error("[Scanner] StartScan failed", e);
      setIsScanning(false);
      document.documentElement.classList.remove('barcode-scanner-active');
      document.body.classList.remove('barcode-scanner-active');
      alert("Error opening scanner: " + e);
    }
  }

  const handleValidatePin = async () => {
    if (!pinValue) return;
    setIsVerifying(true);
    try {
      await bridgeService.validatePairing(pinValue);
      // We don't close showPinPrompt here, we wait for onSyncAccounts or an error timeout
      setTimeout(() => {
        if (isVerifying) {
          setIsVerifying(false);
          alert("Pairing timeout: Please check if the extension is open and the PIN is correct.");
        }
      }, 10000);
    } catch (e) {
      setIsVerifying(false);
      alert("Error sending validation: " + e);
    }
  }

  const cancelScan = async () => {
    console.log('[Scanner] Cancelling scan...');
    await BarcodeScanner.stopScan();
    setIsScanning(false);
    document.documentElement.classList.remove('barcode-scanner-active');
    document.body.classList.remove('barcode-scanner-active');
  }

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-between pb-20 pt-10 bg-transparent scanner-ui-overlay">
        <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
          <div className="absolute inset-0 border-4 border-purple-500 rounded-3xl animate-pulse"></div>
        </div>
        <button
          onClick={cancelScan}
          className="bg-red-600/80 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm backdrop-blur-md"
        >
          Cancel Scan
        </button>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <LockScreen
          onUnlock={handleUnlock}
          walletState={walletState}
          setWalletState={setWalletState}
        />
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-screen w-screen text-white p-6 relative overflow-hidden transition-colors ${isScanning ? 'bg-transparent' : 'bg-dark-900'}`}>
      {/* Header */}
      {!isScanning && (
        <header className="flex justify-between items-center mb-4 shrink-0 transition-opacity">
          <div>
            <h1 className="text-2xl font-black tracking-tighter">GRAVITY</h1>
            <div className="flex items-center gap-1.5 mt-1">
              {currentView === 'bridge' && (
                <>
                  <div className={`w-1.5 h-1.5 rounded-full ${bridgeStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{bridgeStatus}</span>
                </>
              )}
              {/* Nav Labels removed from Header for cleaner look as they are in nav bar now */}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center font-bold text-purple-400">
            {walletState.accounts[0]?.name?.substring(0, 1).toUpperCase() || 'G'}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto relative no-scrollbar">

        {/* BRIDGE VIEW */}
        {currentView === 'bridge' && (
          !activeRequest ? (
            <div className="flex flex-col items-center space-y-8 animate-fadeIn mt-10">
              <div className="w-64 h-64 bg-dark-800/50 border-2 border-dashed border-purple-500/20 rounded-[40px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-purple-600/10 rounded-full flex items-center justify-center mb-6 text-purple-400">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m-3 3l3 3m6-3l3 3M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-lg font-bold text-white mb-2">Remote Signer</p>
                <p className="text-xs text-slate-500 leading-relaxed">Connect to your browser extension to sign transactions from your phone.</p>
              </div>

              <button
                onClick={startScan}
                className="w-full max-w-[280px] bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Pair Device
              </button>
            </div>
          ) : (
            <div className="w-full bg-dark-800 border border-dark-700 rounded-3xl p-6 shadow-2xl animate-slideUp">
              {/* Sign Request UI */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h2 className="font-black text-lg">Sign Request</h2>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{activeRequest.origin}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-dark-900/50 rounded-2xl p-4 border border-dark-700">
                  <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">{(activeRequest as any).operation || 'Transfer'}</span>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-white">{activeRequest.payload.amount}</span>
                    <span className="text-sm font-bold text-purple-400 mb-1">{activeRequest.payload.symbol || activeRequest.chain}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 px-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">To:</span>
                    <span className="font-bold">@{activeRequest.payload.to}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">From:</span>
                    <span className="font-bold">@{activeRequest.payload.username}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleReject} className="py-4 rounded-2xl bg-dark-700 text-slate-300 font-bold text-sm">Reject</button>
                <button onClick={handleApprove} className="py-4 rounded-2xl bg-purple-600 text-white font-black text-sm">Approve</button>
              </div>
            </div>
          )
        )}

        {/* WALLETS VIEW */}
        {currentView === 'wallets' && (
          <WalletView
            chain={activeChain}
            accounts={walletState.accounts.filter(a => a.chain === activeChain)}
            onChainChange={setActiveChain}
            onManage={(acc) => { setSelectedAccount(acc); setActiveModal('manage'); }}
            onSend={(acc) => { setSelectedAccount(acc); setActiveModal('transfer'); }}
            onReceive={(acc) => { setSelectedAccount(acc); setActiveModal('receive'); }}
            onHistory={(acc) => { setSelectedAccount(acc); setActiveModal('history'); }}
            onRefresh={handleRefresh}
            onAddAccount={() => setActiveModal('import')}
          />
        )}

        {/* CHAT VIEW */}
        {currentView === 'chat' && (
          <div className="h-full w-full">
            <ChatView
              onClose={() => setCurrentView('wallets')}
            />
          </div>
        )}
        {/* SETTINGS VIEW */}
        {currentView === 'settings' && (
          <div className="h-full w-full p-4 overflow-y-auto">
            <ManageWallets
              accounts={walletState.accounts}
              walletState={walletState}
              setWalletState={setWalletState}
              onEdit={(acc) => { setSelectedAccount(acc); setActiveModal('manage'); }}
              onImport={() => setActiveModal('import')}
            />
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className="shrink-0 grid grid-cols-4 gap-2 border-t border-dark-800 pt-6 mt-4">
        <button
          onClick={() => setCurrentView('wallets')}
          className={`flex flex-col items-center gap-1.5 transition-all outline-none bg-transparent border-none p-0 ${currentView === 'wallets' ? 'text-purple-400 opacity-100' : 'opacity-30'}`}
          style={{ backgroundColor: 'transparent' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          <span className={`text-[8px] font-black uppercase tracking-widest ${currentView === 'wallets' ? 'border-b border-purple-400' : ''}`}>Wallets</span>
        </button>

        <button
          onClick={() => setCurrentView('bridge')}
          className={`flex flex-col items-center gap-1.5 transition-all outline-none bg-transparent border-none p-0 ${currentView === 'bridge' ? 'text-purple-400 opacity-100' : 'opacity-30'}`}
          style={{ backgroundColor: 'transparent' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className={`text-[8px] font-black uppercase tracking-widest ${currentView === 'bridge' ? 'border-b border-purple-400' : ''}`}>Bridge</span>
        </button>

        <button
          onClick={() => setCurrentView('chat')}
          className={`flex flex-col items-center gap-1.5 transition-all outline-none bg-transparent border-none p-0 ${currentView === 'chat' ? 'text-purple-400 opacity-100' : 'opacity-30'}`}
          style={{ backgroundColor: 'transparent' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span className={`text-[8px] font-black uppercase tracking-widest ${currentView === 'chat' ? 'border-b border-purple-400' : ''}`}>Chat</span>
        </button>

        <button
          onClick={() => setCurrentView('settings')}
          className={`flex flex-col items-center gap-1.5 transition-all outline-none bg-transparent border-none p-0 ${currentView === 'settings' ? 'text-purple-400 opacity-100' : 'opacity-30'}`}
          style={{ backgroundColor: 'transparent' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className={`text-[8px] font-black uppercase tracking-widest ${currentView === 'settings' ? 'border-b border-purple-400' : ''}`}>Settings</span>
        </button>
      </nav>

      {/* MODALS */}

      {/* 1. Mobile Sign Request Modal (DApp) */}
      {mobileSignRequest && (
        <SignRequestModal
          request={mobileSignRequest}
          onApprove={handleMobileApprove}
          onReject={handleMobileReject}
        />
      )}

      {/* 2. DApp Permissions Manager */}
      {showPermissions && (
        <PermissionsManager
          permissions={mobileProvider.getPermissions()}
          onRevoke={(domain) => mobileProvider.revokePermission(domain)}
          onClose={() => setShowPermissions(false)}
        />
      )}

      {/* 3. Wallet Action Modals */}
      {activeModal === 'import' && (
        <ImportModal
          onClose={() => setActiveModal(null)}
          onImport={(newAccounts) => {
            const updatedAccounts = [...walletState.accounts, ...newAccounts];
            setWalletState(prev => ({ ...prev, accounts: updatedAccounts }));
            setNeedsSave(true);
            setActiveModal(null);
          }}
          initialChain={activeChain}
        />
      )}

      {activeModal === 'transfer' && selectedAccount && (
        <TransferModal
          account={selectedAccount}
          onClose={() => setActiveModal(null)}
          accounts={walletState.accounts}
          disableAccountSelection={true}
          onTransfer={async (fromAcc, to, amount, memo, symbol) => {
            try {
              const result = await broadcastTransfer(
                fromAcc.chain,
                fromAcc.name,
                fromAcc.activeKey!,
                to,
                amount,
                memo,
                symbol
              );
              if (result.success) {
                alert("Transfer Sent! TX: " + result.txId?.substring(0, 8));
              } else {
                alert("Failed: " + result.error);
              }
            } catch (e) {
              alert("Error: " + e);
            }
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'receive' && selectedAccount && (
        <ReceiveModal
          account={selectedAccount}
          accounts={walletState.accounts}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'history' && selectedAccount && (
        <HistoryModal
          account={selectedAccount}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'manage' && selectedAccount && (
        <ManageAccountModal
          account={selectedAccount}
          onClose={() => setActiveModal(null)}
          onDelete={() => {
            const updated = walletState.accounts.filter(a => a.name !== selectedAccount.name || a.chain !== activeChain);
            setWalletState(prev => ({ ...prev, accounts: updated }));
            setNeedsSave(true);
            setActiveModal(null);
          }}
          onSave={(updatedAccount: Account) => {
            const updated = walletState.accounts.map(a => (a.name === updatedAccount.name && a.chain === activeChain) ? updatedAccount : a);
            setWalletState(prev => ({ ...prev, accounts: updated }));
            setNeedsSave(true);
            setActiveModal(null);
          }}
        />
      )}

      {/* 4. Pairing PIN Prompt */}
      {showPinPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-900/95 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-800 border border-dark-600 rounded-[32px] p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h2 className="text-xl font-black text-white mb-2">Authorize Sync</h2>
              <p className="text-xs text-slate-500 font-medium">Enter your extension PIN to import accounts.</p>
            </div>

            <div className="space-y-6">
              <input
                type="password"
                value={pinValue}
                onChange={(e) => setPinValue(e.target.value)}
                placeholder="Enter PIN"
                className="w-full bg-dark-900 border border-dark-600 rounded-2xl py-4 px-4 text-center text-xl font-bold tracking-[0.5em] focus:outline-none focus:border-purple-500 transition-colors"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowPinPrompt(false); setPinValue(''); setIsVerifying(false); }}
                  disabled={isVerifying}
                  className="flex-1 py-4 bg-dark-700 hover:bg-dark-600 disabled:opacity-30 rounded-2xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleValidatePin}
                  disabled={!pinValue || isVerifying}
                  className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying</span>
                    </>
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
