import './polyfill';
import { broadcastTransfer, broadcastVote, broadcastCustomJson, signMessage, broadcastOperations, broadcastPowerUp, broadcastPowerDown, broadcastDelegation, broadcastWitnessVote, encodeMemo, decodeMemo, validateAccountKeys, derivePublicKey } from '@services/chainService';
import { getChainConfig, isChainSupported } from '@config/chainConfig';
import { getActiveNode, benchmarkNodes } from '@services/nodeService';
import { Chain } from 'gravity-shared/types';
import { normalizeKeyType, requiresActiveAuthority, selectBroadcastKey } from 'gravity-shared/utils/authority';
import { readHistoryCache, refreshHistoryForAccounts, refreshHistoryFromSession } from './history';

declare var chrome: any;

// === OFFSCREEN MANAGEMENT ===
// IMPORTANT: Path must match what Vite outputs. If using base: './', it might be valid.
// But check logical path. Offscreen creates document relative to extension root.
const OFFSCREEN_DOCUMENT_PATH = 'src/offscreen/offscreen.html';

async function setupOffscreenDocument(path: string) {
    try {
        // Guard: offscreen API may be unavailable in some environments
        // @ts-ignore
        if (!chrome.offscreen) return;
        // @ts-ignore
        if (await chrome.offscreen.hasDocument()) return;
        // @ts-ignore
        await chrome.offscreen.createDocument({
            url: path,
            reasons: ['BLOBS'],
            justification: 'Keep WebSocket connection alive for chat notifications'
        });
    } catch (e) {
        console.warn("Gravity: Failed to create offscreen document", e);
    }
}



// Initialize Offscreen setup
// @ts-ignore
if (chrome.offscreen) {
    setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
}

// Keep-Alive Alarm for Offscreen (Ensures connection is stable)
chrome.alarms.create('offscreenKeepAlive', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm: any) => {
    if (alarm.name === 'offscreenKeepAlive') {
        setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
    }
    if (alarm.name === 'rpcBenchmark') {
        runBenchmark();
    }
    if (alarm.name === 'historyRefresh') {
        refreshHistoryFromSession();
    }
});

// RPC Benchmarking & Synchronization
async function runBenchmark() {
    try {
        await benchmarkNodes();
        const activeNodes: any = {};
        // Store healthy nodes for all supported chains
        for (const chain of Object.values(Chain)) {
            activeNodes[chain] = getActiveNode(chain as Chain);
        }
        await chrome.storage.local.set({ gravity_active_nodes: activeNodes });
    } catch (e) {
        console.error('[Gravity] RPC Benchmark failed:', e);
    }
}

async function initializeRpcNodes() {
    try {
        const result = await chrome.storage.local.get(['gravity_active_nodes']);
        const stored = result.gravity_active_nodes || {};
        const storedHiveNode = String(stored.HIVE || '').replace(/\/+$/, '');

        if (storedHiveNode === 'https://api.openhive.network') {
            await chrome.storage.local.set({
                gravity_active_nodes: {
                    ...stored,
                    HIVE: 'https://api.hive.blog'
                }
            });
        }
    } catch (error) {
        console.warn('[Gravity] Failed to migrate deprecated RPC node:', error);
    }

    await runBenchmark();
}

// Sanitize persisted nodes before the initial benchmark can reuse them.
initializeRpcNodes();
// chrome.alarms.create replaces an existing alarm of the same name, restarting its
// countdown. This runs at service-worker top level, and the worker now wakes on every
// message from any page, so recreating unconditionally would keep pushing these periodic
// alarms back and they would rarely fire at all.
const ensurePeriodicAlarm = (name: string, periodInMinutes: number) => {
    chrome.alarms.get(name, (existing: any) => {
        if (!existing) chrome.alarms.create(name, { periodInMinutes });
    });
};

ensurePeriodicAlarm('rpcBenchmark', 10);
ensurePeriodicAlarm('historyRefresh', 10);

let unreadCount = 0;

function detectChainFromUrl(url: string = ""): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        const host = u.hostname.toLowerCase();

        // Use configuration for detection if possible, or keep simple heuristics for now
        // HIVE
        const hiveHosts = ['peakd.com', 'ecency.com', 'tribaldex.com', 'magi.eco'];
        if (
            hiveHosts.some(domain => host === domain || host.endsWith(`.${domain}`)) ||
            host.includes('hive')
        ) return 'HIVE';

        // BLURT
        const blurtHosts = [
            'blurt.blog',
            'blurtwallet.com',
            'twiggy.lat',
            'beblurt.com',
            'blurt.one',
            'blurtscan.com',
            'ecosynthesizer.com'
        ];
        if (
            blurtHosts.some(domain => host === domain || host.endsWith(`.${domain}`)) ||
            host.includes('blurt')
        ) return 'BLURT';

        // STEEM
        const steemHosts = ['steemit.com'];
        if (
            steemHosts.some(domain => host === domain || host.endsWith(`.${domain}`)) ||
            host.includes('steem')
        ) return 'STEEM';

        return null;
    } catch (e) {
        return null;
    }
}


