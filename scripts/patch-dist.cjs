const fs = require('fs');
const path = require('path');

const extensionDist = path.join(__dirname, '../apps/extension/dist/assets');
const polyfillPath = path.join(extensionDist, 'ws-polyfill.js');

const POLYFILL_CODE = `
(function() {
    // Detect environment
    var globalScope = typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : {}));
    
    console.log("Gravity: WS Polyfill Init");

    // Polyfill WebSocket if missing
    if (typeof globalScope.WebSocket === 'undefined') {
        globalScope.WebSocket = class DummyWebSocket {
            constructor() { console.warn("Gravity: DummyWebSocket instantiated"); }
            close() {}
            send() {}
            addEventListener() {}
            removeEventListener() {}
        };
        // Add constants
        globalScope.WebSocket.CONNECTING = 0;
        globalScope.WebSocket.OPEN = 1;
        globalScope.WebSocket.CLOSING = 2;
        globalScope.WebSocket.CLOSED = 3;
        
        console.log("Gravity: WS Polyfill APPLIED to globalScope");
    }

    // Polyfill window if missing (essential for many libs)
    if (typeof globalScope.window === 'undefined') {
        globalScope.window = globalScope;
    }
    
    // Polyfill process if missing
    if (typeof globalScope.process === 'undefined') {
         globalScope.process = { env: { NODE_ENV: 'production' }, version: '' };
    }

    // Panic timer only for UI (where document exists)
    if (typeof document !== 'undefined') {
        setTimeout(() => {
            var root = document.getElementById('root');
            if (root && root.innerHTML.trim() === '') {
                 console.error("Gravity: LOADING STUCK - TIMEOUT");
                 document.body.innerHTML = '<div style="background:#330000;color:#ff9999;padding:20px;font-family:sans-serif;">' +
                 '<h2>Loading Timeout</h2>' +
                 '<p>Application hung during startup.</p>' + 
                 '<p>Check console for WebSocket/Buffer errors.</p>' +
                 '</div>';
            }
        }, 3000);
    }
})();
`;

try {
    if (fs.existsSync(extensionDist)) {
        fs.writeFileSync(polyfillPath, POLYFILL_CODE);
        console.log("Created ws-polyfill.js");

        const filesToPatch = ['background.js', 'main.js'];

        filesToPatch.forEach(file => {
            const filePath = path.join(extensionDist, file);
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                // Avoid double injection
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
