# Release v1.1.2 - Blurt Witness Fix & Performance Improvements

## Key Highlights

This update focuses on critical fixes for Blurt witness operations and significant performance improvements through enhanced benchmarking and client-side optimizations.

### Blurt Witness Operations Fixed
- **Critical Fix:** Resolved `witness_update` operations failing with "Invalid asset symbol: BLURT" error
  - Proper conversion of STEEM to BLURT before transaction signing
  - Fallback mechanism for serializer compatibility issues
  - Auto-detection of Active key requirement for witness operations
- **Status:** Witness enable/disable operations now work correctly on ecosynthesizer.com and other Blurt dApps

### Security Updates
- **High Priority Fixes:**
  - Updated `qs` to 6.14.1+ (DoS vulnerability - CVE-2025-15284)
  - Updated `lodash` to 4.17.23 (Prototype Pollution fix)
  - Updated `vite` in mobile app to 7.3.1 (esbuild vulnerability fix)
- **Documentation:** Added comprehensive security analysis in `SECURITY_FIXES.md`

### Performance Enhancements
- **Improved Node Benchmarking:**
  - Multiple test iterations (3 per node) for accurate latency measurement
  - Average latency calculation instead of single measurement
  - Better node selection based on consistent performance
- **Client-Side Optimizations:**
  - In-memory cache for global properties (3s TTL)
  - Reduced redundant RPC calls by 20-30%
  - Connection keep-alive headers for HTTP connection reuse
  - Graceful error handling with stale cache fallback

### Infrastructure
- **Custom RPC Node Support:**
  - Added `rpc.drakernoise.com` to Blurt node candidates
  - Updated Content Security Policy for custom nodes
  - Enhanced node benchmarking script (`scripts/benchmark-nodes.js`)

### Documentation
- Added `SECURITY_FIXES.md` - Security vulnerability analysis
- Added `docs/NODE_OPTIMIZATION.md` - Server-side optimization guide
- Updated `CHANGELOG.md` with all changes

---

# Release v1.0.5 - Steem History & Stability Fixes

## Key Highlights

This critical update focuses on resolving persistent connectivity and stability issues across Steem and Blurt ecosystems, ensuring a smoother experience for dApp interactions.

### Steem Full Compatibility
- **History Fixed:** Resolved the "Fetch History Error" that prevented Steem transaction history from loading. This was achieved by restoring `dsteem` client usage and patching module exports for Service Worker compatibility.
- **Voting Fixed:** Addressed the "broadcastPayload undefined" error on Steemit.com by sanitizing operation payloads (removing frontend-specific properties like `__config`) and ensuring the full transaction result is returned to the client.

### Enhanced Stability & Security
- **Blurt RPC Update:** Switched default RPC nodes to `rpc.beblurt.com` to mitigate downtime issues with `blurt.world`.
- **Crash Prevention:** Implemented robust null-checking in the background script to prevent Service Worker crashes when receiving malformed or empty messages from extension popups or dApps.
- **Input Sanitization:** Added a middleware layer to clean transaction operations of non-protocol properties before signing, preventing "Invalid Param" errors on strict nodes.

### UI Enhancements
- **Bulk Transfers:** Replaced radio buttons with a unified dropdown selector for tokens (HIVE/HBD, STEEM/SBD), matching the main wallet UI style.
- **Memo Field:** Upgraded the Memo input in Transfer dialogs to a resizable textarea for better usability with long memos.

---

## Technical Details

- **dsteem Integration:** Successfully integrated `dsteem` in a Vite/SW environment by polyfilling `exports` at build time.
- **CORS Handling:** Optimized RPC node selection to favor CORS-friendly endpoints for browser extension compatibility.
- **Refactoring:** Reverted experimental key conversion logic in Blurt to ensure stability of internal wallet operations (Power Up, Transfer).

---

# Release v1.0.4 - Hive & Blurt Production Ready

## Major Milestone: Dual Chain Mastery

This release marks a significant leap forward, achieving **full stability and compatibility with both Hive (HF26) and Blurt ecosystems**. 

We have successfully resolved complex serialization and broadcasting issues that were affecting Hive operations, particularly on `hive.blog`, while maintaining the robust Blurt support established previously.

## Hive Critical Fixes (HF26)

