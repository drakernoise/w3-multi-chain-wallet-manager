import { b as broadcastTransfer, a as broadcastVote, c as broadcastCustomJson, s as signMessage, d as broadcastOperations, i as isChainSupported, g as getChainConfig, e as broadcastPowerUp, f as broadcastPowerDown, h as broadcastDelegation } from './chainService.js';
import { b as lookup } from './vendor.js';

let socket = null;
let unreadCount = 0;
const SERVER_URL = "https://gravity-chat-serve.onrender.com";
function hexToBuffer(hexString) {
  if (!hexString) return new Uint8Array().buffer;
  const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  return bytes.buffer;
}
async function signChallenge(challenge, privateKeyHex) {
  try {
    const privateKeyBuffer = hexToBuffer(privateKeyHex);
    const cryptoLib = (typeof crypto !== "undefined" ? crypto : null) || (typeof globalThis !== "undefined" && globalThis.crypto ? globalThis.crypto : null);
    if (!cryptoLib || !cryptoLib.subtle) {
      console.error("BG: Crypto Subtle API NOT available in this context");
      return null;
    }
    const privateKey = await cryptoLib.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"]
    );
    const encoder = new TextEncoder();
    const data = encoder.encode(challenge);
    const signature = await cryptoLib.subtle.sign(
      { name: "ECDSA", hash: { name: "SHA-256" } },
      privateKey,
      data
    );
    return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    console.error("BG: Signing Failed", e);
    return null;
  }
}
function updateBadge() {
  const text = unreadCount > 0 ? unreadCount > 9 ? "9+" : String(unreadCount) : "";
  const color = "#9333EA";
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}
async function initChatSocket() {
  const data = await chrome.storage.local.get(["gravity_chat_creds"]);
  const creds = data.gravity_chat_creds;
  if (!creds || !creds.username || !creds.privateKey) {
    console.log("BG Chat: No credentials found. Chat disabled.");
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    return;
  }
  if (socket && socket.connected) {
    return;
  }
  console.log("BG Chat: Connecting as", creds.username);
  socket = lookup(SERVER_URL, {
    transports: ["websocket"],
    // Force websocket in SW
    reconnection: true,
    reconnectionDelay: 5e3,
    query: {
      username: creds.username,
      publicKey: creds.publicKey
    }
  });
  socket.on("connect", () => {
    console.log("BG Chat: Connected!");
    socket?.emit("request_challenge", { username: creds.username });
  });
  socket.on("auth_challenge", async (challenge) => {
    console.log("BG Chat: Received challenge to sign");
    const signature = await signChallenge(challenge, creds.privateKey);
    if (signature && socket) {
      socket.emit("verify_signature", { signature });
    }
  });
  socket.on("auth_success", (data2) => {
    console.log("BG Chat: Authenticated! Rooms:", data2.rooms);
    if (data2.rooms && Array.isArray(data2.rooms)) {
      data2.rooms.forEach((r) => {
        socket?.emit("join_room", r.id);
      });
    }
    updateBadge();
  });
  socket.on("new_message", (data2) => {
    console.log("BG Chat: New Message", data2);
    if (data2.message && data2.message.senderName === creds.username) return;
    unreadCount++;
    updateBadge();
  });
  socket.on("message_notification", (_data) => {
    unreadCount++;
    updateBadge();
  });
  socket.on("disconnect", () => {
    console.log("BG Chat: Disconnected");
  });
}
function setupChatListeners() {
  chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
    if (request.type === "CHAT_SYNC_CREDS") {
      console.log("BG Chat: Syncing credentials...");
      chrome.storage.local.set({ gravity_chat_creds: request.data }).then(() => {
        unreadCount = 0;
        updateBadge();
        initChatSocket();
      });
    }
    if (request.type === "CHAT_LOGOUT") {
      console.log("BG Chat: Logging out...");
      chrome.storage.local.remove(["gravity_chat_creds"]).then(() => {
        unreadCount = 0;
        updateBadge();
        if (socket) {
          socket.disconnect();
          socket = null;
        }
      });
    }
    if (request.type === "CHAT_UI_OPENED") {
      unreadCount = 0;
      updateBadge();
    }
  });
  initChatSocket();
  chrome.alarms.create("keepChatAlive", { periodInMinutes: 1 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keepChatAlive") {
      if (!socket || !socket.connected) {
        console.log("BG Chat: Alarm triggered check - Reconnecting...");
        initChatSocket();
      }
    }
  });
}

