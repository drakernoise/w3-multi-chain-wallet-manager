if (!window._gravityProvider) {
  let initializeProvider2 = function() {
    const provider = new GravityProvider();
    window.gravity = provider;
    window._gravityProvider = provider;
    WALLET_ALIASES.forEach((alias) => {
      const existing = window[alias];
      if (!existing || typeof existing.requestHandshake !== "function") {
        window[alias] = provider;
      }
    });
  }, dispatchHandshakeEvents2 = function() {
    const detail = {
      version: PROVIDER_CONFIG.version,
      name: PROVIDER_CONFIG.name
    };
    HANDSHAKE_EVENTS.forEach((eventName) => {
      window.dispatchEvent(new CustomEvent(eventName, { detail }));
      document.dispatchEvent(new CustomEvent(eventName, { detail }));
    });
  }, setupEventDispatching2 = function() {
    dispatchHandshakeEvents2();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", dispatchHandshakeEvents2);
    }
    window.addEventListener("load", dispatchHandshakeEvents2);
    setTimeout(dispatchHandshakeEvents2, 100);
    setTimeout(dispatchHandshakeEvents2, 500);
    setTimeout(dispatchHandshakeEvents2, 1e3);
    setTimeout(dispatchHandshakeEvents2, 2e3);
  };
  const PROVIDER_CONFIG = {
    name: "Gravity",
    version: "1.0.5",
    messageType: "gravity_request",
    responseType: "gravity_response"
  };
  const WALLET_ALIASES = [
    "hive_keychain",
    "whalevault",
    "blurt_keychain",
    "blurt",
    "steem_keychain"
  ];
  const HANDSHAKE_EVENTS = [
    "hive_keychain_handshake",
    "whalevault_handshake",
    "steem_keychain_handshake",
    "blurt_keychain_handshake"
  ];
  class GravityProvider {
    callbacks;
    name;
    version;
    constructor() {
      this.name = PROVIDER_CONFIG.name;
      this.version = PROVIDER_CONFIG.version;
      this.callbacks = /* @__PURE__ */ new Map();
      this.setupListener();
    }
    /**
     * Set up message listener for responses from the extension
     */
    setupListener() {
      window.addEventListener("message", (event) => {
        if (event.source !== window) return;
        const data = event.data;
        if (data?.type === PROVIDER_CONFIG.responseType) {
          const callback = this.callbacks.get(data.id);
          if (callback) {
            callback(data.response);
            this.callbacks.delete(data.id);
          }
        }
      });
    }
    /**
     * Generate a unique request ID
     */
    generateId() {
      const randomBytes = new Uint32Array(1);
      window.crypto.getRandomValues(randomBytes);
      return `${Date.now()}-${randomBytes[0]}`;
    }
    /**
     * Send a request to the extension
     */
    send(method, params, callback) {
      const id = this.generateId();
      const sendMessage = () => {
        window.postMessage({
          type: PROVIDER_CONFIG.messageType,
          id,
          method,
          params,
          appName: PROVIDER_CONFIG.name
        }, window.location.origin);
      };
      if (callback) {
        this.callbacks.set(id, callback);
        sendMessage();
      } else {
        return new Promise((resolve, reject) => {
          this.callbacks.set(id, (response) => {
            if (response.success) {
              resolve(response);
            } else {
              reject(response);
            }
          });
          sendMessage();
        });
      }
    }
    // ==================== API Methods ====================
    /**
     * Handshake to verify extension is installed and ready
     */
    requestHandshake = (callback) => {
      const response = {
        success: true,
        message: "Handshake successful",
        version: this.version,
        name: this.name
      };
      if (callback) {
        setTimeout(() => callback(response), 0);
      } else {
        return Promise.resolve(response);
      }
    };
    /**
     * Request a transfer transaction
     */
    requestTransfer = (username, to, amount, memo, currency, callback, enforceEndpoint) => {
      return this.send("requestTransfer", [username, to, amount, memo, currency, enforceEndpoint], callback);
    };
    /**
     * Request a vote transaction
     */
    requestVote = (username, permlink, author, weight, callback) => {
      return this.send("requestVote", [username, permlink, author, weight], callback);
    };
    /**
     * Request a post/comment transaction
     */
    requestPost = (username, title, body, parentPerm, parentAuthor, jsonMetadata, permlink, commentOptions, callback, _rpc) => {
      const actualCallback = typeof commentOptions === "function" ? commentOptions : callback;
      if (actualCallback) {
        return this.send("requestPost", [username, title, body, parentPerm, parentAuthor, jsonMetadata, permlink], actualCallback);
      } else {
        return new Promise((resolve, reject) => {
          this.send("requestPost", [username, title, body, parentPerm, parentAuthor, jsonMetadata, permlink], (response) => {
            if (response?.success) {
              resolve({ success: true, result: response.result });
            } else {
              reject(response?.error || "Unknown error");
            }
          });
        });
      }
    };
    /**
     * Request a custom JSON transaction
     */
    requestCustomJson = (username, id, key, json, display_msg, callback) => {
      return this.send("requestCustomJson", [username, id, key, json, display_msg], callback);
    };
    /**
     * Request message signing
     */
    requestSignBuffer = (username, message, key, callback) => {
      return this.send("requestSignBuffer", [username, message, key], callback);
    };
    /**
     * Alias for requestSignBuffer (WhaleVault compatibility)
     */
    requestVerifyKey = (username, message, key, callback) => {
      return this.requestSignBuffer(username, message, key, callback);
    };
    /**
     * Request transaction broadcast
     */
    requestBroadcast = (username, operations, key, callback) => {
      return this.send("requestBroadcast", [username, operations, key], callback);
    };
    /**
     * Alias for requestBroadcast
     */
    requestSignTx = (username, operations, key, callback) => {
      return this.requestBroadcast(username, operations, key, callback);
    };
    /**
     * Request signed call (BlurtWallet/Blurt Keychain specific)
     * This method is required by BlurtWallet's hasCompatibleKeychain() check
     */
    requestSignedCall = (username, method, params, key, callback) => {
      return this.send("requestSignedCall", [username, method, params, key], callback);
    };
    /**
     * Request Power Up (Staking)
     */
    requestPowerUp = (username, to, amount, callback) => {
      return this.send("requestPowerUp", [username, to, amount], callback);
    };
    /**
     * Request Power Down (Unstaking)
     */
    requestPowerDown = (username, vestingShares, callback) => {
      return this.send("requestPowerDown", [username, vestingShares], callback);
    };
    /**
     * Request Delegation
     */
    requestDelegation = (username, delegatee, amount, unit, callback) => {
      return this.send("requestDelegation", [username, delegatee, amount, unit], callback);
    };
  }
  initializeProvider2();
  setupEventDispatching2();
}