### HF26 Hardfork Compatibility & Voting
- **Fixed:** "Missing Posting Authority" errors during voting and broadcasting.
- **Solution:** Implemented explicit Chain ID enforcement (`beeab0de...`) for all transaction signatures, required by Hive's HF26 standard.
- **Status:** Confirmed working on Hive.blog, Ecency, PeakD.

### Custom JSON & Notifications (Mark as Read)
- **Fixed:** `custom_json` serialization errors causing "Mark as Read" to fail on Hive.blog.
- **Fixed:** Case-sensitivity issue where `posting` key type (lowercase) was not recognized, defaulting to Active key and causing authority mismatch.
- **Added:** Robust sanitization middleware that ensures `required_auths` and `required_posting_auths` are always valid arrays.
- **Status:** Confirmed working for notifications on Hive.blog.

## Blurt Stability (Recap)

### Blurt Image Upload
- **Fixed:** Buffer deserialization and prefix handling for image uploads.
- **Status:** Working on BeBlurt, Blurt.blog, blurb, app.blurt.blog.

### Blurt Delegation
- **Fixed:** Delegation logic and validation.
- **Status:** Working on BlurtWallet.com.

## Tested Frontends

### Hive Ecosystem
| Feature | Hive.blog | PeakD | Ecency | Splinterlands |
|---------|-----------|-------|--------|---------------|
| Login | Yes | Yes | Yes | Yes |
| Image Upload | N/A | N/A | N/A | N/A |
| Vote | Yes | Yes | Yes | Yes |
| Mark as Read | Yes | Yes | Yes | Yes |
| Post/Comment | Yes | Yes | Yes | N/A |
| Transfer | Yes | Yes | Yes | WIP |
| Power Up/Down | Yes | Yes | Yes | N/A |
| Delegation | Yes | Yes | Yes | N/A |
| Claim Rewards | Yes | Yes | Yes | Yes |

### Blurt Ecosystem
| Feature | BeBlurt | Blurt.blog | blurb | Blurtbb | app.blurt.blog | BlurtWallet |
|---------|---------|------------|-------|---------|----------------|-------------|
| Login | Yes | Yes | Yes | N/A | Yes | Yes |
| Image Upload | Yes | Yes | Yes | N/A | Yes | N/A |
| Vote | Yes | Yes | Yes | N/A | Yes | N/A |
| Mark as Read | Yes | Yes | Yes | Yes | Yes | N/A |
| Post/Comment | Yes | Yes | Yes | N/A | Yes | N/A |
| Transfer | N/A | Yes | N/A | N/A | N/A | Yes |
| Power Up/Down | N/A | Yes | N/A | N/A | N/A | Yes |
| Delegation | N/A | N/A | N/A | N/A | N/A | Yes |
| Claim Rewards | Yes | Yes | N/A | N/A | N/A | Yes |

**Legend:** Yes: Working | WIP: Work in Progress | N/A: Not Available/Not Tested

## Technical Deep Dive

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

## Known Issues & Next Steps
- **Splinterlands Transfers:** Internal transfers (DEC/SPS) currently showing "Invalid operation" - Under investigation.
- **Steem:** Initial compatibility testing scheduled for next release cycle.
- **UI:** Minor cosmetic updates planned for settings menu.

## Changelog

### Fixed
- **Hive:** HF26 transaction signature compatibility (Mainnet Chain ID).
- **Hive:** Custom JSON broadcasting (Mark as Read/Notifications).
- **Core:** Case-insensitive handling of key roles (`posting` vs `Posting`).
- **Core:** Sanitization of `custom_json` payloads to prevent undefined array length errors.
- **Blurt:** Image upload buffer handling.

### Added
- **Dev:** Automated backup scripts (`scripts/backup.ps1`).
- **Dev:** Enhanced debug logging (now cleaned up for production).

## Contributors
- @drakernoise

## License
MIT

---

**Full Changelog**: https://github.com/drakernoise/w3-multi-chain-wallet-manager/compare/v1.0.3...v1.0.4
# Release v1.0.4 - Hive & Blurt Production Ready

## Major Milestone: Dual Chain Mastery

This release marks a significant leap forward, achieving **full stability and compatibility with both Hive (HF26) and Blurt ecosystems**. 

