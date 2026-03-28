import React, { useEffect, useMemo, useState } from 'react';
import { Chain, Account, MultiSigRequest } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import {
  broadcastSignedTransaction,
  calculateThresholdProgress,
  createUnsignedTransaction,
  getAccountAuthorities,
  MultiSigAuthority,
  PartialTransactionSignature,
  selectBroadcastSignatures,
  signTransactionEnvelope
} from '../services/chainService';
import { storageService } from '../services/storageService';

interface MultiSigProps {
  chain: Chain;
  accounts: Account[];
  onChainChange?: (chain: Chain) => void;
}

type OpType = 'transfer' | 'delegate_vesting_shares' | 'transfer_to_vesting' | 'withdraw_vesting' | 'custom';

interface SavedMultiSigProposal {
  id: string;
  title: string;
  chain: Chain;
  initiator: string;
  threshold: number;
  signers: string[];
  expiration: string | null;
  operationType: OpType;
  operation: string;
  authoritySnapshot?: MultiSigAuthority | null;
  unsignedTransaction?: any;
  partialSignatures: PartialTransactionSignature[];
  lastBroadcastTxId?: string;
  createdAt: number;
}

const MULTISIG_STORAGE_KEY = 'gravity_multisig_proposals';

interface SharedMultiSigPackage {
  version: 1;
  kind: 'gravity-multisig-proposal';
  proposal: SavedMultiSigProposal;
}

const DIRECT_MULTISIG_EXPIRATION_MINUTES = 55;

const toLocalDateTimeInput = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const getDefaultMultiSigExpiration = (): string => toLocalDateTimeInput(
  new Date(Date.now() + DIRECT_MULTISIG_EXPIRATION_MINUTES * 60 * 1000)
);

const normalizeMultiSigExpiration = (rawValue?: string | null): { localValue: string; isoValue: string } => {
  const parsed = rawValue ? new Date(rawValue) : new Date();
  const safeBase = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const now = Date.now();
  const maxAllowed = now + DIRECT_MULTISIG_EXPIRATION_MINUTES * 60 * 1000;
  const clampedTime = Math.min(Math.max(safeBase.getTime(), now + 60 * 1000), maxAllowed);
  const clampedDate = new Date(clampedTime);

  return {
    localValue: toLocalDateTimeInput(clampedDate),
    isoValue: clampedDate.toISOString()
  };
};

const normalizeSavedProposal = (proposal: Partial<SavedMultiSigProposal> | null | undefined): SavedMultiSigProposal | null => {
  if (!proposal || !proposal.chain || !proposal.initiator || !proposal.operation) {
    return null;
  }

  return {
    id: proposal.id || crypto.randomUUID(),
    title: proposal.title || `${proposal.chain} proposal • @${proposal.initiator}`,
    chain: proposal.chain,
    initiator: proposal.initiator,
    threshold: Number(proposal.threshold) || 1,
    signers: Array.isArray(proposal.signers) ? proposal.signers : [],
    expiration: proposal.expiration || null,
    operationType: proposal.operationType || 'custom',
    operation: proposal.operation,
    authoritySnapshot: proposal.authoritySnapshot || null,
    unsignedTransaction: proposal.unsignedTransaction,
    partialSignatures: Array.isArray(proposal.partialSignatures) ? proposal.partialSignatures : [],
    lastBroadcastTxId: proposal.lastBroadcastTxId,
    createdAt: proposal.createdAt || Date.now()
  };
};

const chainTheme = {
  [Chain.HIVE]: 'bg-hive text-white shadow-lg',
  [Chain.STEEM]: 'bg-steem text-white shadow-lg',
  [Chain.BLURT]: 'bg-blurt text-white shadow-lg'
};

