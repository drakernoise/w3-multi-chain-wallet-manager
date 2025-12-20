
const { PrivateKey } = require('@hiveio/dhive');
const crypto = require('crypto');

const key = PrivateKey.fromLogin('username', 'password', 'posting');
const msg = "test message";
const hash = crypto.createHash('sha256').update(msg).digest();
const sig = key.sign(hash);

console.log("Sig:", sig.toString());
console.log("Recovery ID (v):", sig.recoverId);
// dhive typically adds 31 to recoveryId
console.log("recovery param:", sig.recoverId + 31);