async function resolveBestAccountForRequest(accounts: any[], username: string, detectedChain: string | null, normalizedKeyType: 'posting' | 'active' | 'memo' | '' = '') {
    const potentialAccounts = accounts.filter((a: any) => a.name === username);
    if (potentialAccounts.length === 0) return null;

    let candidates = detectedChain
        ? potentialAccounts.filter((a: any) => a.chain === detectedChain)
        : potentialAccounts;

    if (candidates.length === 0) {
        candidates = potentialAccounts;
    }

    if (candidates.length > 1) {
        console.warn(`[Gravity] ${candidates.length} stored entries for @${username}`,
            `(${candidates.map((c: any) => c.chain).join(', ')}) — picking the one whose ${normalizedKeyType || 'first'} key the chain accepts`);
    }

    if (normalizedKeyType === 'posting' && candidates.length > 1) {
        for (const candidate of candidates) {
            if (!candidate.postingKey) continue;
            const validation = await validateAccountKeys(candidate.chain, candidate.name, { posting: candidate.postingKey });
            if (validation.valid) return candidate;
        }
    }

    if (normalizedKeyType === 'active' && candidates.length > 1) {
        for (const candidate of candidates) {
            if (!candidate.activeKey) continue;
            const validation = await validateAccountKeys(candidate.chain, candidate.name, { active: candidate.activeKey });
            if (validation.valid) return candidate;
        }
    }

    return candidates[0] || null;
}

