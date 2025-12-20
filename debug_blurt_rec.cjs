
const blurt = require('@blurtfoundation/blurtjs');
const { PrivateKey } = require('@hiveio/dhive');
const crypto = require('crypto');

const key = PrivateKey.fromLogin('username', 'password', 'posting');
const WIF = key.toString();
const msg = "test message";
const msgBuf = Buffer.from(msg);
const hash = crypto.createHash('sha256').update(msgBuf).digest();

const sig = key.sign(hash);
const sigBuf = sig.toBuffer(); // 65 bytes: 1 header + 32 r + 32 s

console.log("Original Header:", sigBuf[0]);

// Try variations
for (let i = 27; i < 40; i++) {
    const newBuf = Buffer.from(sigBuf);
    newBuf[0] = i;
    const hex = newBuf.toString('hex');

    try {
        if (blurt.auth.verify(msg, hex, WIF)) {
            console.log(`MATCH FOUND! Header: ${i} (Raw Msg)`);
        }
        if (blurt.auth.verify(hash, hex, WIF)) {
            console.log(`MATCH FOUND! Header: ${i} (Hash Buf)`);
        }
    } catch (e) { }

    // Also try for i + 4 (compressed flag usually changes things)
}

// Try uncompressed?
// dhive keys are usually compressed.
