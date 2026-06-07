import { Chain } from '../types';

// Candidate Nodes
export const HIVE_CANDIDATES = [
    'https://api.hive.blog',
    'https://api.deathwing.me',
    'https://hive-api.arcange.eu',
    'https://techcoderx.com',
    'https://api.openhive.network',
];

export const STEEM_CANDIDATES = [
    'https://api.steemit.com',
    'https://api.steem.fans',
    'https://api.steememory.com',
];

export const BLURT_CANDIDATES = [
    'https://rpc.drakernoise.com', // Primary node (user's own node)
    'https://api.blurt.blog',      // Fallback nodes
    'https://blurt-rpc.saboin.com',
    'https://rpc.mahdiyari.info'
];

const sanitizeNode = (chain: Chain, node?: string): string | undefined => {
    if (!node) return undefined;
    if (node.includes('blurt.world')) {
        return chain === Chain.BLURT ? BLURT_CANDIDATES[0] : undefined;
    }
    return node;
};

// Active nodes state (in-memory)
// Defaulting to the first one until benchmarked
// For Blurt, this is the user's own node (rpc.drakernoise.com)
let activeNodes: Record<Chain, string> = {
    [Chain.HIVE]: HIVE_CANDIDATES[0],
    [Chain.STEEM]: STEEM_CANDIDATES[0],
    [Chain.BLURT]: BLURT_CANDIDATES[0] // https://rpc.drakernoise.com (user's primary node)
};

// Flag to track if we've synced from storage
let nodesSyncedFromStorage = false;

// Sync nodes from chrome.storage.local (for popup/content script contexts)
const syncNodesFromStorage = async (): Promise<void> => {
    if (nodesSyncedFromStorage) return;
    try {
        // @ts-ignore - chrome may not exist in all contexts
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
            const result = await chrome.storage.local.get(['gravity_active_nodes']);
            if (result.gravity_active_nodes) {
                const stored = result.gravity_active_nodes;
                if (stored.HIVE) activeNodes[Chain.HIVE] = sanitizeNode(Chain.HIVE, stored.HIVE) || activeNodes[Chain.HIVE];
                if (stored.STEEM) activeNodes[Chain.STEEM] = sanitizeNode(Chain.STEEM, stored.STEEM) || activeNodes[Chain.STEEM];
                if (stored.BLURT) activeNodes[Chain.BLURT] = sanitizeNode(Chain.BLURT, stored.BLURT) || activeNodes[Chain.BLURT];
                if (stored.BLURT !== activeNodes[Chain.BLURT]) {
                    await chrome.storage.local.set({
                        gravity_active_nodes: {
                            ...stored,
                            BLURT: activeNodes[Chain.BLURT]
                        }
                    });
                }
                console.log('[NodeService] Synced nodes from storage:', activeNodes);
            }
        }
    } catch (e) {
        // Ignore - storage may not be available
    }
    nodesSyncedFromStorage = true;
};

// Initialize sync on module load
syncNodesFromStorage();

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
                    'Content-Type': 'application/json'
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

    const benchmarkBlurt = async () => {
        // Prefer primary Blurt node if it is reachable, to respect custom infrastructure
        const primaryBlurt = BLURT_CANDIDATES[0];
        const primaryLatency = await checkNodeLatency(primaryBlurt);
        if (primaryLatency < 99999) {
            activeNodes[Chain.BLURT] = primaryBlurt;
        } else {
            await findBestNode(Chain.BLURT, BLURT_CANDIDATES.slice(1));
        }
    };

    // Run all chain benchmarks in parallel to improve performance
    await Promise.all([
        benchmarkBlurt(),
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
    // Ensure we have a valid URL - never return undefined
    const node = activeNodes[chain];
    if (!node) {
        // Fallback to defaults if somehow undefined
        const defaults: Record<Chain, string> = {
            [Chain.HIVE]: 'https://api.hive.blog',
            [Chain.STEEM]: 'https://api.steemit.com',
            [Chain.BLURT]: 'https://rpc.drakernoise.com'
        };
        return defaults[chain] || 'https://api.hive.blog';
    }
    return node;
};

// Ensure sync happens and return active node (async version for reliability)
export const getActiveNodeAsync = async (chain: Chain): Promise<string> => {
    await syncNodesFromStorage();
    return getActiveNode(chain);
};

export const updateActiveNode = (chain: Chain, url: string): void => {
    activeNodes[chain] = url;
    console.log(`Switched active node for ${chain} to ${url}`);
};
