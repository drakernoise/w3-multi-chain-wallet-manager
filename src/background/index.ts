
// Background Worker
import { broadcastTransfer, broadcastVote, broadcastCustomJson, signMessage, broadcastOperations, broadcastPowerUp, broadcastPowerDown, broadcastDelegation } from '../../services/chainService';

declare var chrome: any;

function detectChainFromUrl(url: string = ""): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        const host = u.hostname.toLowerCase();
        // HIVE list - customize as needed
        const hiveHosts = ['peakd.com', 'ecency.com', 'tribaldex.com'];
        if (
            hiveHosts.some(domain => host === domain || host.endsWith(`.${domain}`)) ||
            host.includes('hive')
        ) return 'HIVE';
        // BLURT list - customize as needed
        const blurtHosts = ['blurt.blog'];
        if (
            blurtHosts.some(domain => host === domain || host.endsWith(`.${domain}`)) ||
            host.includes('blurt')
        ) return 'BLURT';
        // STEEM list - customize as needed
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
    // console.log("Gravity Debug: MESSAGE RECEIVED", request.type, request.method); // Disabled for production

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
});


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

        // CRITICAL FIX: Multi-chain Account Selection
        // 1. Detect context from URL to know which chain we are targeting
        const url = sender?.tab?.url || sender?.url || "";
        const detectedChain = detectChainFromUrl(url);
        // console.log(`Gravity Debug: AutoSign for ${username} @ ${domain}`);

        // 2. Find account matching Name AND Chain (if known)
        let account = null;
        const potentialAccounts = session.session_accounts.filter((a: any) => a.name === username);

        if (potentialAccounts.length === 0) {
            // console.log("Gravity Debug: No accounts found with that name.");
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
            // console.log("Gravity Debug: Fallback account selection used.");
        }

        if (!account) return null;
        // console.log(`Gravity Debug: Selected Account: ${account.name} (${account.chain})`);

        // 3. Perform Operation (Logic copied from SignRequest)
        // Check Keys
        const isTransfer = method === 'requestTransfer';
        const isVote = method === 'requestVote' || method === 'vote';
        const isCustomJson = method === 'requestCustomJson' || method === 'customJSON';
        const isSignBuffer = method === 'requestSignBuffer' || method === 'signBuffer';
        const isBroadcast = method === 'requestBroadcast' || method === 'broadcast';
        const isPowerUp = method === 'requestPowerUp' || method === 'powerUp';
        const isPowerDown = method === 'requestPowerDown' || method === 'powerDown';
        const isDelegation = method === 'requestDelegation' || method === 'delegation';
        const isPost = method === 'requestPost' || method === 'post';

        let response: any;

        if (isTransfer) {
            const to = request.params[1];
            const amount = request.params[2];
            const memo = request.params[3] || '';
            if (!account.activeKey) return null;
            response = await broadcastTransfer(account.chain, account.name, account.activeKey, to, amount, memo);

        } else if (isVote) {
            const permlink = request.params[1];
            const author = request.params[2];
            const weight = Number(request.params[3]);
            const key = account.postingKey || account.activeKey;
            if (!key) return null;
            response = await broadcastVote(account.chain, account.name, key, author, permlink, weight);

        } else if (isCustomJson) {
            const id = request.params[1];
            const type = request.params[2];
            const json = request.params[3];
            let key = account.postingKey;
            if (type === 'Active') key = account.activeKey;
            if (!key) return null;
            response = await broadcastCustomJson(account.chain, account.name, key, id, typeof json === 'string' ? json : JSON.stringify(json), type as any);

        } else if (isSignBuffer) {
            const message = request.params[1];
            const type = request.params[2];
            let keyStr = "";
            if (type === 'Posting') keyStr = account.postingKey || "";
            else if (type === 'Active') keyStr = account.activeKey || "";
            else if (type === 'Memo') keyStr = account.memoKey || "";
            if (!keyStr) return null;
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
            let keyStr = "";
            if (keyType === 'Posting') keyStr = account.postingKey || "";
            else if (keyType === 'Active') keyStr = account.activeKey || "";
            else keyStr = account.activeKey || "";
            if (!keyStr) return null;
            response = await broadcastOperations(account.chain, keyStr, operations);

        } else if (isPost) {
            const title = request.params[1];
            const body = request.params[2];
            const parentPermlink = request.params[3];
            const parentAuthor = request.params[4];
            const jsonMetadata = request.params[5];
            const permlink = request.params[6];
            const op = ['comment', {
                parent_author: parentAuthor,
                parent_permlink: parentPermlink,
                author: username,
                permlink: permlink,
                title: title,
                body: body,
                json_metadata: typeof jsonMetadata === 'string' ? jsonMetadata : JSON.stringify(jsonMetadata)
            }];
            const key = account.postingKey || account.activeKey;
            if (!key) return null;
            response = await broadcastOperations(account.chain, key, [op]);

        } else if (isPowerUp) {
            // console.log("Gravity Debug: Processing PowerUp...");
            // PeakD might send '@username'. Sanitize it.
            const rawTo = request.params[1] || account.name;
            const to = rawTo.replace(/^@/, '');

            let amount = request.params[2];
            // Normalize amount
            if (amount && !amount.includes(' ')) {
                const symbol = account.chain === 'HIVE' ? 'HIVE' : account.chain === 'STEEM' ? 'STEEM' : 'BLURT';
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
                vestingShares = `${parseFloat(vestingShares).toFixed(6)} VESTS`;
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

        } else {
            return null;
        }

        if (!response.success) {
            return { success: false, error: response.error };
        }

        // For broadcast ops, prefer returning the full opResult object (PeakD expectation?) 
        // fallback to txId if missing.
        const finalResult = response.opResult || response.txId;

        const result = isSignBuffer
            ? { result: response.result, message: 'Signed successfully', ...response }
            : { result: finalResult, message: 'Signed successfully', ...response };

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
