const fs = require('fs');
const path = require('path');

const vendorPath = path.join(__dirname, '../dist/assets/vendor.js');

const POLYFILL = 'var window = window || self; var global = global || self; ';

function patch(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (!content.startsWith('var window')) {
                fs.writeFileSync(filePath, POLYFILL + content);
                console.log(`Successfully patched ${filePath}`);
            } else {
                console.log(`Already patched ${filePath}`);
            }
        } else {
            console.error(`File not found: ${filePath}`);
        }
    } catch (e) {
        console.error(`Error patching ${filePath}:`, e);
    }
}

// Find the vendor file (might have hash if configuration changed, but we set fixed names)
// We set chunkFileNames: 'assets/[name].js', so it should be vendor.js
patch(vendorPath);
