const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../dist/assets/vendor.js');

try {
    const content = fs.readFileSync(filePath, 'utf8');
    // We search for "eval(" but exclude things like "eval = " (assignments) if possible, 
    // though strict mode forbids assigning to eval.
    // We mainly care about function calls.

    // Simple check
    if (content.includes('eval(')) {
        console.log("WARNING: eval() DETECTED!");
        let pos = 0;
        while ((pos = content.indexOf('eval(', pos)) !== -1) {
            console.log(`Match at ${pos}:`);
            console.log(content.substring(Math.max(0, pos - 50), Math.min(content.length, pos + 50)));
            console.log('---');
            pos += 5;
        }
    } else {
        console.log("SUCCESS: No 'eval(' function calls found in vendor.js");
    }
} catch (e) {
    console.log("Error reading file: " + e.message);
}
