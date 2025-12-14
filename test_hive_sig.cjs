const hiveTx = require('hive-tx');
const crypto = require('crypto');
const { PrivateKey, Signature } = hiveTx;

const keyStr = "5JRaypasxMx1L97ZUX76857fToRcCvYvNxv56qJ9nnd8ZpG9d92";
const msg = "test";

try {
    const key = PrivateKey.from(keyStr);
    console.log("Key loaded:", key.createPublic().toString());

    // Attempt 1: Static signBuffer
    try {
        if (Signature.signBuffer) {
            const sig = Signature.signBuffer(msg, key);
            console.log("Method A (Static) Success!");
            console.log("Sig type:", typeof sig);
            // Check serialization
            console.log("toHex?:", sig.toHex ? sig.toHex() : "no");
        } else {
            console.log("Method A: Signature.signBuffer does not exist");
        }
    } catch (e) {
        console.log("Method A Failed:", e.message);
    }

    // Attempt 2: Instance sign
    try {
        const hash = crypto.createHash('sha256').update(msg).digest();
        const sig = key.sign(hash);
        console.log("Method B (Instance) Success!");
        console.log("Sig prototype:", Object.getPrototypeOf(sig));
        console.log("Sig keys:", Object.keys(sig));

        if (sig.toHex) console.log("toHex():", sig.toHex());
        else console.log("toHex missing");

        if (sig.toString) console.log("toString():", sig.toString());

    } catch (e) {
        console.log("Method B Failed:", e.message);
    }

} catch (e) {
    console.error("Fatal:", e);
}
