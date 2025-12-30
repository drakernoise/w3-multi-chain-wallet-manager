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
if (typeof window === 'undefined') {
    globalThis.window = globalThis;
}
