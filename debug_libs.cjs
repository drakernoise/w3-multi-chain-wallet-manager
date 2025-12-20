
const blurt = require('@blurtfoundation/blurtjs');
const { PrivateKey: DhiveKey } = require('@hiveio/dhive');
const { PrivateKey: SteemKey } = require('dsteem');
const crypto = require('crypto');

const keyStr = '5HsoxWiHRRyx6oSxKj32HDqDMzSGhs79zLZopDc7nMcjMbcPp5E';
const msg = "test message";
const msgBuf = Buffer.from(msg);
const hash = crypto.createHash('sha256').update(msgBuf).digest();

// Dhive
const dKey = DhiveKey.fromString(keyStr);
const dSig = dKey.sign(hash).toString();

// Dsteem
const sKey = SteemKey.fromString(keyStr);
const sSig = sKey.sign(hash).toString();

console.log("Dhive Sig:", dSig);
console.log("Dsteem Sig:", sSig);

console.log("Match?", dSig === sSig);

// Compare with Blurt Verify
try {
    const vD = blurt.auth.verify(msg, dSig, keyStr);
    console.log("Verify Dhive:", vD);
} catch (e) { }

try {
    const vS = blurt.auth.verify(msg, sSig, keyStr);
    console.log("Verify Dsteem:", vS);
} catch (e) { }
