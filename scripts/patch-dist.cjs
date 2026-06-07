const fs = require('fs');
const path = require('path');

const browser = process.argv[2] || 'dist';
const folderName = browser === 'dist' ? 'dist' : `dist-${browser}`;
const extensionDist = path.join(__dirname, `../apps/extension/${folderName}/assets`);
const polyfillPath = path.join(extensionDist, 'ws-polyfill.js');

const LEGACY_BLURT_ENDPOINTS = [
    ['https://rpc.blurt.world', 'https://api.blurt.blog'],
    ['wss://rpc.blurt.world', 'wss://api.blurt.blog'],
    ['https://test.blurt.world/rpc', 'https://api.blurt.blog']
];

const replaceLegacyBlurtEndpoints = () => {
    const files = fs.readdirSync(extensionDist).filter((file) => file.endsWith('.js'));
    files.forEach((file) => {
        const filePath = path.join(extensionDist, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        LEGACY_BLURT_ENDPOINTS.forEach(([from, to]) => {
            if (content.includes(from)) {
                content = content.split(from).join(to);
                changed = true;
            }
        });

        if (changed) {
            fs.writeFileSync(filePath, content);
            console.log(`Replaced legacy Blurt endpoints in ${file}`);
        }
    });
};

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
        replaceLegacyBlurtEndpoints();

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
