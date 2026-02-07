import { Chain } from '../types';

// Candidate Nodes
export const HIVE_CANDIDATES = [
    'https://api.hive.blog',
    'https://api.openhive.network',
    'https://hive-api.arcange.eu',
    'https://techcoderx.com',
    'https://api.deathwing.me',
];

export const STEEM_CANDIDATES = [
    'https://api.steemit.com',
    'https://api.steem.fans',
    'https://api.steememory.com',
];

export const BLURT_CANDIDATES = [
    'https://rpc.drakernoise.com', // Primary node (user's own node)
    'https://rpc.beblurt.com', // Fallback nodes
    'https://blurt-rpc.saboin.com',
    'https://rpc.blurt.world',
];

// Active nodes state (in-memory)
// Defaulting to the first one until benchmarked
// For Blurt, this is the user's own node (rpc.drakernoise.com)
let activeNodes: Record<Chain, string> = {
    [Chain.HIVE]: HIVE_CANDIDATES[0],
    [Chain.STEEM]: STEEM_CANDIDATES[0],
    [Chain.BLURT]: BLURT_CANDIDATES[0] // https://rpc.drakernoise.com (user's primary node)
};

// Multiple latency checks for more accurate benchmarking
const checkNodeLatency = async (url: string, iterations: number = 3): Promise<number> => {
    const latencies: number[] = [];

    for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'condenser_api.get_dynamic_global_properties',
                    params: [],
                    id: 1
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // If any test fails, return penalty
                return 99999;
            }

            const json = await response.json();
            if (!json.result) {
                return 99999;
            }

            const latency = Date.now() - start;
            latencies.push(latency);

            // Small delay between tests to avoid overwhelming the server
            if (i < iterations - 1) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        } catch (e) {
            // If any test fails, return penalty
            return 99999;
        }
    }

    // Return average latency if all tests succeeded
    if (latencies.length === iterations) {
        const sum = latencies.reduce((a, b) => a + b, 0);
        return Math.round(sum / latencies.length);
    }

    return 99999; // Penalty for failure
};

export const benchmarkNodes = async (): Promise<void> => {
    // console.log("Starting Node Benchmark...");

    // Prefer primary Blurt node if it is reachable, to respect custom infrastructure
    const primaryBlurt = BLURT_CANDIDATES[0];
    const primaryBlurtLatency = await checkNodeLatency(primaryBlurt, 1);
    if (primaryBlurtLatency < 99999) {
        activeNodes[Chain.BLURT] = primaryBlurt;
    } else {
        await findBestNode(Chain.BLURT, BLURT_CANDIDATES);
    }

    await Promise.all([
        findBestNode(Chain.HIVE, HIVE_CANDIDATES),
        findBestNode(Chain.STEEM, STEEM_CANDIDATES)
    ]);

    // console.log("Benchmark Complete:", activeNodes);
};

const findBestNode = async (chain: Chain, candidates: string[]) => {
    // Benchmark all nodes and select the fastest one
    const latencies = await Promise.all(
        candidates.map(async (url) => {
            const latency = await checkNodeLatency(url);
            return { url, latency };
        })
    );

    // Sort by latency (fastest first)
    latencies.sort((a, b) => a.latency - b.latency);

    const best = latencies[0];
    if (best.latency < 99999) {
        activeNodes[chain] = best.url;
        // console.log(`Best node for ${chain}: ${best.url} (${best.latency}ms)`);
    } else {
        // Silently keep default if all fail to avoid user confusion
        // console.debug(`All nodes failed for ${chain}, keeping default: ${activeNodes[chain]}`);
    }
};

export const getActiveNode = (chain: Chain): string => {
    return activeNodes[chain];
};

export const updateActiveNode = (chain: Chain, url: string): void => {
    activeNodes[chain] = url;
    console.log(`Switched active node for ${chain} to ${url}`);
};
