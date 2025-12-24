
const https = require('https');

const nodes = [
    'https://rpc.blurt.world',
    'https://api.blurt.blog',
    'https://rpc.beblurt.com',
    'https://blurt-rpc.saboin.com',
    'https://rpc.blurt.one'
];

async function checkNode(url) {
    return new Promise((resolve) => {
        const start = Date.now();
        const data = JSON.stringify({
            jsonrpc: "2.0",
            method: "condenser_api.get_dynamic_global_properties",
            params: [],
            id: 1
        });

        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            timeout: 5000 // 5s timeout
        }, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                const time = Date.now() - start;
                try {
                    const json = JSON.parse(body);
                    if (json.result) {
                        console.log(`✅ [${res.statusCode}] ${url} - ${time}ms - Head Block: ${json.result.head_block_number}`);
                        resolve(true);
                    } else {
                        console.log(`❌ [${res.statusCode}] ${url} - Error: ${JSON.stringify(json.error).substring(0, 100)}`);
                        resolve(false);
                    }
                } catch (e) {
                    console.log(`❌ [${res.statusCode}] ${url} - Invalid JSON`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`❌ ${url} - Connection Error: ${e.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            req.destroy();
            console.log(`❌ ${url} - Timeout (5s)`);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
}

async function run() {
    console.log("Checking Blurt RPC Nodes...");
    await Promise.all(nodes.map(checkNode));
}

run();
