(function() {
    if (window.gravity_bridge_active) return;
    window.gravity_bridge_active = true;

    const gwdbg = (stage, payload) => {
        try {
            if (typeof payload === 'undefined') {
                console.log(`[GWDBG][${stage}]`);
            } else {
                console.log(`[GWDBG][${stage}]`, payload);
            }
        } catch (e) {}
    };

    console.log('[GravityBridge] Initializing v1.0.5 - High Compatibility Mode');
    gwdbg('bridge:init', { href: window.location.href, origin: window.location.origin });

    window.addEventListener('error', (event) => {
        gwdbg('page:error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        const reason = event && event.reason ? event.reason : event;
        gwdbg('page:unhandledrejection', {
            message: reason && reason.message ? reason.message : String(reason)
        });
    });

    const ensureToastHost = () => {
        let host = document.getElementById('gravity-toast-host');
        if (host) return host;
        host = document.createElement('div');
        host.id = 'gravity-toast-host';
        Object.assign(host.style, {
            position: 'fixed',
            top: 'max(env(safe-area-inset-top), 16px)',
            left: '12px',
            right: '12px',
            zIndex: '2147483647',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pointerEvents: 'none'
        });
        document.body.appendChild(host);
        return host;
    };

    const showInAppToast = (message) => {
        if (!message) return;
        const host = ensureToastHost();
        const toast = document.createElement('div');
        toast.textContent = String(message);
        Object.assign(toast.style, {
            background: 'rgba(15, 23, 42, 0.96)',
            color: '#e2e8f0',
            border: '1px solid rgba(96, 165, 250, 0.28)',
            borderRadius: '16px',
            padding: '12px 14px',
            font: '700 12px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.32)'
        });
        host.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-8px)';
            toast.style.transition = 'opacity 160ms ease, transform 160ms ease';
        }, 2200);
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 2500);
    };

    window.alert = (message) => {
        gwdbg('page:alert', { message: String(message) });
        showInAppToast(message);
    };

    const PERMISSION_KEY = 'gravity_mobile_site_permissions_v2';
    const DESKTOP_MODE_KEY = 'gravity_mobile_desktop_hosts_v1';

    const loadStoredPermissions = () => {
        try {
            const raw = localStorage.getItem(PERMISSION_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    };

    const saveStoredPermissions = (permissions) => {
        try {
            localStorage.setItem(PERMISSION_KEY, JSON.stringify(permissions));
        } catch (e) {}
    };

    const getStoredPermission = (domain, method) => {
        const permissions = loadStoredPermissions();
        const permission = permissions[domain];
        if (!permission) return null;
        if (permission.expiresAt && Date.now() > permission.expiresAt) {
            delete permissions[domain];
            saveStoredPermissions(permissions);
            return null;
        }
        if (method && Array.isArray(permission.operations) && !(permission.operations.includes('*') || permission.operations.includes(method))) {
            return null;
        }
        return permission;
    };

    const rememberPermission = (domain, method, account, duration) => {
        if (!domain || !duration || !account) return;
        const durations = {
            '1day': 24 * 60 * 60 * 1000,
            '1week': 7 * 24 * 60 * 60 * 1000,
            '1month': 30 * 24 * 60 * 60 * 1000
        };
        const permissions = loadStoredPermissions();
        const existing = permissions[domain] || {};
        permissions[domain] = {
            domain,
            account,
            expiresAt: Date.now() + (durations[duration] || durations['1day']),
            operations: ['*'],
            grantedAt: existing.grantedAt || Date.now()
        };
        saveStoredPermissions(permissions);
        gwdbg('permissions:remembered', {
            domain,
            method,
            account,
            duration
        });
    };

    const loadDesktopHosts = () => {
        try {
            const raw = localStorage.getItem(DESKTOP_MODE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    const saveDesktopHosts = (hosts) => {
        try {
            localStorage.setItem(DESKTOP_MODE_KEY, JSON.stringify(hosts));
        } catch (e) {}
    };

    const isDesktopModeEnabled = () => {
        const host = window.location.hostname || '';
        return loadDesktopHosts().includes(host);
    };

    const setDesktopModeEnabled = (enabled) => {
        const host = window.location.hostname || '';
        if (!host) return;
        const nextHosts = new Set(loadDesktopHosts());
        if (enabled) nextHosts.add(host);
        else nextHosts.delete(host);
        saveDesktopHosts(Array.from(nextHosts));
    };

    const applyDesktopMode = () => {
        const enabled = isDesktopModeEnabled();
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.setAttribute('name', 'viewport');
            document.head.appendChild(viewport);
        }
        if (!viewport.dataset.gravityOriginalContent) {
            viewport.dataset.gravityOriginalContent = viewport.getAttribute('content') || '';
        }

        if (enabled) {
            viewport.setAttribute('content', 'width=1380, initial-scale=0.28, minimum-scale=0.2, maximum-scale=5, user-scalable=yes');
            document.documentElement.style.minWidth = '1380px';
            document.body.style.minWidth = '1380px';
            document.documentElement.classList.add('gravity-desktop-mode');
            document.body.classList.add('gravity-desktop-mode');
        } else {
            viewport.setAttribute('content', viewport.dataset.gravityOriginalContent || 'width=device-width, initial-scale=1.0');
            document.documentElement.style.minWidth = '';
            document.body.style.minWidth = '';
            document.documentElement.classList.remove('gravity-desktop-mode');
            document.body.classList.remove('gravity-desktop-mode');
        }

        document.documentElement.dataset.gravityDesktopMode = enabled ? 'true' : 'false';
    };

    const formatBridgeResult = (res) => {
        const nestedResult = res && res.result && typeof res.result === 'object' ? res.result : null;
        return {
            id: res && (res.id || res.request_id),
            success: !!(res && res.success),
            error: res && res.success ? null : ((res && res.error) || 'User rejected'),
            result: nestedResult && typeof nestedResult.result !== 'undefined'
                ? nestedResult.result
                : (res && (res.result || res.txId || null)),
            request_id: res && (res.id || res.request_id),
            publicKey: (res && res.publicKey) || (nestedResult && nestedResult.publicKey),
            message: (res && res.message) || (nestedResult && nestedResult.message)
        };
    };

    const emitBridgeResponse = (data) => {
        if (!data) return;

        const normalized = formatBridgeResult(data);
        gwdbg('bridge:emit-response', normalized);

        // Internal listeners in this bridge use the raw-ish response shape.
        window.dispatchEvent(new CustomEvent('gravity_response', { detail: normalized }));

        // Match the browser extension transport shape for page providers.
        window.postMessage({
            type: 'gravity_response',
            id: normalized.id,
            response: normalized
        }, '*');

        // Keep legacy keychain mobile compatibility.
        window.postMessage({ type: 'keychain_response', response: normalized }, window.location.origin);

        // Some dApps listen to response events instead of callbacks.
        try {
            const responseDetail = { ...normalized, request_id: normalized.id };
            ['hive_keychain_response', 'blurt_keychain_response', 'steem_keychain_response'].forEach((eventName) => {
                const responseEvent = new CustomEvent(eventName, { detail: responseDetail });
                window.dispatchEvent(responseEvent);
                document.dispatchEvent(responseEvent);
            });
        } catch (e) {}
    };

    // 1. The primary communication channel used by Keychain Mobile
    const requestNative = (method, params) => {
        return new Promise((resolve, reject) => {
            const id = Math.random().toString(36).substring(7);
            gwdbg('bridge:request-created', {
                id,
                method,
                hasParams: !!params,
                paramKeys: params ? Object.keys(params) : []
            });
            
            // Listen for the response using BOTH custom event and postMessage
            const onResponse = (data) => {
                if (data && data.id === id) {
                    gwdbg('bridge:response-matched', {
                        id,
                        method,
                        success: data.success,
                        hasResult: !!data.result,
                        hasError: !!data.error
                    });
                    console.log(`[GravityBridge] Received response for ${method}:`, data.success);
                    resolve(data);
                    return true;
                }
                return false;
            };

            const handler = (event) => {
                const data = event.detail || event;
                if (onResponse(data)) window.removeEventListener('gravity_response', handler);
            };
            window.addEventListener('gravity_response', handler);

            // Also listen to window.postMessage for some dApps
            const messageHandler = (event) => {
                if (event.data && event.data.type === 'keychain_response' && onResponse(event.data.response)) {
                    window.removeEventListener('message', messageHandler);
                }
            };
            window.addEventListener('message', messageHandler);

            const nativeMessageHandler = (event) => {
                const data = event && event.detail ? event.detail : event;
                if (onResponse(data)) {
                    window.removeEventListener('messageFromNative', nativeMessageHandler);
                }
            };
            window.addEventListener('messageFromNative', nativeMessageHandler);

            const sendToNative = (selectedAccount, rememberDuration) => {
                const message = { 
                    id, 
                    method,
                    params: {
                        ...params,
                        account: selectedAccount || params.username || params.account,
                        rememberDuration: rememberDuration || params.rememberDuration
                    },
                    domain: window.location.hostname,
                    preConfirmed: !!selectedAccount
                };
                gwdbg('bridge:send-native', {
                    id,
                    method,
                    selectedAccount: selectedAccount || null,
                    rememberDuration: rememberDuration || null,
                    domain: message.domain,
                    preConfirmed: message.preConfirmed
                });
                
                if (window.mobileApp && typeof window.mobileApp.postMessage === 'function') {
                    gwdbg('bridge:send-native-channel', 'mobileApp.postMessage');
                    window.mobileApp.postMessage({ detail: message });
                } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.bridge) {
                    gwdbg('bridge:send-native-channel', 'webkit.messageHandlers.bridge');
                    window.webkit.messageHandlers.bridge.postMessage(message);
                } else {
                    gwdbg('bridge:send-native-missing', {
                        hasMobileApp: !!window.mobileApp,
                        hasWebkitBridge: !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.bridge)
                    });
                    console.error('[GravityBridge] Native bridge missing');
                    reject('Bridge missing');
                }
            };

            // Non-silent methods require our in-page UI
            const silentMethods = ['requestHandshake', 'requestAddAccount'];
            const storedPermission = getStoredPermission(window.location.hostname, method);
            const storedAccount = storedPermission && storedPermission.account
                ? (window.gravity_accounts || []).find((account) => account.name === storedPermission.account)
                : null;
            const explicitRequestedAccount = [
                params && params.account,
                params && params.username,
                params && params.voter,
                params && params.from,
                params && params.author
            ].find(Boolean);
            const requestedAccountDiffers = !!(
                storedAccount &&
                explicitRequestedAccount &&
                String(explicitRequestedAccount).toLowerCase() !== String(storedAccount.name).toLowerCase()
            );
            if (!silentMethods.includes(method)) {
                if (storedAccount && !requestedAccountDiffers) {
                    gwdbg('bridge:skip-overlay-stored-permission', {
                        id,
                        method,
                        account: storedAccount.name
                    });
                    sendToNative(storedAccount.name);
                    return;
                }
                gwdbg('bridge:show-overlay', { id, method });
                showAuthOverlay(method, params, sendToNative, reject);
            } else {
                gwdbg('bridge:silent-request', { id, method });
                sendToNative();
            }
        });
    };

    // 2. The In-Page UI that replaces the native modal
    const showAuthOverlay = (method, params, onApprove, onReject) => {
        const accounts = window.gravity_accounts || [];
        const storedPermission = getStoredPermission(window.location.hostname, method);
        const preferredAccountNames = [
            storedPermission && storedPermission.account,
            params && params.account,
            params && params.username,
            params && params.voter,
            params && params.from,
            params && params.author
        ]
            .filter(Boolean)
            .map((value) => String(value).toLowerCase());
        gwdbg('overlay:open', {
            method,
            accountCount: accounts.length,
            hostname: window.location.hostname
        });
        const overlay = document.createElement('div');
        overlay.id = 'gravity-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: '2147483647',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            overflowY: 'auto', WebkitOverflowScrolling: 'touch',
            boxSizing: 'border-box', padding: 'max(16px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom))',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain'
        });
        
        const card = document.createElement('div');
        Object.assign(card.style, {
            backgroundColor: '#121212', padding: '24px', borderRadius: '24px',
            width: '100%', maxWidth: '360px', border: '1px solid #333',
            textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', color: 'white',
            touchAction: 'manipulation',
            pointerEvents: 'auto'
        });
        
        const accountItems = accounts.length > 0
            ? accounts.map((a, index) => `
                <button
                    type="button"
                    data-account="${a.name}"
                    data-selected="${index === 0 ? 'true' : 'false'}"
                    style="width: 100%; text-align: left; padding: 12px 14px; border-radius: 12px; border: 1px solid ${index === 0 ? '#2563eb' : '#334155'}; background: ${index === 0 ? 'rgba(37,99,235,0.18)' : '#111827'}; color: white; display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 13px; font-weight: 700;"
                >
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">@${a.name}</span>
                    <span style="flex-shrink: 0; font-size: 11px; color: #94a3b8;">${a.chain}</span>
                </button>
            `).join('')
            : `<div style="padding: 12px 14px; border-radius: 12px; border: 1px solid #334155; background: #111827; color: #94a3b8; font-size: 13px;">No accounts in wallet</div>`;

        card.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="width: 60px; height: 60px; background: #6366f1; border-radius: 18px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px;">G</div>
                <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">Authorization</h2>
                <p style="margin: 8px 0 0; color: #888; font-size: 13px;">${window.location.hostname} requests <b>${method}</b></p>
            </div>
            
            <div style="text-align: left; margin-bottom: 24px; background: #1a1a1a; padding: 16px; border-radius: 16px; border: 1px solid #222;">
                <label style="display: block; font-size: 10px; color: #666; font-weight: 900; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px;">Confirm with Account</label>
                <button id="grav-acc-toggle" type="button" style="width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 13px; font-weight: 700; text-align: left;"></button>
                <div id="grav-acc-list" style="display: none; flex-direction: column; gap: 10px; margin-top: 10px;">${accountItems}</div>
                <div id="grav-acc-preview" style="margin-top: 10px; font-size: 12px; color: #cbd5e1; background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 10px 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></div>
            </div>

            <div style="text-align: left; margin-bottom: 24px; background: linear-gradient(180deg, rgba(37,99,235,0.16), rgba(15,23,42,0.42)); padding: 16px; border-radius: 16px; border: 1px solid rgba(96,165,250,0.25);">
                <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
                    <input id="grav-remember" type="checkbox" style="margin-top: 2px; accent-color: #6366f1;">
                    <div>
                        <div style="font-size: 13px; color: white; font-weight: 700; margin-bottom: 2px;">Remember this permission</div>
                        <div style="font-size: 11px; color: #94a3b8; line-height: 1.45;">Auto-approve future requests from this site for the selected duration.</div>
                    </div>
                </label>
                <div id="grav-duration-wrap" style="display: none; margin-top: 14px;">
                    <div style="font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Duration</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                        <button type="button" data-duration="1day" style="padding: 10px 8px; border-radius: 10px; border: 1px solid #334155; background: #2563eb; color: white; font-size: 12px; font-weight: 700;">1 day</button>
                        <button type="button" data-duration="1week" style="padding: 10px 8px; border-radius: 10px; border: 1px solid #334155; background: #111827; color: #cbd5e1; font-size: 12px; font-weight: 700;">1 week</button>
                        <button type="button" data-duration="1month" style="padding: 10px 8px; border-radius: 10px; border: 1px solid #334155; background: #111827; color: #cbd5e1; font-size: 12px; font-weight: 700;">1 month</button>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 12px;">
                <button id="grav-cancel" style="flex: 1; padding: 16px; border-radius: 14px; border: none; background: #222; color: #999; font-weight: 700; cursor: pointer;">Cancel</button>
                <button id="grav-confirm" style="flex: 1; padding: 16px; border-radius: 14px; border: none; background: #6366f1; color: white; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);">Confirm</button>
            </div>
        `;

        overlay.appendChild(card);
        document.body.appendChild(overlay);
        window.__gravityOverlayOpen = true;

        const previewEl = card.querySelector('#grav-acc-preview');
        const toggleEl = card.querySelector('#grav-acc-toggle');
        const listEl = card.querySelector('#grav-acc-list');
        const rememberEl = card.querySelector('#grav-remember');
        const durationWrapEl = card.querySelector('#grav-duration-wrap');
        const confirmButton = card.querySelector('#grav-confirm');
        const cancelButton = card.querySelector('#grav-cancel');
        const initialAccount = accounts.find((account) => preferredAccountNames.includes(account.name.toLowerCase())) || accounts[0];
        let selectedAccount = initialAccount ? initialAccount.name : '';
        let selectedDuration = '1day';
        let isSubmitting = false;

        const cleanupOverlay = () => {
            window.__gravityOverlayOpen = false;
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        };

        const bindTap = (element, handler) => {
            if (!element) return;
            let touched = false;
            element.addEventListener('touchend', (event) => {
                event.preventDefault();
                event.stopPropagation();
                touched = true;
                handler(event);
                setTimeout(() => {
                    touched = false;
                }, 220);
            }, { passive: false });
            element.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (touched) return;
                handler(event);
            });
        };

        const updateAccountPreview = () => {
            const current = accounts.find((account) => account.name === selectedAccount);
            toggleEl.textContent = current ? `@${current.name} · ${current.chain}` : 'Choose account';
            previewEl.textContent = current ? `Selected: @${current.name} on ${current.chain}` : '(No account selected)';
            previewEl.title = previewEl.textContent;
        };
        updateAccountPreview();

        bindTap(toggleEl, () => {
            listEl.style.display = listEl.style.display === 'none' ? 'flex' : 'none';
        });

        card.querySelectorAll('[data-account]').forEach((button) => {
            bindTap(button, () => {
                selectedAccount = button.getAttribute('data-account') || '';
                card.querySelectorAll('[data-account]').forEach((candidate) => {
                    const isActive = candidate.getAttribute('data-account') === selectedAccount;
                    candidate.style.borderColor = isActive ? '#2563eb' : '#334155';
                    candidate.style.background = isActive ? 'rgba(37,99,235,0.18)' : '#111827';
                });
                updateAccountPreview();
                listEl.style.display = 'none';
            });
        });

        rememberEl.addEventListener('change', () => {
            durationWrapEl.style.display = rememberEl.checked ? 'block' : 'none';
        });
        bindTap(rememberEl.closest('label'), () => {
            rememberEl.checked = !rememberEl.checked;
            durationWrapEl.style.display = rememberEl.checked ? 'block' : 'none';
        });

        card.querySelectorAll('[data-duration]').forEach((button) => {
            bindTap(button, () => {
                selectedDuration = button.getAttribute('data-duration');
                card.querySelectorAll('[data-duration]').forEach((candidate) => {
                    const isActive = candidate.getAttribute('data-duration') === selectedDuration;
                    candidate.style.background = isActive ? '#2563eb' : '#111827';
                    candidate.style.color = isActive ? 'white' : '#cbd5e1';
                });
            });
        });

        bindTap(cancelButton, () => {
            gwdbg('overlay:cancel', { method });
            cleanupOverlay();
            onReject('User cancelled');
        });
        bindTap(confirmButton, () => {
            if (isSubmitting) return;
            isSubmitting = true;
            confirmButton.style.opacity = '0.72';
            confirmButton.textContent = '...';
            const acc = selectedAccount;
            const rememberDuration = rememberEl.checked ? selectedDuration : undefined;
            gwdbg('overlay:confirm', { method, account: acc || null, rememberDuration: rememberDuration || null });
            if (acc && rememberDuration) {
                rememberPermission(window.location.hostname, method, acc, rememberDuration);
            }
            setTimeout(() => {
                cleanupOverlay();
                onApprove(acc, rememberDuration);
            }, 40);
        });
    };

    // 3. The API Wrapper that mimics Hive Keychain
    const wrapKeychain = (promise, callback) => {
        return promise.then(res => {
            const formatted = formatBridgeResult(res);
            gwdbg('provider:wrapped-success', {
                id: formatted.id,
                success: formatted.success,
                hasResult: !!formatted.result,
                hasPublicKey: !!formatted.publicKey
            });
            if (typeof callback === 'function') callback(formatted);
            emitBridgeResponse(formatted);
            return formatted;
        }).catch(err => {
            const formattedError = formatBridgeResult({ success: false, error: err, result: null });
            gwdbg('provider:wrapped-error', {
                id: formattedError.id,
                error: formattedError.error
            });
            if (typeof callback === 'function') callback(formattedError);
            emitBridgeResponse(formattedError);
            return formattedError;
        });
    };

    const normalizeOptionalCallback = (maybeType, maybeCallback) => {
        if (typeof maybeType === 'function') {
            return { type: undefined, callback: maybeType };
        }
        return { type: maybeType, callback: maybeCallback };
    };

    const CHAIN_RPCS = {
        HIVE: 'https://api.hive.blog',
        BLURT: 'https://rpc.drakernoise.com',
        STEEM: 'https://api.steemit.com'
    };

    const detectChainFromHost = () => {
        const host = (window.location.hostname || '').toLowerCase();
        if (host.includes('blurt')) return 'BLURT';
        if (host.includes('steem')) return 'STEEM';
        return 'HIVE';
    };

    const sendGravityRequest = (method, params, callback, chainHint) => {
        const withChainHint = (payload) => ({
            ...payload,
            requestChain: chainHint || undefined
        });

        const requestMap = {
            requestTransfer: () => requestNative('transfer', withChainHint({
                username: params[0],
                to: params[1],
                amount: params[2],
                memo: params[3],
                symbol: params[4]
            })),
            requestVote: () => requestNative('vote', withChainHint({
                username: params[0],
                permlink: params[1],
                author: params[2],
                weight: params[3]
            })),
            requestPost: () => requestNative('post', withChainHint({
                username: params[0],
                title: params[1],
                body: params[2],
                parent_perm: params[3],
                parent_author: params[4],
                json_metadata: params[5],
                permlink: params[6]
            })),
            requestCustomJson: () => requestNative('custom_json', withChainHint({
                username: params[0],
                id: params[1],
                type: params[2],
                json: params[3],
                display_msg: params[4]
            })),
            requestBroadcast: () => requestNative('requestBroadcast', withChainHint({
                username: params[0],
                operations: params[1],
                type: params[2]
            })),
            requestSignBuffer: () => requestNative('requestSignBuffer', withChainHint({
                username: params[0],
                message: params[1],
                type: params[2]
            })),
            requestAddAccount: () => requestNative('requestAddAccount', withChainHint({
                username: params[0],
                keys: params[1]
            })),
            requestEncodeMessage: () => requestNative('requestEncodeMessage', withChainHint({
                username: params[0],
                receiver: params[1],
                message: params[2],
                type: params[3]
            })),
            requestDecodeMessage: () => requestNative('requestDecodeMessage', withChainHint({
                username: params[0],
                receiver: params[1],
                message: params[2],
                type: params[3]
            }))
        };

        const requestFn = requestMap[method];
        if (!requestFn) {
            gwdbg('provider:unsupported-method', { method });
            const unsupported = Promise.resolve(formatBridgeResult({
                success: false,
                error: `Unsupported method: ${method}`
            }));
            return wrapKeychain(unsupported, callback);
        }

        gwdbg('provider:send', { method, argCount: params ? params.length : 0, chainHint: chainHint || null });
        return wrapKeychain(requestFn(), callback);
    };

    const createProvider = (chainHint) => {
        const provider = {
            isKeychain: true,
            name: 'Gravity',
            version: '1.0.5',
            chainHint: chainHint || 'HIVE',
            current_rpc: CHAIN_RPCS[chainHint || 'HIVE'],
            requestHandshake(appIdOrCallback, callback) {
                const actualCallback = typeof appIdOrCallback === 'function' ? appIdOrCallback : callback;
                const response = {
                    success: true,
                    message: 'Handshake successful',
                    version: this.version,
                    name: this.name,
                    rpc: this.current_rpc
                };
                if (typeof actualCallback === 'function') {
                    setTimeout(() => actualCallback(response), 0);
                    return;
                }
                return Promise.resolve(response);
            },
            send(method, params, callback) {
                return sendGravityRequest(method, params, callback, chainHint);
            },
            requestTransfer(username, to, amount, memo, currency, callback, enforceEndpoint) {
                return sendGravityRequest('requestTransfer', [username, to, amount, memo, currency, enforceEndpoint], callback, chainHint);
            },
            requestVote(username, permlink, author, weight, callback) {
                return sendGravityRequest('requestVote', [username, permlink, author, weight], callback, chainHint);
            },
            requestPost(username, title, body, parentPerm, parentAuthor, jsonMetadata, permlink, commentOptions, callback) {
                const actualCallback = typeof commentOptions === 'function' ? commentOptions : callback;
                return sendGravityRequest('requestPost', [username, title, body, parentPerm, parentAuthor, jsonMetadata, permlink], actualCallback, chainHint);
            },
            requestCustomJson(username, id, key, json, displayMsg, callback) {
                return sendGravityRequest('requestCustomJson', [username, id, key, json, displayMsg], callback, chainHint);
            },
            requestSignBuffer(username, message, key, callback) {
                return sendGravityRequest('requestSignBuffer', [username, message, key], callback, chainHint);
            },
            requestVerifyKey(username, message, key, callback) {
                return sendGravityRequest('requestSignBuffer', [username, message, key], callback, chainHint);
            },
            requestBroadcast(username, operations, key, callback) {
                return sendGravityRequest('requestBroadcast', [username, operations, key], callback, chainHint);
            },
            requestSignTx(username, operations, key, callback) {
                return sendGravityRequest('requestBroadcast', [username, operations, key], callback, chainHint);
            },
            requestAddAccount(username, keys, callback) {
                return sendGravityRequest('requestAddAccount', [username, keys], callback, chainHint);
            },
            requestEncodeMessage(username, receiver, message, key, callback) {
                return sendGravityRequest('requestEncodeMessage', [username, receiver, message, key], callback, chainHint);
            },
            requestDecodeMessage(username, receiver, message, key, callback) {
                return sendGravityRequest('requestDecodeMessage', [username, receiver, message, key], callback, chainHint);
            },
            requestSignedCall(account, method, params, key, callback) {
                return sendGravityRequest('requestSignedCall', [account, method, params, key], callback, chainHint);
            },
            requestRpc(callback) {
                const response = { rpc: this.current_rpc };
                if (typeof callback === 'function') {
                    callback(response);
                    return;
                }
                return Promise.resolve(response);
            },
            requestSwitchRpc(rpc, callback) {
                this.current_rpc = rpc;
                const response = { success: true, message: 'RPC switch requested' };
                if (typeof callback === 'function') {
                    callback(response);
                    return;
                }
                return Promise.resolve(response);
            }
        };

        return new Proxy(provider, {
            get(target, prop, receiver) {
                if (prop in target) return Reflect.get(target, prop, receiver);
                return undefined;
            }
        });
    };

    const defaultChain = detectChainFromHost();
    const defaultProvider = createProvider(defaultChain);
    const hiveProvider = defaultProvider;
    const blurtProvider = defaultProvider;
    const steemProvider = defaultProvider;

    const dispatchHandshakeEvents = () => {
        gwdbg('handshake:dispatch', {
            href: window.location.href,
            chain: defaultChain,
            aliases: ['hive_keychain_handshake', 'whalevault_handshake', 'steem_keychain_handshake', 'blurt_keychain_handshake']
        });

        const events = {
            hive_keychain_handshake: { keychain: defaultProvider, name: defaultProvider.name, version: defaultProvider.version },
            steem_keychain_handshake: { keychain: defaultProvider, name: defaultProvider.name, version: defaultProvider.version },
            blurt_keychain_handshake: { keychain: defaultProvider, name: defaultProvider.name, version: defaultProvider.version },
            whalevault_handshake: { keychain: defaultProvider, name: defaultProvider.name, version: defaultProvider.version }
        };

        Object.entries(events).forEach(([eventName, detail]) => {
            window.dispatchEvent(new CustomEvent(eventName, { detail }));
            document.dispatchEvent(new CustomEvent(eventName, { detail }));
        });
    };

    // 4. Injected Objects for Condenser
    const injectGlobalStyles = () => {
        if (document.getElementById('gravity-bridge-styles')) return;
        const style = document.createElement('style');
        style.id = 'gravity-bridge-styles';
        style.textContent = `
            #gravity-pull-indicator {
                position: fixed;
                top: max(env(safe-area-inset-top), 8px);
                left: 50%;
                transform: translate(-50%, -120%);
                background: rgba(15, 23, 42, 0.92);
                color: #e2e8f0;
                border: 1px solid rgba(99, 102, 241, 0.35);
                border-radius: 999px;
                padding: 8px 14px;
                font: 700 12px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                z-index: 2147483646;
                transition: transform 160ms ease, opacity 160ms ease;
                opacity: 0;
                pointer-events: none;
            }
            #gravity-pull-indicator[data-visible="true"] {
                transform: translate(-50%, 0);
                opacity: 1;
            }
            #gravity-browser-bar {
                position: fixed;
                top: max(env(safe-area-inset-top), 0px);
                left: 0;
                right: 0;
                z-index: 2147483646;
                background: rgba(2, 6, 23, 0.96);
                color: white;
                border-bottom: 1px solid rgba(96, 165, 250, 0.18);
                box-shadow: 0 16px 40px rgba(15, 23, 42, 0.22);
                padding: 10px 12px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                pointer-events: auto;
                isolation: isolate;
            }
            #gravity-browser-bar[data-open="true"] {
                padding-bottom: 12px;
            }
            #gravity-browser-bar-shell {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #gravity-browser-address {
                min-width: 0;
                flex: 1;
                width: auto;
                box-sizing: border-box;
                border-radius: 14px;
                border: 1px solid #334155;
                background: #0f172a;
                color: white;
                padding: 11px 13px;
                font: 600 13px/1.3 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                pointer-events: auto;
                touch-action: manipulation;
                user-select: text;
                -webkit-user-select: text;
            }
            #gravity-browser-bar button {
                border: none;
                border-radius: 12px;
                width: 42px;
                height: 42px;
                padding: 0;
                background: #1e293b;
                color: white;
                font: 900 17px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                flex-shrink: 0;
            }
            #gravity-browser-bar button[data-primary="true"] {
                background: #2563eb;
            }
            #gravity-browser-bar button[data-active="true"] {
                background: #0f766e;
            }
            #gravity-launch-indicator {
                position: fixed;
                top: calc(max(env(safe-area-inset-top), 10px) + 58px);
                right: 12px;
                z-index: 2147483644;
                background: rgba(15, 23, 42, 0.88);
                color: #e2e8f0;
                border: 1px solid rgba(148, 163, 184, 0.25);
                border-radius: 999px;
                padding: 7px 11px;
                font: 700 11px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
        `;
        document.documentElement.appendChild(style);
    };

    const ensureBrowserChrome = () => {
        if (document.getElementById('gravity-browser-bar')) return;

        const bar = document.createElement('div');
        bar.id = 'gravity-browser-bar';
        bar.innerHTML = `
            <div id="gravity-browser-bar-shell">
                <input id="gravity-browser-address" type="text" value="" spellcheck="false" autocapitalize="none" autocomplete="off" />
                <button type="button" data-action="desktop" aria-label="Desktop mode">PC</button>
                <button type="button" data-action="go" data-primary="true" aria-label="Go">→</button>
                <button type="button" data-action="reload" aria-label="Reload">↻</button>
            </div>
        `;

        let isEditingAddress = false;
        let pendingAddressValue = '';
        const updateAddress = () => {
            const input = bar.querySelector('#gravity-browser-address');
            if (isEditingAddress) return;
            input.value = window.location.href;
        };
        updateAddress();
        window.addEventListener('hashchange', updateAddress);
        window.addEventListener('popstate', updateAddress);
        setInterval(updateAddress, 1200);

        const input = bar.querySelector('#gravity-browser-address');
        const desktopButton = bar.querySelector('[data-action="desktop"]');
        const syncDesktopButton = () => {
            if (!desktopButton) return;
            const enabled = isDesktopModeEnabled();
            desktopButton.setAttribute('data-active', enabled ? 'true' : 'false');
            desktopButton.title = enabled ? 'Desktop mode on' : 'Desktop mode off';
        };
        syncDesktopButton();
        input.addEventListener('focus', () => {
            isEditingAddress = true;
            pendingAddressValue = input.value || '';
            setTimeout(() => {
                try {
                    input.select();
                } catch (e) {}
            }, 80);
        });
        input.addEventListener('input', () => {
            pendingAddressValue = input.value || '';
        });
        input.addEventListener('blur', () => {
            setTimeout(() => {
                isEditingAddress = false;
                updateAddress();
            }, 180);
        });
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const goButton = bar.querySelector('[data-action="go"]');
                if (goButton) goButton.click();
            }
        });

        bar.addEventListener('click', (event) => {
            const action = event.target && event.target.getAttribute ? event.target.getAttribute('data-action') : null;
            if (!action) return;
            if (action === 'reload') {
                if (window.mobileApp && typeof window.mobileApp.postMessage === 'function') {
                    window.mobileApp.postMessage({ detail: { type: 'gravity_reload_request' } });
                } else {
                    window.location.reload();
                }
                return;
            }
            if (action === 'desktop') {
                const nextEnabled = !isDesktopModeEnabled();
                setDesktopModeEnabled(nextEnabled);
                applyDesktopMode();
                syncDesktopButton();
                showInAppToast(nextEnabled ? 'Desktop mode enabled' : 'Desktop mode disabled');
                setTimeout(() => {
                    if (window.mobileApp && typeof window.mobileApp.postMessage === 'function') {
                        window.mobileApp.postMessage({ detail: { type: 'gravity_reload_request' } });
                    } else {
                        window.location.reload();
                    }
                }, 120);
                return;
            }
            if (action === 'go') {
                let nextUrl = (pendingAddressValue || input.value || '').trim();
                if (!nextUrl) return;
                if (!/^https?:\/\//i.test(nextUrl)) {
                    nextUrl = nextUrl.includes('.') ? `https://${nextUrl}` : `https://www.google.com/search?q=${encodeURIComponent(nextUrl)}`;
                }
                isEditingAddress = false;
                gwdbg('browser-chrome:navigate', { nextUrl });
                if (window.mobileApp && typeof window.mobileApp.postMessage === 'function') {
                    window.mobileApp.postMessage({ detail: { type: 'gravity_navigate_request', url: nextUrl } });
                } else {
                    window.location.href = nextUrl;
                }
            }
        });

        document.documentElement.style.scrollPaddingTop = '76px';
        document.body.style.paddingTop = '64px';
        document.body.appendChild(bar);
    };

    const ensureLaunchIndicator = () => {
        if (document.getElementById('gravity-launch-indicator')) return;
        const indicator = document.createElement('div');
        indicator.id = 'gravity-launch-indicator';
        indicator.textContent = 'Loading page...';
        document.body.appendChild(indicator);
        setTimeout(() => {
            if (indicator.parentNode) indicator.parentNode.removeChild(indicator);
        }, 6000);
    };

    const repairVerticalScroll = () => {
        try {
            const htmlStyle = window.getComputedStyle(document.documentElement);
            const bodyStyle = window.getComputedStyle(document.body);
            const pageOverflows = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight
            ) > window.innerHeight + 24;
            const htmlClipped = htmlStyle.overflowY === 'hidden' || htmlStyle.overflowY === 'clip';
            const bodyClipped = bodyStyle.overflowY === 'hidden' || bodyStyle.overflowY === 'clip';

            if (pageOverflows && (htmlClipped || bodyClipped)) {
                gwdbg('scroll:repair', {
                    htmlOverflowY: htmlStyle.overflowY,
                    bodyOverflowY: bodyStyle.overflowY
                });
                document.documentElement.style.overflowY = 'auto';
                document.body.style.overflowY = 'auto';
                document.documentElement.style.webkitOverflowScrolling = 'touch';
                document.body.style.webkitOverflowScrolling = 'touch';
            }
        } catch (e) {}
    };

    const installFocusVisibilityFix = () => {
        if (window.__gravityFocusVisibilityFixActive) return;
        window.__gravityFocusVisibilityFixActive = true;

        const applyViewportCompensation = () => {
            try {
                const viewport = window.visualViewport;
                if (!viewport) return;
                const keyboardInset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
                const extraBottom = keyboardInset > 120 ? keyboardInset + 24 : 0;
                document.documentElement.style.setProperty('--gravity-keyboard-inset', `${extraBottom}px`);
                document.body.style.paddingBottom = extraBottom ? `${extraBottom}px` : '';
            } catch (e) {}
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', applyViewportCompensation);
            window.visualViewport.addEventListener('scroll', applyViewportCompensation);
            applyViewportCompensation();
        }

        document.addEventListener('focusin', (event) => {
            const target = event.target;
            if (!target || typeof target.scrollIntoView !== 'function') return;
            const tagName = target.tagName ? target.tagName.toLowerCase() : '';
            const isEditable =
                tagName === 'input' ||
                tagName === 'textarea' ||
                tagName === 'select' ||
                target.isContentEditable;
            if (!isEditable) return;

            repairVerticalScroll();
            [180, 420, 700].forEach((delay) => {
                setTimeout(() => {
                    try {
                        target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
                    } catch (e) {}
                }, delay);
            });
        }, true);

        document.addEventListener('focusout', () => {
            setTimeout(() => {
                try {
                    const active = document.activeElement;
                    const activeTag = active && active.tagName ? active.tagName.toLowerCase() : '';
                    const stillEditable = active && (
                        activeTag === 'input' ||
                        activeTag === 'textarea' ||
                        activeTag === 'select' ||
                        active.isContentEditable
                    );
                    if (!stillEditable) {
                        document.body.style.paddingBottom = '';
                    }
                } catch (e) {}
            }, 160);
        }, true);
    };

    const enablePullToRefresh = () => {
        if (window.__gravityPullToRefreshActive) return;
        window.__gravityPullToRefreshActive = true;

        const indicator = document.createElement('div');
        indicator.id = 'gravity-pull-indicator';
        indicator.textContent = 'Pull to refresh';
        document.body.appendChild(indicator);

        let startY = 0;
        let dragging = false;
        let triggered = false;

        const resetIndicator = () => {
            indicator.dataset.visible = 'false';
            indicator.textContent = 'Pull to refresh';
            dragging = false;
            triggered = false;
        };

        document.addEventListener('touchstart', (event) => {
            if (window.__gravityOverlayOpen) return;
            if ((window.scrollY || document.documentElement.scrollTop || 0) > 0) return;
            if (!event.touches || !event.touches[0]) return;
            startY = event.touches[0].clientY;
            dragging = true;
            triggered = false;
        }, { passive: true });

        document.addEventListener('touchmove', (event) => {
            if (window.__gravityOverlayOpen) return;
            if (!dragging || !event.touches || !event.touches[0]) return;
            const deltaY = event.touches[0].clientY - startY;
            if (deltaY < 48) {
                indicator.dataset.visible = 'false';
                return;
            }
            indicator.dataset.visible = 'true';
            indicator.textContent = deltaY > 160 ? 'Release to refresh' : 'Pull to refresh';
            triggered = deltaY > 160;
        }, { passive: true });

        document.addEventListener('touchend', () => {
            if (window.__gravityOverlayOpen) return;
            if (triggered) {
                indicator.dataset.visible = 'true';
                indicator.textContent = 'Refreshing...';
                gwdbg('pull-to-refresh:trigger');
                if (window.mobileApp && typeof window.mobileApp.postMessage === 'function') {
                    window.mobileApp.postMessage({ detail: { type: 'gravity_reload_request' } });
                } else {
                    window.location.reload();
                }
                setTimeout(resetIndicator, 1200);
                return;
            }
            resetIndicator();
        }, { passive: true });
    };

    const inject = () => {
        injectGlobalStyles();
        applyDesktopMode();
        ensureLaunchIndicator();
        ensureBrowserChrome();
        installFocusVisibilityFix();
        repairVerticalScroll();
        gwdbg('inject:start', {
            chain: defaultChain,
            hasHiveKeychain: !!window.hive_keychain,
            hasBlurtKeychain: !!window.blurt_keychain,
            hasGravity: !!window.gravity
        });
        const injections = {
            gravity: defaultProvider,
            hive_keychain: defaultProvider,
            steem_keychain: defaultProvider,
            blurt_keychain: defaultProvider,
            whalevault: defaultProvider,
            blurt: defaultProvider
        };

        Object.entries(injections).forEach(([key, value]) => {
            if (!window[key] || typeof window[key].requestHandshake !== 'function') {
                try {
                    Object.defineProperty(window, key, {
                        value,
                        writable: true,
                        configurable: true
                    });
                    console.log(`[GravityBridge] Injected ${key}`);
                } catch (e) {
                    window[key] = value;
                }
            }
        });

        window._gravityProvider = defaultProvider;

        // Condenser specifically looks for window.mobile_app
        if (!window.mobile_app) {
            window.mobile_app = true;
            console.log('[GravityBridge] Injected mobile_app flag');
        }
        gwdbg('inject:done', {
            chain: defaultChain,
            hasHiveKeychain: !!window.hive_keychain,
            hasBlurtKeychain: !!window.blurt_keychain,
            hasGravity: !!window.gravity,
            mobileAppFlag: !!window.mobile_app
        });
    };

    // 5. Early and Persistent Injection
    inject();
    enablePullToRefresh();

    const notify = () => {
        window.dispatchEvent(new CustomEvent('hive_keychain_ready'));
        document.dispatchEvent(new CustomEvent('hive_keychain_ready'));
        window.postMessage({ type: 'keychain_ready' }, '*');
    };

    const reinject = () => {
        inject();
        dispatchHandshakeEvents();
        notify();
        repairVerticalScroll();
    };

    dispatchHandshakeEvents();
    notify();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', reinject, { once: true });
    }
    window.addEventListener('load', reinject, { once: true });
    [100, 500, 1000, 2000].forEach((delay) => setTimeout(reinject, delay));

    console.log('[GravityBridge] Bridge standard initialized v1.0.5');
})();
