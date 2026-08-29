/**
 * Account history, owned by the service worker.
 *
 * History used to be fetched from the popup. A full walk is up to 200 sequential RPC
 * round-trips, and closing the popup tore the document down mid-flight: every pending
 * fetch rejected with "Failed to fetch", the node loop blamed whichever node it was on,
 * and the work was lost. The worker outlives the popup, so it does the fetching and
 * persists after every account; the popup only reads the cache and listens for updates.
 */

import { Chain } from '@types';
import { fetchAccountHistory, getHistoryItemKey, mergeHistoryItems, HistoryItem } from '@services/chainService';

declare const chrome: any;

// Same key the popup already persisted to, so existing caches carry over untouched.
const HISTORY_CACHE_STORAGE_KEY = 'gravity_account_history_cache_v1';
const HISTORY_CACHE_TTL_MS = 5 * 60 * 1000;
const ACCOUNT_STAGGER_MS = 150;

export interface HistoryCacheEntry {
    items: HistoryItem[];
    updatedAt: number;
    error?: string | null;
    partial?: boolean;
}

export type HistoryCache = Record<string, HistoryCacheEntry>;

export interface HistoryAccount {
    chain: Chain;
    name: string;
}

export const getHistoryCacheKey = (account: HistoryAccount) =>
    `${account.chain}:${account.name}`.toLowerCase();

// Per-key guard so two overlapping refresh requests do not double-fetch the same account.
const inFlight = new Set<string>();

// storageService is not usable here: its chrome.storage miss path falls back to
// localStorage, which does not exist in a service worker.
export const readHistoryCache = async (): Promise<HistoryCache> => {
    try {
        const stored = await chrome.storage.local.get([HISTORY_CACHE_STORAGE_KEY]);
        const raw = stored?.[HISTORY_CACHE_STORAGE_KEY];
        if (!raw) return {};
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        console.warn('[Gravity] History cache read failed:', error);
        return {};
    }
};

const writeHistoryEntry = async (key: string, entry: HistoryCacheEntry) => {
    try {
        const cache = await readHistoryCache();
        cache[key] = entry;
        await chrome.storage.local.set({ [HISTORY_CACHE_STORAGE_KEY]: JSON.stringify(cache) });
    } catch (error) {
        console.warn('[Gravity] History cache write failed:', error);
    }
};

// Nudges an open popup. When none is open there is no receiver and the callback sees
// lastError, which is expected rather than a failure — the cache write is the source of truth.
const broadcastHistoryEntry = (key: string, entry: HistoryCacheEntry) => {
    try {
        chrome.runtime.sendMessage({ type: 'gravity_history_update', key, entry }, () => {
            void chrome.runtime.lastError;
        });
    } catch (_error) {
        // No popup listening.
    }
};

const isProducerReward = (item: HistoryItem) =>
    item.type === 'producer_reward' || (item.type === 'reward' && item.memo === 'Producer Reward');

const refreshOneAccount = async (account: HistoryAccount, force: boolean, partial: boolean) => {
    const key = getHistoryCacheKey(account);
    if (inFlight.has(key)) return;

    const cache = await readHistoryCache();
    const cached = cache[key];
    const cachedItems = cached?.items || [];
    const hasVisibleHistory = cachedItems.some((item) => !isProducerReward(item));
    const cacheIsFresh = Boolean(
        cached && hasVisibleHistory && !cached.partial && Date.now() - cached.updatedAt < HISTORY_CACHE_TTL_MS
    );
    if (!force && cacheIsFresh) return;

    const shouldIncremental = hasVisibleHistory && !cached?.partial && !partial && (force || !cacheIsFresh);

    inFlight.add(key);
    try {
        const fetched = await fetchAccountHistory(
            account.chain,
            account.name,
            shouldIncremental
                ? { incremental: true, knownItemKeys: cachedItems.map(getHistoryItemKey) }
                : partial
                    ? { maxPages: 5 }
                    : {}
        );

        const items = shouldIncremental || (partial && cachedItems.length > 0)
            ? mergeHistoryItems(cachedItems, fetched)
            : fetched;

        const entry: HistoryCacheEntry = { items, updatedAt: Date.now(), error: null, partial };
        await writeHistoryEntry(key, entry);
        broadcastHistoryEntry(key, entry);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const entry: HistoryCacheEntry = {
            items: cachedItems,
            updatedAt: cached?.updatedAt || Date.now(),
            error: message,
            partial: cached?.partial
        };
        await writeHistoryEntry(key, entry);
        broadcastHistoryEntry(key, entry);
    } finally {
        inFlight.delete(key);
    }
};

export const refreshHistoryForAccounts = async (
    accounts: HistoryAccount[],
    { force = false, partial = true }: { force?: boolean; partial?: boolean } = {}
) => {
    const seen = new Set<string>();
    for (const account of accounts) {
        if (!account?.chain || !account?.name) continue;
        const key = getHistoryCacheKey(account);
        if (seen.has(key)) continue;
        seen.add(key);

        await refreshOneAccount(account, force, partial);
        // Spread the load so a wallet with many accounts does not hammer one node.
        await new Promise((resolve) => setTimeout(resolve, ACCOUNT_STAGGER_MS));
    }
};

/**
 * Periodic refresh. The popup's old 10-minute interval only ticked while the popup
 * happened to be open, which is almost never; the alarm fires regardless. Accounts come
 * from the unlocked session, so a locked wallet is simply skipped.
 */
export const refreshHistoryFromSession = async () => {
    try {
        const session = await chrome.storage.session.get(['session_accounts']);
        const accounts = session?.session_accounts;
        if (!Array.isArray(accounts) || accounts.length === 0) return;

        await refreshHistoryForAccounts(
            accounts.map((account: any) => ({ chain: account.chain, name: account.name })),
            { partial: true }
        );
    } catch (error) {
        console.warn('[Gravity] Scheduled history refresh failed:', error);
    }
};