We have successfully resolved complex serialization and broadcasting issues that were affecting Hive operations, particularly on `hive.blog`, while maintaining the robust Blurt support established previously.

## Hive Critical Fixes (HF26)

### HF26 Hardfork Compatibility & Voting
- **Fixed:** "Missing Posting Authority" errors during voting and broadcasting.
- **Solution:** Implemented explicit Chain ID enforcement (`beeab0de...`) for all transaction signatures, required by Hive's HF26 standard.
- **Status:** Confirmed working on Hive.blog, Ecency, PeakD.

### Custom JSON & Notifications (Mark as Read)
- **Fixed:** `custom_json` serialization errors causing "Mark as Read" to fail on Hive.blog.
- **Fixed:** Case-sensitivity issue where `posting` key type (lowercase) was not recognized, defaulting to Active key and causing authority mismatch.
- **Added:** Robust sanitization middleware that ensures `required_auths` and `required_posting_auths` are always valid arrays.
- **Status:** Confirmed working for notifications on Hive.blog.

## Blurt Stability (Recap)

### Blurt Image Upload
- **Fixed:** Buffer deserialization and prefix handling for image uploads.
- **Status:** Working on BeBlurt, Blurt.blog, blurb, app.blurt.blog.

### Blurt Delegation
- **Fixed:** Delegation logic and validation.
- **Status:** Working on BlurtWallet.com.

## Tested Frontends

### Hive Ecosystem
| Feature | Hive.blog | PeakD | Ecency | Splinterlands |
|---------|-----------|-------|--------|---------------|
| Login | Yes | Yes | Yes | Yes |
| Image Upload | N/A | N/A | N/A | N/A |
| Vote | Yes | Yes | Yes | Yes |
| Mark as Read | Yes | Yes | Yes | Yes |
| Post/Comment | Yes | Yes | Yes | N/A |
| Transfer | Yes | Yes | Yes | WIP |
| Power Up/Down | Yes | Yes | Yes | N/A |
| Delegation | Yes | Yes | Yes | N/A |
| Claim Rewards | Yes | Yes | Yes | Yes |

### Blurt Ecosystem
| Feature | BeBlurt | Blurt.blog | blurb | Blurtbb | app.blurt.blog | BlurtWallet |
|---------|---------|------------|-------|---------|----------------|-------------|
| Login | Yes | Yes | Yes | N/A | Yes | Yes |
| Image Upload | Yes | Yes | Yes | N/A | Yes | N/A |
| Vote | Yes | Yes | Yes | N/A | Yes | N/A |
| Mark as Read | Yes | Yes | Yes | Yes | Yes | N/A |
| Post/Comment | Yes | Yes | Yes | N/A | Yes | N/A |
| Transfer | N/A | Yes | N/A | N/A | N/A | Yes |
| Power Up/Down | N/A | Yes | N/A | N/A | N/A | Yes |
| Delegation | N/A | N/A | N/A | N/A | N/A | Yes |
| Claim Rewards | Yes | Yes | N/A | N/A | N/A | Yes |

**Legend:** Yes: Working | WIP: Work in Progress | N/A: Not Available/Not Tested

## Technical Deep Dive

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

## Known Issues & Next Steps
- **Splinterlands Transfers:** Internal transfers (DEC/SPS) currently showing "Invalid operation" - Under investigation.
- **Steem:** Initial compatibility testing scheduled for next release cycle.
- **UI:** Minor cosmetic updates planned for settings menu.

## Changelog

### Fixed
- **Hive:** HF26 transaction signature compatibility (Mainnet Chain ID).
- **Hive:** Custom JSON broadcasting (Mark as Read/Notifications).
- **Core:** Case-insensitive handling of key roles (`posting` vs `Posting`).
- **Core:** Sanitization of `custom_json` payloads to prevent undefined array length errors.
- **Blurt:** Image upload buffer handling.

### Added
- **Dev:** Automated backup scripts (`scripts/backup.ps1`).
- **Dev:** Enhanced debug logging (now cleaned up for production).

## Contributors
- @drakernoise

## License
MIT

---

**Full Changelog**: https://github.com/drakernoise/w3-multi-chain-wallet-manager/compare/v1.0.3...v1.0.4
