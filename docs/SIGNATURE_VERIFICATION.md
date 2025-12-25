# 🔐 Gravity Messenger - Signature Verification Guide

## Overview

Gravity Messenger now supports **cryptographic signature verification** for enhanced security. This optional feature allows users to prove ownership of their chat identity using ECDSA signatures, preventing impersonation attacks.

## How It Works

The authentication flow uses a **challenge-response protocol**:

1. **Client requests a challenge** from the server by providing their user ID
2. **Server generates a random 32-byte challenge** and sends it to the client
3. **Client signs the challenge** using their private key (ECDSA with SHA-256)
4. **Server verifies the signature** using the stored public key
5. **If valid**, the user is authenticated and granted access to their rooms

## Security Benefits

- **Prevents replay attacks**: Each challenge is unique and expires after 5 minutes
- **Cryptographic proof of identity**: Only the holder of the private key can authenticate
- **No password transmission**: The private key never leaves the client
- **Backward compatible**: Regular username-based registration still works

## Server Implementation

### Challenge Generation

```javascript
function generateChallenge() {
    return crypto.randomBytes(32).toString('hex');
}
```

### Signature Verification

```javascript
function verifySignature(publicKeyHex, challenge, signatureHex) {
    const publicKeyBuffer = Buffer.from(publicKeyHex, 'hex');
    const signatureBuffer = Buffer.from(signatureHex, 'hex');
    
    const verify = crypto.createVerify('SHA256');
    verify.update(challenge);
    
    const publicKeyPem = `-----BEGIN PUBLIC KEY-----
${publicKeyBuffer.toString('base64')}
-----END PUBLIC KEY-----`;
    
    return verify.verify(publicKeyPem, signatureBuffer);
}
```

### Socket Events

**Server → Client:**
- `auth_challenge` - Sends the challenge to sign
- `auth_success` - Authentication successful
- `error` - Authentication failed or challenge expired

**Client → Server:**
- `request_challenge` - Request a new challenge for a user ID
- `verify_signature` - Submit the signed challenge

## Client Implementation

### Using the Chat Service

```typescript
import { chatService } from './services/chatService';

// Initialize the service
chatService.init();

// Authenticate with signature (optional enhanced security)
try {
    await chatService.authenticateWithSignature(userId, privateKeyHex);
    console.log('Authenticated with signature verification!');
} catch (err) {
    console.error('Signature auth failed:', err);
    // Fall back to regular registration
    chatService.register(username);
}
```

### Manual Implementation

```typescript
// 1. Request challenge
socket.emit('request_challenge', { userId: 'user-uuid' });

// 2. Listen for challenge
socket.on('auth_challenge', async (data) => {
    const { challenge } = data;
    
    // 3. Sign the challenge
    const signature = await signChallenge(challenge, privateKey);
    
    // 4. Send signature
    socket.emit('verify_signature', { signature });
});

// 5. Handle success
socket.on('auth_success', (data) => {
    console.log('Authenticated:', data.username);
});
```

## Key Format Requirements

### Public Key
- **Format**: Hex-encoded (130 characters for uncompressed ECDSA key)
- **Curve**: secp256k1 or P-256 (configurable)
- **Example**: `04a1b2c3d4...` (65 bytes = 130 hex chars)

### Private Key
- **Format**: Hex-encoded PKCS8
- **Storage**: Never stored on server, only on client
- **Usage**: Only for signing challenges

### Signature
- **Format**: Hex-encoded ECDSA signature
- **Algorithm**: ECDSA with SHA-256
- **Length**: Variable (typically 64-72 bytes)

## Security Considerations

### Challenge Expiration
Challenges expire after **5 minutes** to prevent replay attacks. If a challenge expires, request a new one.

### Key Storage
- **Public keys** are stored on the server for verification
- **Private keys** must be stored securely on the client (encrypted vault)
- Never transmit private keys over the network

### Fallback Authentication
If signature verification fails or is unavailable:
- Users can still authenticate with username-only registration
- This maintains backward compatibility
- Consider implementing rate limiting for failed attempts

## Migration Path

### For Existing Users
1. Generate a key pair on first enhanced auth attempt
2. Store public key on server during registration
3. Store private key in encrypted local vault
4. Use signature auth for subsequent logins

### For New Users
1. Generate key pair during registration
2. Submit public key with username
3. Store private key locally
4. Use signature auth from the start

## Testing

### Test Challenge-Response Flow

```bash
# Start the chat server
cd chat-server
node index.js

# In browser console:
const socket = io('http://localhost:3000');

socket.emit('request_challenge', { userId: 'test-user-id' });

socket.on('auth_challenge', (data) => {
    console.log('Challenge:', data.challenge);
    // Sign and verify
});
```

## Troubleshooting

### "No active challenge or challenge expired"
- The challenge has expired (5 min timeout)
- Request a new challenge before signing

### "Invalid signature"
- Public/private key mismatch
- Incorrect signing algorithm
- Challenge was modified

### "User not found or no public key registered"
- User hasn't registered yet
- Public key wasn't stored during registration
- Use regular registration first

## Future Enhancements

- [ ] Support for multiple key types (RSA, Ed25519)
- [ ] Key rotation mechanism
- [ ] Multi-factor authentication combining signature + TOTP
- [ ] Hardware security module (HSM) integration
- [ ] Biometric-protected key storage

---

**Security Note**: This feature is optional and complements the existing authentication system. For maximum security, combine signature verification with other security measures like rate limiting, IP whitelisting, and monitoring for suspicious activity.
