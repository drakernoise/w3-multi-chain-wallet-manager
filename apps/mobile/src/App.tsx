import './polyfills/chrome'
import { useState, useEffect, useRef } from 'react'
import { Chain, WalletState, Account, Vault, SyncPayload } from '@types'
import { LanguageProvider } from '@contexts/LanguageContext'
import { LockScreen } from '@components/LockScreen'
import { bridgeService, SignRequest, SignResponse } from '@services/bridgeService'
import { broadcastTransfer, broadcastOperations, broadcastVote, broadcastCustomJson, signMessage, fetchBalances } from '@services/chainService'
import { ensureMobileInternalKey, getVault, saveVault, tryRestoreSession, unlockVaultWithCachedSession } from '@services/cryptoService'
import { mobileProvider, SignRequest as MobileSignRequest } from './services/mobileProvider'
import { SignRequestModal } from './components/SignRequestModal'
import { PermissionsManager } from './components/PermissionsManager'
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning'
import 'gravity-shared/styles/global.css'
import './App.css'

// Shared Components
import { WalletView } from '@components/WalletView'
import { ChatView } from '@components/ChatView'
import { BrowserView } from './components/BrowserView'
import { TransferModal } from '@components/TransferModal'
import { ReceiveModal } from '@components/ReceiveModal'
import { HistoryModal } from '@components/HistoryModal'
import { ImportModal } from '@components/ImportModal'
import { ManageAccountModal } from '@components/ManageAccountModal'
import { ManageWallets } from '@components/ManageWallets'

