
const https = require('https');

const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'condenser_api.get_dynamic_global_properties',
    params: [],
    id: 1
});

const options = {
    hostname: 'rpc.blurt.world',
    port: 443,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        try {
            const json = JSON.parse(body);
            console.log(JSON.stringify(json.result, null, 2));
        } catch (e) {
            console.error("Parse error:", body);
        }
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