// Listen for messages from Content Script or Popup
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: Function) => {
    if (!request) return false;

    // History lives here, not in the popup: the walk survives the popup closing.
    if (request.type === 'gravity_history_refresh') {
        // Deliberately not awaited. The popup gets an immediate ack and the worker keeps
        // fetching after it closes, persisting each account as it lands.
        refreshHistoryForAccounts(request.accounts || [], {
            force: request.force === true,
            partial: request.partial !== false
        }).catch((error: any) => console.warn('[Gravity] History refresh failed:', error));
        sendResponse({ started: true });
        return false;
    }

    if (request.type === 'gravity_history_get') {
        readHistoryCache().then((cache) => sendResponse({ cache }));
        return true;
    }

    // 1. Request from Web Page (via Content Script)
    if (request.type === 'gravity_request') {
        const originalParams = Array.isArray(request.params)
            ? request.params.map((param: any) => (param && typeof param === 'object' ? { ...param } : param))
            : request.params;

        // Validation: Prevent giant strings or invalid types (Fuzzer protection)
        if (typeof request.method !== 'string' || request.method.length > 64) {
            console.warn("Gravity: Rejected invalid method (length/type)", request.method);
            sendResponse({ success: false, error: 'Invalid Request: Method name too long or invalid.' });
            return false;
        }

        // COMPATIBILITY FIX: Normalize parameters format from sites like twiggy.lat
        // Some sites send {operations, url} instead of [username, operations, key]

        // Case 1: params is entire object {operations, url}
        if (request.params && typeof request.params === 'object' && !Array.isArray(request.params)) {
            const params = request.params as any;
            if (params.operations && params.url && !params.username) {
                const username = 'unknown_broadcast_user';
                const operations = Array.isArray(params.operations) ? params.operations : [params.operations];
                const key = params.key || '';
                request.params = [username, operations, key];
            }
        }

        // Case 2: params is array with broadcast envelope object at ANY position
        if (Array.isArray(request.params)) {
            for (let i = 0; i < request.params.length; i++) {
                const param = request.params[i];
                if (param && typeof param === 'object' && !Array.isArray(param)) {
                    const obj = param as any;
                    const envelopeOps = Array.isArray(obj.operations)
                        ? obj.operations
                        : Array.isArray(obj.tx?.operations)
                            ? obj.tx.operations
                            : Array.isArray(obj.transaction?.operations)
                                ? obj.transaction.operations
                                : null;

                    if (envelopeOps) {
                        if ((request.method === 'requestBroadcast' || request.method === 'broadcast') && i === 1) {
                            request._gravityBroadcastEnvelope = { ...obj };
                        }
                        const operations = envelopeOps;
                        request.params[i] = operations;

                        // CRITICAL FIX: twiggy.lat calls requestSignBuffer with operations, convert to requestBroadcast
                        if (request.method === 'requestSignBuffer' && i === 2 && Array.isArray(request.params[i])) {
                            request.method = 'requestBroadcast';

                            // Extract username from operations[0][1].author
                            let username = request.params[0];
                            try {
                                const firstOp = operations[0];
                                if (Array.isArray(firstOp) && firstOp[1]?.author) {
                                    username = firstOp[1].author;
                                }
                            } catch (e) {
                                console.warn('[Gravity] Could not extract username from operations');
                            }

                            // Determine key type (default to Posting for blt/hive/steem prefixes)
                            const keyType = 'Posting';

                            // Reorganize params: [username, operations, keyType]
                            request.params = [username, operations, keyType];
                        }

                        break;
                    }
                }
            }
        }

        // Global Sanitization for PeakD compatibility
        if (request.method === 'requestPowerUp' || request.method === 'powerUp') {
            if (request.params && request.params[1] && typeof request.params[1] === 'string') {
                request.params[1] = request.params[1].replace(/^@/, '');
            }
        } else if (request.method === 'requestDelegation' || request.method === 'delegation') {
            if (request.params && request.params[1] && typeof request.params[1] === 'string') {
                request.params[1] = request.params[1].replace(/^@/, '');
            }
        }

        // Twiggy/General Fix: Some dApps pass domain as params[0]
        // Deliberately excludes requestVerifyKey: the shift triggers on a dotted params[0],
        // and dots are legal in account names, so a user like @alice.dev would get their
        // params silently mangled. No dApp passes a domain to it, unlike the Twiggy calls.
        const methodsWithDomainFix = ['requestVote', 'vote', 'requestPost', 'post', 'requestBroadcast', 'broadcast', 'requestSignBuffer', 'signBuffer', 'decodeMemo', 'encodeMemo'];
        if (methodsWithDomainFix.includes(request.method as string) && Array.isArray(request.params)) {
            const params = request.params;
            const first = params[0];
            if (typeof first === 'string' && first.includes('.')) {
                // If domain is first, shift everything
                if (params.length > 2) {
                    request.params = params.slice(1);
                }
            }
        }

        // Handshake is auto-approved
        if (request.method === 'requestHandshake') {
            const chain = detectChainFromUrl(sender.url || sender.tab?.url) || 'BLURT';
            const node = getActiveNode(chain as Chain);
            sendResponse({
                success: true,
                version: '1.2',
                msg: 'Gravity Wallet Active',
                rpc: node // Provide the active RPC node to the dApp
            });
            return false;
        }

        const requestId = request.params?.requestId || request.id || Date.now().toString();
        // Check Whitelist & auto-sign
        tryAutoSign(request, sender).then((autoResult) => {
            if (autoResult) {
                try {
                    sendResponse(autoResult);
                } catch (e) {
                    console.warn('[Gravity] Failed to send auto-sign response:', e);
                }
            } else {
                const chainHint = detectChainFromUrl(sender.url || sender.tab?.url);

                // ENSURE normalization happened before storing
                const normalizedRequest = { ...request, _gravityOriginalParams: originalParams };

                // Store request consistently in Session Storage (Persists across SW sleep)
                const reqData = {
                    data: normalizedRequest,
                    tabId: sender.tab?.id,
                    frameId: sender.frameId,
                    origin: sender.origin || sender.url,
                    chain: chainHint
                };

                chrome.storage.session.set({ [`req_${requestId}`]: reqData }, () => {
                    const lastError = chrome.runtime.lastError;
                    if (lastError) {
                        console.error('[Gravity] Session storage set failed:', lastError);
                        return;
                    }

                    openPrompt(requestId);

                    try {
                        sendResponse({ success: true, pending: true, note: 'User prompt opened' });
                    } catch (e) {
                        console.warn('[Gravity] Port closed before pending response could be sent:', e);
                    }
                });
            }
        }).catch(err => {
            console.error('[Gravity] Auto-sign logic failed:', err);
            try {
                sendResponse({ success: false, error: 'Internal auto-sign processing error' });
            } catch (e) { }
        });

        return true; // Explicitly KEEP CHANNEL OPEN for async response
    }

    // 3. Popup asking for Request Details
    if (request.type === 'gravity_get_request') {
        const requestId = request.requestId;
        chrome.storage.session.get([`req_${requestId}`]).then((res: any) => {
            const req = res[`req_${requestId}`];

            // Defensive normalization when retrieving from storage
            if (req && req.data && req.data.params) {
                const data = req.data;

                // Check if params[1] is a broadcast envelope object and normalize on read
                if (Array.isArray(data.params) && data.params[1] &&
                    typeof data.params[1] === 'object' && !Array.isArray(data.params[1])) {
                    const secondParam = data.params[1] as any;
                    const envelopeOps = Array.isArray(secondParam.operations)
                        ? secondParam.operations
                        : Array.isArray(secondParam.tx?.operations)
                            ? secondParam.tx.operations
                            : Array.isArray(secondParam.transaction?.operations)
                                ? secondParam.transaction.operations
                                : null;
                    if (envelopeOps) {
                        console.log('[Background] Defensive fix: Converting broadcast envelope in params[1]');
                        data.params[1] = envelopeOps;
                    }
                }
            }

            sendResponse({
                request: req ? req.data : null,
                origin: req ? req.origin : null,
                chain: req ? req.chain : null
            });
        });
        return true; // Async response
    }

    // 4. Request for Active RPC Node
    if (request.type === 'gravity_get_rpc') {
        const chain = (request.chain || 'BLURT').toUpperCase();
        const node = getActiveNode(chain as Chain);
        sendResponse({ success: true, rpc: node });
        return false;
    }

    // 2. Response from Popup (User Accepted/Rejected)
    if (request.type === 'gravity_resolve_request') {
        const { requestId, result, error } = request;

        chrome.storage.session.get([`req_${requestId}`]).then((res: any) => {
            const pending = res[`req_${requestId}`];
            if (pending) {
                const targetOptions: any = {};
                if (typeof pending.frameId !== 'undefined') targetOptions.frameId = pending.frameId;

                // Clean result construction:
                const payload = error ? { success: false, error } : { success: true, ...result };

                chrome.tabs.sendMessage(pending.tabId, {
                    type: 'gravity_response',
                    id: requestId, // Use the original ID
                    response: payload
                }, targetOptions, () => {
                    const lastError = chrome.runtime.lastError;
                    if (lastError) {
                        const errMsg = lastError.message || JSON.stringify(lastError);
                        console.error(`[Gravity] Failed to send response to tab ${pending.tabId} (frame ${pending.frameId}): ${errMsg}`);

                        // Fallback: Try sending to the tab in general if frame-specific failed
                        if (targetOptions.frameId) {
                            console.log(`[Gravity] Attempting fallback response to entire tab ${pending.tabId}...`);
                            chrome.tabs.sendMessage(pending.tabId, {
                                type: 'gravity_response',
                                id: requestId,
                                response: payload
                            }, () => {
                                if (chrome.runtime.lastError) {
                                    console.error(`[Gravity] Fallback also failed: ${chrome.runtime.lastError.message}`);
                                }
                            });
                        }
                    }
                });

                // Cleanup
                chrome.storage.session.remove([`req_${requestId}`]);
            }
        }).catch((err: any) => {
            console.error('[Gravity] Error resolving request from storage:', err);
        });

        // We don't necessarily need to sendResponse to the popup, but good practice
        sendResponse({ ack: true });
        return false;
    }

    // === CHAT & OFFSCREEN LOGIC ===

    // From Offscreen: New Message
    if (request.type === 'OFFSCREEN_NEW_MESSAGE') {
        unreadCount++;
        updateBadge();
        sendResponse({ ack: true });
        return false;
    }

    // From Popup/Content: Sync Creds (Forward to Offscreen)
    if (request.type === 'CHAT_SYNC_CREDS') {
        // Save to storage (Offscreen can read it directly too, but pushing INIT helps wakeup)
        chrome.storage.local.set({ gravity_chat_creds: request.data }).then(() => {
            // Forward to Offscreen
            chrome.runtime.sendMessage({ type: 'INIT_CHAT', creds: request.data }).catch(() => {
                // If offscreen is asleep, creating it will auto-load from storage in its init
                if (chrome.offscreen) setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
            });
        });

        // Reset local count on login
        unreadCount = 0;
        chrome.action.setBadgeText({ text: '' });
        sendResponse({ ack: true });
        return false;
    }

    // UI Opened -> Reset Badge
    if (request.type === 'CHAT_UI_OPENED') {
        unreadCount = 0;
        chrome.action.setBadgeText({ text: '' });
        sendResponse({ ack: true });
        return false;
    }

    // Logout
    if (request.type === 'CHAT_LOGOUT') {
        chrome.storage.local.remove(['gravity_chat_creds']);
        // Tell Offscreen to disconnect
        chrome.runtime.sendMessage({ type: 'DISCONNECT_CHAT' }).catch(() => { });
        unreadCount = 0;
        chrome.action.setBadgeText({ text: '' });
        sendResponse({ ack: true });
        return false;
    }

    // Legacy support just in case
    if (request.type === 'UPDATE_BADGE') {
        const count = request.count || 0;
        if (count === 0) unreadCount = 0;
        else unreadCount += count;
        updateBadge();
        sendResponse({ ack: true });
        return false;
    }

    // === WEB PUSH UI REQUESTS (Merged from secondary listener) ===
    if (request.type === 'CHAT_CHECK_PUSH') {
        getExistingSubscription()
            .then(sub => sendResponse({ success: true, subscription: sub }))
            .catch(err => sendResponse({ success: false, error: err.toString() }));
        return true; // Async response
    }

    if (request.type === 'CHAT_ENABLE_PUSH') {
        manualPushSubscribe()
            .then(sub => sendResponse({ success: true, subscription: sub }))
            .catch(err => sendResponse({ success: false, error: err.message || err.toString() }));
        return true; // Async response
    }

    // console.log("[Gravity] Message not handled by main listener:", request.type || request.method || request);
    return false;
});

