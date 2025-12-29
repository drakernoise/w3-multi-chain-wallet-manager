import './modulepreload-polyfill.js';
import { b as lookup } from './vendor.js';

let socket = null;
const SERVER_URL = "https://gravity-chat-serve.onrender.com";
chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
  if (msg.type === "INIT_CHAT") {
    initChat(msg.creds);
  } else if (msg.type === "DISCONNECT_CHAT") {
    disconnectChat();
  }
});
function hexToBuffer(hexString) {
  if (!hexString) return new Uint8Array().buffer;
  const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  return bytes.buffer;
}
async function signChallenge(challenge, privateKeyHex) {
  try {
    const privateKeyBuffer = hexToBuffer(privateKeyHex);
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"]
    );
    const encoder = new TextEncoder();
    const data = encoder.encode(challenge);
    const signature = await crypto.subtle.sign(
      { name: "ECDSA", hash: { name: "SHA-256" } },
      privateKey,
      data
    );
    return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    console.error("Offscreen: Signing Failed", e);
    return null;
  }
}
async function initChat(creds) {
  if (socket && socket.connected) {
    socket.disconnect();
  }
  console.log("Offscreen: Connecting...", creds.username);
  socket = lookup(SERVER_URL, {
    reconnection: true,
    transports: ["websocket"],
    query: {
      username: creds.username,
      publicKey: creds.publicKey
    }
  });
  socket.on("connect", () => {
    console.log("Offscreen: Connected, requesting challenge");
    socket?.emit("request_challenge", { username: creds.username });
  });
  socket.on("auth_challenge", async (challenge) => {
    const signature = await signChallenge(challenge, creds.privateKey);
    if (signature) socket?.emit("verify_signature", { signature });
  });
  socket.on("auth_success", (data) => {
    console.log("Offscreen: Authenticated");
    if (data.rooms && Array.isArray(data.rooms)) {
      data.rooms.forEach((r) => socket?.emit("join_room", r.id));
    }
  });
  socket.on("new_message", (data) => {
    const sender = data.message?.senderName || "";
    const myName = creds.username || "";
    if (sender.toLowerCase() === myName.toLowerCase()) return;
    chrome.runtime.sendMessage({ type: "OFFSCREEN_NEW_MESSAGE" });
  });
  socket.on("message_notification", () => {
    chrome.runtime.sendMessage({ type: "OFFSCREEN_NEW_MESSAGE" });
  });
}
function disconnectChat() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
try {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["gravity_chat_creds"], (res) => {
      if (res && res.gravity_chat_creds) {
        initChat(res.gravity_chat_creds);
      }
    });
  }
} catch (e) {
  console.error("Offscreen: Storage init error", e);
}
