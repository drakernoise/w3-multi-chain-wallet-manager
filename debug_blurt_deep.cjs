
const blurt = require('@blurtfoundation/blurtjs');
const { PrivateKey, Signature } = require('@hiveio/dhive');
const crypto = require('crypto');

const key = PrivateKey.fromLogin('username', 'password', 'posting');
const WIF = key.toString();
const msg = "test message";
const hash = crypto.createHash('sha256').update(msg).digest();
const sig = key.sign(hash);

// Manually verify using blurt's internal crypto if accessible, or try to reconstruct
// Inspect blurt keys again
console.log("blurt keys:", Object.keys(blurt));

// Try to use blurt.auth.signature if it exists
try {
    const s = blurt.auth.Signature.fromHex(sig.toString());
    console.log("Parsed Sig:", s);
} catch (e) {
    console.log("blurt.auth.Signature access failed");
}

// Check if verification works if we tell it the pubkey?
// blurt.auth.verify(msg, sig, pubKey)
const pub = blurt.auth.wifToPublic(WIF);
console.log("Verify with PubKey:", blurt.auth.verify(msg, sig.toString(), pub));