function updateBadge() {
    const text = unreadCount > 0 ? (unreadCount > 9 ? '9+' : String(unreadCount)) : '';
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
}


async function tryAutoSign(request: any, sender: any): Promise<any | null> {
    try {
        // 1. Get Whitelist
        const local = await chrome.storage.local.get(['gravity_whitelist']);
        const whitelist = local.gravity_whitelist || [];
        const domain = (sender.origin || sender.url || '').match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/im)?.[1];
        const username = request.params[0];
        const method = request.method;

        if (!domain || !username) return null;

        // Check match
        const isTrusted = whitelist.some((e: any) =>
            e.domain === domain && e.username === username && (e.method === method || e.method === 'ALL')
        );

        if (!isTrusted) return null;

        // 2. Get Session (Keys)
        const session = await chrome.storage.session.get(['session_accounts']);

        if (!session.session_accounts || session.session_accounts.length === 0) return null; // Locked

        // 1. Detect context from URL to know which chain we are targeting
        const url = sender?.tab?.url || sender?.url || "";
        const detectedChain = detectChainFromUrl(url);

        // 2. Find account matching Name AND Chain (if known).
        // Many dApps (blurt.blog's condenser among them) send no keyType at all. Without
        // one we used to take the first account entry with a matching name and never check
        // its key against the chain, so a stale or duplicate entry would sign and the node
        // would reject a transaction the user had a perfectly good key for. When the dApp
        // stays silent, derive the authority from the operations instead.
        let requestedKeyType = normalizeKeyType(request.params?.[2]);
        if (!requestedKeyType && (request.method === 'requestBroadcast' || request.method === 'broadcast')) {
            const requestOps = Array.isArray(request.params?.[1]) ? request.params[1] : [];
            requestedKeyType = requiresActiveAuthority(requestOps) ? 'active' : 'posting';
        }

        let account = await resolveBestAccountForRequest(
            session.session_accounts,
            username,
            detectedChain,
            requestedKeyType
        );

        // 3. Fallback: If no detected chain or exact match not found
        if (!account && !detectedChain) {
            account = session.session_accounts.find((a: any) => a.name === username && a.chain === 'HIVE');
            if (!account) account = session.session_accounts.find((a: any) => a.name === username);
        }

        if (!account) return { success: false, error: 'Account not found or wallet locked' };

        // 3. Chain ID Handling for Request (pass it down if needed)
        if (!request.requestChain && detectedChain) {
            request.requestChain = detectedChain;
        }

        // Security: Force manual confirmation for financial operations, even if whitelisted.
        if (
            method === 'requestTransfer' ||
            method === 'requestPowerUp' ||
            method === 'requestPowerDown' ||
            method === 'requestDelegation'
        ) {
            return null;
        }

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
        // requestVerifyKey shares decodeMemo's shape — (username, encryptedMemo, keyType) —
        // and its semantics: decrypt the challenge, never sign it.
        const isDecodeMemo = method === 'decodeMemo' || method === 'requestVerifyKey';
        const isEncodeMemo = method === 'encodeMemo';

        let response: any;

        if (isTransfer) {
            const to = request.params[1];
            const amount = request.params[2];
            const memo = request.params[3] || '';
            if (!account.activeKey) return { success: false, error: 'Active key required for transfer' };
            response = await broadcastTransfer(account.chain, account.name, account.activeKey, to, amount, memo);

        } else if (isVote) {
            const permlink = request.params[1];
            const author = request.params[2];
            const weight = Number(request.params[3]);
            const key = account.postingKey || account.activeKey;
            if (!key) return { success: false, error: 'Posting or Active key required for voting' };
            response = await broadcastVote(account.chain, account.name, key, author, permlink, weight);

        } else if (isCustomJson) {
            const id = request.params[1];
            const type = request.params[2];
            const normalizedType = normalizeKeyType(type);
            const json = request.params[3];
            let key = account.postingKey;
            if (normalizedType === 'active') key = account.activeKey;
            if (!key) return { success: false, error: 'Key required for custom JSON operation' };
            response = await broadcastCustomJson(
                account.chain,
                account.name,
                key,
                id,
                typeof json === 'string' ? json : JSON.stringify(json),
                normalizedType === 'active' ? 'Active' : 'Posting'
            );

        } else if (isSignBuffer) {
            const message = request.params[1];
            const type = request.params[2];
            const normalizedType = normalizeKeyType(type);
            let keyStr = "";
            if (normalizedType === 'posting') keyStr = account.postingKey || "";
            else if (normalizedType === 'active') keyStr = account.activeKey || "";
            else if (normalizedType === 'memo') keyStr = account.memoKey || "";
            if (!keyStr) return { success: false, error: 'Key required for signing' };

            if (normalizedType === 'posting' || normalizedType === 'active') {
                const validation = await validateAccountKeys(
                    account.chain,
                    account.name,
                    normalizedType === 'posting' ? { posting: keyStr } : { active: keyStr }
                );
                if (!validation.valid) {
                    return {
                        success: false,
                        error: validation.error || `${normalizedType} key does not match account`
                    };
                }
            }

            const targetChain = request.requestChain || account.chain;
            const useLegacySigner = url.includes('tribaldex') || url.includes('hive-engine');

            response = await signMessage(targetChain, message, keyStr, useLegacySigner);
        } else if (isBroadcast) {
            let operations = request.params[1];
            const keyType = request.params[2];

            // ROBUST CHECK: Handle {operations, url} object that might slip through
            if (operations && typeof operations === 'object' && !Array.isArray(operations)) {
                if ((operations as any).operations) {
                    operations = (operations as any).operations;
                } else {
                    return { success: false, error: 'Invalid broadcast format: operations is not an array' };
                }
            }

            const { key: keyStr, keyType: selectedKeyType } = selectBroadcastKey(
                account,
                keyType,
                Array.isArray(operations) ? operations : []
            );

            if (!keyStr) {
                const requiredType = selectedKeyType === 'active' ? 'Active' : 'Posting';
                return { success: false, error: `${requiredType} key required for broadcast operation` };
            }

            // Public key only — says exactly which stored key is about to sign, so a wrong
            // or duplicate account entry is obvious without inspecting the vault.
            console.log('[Broadcast] Signing as', `@${account.name}`, 'on', account.chain,
                'with', selectedKeyType, 'key', derivePublicKey(account.chain, keyStr));

            response = await broadcastOperations(account.chain, keyStr, operations);

        } else if (isPost) {
            const title = request.params[1];
            const body = request.params[2];
            let parentPermlink = request.params[3];
            const parentAuthor = request.params[4];
            let jsonMetadata = request.params[5];
            const permlink = request.params[6];

            const jsonMetadataStr = typeof jsonMetadata === 'string' ? jsonMetadata : JSON.stringify(jsonMetadata);

            if (!parentPermlink && !parentAuthor) {
                parentPermlink = 'general';
            }

            const op = ['comment', {
                parent_author: parentAuthor || '',
                parent_permlink: parentPermlink || 'general',
                author: username || '',
                permlink: permlink || '',
                title: title || '',
                body: body || '',
                json_metadata: jsonMetadataStr || '{}'
            }];

            const key = account.postingKey || account.activeKey;
            if (!key) return { success: false, error: 'Posting or Active key required for posting' };

            response = await broadcastOperations(account.chain, key, [op]);

        } else if (isPowerUp) {
            const rawTo = request.params[1] || account.name;
            const to = rawTo.replace(/^@/, '');
            let amount = request.params[2];
            if (amount && !amount.includes(' ')) {
                const config = isChainSupported(account.chain) ? getChainConfig(account.chain) : null;
                const symbol = config ? config.primaryToken : 'HIVE';
                amount = `${parseFloat(amount).toFixed(3)} ${symbol}`;
            }
            if (!account.activeKey) return { success: false, error: "Gravity Wallet: Active Key required for Power Up." };
            response = await broadcastPowerUp(account.chain, account.name, account.activeKey, to, amount);

        } else if (isPowerDown) {
            let vestingShares = request.params[1];
            if (vestingShares && !vestingShares.includes(' ')) {
                const config = isChainSupported(account.chain) ? getChainConfig(account.chain) : null;
                const vestingToken = config ? config.vestingToken : 'VESTS';
                vestingShares = `${parseFloat(vestingShares).toFixed(6)} ${vestingToken}`;
            }
            if (!account.activeKey) return { success: false, error: "Gravity Wallet: Active Key required for Power Down." };
            response = await broadcastPowerDown(account.chain, account.name, account.activeKey, vestingShares);

        } else if (isDelegation) {
            const rawDelegatee = request.params[1];
            const delegatee = rawDelegatee ? rawDelegatee.replace(/^@/, '') : "";
            const amount = request.params[2];
            const unit = request.params[3] || 'VESTS';
            let vestingShares = amount;
            if (amount && !amount.includes(' ')) {
                vestingShares = `${amount} ${unit}`;
            }
            if (!account.activeKey) return { success: false, error: "Gravity Wallet: Missing Active Key for Delegation." };
            response = await broadcastDelegation(account.chain, account.name, account.activeKey, delegatee, vestingShares);

        } else if (isWitnessVote) {
            const witness = request.params[1];
            const approve = request.params[2] === true || request.params[2] === "true" || request.params[2] === 1;
            if (!account.activeKey) return { success: false, error: 'Active key required for witness voting' };
            response = await broadcastWitnessVote(account.chain, account.name, account.activeKey, witness, approve);

        } else if (isDecodeMemo) {
            const memo = request.params[1];
            const type = request.params[2];
            const normalizedType = normalizeKeyType(type);
            let keyStr = "";
            if (normalizedType === 'posting') keyStr = account.postingKey || "";
            else if (normalizedType === 'active') keyStr = account.activeKey || "";
            else if (normalizedType === 'memo') keyStr = account.memoKey || "";
            if (!keyStr) return { success: false, error: 'Key required for decoding memo' };
            try {
                const decoded = await decodeMemo(account.chain, account.name, memo, keyStr);
                response = { success: true, result: decoded };
            } catch (e: any) {
                response = { success: false, error: e.message };
            }

        } else if (isEncodeMemo) {
            const receiver = request.params[1];
            const memo = request.params[2];
            const type = request.params[3];
            const normalizedType = normalizeKeyType(type);
            let keyStr = "";
            if (normalizedType === 'posting') keyStr = account.postingKey || "";
            else if (normalizedType === 'active') keyStr = account.activeKey || "";
            else if (normalizedType === 'memo') keyStr = account.memoKey || "";
            if (!keyStr) return { success: false, error: 'Key required for encoding memo' };
            try {
                const encoded = await encodeMemo(account.chain, account.name, receiver, memo, keyStr);
                response = { success: true, result: encoded };
            } catch (e: any) {
                response = { success: false, error: e.message };
            }

        } else {
            return { success: false, error: 'Unsupported operation' };
        }

        if (!response) return { success: false, error: 'No response from wallet' };

        if (!response.success) {
            return { success: false, error: response.error || 'Operation failed' };
        }

        const opResult = response.opResult || response.result || response.txId || 'success';
        const finalResult = response.txId || response.result || opResult;

        // Extract fields to avoid duplicating 'success' when spreading
        const { success: _s, result: _r, publicKey: _pk, error: _e, ...restResponse } = response;

        const broadcastOperationsList = isBroadcast && Array.isArray(request.params?.[1]) ? request.params[1] : null;
        const broadcastEnvelope = isBroadcast && request._gravityBroadcastEnvelope && typeof request._gravityBroadcastEnvelope === 'object'
            ? {
                ...request._gravityBroadcastEnvelope,
                operations: Array.isArray(request._gravityBroadcastEnvelope.operations)
                    ? request._gravityBroadcastEnvelope.operations
                    : broadcastOperationsList
            }
            : null;
        const firstBroadcastOperation = Array.isArray(broadcastOperationsList) ? broadcastOperationsList[0] : null;
        const firstBroadcastOperationName = Array.isArray(firstBroadcastOperation)
            ? firstBroadcastOperation[0]
            : firstBroadcastOperation?.type || firstBroadcastOperation?.operation || firstBroadcastOperation?.method || null;

        let splinterlandsHost = '';
        try {
            splinterlandsHost = new URL(url).hostname;
        } catch (_e) { }
        const isSplinterlands = /(^|\.)splinterlands\.com$/i.test(splinterlandsHost);
        const broadcastResultPayload = isSplinterlands
            ? {
                ...(broadcastEnvelope || {}),
                ...(opResult && typeof opResult === 'object' ? opResult : {}),
                id: response.txId || (opResult && typeof opResult === 'object' ? (opResult as any).id : undefined),
                txId: response.txId,
                tx_id: response.txId,
                operation: firstBroadcastOperationName,
                op: firstBroadcastOperationName,
                operations: broadcastOperationsList
            }
            : finalResult;

        const customJsonResultPayload = isCustomJson
            ? {
                ...(opResult && typeof opResult === 'object' ? opResult : {}),
                id: response.txId || (opResult && typeof opResult === 'object' ? (opResult as any).id : undefined),
                txId: response.txId,
                tx_id: response.txId
            }
            : null;

        const result = isSignBuffer
            ? {
                success: true,
                result: response.result,
                signature: response.result,  // Compatibility
                publicKey: response.publicKey,
                pubkey: response.publicKey,  // Compatibility
                // CRITICAL: blurt.media/peerhub expects data.username
                data: {
                    username: username,
                    publicKey: response.publicKey,
                    signature: response.result
                },
                message: 'Signed successfully',
                ...restResponse
            }
            : (isDecodeMemo || isEncodeMemo)
            ? {
                // Memo operations never broadcast, so no txId/operation fields belong here.
                success: true,
                result: response.result,
                data: {
                    username: username,
                    message: response.result
                },
                message: isDecodeMemo ? 'Decoded successfully' : 'Encoded successfully',
                ...restResponse
            }
            : {
                success: true,
                result: isCustomJson ? customJsonResultPayload : broadcastResultPayload,
                txId: response.txId,
                tx_id: response.txId,
                transaction: broadcastEnvelope || undefined,
                broadcastPayload: opResult,
                opResult,
                operation: firstBroadcastOperationName,
                operations: broadcastOperationsList,
                message: 'Signed successfully',
                ...restResponse
            };

        return result;

    } catch (e) {
        console.error("Auto-sign failed:", e);
        return null; // Fallback to prompt
    }
}

