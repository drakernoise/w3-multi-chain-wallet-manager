#!/usr/bin/env node

/**
 * Node Benchmark Script
 * Tests all configured nodes and generates a performance report
 */

const nodes = {
    HIVE: [
        'https://api.hive.blog',
        'https://api.openhive.network',
        'https://hive-api.arcange.eu',
        'https://techcoderx.com',
        'https://api.deathwing.me',
    ],
    STEEM: [
        'https://api.steemit.com',
        'https://api.steem.fans',
        'https://api.steememory.com',
    ],
    BLURT: [
        'https://rpc.drakernoise.com',
        'https://rpc.beblurt.com',
        'https://blurt-rpc.saboin.com',
        'https://rpc.blurt.world',
    ]
};

const checkNodeLatency = async (url, chain) => {
    const start = Date.now();
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for script

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'condenser_api.get_dynamic_global_properties',
                params: [],
                id: 1
            }),
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return { url, latency: null, status: response.status, error: `HTTP ${response.status}` };
        }

        const json = await response.json();
        if (!json.result) {
            return { url, latency: null, status: response.status, error: 'Invalid response structure' };
        }

        const latency = Date.now() - start;
        return { url, latency, status: response.status, error: null };
    } catch (e) {
        const latency = Date.now() - start;
        return { 
            url, 
            latency: latency < 10000 ? latency : null, 
            status: null, 
            error: e.name === 'AbortError' ? 'Timeout (10s)' : e.message 
        };
    }
};

const benchmarkChain = async (chainName, urls) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing ${chainName} nodes (${urls.length} nodes)`);
    console.log('='.repeat(60));

    const results = await Promise.all(
        urls.map(url => checkNodeLatency(url, chainName))
    );

    // Sort by latency (fastest first), nulls last
    results.sort((a, b) => {
        if (a.latency === null && b.latency === null) return 0;
        if (a.latency === null) return 1;
        if (b.latency === null) return -1;
        return a.latency - b.latency;
    });

    console.log('\nResults:');
    console.log('-'.repeat(60));
    
    results.forEach((result, index) => {
        const rank = index + 1;
        const status = result.latency !== null ? '✓' : '✗';
        const latencyStr = result.latency !== null 
            ? `${result.latency}ms` 
            : 'FAILED';
        const errorStr = result.error ? ` (${result.error})` : '';
        const statusCodeStr = result.status ? ` [HTTP ${result.status}]` : '';
        
        console.log(`${rank}. ${status} ${result.url}`);
        console.log(`   Latency: ${latencyStr}${statusCodeStr}${errorStr}`);
    });

    const successful = results.filter(r => r.latency !== null);
    const fastest = successful[0];
    
    if (fastest) {
        console.log(`\n🏆 Fastest node: ${fastest.url} (${fastest.latency}ms)`);
        console.log(`📊 Success rate: ${successful.length}/${urls.length} (${Math.round(successful.length/urls.length*100)}%)`);
        
        if (successful.length > 1) {
            const avgLatency = successful.reduce((sum, r) => sum + r.latency, 0) / successful.length;
            console.log(`📈 Average latency (successful): ${Math.round(avgLatency)}ms`);
        }
    } else {
        console.log(`\n❌ All nodes failed for ${chainName}`);
    }

    return { chainName, results, fastest: fastest || null, successRate: successful.length / urls.length };
};

const main = async () => {
    console.log('\n🔍 Node Benchmark Report');
    console.log('Generated:', new Date().toISOString());
    console.log('\nThis script tests all configured RPC nodes for each blockchain.');

    const allResults = [];

    for (const [chainName, urls] of Object.entries(nodes)) {
        const result = await benchmarkChain(chainName, urls);
        allResults.push(result);
    }

    // Summary
    console.log(`\n${'='.repeat(60)}`);
    console.log('SUMMARY');
    console.log('='.repeat(60));

    allResults.forEach(({ chainName, fastest, successRate }) => {
        console.log(`\n${chainName}:`);
        if (fastest) {
            console.log(`  Recommended: ${fastest.url} (${fastest.latency}ms)`);
            console.log(`  Success rate: ${Math.round(successRate * 100)}%`);
        } else {
            console.log(`  ⚠️  No working nodes found`);
        }
    });

    console.log('\n' + '='.repeat(60));
    console.log('Benchmark complete!');
    console.log('='.repeat(60) + '\n');
};

main().catch(console.error);
