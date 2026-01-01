import { useState, useEffect } from 'react'
import { Chain, WalletState } from '@types'
import { LanguageProvider } from '@contexts/LanguageContext'
import { LockScreen } from '@components/LockScreen'
import { bridgeService, SignRequest, SignResponse } from '@services/bridgeService'
import { broadcastTransfer } from '@services/chainService'
import { mobileProvider, SignRequest as MobileSignRequest } from './services/mobileProvider'
import { SignRequestModal } from './components/SignRequestModal'
import { PermissionsManager } from './components/PermissionsManager'
import '../../packages/shared/styles/global.css'

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

  const [activeRequest, setActiveRequest] = useState<SignRequest | null>(null)
  const [bridgeStatus, setBridgeStatus] = useState('disconnected')

  // Mobile provider states
  const [mobileSignRequest, setMobileSignRequest] = useState<MobileSignRequest | null>(null)
  const [showPermissions, setShowPermissions] = useState(false)

  useEffect(() => {
    bridgeService.onStatusChange = (status) => setBridgeStatus(status)
    bridgeService.onSignRequest = (req) => {
      setActiveRequest(req)
      // Basic haptic feedback mockup
      console.log("Haptic feedback: New Sign Request")
    }
    bridgeService.init()

    // Setup mobile provider listener
    mobileProvider.onSignRequest((req) => {
      console.log('[Mobile] Sign request received:', req)

      // Check if we have permission
      if (mobileProvider.hasPermission(req.domain, req.operation)) {
        // Auto-approve
        handleMobileApprove(req.id, undefined)
      } else {
        // Show approval modal
        setMobileSignRequest(req)
      }
    })
  }, [])

  const handleUnlock = (accounts: any[]) => {
    setWalletState(prev => ({ ...prev, accounts }))
    setIsLocked(false)
  }

  const handleApprove = async () => {
    if (!activeRequest) return

    // Find matching account
    const account = walletState.accounts.find(a => a.chain === activeRequest.chain && a.name === activeRequest.payload.username)

    if (!account || !account.activeKey) {
      alert("Account not found or missing active key")
      return
    }

    try {
      // Execute real broadcast
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

  // Mobile provider handlers
  const handleMobileApprove = async (requestId: string, duration?: '1day' | '1week' | '1month') => {
    const request = mobileSignRequest
    if (!request) return

    // Grant permission if duration specified
    if (duration) {
      await mobileProvider.grantPermission(request.domain, [request.operation], duration)
    }

    // Find account for the operation
    const account = walletState.accounts[0] // TODO: Better account selection
    if (!account || !account.activeKey) {
      mobileProvider.rejectRequest(requestId)
      setMobileSignRequest(null)
      return
    }

    try {
      // Execute the operation based on type
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
      // TODO: Add other operations (vote, post, etc.)

      if (result?.success) {
        // Generate signature (simplified - in real app would sign the transaction)
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

  // MOCK: Simulate QR Scan
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
      <header className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tighter">GRAVITY</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${bridgeStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{bridgeStatus}</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center font-bold text-purple-400">
          {walletState.accounts[0]?.name?.substring(0, 1).toUpperCase() || 'G'}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-0">
        {!activeRequest ? (
          <div className="flex flex-col items-center space-y-8 animate-fadeIn">
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
                <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">Transfer</span>
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
              <button
                onClick={handleReject}
                className="py-4 rounded-2xl bg-dark-700 text-slate-300 font-bold text-sm active:scale-95 transition-all"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="py-4 rounded-2xl bg-purple-600 text-white font-black text-sm active:scale-95 transition-all shadow-lg shadow-purple-900/40"
              >
                Approve
              </button>
            </div>
          </div>
        )}
      </main>

      <nav className="shrink-0 grid grid-cols-4 gap-2 border-t border-dark-800 pt-6 mt-8">
        <div className="flex flex-col items-center gap-1.5 opacity-30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          <span className="text-[8px] font-black uppercase tracking-widest">Wallets</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-purple-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="text-[8px] font-black uppercase tracking-widest border-b border-purple-400">Bridge</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 opacity-30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span className="text-[8px] font-black uppercase tracking-widest">Chat</span>
        </div>
        <div
          onClick={() => setShowPermissions(true)}
          className="flex flex-col items-center gap-1.5 opacity-30 hover:opacity-100 cursor-pointer transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
          <span className="text-[8px] font-black uppercase tracking-widest">More</span>
        </div>
      </nav>

      {/* Mobile Sign Request Modal */}
      {mobileSignRequest && (
        <SignRequestModal
          request={mobileSignRequest}
          onApprove={handleMobileApprove}
          onReject={handleMobileReject}
        />
      )}

      {/* Permissions Manager */}
      {showPermissions && (
        <PermissionsManager
          permissions={mobileProvider.getPermissions()}
          onRevoke={(domain) => mobileProvider.revokePermission(domain)}
          onClose={() => setShowPermissions(false)}
        />
      )}
    </div>
  )
}

export default App
