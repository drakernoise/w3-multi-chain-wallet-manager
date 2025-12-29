// Polyfill for libs expecting 'exports'
(self as any).exports = {};

import { broadcastTransfer, broadcastVote, broadcastCustomJson, signMessage, broadcastOperations, broadcastPowerUp, broadcastPowerDown, broadcastDelegation } from '../../services/chainService';
import { getChainConfig, isChainSupported } from '../../config/chainConfig';

declare var chrome: any;

// === OFFSCREEN MANAGEMENT ===
// IMPORTANT: Path must match what Vite outputs. If using base: './', it might be valid.
// But check logical path. Offscreen creates document relative to extension root.
const OFFSCREEN_DOCUMENT_PATH = 'src/offscreen/offscreen.html';

async function setupOffscreenDocument(path: string) {
    try {
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

let unreadCount = 0;

function detectChainFromUrl(url: string = ""): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        const host = u.hostname.toLowerCase();

        // Use configuration for detection if possible, or keep simple heuristics for now
        // HIVE
        const hiveHosts = ['peakd.com', 'ecency.com', 'tribaldex.com'];
        if (
            hiveHosts.some(domain => host === domain || host.endsWith(`.${domain}`)) ||
            host.includes('hive')
        ) return 'HIVE';

        // BLURT
        const blurtHosts = ['blurt.blog', 'blurtwallet.com'];
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

// Listen for messages from Content Script or Popup
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: Function) => {
    if (!request) return false;
    // console.log("Gravity Debug: MESSAGE RECEIVED", request.type, request.method); // Debug only
    // console.log("Gravity: MSG", request.type, request.method); // Debug only

    // 1. Request from Web Page (via Content Script)
    if (request.type === 'gravity_request') {
        // Validation: Prevent giant strings or invalid types (Fuzzer protection)
        if (typeof request.method !== 'string' || request.method.length > 64) {
            console.warn("Gravity: Rejected invalid method (length/type)", request.method);
            sendResponse({ success: false, error: 'Invalid Request: Method name too long or invalid.' });
            return false;
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

        // Handshake is auto-approved
        if (request.method === 'requestHandshake') {
            sendResponse({ success: true, version: '1.0', msg: 'Gravity Wallet Active' });
            return false;
        }

        const requestId = request.params?.requestId || request.id || Date.now().toString();

        // Check Whitelist & auto-sign
        tryAutoSign(request, sender).then((autoResult) => {
            if (autoResult) {
                console.log('Gravity: Auto-signed request from whitelist');
                sendResponse(autoResult);
            } else {
                const chainHint = detectChainFromUrl(sender.url || sender.tab?.url);

                // Store request consistently in Session Storage (Persists across SW sleep)
                const reqData = {
                    data: request,
                    tabId: sender.tab?.id,
                    frameId: sender.frameId,
                    origin: sender.origin || sender.url,
                    chain: chainHint
                };

                chrome.storage.session.set({ [`req_${requestId}`]: reqData }, () => {
                    openPrompt(requestId);
                    sendResponse({ success: true, pending: true, note: 'User prompt opened' });
                });
            }
        });

        return true; // Keep channel open
    }

    // 3. Popup asking for Request Details
    if (request.type === 'gravity_get_request') {
        const requestId = request.requestId;
        chrome.storage.session.get([`req_${requestId}`]).then((res: any) => {
            const req = res[`req_${requestId}`];
            sendResponse({
                request: req ? req.data : null,
                origin: req ? req.origin : null,
                chain: req ? req.chain : null
            });
        });
        return true; // Async response
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
                // If 'result' input is an object containing { result: "txid", opResult: {...} }, use it directly.
                // Otherwise wrap it.
                // However, 'SignRequest' sends the FULL object as 'result'.
                // Ideally, we want response to be: { success: true, result: "txid", message: "...", opResult: {...} }
                const payload = error ? { success: false, error } : { success: true, ...result };

                // console.log('Gravity: Sending response to dApp:', payload); // Debug only

                chrome.tabs.sendMessage(pending.tabId, {
                    type: 'gravity_response',
                    id: requestId, // Use the original ID
                    response: payload
                }, targetOptions);
                // Cleanup
                chrome.storage.session.remove([`req_${requestId}`]);
            }
        });
        // We don't necessarily need to sendResponse to the popup, but good practice
        sendResponse({ ack: true });
        return false;
    }

    // === CHAT & OFFSCREEN LOGIC ===

    // From Offscreen: New Message
    if (request.type === 'OFFSCREEN_NEW_MESSAGE') {
        const count = request.count || 1;
        unreadCount += count;
        chrome.action.setBadgeText({ text: unreadCount > 9 ? '9+' : String(unreadCount) });
        chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
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

        const text = unreadCount > 0 ? (unreadCount > 9 ? '9+' : String(unreadCount)) : '';
        chrome.action.setBadgeText({ text });
        chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
        sendResponse({ ack: true });
        return false;
    }
});


