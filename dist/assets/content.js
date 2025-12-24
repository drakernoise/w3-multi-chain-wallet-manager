window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data || event.data.type !== "gravity_request") {
    return;
  }
  chrome.runtime.sendMessage(event.data, (response) => {
    if (response && response.pending !== true) {
      window.postMessage({
        type: "gravity_response",
        id: event.data.id,
        response
      }, "*");
    }
  });
});
chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
  if (msg.type === "gravity_response") {
    window.postMessage(msg, "*");
  }
});
