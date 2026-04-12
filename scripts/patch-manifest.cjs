const fs = require('fs');
const path = require('path');

const browser = process.argv[2] || 'chrome';
const folderName = `dist-${browser}`;
const manifestPath = path.join(__dirname, `../apps/extension/${folderName}/manifest.json`);

try {
    if (!fs.existsSync(manifestPath)) {
        console.error("Manifest not found at: " + manifestPath);
        process.exit(1);
    }
    
    let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`Patching manifest for browser target: ${browser.toUpperCase()}`);

    if (browser === 'firefox') {
        // Change background worker from 'service_worker' to 'scripts' array
        if (manifest.background && manifest.background.service_worker) {
            manifest.background.scripts = [manifest.background.service_worker];
            delete manifest.background.service_worker;
        }

        // Add Gecko-specific extension ID requirement
        manifest.browser_specific_settings = {
            gecko: {
                id: "gravity@drakernoise.com",
                strict_min_version: "109.0"
            }
        };

        // Remove incompatible or unnecessary permissions for Firefox MV3
        if (manifest.permissions) {
            manifest.permissions = manifest.permissions.filter(p => !['offscreen', 'windows'].includes(p));
        }

        // Firefox strictly rejects the 'world' property in manifest.json content_scripts
        if (manifest.content_scripts) {
            manifest.content_scripts.forEach(script => {
                if (script.world) {
                    delete script.world;
                }
            });
        }
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`Successfully patched manifest.json for ${browser.toUpperCase()}`);

} catch (e) {
    console.error(`Failed to patch manifest.json:`, e);
    process.exit(1);
}
