# Blurt Image Upload Issue - Status Report

## Problem
Image upload to `img-upload.blurt.world` is failing with HTTP 400 Bad Request.

## What We Know
1. **It was working before** - Excel shows "Ok" for Blurt image upload on beblurt and blurb
2. **Login still works** - This suggests basic signing is functional
3. **The error is consistent** - Always 400 Bad Request, suggesting signature format issue

## What I've Tried (All Failed)
1. Using native `blurt.auth.sign` - Function doesn't exist in the library
2. Detecting and handling pre-hashed messages (32-byte buffers)
3. Detecting and handling hex-encoded hashes (64-char strings)
4. Reverting to simplest possible implementation

## Current Implementation
The `signMessage` function now uses the simplest approach:
- Convert message to Buffer
- Hash with SHA256
- Sign with private key
- Return signature with BLT prefix on public key

## Possible Root Causes

### 1. The Issue Might Not Be in signMessage
The problem could be in:
- `SignRequest.tsx` - How the sign request is processed
- `background/index.ts` - How the request is routed
- `provider.ts` - How the dApp communicates with the extension

### 2. Configuration Issue
Blurt might need specific configuration that's not being set:
- Chain ID
- Address prefix
- API endpoint

### 3. Message Format
The image upload service might be sending the message in a format that's not being handled correctly:
- Could be sending additional metadata
- Could be expecting a specific response format
- Could be using a different signing algorithm

## Recommended Next Steps

### Option 1: Compare with Working Extension
If you have access to a working Blurt wallet extension (like Blurt Keychain or another that works with image upload):
1. Inspect the network request it makes
2. Compare the signature format
3. Check what data is being sent

### Option 2: Add Debug Logging
Add console.log statements to see:
1. What message is being received for signing
2. What signature is being generated
3. What's being sent back to the dApp

### Option 3: Check Git History
If this was working before, check git history to see:
1. What was the exact implementation that worked
2. What changes were made that broke it

## Code Locations
- `services/chainService.ts` - Line 618-660: `signMessage` function
- `components/SignRequest.tsx` - Line 170-177: Sign buffer handling
- `src/background/index.ts` - Line 221: Sign buffer detection

## Test Case
To test if signing is working correctly:
```javascript
// In browser console on blurt.blog or beblurt.com
const msg = "test message";
const result = await window.blurt.signBuffer('username', msg, 'Posting');
console.log(result);
```

This should return a signature without errors.
