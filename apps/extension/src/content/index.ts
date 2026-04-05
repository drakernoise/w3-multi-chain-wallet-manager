
// Content Script
// Acts as a bridge between the Page Script (provider.ts) and the Extension Background

declare var chrome: any;

// Inject healthy RPC info into the page context (runs in Isolated world, passes to Main via dataset)
chrome.storage.local.get(['gravity_active_nodes'], (res: any) => {
    if (res.gravity_active_nodes) {
        // We use dataset to avoid CSP "unsafe-inline" errors caused by <script> injection
        document.documentElement.dataset.gravityActiveRpc = JSON.stringify(res.gravity_active_nodes);
    }
});

// Listen for messages from the page (provider.ts)
window.addEventListener('message', (event) => {
    // Security check: Accept checks only from same window
    if (event.source !== window || !event.data) {
        return;
    }
    
    // Only process gravity requests
    if (event.data.type !== 'gravity_request') {
        return;
    }
    
    console.log('[Gravity Content] Received request:', event.data.method, event.data.id);
    console.log('[Gravity Content] Sending to background...');

    const postErrorToPage = (error: string) => {
        window.postMessage({
            type: 'gravity_response',
            id: event.data.id,
            response: {
                success: false,
                error
            }
        }, '*');
    };

    // Forward to background script
    try {
        chrome.runtime.sendMessage(event.data, (response: any) => {
            const lastError = chrome.runtime.lastError;
            if (lastError) {
                // Port might be closed if background is waking up or busy
                console.error('[Gravity Content] sendMessage FAILED:', lastError.message);
                postErrorToPage(lastError.message);
                return;
            }

            console.log('[Gravity Content] Got response from background:', response);

            // Only handle immediate responses (like handshake or errors)
            if (response && response.pending !== true) {
                window.postMessage({
                    type: 'gravity_response',
                    id: event.data.id,
                    response: response
                }, '*');
            }
        });
    } catch (error: any) {
        const message = error?.message || 'Failed to forward request to extension background.';
        console.error('[Gravity Content] sendMessage THREW:', message);
        postErrorToPage(message);
    }
});

// Manual Injection Strategy DISABLED
// We rely on Manifest V3 world: "MAIN" injection which is cleaner and doesn't cause React Hydration errors.
// const injectScript = () => { ... }


// Listen for async responses from Background (User Signed/Rejected)
chrome.runtime.onMessage.addListener((msg: any, _sender: any, sendResponse: any) => {
    console.log('[Gravity Content] Message from background:', msg.type);
    if (msg.type === 'gravity_response') {
        console.log('[Gravity Content] Posting response to page:', msg.id);
        window.postMessage(msg, '*');

        // Acknowledge receipt to avoid "message port closed before a response was received" error in background
        if (typeof sendResponse === 'function') {
            sendResponse({ ack: true });
        }
    }
    return false; // No async response needed from content to background
});

// Manual injection is no longer needed as we use Manifest V3 world: "MAIN" with raw file.