export const MultiSig: React.FC<MultiSigProps> = ({ chain: initialChain, accounts, onChainChange }) => {
  const { t } = useTranslation();
  const [selectedChain, setSelectedChain] = useState<Chain>(initialChain);
  const [newSigner, setNewSigner] = useState('');
  const [opType, setOpType] = useState<OpType>('transfer');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [expiresAt, setExpiresAt] = useState(() => getDefaultMultiSigExpiration());
  const [copied, setCopied] = useState(false);
  const [saveLabel, setSaveLabel] = useState('');
  const [importPayload, setImportPayload] = useState('');
  const [savedProposals, setSavedProposals] = useState<SavedMultiSigProposal[]>([]);
  const [proposalBusyId, setProposalBusyId] = useState<string | null>(null);
  const [authorityLoading, setAuthorityLoading] = useState(false);
  const [authority, setAuthority] = useState<MultiSigAuthority | null>(null);
  const [authorityError, setAuthorityError] = useState<string | null>(null);

  const chainAccounts = useMemo(
    () => accounts.filter((account) => account.chain === selectedChain),
    [accounts, selectedChain]
  );

  const [request, setRequest] = useState<MultiSigRequest>({
    initiator: chainAccounts[0]?.name || '',
    signers: [],
    threshold: 1,
    operation: '{}'
  });

  useEffect(() => {
    setSelectedChain(initialChain);
  }, [initialChain]);

  useEffect(() => {
    let cancelled = false;

    const loadSavedProposals = async () => {
      try {
        const raw = await storageService.getItem(MULTISIG_STORAGE_KEY);
        if (!raw || cancelled) return;
        const parsed = JSON.parse(raw) as SavedMultiSigProposal[];
        if (!cancelled && Array.isArray(parsed)) {
          const normalized = parsed
            .map((proposal) => normalizeSavedProposal(proposal))
            .filter((proposal): proposal is SavedMultiSigProposal => !!proposal);

          setSavedProposals(normalized);

          if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
            await storageService.setItem(MULTISIG_STORAGE_KEY, JSON.stringify(normalized));
          }
        }
      } catch (error) {
        console.warn('Failed to load saved multisig proposals:', error);
      }
    };

    loadSavedProposals();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const fallbackInitiator = chainAccounts[0]?.name || '';
    setRequest(prev => ({
      ...prev,
      initiator: chainAccounts.some((account) => account.name === prev.initiator) ? prev.initiator : fallbackInitiator,
      signers: prev.signers.filter((signer) => signer.trim().length > 0)
    }));
  }, [chainAccounts]);

  useEffect(() => {
    let cancelled = false;

    const loadAuthority = async () => {
      if (!request.initiator) {
        setAuthority(null);
        setAuthorityError(null);
        return;
      }

      setAuthorityLoading(true);
      setAuthorityError(null);

      try {
        const auth = await getAccountAuthorities(selectedChain, request.initiator, 'active');
        if (cancelled) return;
        setAuthority(auth);
        if (auth?.threshold) {
          setRequest(prev => ({
            ...prev,
            threshold: Math.max(1, Math.min(prev.threshold || auth.threshold, auth.threshold))
          }));
        }
      } catch (error: any) {
        if (cancelled) return;
        setAuthority(null);
        setAuthorityError(error?.message || 'Failed to inspect account authority.');
      } finally {
        if (!cancelled) setAuthorityLoading(false);
      }
    };

    loadAuthority();
    return () => {
      cancelled = true;
    };
  }, [request.initiator, selectedChain]);

  useEffect(() => {
    const asset = selectedChain === Chain.HIVE ? 'HIVE' : selectedChain === Chain.STEEM ? 'STEEM' : 'BLURT';

    const fmtAmount = (value: string) => `${parseFloat(value || '0').toFixed(3)} ${asset}`;
    const fmtVests = (value: string) => `${parseFloat(value || '0').toFixed(6)} VESTS`;

    if (opType === 'custom') return;

    let operation: any = {};

    switch (opType) {
      case 'transfer':
        operation = [
          'transfer',
          {
            from: request.initiator,
            to,
            amount: fmtAmount(amount),
            memo
          }
        ];
        break;
      case 'delegate_vesting_shares':
        operation = [
          'delegate_vesting_shares',
          {
            delegator: request.initiator,
            delegatee: to,
            vesting_shares: fmtVests(amount)
          }
        ];
        break;
      case 'transfer_to_vesting':
        operation = [
          'transfer_to_vesting',
          {
            from: request.initiator,
            to: to || request.initiator,
            amount: fmtAmount(amount)
          }
        ];
        break;
      case 'withdraw_vesting':
        operation = [
          'withdraw_vesting',
          {
            account: request.initiator,
            vesting_shares: fmtVests(amount)
          }
        ];
        break;
    }

    setRequest(prev => ({
      ...prev,
      operation: JSON.stringify(operation, null, 2)
    }));
  }, [amount, memo, opType, request.initiator, selectedChain, to]);

  const availableSigners = useMemo(() => {
    const local = chainAccounts.map(account => account.name);
    const onChain = authority?.accountAuths.map(([name]) => name) || [];
    return Array.from(new Set([...local, ...onChain])).filter(Boolean);
  }, [authority?.accountAuths, chainAccounts]);

  const activeAuthorityAccounts = authority?.accountAuths ?? [];
  const activeAuthorityKeys = authority?.keyAuths ?? [];
  const looksLikeMultisig = !!authority && (activeAuthorityAccounts.length > 0 || authority.threshold > 1);
  const effectiveThreshold = authority?.threshold || request.threshold;

  const addSigner = (signerName?: string) => {
    const signer = (signerName ?? newSigner).trim().replace(/^@/, '');
    if (!signer || request.signers.includes(signer)) return;
    setRequest(prev => ({ ...prev, signers: [...prev.signers, signer] }));
    setNewSigner('');
  };

  const removeSigner = (signer: string) => {
    setRequest(prev => ({ ...prev, signers: prev.signers.filter(candidate => candidate !== signer) }));
  };

  const proposalDraft = useMemo(() => {
    return JSON.stringify({
      chain: selectedChain,
      initiator: request.initiator,
      threshold: effectiveThreshold,
      signers: request.signers,
      expiration: expiresAt ? new Date(expiresAt).toISOString() : null,
      operation: (() => {
        try {
          return JSON.parse(request.operation);
        } catch {
          return request.operation;
        }
      })(),
      authoritySnapshot: authority
    }, null, 2);
  }, [authority, effectiveThreshold, expiresAt, request.initiator, request.operation, request.signers, selectedChain]);

  const handleCopyDraft = async () => {
    await navigator.clipboard.writeText(proposalDraft);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const persistSavedProposals = async (proposals: SavedMultiSigProposal[]) => {
    setSavedProposals(proposals);
    await storageService.setItem(MULTISIG_STORAGE_KEY, JSON.stringify(proposals));
  };

  const handleSaveProposal = async () => {
    const normalizedExpiration = normalizeMultiSigExpiration(expiresAt);
    let operationPayload: any;
    try {
      operationPayload = JSON.parse(request.operation);
    } catch {
      operationPayload = request.operation;
    }

    const unsignedTransaction = await createUnsignedTransaction(
      selectedChain,
      Array.isArray(operationPayload) ? [operationPayload] : operationPayload,
      normalizedExpiration.isoValue
    );

    const proposal: SavedMultiSigProposal = {
      id: crypto.randomUUID(),
      title: saveLabel.trim() || `${selectedChain} proposal • @${request.initiator || 'unknown'}`,
      chain: selectedChain,
      initiator: request.initiator,
      threshold: effectiveThreshold,
      signers: request.signers,
      expiration: normalizedExpiration.isoValue,
      operationType: opType,
      operation: request.operation,
      authoritySnapshot: authority,
      unsignedTransaction,
      partialSignatures: [],
      createdAt: Date.now()
    };

    const proposals = [proposal, ...savedProposals].slice(0, 20);
    await persistSavedProposals(proposals);
    setSaveLabel('');
  };

  const handleLoadProposal = (proposal: SavedMultiSigProposal) => {
    const normalizedExpiration = normalizeMultiSigExpiration(proposal.expiration);
    setSelectedChain(proposal.chain);
    setOpType(proposal.operationType);
    setExpiresAt(normalizedExpiration.localValue);
    setRequest({
      initiator: proposal.initiator,
      signers: proposal.signers,
      threshold: proposal.threshold,
      operation: proposal.operation
    });

    try {
      const parsed = JSON.parse(proposal.operation);
      if (Array.isArray(parsed) && parsed.length === 2) {
        const [, payload] = parsed;
        setTo(payload.to || payload.delegatee || '');
        setMemo(payload.memo || '');
        setAmount(
          typeof payload.amount === 'string'
            ? payload.amount.split(' ')[0]
            : typeof payload.vesting_shares === 'string'
              ? payload.vesting_shares.split(' ')[0]
              : '0'
        );
      }
    } catch {
      setTo('');
      setMemo('');
      setAmount('');
    }
  };

  const handleDeleteProposal = async (proposalId: string) => {
    const proposals = savedProposals.filter((proposal) => proposal.id !== proposalId);
    await persistSavedProposals(proposals);
  };

  const getLocalSigners = (proposal: SavedMultiSigProposal): Account[] => {
    const allowedNames = new Set([
      ...proposal.signers,
      ...(proposal.authoritySnapshot?.accountAuths.map(([name]) => name) || [])
    ]);
    const signedNames = new Set((proposal.partialSignatures || []).map((entry) => entry.username));

    return accounts
      .filter((account) =>
        account.chain === proposal.chain &&
        !!account.activeKey &&
        allowedNames.has(account.name)
      )
      .sort((left, right) => {
        const leftSigned = signedNames.has(left.name) ? 1 : 0;
        const rightSigned = signedNames.has(right.name) ? 1 : 0;
        if (leftSigned !== rightSigned) return leftSigned - rightSigned;
        return left.name.localeCompare(right.name);
      });
  };

  const handlePartialSignProposal = async (proposal: SavedMultiSigProposal, signer: Account) => {
    if (!signer?.activeKey || !proposal.unsignedTransaction) return;

    setProposalBusyId(proposal.id);
    try {
      const signResult = await signTransactionEnvelope(
        proposal.chain,
        proposal.unsignedTransaction,
        signer.activeKey,
        signer.name
      );

      if (!signResult.success || !signResult.signature || !signResult.publicKey) {
        throw new Error(signResult.error || 'Partial sign failed');
      }

      const nextProposal: SavedMultiSigProposal = {
        ...proposal,
        partialSignatures: [
          ...proposal.partialSignatures.filter((entry) => entry.username !== signer.name),
          {
            username: signer.name,
            pubKey: signResult.publicKey,
            signature: signResult.signature
          }
        ]
      };

      await persistSavedProposals(savedProposals.map((entry) => entry.id === proposal.id ? nextProposal : entry));
    } catch (error) {
      console.warn('Failed to partial-sign multisig proposal:', error);
    } finally {
      setProposalBusyId(null);
    }
  };

  const handleBroadcastProposal = async (proposal: SavedMultiSigProposal) => {
    if (!proposal.unsignedTransaction || !proposal.authoritySnapshot) return;

    setProposalBusyId(proposal.id);
    try {
      const selectedSignatures = selectBroadcastSignatures(proposal.authoritySnapshot, proposal.partialSignatures);
      if (selectedSignatures.length === 0) {
        throw new Error('No valid signatures available for broadcast');
      }

      const signedTransaction = {
        ...proposal.unsignedTransaction,
        signatures: selectedSignatures.map((entry) => entry.signature)
      };

      const result = await broadcastSignedTransaction(proposal.chain, signedTransaction);
      if (!result.success) throw new Error(result.error || 'Broadcast failed');

      const nextProposal: SavedMultiSigProposal = {
        ...proposal,
        lastBroadcastTxId: result.txId
      };

      await persistSavedProposals(savedProposals.map((entry) => entry.id === proposal.id ? nextProposal : entry));
    } catch (error) {
      console.warn('Failed to broadcast multisig proposal:', error);
    } finally {
      setProposalBusyId(null);
    }
  };

  const buildSharedPackage = (proposal: SavedMultiSigProposal): SharedMultiSigPackage => ({
    version: 1,
    kind: 'gravity-multisig-proposal',
    proposal
  });

  const handleCopyProposalPackage = async (proposal: SavedMultiSigProposal) => {
    await navigator.clipboard.writeText(JSON.stringify(buildSharedPackage(proposal), null, 2));
  };

  const handleImportProposal = async () => {
    if (!importPayload.trim()) return;

    try {
      const parsed = JSON.parse(importPayload) as SharedMultiSigPackage | SavedMultiSigProposal;
      const proposal = (parsed as SharedMultiSigPackage).kind === 'gravity-multisig-proposal'
        ? (parsed as SharedMultiSigPackage).proposal
        : parsed as SavedMultiSigProposal;

      if (!proposal || !proposal.chain || !proposal.initiator || !proposal.operation) {
        throw new Error('Invalid proposal package');
      }

      const normalizedProposal = normalizeSavedProposal(proposal);

      if (!normalizedProposal) {
        throw new Error('Invalid proposal package');
      }

      const proposals = [
        normalizedProposal,
        ...savedProposals.filter((candidate) => candidate.id !== normalizedProposal.id)
      ].slice(0, 20);

      await persistSavedProposals(proposals);
      setImportPayload('');
    } catch (error) {
      console.warn('Failed to import multisig proposal package:', error);
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4">
      <div className="space-y-4">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">{t('multisig.title')}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Build a multisig proposal draft and inspect the live account authority before coordinating signatures.
              </p>
            </div>
            <div className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Alpha
            </div>
          </div>

          <div className="flex p-1 bg-dark-900 rounded-xl mt-5 border border-dark-700">
            {[Chain.BLURT, Chain.HIVE, Chain.STEEM].map((chain) => (
              <button
                key={chain}
                onClick={() => {
                  setSelectedChain(chain);
                  onChainChange?.(chain);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${selectedChain === chain ? chainTheme[chain] : 'text-slate-500 hover:text-slate-300'}`}
              >
                {chain}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold">{t('multisig.initiator')}</label>
              <select
                value={request.initiator}
                onChange={(e) => setRequest(prev => ({ ...prev, initiator: e.target.value }))}
                className="w-full mt-2 bg-dark-900 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
              >
                {chainAccounts.length === 0 && <option value="">No {selectedChain} accounts imported</option>}
                {chainAccounts.map((account) => (
                  <option key={`${account.chain}:${account.name}`} value={account.name}>
                    @{account.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold">{t('multisig.threshold')}</label>
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, effectiveThreshold || request.signers.length || 1)}
                  value={effectiveThreshold}
                  onChange={(e) => setRequest(prev => ({ ...prev, threshold: Math.max(1, Number(e.target.value) || 1) }))}
                  disabled={!!authority}
                  className="w-full mt-2 bg-dark-900 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 disabled:text-slate-400 disabled:bg-dark-800 disabled:border-dark-700"
                />
                {authority && (
                  <p className="mt-2 text-[10px] text-slate-500">
                    Locked to on-chain threshold while authority is available.
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold">{t('multisig.expiration')}</label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full mt-2 bg-dark-900 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                />
                <p className="mt-2 text-[10px] text-slate-500">
                  Direct multisig transactions should stay within about {DIRECT_MULTISIG_EXPIRATION_MINUTES} minutes.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-dark-700 bg-dark-900/60 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">{t('multisig.authorities_title')}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {authorityLoading
                      ? 'Inspecting live active authority...'
                      : looksLikeMultisig
                        ? `On-chain threshold ${authority?.threshold}. Account auths and keys below are the real source of truth.`
                        : 'This account does not currently expose a clear on-chain multisig active authority.'}
                  </p>
                </div>
                {authority && (
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] ${looksLikeMultisig ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {looksLikeMultisig ? 'Ready' : 'Single Signer'}
                  </div>
                )}
              </div>

              {authorityError && (
                <div className="text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl p-3">
                  {authorityError}
                </div>
              )}

              {authority && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-300">
                    Threshold: <span className="font-black text-white">{authority.threshold}</span>
                  </div>

                  <div className="space-y-2">
                    {activeAuthorityAccounts.length > 0 ? activeAuthorityAccounts.map(([name, weight]) => (
                      <div key={`acc:${name}`} className="flex items-center justify-between bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-xs">
                        <span className="text-slate-200">@{name}</span>
                        <span className="text-blue-400 font-black">+{weight}</span>
                      </div>
                    )) : (
                      <div className="text-xs text-slate-500 italic">No account-based signers defined on-chain.</div>
                    )}

                    {activeAuthorityKeys.length > 0 && (
                      <div className="pt-1 space-y-2">
                        {activeAuthorityKeys.map(([key, weight]) => (
                          <div key={`key:${key}`} className="flex items-center justify-between bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-[11px]">
                            <span className="text-slate-400 font-mono truncate">{key.slice(0, 10)}...{key.slice(-8)}</span>
                            <span className="text-purple-400 font-black">+{weight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold">{t('multisig.signers')}</label>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 mt-2">
                <input
                  value={newSigner}
                  onChange={(e) => setNewSigner(e.target.value)}
                  placeholder="username"
                  className="min-w-0 bg-dark-900 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => addSigner()}
                  className="px-3 sm:px-4 min-w-[64px] rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-black transition-colors"
                >
                  Add
                </button>
              </div>
              {availableSigners.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {availableSigners.map((signer) => (
                    <button
                      key={signer}
                      onClick={() => addSigner(signer)}
                      className="px-3 py-1.5 rounded-full bg-dark-900 border border-dark-700 text-xs text-slate-300 hover:border-blue-500 hover:text-white transition-colors"
                    >
                      @{signer}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
              {request.signers.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No proposal signers selected yet.</div>
              ) : request.signers.map((signer) => (
                <span key={signer} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
                  @{signer}
                  <button onClick={() => removeSigner(signer)} className="text-blue-200 hover:text-white transition-colors">
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div>
              <label className="text-xs text-slate-500 uppercase font-bold">{t('multisig.proposal')}</label>
              <select
                value={opType}
                onChange={(e) => setOpType(e.target.value as OpType)}
                className="w-full mt-2 bg-dark-900 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="transfer">Transfer</option>
                <option value="delegate_vesting_shares">Delegate Power</option>
                <option value="transfer_to_vesting">Power Up</option>
                <option value="withdraw_vesting">Power Down</option>
                <option value="custom">Custom JSON</option>
              </select>
            </div>

            {opType !== 'custom' && (
              <div className="space-y-3 rounded-2xl border border-dark-700 bg-dark-900/60 p-4">
                {opType !== 'withdraw_vesting' && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Target account</label>
                    <input
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder={opType === 'transfer_to_vesting' ? `Default: @${request.initiator}` : 'username'}
                      className="w-full bg-dark-800 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {opType === 'delegate_vesting_shares' || opType === 'withdraw_vesting'
                      ? 'Amount (VESTS)'
                      : `Amount (${selectedChain})`}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.000"
                    className="w-full bg-dark-800 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>

                {opType === 'transfer' && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Memo</label>
                    <input
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="Optional note"
                      className="w-full bg-dark-800 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-500 uppercase font-bold">Operation preview</label>
                {opType !== 'custom' && <span className="text-[10px] text-blue-400">Generated</span>}
              </div>
              <textarea
                className={`w-full bg-dark-950 border border-dark-600 rounded-2xl p-3 text-[11px] font-mono h-32 outline-none focus:border-blue-500 ${opType !== 'custom' ? 'text-slate-400' : 'text-white'}`}
                value={request.operation}
                onChange={(e) => opType === 'custom' && setRequest(prev => ({ ...prev, operation: e.target.value }))}
                readOnly={opType !== 'custom'}
              />
            </div>

            <div className="rounded-2xl border border-dark-700 bg-dark-900/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Proposal draft</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Export this JSON to coordinate signatures manually while we finish the full multisig transport flow.
                  </p>
                </div>
                <button
                  onClick={handleCopyDraft}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-[0.18em] transition-colors shrink-0"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="mt-3 text-[10px] text-slate-300 whitespace-pre-wrap break-all bg-black/30 rounded-xl p-3 border border-dark-700 max-h-48 overflow-y-auto custom-scrollbar">
                {proposalDraft}
              </pre>
            </div>

            <div className="rounded-2xl border border-dark-700 bg-dark-900/60 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Saved proposals</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Keep local drafts here while we finish the signer notification and collection flow.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-stretch">
                <input
                  value={saveLabel}
                  onChange={(e) => setSaveLabel(e.target.value)}
                  placeholder="Proposal label"
                  className="min-w-0 flex-1 bg-dark-800 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSaveProposal}
                  disabled={!request.initiator || !request.operation}
                  className="px-4 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-dark-700 disabled:text-slate-500 text-white text-sm font-black transition-colors"
                >
                  Save
                </button>
              </div>

              <div className="space-y-2">
                {savedProposals.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">No saved multisig proposals yet.</div>
                ) : savedProposals.map((proposal) => (
                  <div key={proposal.id} className="rounded-xl border border-dark-700 bg-dark-800 px-3 py-3">
                    {(() => {
                      const partialSignatures = Array.isArray(proposal.partialSignatures) ? proposal.partialSignatures : [];
                      const progress = proposal.authoritySnapshot
                        ? calculateThresholdProgress(proposal.authoritySnapshot, partialSignatures)
                        : null;
                      const localSigners = getLocalSigners(proposal);
                      const signedNames = new Set(partialSignatures.map((entry) => entry.username));

                      return (
                    <div className="space-y-3">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{proposal.title}</div>
                        <div className="text-[11px] text-slate-400 mt-1 break-words">
                          {proposal.chain} • @{proposal.initiator} • draft threshold {proposal.threshold}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {new Date(proposal.createdAt).toLocaleString()}
                        </div>
                        {progress && (
                          <div className="mt-2 text-[10px] text-slate-400">
                            Progress: <span className="font-bold text-white">{progress.currentWeight}</span> / {progress.threshold} on-chain
                          </div>
                        )}
                        {progress && proposal.threshold !== progress.threshold && (
                          <div className="mt-1 text-[10px] text-amber-400 break-words">
                            Saved draft threshold differs from current on-chain threshold. On-chain value wins.
                          </div>
                        )}
                        {partialSignatures.length > 0 && (
                          <div className="mt-1 text-[10px] text-blue-400 break-words">
                            Signed by {partialSignatures.map((entry) => `@${entry.username}`).join(', ')}
                          </div>
                        )}
                        {proposal.lastBroadcastTxId && (
                          <div className="mt-1 text-[10px] text-green-400 break-all">
                            Broadcasted: {proposal.lastBroadcastTxId}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleLoadProposal(proposal)}
                          className="min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-[10px] font-black uppercase tracking-[0.12em] text-slate-300 hover:border-blue-500 hover:text-white transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleCopyProposalPackage(proposal)}
                          className="min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-[10px] font-black uppercase tracking-[0.12em] text-slate-300 hover:border-purple-500 hover:text-white transition-colors"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => handleDeleteProposal(proposal.id)}
                          className="min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-[10px] font-black uppercase tracking-[0.12em] text-slate-300 hover:border-red-500 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          {localSigners.length > 0 ? localSigners.map((signer) => (
                            <button
                              key={`${proposal.id}:${signer.chain}:${signer.name}`}
                              onClick={() => handlePartialSignProposal(proposal, signer)}
                              disabled={proposalBusyId === proposal.id || signedNames.has(signer.name)}
                              className="min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-[9px] leading-tight font-black uppercase tracking-[0.08em] text-slate-300 hover:border-purple-500 hover:text-white transition-colors disabled:text-slate-600 disabled:border-dark-700"
                            >
                              {proposalBusyId === proposal.id ? '...' : signedNames.has(signer.name) ? (
                                <span className="block break-words normal-case tracking-normal font-bold">
                                  Signed @{signer.name}
                                </span>
                              ) : (
                                <span className="block break-words normal-case tracking-normal font-bold">
                                  Sign @{signer.name}
                                </span>
                              )}
                            </button>
                          )) : (
                            <div className="col-span-2 min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-700 text-[10px] text-slate-500 text-center">
                              No local signer
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleBroadcastProposal(proposal)}
                          disabled={!progress?.canBroadcast || proposalBusyId === proposal.id || !!proposal.lastBroadcastTxId}
                          className="w-full min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-[9px] leading-tight font-black uppercase tracking-[0.08em] text-slate-300 hover:border-green-500 hover:text-white transition-colors disabled:text-slate-600 disabled:border-dark-700"
                        >
                          Broadcast
                        </button>
                      </div>
                    </div>
                      );
                    })()}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dark-700/80 space-y-2">
                <p className="text-[11px] text-slate-400">
                  Paste a shared proposal package here to import it into this device.
                </p>
                <textarea
                  value={importPayload}
                  onChange={(e) => setImportPayload(e.target.value)}
                  placeholder='{"kind":"gravity-multisig-proposal", ...}'
                  className="w-full bg-dark-950 border border-dark-600 rounded-2xl p-3 text-[11px] font-mono h-24 outline-none focus:border-blue-500 text-slate-300"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleImportProposal}
                    disabled={!importPayload.trim()}
                    className="px-4 py-2 rounded-xl bg-dark-900 border border-dark-600 disabled:text-slate-600 disabled:border-dark-700 text-slate-200 text-xs font-black uppercase tracking-[0.14em] hover:border-blue-500 hover:text-white transition-colors"
                  >
                    Import package
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
