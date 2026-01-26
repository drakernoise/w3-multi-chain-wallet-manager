# Changelog

All notable changes to this project will be documented in this file.

## [1.1.2] - 2026-01-26

### Critical Fixes
- **Blurt Witness Operations:** Fixed `witness_update` operations failing with "Invalid asset symbol: BLURT" error
  - Implemented proper STEEM to BLURT conversion before signing transactions
  - Added fallback mechanism for serializer compatibility
  - Auto-detection of Active key requirement for witness operations
- **Security Vulnerabilities:** Resolved 3 high-severity vulnerabilities
  - Updated `qs` package to 6.14.1+ (DoS vulnerability fix)
  - Updated `lodash` to 4.17.23 (Prototype Pollution fix)
  - Updated `vite` in mobile app to 7.3.1 (esbuild vulnerability fix)

### Performance Improvements
- **Enhanced Node Benchmarking:** 
  - Implemented multiple test iterations (3 per node) for more accurate latency measurement
  - Calculates average latency instead of single measurement
  - Added connection keep-alive headers for better HTTP connection reuse
- **Client-Side Caching:**
  - Added in-memory cache for global properties (3s TTL)
  - Reduces redundant RPC calls by ~20-30%
  - Graceful fallback to stale cache on network errors
- **Optimized Fetch Requests:**
  - Added `Connection: keep-alive` headers to all RPC requests
  - Improved error handling for network failures

### Infrastructure
- **Node Configuration:**
  - Added `rpc.drakernoise.com` to Blurt node candidates
  - Updated Content Security Policy to allow custom RPC node
  - Improved node selection algorithm with multiple test iterations

### Documentation
- Added `SECURITY_FIXES.md` - Comprehensive security vulnerability analysis and solutions
- Added `docs/NODE_OPTIMIZATION.md` - Server-side optimization guide for RPC nodes
- Added `scripts/benchmark-nodes.js` - Standalone node benchmarking tool

## [1.1.0] - 2025-12-28

### New Features (Chat System V2)
- **Secure Authentication:** Implemented challenge-response authentication using ECDSA (P-256) signatures via Web Crypto API.
- **Background Notifications:** Robust Service Worker integration for reliable background message processing and badge updates.
- **In-App Notifications:** 
  - Visual notification badge on Sidebar Messenger icon.
  - Toast notifications for messages received in inactive rooms.
  - Global event system (`chat-unread`) for real-time UI updates.
- **Admin Tools:**
  - New endpoints for User Reset (`!RESET!` command) and Admin Deletion.
  - Bulk user deletion via API.
- **Chat UX:**
  - Improved socket connection stability and automatic room joining.
  - Proper handling of complex icons and SVG rendering.

### Improvements
- **Bulk Transfers:** 
  - Redesigned "Multi-Account" mode with wider input fields (50% width) for better visibility of large amounts/decimals.
  - Enhanced validation feedback for recipient lists.
- **Security:**
  - Removed unsafe `self` references in Service Worker to prevent crashes in production builds.
  - Explicit permissions management (`alarms`, `storage`).
- **Performance:**
  - Optimized badge update logic with event debouncing.
  - Better handling of WebSocket reconnections.

### Bug Fixes
- Fixed `verify_signature` event name mismatch preventing server-side authentication.
- Fixed missing SVG wrapper in Sidebar icons causing invisible elements.
- Fixed Service Worker initialization errors related to `crypto` object access.
- Addressed various TypeScript type definitions and linting errors.

---

## [1.0.5] - Previous Release
- Initial Web3 Multi-Chain Wallet features (Hive, Steem, Blurt support).
- Basic Chat implementation.
- Multisig coordination.
