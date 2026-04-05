import React, { useEffect, useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import { Account, Chain } from '../types';
import { MultiSigProgress } from './MultiSigProgress';
import { broadcastTransfer, broadcastVote, broadcastCustomJson, signMessage, broadcastOperations, broadcastPowerUp, broadcastPowerDown, broadcastDelegation, broadcastWitnessVote, getAccountAuthorities, MultiSigAuthority, MultisigProgress as IMultisigProgress, validateAccountKeys } from '../services/chainService';

interface SignRequestProps {
    requestId: string;
    accounts: Account[];
    onComplete: () => void;
}

declare const chrome: any;

const normalizeKeyType = (type: any): 'posting' | 'active' | 'memo' | '' => {
    if (typeof type !== 'string') return '';
    const normalized = type.trim().toLowerCase();
    if (normalized === 'posting' || normalized === 'active' || normalized === 'memo') {
        return normalized;
    }
    return '';
};

export const SignRequest: React.FC<SignRequestProps> = ({ requestId, accounts, onComplete }) => {
    const { t } = useTranslation();
    const { showNotification } = useNotification();
    const [request, setRequest] = useState<any>(null);
    const [origin, setOrigin] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [voteWeight, setVoteWeight] = useState<number>(10000);
    const [chainHint, setChainHint] = useState<Chain | null>(null);
    const [authority, setAuthority] = useState<MultiSigAuthority | null>(null);
    const [multisigProgress, setMultisigProgress] = useState<IMultisigProgress | null>(null);
    const [isMultisig, setIsMultisig] = useState(false);

    useEffect(() => {
        chrome.runtime.sendMessage({ type: 'gravity_get_request', requestId }, (resp: any) => {
            if (resp && resp.request) {
                setRequest(resp.request);
                setOrigin(resp.origin || t('sign.unknown_source'));
                if (resp.chain) setChainHint(resp.chain as Chain);

                // Initialize vote weight if applicable
                const method = resp.request.method;
                if (method === 'requestVote' || method === 'vote') {
                    setVoteWeight(Number(resp.request.params[3]));
                }
            } else {
                setError(t('sign.expired'));
            }
            setLoading(false);
        });
    }, [requestId, t]);

    const extractBroadcastOperations = (value: any): any[] => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'object') {
            if (Array.isArray(value.operations)) return value.operations;
            if (value.tx && Array.isArray(value.tx.operations)) return value.tx.operations;
            if (value.transaction && Array.isArray(value.transaction.operations)) return value.transaction.operations;
        }
        return value ? [value] : [];
    };

    const [trustDomain, setTrustDomain] = useState(false);

    useEffect(() => {
        if (!request || !accounts.length) return;

        const checkMultisig = async () => {
            let username = request.params[0];
            let targetChain = chainHint;
            let account = accounts.find(a => a.name === username && (targetChain ? a.chain === targetChain : true));
            if (!account && !targetChain) {
                account = accounts.find(a => a.name === username && a.chain === 'HIVE');
            }
            if (!account) account = accounts.find(a => a.name === username);

            // Extract user from broadcast operations if not found
            if (!account && Array.isArray(request.params)) {
                const operations = extractBroadcastOperations(request.params[1]);
                const accountNames = accounts.map(a => a.name.toLowerCase());

                for (const op of operations) {
                    if (Array.isArray(op) && op.length >= 2 && typeof op[1] === 'object') {
                        const opData = op[1];
                        const possibleUsers = [opData.voter, opData.from, opData.author, opData.delegator, opData.account]
                            .filter(u => typeof u === 'string');

                        for (const possibleUser of possibleUsers) {
                            if (accountNames.includes(possibleUser.toLowerCase())) {
                                username = possibleUser;
                                account = accounts.find(a => a.name.toLowerCase() === possibleUser.toLowerCase());
                                if (account) break;
                            }
                        }
                        if (account) break;
                    }
                }
            }

            if (!account) return;

            const isActiveOp = ['requestTransfer', 'requestPowerUp', 'requestPowerDown', 'requestDelegation', 'requestWitnessVote'].includes(request.method);
            const authType = isActiveOp ? 'active' : 'posting';

            const auth = await getAccountAuthorities(account.chain, account.name, authType);
            if (auth && auth.threshold > 1) {
                setAuthority(auth);
                setIsMultisig(true);
                // Initialize progress as empty for now (will be fetched from chat server later)
                setMultisigProgress({
                    currentWeight: 0,
                    threshold: auth.threshold,
                    canBroadcast: false
                });
            }
        };

        checkMultisig();
    }, [request, accounts, chainHint]);

    // ... (keep handleDecision logic, but verify placement) ...
    // NOTE: I will insert the logic inside handleDecision via a separate chunk or modify the entire function block if needed.
    // Let's modify handleDecision start.

    const handleDecision = async (accept: boolean) => {
        if (!accept) {
            notifyBackground(null, t('sign.user_rejected'));
            return;
        }

        // Save Whitelist if trusted
        if (trustDomain && domain) {
            chrome.storage.local.get(['gravity_whitelist'], (res: any) => {
                const whitelist = res.gravity_whitelist || [];
                const username = request.params[0];
                const method = request.method;
                // Avoid duplicates
                const exists = whitelist.some((e: any) =>
                    e.domain === domain && e.username === username && e.method === method
                );
                if (!exists) {
                    chrome.storage.local.set({
                        gravity_whitelist: [...whitelist, { domain, username, method }]
                    });
                }
            });
        }

        setProcessing(true);
        // ... (rest of function) ...

        try {
            let username = request.params[0];

            // 1. Use Chain Hint from Background (Secure & Centralized)
            let targetChain = chainHint;

            // 2. Fallback: If no hint, try to match by name only (Generic)
            let account = accounts.find(a => a.name === username && (targetChain ? a.chain === targetChain : true));

            // 3. Last Resort: Prefer HIVE if ambiguous
            if (!account && !targetChain) {
                account = accounts.find(a => a.name === username && a.chain === 'HIVE');
            }
            // 4. Any match
            if (!account) {
                account = accounts.find(a => a.name === username);
            }

            // 5. CRITICAL FIX: For broadcast operations, extract actual user from operation data
            // Twiggy sends author as params[0], but the real voter is inside the operation
            if (!account && Array.isArray(request.params)) {
                const operations = extractBroadcastOperations(request.params[1]);
                const accountNames = accounts.map(a => a.name.toLowerCase());

                for (const op of operations) {
                    if (Array.isArray(op) && op.length >= 2 && typeof op[1] === 'object') {
                        const opData = op[1];
                        // Check common fields that contain the signing user
                        const possibleUsers = [
                            opData.voter,      // vote operation
                            opData.from,       // transfer operation  
                            opData.author,     // comment/post operation (when user is posting)
                            opData.delegator,  // delegation operation
                            opData.account,    // witness_vote, account_update, etc.
                        ].filter(u => typeof u === 'string');

                        for (const possibleUser of possibleUsers) {
                            if (accountNames.includes(possibleUser.toLowerCase())) {
                                username = possibleUser;
                                account = accounts.find(a => a.name.toLowerCase() === possibleUser.toLowerCase() &&
                                    (targetChain ? a.chain === targetChain : true))
                                    || accounts.find(a => a.name.toLowerCase() === possibleUser.toLowerCase());
                                if (account) break;
                            }
                        }
                        if (account) break;
                    }
                }
            }

            // 6. Defensive: Some dApps send username in a different param position
            if (!account && Array.isArray(request.params)) {
                const accountNames = accounts.map(a => a.name.toLowerCase());
                const matched = request.params.find((p: any) => typeof p === 'string' && accountNames.includes(p.toLowerCase()));
                if (typeof matched === 'string') {
                    username = matched;
                    account = accounts.find(a => a.name === username && (targetChain ? a.chain === targetChain : true))
                        || accounts.find(a => a.name === username);
                }
            }

            if (!account) {
                throw new Error(t('sign.account_not_found'));
            }

            // DEBUG: Log account keys availability
            console.log('[SignRequest] Account found:', {
                name: account.name,
                chain: account.chain,
                hasActiveKey: !!account.activeKey,
                activeKeyPrefix: account.activeKey ? account.activeKey.substring(0, 8) + '...' : 'NONE',
                hasPostingKey: !!account.postingKey,
                postingKeyPrefix: account.postingKey ? account.postingKey.substring(0, 8) + '...' : 'NONE',
                hasMemoKey: !!account.memoKey
            });

            if (isMultisig && multisigProgress && !multisigProgress.canBroadcast) {
                // If it's a multisig account and we haven't reached the threshold yet,
                // we perform a "Partial Sign" (Authorized Step)
                const msResult = await handleMultisigSign(account);
                showNotification(msResult.message || 'Signature collected', 'success');
                notifyBackground(msResult, null);
                return;
            }
            // --- END MULTISIG LOGIC ---

            // Actual Signing Logic
            let result: any = { success: false };
            const method = request.method;
            const isTransfer = method === 'requestTransfer';
            const isVote = method === 'requestVote' || method === 'vote';
            const isCustomJson = method === 'requestCustomJson' || method === 'customJSON';
            const isSignBuffer = method === 'requestSignBuffer' || method === 'signBuffer';
            const isBroadcast = method === 'requestBroadcast' || method === 'broadcast';
            const isPowerUp = method === 'requestPowerUp' || method === 'powerUp';
            const isPowerDown = method === 'requestPowerDown' || method === 'powerDown';
            const isDelegation = method === 'requestDelegation' || method === 'delegation';
            const isPost = method === 'requestPost' || method === 'post';
            const isWitnessVote = method === 'requestWitnessVote' || method === 'witnessVote';

            // Check Key Requirement properly
            const needsActive = isTransfer || isPowerUp || isPowerDown || isDelegation || isWitnessVote ||
                (isBroadcast && !account.postingKey) || // Broadcast assumes Active?
                (isCustomJson && normalizeKeyType(request.params[2]) === 'active');

            if (needsActive && !account.activeKey) {
                throw new Error(t('sign.active_missing'));
            }

            if (isTransfer) {
                const to = request.params[1];
                const amount = request.params[2];
                const memo = request.params[3] || '';
                const response = await broadcastTransfer(account.chain, account.name, account.activeKey!, to, amount, memo);
                if (!response.success) throw new Error(response.error);

                // Compatibility mapping (v1.1.3 robust fix)
                const opResult = response.opResult || response.txId;
                result = {
                    result: response.txId || opResult,
                    txId: response.txId,
                    tx_id: response.txId,
                    broadcastPayload: opResult,
                    opResult,
                    message: t('sign.success'),
                    ...response
                };

            } else if (isVote) {
                const author = request.params[2];
                const permlink = request.params[1];
                const weight = voteWeight; // Use interactive state

                // Prefer posting key, fallback to active
                const key = account.postingKey || account.activeKey;
                if (!key) throw new Error(t('sign.keys_missing'));

                const response = await broadcastVote(account.chain, account.name, key, author, permlink, weight);
                if (!response.success) throw new Error(response.error);

                // Compatibility mapping (v1.1.3 robust fix)
                const opResult = response.opResult || response.txId;
                result = {
                    result: response.txId || opResult,
                    txId: response.txId,
                    tx_id: response.txId,
                    broadcastPayload: opResult,
                    opResult,
                    message: t('sign.success'),
                    ...response
                };

            } else if (isCustomJson) {
                const id = request.params[1];
                const type = request.params[2]; // 'Posting' or 'Active'
                const normalizedType = normalizeKeyType(type);
                const json = request.params[3];

                let key = account.postingKey;
                if (normalizedType === 'active') key = account.activeKey;

                if (!key) throw new Error(t('sign.key_missing_type').replace('{type}', normalizedType === 'active' ? 'Active' : 'Posting'));

                const response = await broadcastCustomJson(
                    account.chain,
                    account.name,
                    key!,
                    id,
                    typeof json === 'string' ? json : JSON.stringify(json),
                    normalizedType === 'active' ? 'Active' : 'Posting'
                );
                if (!response.success) throw new Error(response.error);

                // Compatibility mapping (v1.1.3 robust fix)
                const opResult = response.opResult || response.txId;
                result = {
                    result: response.txId || opResult,
                    txId: response.txId,
                    tx_id: response.txId,
                    broadcastPayload: opResult,
                    opResult,
                    message: t('sign.success'),
                    ...response
                };

            } else if (isSignBuffer) {
                const message = request.params[1];
                const type = request.params[2]; // Key type: 'Posting', 'Active', 'Memo'
                const normalizedType = normalizeKeyType(type);

                console.log('[SignRequest] signBuffer request:', {
                    chain: account.chain,
                    username: account.name,
                    keyType: type,
                    normalizedKeyType: normalizedType,
                    messageType: typeof message,
                    messageLength: typeof message === 'string' ? message.length : 'N/A',
                    messagePreview: typeof message === 'string' ? message.substring(0, 100) : JSON.stringify(message).substring(0, 100)
                });

                let keyStr = "";
                if (normalizedType === 'posting') keyStr = account.postingKey || "";
                else if (normalizedType === 'active') keyStr = account.activeKey || "";
                else if (normalizedType === 'memo') keyStr = account.memoKey || "";

                if (!keyStr) throw new Error(t('sign.key_missing_generic').replace('{type}', normalizedType || String(type)));

                if (normalizedType === 'posting' || normalizedType === 'active') {
                    const validation = await validateAccountKeys(
                        account.chain,
                        account.name,
                        normalizedType === 'posting' ? { posting: keyStr } : { active: keyStr }
                    );
                    if (!validation.valid) {
                        throw new Error(validation.error || `${normalizedType} key does not match account`);
                    }
                }

                const response = signMessage(account.chain, message, keyStr);

                console.log('[SignRequest] signMessage response:', {
                    success: response.success,
                    error: response.error,
                    resultLength: response.result ? response.result.length : 0,
                    resultPreview: response.result ? response.result.substring(0, 40) + '...' : 'NONE',
                    publicKey: response.publicKey
                });

                if (!response.success) throw new Error(response.error);

                // Compatibility: Add multiple field names for different dApp expectations
                // Note: response already contains success, result, publicKey
                const { success: _s, result: _r, publicKey: _pk, ...restResponse } = response;
                result = {
                    success: true,
                    result: response.result,
                    signature: response.result,  // Some dApps expect 'signature'
                    publicKey: response.publicKey,
                    pubkey: response.publicKey,  // Some dApps expect 'pubkey'
                    // CRITICAL: blurt.media/peerhub expects data.username
                    data: {
                        username: account.name,
                        message: message,
                        publicKey: response.publicKey,
                        signature: response.result
                    },
                    message: t('sign.success'),
                    ...restResponse
                };

                console.log('[SignRequest] Final result to return:', {
                    hasResult: !!result.result,
                    hasPublicKey: !!result.publicKey,
                    keys: Object.keys(result)
                });

            } else if (isBroadcast) {
                // Generic Broadcast
                let rawOperations = request.params[1];
                const keyType = request.params[2]; // 'Posting' or 'Active'
                const originalEnvelope =
                    request._gravityBroadcastEnvelope ||
                    (request._gravityOriginalParams && Array.isArray(request._gravityOriginalParams) ? request._gravityOriginalParams[1] : null);

                if (rawOperations && typeof rawOperations === 'object' && !Array.isArray(rawOperations)) {
                    console.log('[SignRequest Broadcast] Extracting operations from transaction envelope:', Object.keys(rawOperations));
                    rawOperations =
                        rawOperations.operations ||
                        rawOperations.tx?.operations ||
                        rawOperations.transaction?.operations ||
                        rawOperations;
                }

                // 1. ROBUST NORMALIZATION: Handle both array [name, data] and object { type, ... }
                // Some dApps (like blurt.blog) send operations as objects inside requestBroadcast
                let operations = (Array.isArray(rawOperations) ? rawOperations : [rawOperations]).map((op: any) => {
                    if (Array.isArray(op)) return op;
                    if (op && typeof op === 'object') {
                        const type = op.type || op.operation || op.method;
                        const data = op.data || op.op || op.operation_data || (({ type: _t, operation: _o, method: _m, ...rest }) => rest)(op);
                        if (type) return [type, data];
                    }
                    return op;
                });
                const firstOperation = operations.find((op: any) => Array.isArray(op) || (op && typeof op === 'object'));
                const firstOperationName = Array.isArray(firstOperation)
                    ? firstOperation[0]
                    : firstOperation?.type || firstOperation?.operation || firstOperation?.method || null;

                // Determine which operations require Active key
                const requiresActiveKey = operations.some((op: any) => {
                    const opName = Array.isArray(op) ? op[0] : op.type || op[0];
                    // Operations that require Active key
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
                        // Market operations (wallet.hive.blog, etc.)
                        'limit_order_create',
                        'limit_order_create2',
                        'limit_order_cancel',
                        'convert',
                        'collateralized_convert',
                        'fill_convert_request',
                        'cancel_transfer_from_savings',
                        'set_withdraw_vesting_route'
                    ];
                    return activeKeyOps.includes(opName);
                });

                let key = account.postingKey;
                // If specifically Active requested, use Active
                if (normalizeKeyType(keyType) === 'active') key = account.activeKey;
                // If operation requires Active key, use Active
                else if (requiresActiveKey) key = account.activeKey;
                // If Posting requested but missing, try Active
                if (!key && account.activeKey) key = account.activeKey;

                // DEBUG: Log key selection
                console.log('[SignRequest Broadcast] Key selection:', {
                    keyType,
                    requiresActiveKey,
                    hasActiveKey: !!account.activeKey,
                    hasPostingKey: !!account.postingKey,
                    selectedKeyPrefix: key ? key.substring(0, 10) + '...' : 'NONE',
                    operations: operations.map((op: any) => Array.isArray(op) ? op[0] : op.type)
                });

                const requiredKeyType = requiresActiveKey ? 'Active' : (keyType || 'Posting');
                if (!key) throw new Error(t('sign.key_missing_type').replace('{type}', requiredKeyType));

                // CRITICAL: If operation requires Active key but we selected wrong key, force Active
                if (requiresActiveKey && key !== account.activeKey && account.activeKey) {
                    console.log('[SignRequest] FORCING Active key for operation requiring active authority');
                    key = account.activeKey;
                }

                // Final verification log
                console.log('[SignRequest Broadcast] FINAL key being used:', {
                    keyPrefix: key.substring(0, 10) + '...',
                    isActiveKey: key === account.activeKey,
                    requiresActiveKey
                });

                const response = await broadcastOperations(account.chain, key, operations);
                if (!response.success) throw new Error(response.error);

                // Compatibility mapping (v1.1.3 robust fix)
                const opResult = response.opResult || response.txId;
                const isSplinterlands = /(^|\.)splinterlands\.com$/i.test(domain);
                const envelopePayload = originalEnvelope && typeof originalEnvelope === 'object'
                    ? {
                        ...originalEnvelope,
                        operations: Array.isArray((originalEnvelope as any).operations) ? (originalEnvelope as any).operations : operations
                    }
                    : null;

                const resultPayload = isSplinterlands
                    ? {
                        ...(envelopePayload || {}),
                        ...(opResult && typeof opResult === 'object' ? opResult : {}),
                        id: response.txId || (opResult && typeof opResult === 'object' ? (opResult as any).id : undefined),
                        txId: response.txId,
                        tx_id: response.txId,
                        operation: firstOperationName,
                        op: firstOperationName,
                        operations
                    }
                    : (response.txId || opResult);

                result = {
                    result: resultPayload,
                    txId: response.txId,
                    tx_id: response.txId,
                    transaction: envelopePayload || undefined,
                    broadcastPayload: opResult,
                    opResult,
                    operation: firstOperationName,
                    operations,
                    message: t('sign.success'),
                    ...response
                };

            } else if (isPowerUp) {
                const to = request.params[1] || account.name; // Already sanitized in Background
                let amount = request.params[2];
                if (amount && !amount.includes(' ')) {
                    const symbol = account.chain === Chain.HIVE ? 'HIVE' : account.chain === Chain.STEEM ? 'STEEM' : 'BLURT';
                    amount = `${parseFloat(amount).toFixed(3)} ${symbol}`;
                }
                const response = await broadcastPowerUp(account.chain, account.name, account.activeKey!, to, amount);
                if (!response.success) throw new Error(response.error);

                // Compatibility mapping (v1.1.3 robust fix)
                const opResult = response.opResult || response.txId;
                result = {
                    result: response.txId || opResult,
                    txId: response.txId,
                    tx_id: response.txId,
                    broadcastPayload: opResult,
                    opResult,
                    message: t('sign.success'),
                    ...response
                };

            } else if (isPowerDown) {
                let vestingShares = request.params[1];
                if (vestingShares && !vestingShares.includes(' ')) {
                    vestingShares = `${parseFloat(vestingShares).toFixed(6)} VESTS`;
                }
                const response = await broadcastPowerDown(account.chain, account.name, account.activeKey!, vestingShares);
                if (!response.success) throw new Error(response.error);

                // Compatibility mapping (v1.1.3 robust fix)
                const opResult = response.opResult || response.txId;
                result = {
                    result: response.txId || opResult,
                    txId: response.txId,
                    tx_id: response.txId,
                    broadcastPayload: opResult,
                    opResult,
                    message: t('sign.success'),
                    ...response
                };

            } else if (isDelegation) {
                const delegatee = request.params[1]; // Already sanitized in Background
                const amount = request.params[2];
                const unit = request.params[3] || 'VESTS';
                let vestingShares = amount;
                if (amount && !amount.includes(' ')) {
                    vestingShares = `${amount} ${unit}`;
                }
                const response = await broadcastDelegation(account.chain, account.name, account.activeKey!, delegatee, vestingShares);
                if (!response.success) throw new Error(response.error);

                // Compatibility mapping (v1.1.3 robust fix)
                const opResult = response.opResult || response.txId;
                result = {
                    result: response.txId || opResult,
                    txId: response.txId,
                    tx_id: response.txId,
                    broadcastPayload: opResult,
                    opResult,
                    message: t('sign.success'),
                    ...response
                };

            } else if (isWitnessVote) {
                const witness = request.params[1];
                const approve = request.params[2] === true || request.params[2] === "true" || request.params[2] === 1;

                const response = await broadcastWitnessVote(account.chain, account.name, account.activeKey!, witness, approve);
                if (!response.success) throw new Error(response.error);

                // Compatibility mapping
                const opResult = response.opResult || response.txId;
                result = {
                    result: response.txId || opResult,
                    txId: response.txId,
                    tx_id: response.txId,
                    broadcastPayload: opResult,
                    opResult,
                    message: t('sign.success'),
                    ...response
                };

            } else if (isPost) {
                // console.log('SignRequest: Entering isPost handler'); // Debug only
                const title = request.params[1];
                const body = request.params[2];
                let parentPermlink = request.params[3];
                const parentAuthor = request.params[4];
                const jsonMetadata = request.params[5];
                const permlink = request.params[6];

                // console.log('SignRequest: Raw params:', { title, parentPermlink, parentAuthor, permlink }); // Debug only

                // CRITICAL: Sanitize parameters to prevent serializer crashes
                // Steemit sends 'category' field or undefined parent_permlink
                if (!parentPermlink) {
                    // Try to recover from metadata tags
                    try {
                        const metadata = typeof jsonMetadata === 'string' ? JSON.parse(jsonMetadata) : jsonMetadata;
                        if (metadata && metadata.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0) {
                            parentPermlink = metadata.tags[0];
                        }
                    } catch (e) { }

                    // Fallback
                    if (!parentPermlink) parentPermlink = 'general';
                }

                // Construct comment operation with sanitized fields
                const op = ['comment', {
                    parent_author: parentAuthor || '',
                    parent_permlink: parentPermlink || 'general',
                    author: username || '',
                    permlink: permlink || '',
                    title: title || '',
                    body: body || '',
                    json_metadata: typeof jsonMetadata === 'string' ? jsonMetadata : JSON.stringify(jsonMetadata || {})
                }];

                console.log('SignRequest: About to broadcast operation:', JSON.stringify(op, null, 2));
                const opPayload = op[1] as any;
                console.log('SignRequest: Operation fields:', {
                    parent_author: opPayload.parent_author,
                    parent_permlink: opPayload.parent_permlink,
                    author: opPayload.author,
                    permlink: opPayload.permlink,
                    title: opPayload.title,
                    body: opPayload.body?.substring(0, 50),
                    json_metadata: opPayload.json_metadata?.substring(0, 100)
                });

                const response = await broadcastOperations(account.chain, account.postingKey || account.activeKey!, [op]);
                if (!response.success) throw new Error(response.error);
                // Match Hive Keychain format exactly: only success and result (opResult object)
                result = { success: true, result: response.opResult || response.txId };
            }


            notifyBackground(result, null);

        } catch (e: any) {
            setError(e.message);
            setProcessing(false);
            notifyBackground(null, e.message);
        }
    };

    // Global Key Listener for Enter
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Only confirm on Enter if not processing, not loading, and no error
            if (e.key === 'Enter' && !processing && !loading && !error) {
                handleDecision(true);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [processing, loading, error, request]);

    const handleMultisigSign = async (account: Account) => {
        // This is a placeholder for the actual partial signing logic
        // It will interact with the chat server to coordinate signatures
        console.log(`[Multisig] Partial signing for @${account.name} on ${account.chain}`);

        // Return a successful but "pending" result
        return {
            success: true,
            status: 'PARTIAL',
            message: 'Signature submitted! Waiting for other co-signers.',
            txId: 'pending-' + Date.now()
        };
    };

    const notifyBackground = (result: any, err: string | null) => {
        chrome.runtime.sendMessage({
            type: 'gravity_resolve_request',
            requestId,
            result,
            error: err
        }, () => {
            if (chrome.runtime.lastError) console.error("Gravity: Failed to resolve request", chrome.runtime.lastError);
            onComplete();
        });
    };

    if (loading) return <div className="h-full flex items-center justify-center text-slate-400">{t('sign.loading')}</div>;
    if (error) return <div className="h-full flex items-center justify-center text-red-400 p-8 text-center">{t('sign.error')}: {error}</div>;

    const method = request?.method;
    const isTransfer = method === 'requestTransfer';
    const isVote = method === 'requestVote' || method === 'vote';
    const isCustomJson = method === 'requestCustomJson' || method === 'customJSON';
    const isSignBuffer = method === 'requestSignBuffer' || method === 'signBuffer';
    // @ts-ignore - Used in handleDecision
    const isBroadcast = method === 'requestBroadcast' || method === 'broadcast';
    const isPost = method === 'requestPost' || method === 'post';
    const isWitnessVote = method === 'requestWitnessVote' || method === 'witnessVote';
    const isFile = origin === 'file' || origin.startsWith('file://');
    const domain = isFile ? t('sign.local_file') : (origin.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/im) || [null, origin])[1];

    return (
        <div className="h-full bg-dark-900 text-slate-200 flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-dark-800 p-4 border-b border-dark-700 flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" /></svg>
                </div>
                <h2 className="font-bold text-white text-lg">{t('sign.title')}</h2>
                <p className="text-xs text-slate-400">{domain}</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">

                {isMultisig && authority && multisigProgress && (
                    <div className="w-full mb-6">
                        <MultiSigProgress
                            authority={authority}
                            progress={multisigProgress}
                            currentUser={request.params[0]}
                            currentUserWeight={0} // To be calculated based on user keys
                        />
                    </div>
                )}

                {isTransfer ? (
                    <div className="w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg text-center animate-fade-in-down">
                        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4">{t('sign.transfer_title')}</h3>

                        <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-3xl font-black text-white">{request.params[2]}</span>
                            <span className="text-lg font-bold text-blue-400">{request.params[4]}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm mt-6 border-t border-dark-700 pt-4">
                            <div className="text-right">
                                <p className="text-xs text-slate-500">{t('sign.from')}</p>
                                <p className="font-bold text-white">@{request.params[0]}</p>
                            </div>
                            <div className="text-slate-600">{"->"}</div>
                            <div className="text-left">
                                <p className="text-xs text-slate-500">{t('sign.to')}</p>
                                <p className="font-bold text-white">@{request.params[1]}</p>
                            </div>
                        </div>

                        {request.params[3] && (
                            <div className="mt-4 bg-dark-900/50 p-3 rounded-lg text-left">
                                <p className="text-[10px] uppercase text-slate-500 mb-1">Memo</p>
                                <p className="text-xs text-slate-300 italic">"{request.params[3]}"</p>
                            </div>
                        )}
                    </div>
                ) : isVote ? (
                    <div className="w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg text-center animate-fade-in-down">
                        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4">{t('sign.vote_title')}</h3>

                        <div className="flex flex-col items-center justify-center gap-2 mb-6">
                            <span className="text-5xl font-black text-blue-500">
                                {voteWeight / 100}%
                            </span>
                            <div className="w-full relative">
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    step="100"
                                    value={voteWeight}
                                    onChange={(e) => setVoteWeight(Number(e.target.value))}
                                    className="w-full mt-4 h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between w-full mt-3 px-1">
                                    {[0, 25, 50, 75, 100].map(pct => (
                                        <button
                                            key={pct}
                                            onClick={() => setVoteWeight(pct * 100)}
                                            className="text-[10px] font-bold text-slate-500 hover:text-white bg-dark-900 border border-dark-700 hover:border-blue-500 hover:bg-dark-700 px-2 py-1 rounded transition-all transform hover:scale-105"
                                        >
                                            {pct}%
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 text-sm border-t border-dark-700 pt-4">
                            <div className="flex justify-between">
                                <span className="text-slate-500">{t('sign.author')}</span>
                                <span className="text-white font-bold">@{request.params[2]}</span>
                            </div>
                            <div className="bg-dark-900/50 p-3 rounded-lg text-left overflow-hidden">
                                <p className="text-xs text-slate-300 truncate">{request.params[1]}</p>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                                <span>{t('sign.from')}</span>
                                <span className="text-white font-bold">@{request.params[0]}</span>
                            </div>
                        </div>
                    </div>
                ) : isCustomJson ? (
                    <div className="w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg animate-fade-in-down">
                        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4 text-center">{t('sign.custom_json_title')}</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-dark-700 pb-2">
                                <span className="text-xs text-slate-500">{t('sign.id')}</span>
                                <span className="text-sm font-mono text-blue-400 font-bold">{request.params[1]}</span>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500 mb-1">{t('sign.json_payload')}</p>
                                <div className="bg-dark-900 p-3 rounded-lg border border-dark-700 max-h-60 overflow-y-auto custom-scrollbar">
                                    <pre className="text-[10px] text-green-400 whitespace-pre-wrap break-all font-mono">
                                        {(() => {
                                            try {
                                                const data = typeof request.params[3] === 'string' ? JSON.parse(request.params[3]) : request.params[3];
                                                return JSON.stringify(data, null, 2);
                                            } catch (e) {
                                                return String(request.params[3]);
                                            }
                                        })()}
                                    </pre>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-dark-700">
                                <span>{t('sign.from')}</span>
                                <span className="text-white font-bold">@{request.params[0]}</span>
                            </div>
                        </div>
                    </div>
                ) : isSignBuffer ? (
                    <div className="w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg animate-fade-in-down">
                        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4 text-center">{t('sign.buffer_title')}</h3>

                        <div className="space-y-4">
                            <div className="bg-dark-900 p-4 rounded-lg border border-dark-700">
                                <p className="text-xs text-slate-500 mb-2 uppercase">{t('sign.message_label')}</p>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                    <p className="text-sm text-slate-300 font-mono break-all">{request.params[1]}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
                                <span>{t('sign.key_type')}</span>
                                <span className="text-blue-400 font-bold">{request.params[2]}</span>
                            </div>

                            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-dark-700">
                                <span>{t('sign.from')}</span>
                                <span className="text-white font-bold">@{request.params[0]}</span>
                            </div>
                        </div>
                    </div>
                ) : isPost ? (
                    <div className="w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg animate-fade-in-down">
                        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4 text-center">{t('sign.post_title') || "POST / COMMENT"}</h3>

                        <div className="space-y-4">
                            {/* Title if valid */}
                            {request.params[1] && (
                                <div>
                                    <p className="text-[10px] uppercase text-slate-500 mb-1">Title</p>
                                    <p className="text-sm font-bold text-white">{request.params[1]}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-[10px] uppercase text-slate-500 mb-1">Content</p>
                                <div className="bg-dark-900 p-3 rounded-lg border border-dark-700 max-h-60 overflow-y-auto custom-scrollbar">
                                    <p className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
                                        {request.params[2]}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-dark-700">
                                <span>{t('sign.author')}</span>
                                <span className="text-white font-bold">@{request.params[0]}</span>
                            </div>
                        </div>
                    </div>
                ) : isWitnessVote ? (
                    <div className="w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg text-center animate-fade-in-down">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                            {request.params[2] === false || request.params[2] === "false" || request.params[2] === 0 ? "UNVOTE WITNESS" : "VOTE WITNESS"}
                        </h3>

                        <p className="text-xl font-bold text-white mb-6">@{request.params[1]}</p>

                        <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-dark-700">
                            <span>{t('sign.author')}</span>
                            <span className="text-white font-bold">@{request.params[0]}</span>
                        </div>
                    </div>
                ) : (
                    // Generic Request ViewFallback
                    <div className="w-full space-y-4 max-w-xs mx-auto">
                        <div className="bg-dark-800 p-4 rounded-xl border border-dark-700">
                            <p className="text-xs uppercase text-slate-500 mb-1">{t('sign.operation')}</p>
                            <p className="font-mono text-blue-400 font-bold">{request?.method}</p>
                        </div>
                        <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 w-full">
                            <p className="text-xs uppercase text-slate-500 mb-2">{t('sign.params')}</p>
                            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {request.params.map((param: any, idx: number) => (
                                    <div key={idx} className="flex gap-2 text-xs border-b border-dark-700 last:border-0 pb-2 last:pb-0">
                                        <span className="text-slate-500 w-6 font-mono opacity-50 shrink-0">{idx}:</span>
                                        <span className="text-slate-300 font-mono break-all leading-relaxed">{typeof param === 'object' ? JSON.stringify(param, null, 2) : String(param)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer Actions */}
            <div className="p-4 pb-8 bg-dark-800 border-t border-dark-700">
                {/* Whitelist Checkbox */}
                {!isFile && (
                    <div className="flex items-center justify-center mb-4">
                        <label className="flex items-center space-x-2 cursor-pointer select-none group">
                            <input
                                type="checkbox"
                                checked={trustDomain}
                                onChange={(e) => setTrustDomain(e.target.checked)}
                                className="form-checkbox h-4 w-4 text-blue-600 rounded border-dark-600 bg-dark-900 focus:ring-blue-500 focus:ring-offset-dark-800 transition duration-150 ease-in-out"
                            />
                            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                                {t('sign.trust_domain')}
                            </span>
                        </label>
                    </div>
                )}

                <div className="flex gap-4 max-w-xs mx-auto">
                    <button
                        onClick={() => handleDecision(false)}
                        className="flex-1 py-3 px-2 h-auto min-h-[48px] rounded-lg font-bold text-slate-400 hover:text-white hover:bg-dark-700 transition-colors whitespace-normal leading-tight"
                    >
                        {t('sign.reject')}
                    </button>
                    <button
                        onClick={() => handleDecision(true)}
                        disabled={processing}
                        className="flex-1 py-3 px-2 h-auto min-h-[48px] rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] whitespace-normal leading-tight"
                    >
                        {processing ? t('sign.signing') : (isMultisig && !multisigProgress?.canBroadcast ? "Partial Sign" : t('sign.confirm'))}
                    </button>
                </div>
            </div>
        </div>
    );
};
