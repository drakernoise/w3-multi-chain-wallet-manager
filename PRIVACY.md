# Privacy Policy for Gravity Wallet

**Last Updated:** June 3, 2026

Gravity ("we", "our", or "us") is a non-custodial wallet for the Blurt, Hive, and Steem blockchains. This Privacy Policy explains how data is handled when you use the Gravity browser extension.

## 1. What Gravity stores locally

Gravity stores wallet data on your device, not on our servers.

- **Encrypted wallet data**: account names, private keys, and related wallet data are stored locally using your browser's storage.
- **Security settings**: preferences such as lock state, language, 2FA-related settings, and other local wallet settings may also be stored locally.
- **Session data**: temporary session data may be stored locally to keep the extension usable between browser events.

Private keys are intended to remain on your device. Gravity is designed so that your private keys are not uploaded to us.

## 2. Passwords and encryption

Your wallet data is encrypted locally on your device. Gravity does not know your master password and does not have direct access to your decrypted wallet contents.

## 3. Blockchain and RPC communication

Gravity communicates with public blockchain nodes and RPC endpoints in order to:

- fetch balances and account data
- read public blockchain history
- broadcast transactions you approve
- support features such as multisig coordination and dApp interaction

When this happens, the node or endpoint operator may see technical metadata such as your IP address, just as they would if you visited a website directly. We do not control third-party RPC providers.

## 4. dApp and website interaction

Gravity injects a provider only into supported sites or sites you explicitly authorize, depending on the build and permission flow in use.

When you use Gravity with a third-party website:

- the website may request a signature or transaction
- you must explicitly approve sensitive actions in Gravity
- Gravity may return the signed payload, transaction result, public key, or related response data needed for that interaction
- Gravity does **not** share your private keys with the website

## 5. Chat, sync, and pairing services

Some optional features, such as chat, device sync, and pairing flows, use a remote coordination server.

These services may process technical data needed to relay messages or encrypted payloads between your devices or sessions. Gravity is designed so that sensitive wallet material stays local, and sync/pairing payloads are encrypted in transit at the application layer where implemented.

If you use chat or sync features, the server involved may see connection metadata such as IP address and timing information.

## 6. Analytics and tracking

Gravity does not include third-party analytics or advertising trackers such as Google Analytics for extension usage tracking.

## 7. Third-party services

Gravity may interact with third-party services and infrastructure, including:

- public blockchain RPC nodes
- dApps you choose to use
- chat/sync coordination infrastructure used by optional features

Your use of those services is also subject to their own policies and operational practices.

## 8. Data sharing

We do not sell your personal data.

Gravity is intended to minimize centralized collection of user data. However, information you deliberately send to blockchains, dApps, chat systems, or external services may become visible to those systems according to how they operate.

## 9. Changes to this policy

We may update this Privacy Policy from time to time. The latest version will be published in this repository or project distribution channels.

## 10. Contact

If you have questions about this Privacy Policy, please use the project's official support or repository channels.
