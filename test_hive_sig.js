import { PrivateKey, Signature } from 'hive-tx';

// Use a dummy key for testing (don't worry, it's throwaway)
// public: STM5K3D22b...
const keyStr = "5JRaypasxMx1L97ZUX76857fToRcCvYvNxv56qJ9nnd8ZpG9d92";
const msg = "test";

try {
    const key = PrivateKey.from(keyStr);
    console.log("Key loaded:", key.createPublic().toString());

    // Attempt 1: Static signBuffer
    try {
        // @ts-ignore
        const sig = Signature.signBuffer(msg, key);
        console.log("Method A (Static) Success!");
        console.log("Sig type:", typeof sig);
        console.log("Sig keys:", Object.keys(sig));
    } catch (e) {
        console.log("Method A Failed:", e.message);
    }

    // Attempt 2: Instance sign
    try {
        const hash = require('crypto').createHash('sha256').update(msg).digest();
        const sig = key.sign(hash);
        console.log("Method B (Instance) Success!");
        console.log("Sig keys:", Object.keys(sig));
        console.log("Proto:", sig.__proto__);

        // Try serialization methods
        if (sig.toHex) console.log("toHex():", sig.toHex());
        else console.log("toHex missing");

        if (sig.toString) console.log("toString():", sig.toString());

        // Check properties r, s
        console.log("r:", sig.r ? sig.r.toString() : "missing");

    } catch (e) {
        console.log("Method B Failed:", e.message);
    }

} catch (e) {
    console.error("Fatal:", e);
}
