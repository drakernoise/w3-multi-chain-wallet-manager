const blurt = require('@blurtfoundation/blurtjs');
console.log('Blurt keys:', Object.keys(blurt));
if (blurt.auth) console.log('Blurt auth keys:', Object.keys(blurt.auth));
if (blurt.auth && blurt.auth.PrivateKey) console.log('PrivateKey found in auth');
if (blurt.PrivateKey) console.log('PrivateKey found in root');
