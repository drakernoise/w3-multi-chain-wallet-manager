
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

// Manual Injection Strategy DISABLED
// We rely on Manifest V3 world: "MAIN" injection which is cleaner and doesn't cause React Hydration errors.
// const injectScript = () => { ... }


// Listen for async responses from Background (User Signed/Rejected)
chrome.runtime.onMessage.addListener((msg: any, _sender: any, _sendResponse: any) => {
    if (msg.type === 'gravity_response') {
        window.postMessage(msg, '*');
    }
});

// Manual injection is no longer needed as we use Manifest V3 world: "MAIN" with raw file.
