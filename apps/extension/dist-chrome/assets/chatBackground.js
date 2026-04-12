import './index2.js';

if (typeof WebSocket === "undefined" && typeof self.WebSocket !== "undefined") {
  globalThis.WebSocket = self.WebSocket;
}