async function openPrompt(requestId: string) {
    const width = 450;
    const height = 620;
    try {
        await chrome.storage.session.set({ gravity_active_request_id: requestId });

        if (chrome.action?.openPopup) {
            try {
                await chrome.action.openPopup();
                return;
            } catch (popupError) {
                console.warn("Gravity: action.openPopup failed, falling back to detached request window", popupError);
            }
        }

        await chrome.windows.create({
            url: `index.html?requestId=${requestId}`,
            type: 'popup',
            width: width,
            height: height,
            focused: true
        });
    } catch (e) {
        console.error("Gravity: Failed to open prompt", e);
    }
}

// === WEB PUSH LOGIC ===
const VAPID_PUBLIC_KEY = 'BNXKcYc9Skxc1DN5d5LoSrm--iYct9aMr6SzoimkM0ZhKURE3cZp6MCHh03D7DYJ-j07QwZze0-peLPmne_VZcQ';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function getExistingSubscription() {
    try {
        // @ts-ignore
        const reg = self.registration;
        if (!reg?.pushManager) return null;
        return await reg.pushManager.getSubscription();
    } catch (e) {
        console.warn("Gravity: Failed to get subscription", e);
        return null;
    }
}

async function manualPushSubscribe() {
    try {
        // @ts-ignore
        const reg = self.registration;
        if (!reg || !reg.pushManager) {
            throw new Error("PushManager not available in Service Worker context");
        }

        // Check existing first
        let sub = await reg.pushManager.getSubscription();
        if (sub) {
            return sub;
        }

        // Subscribe (Requires User Gesture usually)
        sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        // Save locally
        await chrome.storage.local.set({ gravity_push_sub: JSON.stringify(sub) });
        return sub;
    } catch (e: any) {
        console.error("Gravity: [Background] Push Subscription ERROR:", e.name, e.message);
        throw e;
    }
}

// Handler for UI requests - MERGED into main listener above
// CHAT_CHECK_PUSH and CHAT_ENABLE_PUSH are now handled in the main onMessage listener.

// === WEB PUSH LISTENER ===
// Handler for incoming Push Notifications
// @ts-ignore
self.addEventListener('push', (event: any) => {
    let data: any = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) { }

    // 1. Update Badge
    unreadCount++;
    chrome.action.setBadgeText({ text: unreadCount > 9 ? '9+' : String(unreadCount) });
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });

    // 2. Show System Notification
    const title = data.title || 'Gravity Wallet';
    const options = {
        body: data.body || 'New message received',
        icon: 'icons/48.png'
    };

    // @ts-ignore
    event.waitUntil(self.registration.showNotification(title, options));
});

// Notifications Click Handler
// @ts-ignore
self.addEventListener('notificationclick', (event: any) => {
    event.notification.close();
    chrome.windows.create({
        url: 'index.html',
        type: 'popup',
        width: 450,
        height: 620
    });
});
