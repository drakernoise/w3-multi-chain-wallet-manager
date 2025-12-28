# Security Policy

**Languages:** [🇬🇧 English](SECURITY.md) | [🇪🇸 Español](SECURITY.es.md) | [🇫🇷 Français](SECURITY.fr.md) | [🇩🇪 Deutsch](SECURITY.de.md) | [🇮🇹 Italiano](SECURITY.it.md)

---

## Security Overview

Gravity Wallet is a browser extension that handles sensitive cryptographic operations and private keys. We take security very seriously and appreciate the security research community's efforts to help keep our users safe.

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 1.0.x   | Yes | Current stable release |
| < 1.0   | No  | Legacy versions - please upgrade |

**Recommendation:** Always use the latest stable release available in the [Releases](https://github.com/drakernoise/w3-multi-chain-wallet-manager/releases) section.

## Reporting a Vulnerability

### Where to Report

**DO NOT** create public GitHub issues for security vulnerabilities. Instead:

1. **Email:** Send details to `drakernoise@protonmail.com`
2. **Subject:** `[SECURITY] Gravity Wallet - [Brief Description]`
3. **Encryption:** For sensitive information, request our PGP key

### What to Include

Please provide:

- **Description:** Clear explanation of the vulnerability
- **Impact:** What could an attacker do with this vulnerability?
- **Steps to Reproduce:** Detailed steps to reproduce the issue
- **Affected Versions:** Which versions are affected?
- **Proof of Concept:** Code, screenshots, or video (if applicable)
- **Suggested Fix:** If you have ideas for mitigation

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Every 7 days until resolved
- **Fix Timeline:** 
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: 60 days

### What to Expect

**If Accepted:**
- We'll work with you to understand and validate the issue
- We'll develop and test a fix
- We'll credit you in the security advisory (unless you prefer to remain anonymous)
- We'll publish a security advisory after the fix is released

**If Declined:**
- We'll explain why we don't consider it a security issue
- We may still address it as a regular bug or enhancement

## Security Best Practices for Users

### Private Key Security

⚠️ **CRITICAL:** Gravity Wallet stores your private keys locally in your browser's encrypted storage.

**Best Practices:**
1. **Never share your private keys** with anyone
2. **Backup your keys** securely offline (paper wallet, encrypted USB)
3. **Use strong passwords** for your device and browser
4. **Keep your browser updated** to the latest version
5. **Only download** from official sources (GitHub releases)
6. **Never enter keys** on suspicious websites
7. **Don't screenshot** your keys or store them in cloud services

### Extension Security

1. **Verify the Extension:**
   - Always download from [official GitHub releases](https://github.com/drakernoise/w3-multi-chain-wallet-manager/releases)
   - Verify the file hash if provided
   - Check the version number matches

2. **Whitelist Carefully:**
   - Only whitelist trusted websites
   - Review permissions before auto-signing
   - Revoke access for unused sites

3. **Regular Updates:**
   - Check for updates regularly
   - Read release notes for security fixes
   - Update promptly when security patches are released

### Phishing Protection

**Common Phishing Tactics:**
- Fake websites that look like legitimate frontends
- Emails asking for your private keys
- Browser extensions that mimic Gravity Wallet
- Social media messages offering "support"

**Protection:**
- Always verify the URL before entering credentials
- Bookmark trusted frontends (PeakD, Ecency, Blurt.blog, etc.)
- Enable browser phishing protection
- Never click suspicious links in emails/messages

## Security Features

### Current Security Measures

- **Local Storage Only:** Keys never leave your device
- **Browser Encryption:** Uses browser's encrypted storage API
- **No Analytics:** No tracking or data collection
- **Open Source:** Code is publicly auditable
- **Whitelist System:** Control which sites can auto-sign
- **Manual Confirmation:** Financial operations require explicit approval

### Planned Security Enhancements

- **Hardware Wallet Support:** Integration with Ledger/Trezor
- **Biometric Authentication:** Fingerprint/Face ID support
- **Multi-Signature:** Support for multi-sig accounts
- **Session Timeout:** Auto-lock after inactivity

## Security Hall of Fame

We recognize and thank security researchers who responsibly disclose vulnerabilities:

<!-- Security researchers will be listed here after responsible disclosure -->

*No vulnerabilities have been reported yet.*

## Additional Resources

- **Code Audit:** Community members are encouraged to audit the code
- **Security Discussions:** Use GitHub Discussions for security questions
- **Best Practices Guide:** See [Wiki - Security Best Practices](https://github.com/drakernoise/w3-multi-chain-wallet-manager/wiki)

## Responsible Disclosure

We follow responsible disclosure practices:

1. **Private Disclosure:** Report privately first
2. **Coordinated Release:** We'll coordinate the public disclosure with you
3. **Credit:** We'll credit you in the advisory (if desired)
4. **No Legal Action:** We won't pursue legal action against researchers who follow this policy

## Contact

- **Security Issues:** drakernoise@protonmail.com
- **General Support:** [GitHub Issues](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Discussions:** [GitHub Discussions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)

---

**Last Updated:** December 20, 2025  
**Version:** 1.0

Thank you for helping keep Gravity Wallet and our users safe!
