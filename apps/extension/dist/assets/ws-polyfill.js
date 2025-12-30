console.log("Gravity: WS Polyfill Module Init");
if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = class DummyWebSocket {
        constructor() { console.warn("Gravity: DummyWebSocket (ESM)"); }
        close() {}
        send() {}
        addEventListener() {}
        removeEventListener() {}
    };
    globalThis.WebSocket.CONNECTING = 0;
    globalThis.WebSocket.OPEN = 1;
    globalThis.WebSocket.CLOSING = 2;
    globalThis.WebSocket.CLOSED = 3;
    console.log("Gravity: WS Polyfill APPLIED");
}
if (typeof window !== 'undefined') {
    window.global = window;
    if (!window.process) window.process = { env: { NODE_ENV: 'production' }, version: '' };
    
    // Panic Timer to detect frozen loading
    setTimeout(() => {
        const root = document.getElementById('root');
        if (root && root.innerHTML.trim() === '') {
             console.error("Gravity: LOADING STUCK - TIMEOUT");
             document.body.innerHTML = '<div style="background:#330000;color:#ff9999;padding:20px;font-family:sans-serif;">' +
             '<h2>Loading Timeout</h2>' +
             '<p>The application stopped responding during startup.</p>' + 
             '<p>This suggests a conflict in dependency loading.</p>' +
             '</div>';
        }
    }, 3000);
}
