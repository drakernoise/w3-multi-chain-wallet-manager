# Gravity Wallet - Chrome Web Store Publishing Guide

## 1. Prerequisites
*   **Google Developer Account**: You need to have paid the $5 one-time fee.
*   **ZIP File**: Locate `release/gravity-wallet-v1.0.4.zip`.

## 2. Store Listing Assets
You will need to upload the following:
*   **Store Icon**: 128x128px PNG.
*   **Screenshots**: Just take screenshots of the wallet popup (Power Up, Transfer, Home).
*   **Marquee Image**: 440x280px or 920x680px (Optional but recommended).

## 3. Privacy Tab Settings
*   **Single Purpose**: "Wallet and Blockchain interactions".
*   **Permission Justification**:
    *   **storage**: "To store encrypted user preferences and whitelists locally."
    *   **activeTab**: "To detect the current DApp domain for connection requests."
    *   **tabs**: "To communicate with the active DApp tab for transaction signing."
    *   **Host Permissions (<all_urls>)**: "The extension must inject a content script (Web3 Provider) into every webpage to check for `window.gravity` requests, allowing users to interact with any blockchain DApp they visit."
*   **Remote Code**: NO. Select "No, I am not using remote code."
*   **Data Usage**:
    *   Does this extension collect user data? **NO**. (Unless you count local storage, which is not "collection" transmitted to you).
    *   If forced to select: Select "Personally Identifiable Information" -> "No".

## 4. Privacy Policy URL
You must host the content of `PRIVACY.md` on a public URL.
*   *Option:* Copy the text to a GitHub Gist or your website and paste that link.

## 5. Critical Warning: Icon Size
*   ⚠️ **Action Required**: Your current `logowallet.png` is **5MB**. Ideally, verify this doesn't cause lag. For a faster approval, consider resizing it to 128x128 pixels (PNG) before final submission, or ensure the Store accepts it (it might auto-resize).

## 6. Upload
1.  Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard).
2.  Click "New Item".
3.  Upload `gravity-wallet-v1.0.4.zip`.
4.  Fill in the details above.
5.  Submit for Review!

**Review Time**: Usually 24-48 hours since you use Manifest V3 and have no remote code.
