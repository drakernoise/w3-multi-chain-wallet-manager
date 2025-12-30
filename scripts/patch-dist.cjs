const fs = require('fs');
const path = require('path');

const extensionDist = path.join(__dirname, '../apps/extension/dist/assets');
const polyfillPath = path.join(extensionDist, 'ws-polyfill.js');

const POLYFILL_CODE = `console.log("Gravity: WS Polyfill Module Init");
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
`;

try {
    if (fs.existsSync(extensionDist)) {
        // 1. Write the polyfill module
        fs.writeFileSync(polyfillPath, POLYFILL_CODE);
        console.log("Created ws-polyfill.js");

        // 2. Inject import into critical files
        const filesToPatch = ['background.js', 'main.js'];

        filesToPatch.forEach(file => {
            const filePath = path.join(extensionDist, file);
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                if (!content.includes('ws-polyfill.js')) {
                    const importStmt = "import './ws-polyfill.js';\n";
                    fs.writeFileSync(filePath, importStmt + content);
                    console.log(`Injected import into ${file}`);
                } else {
                    console.log(`${file} already imports polyfill`);
                }
            } else {
                console.warn(`${file} not found in assets (skipping)`);
            }
        });
    } else {
        console.warn("Dist folder not found: " + extensionDist);
    }
} catch (e) {
    console.error("Patch Error:", e);
    process.exit(1);
}
