# Release v1.0.4 - Blurt Production Ready

## 🎉 Major Milestone: Blurt Fully Functional

This release marks full compatibility with the Blurt blockchain ecosystem. All core features have been tested and verified across multiple frontends.

## ✨ New Features & Fixes

### Blurt Image Upload
- **Fixed:** JSON-serialized Buffer deserialization issue
- **Fixed:** Duplicate `ImageSigningChallenge` prefix handling
- **Status:** ✅ Working on BeBlurt, Blurt.blog, blurb, app.blurt.blog

### Blurt Power Delegation
- **Fixed:** Delegation operations now work correctly
- **Added:** Minimum delegation validation (35 BP minimum)
- **Status:** ✅ Working on BlurtWallet.com

### UI Improvements
- **Fixed:** Modal overflow issues on smaller screens
- **Updated:** PowerModal, ManageAccountModal, ImportModal with `max-h-[90vh]`
- **Status:** ✅ All modals now properly constrained

## 🧪 Tested Frontends

| Feature | BeBlurt | Blurt.blog | blurb | blurtbb | app.blurt.blog | BlurtWallet |
|---------|---------|------------|-------|---------|----------------|-------------|
| Image Upload | ✅ | ✅ | ✅ | N/A | ✅ | N/A |
| Vote | ✅ | ✅ | ✅ | N/A | ✅ | N/A |
| Mark as Read | ✅ | ✅ | ✅ | ✅ | ✅ | N/A |
| Login/Wallet | ✅ | ✅ | ✅ | N/A | ✅ | ✅ |
| Transfer | N/A | ✅ | N/A | N/A | N/A | ✅ |
| Post/Comment | ✅ | ✅ | ✅ | N/A | ✅ | N/A |
| Power Up/Down | N/A | ✅ | N/A | N/A | N/A | ✅ |
| Stop PD | N/A | ✅ | N/A | N/A | N/A | ✅ |
| Delegation | N/A | N/A | N/A | N/A | N/A | ✅ |
| Delegate RC | N/A | N/A | N/A | N/A | N/A | N/A |
| Claim Rewards | ✅ | ✅ | N/A | N/A | N/A | ✅ |

**Legend:** ✅ Working | N/A Not Available/Not Tested

## 📦 Installation

### From Source
```bash
git clone https://github.com/drakernoise/w3-multi-chain-wallet-manager.git
cd w3-multi-chain-wallet-manager
npm install
npm run build
```

### Load in Browser
1. Open Chrome/Brave
2. Go to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` folder

## 🔧 Technical Details

### Modified Files
- `services/chainService.ts` - Buffer handling and ImageSigningChallenge logic
- `components/PowerModal.tsx` - Overflow prevention
- `components/ManageAccountModal.tsx` - Overflow prevention
- `components/ImportModal.tsx` - Overflow prevention

### Key Changes
```typescript
// Detect JSON-serialized Buffers
if (typeof message === 'string') {
    const parsed = JSON.parse(message);
    if (parsed.type === 'Buffer' && Array.isArray(parsed.data)) {
        msgBuf = Buffer.from(parsed.data);
    }
}

// Check for existing ImageSigningChallenge prefix
const alreadyHasPrefix = msgBuf.slice(0, challengePrefix.length).equals(challengePrefix);
if (alreadyHasPrefix) {
    hash = cryptoUtils.sha256(msgBuf);
} else {
    const combined = Buffer.concat([challengePrefix, msgBuf]);
    hash = cryptoUtils.sha256(combined);
}
```

## 🐛 Known Issues
- **BlurtBB:** Limited functionality (frontend-specific limitations)
- **Mark as Read:** Not implemented (requires notification API integration)
- **RC Delegation:** Not available on Blurt (Hive-only feature)

## 🚀 Next Steps
- Hive frontend compatibility testing
- Steem frontend compatibility testing
- Additional UI/UX improvements

## 📝 Changelog

### Added
- Automated backup script (`scripts/backup.ps1`, `scripts/backup.sh`)
- JSON-serialized Buffer detection and parsing
- ImageSigningChallenge prefix detection

### Fixed
- Blurt image upload on all frontends
- Blurt delegation minimum amount validation
- Modal overflow on smaller screens

### Changed
- Improved error messages for delegation failures
- Enhanced buffer handling in `signMessage` function

## 👥 Contributors
- @drakernoise

## 📄 License
MIT

---

**Full Changelog**: https://github.com/drakernoise/w3-multi-chain-wallet-manager/compare/v1.0.3...v1.0.4-blurt-stable
