
const blurt = require('@blurtfoundation/blurtjs');

// Mock a private key (randomly generated for testing, DO NOT USE IN PROD)
// This is a valid format WIF for testing purposes
const WIF = '5JRaypasxMx1L97ZUX7DA1vCuFq1uWAellaunonk92hyvW09639';
const msg = "test message";

try {
    console.log("Testing blurt.auth.sign...");
    // @ts-ignore
    const sig = blurt.auth.sign(msg, WIF);
    console.log("Signature:", sig);

    // Verify
    // @ts-ignore
    const valid = blurt.auth.verify(msg, sig, WIF); // This might need pub key, usually verify(msg, sig, pubKey)
    console.log("Verification via library (incomplete check):", valid);

    // Get public key
    const pub = blurt.auth.wifToPublic(WIF);
    console.log("Public Key:", pub);

} catch (e) {
    console.error("Error:", e);
}
