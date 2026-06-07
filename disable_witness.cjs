const blurt = require('@blurtfoundation/blurtjs');
const fs = require('fs');

const env = fs.readFileSync('/home/pablo/blurt-witness-node/secrets.env', 'utf8');
const ACTIVE_KEY = env.match(/BLURT_ACTIVE_KEY=(.*)/)[1].trim();
const ACCOUNT = 'drakernoise';

if (!ACTIVE_KEY) {
    console.error('Missing BLURT_ACTIVE_KEY');
    process.exit(1);
}

// Config
blurt.config.set('address_prefix', 'BLT');
blurt.config.set('chain_id', 'cd8d90f29ae273abec3eaa7731e25934c63eb654d55080caff2ebb7f5df6381f');

async function main() {
    console.log('🔴 Disabling witness (Setting signing key to NULL)...');

    const props = {
        account_creation_fee: '300.000 BLURT',
        maximum_block_size: 65536
    };

    try {
        const result = await blurt.broadcast.witnessUpdateAsync(
            ACTIVE_KEY,
            ACCOUNT,
            'https://drakernoise.com/blurt_witness/',
            'BLT1111111111111111111111111111111114T1Anm',
            props,
            '0.000 BLURT'
        );
        console.log('Success: Witness disabled.', result);
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
