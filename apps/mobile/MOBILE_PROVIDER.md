# Gravity Wallet - Mobile Provider

## Overview

Gravity Wallet Mobile acts as a Web3 wallet provider for mobile browsers, allowing dApps to request transaction signatures through deep linking.

## How It Works

### For dApp Developers

To integrate with Gravity Wallet Mobile, use the following URL scheme:

```
gravitywallet://sign?domain=yourdapp.com&operation=transfer&amount=10&to=recipient&callback=https://yourdapp.com/callback
```

### URL Parameters

- `domain` (required): Your dApp's domain
- `operation` (required): Operation type (`transfer`, `vote`, `post`, `comment`, `delegate`, `powerup`, `powerdown`)
- `callback` (optional): URL to redirect back to after signing
- Additional parameters specific to the operation

### Example Integration

```javascript
// JavaScript example for dApp
function requestSignature() {
    const params = new URLSearchParams({
        domain: window.location.hostname,
        operation: 'transfer',
        amount: '10.000',
        to: 'recipient',
        memo: 'Payment for services',
        callback: window.location.href
    });
    
    window.location.href = `gravitywallet://sign?${params.toString()}`;
}
```

### Callback Response

After the user approves or rejects, Gravity Wallet will redirect to your callback URL with:

**Success:**
```
https://yourdapp.com/callback?success=true&signature=ABC123...
```

**Rejection:**
```
https://yourdapp.com/callback?success=false&error=User%20rejected
```

## Permission System

Users can grant your dApp permission to auto-approve operations for:
- **1 Day**: Quick testing and temporary access
- **1 Week**: Regular use
- **1 Month**: Trusted long-term dApps

### Supported Operations

- `transfer`: Send tokens
- `vote`: Vote on content
- `post`: Create posts
- `comment`: Create comments
- `delegate`: Delegate power
- `powerup`: Power up tokens
- `powerdown`: Power down tokens

## Security

- All operations require user approval (unless permission granted)
- Permissions expire automatically
- Users can revoke permissions at any time
- Deep links are validated and sanitized

## Building the Mobile App

### Prerequisites

```bash
npm install
```

### iOS

```bash
npm run cap:add:ios
npm run build
npm run cap:sync
npm run cap:open:ios
```

### Android

```bash
npm run cap:add:android
npm run build
npm run cap:sync
npm run cap:open:android
```

## Testing

1. Build and install the app on your device
2. Open a test dApp in your mobile browser
3. Trigger a deep link
4. Approve/reject in Gravity Wallet
5. Verify callback in dApp

## Example dApp

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test dApp</title>
</head>
<body>
    <h1>Gravity Wallet Test</h1>
    <button onclick="requestTransfer()">Request Transfer</button>
    
    <script>
        function requestTransfer() {
            const params = new URLSearchParams({
                domain: window.location.hostname,
                operation: 'transfer',
                amount: '1.000',
                to: 'testuser',
                memo: 'Test transfer',
                callback: window.location.href
            });
            
            window.location.href = `gravitywallet://sign?${params.toString()}`;
        }
        
        // Handle callback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            console.log('Signature:', urlParams.get('signature'));
            alert('Transaction approved!');
        } else if (urlParams.get('success') === 'false') {
            alert('Transaction rejected: ' + urlParams.get('error'));
        }
    </script>
</body>
</html>
```

## Troubleshooting

### Deep links not working

1. Ensure the app is installed
2. Check URL scheme is correct (`gravitywallet://`)
3. Verify all required parameters are present

### Permissions not persisting

1. Check localStorage is enabled
2. Verify permissions haven't expired
3. Check for app updates

## Support

For issues and questions, visit: https://github.com/drakernoise/w3-multi-chain-wallet-manager
