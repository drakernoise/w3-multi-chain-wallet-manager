
// Content Script
// Acts as a bridge between the Page Script (provider.ts) and the Extension Background

declare var chrome: any;

// Listen for messages from the page (provider.ts)
window.addEventListener('message', (event) => {
    // Security check: Accept checks only from same window
    if (event.source !== window || !event.data || event.data.type !== 'gravity_request') {
        return;
    }

    // Forward to background script
    chrome.runtime.sendMessage(event.data, (response: any) => {
        // Only handle immediate responses (like handshake or errors)
        if (response && response.pending !== true) {
            window.postMessage({
                type: 'gravity_response',
                id: event.data.id,
                response: response
            }, '*');
        }
    });
});

// Manual Injection Strategy (Backup for Manifest Injection)
// This ensures that even if Rocket Loader or other scripts interfere, we have a second vector of injection.
const injectScript = () => {
    try {
        const container = document.head || document.documentElement;
        if (!container) return; // Should not happen at document_start but good safety

        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('assets/provider.js');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('async', 'false'); // Force synchronous-like execution if possible
        script.onload = function () {
            // console.log("Gravity: Provider script injected via DOM");
            (this as any).remove();
        };
        container.insertBefore(script, container.children[0]);
    } catch (e) {
        console.error('Gravity: Injection failed', e);
    }
};

injectScript();

// Listen for async responses from Background (User Signed/Rejected)
chrome.runtime.onMessage.addListener((msg: any, _sender: any, _sendResponse: any) => {
    if (msg.type === 'gravity_response') {
        window.postMessage(msg, '*');
    }
});

// Manual injection is no longer needed as we use Manifest V3 world: "MAIN" with raw file.
