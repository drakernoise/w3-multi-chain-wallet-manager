
const blurt = require('@blurtfoundation/blurtjs');
const { PrivateKey } = require('@hiveio/dhive');
const crypto = require('crypto');

// Generate a valid key
const key = PrivateKey.fromLogin('username', 'password', 'posting');
const WIF = key.toString();
const msg = "test message";

console.log("Generated Key:", WIF);

// 1. Sign with dhive
// dhive/dsteem usually sign the SHA256 hash of the message
const msgBuf = Buffer.from(msg);
const hash = crypto.createHash('sha256').update(msgBuf).digest();
const sig = key.sign(hash);
const sigHex = sig.toString(); // Hex string

console.log("Msg:", msg);
console.log("Sig dhive (Hex):", sigHex);

// 2. Verify with blurtjs
try {
    // blurt.auth.verify(message, signature, key)
    // Note: older steam-js/blurt-js libs often digest the message internally if you pass a string.
    // Let's try passing the raw string first.
    console.log("Attempt 1: Verify raw message + hex signature");
    const isValid = blurt.auth.verify(msg, sigHex, WIF);
    console.log("Result 1:", isValid);
} catch (e) { console.log("Error 1:", e.message); }

// 3. Public Key Check
const dhivePub = key.createPublic().toString(); // STM...
const blurtPub = blurt.auth.wifToPublic(WIF); // BLT...

console.log("dhive Pub:", dhivePub);
console.log("blurt Pub:", blurtPub);

const dhiveSuffix = dhivePub.replace(/^STM/, '');
const blurtSuffix = blurtPub.replace(/^BLT/, '');
console.log("Suffix match:", dhiveSuffix === blurtSuffix);