self.exports = {};
setupChatListeners();
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
      sendResponse({ success: true, version: "1.0", msg: "Gravity Wallet Active" });
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
  if (request.type === "UPDATE_BADGE") {
    const count = request.count || 0;
    chrome.action.setBadgeText({ text: count > 0 ? String(count) : "" });
    chrome.action.setBadgeBackgroundColor({ color: "#9333EA" });
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
      console.log("Gravity: Forcing manual confirmation for financial operation:", method);
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
    const isSignedCall = method === "requestSignedCall" || method === "signedCall";
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
      const url2 = sender?.tab?.url || sender?.url || "";
      const urlChain = detectChainFromUrl(url2);
      const targetChain = request.requestChain || urlChain || account.chain;
      const useLegacySigner = url2.includes("tribaldex") || url2.includes("hive-engine");
      response = signMessage(targetChain, message, keyStr, useLegacySigner);
    } else if (isBroadcast) {
      let operations = request.params[1];
      const keyType = request.params[2];
      if (operations && !Array.isArray(operations) && operations.operations) operations = operations.operations;
      try {
        if (operations && Array.isArray(operations)) {
          operations = operations.map((op) => {
            if (Array.isArray(op) && op[0] === "comment" && op[1]) {
              const payload = op[1];
              let parentPermlink = payload.parent_permlink;
              if (!parentPermlink && !payload.parent_author) {
                console.warn("Gravity: Sanitizing generic broadcast comment - missing parent_permlink");
                if (payload.category) {
                  parentPermlink = payload.category;
                  console.log("Gravity: Using category as parent_permlink:", payload.category);
                }
                if (!parentPermlink && payload.json_metadata) {
                  try {
                    const meta = typeof payload.json_metadata === "string" ? JSON.parse(payload.json_metadata) : payload.json_metadata;
                    if (meta.tags && meta.tags[0]) {
                      parentPermlink = meta.tags[0];
                      console.log("Gravity: Recovered parent_permlink from tags:", meta.tags[0]);
                    }
                  } catch (e) {
                  }
                }
                if (!parentPermlink) {
                  parentPermlink = "general";
                  console.warn('Gravity: Using fallback "general" for parent_permlink');
                }
              }
              const cleanPayload = {
                parent_author: payload.parent_author || "",
                parent_permlink: parentPermlink || "general",
                author: payload.author || "",
                permlink: payload.permlink || "",
                title: payload.title || "",
                body: payload.body || "",
                json_metadata: payload.json_metadata || "{}"
              };
              return ["comment", cleanPayload];
            }
            if (op[0] === "custom_json") {
              const payload = op[1];
              const cleanPayload = {
                required_auths: payload.required_auths !== void 0 && Array.isArray(payload.required_auths) ? payload.required_auths : [],
                required_posting_auths: payload.required_posting_auths !== void 0 && Array.isArray(payload.required_posting_auths) ? payload.required_posting_auths : [],
                id: payload.id || "",
                json: typeof payload.json === "string" ? payload.json : JSON.stringify(payload.json || {})
              };
              return ["custom_json", cleanPayload];
            }
            return op;
          });
        }
      } catch (err) {
        console.warn("Gravity: Error during operation sanitization (non-fatal)", err);
      }
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
      console.log("Gravity: requestPost params:", { title, parentPermlink, parentAuthor, jsonMetadata, permlink });
      const jsonMetadataStr = typeof jsonMetadata === "string" ? jsonMetadata : JSON.stringify(jsonMetadata);
      if (!parentPermlink) {
        console.warn("Gravity: parent_permlink is missing. Attempting recovery...");
        if (request.params.category) {
          parentPermlink = request.params.category;
          console.log("Gravity: Recovered parent_permlink from category field:", parentPermlink);
        }
        if (!parentPermlink) {
          try {
            const metadata = typeof jsonMetadata === "string" ? JSON.parse(jsonMetadata) : jsonMetadata;
            if (metadata && metadata.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0) {
              parentPermlink = metadata.tags[0];
              console.log("Gravity: Recovered parent_permlink from tags:", parentPermlink);
            }
          } catch (e) {
            console.warn("Gravity: Failed to parse metadata params for recovery:", e);
          }
        }
        if (!parentPermlink && !parentAuthor) {
          parentPermlink = "general";
          console.warn('Gravity: Using fallback "general" for parent_permlink');
        }
      }
      if (!parentPermlink) {
        console.error("Gravity: Critical - parent_permlink is still null/undefined. Operation will fail.");
        return { success: false, error: "Missing parent_permlink (category/tag)" };
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
      console.log("Gravity: Broadcasting post op:", op);
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
      if (!account.activeKey) {
        return { success: false, gravity_error: "MISSING_ACTIVE_KEY", error: "Gravity Wallet: Active Key required for Power Up." };
      }
      response = await broadcastPowerUp(account.chain, account.name, account.activeKey, to, amount);
    } else if (isPowerDown) {
      let vestingShares = request.params[1];
      if (vestingShares && !vestingShares.includes(" ")) {
        const config = isChainSupported(account.chain) ? getChainConfig(account.chain) : null;
        const vestingToken = config ? config.vestingToken : "VESTS";
        vestingShares = `${parseFloat(vestingShares).toFixed(6)} ${vestingToken}`;
      }
      if (!account.activeKey) return { success: false, gravity_error: "MISSING_ACTIVE_KEY", error: "Gravity Wallet: Active Key required for Power Down." };
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
    } else if (isSignedCall) {
      const apiMethod = request.params[1];
      const apiParams = request.params[2];
      const keyType = request.params[3];
      let keyStr = "";
      if (keyType === "Posting") keyStr = account.postingKey || "";
      else if (keyType === "Active") keyStr = account.activeKey || "";
      else keyStr = account.postingKey || "";
      if (!keyStr) return { success: false, error: "Key required for signed call" };
      const customJsonOp = ["custom_json", {
        required_auths: keyType === "Active" ? [username] : [],
        required_posting_auths: keyType === "Posting" ? [username] : [],
        id: apiMethod,
        json: JSON.stringify(apiParams)
      }];
      response = await broadcastOperations(account.chain, keyStr, [customJsonOp]);
    } else {
      return { success: false, error: "Unsupported operation" };
    }
    if (!response) {
      console.error("Gravity: No response from broadcast operation");
      return { success: false, error: "No response from wallet" };
    }
    if (!response.success) {
      return { success: false, error: response.error || "Operation failed" };
    }
    const finalResult = response.opResult || response.txId || response.result || "success";
    const result = isSignBuffer ? { result: response.result, message: "Signed successfully", ...response } : { result: finalResult, message: "Signed successfully", ...response };
    if (typeof result !== "object") {
      return { success: true, pending: false, result, message: "Signed successfully" };
    }
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
