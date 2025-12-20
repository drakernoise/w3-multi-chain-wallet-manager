
const blurt = require('@blurtfoundation/blurtjs');

console.log("blurt.auth keys:", Object.keys(blurt.auth || {}));
try {
    const wif = '5JRaypasxMx1L97ZUX7DA1vCuFq1uWAellaunonk92hyvW09639';
    // Check if Signature exists
    // @ts-ignore
    if (blurt.auth.Signature) {
        console.log("blurt.auth.Signature exists");
    }
} catch (e) {
    console.error(e);
}
