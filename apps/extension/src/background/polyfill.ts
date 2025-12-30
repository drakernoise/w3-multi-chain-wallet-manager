if (typeof globalThis.WebSocket === 'undefined') {
    (globalThis as any).WebSocket = class DummyWebSocket {
        constructor() { console.warn("Gravity: DummyWebSocket instantiated in Background"); }
        close() { }
        send() { }
        addEventListener() { }
        removeEventListener() { }
    };
    console.log("Gravity: WebSocket Polyfill Applied (Success)");
}

// Polyfill for libs expecting 'exports' or 'msgpack' quirks
(self as any).exports = {};
