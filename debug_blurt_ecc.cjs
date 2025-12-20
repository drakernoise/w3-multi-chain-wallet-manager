
const blurt = require('@blurtfoundation/blurtjs');

console.log("blurt.auth.ecc keys:", Object.keys(blurt.auth.ecc || {}));
try {
    if (blurt.auth.ecc) {
        console.log("Signature present?", !!blurt.auth.ecc.Signature);
        console.log("KeyPrivate present?", !!blurt.auth.ecc.PrivateKey);
    }
} catch (e) {
    console.error(e);
}
