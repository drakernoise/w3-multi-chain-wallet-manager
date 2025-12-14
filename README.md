# Gravity Web3 Multi-Chain Wallet

Gravity is a secure, non-custodial browser extension wallet for the **Hive**, **Steem**, and **Blurt** blockchains. It allows you to manage accounts, transfer funds, sign transactions, and interact with Web3 dApps seamlessly.

<div align="center">
  <img src="public/logowallet_big.png" alt="Gravity Wallet Banner" width="300" />
</div>



## Features

*   **Multi-Chain Support**: Manage Hive, Steem, and Blurt accounts in one place.
*   **Non-Custodial**: Your private keys are encrypted and stored locally on your device. They never leave your browser.
*   **Web3 Integration**: Interact with dApps (like PeakD, Steemit, BeBlurt) using the injected provider (compatible with Hive Keychain API).
*   **Sleek UI**: Modern, dark-themed interface with real-time feedback.
*   **Bulk Transfers**: Send funds to multiple recipients in a single transaction.
*   **Transaction Analysis**: View and analyze your transaction history.
*   **Secure**:
    *   AES-256 encryption for your vault.
    *   Auto-lock mechanism.
    *   Detailed transaction confirmations.

## Installation

### From Source (Developer Mode)

1.  Clone this repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the extension:
    ```bash
    npm run build
    ```
4.  Open Chrome/Brave/Edge and go to `chrome://extensions`.
5.  Enable **"Developer mode"** (top right).
6.  Click **"Load unpacked"**.
7.  Select the `dist` folder generated in step 3.

### From Release Package

1.  Download the latest `.zip` file from the `release` folder.
2.  Extract the zip file.
3.  Load the extracted folder as an unpacked extension in your browser's extension manager.

## Usage

1.  **Create Vault**: Set up a master password to encrypt your storage.
2.  **Import Keys**: Import your Private Active or Posting keys (or Master Password) for your Hive/Steem/Blurt accounts.
3.  **Transact**: Use the buttons in the wallet to Send or Receive.
4.  **Connect**: Visit a dApp (e.g., `hive.blog`) and log in using "Keychain" or "Gravity".

## Permissions Justification

This extension requires the following permissions:
*   `storage`: To securely save your encrypted vault locally.
*   `activeTab` & `tabs`: To communicate with dApps requesting signatures.
*   `scripting`: To inject the Web3 provider into web pages.
*   `host_permissions (<all_urls>)`: Required to detect and inject the provider script into *any* dApp you visit, ensuring broad compatibility without manual whitelisting.

## Privacy

See [PRIVACY.md](PRIVACY.md) for details. We do not track you.


