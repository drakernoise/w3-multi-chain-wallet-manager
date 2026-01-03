import './polyfills/chrome'
import { useState, useEffect } from 'react'
import { Chain, WalletState, Account, Vault } from '@types'
import { LanguageProvider } from '@contexts/LanguageContext'
import { LockScreen } from '@components/LockScreen'
import { bridgeService, SignRequest, SignResponse } from '@services/bridgeService'
import { broadcastTransfer } from '@services/chainService'
import { getVault, saveVault, tryRestoreSession } from '@services/cryptoService'
import { mobileProvider, SignRequest as MobileSignRequest } from './services/mobileProvider'
import { SignRequestModal } from './components/SignRequestModal'
import { PermissionsManager } from './components/PermissionsManager'
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

  // Wallet Modal States
  const [activeModal, setActiveModal] = useState<'transfer' | 'receive' | 'history' | 'import' | 'manage' | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  useEffect(() => {
    // 1. Initialize Services
    bridgeService.onStatusChange = (status) => setBridgeStatus(status)
    bridgeService.onSignRequest = (req) => {
      setActiveRequest(req)
      setCurrentView('bridge')
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
        const vaultData = await getVault();
        if (vaultData) {
          setWalletState(prev => ({
            ...prev,
            accounts: [],
            encryptedMaster: true,
          }));
        } else {
          setIsLocked(true);
        }
      } catch (e) {
        console.error("Failed to load state", e);
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

    let account = walletState.accounts.find(a => a.name === request.params.username || a.name === request.params.from);
    if (!account) account = walletState.accounts[0];

    if (!account || !account.activeKey) {
      alert("No suitable account found to sign this request.");
      mobileProvider.rejectRequest(requestId);
      setMobileSignRequest(null);
      return;
    }

    try {
      let result
      if (request.operation === 'transfer') {
        result = await broadcastTransfer(
          account.chain as Chain,
          account.name,
          account.activeKey,
          request.params.to,
          request.params.amount,
          request.params.memo || '',
          request.params.symbol || 'HIVE'
        )
      }

      if (result?.success) {
        const signature = result.txId || 'signed'
        mobileProvider.approveRequest(requestId, signature)
      } else {
        mobileProvider.rejectRequest(requestId)
      }
    } catch (e) {
      console.error('[Mobile] Operation failed:', e)
      mobileProvider.rejectRequest(requestId)
    }
    setMobileSignRequest(null)
  }

  const handleMobileReject = (requestId: string) => {
    mobileProvider.rejectRequest(requestId)
    setMobileSignRequest(null)
  }

  const simulateScan = () => {
    const mockQr = prompt("Enter Bridge Connection String (from Extension):")
    if (mockQr) {
      bridgeService.connectToExtension(mockQr)
    }
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
    <div className="flex flex-col h-screen w-screen bg-dark-900 text-white p-6 relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center mb-4 shrink-0">
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
                onClick={simulateScan}
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

    </div>
  )
}

export default App