const detectChainFromDomain = (domain?: string): Chain | null => {
  const rawValue = (domain || '').trim()
  if (!rawValue) return null

  let host = rawValue.toLowerCase()
  try {
    host = new URL(rawValue).hostname.toLowerCase()
  } catch (_error) {
    host = rawValue
      .replace(/^[a-z]+:\/\//i, '')
      .split('/')[0]
      .split('?')[0]
      .split('#')[0]
      .toLowerCase()
  }

  if (!host) return null

  const hiveHosts = ['peakd.com', 'ecency.com', 'hive.blog', 'tribaldex.com', 'splinterlands.com']
  if (hiveHosts.some((value) => host === value || host.endsWith(`.${value}`) || host.includes('hive'))) {
    return Chain.HIVE
  }

  const blurtHosts = ['twiggy.lat', 'blurt.blog', 'beblurt.com', 'blurtwallet.com']
  if (blurtHosts.some((value) => host === value || host.endsWith(`.${value}`) || host.includes('blurt'))) {
    return Chain.BLURT
  }

  const steemHosts = ['steemit.com']
  if (steemHosts.some((value) => host === value || host.endsWith(`.${value}`) || host.includes('steem'))) {
    return Chain.STEEM
  }

  return null
}

const detectChainFromRequest = (params: any, _domain?: string): Chain | null => {
  const messageValue = typeof params?.message === 'string'
    ? params.message.trim().toLowerCase()
    : typeof params?.params === 'string'
      ? params.params.trim().toLowerCase()
      : null

  if (messageValue) {
    if (messageValue.startsWith('blt:') || messageValue.startsWith('blurt:')) return Chain.BLURT
    if (messageValue.startsWith('hive:')) return Chain.HIVE
    if (messageValue.startsWith('stm:') || messageValue.startsWith('steem:')) return Chain.STEEM
  }

  const genericUsername = typeof params?.username === 'string' ? params.username.trim().toLowerCase() : null
  if (genericUsername === 'blurt') return Chain.BLURT
  if (genericUsername === 'hive') return Chain.HIVE
  if (genericUsername === 'steem') return Chain.STEEM

  const hintedChain = typeof params?.selectedAccountChain === 'string'
    ? params.selectedAccountChain.toUpperCase()
    : typeof params?.requestChain === 'string'
    ? params.requestChain.toUpperCase()
    : typeof params?.chain === 'string'
      ? params.chain.toUpperCase()
      : null

  if (hintedChain === Chain.HIVE || hintedChain === Chain.BLURT || hintedChain === Chain.STEEM) {
    return hintedChain as Chain
  }

  if (typeof params?.type === 'string') {
    try {
      const parsedType = JSON.parse(params.type)
      const nestedHint = typeof parsedType?.chain === 'string' ? parsedType.chain.toUpperCase() : null
      if (nestedHint === Chain.HIVE || nestedHint === Chain.BLURT || nestedHint === Chain.STEEM) {
        return nestedHint as Chain
      }
    } catch (_e) {}
  } else if (params?.type && typeof params.type === 'object') {
    const nestedHint = typeof params.type.chain === 'string' ? params.type.chain.toUpperCase() : null
    if (nestedHint === Chain.HIVE || nestedHint === Chain.BLURT || nestedHint === Chain.STEEM) {
      return nestedHint as Chain
    }
  }

  return null
}

const collectOperationEntries = (operations: any): any[] => {
  if (!operations) return []
  if (Array.isArray(operations)) return operations
  if (typeof operations === 'object') {
    if (Array.isArray(operations.operations)) return operations.operations
    if (Array.isArray(operations.tx?.operations)) return operations.tx.operations
    if (Array.isArray(operations.transaction?.operations)) return operations.transaction.operations
  }
  return [operations]
}

const collectPossibleAccountNames = (params: any): string[] => {
  const values = new Set<string>()
  const pushValue = (value: unknown) => {
    if (typeof value !== 'string') return
    const normalized = value.trim().replace(/^@/, '')
    if (!normalized) return
    if (['hive', 'blurt', 'steem', 'posting', 'active'].includes(normalized.toLowerCase())) return
    values.add(normalized)
  }

  if (params && typeof params === 'object') {
    ;[
      params.account,
      params.username,
      params.user,
      params.voter,
      params.from,
      params.author,
      params.delegator,
      params.account_name
    ].forEach(pushValue)

    if (typeof params.type === 'string') {
      try {
        const parsedType = JSON.parse(params.type)
        ;[
          parsedType?.account,
          parsedType?.username,
          parsedType?.user
        ].forEach(pushValue)
      } catch (_e) {}
    } else if (params.type && typeof params.type === 'object') {
      ;[
        params.type.account,
        params.type.username,
        params.type.user
      ].forEach(pushValue)
    }

    const messageValue = typeof params.message === 'string'
      ? params.message.trim()
      : typeof params.params === 'string'
        ? params.params.trim()
        : ''
    const prefixedMessageMatch = messageValue.match(/^(?:blt|blurt|hive|stm|steem):([a-z0-9\-\.]+)$/i)
    if (prefixedMessageMatch?.[1]) {
      pushValue(prefixedMessageMatch[1])
    }
  }

  const operations = params?.operations || params?.ops
  const normalizedOps = collectOperationEntries(operations)
  normalizedOps.forEach((op: any) => {
    const opData = Array.isArray(op) ? op[1] : (op?.data || op?.op || op?.operation_data || op)
    if (!opData || typeof opData !== 'object') return
    ;[
      opData.account,
      opData.username,
      opData.user,
      opData.voter,
      opData.from,
      opData.author,
      opData.delegator,
      opData.account_name
    ].forEach(pushValue)
  })

  return Array.from(values)
}

const resolveAccountForRequest = (
  accounts: Account[],
  params: any,
  domain?: string,
  preferredAccountName?: string,
  preferredAccountChain?: string
): Account | null => {
  const requestedChain = detectChainFromRequest(params, domain)
  const preferredChain =
    preferredAccountChain === Chain.HIVE || preferredAccountChain === Chain.BLURT || preferredAccountChain === Chain.STEEM
      ? preferredAccountChain as Chain
      : null
  const domainChain = requestedChain || preferredChain
  const candidates = [
    ...collectPossibleAccountNames(params),
    preferredAccountName
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())

  for (const candidate of candidates) {
    const exact = accounts.find((account) =>
      account.name.toLowerCase() === candidate && (!domainChain || account.chain === domainChain)
    )
    if (exact) return exact
  }

  for (const candidate of candidates) {
    const fallback = accounts.find((account) => account.name.toLowerCase() === candidate)
    if (fallback) return fallback
  }

  return accounts.find((account) => account.chain === domainChain)
    || accounts[0]
    || null
}

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
  const [currentView, setCurrentView] = useState<'wallets' | 'bridge' | 'chat' | 'settings' | 'explorer'>('wallets')
  const [activeChain, setActiveChain] = useState<Chain>(Chain.HIVE)

  // Bridge State
  const [activeRequest, setActiveRequest] = useState<SignRequest | null>(null)
  const [bridgeStatus, setBridgeStatus] = useState('disconnected')

  // Mobile Provider State
  const [mobileSignRequest, setMobileSignRequest] = useState<MobileSignRequest | null>(null)
  const [modalSuggestedAccount, setModalSuggestedAccount] = useState<Account | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }
  const [showPermissions, setShowPermissions] = useState(false)

  const [activeModal, setActiveModal] = useState<'transfer' | 'receive' | 'history' | 'import' | 'manage' | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  // QR & PIN Pairing State
  const [isScanning, setIsScanning] = useState(false)
  const [showPinPrompt, setShowPinPrompt] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [pinValue, setPinValue] = useState('')
  const [isRefreshingWallets, setIsRefreshingWallets] = useState(false)
  const accountsRef = useRef<Account[]>([])

  const persistAccountsVault = async (accounts: Account[]) => {
    const vault: Vault = { accounts, lastUpdated: Date.now() }
    const hasSession = await tryRestoreSession()

    if (hasSession) {
      await saveVault('cached', vault)
      return
    }

    const internalKey = await ensureMobileInternalKey()
    await saveVault(internalKey, vault)
    await tryRestoreSession()
  }

  useEffect(() => {
    accountsRef.current = walletState.accounts
  }, [walletState.accounts])

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
      persistAccountsVault(accounts).catch(err =>
        console.error('[Mobile] Immediate vault save after sync failed', err)
      )
      setNeedsSave(true)
      setIsVerifying(false)
      setShowPinPrompt(false)
      showToast("Accounts imported from extension successfully!")
    }
    bridgeService.init()

    mobileProvider.onSignRequest((req) => {
      console.log('[Mobile] Sign request received:', req)
      const permission = mobileProvider.getPermission(req.domain)
      const requestedAccountNames = collectPossibleAccountNames(req.params)
      const explicitRequestedAccount = requestedAccountNames[0] || null
      const preferredAccountName = explicitRequestedAccount || permission?.defaultAccount
      const preferredAccountChain = explicitRequestedAccount
        ? detectChainFromRequest(req.params, req.domain) || undefined
        : permission?.defaultAccountChain
      const cachedAccount = resolveAccountForRequest(
        accountsRef.current,
        req.params,
        req.domain,
        preferredAccountName,
        preferredAccountChain
      )
      const preferredAccountConflicts =
        !!(
          permission?.defaultAccount &&
          explicitRequestedAccount &&
          permission.defaultAccount.toLowerCase() !== explicitRequestedAccount.toLowerCase() &&
          (!cachedAccount || cachedAccount.name.toLowerCase() !== explicitRequestedAccount.toLowerCase())
        )

      console.log('[GWDBG][mobile:auto-account]', JSON.stringify({
        requestId: req.id,
        domain: req.domain,
        domainChain: detectChainFromRequest(req.params, req.domain),
        requestedAccountNames,
        preferredAccountName: preferredAccountName || null,
        preferredAccountConflicts,
        resolvedAccount: cachedAccount ? { name: cachedAccount.name, chain: cachedAccount.chain } : null
      }))
      
      if (req.preConfirmed && cachedAccount && !preferredAccountConflicts) {
        console.log('[Mobile] Auto-approving pre-confirmed request for:', cachedAccount.name);
        handleMobileApprove(req.id, req.rememberDuration, cachedAccount);
      } else if (mobileProvider.hasPermission(req.domain, req.operation) && cachedAccount && !preferredAccountConflicts) {
        console.log('[GWDBG][mobile:permission-auto-approve]', JSON.stringify({
          requestId: req.id,
          domain: req.domain,
          operation: req.operation,
          account: cachedAccount.name
        }))
        handleMobileApprove(req.id, undefined, cachedAccount);
      } else {
        setModalSuggestedAccount(cachedAccount || null)
        setMobileSignRequest(req);
      }
    })

    // 2. Load Persisted State
    const loadState = async () => {
      try {
        console.log('[Mobile] Checking for existing vault...');
        const vaultData = await getVault();
        if (vaultData) {
          const restoredSession = await tryRestoreSession()
          if (restoredSession) {
            const restoredVault = await unlockVaultWithCachedSession()
            if (restoredVault) {
              console.log('[GWDBG][mobile:vault-auto-restored]', JSON.stringify({ accountCount: restoredVault.accounts.length }))
              setWalletState(prev => ({
                ...prev,
                accounts: restoredVault.accounts,
                encryptedMaster: true,
              }));
              setIsLocked(false);
              setCurrentView(restoredVault.accounts.length > 0 ? 'wallets' : 'bridge');
              return;
            }
          }
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
      persistAccountsVault(walletState.accounts)
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

  const refreshWalletBalances = async () => {
    if (isRefreshingWallets || walletState.accounts.length === 0) return

    setIsRefreshingWallets(true)
    showToast(`Refreshing ${walletState.accounts.length} wallet${walletState.accounts.length === 1 ? '' : 's'}...`)
    console.log('[GWDBG][wallets:refresh:start]', JSON.stringify({
      accountCount: walletState.accounts.length,
      chains: [...new Set(walletState.accounts.map((account) => account.chain))]
    }))
    try {
      const refreshedAccounts = await Promise.all(
        walletState.accounts.map(async (account) => {
          try {
            const balances = await fetchBalances(account.chain, account.name)
            console.log('[GWDBG][wallets:refresh:account]', JSON.stringify({
              account: account.name,
              chain: account.chain,
              primary: balances.primary,
              secondary: balances.secondary,
              staked: balances.staked
            }))
            return {
              ...account,
              balance: balances.primary,
              secondaryBalance: balances.secondary,
              stakedBalance: balances.staked,
              powerDownActive: balances.powerDownActive,
              nextPowerDown: balances.nextPowerDown,
              powerDownAmount: balances.powerDownAmount
            }
          } catch (error) {
            console.error('[Mobile] Failed to refresh balances for account', account.name, account.chain, error)
            return account
          }
        })
      )

      setWalletState((prev) => ({ ...prev, accounts: refreshedAccounts }))
      setNeedsSave(true)
      showToast(`Wallet refresh complete (${refreshedAccounts.length})`)
      console.log('[GWDBG][wallets:refresh:done]', JSON.stringify({
        refreshedCount: refreshedAccounts.length
      }))
    } catch (error) {
      console.error('[Mobile] Wallet refresh failed', error)
      showToast('Wallet refresh failed')
    } finally {
      setIsRefreshingWallets(false)
    }
  }

  const handleRefresh = async () => {
    console.log("Refreshing balances...")
    await refreshWalletBalances()
  }

  useEffect(() => {
    if (!isLocked && currentView === 'wallets' && walletState.accounts.length > 0) {
      refreshWalletBalances().catch((error) => {
        console.error('[Mobile] Auto refresh balances failed', error)
      })
    }
  }, [currentView, walletState.accounts.length, isLocked])

  // --- Bridge Handlers ---
  const handleApprove = async () => {
    if (!activeRequest) return
    const account = walletState.accounts.find(a => a.chain === activeRequest.chain && a.name === activeRequest.payload.username)

    if (!account || !account.activeKey) {
      showToast("Account not found or missing active key")
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
      showToast("Signing failed: " + e)
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
  const handleMobileApprove = async (requestId: string, duration?: '1day' | '1week' | '1month', autoAccount?: Account) => {
    const request = autoAccount ? mobileProvider.getPendingRequest(requestId) : mobileSignRequest;
    if (!request) return

    if (duration) {
      await mobileProvider.grantPermission(request.domain, ['*'], duration, autoAccount?.name, autoAccount?.chain)
    }

    try {
      let result;
      console.log('[Mobile] Approving request:', requestId, 'Op:', request.operation, 'Auto:', !!autoAccount);

      // --- 1. Robust Parameter Parsing ---
      let opData = { ...request.params };
      // Some dApps pass a single 'params' string which is JSON (like PeakD sometimes)
      if (opData.params && typeof opData.params === 'string') {
        try {
          const parsed = JSON.parse(opData.params);
          opData = { ...opData, ...parsed };
        } catch (e) { console.warn('[Mobile] Failed to parse params JSON', e); }
      }

      // --- 2. Robust Account Selection ---
      let account: Account | null | undefined = autoAccount;
      if (!account) {
        account = resolveAccountForRequest(walletState.accounts, opData, request.domain);
      }
      
      if (!account) {
        // Fallback to active chain account
        const requestedChain = detectChainFromRequest(opData, request.domain)
        account = walletState.accounts.find((a) => a.chain === requestedChain)
          || walletState.accounts.find(a => a.chain === activeChain)
          || walletState.accounts[0];
      }

      if (!account) {
        console.error('[Mobile] No account found for request');
        console.error('[GWDBG][mobile:account-missing]', JSON.stringify({ requestId, operation: request.operation, params: opData }));
        showToast("Error: No account found. Please import your keys.");
        mobileProvider.rejectRequest(requestId);
        if (!autoAccount) setMobileSignRequest(null);
        return;
      }

      // --- 3. Key Identification ---
      const method = request.operation;
      const postingOps = ['vote', 'comment', 'post', 'custom_json', 'requestVote', 'requestPost'];
      const activeKeyOps = [
        'witness_update',
        'witness_set_properties',
        'account_witness_vote',
        'account_update',
        'account_update2',
        'transfer',
        'transfer_to_vesting',
        'withdraw_vesting',
        'delegate_vesting_shares',
        'account_create',
        'account_create_with_delegation',
        'transfer_to_savings',
        'transfer_from_savings',
        'escrow_transfer',
        'escrow_release',
        'escrow_dispute',
        'escrow_approve',
        'claim_reward_balance',
        'delegate_rc',
        'create_proposal',
        'update_proposal_votes',
        'remove_proposal',
        'limit_order_create',
        'limit_order_create2',
        'limit_order_cancel',
        'convert',
        'collateralized_convert',
        'fill_convert_request',
        'cancel_transfer_from_savings',
        'set_withdraw_vesting_route'
      ];
      let signBufferType: any = opData.type;
      if (typeof signBufferType === 'string') {
        try {
          signBufferType = JSON.parse(signBufferType);
        } catch {
          // Keep original value when dApp sends a non-JSON type marker.
        }
      }

      const isAuthSignBuffer =
        (method === 'requestSignBuffer' || method === 'signBuffer' || method === 'sign_buffer') &&
        typeof signBufferType === 'object' &&
        (signBufferType?.auth === 'login' || signBufferType?.auth === 'posting');

      const isPostingTypeSignBuffer =
        (method === 'requestSignBuffer' || method === 'signBuffer' || method === 'sign_buffer') &&
        typeof signBufferType === 'string' &&
        signBufferType.toLowerCase() === 'posting';

      const isPostingTypeBroadcast =
        (method === 'requestBroadcast' || method === 'broadcast') &&
        typeof opData.type === 'string' &&
        opData.type.toLowerCase() === 'posting';

      const broadcastOperationNames =
        method === 'requestBroadcast' || method === 'broadcast'
          ? collectOperationEntries(opData.operations || opData.ops).map((op: any) => Array.isArray(op) ? op[0] : op?.type || op?.operation || op?.method).filter(Boolean)
          : [];

      const isPostingBroadcastOperation = broadcastOperationNames.some((name: string) =>
        ['custom_json', 'comment', 'vote'].includes(String(name).toLowerCase())
      );

      let needsPosting =
        postingOps.includes(request.operation) ||
        postingOps.includes(opData.operation) ||
        isAuthSignBuffer ||
        isPostingTypeSignBuffer ||
        isPostingTypeBroadcast ||
        isPostingBroadcastOperation;
      let signingKey = needsPosting ? (account.postingKey || account.activeKey) : account.activeKey;
      console.log(
        '[Mobile] Key selection:',
        JSON.stringify({
          requestId,
          method,
          needsPosting,
          isAuthSignBuffer,
          isPostingTypeBroadcast,
          isPostingBroadcastOperation,
          account: account.name,
          hasPostingKey: !!account.postingKey,
          hasActiveKey: !!account.activeKey
        })
      );
      console.log('[GWDBG][mobile:key-selection]', JSON.stringify({
        requestId,
        method,
        needsPosting,
        isAuthSignBuffer,
        isPostingTypeSignBuffer,
        isPostingTypeBroadcast,
        isPostingBroadcastOperation,
        broadcastOperationNames,
        account: account.name,
        chain: account.chain,
        hasPostingKey: !!account.postingKey,
        hasActiveKey: !!account.activeKey
      }));

      if (!signingKey) {
        console.error(`[Mobile] Missing key for @${account.name}`);
        console.error('[GWDBG][mobile:key-missing]', JSON.stringify({ requestId, account: account.name, needsPosting }));
        showToast(`Missing ${needsPosting ? 'Posting' : 'Active'} key for @${account.name}.`);
        mobileProvider.rejectRequest(requestId);
        setMobileSignRequest(null);
        return;
      }

      // --- 4. Operation Execution ---
      let originalEnvelope: any = null;
      let normalizedBroadcastOps: any[] = [];

      if (method === 'transfer' || (method === 'broadcast' && opData.operation === 'transfer')) {
        const transferData = method === 'broadcast' ? opData.params : opData;
        result = await broadcastTransfer(
          account.chain as Chain,
          account.name,
          signingKey,
          transferData.to,
          transferData.amount,
          transferData.memo || '',
          transferData.symbol || (account.chain === Chain.HIVE ? 'HIVE' : account.chain === Chain.STEEM ? 'STEEM' : 'BLURT')
        )
      } else if (method === 'requestVote' || method === 'vote') {
        result = await broadcastVote(
          account.chain as Chain,
          account.name,
          account.postingKey || account.activeKey || signingKey,
          opData.author,
          opData.permlink,
          parseInt(opData.weight, 10) || 10000
        )
      } else if (method === 'requestPost' || method === 'post') {
        let parentPermlink = opData.parent_perm || opData.parent_permlink;
        const jsonMetadata = opData.json_metadata ?? opData.jsonMetadata;

        if (!parentPermlink) {
          try {
            const metadata = typeof jsonMetadata === 'string' ? JSON.parse(jsonMetadata) : jsonMetadata;
            if (metadata && Array.isArray(metadata.tags) && metadata.tags.length > 0) {
              parentPermlink = metadata.tags[0];
            }
          } catch (e) { }
          if (!parentPermlink) parentPermlink = 'general';
        }

        const op = ['comment', {
          parent_author: opData.parent_author || '',
          parent_permlink: parentPermlink || 'general',
          author: account.name,
          permlink: opData.permlink || '',
          title: opData.title || '',
          body: opData.body || '',
          json_metadata: typeof jsonMetadata === 'string' ? jsonMetadata : JSON.stringify(jsonMetadata || {})
        }];

        console.log('[GWDBG][mobile:post-operation]', JSON.stringify({
          requestId,
          chain: account.chain,
          account: account.name,
          parentPermlink,
          permlink: opData.permlink || ''
        }));

        result = await broadcastOperations(account.chain as Chain, account.postingKey || account.activeKey || signingKey, [op]);
      } else if (method === 'requestCustomJson' || method === 'customJSON' || method === 'custom_json') {
        const customJsonType = opData.type === 'Active' ? 'Active' : 'Posting'
        const customJsonKey =
          customJsonType === 'Active'
            ? (account.activeKey || account.postingKey || signingKey)
            : (account.postingKey || account.activeKey || signingKey)

        console.log('[GWDBG][mobile:custom-json:start]', JSON.stringify({
          requestId,
          chain: account.chain,
          account: account.name,
          id: opData.id || null,
          type: customJsonType,
          jsonType: typeof opData.json
        }))

        if (!customJsonKey) {
          console.error('[GWDBG][mobile:custom-json-key-missing]', JSON.stringify({ requestId, account: account.name, type: customJsonType }))
          showToast(`Missing ${customJsonType} key for @${account.name}.`)
          mobileProvider.rejectRequest(requestId)
          setModalSuggestedAccount(null)
          setMobileSignRequest(null)
          return
        }

        result = await broadcastCustomJson(
          account.chain as Chain,
          account.name,
          customJsonKey,
          opData.id,
          typeof opData.json === 'string' ? opData.json : JSON.stringify(opData.json),
          customJsonType
        )
      } else if (method === 'requestSignBuffer' || method === 'signBuffer' || method === 'sign_buffer') {
        console.log('[GWDBG][mobile:sign-buffer:start]', JSON.stringify({
          requestId,
          chain: account.chain,
          account: account.name,
          messageType: typeof (opData.message || opData.params),
          hasType: typeof opData.type !== 'undefined'
        }));
        result = signMessage(account.chain as Chain, opData.message || opData.params, signingKey);
      } else if (method === 'broadcast' || method === 'requestBroadcast') {
        // Handle multiple operations
        originalEnvelope =
          opData.transaction ||
          ((opData.operations && typeof opData.operations === 'object' && !Array.isArray(opData.operations)) ? opData.operations : null) ||
          ((opData.tx && typeof opData.tx === 'object') ? opData.tx : null);

        let ops = opData.operations || opData.ops;
        if (ops && typeof ops === 'object' && !Array.isArray(ops)) {
          ops = ops.operations || ops.tx?.operations || ops.transaction?.operations || ops;
        }
        if (typeof ops === 'string') {
          try { ops = JSON.parse(ops); } catch (e) { }
        }
        if (!Array.isArray(ops)) ops = [ops];

        // Deep normalization for each operation in the broadcast
        const normalizedOps = ops.map((op: any) => {
           if (Array.isArray(op)) return op;
           if (op && typeof op === 'object') {
             const type = op.type || op.operation || op.method;
             const data = op.data || op.op || op.operation_data || (({ type: _t, operation: _o, method: _m, ...rest }) => rest)(op);
             if (type) return [type, data];
           }
           return op;
        });
        normalizedBroadcastOps = normalizedOps;

        const requestedKeyType = typeof opData.type === 'string' ? opData.type : '';
        const requiresActiveKey = normalizedOps.some((op: any) => {
          const opName = Array.isArray(op) ? op[0] : op?.type || op?.[0];
          return activeKeyOps.includes(opName);
        });
        needsPosting = !requiresActiveKey;
        signingKey = account.postingKey;
        if (requestedKeyType === 'Active') signingKey = account.activeKey;
        else if (requiresActiveKey) signingKey = account.activeKey;
        if (!signingKey && account.activeKey) signingKey = account.activeKey;

        console.log('[GWDBG][mobile:broadcast-key-selection]', JSON.stringify({
          requestId,
          chain: account.chain,
          requestedKeyType,
          requiresActiveKey,
          selectedKeyIsActive: signingKey === account.activeKey,
          hasOriginalEnvelope: !!originalEnvelope,
          operations: normalizedOps.map((op: any) => Array.isArray(op) ? op[0] : op?.type)
        }));

        if (!signingKey) {
          console.error('[GWDBG][mobile:broadcast-key-missing]', JSON.stringify({ requestId, account: account.name, requestedKeyType, requiresActiveKey }));
          showToast(`Missing ${requiresActiveKey ? 'Active' : 'Posting'} key for @${account.name}.`);
          mobileProvider.rejectRequest(requestId);
          setModalSuggestedAccount(null);
          setMobileSignRequest(null);
          return;
        }

        result = await broadcastOperations(account.chain as Chain, signingKey, normalizedOps);
      } else {
        // Single operation fallback
        // Clean opData of protocol fluff
        const { domain: _d, operation: _o, callbackUrl: _c, id: _i, ...cleanOpData } = opData;
        
        // Final normalization for specific ops
        let opName = method.startsWith('request') ? method.substring(7).toLowerCase() : method;
        if (opName === 'vote') {
           cleanOpData.voter = cleanOpData.voter || account.name;
           cleanOpData.weight = parseInt(cleanOpData.weight) || 10000;
        }

        const op = [opName, cleanOpData];
        console.log('[Mobile] Broadcasting single op:', op);
        result = await broadcastOperations(account.chain as Chain, signingKey, [op]);
      }

      if (result?.success) {
        const resultTxId = (result as any).txId;
        console.log('[Mobile] Operation successful:', resultTxId || 'signed');
        console.log('[GWDBG][mobile:operation-success]', JSON.stringify({
          requestId,
          method,
          hasResult: !!(result as any).result,
          hasPublicKey: !!(result as any).publicKey,
          txId: resultTxId || null
        }));
        const isSplinterlands = /(^|\.)splinterlands\.com$/i.test(request.domain || '');
        const signedTransactionEnvelope =
          ((result as any).signedTx && typeof (result as any).signedTx === 'object')
            ? (result as any).signedTx
            : ((result as any).transaction && typeof (result as any).transaction === 'object')
              ? (result as any).transaction
              : null;
        const finalResult =
          method === 'requestSignBuffer' || method === 'signBuffer' || method === 'sign_buffer'
            ? result
            : (
              result && typeof result === 'object'
                ? {
                    success: true,
                    result: (
                      isSplinterlands && (method === 'broadcast' || method === 'requestBroadcast')
                        ? {
                            ...(signedTransactionEnvelope || {}),
                            ...((result as any).opResult && typeof (result as any).opResult === 'object' ? (result as any).opResult : {}),
                            signatures: (result as any).signatures,
                            id: resultTxId || (result as any).txId,
                            txId: resultTxId || (result as any).txId,
                            tx_id: resultTxId || (result as any).tx_id,
                            operation: normalizedBroadcastOps[0] && Array.isArray(normalizedBroadcastOps[0]) ? normalizedBroadcastOps[0][0] : null,
                            op: normalizedBroadcastOps[0] && Array.isArray(normalizedBroadcastOps[0]) ? normalizedBroadcastOps[0][0] : null,
                            operations: (signedTransactionEnvelope && Array.isArray((signedTransactionEnvelope as any).operations))
                              ? (signedTransactionEnvelope as any).operations
                              : normalizedBroadcastOps
                          }
                        : ((result as any).txId || (result as any).result || (result as any).opResult || result)
                    ),
                    txId: resultTxId || (result as any).txId,
                    tx_id: resultTxId || (result as any).tx_id,
                    opResult: (result as any).opResult,
                    broadcastPayload: (result as any).opResult || (result as any).txId || (result as any).result || result,
                    signatures: (result as any).signatures,
                    signedTx: (result as any).signedTx,
                    transaction: signedTransactionEnvelope || originalEnvelope || undefined,
                    operation: normalizedBroadcastOps[0] && Array.isArray(normalizedBroadcastOps[0]) ? normalizedBroadcastOps[0][0] : undefined,
                    operations: normalizedBroadcastOps,
                    message: (result as any).message || 'Operation successful'
                  }
                : { success: true, result: resultTxId || result }
            );
        console.log('[GWDBG][mobile:final-result-shape]', JSON.stringify({
          requestId,
          method,
          finalResultType: typeof finalResult,
          hasResultField: !!(finalResult as any)?.result,
          hasPublicKeyField: !!(finalResult as any)?.publicKey,
          hasTxIdField: !!(finalResult as any)?.txId,
          hasOpResultField: !!(finalResult as any)?.opResult
        }));
        mobileProvider.approveRequest(requestId, finalResult);
      } else {
        console.error('[Mobile] Broadcast failed:', result?.error);
        console.error('[GWDBG][mobile:operation-failed]', JSON.stringify({ requestId, method, error: result?.error || 'Unknown error' }));
        showToast("Failed: " + (result?.error || 'Unknown error'));
        mobileProvider.rejectRequest(requestId);
      }
    } catch (e: any) {
      console.error('[Mobile] Fatal error in request handler:', e);
      console.error('[GWDBG][mobile:operation-exception]', JSON.stringify({ requestId, error: e?.message || String(e) }));
      showToast("Error: " + (e.message || String(e)));
      mobileProvider.rejectRequest(requestId);
    }
    setModalSuggestedAccount(null);
    setMobileSignRequest(null);
  }

  const handleMobileReject = (requestId: string) => {
    mobileProvider.rejectRequest(requestId)
    setModalSuggestedAccount(null)
    setMobileSignRequest(null)
  }

  const handleDeviceSyncImport = async (payload: SyncPayload) => {
    const mergedAccounts = [...walletState.accounts]
    payload.accounts.forEach((account) => {
      if (!mergedAccounts.find((candidate) => candidate.name === account.name && candidate.chain === account.chain)) {
        mergedAccounts.push(account)
      }
    })

    setWalletState(prev => ({ ...prev, accounts: mergedAccounts }))
    await persistAccountsVault(mergedAccounts)
    showToast('Wallet imported from another device')
  }

  const startScan = async () => {
    try {
      console.log('[Scanner] Checking ML Kit module availability...');
      const isAvailable = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      if (!isAvailable.available) {
        console.log('[Scanner] ML Kit module not found. Installing...');
        showToast("Preparing scanner... (Downloading assets, please wait)");
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      }

      // 1. Check Permissions
      const status = await BarcodeScanner.checkPermissions();
      if (status.camera !== 'granted') {
        const req = await BarcodeScanner.requestPermissions();
        if (req.camera !== 'granted') {
          showToast("Camera permission is required to scan QR codes.");
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
            showToast("Connection failed: " + err);
          }
        } else {
          showToast("Invalid QR Code: Not a Gravity Bridge session");
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
      showToast("Error opening scanner: " + e);
    }
  }

  const handleValidatePin = async () => {
    if (!pinValue) return;
    setIsVerifying(true);
    try {
      await bridgeService.validatePairing(pinValue.trim());
      // We don't close showPinPrompt here, we wait for onSyncAccounts or an error timeout
      setTimeout(() => {
        setIsVerifying((prev) => {
          if (prev) {
            showToast("Pairing timeout: Please check if the extension is open and the PIN is correct.");
            return false;
          }
          return prev;
        });
      }, 10000);
    } catch (e) {
      setIsVerifying(false);
      showToast("Error sending validation: " + e);
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
            isRefreshing={isRefreshingWallets}
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
        {/* EXPLORER VIEW */}
        {currentView === 'explorer' && (
          <div className="h-full w-full">
            <BrowserView
              accounts={walletState.accounts}
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
              onSyncImport={handleDeviceSyncImport}
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
          onClick={() => setCurrentView('explorer')}
          className={`flex flex-col items-center gap-1.5 transition-all outline-none bg-transparent border-none p-0 ${currentView === 'explorer' ? 'text-blue-400 opacity-100' : 'opacity-30'}`}
          style={{ backgroundColor: 'transparent' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
          <span className={`text-[8px] font-black uppercase tracking-widest ${currentView === 'explorer' ? 'border-b border-blue-400' : ''}`}>Explorer</span>
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
          accounts={walletState.accounts}
          suggestedAccount={modalSuggestedAccount}
          suggestedChain={detectChainFromRequest(mobileSignRequest.params, mobileSignRequest.domain)}
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
                showToast("Transfer Sent! TX: " + result.txId?.substring(0, 8));
              } else {
                showToast("Failed: " + result.error);
              }
            } catch (e) {
              showToast("Error: " + e);
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

      {/* 6. In-App Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-0 right-0 z-[200] flex justify-center px-4 animate-slideDown pointer-events-none">
          <div className="bg-purple-900/95 border border-purple-500/50 backdrop-blur-md text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-xs font-black tracking-wide uppercase">{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
