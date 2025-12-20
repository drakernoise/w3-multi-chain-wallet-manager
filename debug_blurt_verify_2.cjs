
const blurt = require('@blurtfoundation/blurtjs');
const { PrivateKey, Signature } = require('@hiveio/dhive');
const crypto = require('crypto');

const key = PrivateKey.fromLogin('username', 'password', 'posting');
const WIF = key.toString();
const msg = "test message";
const msgBuf = Buffer.from(msg);
const hash = crypto.createHash('sha256').update(msgBuf).digest();
const sig = key.sign(hash);
const sigHex = sig.toString();

console.log("Sig Hex:", sigHex);

console.log("Keys on blurt:", Object.keys(blurt));
// Check strict verification
try {
    // Attempt 2: Verify SHA256 Hash
    console.log("Attempt 2: Verify HASH + hex signature");
    const valid2 = blurt.auth.verify(hash.toString('hex'), sigHex, WIF);
    console.log("Result 2 (hash hex):", valid2);
} catch (e) { console.log(e.message); }

try {
    const valid3 = blurt.auth.verify(hash, sigHex, WIF);
    console.log("Result 3 (hash buffer):", valid3);
} catch (e) { console.log(e.message); }

// Is there blurt.signature?
// @ts-ignore
if (blurt.signature) {
    console.log("Found blurt.signature");
}
