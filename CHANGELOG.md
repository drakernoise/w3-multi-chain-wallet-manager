# Changelog

All notable changes to this project will be documented in this file.

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
