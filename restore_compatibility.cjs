const blurt = require('@blurtfoundation/blurtjs');
const { PrivateKey } = require('@blurtfoundation/blurtjs/lib/auth/ecc');
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

const nodes = [
    'https://blurt-rpc.saboin.com',
    'https://api.blurt.blog',
    'https://rpc.mahdiyari.info'
];

async function main() {
    console.log('Attempting to restore witness compatibility (STEEM symbol)...');

    const props = {
        account_creation_fee: '3.000 STEEM',
        maximum_block_size: 65536
    };

    for (const node of nodes) {
        console.log(`Trying node: ${node}`);
        blurt.api.setOptions({ url: node });

        try {
            const result = await blurt.broadcast.witnessUpdateAsync(
                ACTIVE_KEY,
                ACCOUNT,
                'https://drakernoise.com/blurt_witness/',
                'BLT1111111111111111111111111111111114T1Anm', // Stay disabled
                props,
                '0.000 STEEM'
            );
            console.log('Success:', result);
            return;
        } catch (err) {
            console.error(`Error on node ${node}:`, err.message || err);
        }
    }
}

main();
