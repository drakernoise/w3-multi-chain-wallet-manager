
const https = require('https');

async function getChainId() {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            jsonrpc: "2.0",
            method: "database_api.get_config",
            params: {},
            id: 1
        });

        const req = https.request('https://rpc.beblurt.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    if (json.result) {
                        console.log("Blurt Chain ID:", json.result.BLURT_CHAIN_ID || json.result.STEEM_CHAIN_ID || json.result.ISOLATED_CHAIN_ID);
                        console.log("Full Config (Partial):", JSON.stringify(json.result).substring(0, 200));
                    } else {
                        console.log("Error:", json);
                    }
                } catch (e) {
                    console.log("Invalid JSON", body);
                }
                resolve();
            });
        });

        req.write(data);
        req.end();
    });
}

getChainId();
