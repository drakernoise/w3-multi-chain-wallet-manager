# How to Capture a Working Blurt Image Upload Signature

## Steps to Capture from Working Frontend

### 1. Open Browser DevTools
- Go to a working Blurt frontend (e.g., beblurt.com or blurt.blog)
- Open DevTools (F12)
- Go to the **Network** tab
- Filter by "Fetch/XHR"

### 2. Trigger Image Upload
- Try to upload an image using the working wallet extension
- Watch the Network tab for requests to `img-upload.blurt.world`

### 3. Capture the Request
Look for a POST request to a URL like:
```
https://img-upload.blurt.world/[username]/[signature]
```

**Capture these details:**
1. **The full URL** (especially the signature part)
2. **Request Headers**
3. **Request Payload** (if any)
4. **The image file hash** (if visible)

### 4. Capture the Signature Call
In the **Console** tab, you can also intercept the signing call:

```javascript
// Override the sign function to log what's being signed
const originalSign = window.blurt.signBuffer;
window.blurt.signBuffer = function(username, message, keyType, callback) {
    console.log('=== SIGN BUFFER CALLED ===');
    console.log('Username:', username);
    console.log('Message:', message);
    console.log('Message type:', typeof message);
    console.log('Message length:', message?.length);
    console.log('Key type:', keyType);
    
    // If message is a buffer/object, log its structure
    if (typeof message === 'object') {
        console.log('Message object:', JSON.stringify(message));
    }
    
    // Call original and log result
    return originalSign.call(this, username, message, keyType, function(err, result) {
        console.log('=== SIGN RESULT ===');
        console.log('Error:', err);
        console.log('Result:', result);
        if (callback) callback(err, result);
    });
};

console.log('Sign interceptor installed. Now try uploading an image.');
```

### 5. What to Look For

Compare these values:

**Message Format:**
- Is it a string, buffer, or hex?
- What's the exact length?
- Is it the raw file data or a hash?

**Signature Format:**
- Length of the signature
- Does it start with specific bytes?
- Is it hex-encoded?

**Public Key:**
- Does it have BLT prefix?
- Is it included in the request?

### 6. Share the Data

Once captured, share:
1. The message that was signed (first 100 chars if long)
2. The resulting signature
3. The public key returned
4. The full request URL to img-upload.blurt.world

## Example of What We're Looking For

```
Message: "1f2e1ac76a135ee39455cc7b8c09c2f9045f56cb9730f7103f20e3e9ad3e04d38d212487cbefd35ce7bf4f2e722fe1bdfa699a02702f6ea647a4076dbdd66013ca"
Message Type: string
Message Length: 128
Signature: "1f5420952036b0225f5752713fe977da3c74e30e682927e0fd78acbb127748bfdb2420d59ce8afd6aebbd71ff703b649d314c6168c8fe29ec515d13dc062b14450"
Public Key: "BLT6gZmazY23TEMkxmPpnmvbAgWFAzwtaSDbhSUdmpTXzoJJLPFH4"
```

This will tell us exactly what format the image upload service expects.
