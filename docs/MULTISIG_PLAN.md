# Multisig Implementation Plan

**Date:** 2026-02-03
**Status:** DRAFT

## 1. Overview

The goal is to add Multi-Signature (Multisig) support to the Gravity Wallet. This allows users to manage accounts that require multiple signatures to broadcast transactions (e.g., 2-of-3 schemes).

## 2. Core Concepts

*   **Multisig Account:** An account where the `active` or `posting` authority is a list of keys/accounts with weights, and a threshold > 1.
*   **Proposer:** The user who initiates the transaction.
*   **Signer:** A user who adds their signature to a pending transaction.
*   **Pending Transaction:** A partially signed transaction stored either locally or on a coordination server (or on-chain via deferred transactions, though Hive/Steem/Blurt handling of this varies).

## 3. Architecture Changes

### 3.1. Data Structures (`packages/shared/types/index.ts`)

```typescript
export interface MultisigAuthority {
    weight_threshold: number;
    account_auths: [string, number][]; // [username, weight]
    key_auths: [string, number][];     // [public_key, weight]
}

export interface PendingTransaction {
    id: string; // UUID
    chainId: Chain;
    initiator: string; // username
    expiration: string;
    operations: any[];
    signatures: string[]; // List of Hex signatures
    requiredAuths: string[]; // List of public keys or usernames needed
    status: 'pending' | 'ready' | 'broadcasted' | 'expired';
}
```

### 3.2. Chain Service (`packages/shared/services/chainService.ts`)

Need to add methods for:
*   `analyzeAuthority(account: string)`: Determine if an account is multisig and what keys are needed.
*   `proposeTransaction(tx: Transaction)`: Instead of broadcasting, return the signed object.
*   `addSignature(tx: PendingTransaction, key: PrivateKey)`: Sign the digest and append the signature.
*   `broadcastMultisig(tx: PendingTransaction)`: Once enough signatures are gathered, broadcast.

### 3.3. Coordination Layer

For a smooth UX, we need a way to share pending transactions between users.
*   **Option A (Decentralized):** Use the Memo field of a micro-transfer (encrypted) to send the partial transaction to other signers.
*   **Option B (Server):** A simple relay server that stores pending blobs.
*   **Option C (Local):** Manual export/import of JSON files (MVP).

**Recommendation:** Start with **Option C (Local)** for the MVP to ensure security and simplicity, then explore **Option B**.

## 4. User Interface Changes

1.  **Account View:** Indicator if the account is Multisig.
2.  **Send/Vote/etc:** If the account is Multisig, the "Send" button changes to "Propose".
3.  **Transactions Tab:** A new section for "Pending Approvals".
    *   List transactions waiting for my signature.
    *   List transactions I proposed waiting for others.
4.  **Import Transaction:** Ability to paste a JSON blob to sign it.

## 5. Security Considerations

*   **Phishing:** Ensure the UI clearly displays *decoded* operations of a pending transaction before the user signs it.
*   **Expiration:** Multisig transactions have an expiration time (usually 1 hour). The UI must handle expired transactions gracefully.
*   **Key Isolation:** Ensure only the specific key required for the multisig is used, not the master key blindly.

## 6. Development Phases

1.  **Phase 1: Analysis & Detection:** update `chainService` to correctly parse account authorities and detect multisig setups.
2.  **Phase 2: Signing Logic:** Implement `proposeTransaction` and `addSignature`.
3.  **Phase 3: Import/Export UI:** Build the UI to export a partial TX and import one to sign.
4.  **Phase 4: Broadcasting:** Logic to combine signatures and broadcast.
