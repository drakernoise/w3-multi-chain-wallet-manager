
const blurt = require('@blurtfoundation/blurtjs');
const { PrivateKey } = require('@hiveio/dhive');
const crypto = require('crypto');

const key = PrivateKey.fromLogin('username', 'password', 'posting');
const WIF = key.toString();
const msg = "test message";
const msgBuf = Buffer.from(msg);
const hash = crypto.createHash('sha256').update(msgBuf).digest();

// 1. Standard Dhive Sign
const sig = key.sign(hash);
const sigHex = sig.toString();

console.log("Trying to verify dhive signature with blurt.auth.verify...");

// Helper logic to mimic blurt verify
const verify = (message, signature) => {
    try {
        return blurt.auth.verify(message, signature, WIF);
    } catch (e) {
        return "Error: " + e.message;
    }
};

console.log("1. Raw Msg, Hex Sig:", verify(msg, sigHex));
console.log("2. Hash Buf, Hex Sig:", verify(hash, sigHex));
console.log("3. Hash Hex, Hex Sig:", verify(hash.toString('hex'), sigHex));

// Maybe Blurt expects the message NOT to be hashed?
// If blurt.auth.verify hashes internally...
const sigRawMsg = key.sign(crypto.createHash('sha256').update(msg).digest()); // Same as above
// What if we sign the raw message buffer without hashing? (Invalid for ECDSA usually)

// What if we double hash?
const doubleHash = crypto.createHash('sha256').update(hash).digest();
const sigDouble = key.sign(doubleHash).toString();
console.log("4. Raw Msg, Double Hash Sig:", verify(msg, sigDouble));

