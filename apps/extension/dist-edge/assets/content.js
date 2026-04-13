chrome.storage.local.get(["gravity_active_nodes"], (res) => {
  if (res.gravity_active_nodes) {
    document.documentElement.dataset.gravityActiveRpc = JSON.stringify(res.gravity_active_nodes);
  }
});
window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data) {
    return;
  }
  if (event.data.type !== "gravity_request") {
    return;
  }
  console.log("[Gravity Content] Received request:", event.data.method, event.data.id);
  console.log("[Gravity Content] Sending to background...");
  const postErrorToPage = (error) => {
    window.postMessage({
      type: "gravity_response",
      id: event.data.id,
      response: {
        success: false,
        error
      }
    }, "*");
  };
  try {
    chrome.runtime.sendMessage(event.data, (response) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        console.error("[Gravity Content] sendMessage FAILED:", lastError.message);
        postErrorToPage(lastError.message);
        return;
      }
      console.log("[Gravity Content] Got response from background:", response);
      if (response && response.pending !== true) {
        window.postMessage({
          type: "gravity_response",
          id: event.data.id,
          response
        }, "*");
      }
    });
  } catch (error) {
    const message = error?.message || "Failed to forward request to extension background.";
    console.error("[Gravity Content] sendMessage THREW:", message);
    postErrorToPage(message);
  }
});
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  console.log("[Gravity Content] Message from background:", msg.type);
  if (msg.type === "gravity_response") {
    console.log("[Gravity Content] Posting response to page:", msg.id);
    window.postMessage(msg, "*");
    if (typeof sendResponse === "function") {
      sendResponse({ ack: true });
    }
  }
  return false;
});
if (typeof navigator !== "undefined" && navigator.userAgent.includes("Firefox")) {
  const injectProvider = () => {
    try {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL("assets/provider.js");
      script.type = "module";
      script.onload = () => {
        console.log("[Gravity] Successfully injected Firefox Web3 Provider");
        script.remove();
      };
      (document.head || document.documentElement).appendChild(script);
    } catch (e) {
      console.error("[Gravity] Failed to inject provider for Firefox:", e);
    }
  };
  injectProvider();
}
