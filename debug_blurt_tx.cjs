
const blurt = require('@blurtfoundation/blurtjs');
const { PrivateKey } = require('@hiveio/dhive');

const key = PrivateKey.fromLogin('username', 'password', 'posting');
const WIF = key.toString();

const tx = {
    expiration: '2025-12-20T00:00:00',
    extensions: [],
    operations: [['vote', { voter: 'test', author: 'test', permlink: 'test', weight: 100 }]],
    ref_block_num: 1,
    ref_block_prefix: 1
};

try {
    const signed = blurt.auth.signTransaction(tx, [WIF]);
    console.log("Blurt Signed Tx Sig:", signed.signatures[0]);

    // Now verify this signature with dhive?
    // How to get the digest of the transaction? 
    // Usually serialization + chainId + hash.
} catch (e) {
    console.log("Blurt signTransaction failed:", e.message);
}
