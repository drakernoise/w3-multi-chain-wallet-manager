import { b as broadcastTransfer, a as broadcastVote, c as broadcastCustomJson, s as signMessage, d as broadcastOperations, i as isChainSupported, g as getChainConfig, e as broadcastPowerUp, f as broadcastPowerDown, h as broadcastDelegation } from './chainService.js';
import './index.js';

console.log("Gravity: BACKGROUND SCRIPT RELOADED - V_FIX_PUSH_DOM_002");
self.exports = {};
const OFFSCREEN_DOCUMENT_PATH = "src/offscreen/offscreen.html";
async function setupOffscreenDocument(path) {
  try {
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
let unreadCount = 0;
function detectChainFromUrl(url = "") {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const hiveHosts = ["peakd.com", "ecency.com", "tribaldex.com"];
    if (hiveHosts.some((domain) => host === domain || host.endsWith(`.${domain}`)) || host.includes("hive")) return "HIVE";
    const blurtHosts = ["blurt.blog", "blurtwallet.com"];
    if (blurtHosts.some((domain) => host === domain || host.endsWith(`.${domain}`)) || host.includes("blurt")) return "BLURT";
    const steemHosts = ["steemit.com"];
    if (steemHosts.some((domain) => host === domain || host.endsWith(`.${domain}`)) || host.includes("steem")) return "STEEM";
    return null;
  } catch (e) {
    return null;
  }
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request) return false;
  if (request.type === "gravity_request") {
    if (typeof request.method !== "string" || request.method.length > 64) {
      console.warn("Gravity: Rejected invalid method (length/type)", request.method);
      sendResponse({ success: false, error: "Invalid Request: Method name too long or invalid." });
      return false;
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
    if (request.method === "requestHandshake") {
      sendResponse({ success: true, version: "1.1", msg: "Gravity Wallet Active" });
      return false;
    }
    const requestId = request.params?.requestId || request.id || Date.now().toString();
    tryAutoSign(request, sender).then((autoResult) => {
      if (autoResult) {
        console.log("Gravity: Auto-signed request from whitelist");
        sendResponse(autoResult);
      } else {
        const chainHint = detectChainFromUrl(sender.url || sender.tab?.url);
        const reqData = {
          data: request,
          tabId: sender.tab?.id,
          frameId: sender.frameId,
          origin: sender.origin || sender.url,
          chain: chainHint
        };
        chrome.storage.session.set({ [`req_${requestId}`]: reqData }, () => {
          openPrompt(requestId);
          sendResponse({ success: true, pending: true, note: "User prompt opened" });
        });
      }
    });
    return true;
  }
  if (request.type === "gravity_get_request") {
    const requestId = request.requestId;
    chrome.storage.session.get([`req_${requestId}`]).then((res) => {
      const req = res[`req_${requestId}`];
      sendResponse({
        request: req ? req.data : null,
        origin: req ? req.origin : null,
        chain: req ? req.chain : null
      });
    });
    return true;
  }
  if (request.type === "gravity_resolve_request") {
    const { requestId, result, error } = request;
    chrome.storage.session.get([`req_${requestId}`]).then((res) => {
      const pending = res[`req_${requestId}`];
      if (pending) {
        const targetOptions = {};
        if (typeof pending.frameId !== "undefined") targetOptions.frameId = pending.frameId;
        const payload = error ? { success: false, error } : { success: true, ...result };
        chrome.tabs.sendMessage(pending.tabId, {
          type: "gravity_response",
          id: requestId,
          // Use the original ID
          response: payload
        }, targetOptions);
        chrome.storage.session.remove([`req_${requestId}`]);
      }
    });
    sendResponse({ ack: true });
    return false;
  }
  if (request.type === "OFFSCREEN_NEW_MESSAGE") {
    const count = request.count || 1;
    unreadCount += count;
    chrome.action.setBadgeText({ text: unreadCount > 9 ? "9+" : String(unreadCount) });
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
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
    const text = unreadCount > 0 ? unreadCount > 9 ? "9+" : String(unreadCount) : "";
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
    sendResponse({ ack: true });
    return false;
  }
});
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
    let account = null;
    const potentialAccounts = session.session_accounts.filter((a) => a.name === username);
    if (potentialAccounts.length === 0) {
      return null;
    }
    if (detectedChain) {
      account = potentialAccounts.find((a) => a.chain === detectedChain);
    }
    if (!account) {
      account = potentialAccounts.find((a) => a.chain === "HIVE");
      if (!account) account = potentialAccounts[0];
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
      const key = account.postingKey || account.activeKey;
      if (!key) return { success: false, error: "Posting or Active key required for voting" };
      response = await broadcastVote(account.chain, account.name, key, author, permlink, weight);
    } else if (isCustomJson) {
      const id = request.params[1];
      const type = request.params[2];
      const json = request.params[3];
      let key = account.postingKey;
      if (type === "Active") key = account.activeKey;
      if (!key) return { success: false, error: "Key required for custom JSON operation" };
      response = await broadcastCustomJson(account.chain, account.name, key, id, typeof json === "string" ? json : JSON.stringify(json), type);
    } else if (isSignBuffer) {
      const message = request.params[1];
      const type = request.params[2];
      let keyStr = "";
      if (type === "Posting") keyStr = account.postingKey || "";
      else if (type === "Active") keyStr = account.activeKey || "";
      else if (type === "Memo") keyStr = account.memoKey || "";
      if (!keyStr) return { success: false, error: "Key required for signing" };
      const targetChain = request.requestChain || account.chain;
      const useLegacySigner = url.includes("tribaldex") || url.includes("hive-engine");
      response = await signMessage(targetChain, message, keyStr, useLegacySigner);
    } else if (isBroadcast) {
      let operations = request.params[1];
      const keyType = request.params[2];
      if (operations && !Array.isArray(operations) && operations.operations) operations = operations.operations;
      let keyStr = "";
      const normalizedKeyType = (keyType || "").toLowerCase();
      if (normalizedKeyType === "posting") keyStr = account.postingKey || "";
      else if (normalizedKeyType === "active") keyStr = account.activeKey || "";
      else keyStr = account.activeKey || "";
      if (!keyStr) return { success: false, error: "Key required for broadcast operation" };
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
      const key = account.postingKey || account.activeKey;
      if (!key) return { success: false, error: "Posting or Active key required for posting" };
      response = await broadcastOperations(account.chain, key, [op]);
    } else if (isPowerUp) {
      const rawTo = request.params[1] || account.name;
      const to = rawTo.replace(/^@/, "");
      let amount = request.params[2];
      if (amount && !amount.includes(" ")) {
        const config = isChainSupported(account.chain) ? getChainConfig(account.chain) : null;
        const symbol = config ? config.primaryToken : "HIVE";
        amount = `${parseFloat(amount).toFixed(3)} ${symbol}`;
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
    } else {
      return { success: false, error: "Unsupported operation" };
    }
    if (!response) return { success: false, error: "No response from wallet" };
    if (!response.success) {
      return { success: false, error: response.error || "Operation failed" };
    }
    const finalResult = response.opResult || response.txId || response.result || "success";
    const result = isSignBuffer ? { result: response.result, message: "Signed successfully", ...response } : { result: finalResult, message: "Signed successfully", ...response };
    return { success: true, pending: false, ...result };
  } catch (e) {
    console.error("Auto-sign failed:", e);
    return null;
  }
}
async function openPrompt(requestId) {
  const width = 450;
  const height = 620;
  try {
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
  console.log("Gravity: [Background] Starting Push Subscription sequence...");
  try {
    const reg = self.registration;
    if (!reg || !reg.pushManager) {
      throw new Error("PushManager not available in Service Worker context");
    }
    let sub = await reg.pushManager.getSubscription();
    if (sub) {
      console.log("Gravity: [Background] Found existing subscription");
      return sub;
    }
    console.log("Gravity: [Background] Requesting new subscription...");
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });
    console.log("Gravity: [Background] Subscription SUCCESS:", JSON.stringify(sub));
    await chrome.storage.local.set({ gravity_push_sub: JSON.stringify(sub) });
    return sub;
  } catch (e) {
    console.error("Gravity: [Background] Push Subscription ERROR:", e.name, e.message);
    throw e;
  }
}
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "CHAT_CHECK_PUSH") {
    getExistingSubscription().then((sub) => sendResponse({ success: true, subscription: sub })).catch((err) => sendResponse({ success: false, error: err.toString() }));
    return true;
  }
  if (msg.type === "CHAT_ENABLE_PUSH") {
    manualPushSubscribe().then((sub) => sendResponse({ success: true, subscription: sub })).catch((err) => sendResponse({ success: false, error: err.message || err.toString() }));
    return true;
  }
});
self.addEventListener("push", (event) => {
  console.log("Gravity: Push Event Received");
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
