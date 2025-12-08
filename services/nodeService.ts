import { Chain } from '../types';

// Candidate Nodes
export const HIVE_CANDIDATES = [
    'https://api.openhive.network',
    'https://api.hive.blog',
    'https://api.deathwing.me',
    'https://anyx.io',
    'https://rpc.ausbit.dev',
];

export const STEEM_CANDIDATES = [
    'https://api.steemit.com',
    'https://api.justyy.com',
    'https://api.moecki.online',
    'https://steem.61dom.com'
];

export const BLURT_CANDIDATES = [
    'https://rpc.blurt.world',
    'https://rpc.beblurt.com',
    'https://blurt-rpc.saboin.com',
    'https://rpc.blurt.one'
];

// Active nodes state (in-memory)
// Defaulting to the first one until benchmarked
let activeNodes: Record<Chain, string> = {
    [Chain.HIVE]: HIVE_CANDIDATES[0],
    [Chain.STEEM]: STEEM_CANDIDATES[0],
    [Chain.BLURT]: BLURT_CANDIDATES[0]
};

// Simple latency check
const checkNodeLatency = async (url: string): Promise<number> => {
    const start = Date.now();
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

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

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        if (!json.result) throw new Error('Invalid response structure');

        return Date.now() - start;
    } catch (e) {
        return 99999; // Penalty for failure
    }
};

export const benchmarkNodes = async (): Promise<void> => {
    console.log("Starting Node Benchmark...");

    await Promise.all([
        findBestNode(Chain.HIVE, HIVE_CANDIDATES),
        findBestNode(Chain.STEEM, STEEM_CANDIDATES),
        findBestNode(Chain.BLURT, BLURT_CANDIDATES),
    ]);

    console.log("Benchmark Complete:", activeNodes);
};

const findBestNode = async (chain: Chain, candidates: string[]) => {
    const latencies = await Promise.all(
        candidates.map(async (url) => {
            const latency = await checkNodeLatency(url);
            return { url, latency };
        })
    );

    // Sort by latency
    latencies.sort((a, b) => a.latency - b.latency);

    const best = latencies[0];
    if (best.latency < 99999) {
        activeNodes[chain] = best.url;
        console.log(`Best node for ${chain}: ${best.url} (${best.latency}ms)`);
    } else {
        console.warn(`All nodes failed for ${chain}, keeping default: ${activeNodes[chain]}`);
    }
};

export const getActiveNode = (chain: Chain): string => {
    return activeNodes[chain];
};
