# Code Review Report

**Date:** 2026-02-03
**Reviewer:** Jules

## 1. Executive Summary

The Gravity Web3 Multi-Chain Wallet is a browser extension supporting Hive, Steem, and Blurt. It demonstrates a solid understanding of blockchain interactions and provides a user-friendly experience. However, a comprehensive review has identified **critical security vulnerabilities** in the authentication layer, specifically regarding "Passwordless" mode, and several architectural inconsistencies that need addressing before further scaling or adding features like Multisig.

## 2. Critical Security Vulnerabilities

### 2.1. Insecure Key Storage in Passwordless Mode (CRITICAL)
- **File:** `packages/shared/services/cryptoService.ts`
- **Issue:** The `enablePasswordless` function generates a master encryption key (`internalKey`) and stores it using `storeInternalKey`. This function saves the key in plain text (or simple JSON) to the browser's local storage (`storageService` -> `localStorage` or `chrome.storage.local`).
- **Impact:** Any malicious extension or script with access to local storage can retrieve the master key and decrypt the user's vault without their consent. This completely negates the encryption.
- **Recommendation:**
    - **Immediate:** Disable "Passwordless" mode or clearly warn users it is insecure.
    - **Long-term:** Implement true "Passwordless" using WebAuthn (FIDO2) with the `hmac-secret` extension to derive a cryptographic key from the biometric authentication, or use the OS keychain if available via a native companion app. Do not store the key in local storage.

### 2.2. Mock Authentication Services
- **File:** `packages/shared/services/authService.ts`
- **Issue:** The `authenticateWithGoogle` and `authenticateWithDevice` functions are mocks returning hardcoded fake user data. `authenticateWithBiometrics` uses `navigator.credentials` but does not link the authentication to key release/decryption.
- **Impact:** The "Passwordless" flow creates a false sense of security. It performs a biometric check (if supported) but then retrieves the key from insecure storage regardless of the biometric result's cryptographic proof.

### 2.3. Master Key Exposure
- **File:** `packages/shared/services/cryptoService.ts`
- **Issue:** `initVaultWithGeneratedKey` returns the generated `internalKey` to the UI.
- **Impact:** If the UI logs or displays this key improperly, it could be exposed.

## 3. Bugs & Inconsistencies

### 3.1. Broken/Obsolete Files
- **File:** `packages/shared/services/chainService_broken.ts`
- **Issue:** A duplicate, seemingly broken version of `chainService.ts` exists in the codebase.
- **Recommendation:** Delete this file to avoid confusion.

### 3.2. Decryption Logic
- **File:** `packages/shared/services/cryptoService.ts`
- **Issue:** `tryDecrypt` attempts to decrypt using `atob(password)`.
- **Impact:** This is likely a workaround for legacy issues but can cause unexpected behavior if a user's password happens to be a valid Base64 string.

### 3.3. Blurt Signing Workaround
- **File:** `packages/shared/services/chainService.ts`
- **Issue:** The `broadcastBlurtTransaction` function implements a complex manual signing process, converting operations between STEEM and BLURT formats to bypass library limitations.
- **Impact:** This is brittle and hard to maintain.

## 4. Architectural Improvements

### 4.1. Code Duplication
- **Issue:** `chainService.ts` contains repeated logic for `broadcastTransfer`, `broadcastVote`, etc., for each chain (Hive, Steem, Blurt).
- **Recommendation:** Refactor into a `ChainStrategy` pattern where each chain has a dedicated class implementing a common `ChainInterface`.

### 4.2. Error Handling
- **Issue:** `formatChainError` relies on parsing error message strings.
- **Recommendation:** detailed parsing of the error object structure returned by the RPC nodes is more robust.

## 5. Obsolete Configurations

### 5.1. Node List
- **File:** `packages/shared/services/nodeService.ts`
- **Issue:** Contains commented-out nodes and potentially outdated "Often reliable" comments.
- **Action:** Cleaned up the node list to only include active, verified nodes.

## 6. Multisig Readiness

The current architecture is designed for single-key signing. To support Multisig:
1.  **Data Structures:** Need new interfaces for `MultisigAccount` and `PendingTransaction`.
2.  **Signing Flow:** The `chainService` needs to support "proposing" a transaction (storing it without broadcasting) and "signing" a pending transaction (adding a signature to an existing transaction object).
3.  **UI:** New views for "Pending Approvals".

See `docs/MULTISIG_PLAN.md` for a detailed roadmap.
