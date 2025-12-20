# Release v1.0.4 - Hive & Blurt Production Ready

## 🎉 Major Milestone: Dual Chain Mastery

This release marks a significant leap forward, achieving **full stability and compatibility with both Hive (HF26) and Blurt ecosystems**. 

We have successfully resolved complex serialization and broadcasting issues that were affecting Hive operations, particularly on `hive.blog`, while maintaining the robust Blurt support established previously.

## ✨ Hive Critical Fixes (HF26)

### HF26 Hardfork Compatibility & Voting
- **Fixed:** "Missing Posting Authority" errors during voting and broadcasting.
- **Solution:** Implemented explicit Chain ID enforcement (`beeab0de...`) for all transaction signatures, required by Hive's HF26 standard.
- **Status:** ✅ Confirmed working on Hive.blog, Ecency, PeakD.

### Custom JSON & Notifications (Mark as Read)
- **Fixed:** `custom_json` serialization errors causing "Mark as Read" to fail on Hive.blog.
- **Fixed:** Case-sensitivity issue where `posting` key type (lowercase) was not recognized, defaulting to Active key and causing authority mismatch.
- **Added:** Robust sanitization middleware that ensures `required_auths` and `required_posting_auths` are always valid arrays.
- **Status:** ✅ Confirmed working for notifications on Hive.blog.

## ✨ Blurt Stability (Recap)

### Blurt Image Upload
- **Fixed:** Buffer deserialization and prefix handling for image uploads.
- **Status:** ✅ Working on BeBlurt, Blurt.blog, blurb, app.blurt.blog.

### Blurt Delegation
- **Fixed:** Delegation logic and validation.
- **Status:** ✅ Working on BlurtWallet.com.

## 🧪 Tested Frontends

### Hive Ecosystem
| Feature | Hive.blog | PeakD | Ecency | Splinterlands |
|---------|-----------|-------|--------|---------------|
| Vote | ✅ | ✅ | ✅ | ✅ |
| Mark as Read | ✅ | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ | ✅ |
| Custom JSON | ✅ | ✅ | ✅ | ✅ |
| Transfers | ✅ | ✅ | ✅ | ⚠️ WIP |

### Blurt Ecosystem
| Feature | BeBlurt | Blurt.blog | blurb | BlurtWallet |
|---------|---------|------------|-------|-------------|
| Image Upload | ✅ | ✅ | ✅ | N/A |
| Vote | ✅ | ✅ | ✅ | N/A |
| Operations | ✅ | ✅ | ✅ | ✅ |

**Legend:** ✅ Working | ⚠️ WIP (Work in Progress) | N/A Not Available

## 🔧 Technical Deep Dive

### Hive HF26 Serialization
```typescript
// Explicit Chain ID required for HF26 signatures
const HIVE_CHAIN_ID = 'beeab0de...';
const signedTx = cryptoUtils.signTransaction(tx, [privateKey], Buffer.from(HIVE_CHAIN_ID, 'hex'));
```

### Custom JSON Sanitization
```typescript
// Case-insensitive key detection & robust array enforcement
const normalizedKeyType = (keyType || '').toLowerCase();
const cleanPayload = {
    required_auths: Array.isArray(p.required_auths) ? p.required_auths : [],
    required_posting_auths: Array.isArray(p.required_posting_auths) ? p.required_posting_auths : [],
    // ...
};
```

## 🐛 Known Issues & Next Steps
- **Splinterlands Transfers:** Internal transfers (DEC/SPS) currently showing "Invalid operation" - Under investigation.
- **Steem:** Initial compatibility testing scheduled for next release cycle.
- **UI:** Minor cosmetic updates planned for settings menu.

## 📝 Changelog

### Fixed
- **Hive:** HF26 transaction signature compatibility (Mainnet Chain ID).
- **Hive:** Custom JSON broadcasting (Mark as Read/Notifications).
- **Core:** Case-insensitive handling of key roles (`posting` vs `Posting`).
- **Core:** Sanitization of `custom_json` payloads to prevent undefined array length errors.
- **Blurt:** Image upload buffer handling.

### Added
- **Dev:** Automated backup scripts (`scripts/backup.ps1`).
- **Dev:** Enhanced debug logging (now cleaned up for production).

## 👥 Contributors
- @drakernoise

## 📄 License
MIT

---

**Full Changelog**: https://github.com/drakernoise/w3-multi-chain-wallet-manager/compare/v1.0.3...v1.0.4
