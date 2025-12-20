import React, { useEffect, useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Account, Chain } from '../types';
import { broadcastTransfer, broadcastVote, broadcastCustomJson, signMessage, broadcastOperations, broadcastPowerUp, broadcastPowerDown, broadcastDelegation } from '../services/chainService';

interface SignRequestProps {
    requestId: string;
    accounts: Account[];
    onComplete: () => void;
}

declare const chrome: any;

export const SignRequest: React.FC<SignRequestProps> = ({ requestId, accounts, onComplete }) => {
    const { t } = useTranslation();
    const [request, setRequest] = useState<any>(null);
    const [origin, setOrigin] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [voteWeight, setVoteWeight] = useState<number>(10000);
    const [chainHint, setChainHint] = useState<Chain | null>(null);

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

    const [trustDomain, setTrustDomain] = useState(false);

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
            const username = request.params[0];

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

            if (!account) {
                throw new Error(t('sign.account_not_found'));
            }

            // Check permissions based on operation type
            // ...

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

            // Check Key Requirement properly
            const needsActive = isTransfer || isPowerUp || isPowerDown || isDelegation ||
                (isBroadcast && !account.postingKey) || // Broadcast assumes Active?
                (isCustomJson && request.params[2] === 'Active');

            if (needsActive && !account.activeKey) {
                throw new Error(t('sign.active_missing'));
            }

            if (isTransfer) {
                const to = request.params[1];
                const amount = request.params[2];
                const memo = request.params[3] || '';
                const response = await broadcastTransfer(account.chain, account.name, account.activeKey!, to, amount, memo);
                if (!response.success) throw new Error(response.error);
                result = { result: response.opResult || response.txId, message: t('sign.success'), ...response };

            } else if (isVote) {
                const author = request.params[2];
                const permlink = request.params[1];
                const weight = voteWeight; // Use interactive state

                // Prefer posting key, fallback to active
                const key = account.postingKey || account.activeKey;
                if (!key) throw new Error(t('sign.keys_missing'));

                const response = await broadcastVote(account.chain, account.name, key, author, permlink, weight);
                if (!response.success) throw new Error(response.error);
                result = { result: response.opResult || response.txId, message: t('sign.success'), ...response };

            } else if (isCustomJson) {
                const id = request.params[1];
                const type = request.params[2]; // 'Posting' or 'Active'
                const json = request.params[3];

                let key = account.postingKey;
                if (type === 'Active') key = account.activeKey;

                if (!key) throw new Error(t('sign.key_missing_type').replace('{type}', type));

                const response = await broadcastCustomJson(account.chain, account.name, key!, id, typeof json === 'string' ? json : JSON.stringify(json), type as any);
                if (!response.success) throw new Error(response.error);
                result = { result: response.opResult || response.txId, message: t('sign.success'), ...response };

            } else if (isSignBuffer) {
                const message = request.params[1];
                const type = request.params[2]; // Key type: 'Posting', 'Active', 'Memo'

                let keyStr = "";
                if (type === 'Posting') keyStr = account.postingKey || "";
                else if (type === 'Active') keyStr = account.activeKey || "";
                else if (type === 'Memo') keyStr = account.memoKey || "";

                if (!keyStr) throw new Error(t('sign.key_missing_generic').replace('{type}', type));

                const response = signMessage(account.chain, message, keyStr);

                // console.log('SignRequest: signMessage response:', response); // Debug only

                if (!response.success) throw new Error(response.error);
                result = { result: response.result, message: t('sign.success'), ...response };

                // console.log('SignRequest: signBuffer result:', result); // Debug only

            } else if (isBroadcast) {
                // Generic Broadcast
                let operations = request.params[1];
                const keyType = request.params[2]; // 'Posting' or 'Active'

                // console.log('SignRequest: isBroadcast - Raw operations:', operations); // Debug only

                // CRITICAL: Sanitize 'comment' operations (Steemit fix)
                // Create CLEAN objects to avoid __config and other junk
                if (operations && Array.isArray(operations)) {
                    operations = operations.map((op: any) => {
                        if (Array.isArray(op) && op[0] === 'comment' && op[1]) {
                            const payload = op[1];
                            // console.log('SignRequest: Found comment, creating clean object...'); // Debug only

                            let parentPermlink = payload.parent_permlink;

                            // Use 'category' field if present (Steemit-specific)
                            if (!parentPermlink && !payload.parent_author && payload.category) {
                                parentPermlink = payload.category;
                                // console.log('SignRequest: Using category:', payload.category); // Debug only
                            }

                            // Try to recover from json_metadata tags
                            if (!parentPermlink && payload.json_metadata) {
                                try {
                                    const meta = typeof payload.json_metadata === 'string' ? JSON.parse(payload.json_metadata) : payload.json_metadata;
                                    if (meta.tags && meta.tags[0]) {
                                        parentPermlink = meta.tags[0];
                                        // console.log('SignRequest: Recovered from tags:', meta.tags[0]); // Debug only
                                    }
                                } catch (e) { }
                            }

                            // Create CLEAN object with ONLY the fields we need
                            const cleanPayload = {
                                parent_author: payload.parent_author || '',
                                parent_permlink: parentPermlink || 'general',
                                author: payload.author || '',
                                permlink: payload.permlink || '',
                                title: payload.title || '',
                                body: payload.body || '',
                                json_metadata: payload.json_metadata || '{}'
                            };

                            // console.log('SignRequest: Clean payload created'); // Debug only
                            return ['comment', cleanPayload];
                        }
                        return op;
                    });
                }

                let key = account.postingKey;
                // If specifically Active requested, use Active
                if (keyType === 'Active') key = account.activeKey;
                // If Posting requested but missing, try Active
                if (!key && account.activeKey) key = account.activeKey;

                if (!key) throw new Error(t('sign.key_missing_type').replace('{type}', keyType || 'Posting'));

                const response = await broadcastOperations(account.chain, key, operations);
                if (!response.success) throw new Error(response.error);
                result = { result: response.opResult || response.txId, message: t('sign.success'), ...response };

            } else if (isPowerUp) {
                const to = request.params[1] || account.name; // Already sanitized in Background
                let amount = request.params[2];
                if (amount && !amount.includes(' ')) {
                    const symbol = account.chain === Chain.HIVE ? 'HIVE' : account.chain === Chain.STEEM ? 'STEEM' : 'BLURT';
                    amount = `${parseFloat(amount).toFixed(3)} ${symbol}`;
                }
                const response = await broadcastPowerUp(account.chain, account.name, account.activeKey!, to, amount);
                if (!response.success) throw new Error(response.error);
                // Ensure result format is object for PeakD if available
                const finalResult = response.opResult || response.txId;
                result = { result: finalResult, message: t('sign.success'), ...response };

            } else if (isPowerDown) {
                let vestingShares = request.params[1];
                if (vestingShares && !vestingShares.includes(' ')) {
                    vestingShares = `${parseFloat(vestingShares).toFixed(6)} VESTS`;
                }
                const response = await broadcastPowerDown(account.chain, account.name, account.activeKey!, vestingShares);
                if (!response.success) throw new Error(response.error);
                const finalResult = response.opResult || response.txId;
                result = { result: finalResult, message: t('sign.success'), ...response };

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
                const finalResult = response.opResult || response.txId;
                result = { result: finalResult, message: t('sign.success'), ...response };

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
                            <div className="text-slate-600">➜</div>
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
                        {processing ? t('sign.signing') : t('sign.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};
