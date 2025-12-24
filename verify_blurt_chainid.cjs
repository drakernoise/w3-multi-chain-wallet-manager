const fetch = require('node-fetch');

async function getBlurtChainId() {
    const nodes = [
        'https://rpc.beblurt.com',
        'https://blurt-rpc.saboin.com',
        'https://rpc.blurt.world'
    ];

    for (const node of nodes) {
        try {
            console.log(`\nTrying node: ${node}`);

            // Get chain properties
            const response = await fetch(node, {
                method: 'POST',
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'database_api.get_config',
                    params: {},
                    id: 1
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            const json = await response.json();
            console.log('Response:', JSON.stringify(json, null, 2));

            if (json.result && json.result.BLURT_CHAIN_ID) {
                console.log('\n✓ BLURT_CHAIN_ID:', json.result.BLURT_CHAIN_ID);
                return json.result.BLURT_CHAIN_ID;
            }

        } catch (error) {
            console.error(`Error with ${node}:`, error.message);
        }
    }

    console.log('\nTrying alternative method...');
    // Try condenser_api
    for (const node of nodes) {
        try {
            const response = await fetch(node, {
                method: 'POST',
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'condenser_api.get_version',
                    params: [],
                    id: 1
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            const json = await response.json();
            console.log(`\n${node} version:`, JSON.stringify(json, null, 2));

            if (json.result && json.result.chain_id) {
                console.log('\n✓ chain_id:', json.result.chain_id);
                return json.result.chain_id;
            }

        } catch (error) {
            console.error(`Error:`, error.message);
        }
    }
}

getBlurtChainId();
