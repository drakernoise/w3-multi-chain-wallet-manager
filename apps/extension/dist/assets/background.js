import './ws-polyfill.js';
import { f as fetchAccountHistory, g as getHistoryItemKey, m as mergeHistoryItems, b as benchmarkNodes, C as Chain, a as getActiveNode, n as normalizeKeyType, r as requiresActiveAuthority, c as broadcastTransfer, d as broadcastVote, e as broadcastCustomJson, v as validateAccountKeys, s as signMessage, h as selectBroadcastKey, i as derivePublicKey, j as broadcastOperations, k as isChainSupported, l as getChainConfig, o as formatAssetAmount, p as broadcastPowerUp, q as broadcastPowerDown, t as broadcastDelegation, u as broadcastWitnessVote, w as decodeMemo, x as encodeMemo } from './chainService.js';
import './index.js';

if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = class DummyWebSocket {
    constructor() {
      console.warn("Gravity: DummyWebSocket instantiated in Background");
    }
    close() {
    }
    send() {
    }
    addEventListener() {
    }
    removeEventListener() {
    }
  };
  console.log("Gravity: WebSocket Polyfill Applied (Success)");
}
self.exports = {};

const HISTORY_CACHE_STORAGE_KEY = "gravity_account_history_cache_v1";
const HISTORY_CACHE_TTL_MS = 5 * 60 * 1e3;
const ACCOUNT_STAGGER_MS = 150;
const getHistoryCacheKey = (account) => `${account.chain}:${account.name}`.toLowerCase();
const inFlight = /* @__PURE__ */ new Set();
const readHistoryCache = async () => {
  try {
    const stored = await chrome.storage.local.get([HISTORY_CACHE_STORAGE_KEY]);
    const raw = stored?.[HISTORY_CACHE_STORAGE_KEY];
    if (!raw) return {};
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("[Gravity] History cache read failed:", error);
    return {};
  }
};
let writeQueue = Promise.resolve();
const writeHistoryEntry = (key, entry) => {
  writeQueue = writeQueue.then(async () => {
    try {
      const cache = await readHistoryCache();
      cache[key] = entry;
      await chrome.storage.local.set({ [HISTORY_CACHE_STORAGE_KEY]: JSON.stringify(cache) });
    } catch (error) {
      console.warn("[Gravity] History cache write failed:", error);
    }
  });
  return writeQueue;
};
const broadcastHistoryEntry = (key, entry) => {
  try {
    chrome.runtime.sendMessage({ type: "gravity_history_update", key, entry }, () => {
      void chrome.runtime.lastError;
    });
  } catch (_error) {
  }
};
const isProducerReward = (item) => item.type === "producer_reward" || item.type === "reward" && item.memo === "Producer Reward";
const refreshOneAccount = async (account, force, partial) => {
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
      shouldIncremental ? { incremental: true, knownItemKeys: cachedItems.map(getHistoryItemKey) } : partial ? { maxPages: 5 } : {}
    );
    const wouldReplaceCache = !shouldIncremental && !(partial && cachedItems.length > 0);
    if (wouldReplaceCache && fetched.length === 0 && cachedItems.length > 0) {
      const entry2 = {
        items: cachedItems,
        updatedAt: cached?.updatedAt || Date.now(),
        error: "History nodes returned nothing; keeping cached entries.",
        partial: cached?.partial
      };
      await writeHistoryEntry(key, entry2);
      broadcastHistoryEntry(key, entry2);
      return;
    }
    const items = shouldIncremental || partial && cachedItems.length > 0 ? mergeHistoryItems(cachedItems, fetched) : fetched;
    const entry = { items, updatedAt: Date.now(), error: null, partial };
    await writeHistoryEntry(key, entry);
    broadcastHistoryEntry(key, entry);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const entry = {
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
const refreshHistoryForAccounts = async (accounts, { force = false, partial = true } = {}) => {
  const seen = /* @__PURE__ */ new Set();
  for (const account of accounts) {
    if (!account?.chain || !account?.name) continue;
    const key = getHistoryCacheKey(account);
    if (seen.has(key)) continue;
    seen.add(key);
    await refreshOneAccount(account, force, partial);
    await new Promise((resolve) => setTimeout(resolve, ACCOUNT_STAGGER_MS));
  }
};
const refreshHistoryFromSession = async () => {
  try {
    const session = await chrome.storage.session.get(["session_accounts"]);
    const accounts = session?.session_accounts;
    if (!Array.isArray(accounts) || accounts.length === 0) return;
    await refreshHistoryForAccounts(
      accounts.map((account) => ({ chain: account.chain, name: account.name })),
      { partial: true }
    );
  } catch (error) {
    console.warn("[Gravity] Scheduled history refresh failed:", error);
  }
};

const OFFSCREEN_DOCUMENT_PATH = "src/offscreen/offscreen.html";
async function setupOffscreenDocument(path) {
  try {
    if (!chrome.offscreen) return;
    if (await chrome.offscreen.hasDocument()) return;
    await chrome.offscreen.createDocument({
      url: path,
      reasons: ["BLOBS"],
      justification: "Keep WebSocket connection alive for chat notifications"
    });
  } catch (e) {
    console.warn("Gravity: Failed to create offscreen document", e);
  }
}
if (chrome.offscreen) {
  setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
}
chrome.alarms.create("offscreenKeepAlive", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "offscreenKeepAlive") {
    setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
  }
  if (alarm.name === "rpcBenchmark") {
    runBenchmark();
  }
  if (alarm.name === "historyRefresh") {
    refreshHistoryFromSession();
  }
});
async function runBenchmark() {
  try {
    await benchmarkNodes();
    const activeNodes = {};
    for (const chain of Object.values(Chain)) {
      activeNodes[chain] = getActiveNode(chain);
    }
    await chrome.storage.local.set({ gravity_active_nodes: activeNodes });
  } catch (e) {
    console.error("[Gravity] RPC Benchmark failed:", e);
  }
}
async function initializeRpcNodes() {
  try {
    const result = await chrome.storage.local.get(["gravity_active_nodes"]);
    const stored = result.gravity_active_nodes || {};
    const storedHiveNode = String(stored.HIVE || "").replace(/\/+$/, "");
    if (storedHiveNode === "https://api.openhive.network") {
      await chrome.storage.local.set({
        gravity_active_nodes: {
          ...stored,
          HIVE: "https://api.hive.blog"
        }
      });
    }
  } catch (error) {
    console.warn("[Gravity] Failed to migrate deprecated RPC node:", error);
  }
  await runBenchmark();
}
initializeRpcNodes();
const ensurePeriodicAlarm = (name, periodInMinutes) => {
  chrome.alarms.get(name, (existing) => {
    if (!existing) chrome.alarms.create(name, { periodInMinutes });
  });
};
ensurePeriodicAlarm("rpcBenchmark", 10);
ensurePeriodicAlarm("historyRefresh", 10);
let unreadCount = 0;
function detectChainFromUrl(url = "") {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const hiveHosts = ["peakd.com", "ecency.com", "tribaldex.com", "magi.eco"];
    if (hiveHosts.some((domain) => host === domain || host.endsWith(`.${domain}`)) || host.includes("hive")) return "HIVE";
    const blurtHosts = [
      "blurt.blog",
      "blurtwallet.com",
      "twiggy.lat",
      "beblurt.com",
      "blurt.one",
      "blurtscan.com",
      "ecosynthesizer.com"
    ];
    if (blurtHosts.some((domain) => host === domain || host.endsWith(`.${domain}`)) || host.includes("blurt")) return "BLURT";
    const steemHosts = ["steemit.com"];
    if (steemHosts.some((domain) => host === domain || host.endsWith(`.${domain}`)) || host.includes("steem")) return "STEEM";
    return null;
  } catch (e) {
    return null;
  }
}
async function resolveBestAccountForRequest(accounts, username, detectedChain, normalizedKeyType = "") {
  const potentialAccounts = accounts.filter((a) => a.name === username);
  if (potentialAccounts.length === 0) return null;
  let candidates = detectedChain ? potentialAccounts.filter((a) => a.chain === detectedChain) : potentialAccounts;
  if (candidates.length === 0) {
    candidates = potentialAccounts;
  }
  if (candidates.length > 1) {
    console.warn(
      `[Gravity] ${candidates.length} stored entries for @${username}`,
      `(${candidates.map((c) => c.chain).join(", ")}) — picking the one whose ${normalizedKeyType || "first"} key the chain accepts`
    );
  }
  if (normalizedKeyType === "posting" && candidates.length > 1) {
    for (const candidate of candidates) {
      if (!candidate.postingKey) continue;
      const validation = await validateAccountKeys(candidate.chain, candidate.name, { posting: candidate.postingKey });
      if (validation.valid) return candidate;
    }
  }
  if (normalizedKeyType === "active" && candidates.length > 1) {
    for (const candidate of candidates) {
      if (!candidate.activeKey) continue;
      const validation = await validateAccountKeys(candidate.chain, candidate.name, { active: candidate.activeKey });
      if (validation.valid) return candidate;
    }
  }
  return candidates[0] || null;
}
async function deliverRequestOutcome(requestId, result, error) {
  const stored = await chrome.storage.session.get([`req_${requestId}`]);
  const pending = stored?.[`req_${requestId}`];
  if (!pending) return;
  await chrome.storage.session.remove([`req_${requestId}`]);
  const targetOptions = {};
  if (typeof pending.frameId !== "undefined") targetOptions.frameId = pending.frameId;
  const payload = error ? { success: false, error } : { success: true, ...result };
  const message = { type: "gravity_response", id: requestId, response: payload };
  chrome.tabs.sendMessage(pending.tabId, message, targetOptions, () => {
    const lastError = chrome.runtime.lastError;
    if (!lastError) return;
    console.error(`[Gravity] Failed to send response to tab ${pending.tabId} (frame ${pending.frameId}): ${lastError.message || JSON.stringify(lastError)}`);
    if (targetOptions.frameId) {
      chrome.tabs.sendMessage(pending.tabId, message, () => {
        if (chrome.runtime.lastError) {
          console.error(`[Gravity] Fallback also failed: ${chrome.runtime.lastError.message}`);
        }
      });
    }
  });
}
chrome.runtime.onConnect.addListener((port) => {
  const match = /^gravity_sign_prompt_(.+)$/.exec(port.name || "");
  if (!match) return;
  const requestId = match[1];
  port.onDisconnect.addListener(() => {
    void chrome.runtime.lastError;
    deliverRequestOutcome(requestId, null, "user_cancel").catch((err) => {
      console.warn("[Gravity] Failed to cancel dismissed request:", err);
    });
  });
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request) return false;
  if (request.type === "gravity_history_refresh") {
    refreshHistoryForAccounts(request.accounts || [], {
      force: request.force === true,
      partial: request.partial !== false
    }).catch((error) => console.warn("[Gravity] History refresh failed:", error));
    sendResponse({ started: true });
    return false;
  }
  if (request.type === "gravity_request") {
    const originalParams = Array.isArray(request.params) ? request.params.map((param) => param && typeof param === "object" ? { ...param } : param) : request.params;
    if (typeof request.method !== "string" || request.method.length > 64) {
      console.warn("Gravity: Rejected invalid method (length/type)", request.method);
      sendResponse({ success: false, error: "Invalid Request: Method name too long or invalid." });
      return false;
    }
    if (request.params && typeof request.params === "object" && !Array.isArray(request.params)) {
      const params = request.params;
      if (params.operations && params.url && !params.username) {
        const username = "unknown_broadcast_user";
        const operations = Array.isArray(params.operations) ? params.operations : [params.operations];
        const key = params.key || "";
        request.params = [username, operations, key];
      }
    }
    if (Array.isArray(request.params)) {
      for (let i = 0; i < request.params.length; i++) {
        const param = request.params[i];
        if (param && typeof param === "object" && !Array.isArray(param)) {
          const obj = param;
          const envelopeOps = Array.isArray(obj.operations) ? obj.operations : Array.isArray(obj.tx?.operations) ? obj.tx.operations : Array.isArray(obj.transaction?.operations) ? obj.transaction.operations : null;
          if (envelopeOps) {
            if ((request.method === "requestBroadcast" || request.method === "broadcast") && i === 1) {
              request._gravityBroadcastEnvelope = { ...obj };
            }
            const operations = envelopeOps;
            request.params[i] = operations;
            if (request.method === "requestSignBuffer" && i === 2 && Array.isArray(request.params[i])) {
              request.method = "requestBroadcast";
              let username = request.params[0];
              try {
                const firstOp = operations[0];
                if (Array.isArray(firstOp) && firstOp[1]?.author) {
                  username = firstOp[1].author;
                }
              } catch (e) {
                console.warn("[Gravity] Could not extract username from operations");
              }
              const keyType = "Posting";
              request.params = [username, operations, keyType];
            }
            break;
          }
        }
      }
    }
    if (request.method === "requestPowerUp" || request.method === "powerUp") {
      if (request.params && request.params[1] && typeof request.params[1] === "string") {
        request.params[1] = request.params[1].replace(/^@/, "");
      }
    } else if (request.method === "requestDelegation" || request.method === "delegation") {
      if (request.params && request.params[1] && typeof request.params[1] === "string") {
        request.params[1] = request.params[1].replace(/^@/, "");
      }
    }
    const methodsWithDomainFix = ["requestVote", "vote", "requestPost", "post", "requestBroadcast", "broadcast", "requestSignBuffer", "signBuffer", "decodeMemo", "encodeMemo"];
    if (methodsWithDomainFix.includes(request.method) && Array.isArray(request.params)) {
      const params = request.params;
      const first = params[0];
      if (typeof first === "string" && first.includes(".")) {
        if (params.length > 2) {
          request.params = params.slice(1);
        }
      }
    }
    if (request.method === "requestHandshake") {
      const chain = detectChainFromUrl(sender.url || sender.tab?.url) || "BLURT";
      const node = getActiveNode(chain);
      sendResponse({
        success: true,
        version: "1.2",
        msg: "Gravity Wallet Active",
        rpc: node
        // Provide the active RPC node to the dApp
      });
      return false;
    }
    const requestId = request.params?.requestId || request.id || Date.now().toString();
    tryAutoSign(request, sender).then((autoResult) => {
      if (autoResult) {
        try {
          sendResponse(autoResult);
        } catch (e) {
          console.warn("[Gravity] Failed to send auto-sign response:", e);
        }
      } else {
        const chainHint = detectChainFromUrl(sender.url || sender.tab?.url);
        const normalizedRequest = { ...request, _gravityOriginalParams: originalParams };
        const reqData = {
          data: normalizedRequest,
          tabId: sender.tab?.id,
          frameId: sender.frameId,
          origin: sender.origin || sender.url,
          chain: chainHint
        };
        chrome.storage.session.set({ [`req_${requestId}`]: reqData }, () => {
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            console.error("[Gravity] Session storage set failed:", lastError);
            return;
          }
          openPrompt(requestId);
          try {
            sendResponse({ success: true, pending: true, note: "User prompt opened" });
          } catch (e) {
            console.warn("[Gravity] Port closed before pending response could be sent:", e);
          }
        });
      }
    }).catch((err) => {
      console.error("[Gravity] Auto-sign logic failed:", err);
      try {
        sendResponse({ success: false, error: "Internal auto-sign processing error" });
      } catch (e) {
      }
    });
    return true;
  }
  if (request.type === "gravity_get_request") {
    const requestId = request.requestId;
    chrome.storage.session.get([`req_${requestId}`]).then((res) => {
      const req = res[`req_${requestId}`];
      if (req && req.data && req.data.params) {
        const data = req.data;
        if (Array.isArray(data.params) && data.params[1] && typeof data.params[1] === "object" && !Array.isArray(data.params[1])) {
          const secondParam = data.params[1];
          const envelopeOps = Array.isArray(secondParam.operations) ? secondParam.operations : Array.isArray(secondParam.tx?.operations) ? secondParam.tx.operations : Array.isArray(secondParam.transaction?.operations) ? secondParam.transaction.operations : null;
          if (envelopeOps) {
            console.log("[Background] Defensive fix: Converting broadcast envelope in params[1]");
            data.params[1] = envelopeOps;
          }
        }
      }
      sendResponse({
        request: req ? req.data : null,
        origin: req ? req.origin : null,
        chain: req ? req.chain : null
      });
    });
    return true;
  }
  if (request.type === "gravity_get_rpc") {
    const chain = (request.chain || "BLURT").toUpperCase();
    const node = getActiveNode(chain);
    sendResponse({ success: true, rpc: node });
    return false;
  }
  if (request.type === "gravity_resolve_request") {
    const { requestId, result, error } = request;
    deliverRequestOutcome(requestId, result, error).catch((err) => {
      console.error("[Gravity] Error resolving request from storage:", err);
    });
    sendResponse({ ack: true });
    return false;
  }
  if (request.type === "OFFSCREEN_NEW_MESSAGE") {
    unreadCount++;
    updateBadge();
    sendResponse({ ack: true });
    return false;
  }
  if (request.type === "CHAT_SYNC_CREDS") {
    chrome.storage.local.set({ gravity_chat_creds: request.data }).then(() => {
      chrome.runtime.sendMessage({ type: "INIT_CHAT", creds: request.data }).catch(() => {
        if (chrome.offscreen) setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
      });
    });
    unreadCount = 0;
    chrome.action.setBadgeText({ text: "" });
    sendResponse({ ack: true });
    return false;
  }
  if (request.type === "CHAT_UI_OPENED") {
    unreadCount = 0;
    chrome.action.setBadgeText({ text: "" });
    sendResponse({ ack: true });
    return false;
  }
  if (request.type === "CHAT_LOGOUT") {
    chrome.storage.local.remove(["gravity_chat_creds"]);
    chrome.runtime.sendMessage({ type: "DISCONNECT_CHAT" }).catch(() => {
    });
    unreadCount = 0;
    chrome.action.setBadgeText({ text: "" });
    sendResponse({ ack: true });
    return false;
  }
  if (request.type === "UPDATE_BADGE") {
    const count = request.count || 0;
    if (count === 0) unreadCount = 0;
    else unreadCount += count;
    updateBadge();
    sendResponse({ ack: true });
    return false;
  }
  if (request.type === "CHAT_CHECK_PUSH") {
    getExistingSubscription().then((sub) => sendResponse({ success: true, subscription: sub })).catch((err) => sendResponse({ success: false, error: err.toString() }));
    return true;
  }
  if (request.type === "CHAT_ENABLE_PUSH") {
    manualPushSubscribe().then((sub) => sendResponse({ success: true, subscription: sub })).catch((err) => sendResponse({ success: false, error: err.message || err.toString() }));
    return true;
  }
  return false;
});
function updateBadge() {
  const text = unreadCount > 0 ? unreadCount > 9 ? "9+" : String(unreadCount) : "";
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
}
async function tryAutoSign(request, sender) {
  try {
    const local = await chrome.storage.local.get(["gravity_whitelist"]);
    const whitelist = local.gravity_whitelist || [];
    const domain = (sender.origin || sender.url || "").match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/im)?.[1];
    const username = request.params[0];
    const method = request.method;
    if (!domain || !username) return null;
    const isTrusted = whitelist.some(
      (e) => e.domain === domain && e.username === username && (e.method === method || e.method === "ALL")
    );
    if (!isTrusted) return null;
    const session = await chrome.storage.session.get(["session_accounts"]);
    if (!session.session_accounts || session.session_accounts.length === 0) return null;
    const url = sender?.tab?.url || sender?.url || "";
    const detectedChain = detectChainFromUrl(url);
    let requestedKeyType = normalizeKeyType(request.params?.[2]);
    if (!requestedKeyType && (request.method === "requestBroadcast" || request.method === "broadcast")) {
      const requestOps = Array.isArray(request.params?.[1]) ? request.params[1] : [];
      requestedKeyType = requiresActiveAuthority(requestOps) ? "active" : "posting";
    }
    let account = await resolveBestAccountForRequest(
      session.session_accounts,
      username,
      detectedChain,
      requestedKeyType
    );
    if (!account && !detectedChain) {
      account = session.session_accounts.find((a) => a.name === username && a.chain === "HIVE");
      if (!account) account = session.session_accounts.find((a) => a.name === username);
    }
    if (!account) return { success: false, error: "Account not found or wallet locked" };
    if (!request.requestChain && detectedChain) {
      request.requestChain = detectedChain;
    }
    if (method === "requestTransfer" || method === "requestPowerUp" || method === "requestPowerDown" || method === "requestDelegation") {
      return null;
    }
    const isTransfer = method === "requestTransfer";
    const isVote = method === "requestVote" || method === "vote";
    const isCustomJson = method === "requestCustomJson" || method === "customJSON";
    const isSignBuffer = method === "requestSignBuffer" || method === "signBuffer";
    const isBroadcast = method === "requestBroadcast" || method === "broadcast";
    const isPowerUp = method === "requestPowerUp" || method === "powerUp";
    const isPowerDown = method === "requestPowerDown" || method === "powerDown";
    const isDelegation = method === "requestDelegation" || method === "delegation";
    const isPost = method === "requestPost" || method === "post";
    const isWitnessVote = method === "requestWitnessVote" || method === "witnessVote";
    const isDecodeMemo = method === "decodeMemo" || method === "requestVerifyKey";
    const isEncodeMemo = method === "encodeMemo";
    let response;
    if (isTransfer) {
      const to = request.params[1];
      const amount = request.params[2];
      const memo = request.params[3] || "";
      if (!account.activeKey) return { success: false, error: "Active key required for transfer" };
      response = await broadcastTransfer(account.chain, account.name, account.activeKey, to, amount, memo);
    } else if (isVote) {
      const permlink = request.params[1];
      const author = request.params[2];
      const weight = Number(request.params[3]);
      const key = account.postingKey;
      if (!key) return { success: false, error: "Posting key required for voting" };
      response = await broadcastVote(account.chain, account.name, key, author, permlink, weight);
    } else if (isCustomJson) {
      const id = request.params[1];
      const type = request.params[2];
      const normalizedType = normalizeKeyType(type);
      const json = request.params[3];
      let key = account.postingKey;
      if (normalizedType === "active") key = account.activeKey;
      if (!key) return { success: false, error: "Key required for custom JSON operation" };
      response = await broadcastCustomJson(
        account.chain,
        account.name,
        key,
        id,
        typeof json === "string" ? json : JSON.stringify(json),
        normalizedType === "active" ? "Active" : "Posting"
      );
    } else if (isSignBuffer) {
      const message = request.params[1];
      const type = request.params[2];
      const normalizedType = normalizeKeyType(type);
      let keyStr = "";
      if (normalizedType === "posting") keyStr = account.postingKey || "";
      else if (normalizedType === "active") keyStr = account.activeKey || "";
      else if (normalizedType === "memo") keyStr = account.memoKey || "";
      if (!keyStr) return { success: false, error: "Key required for signing" };
      if (normalizedType === "posting" || normalizedType === "active") {
        const validation = await validateAccountKeys(
          account.chain,
          account.name,
          normalizedType === "posting" ? { posting: keyStr } : { active: keyStr }
        );
        if (!validation.valid) {
          return {
            success: false,
            error: validation.error || `${normalizedType} key does not match account`
          };
        }
      }
      const targetChain = request.requestChain || account.chain;
      const useLegacySigner = url.includes("tribaldex") || url.includes("hive-engine");
      response = await signMessage(targetChain, message, keyStr, useLegacySigner);
    } else if (isBroadcast) {
      let operations = request.params[1];
      const keyType = request.params[2];
      if (operations && typeof operations === "object" && !Array.isArray(operations)) {
        if (operations.operations) {
          operations = operations.operations;
        } else {
          return { success: false, error: "Invalid broadcast format: operations is not an array" };
        }
      }
      const { key: keyStr, keyType: selectedKeyType } = selectBroadcastKey(
        account,
        keyType,
        Array.isArray(operations) ? operations : []
      );
      if (!keyStr) {
        const requiredType = selectedKeyType === "active" ? "Active" : "Posting";
        return { success: false, error: `${requiredType} key required for broadcast operation` };
      }
      console.log(
        "[Broadcast] Signing as",
        `@${account.name}`,
        "on",
        account.chain,
        "with",
        selectedKeyType,
        "key",
        derivePublicKey(account.chain, keyStr)
      );
      response = await broadcastOperations(account.chain, keyStr, operations);
    } else if (isPost) {
      const title = request.params[1];
      const body = request.params[2];
      let parentPermlink = request.params[3];
      const parentAuthor = request.params[4];
      let jsonMetadata = request.params[5];
      const permlink = request.params[6];
      const jsonMetadataStr = typeof jsonMetadata === "string" ? jsonMetadata : JSON.stringify(jsonMetadata);
      if (!parentPermlink && !parentAuthor) {
        parentPermlink = "general";
      }
      const op = ["comment", {
        parent_author: parentAuthor || "",
        parent_permlink: parentPermlink || "general",
        author: username || "",
        permlink: permlink || "",
        title: title || "",
        body: body || "",
        json_metadata: jsonMetadataStr || "{}"
      }];
      const key = account.postingKey;
      if (!key) return { success: false, error: "Posting key required for posting" };
      response = await broadcastOperations(account.chain, key, [op]);
    } else if (isPowerUp) {
      const rawTo = request.params[1] || account.name;
      const to = rawTo.replace(/^@/, "");
      let amount = request.params[2];
      if (amount && !amount.includes(" ")) {
        const config = isChainSupported(account.chain) ? getChainConfig(account.chain) : null;
        const symbol = config ? config.primaryToken : "HIVE";
        try {
          amount = `${formatAssetAmount(amount)} ${symbol}`;
        } catch (e) {
          return { success: false, error: e.message };
        }
      }
      if (!account.activeKey) return { success: false, error: "Gravity Wallet: Active Key required for Power Up." };
      response = await broadcastPowerUp(account.chain, account.name, account.activeKey, to, amount);
    } else if (isPowerDown) {
      let vestingShares = request.params[1];
      if (vestingShares && !vestingShares.includes(" ")) {
        const config = isChainSupported(account.chain) ? getChainConfig(account.chain) : null;
        const vestingToken = config ? config.vestingToken : "VESTS";
        vestingShares = `${parseFloat(vestingShares).toFixed(6)} ${vestingToken}`;
      }
      if (!account.activeKey) return { success: false, error: "Gravity Wallet: Active Key required for Power Down." };
      response = await broadcastPowerDown(account.chain, account.name, account.activeKey, vestingShares);
    } else if (isDelegation) {
      const rawDelegatee = request.params[1];
      const delegatee = rawDelegatee ? rawDelegatee.replace(/^@/, "") : "";
      const amount = request.params[2];
      const unit = request.params[3] || "VESTS";
      let vestingShares = amount;
      if (amount && !amount.includes(" ")) {
        vestingShares = `${amount} ${unit}`;
      }
      if (!account.activeKey) return { success: false, error: "Gravity Wallet: Missing Active Key for Delegation." };
      response = await broadcastDelegation(account.chain, account.name, account.activeKey, delegatee, vestingShares);
    } else if (isWitnessVote) {
      const witness = request.params[1];
      const approve = request.params[2] === true || request.params[2] === "true" || request.params[2] === 1;
      if (!account.activeKey) return { success: false, error: "Active key required for witness voting" };
      response = await broadcastWitnessVote(account.chain, account.name, account.activeKey, witness, approve);
    } else if (isDecodeMemo) {
      const memo = request.params[1];
      const type = request.params[2];
      const normalizedType = normalizeKeyType(type);
      let keyStr = "";
      if (normalizedType === "posting") keyStr = account.postingKey || "";
      else if (normalizedType === "active") keyStr = account.activeKey || "";
      else if (normalizedType === "memo") keyStr = account.memoKey || "";
      if (!keyStr) return { success: false, error: "Key required for decoding memo" };
      try {
        const decoded = await decodeMemo(account.chain, account.name, memo, keyStr);
        response = { success: true, result: decoded };
      } catch (e) {
        response = { success: false, error: e.message };
      }
    } else if (isEncodeMemo) {
      const receiver = request.params[1];
      const memo = request.params[2];
      const type = request.params[3];
      const normalizedType = normalizeKeyType(type);
      let keyStr = "";
      if (normalizedType === "posting") keyStr = account.postingKey || "";
      else if (normalizedType === "active") keyStr = account.activeKey || "";
      else if (normalizedType === "memo") keyStr = account.memoKey || "";
      if (!keyStr) return { success: false, error: "Key required for encoding memo" };
      try {
        const encoded = await encodeMemo(account.chain, account.name, receiver, memo, keyStr);
        response = { success: true, result: encoded };
      } catch (e) {
        response = { success: false, error: e.message };
      }
    } else {
      return { success: false, error: "Unsupported operation" };
    }
    if (!response) return { success: false, error: "No response from wallet" };
    if (!response.success) {
      return { success: false, error: response.error || "Operation failed" };
    }
    const opResult = response.opResult || response.result || response.txId || "success";
    const finalResult = response.txId || response.result || opResult;
    const { success: _s, result: _r, publicKey: _pk, error: _e, ...restResponse } = response;
    const broadcastOperationsList = isBroadcast && Array.isArray(request.params?.[1]) ? request.params[1] : null;
    const broadcastEnvelope = isBroadcast && request._gravityBroadcastEnvelope && typeof request._gravityBroadcastEnvelope === "object" ? {
      ...request._gravityBroadcastEnvelope,
      operations: Array.isArray(request._gravityBroadcastEnvelope.operations) ? request._gravityBroadcastEnvelope.operations : broadcastOperationsList
    } : null;
    const firstBroadcastOperation = Array.isArray(broadcastOperationsList) ? broadcastOperationsList[0] : null;
    const firstBroadcastOperationName = Array.isArray(firstBroadcastOperation) ? firstBroadcastOperation[0] : firstBroadcastOperation?.type || firstBroadcastOperation?.operation || firstBroadcastOperation?.method || null;
    let splinterlandsHost = "";
    try {
      splinterlandsHost = new URL(url).hostname;
    } catch (_e2) {
    }
    const isSplinterlands = /(^|\.)splinterlands\.com$/i.test(splinterlandsHost);
    const broadcastResultPayload = isSplinterlands ? {
      ...broadcastEnvelope || {},
      ...opResult && typeof opResult === "object" ? opResult : {},
      id: response.txId || (opResult && typeof opResult === "object" ? opResult.id : void 0),
      txId: response.txId,
      tx_id: response.txId,
      operation: firstBroadcastOperationName,
      op: firstBroadcastOperationName,
      operations: broadcastOperationsList
    } : finalResult;
    const customJsonResultPayload = isCustomJson ? {
      ...opResult && typeof opResult === "object" ? opResult : {},
      id: response.txId || (opResult && typeof opResult === "object" ? opResult.id : void 0),
      txId: response.txId,
      tx_id: response.txId
    } : null;
    const result = isSignBuffer ? {
      success: true,
      result: response.result,
      signature: response.result,
      // Compatibility
      publicKey: response.publicKey,
      pubkey: response.publicKey,
      // Compatibility
      // CRITICAL: blurt.media/peerhub expects data.username
      data: {
        username,
        publicKey: response.publicKey,
        signature: response.result
      },
      message: "Signed successfully",
      ...restResponse
    } : isDecodeMemo || isEncodeMemo ? {
      // Memo operations never broadcast, so no txId/operation fields belong here.
      success: true,
      result: response.result,
      data: {
        username,
        message: response.result
      },
      message: isDecodeMemo ? "Decoded successfully" : "Encoded successfully",
      ...restResponse
    } : {
      success: true,
      result: isCustomJson ? customJsonResultPayload : broadcastResultPayload,
      txId: response.txId,
      tx_id: response.txId,
      transaction: broadcastEnvelope || void 0,
      broadcastPayload: opResult,
      opResult,
      operation: firstBroadcastOperationName,
      operations: broadcastOperationsList,
      message: "Signed successfully",
      ...restResponse
    };
    return result;
  } catch (e) {
    console.error("Auto-sign failed:", e);
    return null;
  }
}
async function openPrompt(requestId) {
  const width = 450;
  const height = 620;
  try {
    await chrome.storage.session.set({ gravity_active_request_id: requestId });
    if (chrome.action?.openPopup) {
      try {
        await chrome.action.openPopup();
        return;
      } catch (popupError) {
        console.warn("Gravity: action.openPopup failed, falling back to detached request window", popupError);
      }
    }
    await chrome.windows.create({
      url: `index.html?requestId=${requestId}`,
      type: "popup",
      width,
      height,
      focused: true
    });
  } catch (e) {
    console.error("Gravity: Failed to open prompt", e);
  }
}
const VAPID_PUBLIC_KEY = "BNXKcYc9Skxc1DN5d5LoSrm--iYct9aMr6SzoimkM0ZhKURE3cZp6MCHh03D7DYJ-j07QwZze0-peLPmne_VZcQ";
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
async function getExistingSubscription() {
  try {
    const reg = self.registration;
    if (!reg?.pushManager) return null;
    return await reg.pushManager.getSubscription();
  } catch (e) {
    console.warn("Gravity: Failed to get subscription", e);
    return null;
  }
}
async function manualPushSubscribe() {
  try {
    const reg = self.registration;
    if (!reg || !reg.pushManager) {
      throw new Error("PushManager not available in Service Worker context");
    }
    let sub = await reg.pushManager.getSubscription();
    if (sub) {
      return sub;
    }
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });
    await chrome.storage.local.set({ gravity_push_sub: JSON.stringify(sub) });
    return sub;
  } catch (e) {
    console.error("Gravity: [Background] Push Subscription ERROR:", e.name, e.message);
    throw e;
  }
}
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
  }
  unreadCount++;
  chrome.action.setBadgeText({ text: unreadCount > 9 ? "9+" : String(unreadCount) });
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
  const title = data.title || "Gravity Wallet";
  const options = {
    body: data.body || "New message received",
    icon: "icons/48.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  chrome.windows.create({
    url: "index.html",
    type: "popup",
    width: 450,
    height: 620
  });
});