async function tryAutoSign(request: any, sender: any): Promise<any | null> {
    // console.log('Gravity: tryAutoSign called for method:', request.method, 'from:', sender.origin); // Debug only
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

        // CRITICAL FIX: Multi-chain Account Selection
        // 1. Detect context from URL to know which chain we are targeting
        const url = sender?.tab?.url || sender?.url || "";
        const detectedChain = detectChainFromUrl(url);
        // console.log(`Gravity Debug: AutoSign for ${username} @ ${domain}`);

        // 2. Find account matching Name AND Chain (if known)
        let account = null;
        const potentialAccounts = session.session_accounts.filter((a: any) => a.name === username);

        if (potentialAccounts.length === 0) {
            return null;
        }

        if (detectedChain) {
            account = potentialAccounts.find((a: any) => a.chain === detectedChain);
        }

        // 3. Fallback: If no detected chain or exact match not found
        if (!account) {
            // Prefer HIVE as default (Standard Keychain behavior)
            account = potentialAccounts.find((a: any) => a.chain === 'HIVE');
            // If no Hive, take the first one (e.g. Blurt/Steem only)
            if (!account) account = potentialAccounts[0];
        }

        if (!account) return { success: false, error: 'Account not found or wallet locked' };

        // 3. Chain ID Handling for Request (pass it down if needed)
        // Ensure request knows the target chain
        if (!request.requestChain && detectedChain) {
            request.requestChain = detectedChain;
        }

        // Security: Force manual confirmation for financial operations, even if whitelisted.
        // This prevents "surprise" transfers if the user accidentally trusted a domain globally.
        if (
            method === 'requestTransfer' ||
            method === 'requestPowerUp' ||
            method === 'requestPowerDown' ||
            method === 'requestDelegation'
        ) {
            console.log('Gravity: Forcing manual confirmation for financial operation:', method);
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
        const isSignedCall = method === 'requestSignedCall' || method === 'signedCall';

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
            const json = request.params[3];
            let key = account.postingKey;
            if (type === 'Active') key = account.activeKey;
            if (!key) return { success: false, error: 'Key required for custom JSON operation' };
            response = await broadcastCustomJson(account.chain, account.name, key, id, typeof json === 'string' ? json : JSON.stringify(json), type as any);

        } else if (isSignBuffer) {
            const message = request.params[1];
            const type = request.params[2];
            let keyStr = "";
            if (type === 'Posting') keyStr = account.postingKey || "";
            else if (type === 'Active') keyStr = account.activeKey || "";
            else if (type === 'Memo') keyStr = account.memoKey || "";
            if (!keyStr) return { success: false, error: 'Key required for signing' };

            // Use requested chain (e.g. Hive) if DApp specified it, to ensure correct signature format (STM vs BLT)
            // Fallback: Detect from URL if hint is missing (e.g. older provider cached)
            const url = sender?.tab?.url || sender?.url || "";
            const urlChain = detectChainFromUrl(url);
            const targetChain = request.requestChain || urlChain || account.chain;

            // Domain-Specific Signing Strategy:
            // Tribaldex/Hive-Engine require legacy (dsteem) signatures.
            // PeakD and modern apps require standard (dhive) signatures.
            const useLegacySigner = url.includes('tribaldex') || url.includes('hive-engine');

            response = signMessage(targetChain, message, keyStr, useLegacySigner);

        } else if (isBroadcast) {
            let operations = request.params[1];
            const keyType = request.params[2];


            if (operations && !Array.isArray(operations) && operations.operations) operations = operations.operations;

            // Critical Fix for Steemit: Sanitize 'comment' operations in generic broadcast
            // Create CLEAN objects to avoid __config and other non-serializable junk
            try {
                if (operations && Array.isArray(operations)) {
                    operations = operations.map((op: any) => {
                        if (Array.isArray(op) && op[0] === 'comment' && op[1]) {
                            const payload = op[1];

                            let parentPermlink = payload.parent_permlink;

                            // CRITICAL: Steemit sends 'category' instead of 'parent_permlink' for root posts
                            if (!parentPermlink && !payload.parent_author) {
                                console.warn('Gravity: Sanitizing generic broadcast comment - missing parent_permlink');

                                // Strategy 1: Use 'category' field if present (Steemit-specific)
                                if (payload.category) {
                                    parentPermlink = payload.category;
                                    console.log('Gravity: Using category as parent_permlink:', payload.category);
                                }

                                // Strategy 2: Try to recover from json_metadata tags
                                if (!parentPermlink && payload.json_metadata) {
                                    try {
                                        const meta = typeof payload.json_metadata === 'string' ? JSON.parse(payload.json_metadata) : payload.json_metadata;
                                        if (meta.tags && meta.tags[0]) {
                                            parentPermlink = meta.tags[0];
                                            console.log('Gravity: Recovered parent_permlink from tags:', meta.tags[0]);
                                        }
                                    } catch (e) { }
                                }

                                // Strategy 3: Last resort fallback
                                if (!parentPermlink) {
                                    parentPermlink = 'general';
                                    console.warn('Gravity: Using fallback "general" for parent_permlink');
                                }
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

                            return ['comment', cleanPayload];
                        }

                        // Sanitize custom_json operations
                        if (op[0] === 'custom_json') {
                            const payload = op[1];

                            // CRITICAL: Ensure both required_auths and required_posting_auths exist
                            // Hive.blog sometimes sends operations without required_auths
                            const cleanPayload = {
                                required_auths: (payload.required_auths !== undefined && Array.isArray(payload.required_auths))
                                    ? payload.required_auths
                                    : [],
                                required_posting_auths: (payload.required_posting_auths !== undefined && Array.isArray(payload.required_posting_auths))
                                    ? payload.required_posting_auths
                                    : [],
                                id: payload.id || '',
                                json: typeof payload.json === 'string' ? payload.json : JSON.stringify(payload.json || {})
                            };

                            return ['custom_json', cleanPayload];
                        }

                        return op;
                    });
                }
            } catch (err) {
                console.warn('Gravity: Error during operation sanitization (non-fatal)', err);
            }

            let keyStr = "";
            // Fix: Handle case-insensitive key types (Hive.blog sends 'posting', others send 'Posting')
            const normalizedKeyType = (keyType || '').toLowerCase();

            if (normalizedKeyType === 'posting') keyStr = account.postingKey || "";
            else if (normalizedKeyType === 'active') keyStr = account.activeKey || "";
            else keyStr = account.activeKey || ""; // Default fallback

            if (!keyStr) return { success: false, error: 'Key required for broadcast operation' };

            response = await broadcastOperations(account.chain, keyStr, operations);

        } else if (isPost) {
            const title = request.params[1];
            const body = request.params[2];
            let parentPermlink = request.params[3];
            const parentAuthor = request.params[4];
            let jsonMetadata = request.params[5];
            const permlink = request.params[6];

            console.log('Gravity: requestPost params:', { title, parentPermlink, parentAuthor, jsonMetadata, permlink });

            // Ensure json_metadata is a string for the operation
            const jsonMetadataStr = typeof jsonMetadata === 'string' ? jsonMetadata : JSON.stringify(jsonMetadata);

            // POST RECOVERY LOGIC
            // Critical for Steem: parent_permlink must be a string (tag or slug)
            if (!parentPermlink) {
                console.warn('Gravity: parent_permlink is missing. Attempting recovery...');

                // Strategy 1: Check if Steemit sent 'category' field (common in their API)
                if ((request.params as any).category) {
                    parentPermlink = (request.params as any).category;
                    console.log('Gravity: Recovered parent_permlink from category field:', parentPermlink);
                }

                // Strategy 2: Extract from tags in metadata
                if (!parentPermlink) {
                    try {
                        const metadata = typeof jsonMetadata === 'string' ? JSON.parse(jsonMetadata) : jsonMetadata;
                        if (metadata && metadata.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0) {
                            parentPermlink = metadata.tags[0];
                            console.log('Gravity: Recovered parent_permlink from tags:', parentPermlink);
                        }
                    } catch (e) {
                        console.warn('Gravity: Failed to parse metadata params for recovery:', e);
                    }
                }

                // Strategy 3: If still missing and it's a root post (no parentAuthor), default to 'general'
                if (!parentPermlink && !parentAuthor) {
                    parentPermlink = 'general'; // Last resort fallback to avoid crash
                    console.warn('Gravity: Using fallback "general" for parent_permlink');
                }
            }

            // Final sanity check
            if (!parentPermlink) {
                console.error('Gravity: Critical - parent_permlink is still null/undefined. Operation will fail.');
                return { success: false, error: 'Missing parent_permlink (category/tag)' };
            }

            // Sanitize ALL fields to ensure none are null/undefined (serializer crashes on null)
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

            console.log('Gravity: Broadcasting post op:', op);
            response = await broadcastOperations(account.chain, key, [op]);

        } else if (isPowerUp) {
            // console.log("Gravity Debug: Processing PowerUp...");
            // PeakD might send '@username'. Sanitize it.
            const rawTo = request.params[1] || account.name;
            const to = rawTo.replace(/^@/, '');

            let amount = request.params[2];
            // Normalize amount using chain configuration
            if (amount && !amount.includes(' ')) {
                const config = isChainSupported(account.chain) ? getChainConfig(account.chain) : null;
                const symbol = config ? config.primaryToken : 'HIVE'; // Fallback to HIVE if obscure
                amount = `${parseFloat(amount).toFixed(3)} ${symbol}`;
            }
            // console.log(`Gravity Debug: Amount normalized: ${amount}`);

            if (!account.activeKey) {
                // console.error("Gravity Debug: Missing Active Key for PowerUp!");
                return { success: false, gravity_error: "MISSING_ACTIVE_KEY", error: "Gravity Wallet: Active Key required for Power Up." };
            }
            response = await broadcastPowerUp(account.chain, account.name, account.activeKey, to, amount);
            // console.log("Gravity Debug: PowerUp Response:", response);

        } else if (isPowerDown) {
            let vestingShares = request.params[1];
            if (vestingShares && !vestingShares.includes(' ')) {
                // Use chain config for vesting token (usually VESTS for all Graphene chains)
                const config = isChainSupported(account.chain) ? getChainConfig(account.chain) : null;
                const vestingToken = config ? config.vestingToken : 'VESTS';
                vestingShares = `${parseFloat(vestingShares).toFixed(6)} ${vestingToken}`;
            }
            if (!account.activeKey) return { success: false, gravity_error: "MISSING_ACTIVE_KEY", error: "Gravity Wallet: Active Key required for Power Down." };
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

        } else if (isSignedCall) {
            // requestSignedCall is used by BlurtWallet for API calls that need to be signed
            // Parameters: username, method, params, keyType
            const apiMethod = request.params[1];
            const apiParams = request.params[2];
            const keyType = request.params[3];

            let keyStr = "";
            if (keyType === 'Posting') keyStr = account.postingKey || "";
            else if (keyType === 'Active') keyStr = account.activeKey || "";
            else keyStr = account.postingKey || "";

            if (!keyStr) return { success: false, error: 'Key required for signed call' };

            // Create a custom JSON operation for the signed call
            const customJsonOp = ['custom_json', {
                required_auths: keyType === 'Active' ? [username] : [],
                required_posting_auths: keyType === 'Posting' ? [username] : [],
                id: apiMethod,
                json: JSON.stringify(apiParams)
            }];

            response = await broadcastOperations(account.chain, keyStr, [customJsonOp]);

        } else {
            return { success: false, error: 'Unsupported operation' };
        }

        // Validate response exists
        if (!response) {
            console.error('Gravity: No response from broadcast operation');
            return { success: false, error: 'No response from wallet' };
        }

        // console.log('Gravity: Raw response from operation:', response); // Debug only

        if (!response.success) {
            // console.log('Gravity: Operation failed, returning error:', response.error); // Debug only
            return { success: false, error: response.error || 'Operation failed' };
        }

        // Fix result format for dApp compatibility (Hive Engine etc.)
        // Prefer opResult (object) if available, otherwise txId (string).
        // Some dApps expect { result: { id: "..." } }, others just { result: "..." }.
        // Providing opResult usually satisfies those looking for an object.
        const finalResult = response.opResult || response.txId || response.result || 'success';

        // console.log('Gravity: finalResult constructed:', finalResult); // Debug only

        const result = isSignBuffer
            ? { result: response.result, message: 'Signed successfully', ...response }
            : { result: finalResult, message: 'Signed successfully', ...response };

        // Safety check to prevent "Cannot create property 'id' on string" error downstream
        // in case 'response' itself was physically a string (unlikely but possible in some error paths)
        if (typeof result !== 'object') {
            return { success: true, pending: false, result: result, message: 'Signed successfully' };
        }

        // if (isSignBuffer) { console.log('Gravity: SignBuffer response:', result); } // Debug only

        // console.log('Gravity: Final result object being returned:', result); // Debug only

        return { success: true, pending: false, ...result };

    } catch (e) {
        console.error("Auto-sign failed:", e);
        return null; // Fallback to prompt
    }
}

async function openPrompt(requestId: string) {
    const width = 450;
    const height = 620;
    try {
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

async function subscribeToPush() {
    try {
        // @ts-ignore
        const registration = self.registration;
        if (!registration || !registration.pushManager) {
            // PushManager might only be available in SW context, ensuring we are in one.
            console.warn("Gravity: PushManager not available");
            return;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        console.log("Gravity: Push Subscribed!", JSON.stringify(subscription));

        // Save to storage (Frontend will pick this up)
        chrome.storage.local.set({ gravity_push_sub: JSON.stringify(subscription) });

        return subscription;
    } catch (e) {
        console.error("Gravity: Push Subscription Error", e);
    }
}

// Call subscription on init
subscribeToPush();

// Listen for Push Events
// @ts-ignore
self.addEventListener('push', (event: any) => {
    console.log('Gravity: Push Event Received');
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
