const fs = require('fs');
const path = require('path');

const browser = process.argv[2] || 'chrome';
const folderName = `dist-${browser}`;
const extensionDist = path.join(__dirname, `../apps/extension/${folderName}`);

const UNUSED_ROOT_FILES = [
  '.syncmetadata',
  'bg-loader.js',
  'debug.js',
  'provider_raw.js',
  'construction_worker.png',
  'GravityHome.png',
  'GravityHomeG.png',
  'GravityHomeG_fixed.png',
  'GravityHome_fixed.png',
  'GravityLogin.png',
  'GravityLogin2.png',
  'GravityLogin2G.png',
  'GravityLogin2G_fixed.png',
  'GravityLogin2_fixed.png',
  'GravityLoginG.png',
  'GravityLoginG_fixed.png',
  'GravityLogin_fixed.png',
  'logowallet_backup.png',
  'logowallet_big.png',
  'promo_marquee_1400x560.png',
  'promo_tile_440x280.png'
];

try {
  if (!fs.existsSync(extensionDist)) {
    console.warn(`Extension dist folder not found: ${extensionDist}`);
    process.exit(0);
  }

  let removed = 0;

  for (const file of UNUSED_ROOT_FILES) {
    const target = path.join(extensionDist, file);
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
      removed += 1;
      console.log(`Removed unused extension asset: ${file}`);
    }
  }

  console.log(`Prune complete for ${folderName}. Removed ${removed} unused files.`);
} catch (error) {
  console.error('Failed to prune extension dist:', error);
  process.exit(1);
}
