const fs = require('fs');
const path = require('path');

// Target the actual extension build output
const extensionDist = path.join(__dirname, '../apps/extension/dist/assets');

// Polyfill for Service Worker environment (WebSocket, Window, Global)
const WS_POLYFILL = `
if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = class DummyWebSocket {
        constructor() { console.warn("Gravity: DummyWebSocket instantiated (Patch)"); }
        close() {}
        send() {}
        addEventListener() {}
        removeEventListener() {}
    };
}
`;

const BASE_POLYFILL = 'var window = window || self; var global = global || self; var exports = exports || {}; ';
const FULL_POLYFILL = BASE_POLYFILL + WS_POLYFILL;

function patch(fileName) {
    const filePath = path.join(extensionDist, fileName);
    try {
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            // Check if already patched to avoid duplication
            if (!content.includes('DummyWebSocket')) {
                fs.writeFileSync(filePath, FULL_POLYFILL + "\n" + content);
                console.log(`Successfully patched ${fileName}`);
            } else {
                console.log(`Already patched ${fileName}`);
            }
        } else {
            // Optional: console.log(`File not found: ${fileName} (might be ok if build changed)`);
        }
    } catch (e) {
        console.error(`Error patching ${fileName}:`, e);
    }
}

// Patch critical files
patch('background.js');
patch('index.js');
patch('main.js');
patch('vendor.js'); // If it exists
