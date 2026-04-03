const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./web.js","./main.js","./modulepreload-polyfill.js","./index.js","./main.css","./chainService.js","./index2.js"])))=>i.map(i=>d[i]);
import { _ as __vitePreload, r as reactExports, j as jsxRuntimeExports, R as React } from './main.js';
import { o as global, r as requireCryptoBrowserify, V as ViewState, C as Chain, p as checkAccountExists, h as broadcastPowerUp, j as broadcastPowerDown, k as broadcastDelegation, q as broadcastSavingsDeposit, t as broadcastSavingsWithdraw, u as fetchAccountData, v as broadcastRCDelegate, w as broadcastRCUndelegate, x as broadcastBulkTransfer, d as broadcastCustomJson, y as fetchCustomJsonEventsForAccounts, z as calculateThresholdProgress, A as getAccountAuthorities, B as createUnsignedTransaction, D as signTransactionEnvelope, E as selectBroadcastSignatures, F as broadcastSignedTransaction, G as indexBrowserExports, H as indexBrowserExports$1, I as validateAccountKeys, J as fetchAccountHistory, a as broadcastTransfer, c as broadcastVote, s as signMessage, e as broadcastOperations, l as broadcastWitnessVote, K as fetchBalances, L as detectWeb3Context, b as benchmarkNodes } from './chainService.js';
import { l as lookup } from './index2.js';
import { a as Buffer, g as getDefaultExportFromCjs } from './index.js';

/*! Capacitor: https://capacitorjs.com/ - MIT License */
const createCapacitorPlatforms = (win) => {
    const defaultPlatformMap = new Map();
    defaultPlatformMap.set('web', { name: 'web' });
    const capPlatforms = win.CapacitorPlatforms || {
        currentPlatform: { name: 'web' },
        platforms: defaultPlatformMap,
    };
    const addPlatform = (name, platform) => {
        capPlatforms.platforms.set(name, platform);
    };
    const setPlatform = (name) => {
        if (capPlatforms.platforms.has(name)) {
            capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
        }
    };
    capPlatforms.addPlatform = addPlatform;
    capPlatforms.setPlatform = setPlatform;
    return capPlatforms;
};
const initPlatforms = (win) => (win.CapacitorPlatforms = createCapacitorPlatforms(win));
/**
 * @deprecated Set `CapacitorCustomPlatform` on the window object prior to runtime executing in the web app instead
 */
const CapacitorPlatforms = /*#__PURE__*/ initPlatforms((typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
            ? window
            : typeof global !== 'undefined'
                ? global
                : {}));
/**
 * @deprecated Set `CapacitorCustomPlatform` on the window object prior to runtime executing in the web app instead
 */
CapacitorPlatforms.addPlatform;
/**
 * @deprecated Set `CapacitorCustomPlatform` on the window object prior to runtime executing in the web app instead
 */
CapacitorPlatforms.setPlatform;

var ExceptionCode;
(function (ExceptionCode) {
    /**
     * API is not implemented.
     *
     * This usually means the API can't be used because it is not implemented for
     * the current platform.
     */
    ExceptionCode["Unimplemented"] = "UNIMPLEMENTED";
    /**
     * API is not available.
     *
     * This means the API can't be used right now because:
     *   - it is currently missing a prerequisite, such as network connectivity
     *   - it requires a particular platform or browser version
     */
    ExceptionCode["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (ExceptionCode = {}));
class CapacitorException extends Error {
    constructor(message, code, data) {
        super(message);
        this.message = message;
        this.code = code;
        this.data = data;
    }
}
const getPlatformId = (win) => {
    var _a, _b;
    if (win === null || win === void 0 ? void 0 : win.androidBridge) {
        return 'android';
    }
    else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
        return 'ios';
    }
    else {
        return 'web';
    }
};

const createCapacitor = (win) => {
    var _a, _b, _c, _d, _e;
    const capCustomPlatform = win.CapacitorCustomPlatform || null;
    const cap = win.Capacitor || {};
    const Plugins = (cap.Plugins = cap.Plugins || {});
    /**
     * @deprecated Use `capCustomPlatform` instead, default functions like registerPlugin will function with the new object.
     */
    const capPlatforms = win.CapacitorPlatforms;
    const defaultGetPlatform = () => {
        return capCustomPlatform !== null
            ? capCustomPlatform.name
            : getPlatformId(win);
    };
    const getPlatform = ((_a = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a === void 0 ? void 0 : _a.getPlatform) || defaultGetPlatform;
    const defaultIsNativePlatform = () => getPlatform() !== 'web';
    const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
    const defaultIsPluginAvailable = (pluginName) => {
        const plugin = registeredPlugins.get(pluginName);
        if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
            // JS implementation available for the current platform.
            return true;
        }
        if (getPluginHeader(pluginName)) {
            // Native implementation available.
            return true;
        }
        return false;
    };
    const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c === void 0 ? void 0 : _c.isPluginAvailable) ||
        defaultIsPluginAvailable;
    const defaultGetPluginHeader = (pluginName) => { var _a; return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find(h => h.name === pluginName); };
    const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d === void 0 ? void 0 : _d.getPluginHeader) || defaultGetPluginHeader;
    const handleError = (err) => win.console.error(err);
    const pluginMethodNoop = (_target, prop, pluginName) => {
        return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
    };
    const registeredPlugins = new Map();
    const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
        const registeredPlugin = registeredPlugins.get(pluginName);
        if (registeredPlugin) {
            console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
            return registeredPlugin.proxy;
        }
        const platform = getPlatform();
        const pluginHeader = getPluginHeader(pluginName);
        let jsImplementation;
        const loadPluginImplementation = async () => {
            if (!jsImplementation && platform in jsImplementations) {
                jsImplementation =
                    typeof jsImplementations[platform] === 'function'
                        ? (jsImplementation = await jsImplementations[platform]())
                        : (jsImplementation = jsImplementations[platform]);
            }
            else if (capCustomPlatform !== null &&
                !jsImplementation &&
                'web' in jsImplementations) {
                jsImplementation =
                    typeof jsImplementations['web'] === 'function'
                        ? (jsImplementation = await jsImplementations['web']())
                        : (jsImplementation = jsImplementations['web']);
            }
            return jsImplementation;
        };
        const createPluginMethod = (impl, prop) => {
            var _a, _b;
            if (pluginHeader) {
                const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find(m => prop === m.name);
                if (methodHeader) {
                    if (methodHeader.rtype === 'promise') {
                        return (options) => cap.nativePromise(pluginName, prop.toString(), options);
                    }
                    else {
                        return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
                    }
                }
                else if (impl) {
                    return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
                }
            }
            else if (impl) {
                return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
            }
            else {
                throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
            }
        };
        const createPluginMethodWrapper = (prop) => {
            let remove;
            const wrapper = (...args) => {
                const p = loadPluginImplementation().then(impl => {
                    const fn = createPluginMethod(impl, prop);
                    if (fn) {
                        const p = fn(...args);
                        remove = p === null || p === void 0 ? void 0 : p.remove;
                        return p;
                    }
                    else {
                        throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
                    }
                });
                if (prop === 'addListener') {
                    p.remove = async () => remove();
                }
                return p;
            };
            // Some flair ✨
            wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
            Object.defineProperty(wrapper, 'name', {
                value: prop,
                writable: false,
                configurable: false,
            });
            return wrapper;
        };
        const addListener = createPluginMethodWrapper('addListener');
        const removeListener = createPluginMethodWrapper('removeListener');
        const addListenerNative = (eventName, callback) => {
            const call = addListener({ eventName }, callback);
            const remove = async () => {
                const callbackId = await call;
                removeListener({
                    eventName,
                    callbackId,
                }, callback);
            };
            const p = new Promise(resolve => call.then(() => resolve({ remove })));
            p.remove = async () => {
                console.warn(`Using addListener() without 'await' is deprecated.`);
                await remove();
            };
            return p;
        };
        const proxy = new Proxy({}, {
            get(_, prop) {
                switch (prop) {
                    // https://github.com/facebook/react/issues/20030
                    case '$$typeof':
                        return undefined;
                    case 'toJSON':
                        return () => ({});
                    case 'addListener':
                        return pluginHeader ? addListenerNative : addListener;
                    case 'removeListener':
                        return removeListener;
                    default:
                        return createPluginMethodWrapper(prop);
                }
            },
        });
        Plugins[pluginName] = proxy;
        registeredPlugins.set(pluginName, {
            name: pluginName,
            proxy,
            platforms: new Set([
                ...Object.keys(jsImplementations),
                ...(pluginHeader ? [platform] : []),
            ]),
        });
        return proxy;
    };
    const registerPlugin = ((_e = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e === void 0 ? void 0 : _e.registerPlugin) || defaultRegisterPlugin;
    // Add in convertFileSrc for web, it will already be available in native context
    if (!cap.convertFileSrc) {
        cap.convertFileSrc = filePath => filePath;
    }
    cap.getPlatform = getPlatform;
    cap.handleError = handleError;
    cap.isNativePlatform = isNativePlatform;
    cap.isPluginAvailable = isPluginAvailable;
    cap.pluginMethodNoop = pluginMethodNoop;
    cap.registerPlugin = registerPlugin;
    cap.Exception = CapacitorException;
    cap.DEBUG = !!cap.DEBUG;
    cap.isLoggingEnabled = !!cap.isLoggingEnabled;
    // Deprecated props
    cap.platform = cap.getPlatform();
    cap.isNative = cap.isNativePlatform();
    return cap;
};
const initCapacitorGlobal = (win) => (win.Capacitor = createCapacitor(win));

const Capacitor = /*#__PURE__*/ initCapacitorGlobal(typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
            ? window
            : typeof global !== 'undefined'
                ? global
                : {});
const registerPlugin = Capacitor.registerPlugin;
/**
 * @deprecated Provided for backwards compatibility for Capacitor v2 plugins.
 * Capacitor v3 plugins should import the plugin directly. This "Plugins"
 * export is deprecated in v3, and will be removed in v4.
 */
Capacitor.Plugins;

/**
 * Base class web plugins should extend.
 */
class WebPlugin {
    constructor(config) {
        this.listeners = {};
        this.retainedEventArguments = {};
        this.windowListeners = {};
        if (config) {
            // TODO: add link to upgrade guide
            console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
            this.config = config;
        }
    }
    addListener(eventName, listenerFunc) {
        let firstListener = false;
        const listeners = this.listeners[eventName];
        if (!listeners) {
            this.listeners[eventName] = [];
            firstListener = true;
        }
        this.listeners[eventName].push(listenerFunc);
        // If we haven't added a window listener for this event and it requires one,
        // go ahead and add it
        const windowListener = this.windowListeners[eventName];
        if (windowListener && !windowListener.registered) {
            this.addWindowListener(windowListener);
        }
        if (firstListener) {
            this.sendRetainedArgumentsForEvent(eventName);
        }
        const remove = async () => this.removeListener(eventName, listenerFunc);
        const p = Promise.resolve({ remove });
        return p;
    }
    async removeAllListeners() {
        this.listeners = {};
        for (const listener in this.windowListeners) {
            this.removeWindowListener(this.windowListeners[listener]);
        }
        this.windowListeners = {};
    }
    notifyListeners(eventName, data, retainUntilConsumed) {
        const listeners = this.listeners[eventName];
        if (!listeners) {
            if (retainUntilConsumed) {
                let args = this.retainedEventArguments[eventName];
                if (!args) {
                    args = [];
                }
                args.push(data);
                this.retainedEventArguments[eventName] = args;
            }
            return;
        }
        listeners.forEach(listener => listener(data));
    }
    hasListeners(eventName) {
        return !!this.listeners[eventName].length;
    }
    registerWindowListener(windowEventName, pluginEventName) {
        this.windowListeners[pluginEventName] = {
            registered: false,
            windowEventName,
            pluginEventName,
            handler: event => {
                this.notifyListeners(pluginEventName, event);
            },
        };
    }
    unimplemented(msg = 'not implemented') {
        return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
    }
    unavailable(msg = 'not available') {
        return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
    }
    async removeListener(eventName, listenerFunc) {
        const listeners = this.listeners[eventName];
        if (!listeners) {
            return;
        }
        const index = listeners.indexOf(listenerFunc);
        this.listeners[eventName].splice(index, 1);
        // If there are no more listeners for this type of event,
        // remove the window listener
        if (!this.listeners[eventName].length) {
            this.removeWindowListener(this.windowListeners[eventName]);
        }
    }
    addWindowListener(handle) {
        window.addEventListener(handle.windowEventName, handle.handler);
        handle.registered = true;
    }
    removeWindowListener(handle) {
        if (!handle) {
            return;
        }
        window.removeEventListener(handle.windowEventName, handle.handler);
        handle.registered = false;
    }
    sendRetainedArgumentsForEvent(eventName) {
        const args = this.retainedEventArguments[eventName];
        if (!args) {
            return;
        }
        delete this.retainedEventArguments[eventName];
        args.forEach(arg => {
            this.notifyListeners(eventName, arg);
        });
    }
}
/******** END WEB VIEW PLUGIN ********/
/******** COOKIES PLUGIN ********/
/**
 * Safely web encode a string value (inspired by js-cookie)
 * @param str The string value to encode
 */
const encode = (str) => encodeURIComponent(str)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape);
/**
 * Safely web decode a string value (inspired by js-cookie)
 * @param str The string value to decode
 */
const decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class CapacitorCookiesPluginWeb extends WebPlugin {
    async getCookies() {
        const cookies = document.cookie;
        const cookieMap = {};
        cookies.split(';').forEach(cookie => {
            if (cookie.length <= 0)
                return;
            // Replace first "=" with CAP_COOKIE to prevent splitting on additional "="
            let [key, value] = cookie.replace(/=/, 'CAP_COOKIE').split('CAP_COOKIE');
            key = decode(key).trim();
            value = decode(value).trim();
            cookieMap[key] = value;
        });
        return cookieMap;
    }
    async setCookie(options) {
        try {
            // Safely Encoded Key/Value
            const encodedKey = encode(options.key);
            const encodedValue = encode(options.value);
            // Clean & sanitize options
            const expires = `; expires=${(options.expires || '').replace('expires=', '')}`; // Default is "; expires="
            const path = (options.path || '/').replace('path=', ''); // Default is "path=/"
            const domain = options.url != null && options.url.length > 0
                ? `domain=${options.url}`
                : '';
            document.cookie = `${encodedKey}=${encodedValue || ''}${expires}; path=${path}; ${domain};`;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async deleteCookie(options) {
        try {
            document.cookie = `${options.key}=; Max-Age=0`;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async clearCookies() {
        try {
            const cookies = document.cookie.split(';') || [];
            for (const cookie of cookies) {
                document.cookie = cookie
                    .replace(/^ +/, '')
                    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
            }
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async clearAllCookies() {
        try {
            await this.clearCookies();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
registerPlugin('CapacitorCookies', {
    web: () => new CapacitorCookiesPluginWeb(),
});
// UTILITY FUNCTIONS
/**
 * Read in a Blob value and return it as a base64 string
 * @param blob The blob value to convert to a base64 string
 */
const readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        const base64String = reader.result;
        // remove prefix "data:application/pdf;base64,"
        resolve(base64String.indexOf(',') >= 0
            ? base64String.split(',')[1]
            : base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
});
/**
 * Normalize an HttpHeaders map by lowercasing all of the values
 * @param headers The HttpHeaders object to normalize
 */
const normalizeHttpHeaders = (headers = {}) => {
    const originalKeys = Object.keys(headers);
    const loweredKeys = Object.keys(headers).map(k => k.toLocaleLowerCase());
    const normalized = loweredKeys.reduce((acc, key, index) => {
        acc[key] = headers[originalKeys[index]];
        return acc;
    }, {});
    return normalized;
};
/**
 * Builds a string of url parameters that
 * @param params A map of url parameters
 * @param shouldEncode true if you should encodeURIComponent() the values (true by default)
 */
const buildUrlParams = (params, shouldEncode = true) => {
    if (!params)
        return null;
    const output = Object.entries(params).reduce((accumulator, entry) => {
        const [key, value] = entry;
        let encodedValue;
        let item;
        if (Array.isArray(value)) {
            item = '';
            value.forEach(str => {
                encodedValue = shouldEncode ? encodeURIComponent(str) : str;
                item += `${key}=${encodedValue}&`;
            });
            // last character will always be "&" so slice it off
            item.slice(0, -1);
        }
        else {
            encodedValue = shouldEncode ? encodeURIComponent(value) : value;
            item = `${key}=${encodedValue}`;
        }
        return `${accumulator}&${item}`;
    }, '');
    // Remove initial "&" from the reduce
    return output.substr(1);
};
/**
 * Build the RequestInit object based on the options passed into the initial request
 * @param options The Http plugin options
 * @param extra Any extra RequestInit values
 */
const buildRequestInit = (options, extra = {}) => {
    const output = Object.assign({ method: options.method || 'GET', headers: options.headers }, extra);
    // Get the content-type
    const headers = normalizeHttpHeaders(options.headers);
    const type = headers['content-type'] || '';
    // If body is already a string, then pass it through as-is.
    if (typeof options.data === 'string') {
        output.body = options.data;
    }
    // Build request initializers based off of content-type
    else if (type.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(options.data || {})) {
            params.set(key, value);
        }
        output.body = params.toString();
    }
    else if (type.includes('multipart/form-data') ||
        options.data instanceof FormData) {
        const form = new FormData();
        if (options.data instanceof FormData) {
            options.data.forEach((value, key) => {
                form.append(key, value);
            });
        }
        else {
            for (const key of Object.keys(options.data)) {
                form.append(key, options.data[key]);
            }
        }
        output.body = form;
        const headers = new Headers(output.headers);
        headers.delete('content-type'); // content-type will be set by `window.fetch` to includy boundary
        output.headers = headers;
    }
    else if (type.includes('application/json') ||
        typeof options.data === 'object') {
        output.body = JSON.stringify(options.data);
    }
    return output;
};
// WEB IMPLEMENTATION
class CapacitorHttpPluginWeb extends WebPlugin {
    /**
     * Perform an Http request given a set of options
     * @param options Options to build the HTTP request
     */
    async request(options) {
        const requestInit = buildRequestInit(options, options.webFetchExtra);
        const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
        const url = urlParams ? `${options.url}?${urlParams}` : options.url;
        const response = await fetch(url, requestInit);
        const contentType = response.headers.get('content-type') || '';
        // Default to 'text' responseType so no parsing happens
        let { responseType = 'text' } = response.ok ? options : {};
        // If the response content-type is json, force the response to be json
        if (contentType.includes('application/json')) {
            responseType = 'json';
        }
        let data;
        let blob;
        switch (responseType) {
            case 'arraybuffer':
            case 'blob':
                blob = await response.blob();
                data = await readBlobAsBase64(blob);
                break;
            case 'json':
                data = await response.json();
                break;
            case 'document':
            case 'text':
            default:
                data = await response.text();
        }
        // Convert fetch headers to Capacitor HttpHeaders
        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });
        return {
            data,
            headers,
            status: response.status,
            url: response.url,
        };
    }
    /**
     * Perform an Http GET request given a set of options
     * @param options Options to build the HTTP request
     */
    async get(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: 'GET' }));
    }
    /**
     * Perform an Http POST request given a set of options
     * @param options Options to build the HTTP request
     */
    async post(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: 'POST' }));
    }
    /**
     * Perform an Http PUT request given a set of options
     * @param options Options to build the HTTP request
     */
    async put(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: 'PUT' }));
    }
    /**
     * Perform an Http PATCH request given a set of options
     * @param options Options to build the HTTP request
     */
    async patch(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: 'PATCH' }));
    }
    /**
     * Perform an Http DELETE request given a set of options
     * @param options Options to build the HTTP request
     */
    async delete(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: 'DELETE' }));
    }
}
registerPlugin('CapacitorHttp', {
    web: () => new CapacitorHttpPluginWeb(),
});

const Preferences = registerPlugin('Preferences', {
    web: () => __vitePreload(() => import('./web.js'),true              ?__vite__mapDeps([0,1,2,3,4,5,6]):void 0,import.meta.url).then(m => new m.PreferencesWeb()),
});

const isNativePlatform = () => {
  if (typeof window === "undefined") return false;
  const cap = window.Capacitor;
  if (!cap) return false;
  if (typeof cap.isNativePlatform === "function") {
    return cap.isNativePlatform();
  }
  return cap.getPlatform && cap.getPlatform() !== "web";
};
const storageService = {
  async getItem(key) {
    if (!key) return null;
    if (isNativePlatform()) {
      try {
        const { value } = await Preferences.get({ key });
        return value;
      } catch (e) {
        console.warn("Capacitor Storage Get Error:", e);
        return null;
      }
    }
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        try {
          chrome.storage.local.get([key], (result) => {
            const value = result && result[key] ? result[key] : null;
            if (value === null) {
              let local2 = localStorage.getItem(key);
              if (local2 === null) {
                local2 = localStorage.getItem(`CapacitorStorage.${key}`);
              }
              resolve(local2);
            } else {
              resolve(value);
            }
          });
        } catch (e) {
          let local2 = localStorage.getItem(key);
          if (local2 === null) {
            local2 = localStorage.getItem(`CapacitorStorage.${key}`);
          }
          resolve(local2);
        }
      });
    }
    let local = localStorage.getItem(key);
    if (local === null) {
      local = localStorage.getItem(`CapacitorStorage.${key}`);
    }
    return local;
  },
  async setItem(key, value) {
    if (!key) return;
    if (isNativePlatform()) {
      try {
        await Preferences.set({ key, value });
      } catch (e) {
        console.warn("Capacitor Storage Set Error:", e);
      }
      return;
    }
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        try {
          chrome.storage.local.set({ [key]: value }, () => {
            resolve();
          });
        } catch (e) {
          try {
            localStorage.setItem(key, value);
          } catch (err) {
          }
          resolve();
        }
      });
    }
    localStorage.setItem(key, value);
  },
  async removeItem(key) {
    if (!key) return;
    if (isNativePlatform()) {
      try {
        await Preferences.remove({ key });
      } catch (e) {
        console.warn("Capacitor Storage Remove Error:", e);
      }
      return;
    }
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        try {
          chrome.storage.local.remove([key], () => {
            localStorage.removeItem(key);
            localStorage.removeItem(`CapacitorStorage.${key}`);
            resolve();
          });
        } catch (e) {
          localStorage.removeItem(key);
          localStorage.removeItem(`CapacitorStorage.${key}`);
          resolve();
        }
      });
    }
    localStorage.removeItem(key);
    localStorage.removeItem(`CapacitorStorage.${key}`);
  },
  async clear() {
    if (isNativePlatform()) {
      try {
        await Preferences.clear();
      } catch (e) {
        console.warn("Capacitor Storage Clear Error:", e);
      }
      return;
    }
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        try {
          chrome.storage.local.clear(() => {
            localStorage.clear();
            resolve();
          });
        } catch (e) {
          localStorage.clear();
          resolve();
        }
      });
    }
    localStorage.clear();
  }
};

const SALT_LEN = 16;
const IV_LEN = 12;
const ITERATIONS = 6e5;
const ALGO = "AES-GCM";
const HASH = "SHA-256";
const enc = new TextEncoder();
const dec = new TextDecoder();
let cachedKey = null;
let cachedSalt = null;
const MOBILE_SESSION_KEY = "gravity_crypto_session_mobile";
async function getKey(password, salt) {
  const encPassword = enc.encode(password);
  return getKeyFromBytes(encPassword, salt);
}
async function getKeyFromBytes(passwordBytes, salt) {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    passwordBytes,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: HASH
    },
    keyMaterial,
    { name: ALGO, length: 256 },
    true,
    // Extractable (needed for session persistence)
    ["encrypt", "decrypt"]
  );
}
async function storeInternalKey(key) {
  await storageService.setItem("device_auth_struct", key);
}
async function getInternalKey() {
  let val = await storageService.getItem("device_auth_struct");
  if (!val) return null;
  try {
    if (typeof val === "string" && val.trim().startsWith("{")) {
      const parsed = JSON.parse(val);
      if (parsed.k) return parsed.k;
      if (parsed.key) return parsed.key;
    }
  } catch (e) {
  }
  return typeof val === "string" ? val : String(val);
}
async function hasPinProtectedKey() {
  const res = await storageService.getItem("device_pin_data");
  return !!res;
}
async function saveInternalKeyWithPin(keyStr, pin) {
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const pinKey = await getKey(pin, salt);
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LEN));
  const encData = new TextEncoder().encode(keyStr);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: ALGO, iv },
    pinKey,
    encData
  );
  const bundle = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  bundle.set(salt, 0);
  bundle.set(iv, SALT_LEN);
  bundle.set(new Uint8Array(encrypted), SALT_LEN + IV_LEN);
  const base64 = btoa(String.fromCharCode(...bundle));
  await storageService.setItem("device_pin_data", base64);
  await storageService.removeItem("device_auth_struct");
}
async function loadInternalKeyWithPin(pin) {
  const base64 = await storageService.getItem("device_pin_data");
  if (!base64) return null;
  try {
    const bundle = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const salt = bundle.slice(0, SALT_LEN);
    const iv = bundle.slice(SALT_LEN, SALT_LEN + IV_LEN);
    const ciphertext = bundle.slice(SALT_LEN + IV_LEN);
    const key = await getKey(pin, salt);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: ALGO, iv },
      key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    return null;
  }
}
async function initVault(password) {
  const emptyVault = { accounts: [], lastUpdated: Date.now() };
  await saveVault(password, emptyVault);
  return emptyVault;
}
async function initVaultWithGeneratedKey(pin) {
  const internalKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, "0")).join("");
  if (pin) {
    await saveInternalKeyWithPin(internalKey, pin);
  } else {
    throw new Error("Security Violation: Cannot initialize vault without a PIN or password protection.");
  }
  const emptyVault = { accounts: [], lastUpdated: Date.now() };
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const key = await getKey(internalKey, salt);
  cachedKey = key;
  cachedSalt = salt;
  await saveVault(internalKey, emptyVault);
  return { vault: emptyVault, internalKey };
}
async function enablePasswordless(accounts) {
  const internalKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, "0")).join("");
  await storeInternalKey(internalKey);
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const key = await getKey(internalKey, salt);
  cachedKey = key;
  cachedSalt = salt;
  const vault = { accounts, lastUpdated: Date.now() };
  await saveVault(internalKey, vault);
}
async function saveVault(password, vault) {
  let salt;
  let key;
  if (password === "cached") {
    if (cachedKey && cachedSalt) {
      key = cachedKey;
      salt = cachedSalt;
    } else {
      throw new Error("Attempted to save with cached key but cache is empty!");
    }
  } else {
    salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
    key = await getKey(password, salt);
    cachedKey = key;
    cachedSalt = salt;
    await persistSession();
  }
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LEN));
  const encodedData = enc.encode(JSON.stringify(vault));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: ALGO, iv },
    key,
    encodedData
  );
  const bundle = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  bundle.set(salt, 0);
  bundle.set(iv, SALT_LEN);
  bundle.set(new Uint8Array(encrypted), SALT_LEN + IV_LEN);
  const base64 = btoa(String.fromCharCode(...bundle));
  await storageService.setItem("vaultData", base64);
}
async function getVault() {
  return await storageService.getItem("vaultData");
}
async function tryDecrypt(password, base64Vault) {
  try {
    const bundle = Uint8Array.from(atob(base64Vault), (c) => c.charCodeAt(0));
    const salt = bundle.slice(0, SALT_LEN);
    const iv = bundle.slice(SALT_LEN, SALT_LEN + IV_LEN);
    const ciphertext = bundle.slice(SALT_LEN + IV_LEN);
    const key = await getKey(password, salt);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: ALGO, iv },
      key,
      ciphertext
    );
    cachedKey = key;
    cachedSalt = salt;
    await persistSession();
    return JSON.parse(dec.decode(decrypted));
  } catch (e) {
    return null;
  }
}
async function unlockVault(password) {
  const base64 = await storageService.getItem("vaultData");
  if (!base64) return null;
  let vault = await tryDecrypt(password, base64);
  if (vault) return vault;
  try {
    if (/^[A-Za-z0-9+/=]+$/.test(password)) {
      const decoded = atob(password);
      vault = await tryDecrypt(decoded, base64);
      if (vault) return vault;
    }
  } catch (e) {
  }
  return null;
}
function clearCryptoCache() {
  cachedKey = null;
  cachedSalt = null;
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
    chrome.storage.session.remove("crypto_session");
  }
  storageService.removeItem(MOBILE_SESSION_KEY).catch(() => {
  });
}
async function persistSession() {
  if (!cachedKey || !cachedSalt) return;
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
    const exported = await window.crypto.subtle.exportKey("raw", cachedKey);
    const saltArr = Array.from(cachedSalt);
    const keyArr = Array.from(new Uint8Array(exported));
    chrome.storage.session.set({
      crypto_session: { key: keyArr, salt: saltArr }
    });
  } else {
    const exported = await window.crypto.subtle.exportKey("raw", cachedKey);
    const saltArr = Array.from(cachedSalt);
    const keyArr = Array.from(new Uint8Array(exported));
    await storageService.setItem(MOBILE_SESSION_KEY, JSON.stringify({ key: keyArr, salt: saltArr }));
  }
}
async function tryRestoreSession() {
  if (cachedKey) return true;
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
    return new Promise((resolve) => {
      chrome.storage.session.get(["crypto_session"], async (res) => {
        if (res.crypto_session) {
          try {
            const { key, salt } = res.crypto_session;
            const importedKey = await window.crypto.subtle.importKey(
              "raw",
              new Uint8Array(key),
              ALGO,
              true,
              ["encrypt", "decrypt"]
            );
            cachedKey = importedKey;
            cachedSalt = new Uint8Array(salt);
            resolve(true);
          } catch (e) {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      });
    });
  }
  try {
    const raw = await storageService.getItem(MOBILE_SESSION_KEY);
    if (raw) {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (parsed?.key && parsed?.salt) {
        const importedKey = await window.crypto.subtle.importKey(
          "raw",
          new Uint8Array(parsed.key),
          ALGO,
          true,
          ["encrypt", "decrypt"]
        );
        cachedKey = importedKey;
        cachedSalt = new Uint8Array(parsed.salt);
        return true;
      }
    }
  } catch (e) {
  }
  return false;
}
async function generateEncryptionKeys() {
  return window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );
}
async function exportKeyToBase64(key) {
  let format;
  if (key.type === "secret") format = "raw";
  else format = key.type === "public" ? "spki" : "pkcs8";
  const exported = await window.crypto.subtle.exportKey(format, key);
  const buffer = new Uint8Array(exported);
  return btoa(String.fromCharCode(...buffer));
}
async function importKeyFromBase64(base64, type) {
  const binary = atob(base64);
  const buffer = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const format = type === "public" ? "spki" : "pkcs8";
  return window.crypto.subtle.importKey(
    format,
    buffer,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    type === "public" ? [] : ["deriveKey", "deriveBits"]
  );
}
async function deriveSharedSecret(privateKey, publicKey) {
  const sharedBits = await window.crypto.subtle.deriveBits(
    { name: "ECDH", public: publicKey },
    privateKey,
    256
  );
  const keyMaterial = await window.crypto.subtle.digest("SHA-256", sharedBits);
  return window.crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}
async function encryptMessage(text, sharedKey) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = enc.encode(text);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    sharedKey,
    encoded
  );
  const bundle = new Uint8Array(iv.length + encrypted.byteLength);
  bundle.set(iv, 0);
  bundle.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...bundle));
}
async function decryptMessage(base64Bundle, sharedKey) {
  try {
    const binary = atob(base64Bundle);
    const bundle = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const iv = bundle.slice(0, 12);
    const ciphertext = bundle.slice(12);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      sharedKey,
      ciphertext
    );
    return dec.decode(decrypted);
  } catch (e) {
    console.error("[cryptoService] Decryption failed:", e);
    return "[Encrypted Message - Cannot Decrypt]";
  }
}

class ChatService {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.username = null;
    // Callbacks for UI updates
    this.messageListeners = /* @__PURE__ */ new Set();
    this.onRoomUpdated = null;
    this.onRoomAdded = null;
    this.onAuthSuccess = null;
    this.onAuthenticated = null;
    // Alias for AuthSuccess
    this.onError = null;
    this.onStatusChange = null;
    this.rooms = [];
    this.serverUrl = "https://chat.gravitywallet.drakernoise.com";
    this.roomUpdateDebounceTimer = null;
  }
  addMessageListener(listener) {
    this.messageListeners.add(listener);
  }
  removeMessageListener(listener) {
    this.messageListeners.delete(listener);
  }
  init() {
    if (this.socket?.connected) return;
    this.socket = lookup(this.serverUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1e3,
      autoConnect: true
    });
    this.socket.on("connect", async () => {
      console.log("Connected to Chat Server");
      if (this.onStatusChange) this.onStatusChange("connected");
      window.dispatchEvent(new Event("chat-connected"));
      const storedUser = localStorage.getItem("gravity_chat_username");
      const storedKey = localStorage.getItem("gravity_chat_priv");
      const storedId = localStorage.getItem("gravity_chat_id");
      if (storedUser && !storedKey) {
        console.warn("Chat: Stored username without private key. Clearing stale identity.");
        localStorage.removeItem("gravity_chat_id");
        localStorage.removeItem("gravity_chat_username");
        localStorage.removeItem("gravity_chat_priv");
        localStorage.removeItem("gravity_chat_pub");
        if (this.onStatusChange) this.onStatusChange("disconnected", "Missing chat key");
        return;
      }
      if (storedUser && storedKey) {
        console.log("Auto-logging in as", storedUser);
        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
          const pubKey = localStorage.getItem("gravity_chat_pub") || "";
          chrome.runtime.sendMessage({
            type: "CHAT_SYNC_CREDS",
            data: {
              username: storedUser,
              privateKey: storedKey,
              publicKey: pubKey
            }
          }).catch(() => {
          });
        }
        await this.authenticateWithSignature(storedId, storedUser);
      }
    });
    this.setupListeners();
  }
  isConnected() {
    return !!this.socket?.connected;
  }
  syncPushSubscription(sub) {
    if (this.socket?.connected) {
      console.log("Chat: Manual Push Sync");
      this.socket.emit("store_push_subscription", sub);
    }
  }
  setupListeners() {
    if (!this.socket) return;
    this.socket.on("disconnect", () => {
      if (this.onStatusChange) this.onStatusChange("disconnected");
      window.dispatchEvent(new Event("chat-disconnected"));
    });
    this.socket.on("connect_error", (err) => {
      if (this.onStatusChange) this.onStatusChange("disconnected", err.message);
    });
    this.socket.on("auth_challenge", async (data) => {
      console.log("Received auth challenge");
      const storedKey = localStorage.getItem("gravity_chat_priv");
      if (storedKey) {
        try {
          const signature = await this.signChallenge(data.challenge, storedKey);
          this.socket?.emit("verify_signature", { signature });
        } catch (e) {
          console.error("Auto-signing challenge failed", e);
        }
      }
    });
    this.socket.on("auth_success", (data) => {
      if (this.userId === data.id && this.rooms.length > 0) {
        console.log(`Ignoring duplicate auth_success for ${data.username}`);
        return;
      }
      this.userId = data.id;
      this.username = data.username;
      this.rooms = data.rooms.map((r) => ({
        ...r,
        messages: [],
        unreadCount: 0
      }));
      console.log(`Auth Success! Received ${this.rooms.length} rooms:`, this.rooms.map((r) => r.name));
      if (data.pendingInvites && data.pendingInvites.length > 0) {
        console.log(`Received ${data.pendingInvites.length} pending invites`);
        if (typeof chrome !== "undefined" && chrome.runtime) {
          chrome.runtime.sendMessage({
            type: "UPDATE_BADGE",
            count: data.pendingInvites.length
          }).catch(() => {
          });
        }
        data.pendingInvites.forEach((invite) => {
          if (this.onError) {
            this.onError(`You were invited to "${invite.roomName}" by ${invite.invitedBy}`);
          }
        });
      }
      localStorage.setItem("gravity_chat_id", data.id);
      localStorage.setItem("gravity_chat_username", data.username);
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(["gravity_push_sub"], (res) => {
          if (res && res.gravity_push_sub) {
            try {
              const sub = JSON.parse(res.gravity_push_sub);
              console.log("Chat: Syncing WebPush Sub");
              this.socket?.emit("store_push_subscription", sub);
            } catch (e) {
            }
          }
        });
      }
      if (this.onAuthSuccess) this.onAuthSuccess({ id: data.id, username: data.username });
      if (this.onAuthenticated) this.onAuthenticated(data.id, data.username);
      this.notifyRoomUpdate();
    });
    this.socket.on("new_message", (data) => {
      this.handleNewMessage(data.roomId, data.message);
    });
    this.socket.on("room_history", async (data) => {
      const room = this.rooms.find((r) => r.id === data.roomId);
      if (room) {
        const hadMembers = room.memberDetails && room.memberDetails.length > 0;
        room.memberDetails = data.memberDetails;
        const hadMessages = room.messages.length > 0;
        room.messages = await Promise.all(data.messages.map((m) => this.processIncomingMessage(data.roomId, m)));
        if (!hadMessages && data.messages.length > 0 || !hadMembers && data.memberDetails && data.memberDetails.length > 0) {
          this.notifyRoomUpdate();
        }
      }
    });
    this.socket.on("member_joined", (data) => {
      const room = this.rooms.find((r) => r.id === data.roomId);
      if (room) {
        if (!room.memberDetails) room.memberDetails = [];
        if (!room.memberDetails.find((u) => u.id === data.userId)) {
          room.memberDetails.push({ id: data.userId, username: data.username });
          this.notifyRoomUpdate();
        }
      }
    });
    this.socket.on("room_added", (roomData) => {
      console.log(`room_added event received:`, roomData);
      if (this.rooms.find((r) => r.id === roomData.id)) {
        console.log(`Room ${roomData.name} already exists, skipping`);
        return;
      }
      const newRoom = { ...roomData, messages: [], unreadCount: 0 };
      this.rooms.push(newRoom);
      console.log(`Added room to local list. Total rooms: ${this.rooms.length}`);
      this.notifyRoomUpdate();
      if (this.onRoomAdded) this.onRoomAdded(newRoom);
    });
    this.socket.on("room_joined", (roomData) => {
      if (this.rooms.find((r) => r.id === roomData.id)) return;
      const newRoom = { ...roomData, messages: [], unreadCount: 0 };
      this.rooms.push(newRoom);
      this.notifyRoomUpdate();
      if (this.onRoomAdded) this.onRoomAdded(newRoom);
    });
    this.socket.on("room_removed", (roomId) => {
      this.rooms = this.rooms.filter((r) => r.id !== roomId);
      this.notifyRoomUpdate();
    });
    this.socket.on("user_kicked", (data) => {
      if (data.userId === this.userId) {
        if (this.onError) this.onError(`You were kicked from room`);
        window.dispatchEvent(new CustomEvent("chat-room-kicked", { detail: data }));
      }
    });
    this.socket.on("user_banned", (data) => {
      if (data.userId === this.userId) {
        if (this.onError) this.onError(`You were BANNED from room`);
        window.dispatchEvent(new CustomEvent("chat-room-kicked", { detail: data }));
      }
    });
    this.socket.on("message_edited", (data) => {
      const room = this.rooms.find((r) => r.id === data.roomId);
      if (room) {
        const msg = room.messages.find((m) => m.id === data.messageId);
        if (msg) {
          msg.content = data.content;
          msg.isEdited = true;
          msg.editTimestamp = data.editTimestamp;
          this.notifyRoomUpdate();
        }
      }
    });
    this.socket.on("message_deleted", (data) => {
      const room = this.rooms.find((r) => r.id === data.roomId);
      if (room) {
        room.messages = room.messages.filter((m) => m.id !== data.messageId);
        this.notifyRoomUpdate();
      }
    });
    this.socket.on("error", (msg) => {
      console.error("Socket Error:", msg);
      if (msg.includes("User not found") || msg.includes("no public key registered")) {
        console.warn("Server identity lost. Clearing local chat identity.");
        const storedName = localStorage.getItem("gravity_chat_username");
        localStorage.removeItem("gravity_chat_id");
        localStorage.removeItem("gravity_chat_priv");
        localStorage.removeItem("gravity_chat_pub");
        if (this.socket) {
          this.socket.disconnect();
          this.socket = null;
        }
        this.userId = null;
        this.username = null;
        this.rooms = [];
        if (storedName && !storedName.startsWith("!RESET!")) {
          console.log(`Auto-repairing identity for ${storedName}...`);
          setTimeout(() => {
            this.init();
            setTimeout(() => {
              this.register(storedName).catch(console.error);
            }, 500);
          }, 2e3);
          return;
        }
      }
      if (this.onError) this.onError(msg);
    });
    this.socket.on("search_results", (results) => {
      window.dispatchEvent(new CustomEvent("chat-search-results", { detail: results }));
    });
    this.socket.on("user_online", (userId) => this.handleUserStatusChange(userId, true));
    this.socket.on("user_offline", (userId) => this.handleUserStatusChange(userId, false));
  }
  // --- CRYPTO & AUTH ---
  // --- CRYPTO & AUTH ---
  async generateAndSaveIdentity() {
    const signKeys = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"]
    );
    const signPubInfo = await crypto.subtle.exportKey("spki", signKeys.publicKey);
    const signPrivInfo = await crypto.subtle.exportKey("pkcs8", signKeys.privateKey);
    const publicKeyHex = this.bufferToHex(new Uint8Array(signPubInfo));
    const privateKeyHex = this.bufferToHex(new Uint8Array(signPrivInfo));
    const encKeys = await generateEncryptionKeys();
    const encPubB64 = await exportKeyToBase64(encKeys.publicKey);
    const encPrivB64 = await exportKeyToBase64(encKeys.privateKey);
    localStorage.setItem("gravity_chat_priv", privateKeyHex);
    localStorage.setItem("gravity_chat_pub", publicKeyHex);
    localStorage.setItem("gravity_chat_enc_priv", encPrivB64);
    localStorage.setItem("gravity_chat_enc_pub", encPubB64);
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({
        type: "CHAT_SYNC_CREDS",
        data: {
          privateKey: privateKeyHex,
          publicKey: publicKeyHex,
          // We don't necessarily need to sync enc keys to BG unless BG does decryption, 
          // but good for consistency.
          encPrivateKey: encPrivB64,
          encPublicKey: encPubB64
        }
      });
    }
    return {
      publicKey: publicKeyHex,
      privateKey: privateKeyHex,
      encryptionPublicKey: encPubB64,
      encryptionPrivateKey: encPrivB64
    };
  }
  async ensureEncryptionKeys() {
    let encPub = localStorage.getItem("gravity_chat_enc_pub");
    let encPriv = localStorage.getItem("gravity_chat_enc_priv");
    if (!encPub || !encPriv) {
      console.log("Generating missing E2EE Encryption Keys...");
      const encKeys = await generateEncryptionKeys();
      encPub = await exportKeyToBase64(encKeys.publicKey);
      encPriv = await exportKeyToBase64(encKeys.privateKey);
      localStorage.setItem("gravity_chat_enc_priv", encPriv);
      localStorage.setItem("gravity_chat_enc_pub", encPub);
    }
    return encPub;
  }
  async authenticateWithSignature(userId, username) {
    if (!this.socket) return;
    const encPub = await this.ensureEncryptionKeys();
    this.socket.emit("request_challenge", { userId, username, encryptionPublicKey: encPub });
  }
  async signChallenge(challenge, privateKeyHex) {
    const privateKeyBuffer = this.hexToBuffer(privateKeyHex);
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
    return this.bufferToHex(new Uint8Array(signature));
  }
  hexToBuffer(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes.buffer;
  }
  bufferToHex(buffer) {
    return Array.from(buffer).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Helper to debounce room updates and prevent infinite loops
  notifyRoomUpdate() {
    if (this.roomUpdateDebounceTimer) {
      clearTimeout(this.roomUpdateDebounceTimer);
    }
    this.roomUpdateDebounceTimer = setTimeout(() => {
      if (this.onRoomUpdated) {
        this.onRoomUpdated([...this.rooms]);
      }
    }, 100);
  }
  // --- PUBLIC METHODS ---
  createRoom(name, isPrivate = false) {
    this.socket?.emit("create_room", { name, isPrivate });
  }
  getCurrentUser() {
    if (this.userId && this.username) return { id: this.userId, username: this.username };
    return null;
  }
  getRooms() {
    return [...this.rooms];
  }
  async register(username) {
    if (!this.socket) await this.init();
    const storedUser = this.getStoredUsername();
    const storedKey = this.getStoredPrivateKey();
    if (storedUser?.toLowerCase() === username.toLowerCase() && storedKey) {
      console.log("Local keys found, performing cryptographic login recovery...");
      await this.ensureEncryptionKeys();
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({
          type: "CHAT_SYNC_CREDS",
          data: { username: storedUser, privateKey: storedKey, publicKey: localStorage.getItem("gravity_chat_pub") }
        });
      }
      return this.authenticateWithSignature(null, username);
    }
    const keys = await this.generateAndSaveIdentity();
    if (!username.startsWith("!RESET!")) {
      localStorage.setItem("gravity_chat_username", username);
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({
          type: "CHAT_SYNC_CREDS",
          data: { username, privateKey: keys.privateKey, publicKey: keys.publicKey }
        });
      }
    }
    this.socket?.emit("register", {
      username,
      publicKey: keys.publicKey,
      encryptionPublicKey: keys.encryptionPublicKey
    });
  }
  async sendMessage(roomId, content, isEncrypted = false) {
    if (!this.socket) return;
    const privateKeyHex = localStorage.getItem("gravity_chat_priv");
    if (!privateKeyHex) {
      if (this.onError) this.onError("Security Error: No identity found. Please re-login.");
      return;
    }
    try {
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const messageToSign = content + timestamp;
      const publicKeyHex = localStorage.getItem("gravity_chat_pub");
      console.log("[SIGN] Public Key (first 20):", publicKeyHex?.substring(0, 20));
      console.log("[SIGN] Private Key (first 20):", privateKeyHex?.substring(0, 20));
      console.log("[SIGN] Message to sign:", messageToSign);
      const signature = await this.signChallenge(messageToSign, privateKeyHex);
      console.log("[SIGN] Signature (first 20):", signature?.substring(0, 20));
      this.socket.emit("send_message", {
        roomId,
        content,
        timestamp,
        signature,
        isEncrypted
      });
    } catch (err) {
      console.error("Failed to sign message:", err);
      if (this.onError) this.onError("Failed to securely sign message.");
    }
  }
  async sendDirectMessage(roomId, content, recipientPublicKeyBase64) {
    try {
      const myPrivBase64 = localStorage.getItem("gravity_chat_enc_priv");
      const myPubBase64 = localStorage.getItem("gravity_chat_enc_pub");
      if (!myPrivBase64 || !myPubBase64) throw new Error("Encryption keys missing");
      const myPrivKey = await importKeyFromBase64(myPrivBase64, "private");
      const myPubKey = await importKeyFromBase64(myPubBase64, "public");
      const recipientPubKey = await importKeyFromBase64(recipientPublicKeyBase64, "public");
      const recipientSharedKey = await deriveSharedSecret(myPrivKey, recipientPubKey);
      const encryptedForRecipient = await encryptMessage(content, recipientSharedKey);
      const mySharedKey = await deriveSharedSecret(myPrivKey, myPubKey);
      const encryptedForMe = await encryptMessage(content, mySharedKey);
      const privateKeyHex = localStorage.getItem("gravity_chat_priv");
      if (!privateKeyHex) throw new Error("Signing key missing");
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const messageToSign = encryptedForRecipient + timestamp;
      const signature = await this.signChallenge(messageToSign, privateKeyHex);
      this.socket?.emit("send_message", {
        roomId,
        content: encryptedForRecipient,
        contentForSender: encryptedForMe,
        // NEW: encrypted version for sender
        timestamp,
        signature,
        isEncrypted: true
      });
    } catch (e) {
      console.error("E2EE Failed:", e);
      if (this.onError) this.onError("Encryption failed: " + e.message);
    }
  }
  async editMessage(roomId, messageId, newContent) {
    if (!this.socket) return;
    const privateKeyHex = localStorage.getItem("gravity_chat_priv");
    if (!privateKeyHex) return;
    try {
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const messageToSign = newContent + timestamp;
      const signature = await this.signChallenge(messageToSign, privateKeyHex);
      this.socket.emit("edit_message", {
        roomId,
        messageId,
        content: newContent,
        timestamp,
        signature
      });
    } catch (err) {
      console.error("Failed to sign edit:", err);
    }
  }
  deleteMessage(roomId, messageId) {
    this.socket?.emit("delete_message", { roomId, messageId });
  }
  joinRoom(roomId) {
    this.socket?.emit("join_room", roomId);
  }
  createDM(targetId) {
    this.socket?.emit("create_dm", targetId);
  }
  searchUsers(query) {
    this.socket?.emit("search_users", query);
  }
  inviteUser(roomId, user) {
    this.socket?.emit("invite_user", { roomId, targetUsername: user });
  }
  closeRoom(roomId) {
    this.socket?.emit("close_room", roomId);
  }
  kickUser(roomId, userId) {
    this.socket?.emit("kick_user", { roomId, targetUserId: userId });
  }
  banUser(roomId, userId) {
    this.socket?.emit("ban_user", { roomId, targetUserId: userId });
  }
  muteUser(roomId, userId) {
    this.socket?.emit("mute_user", { roomId, targetUserId: userId });
  }
  unmuteUser(roomId, userId) {
    this.socket?.emit("unmute_user", { roomId, targetUserId: userId });
  }
  async findUserByUsername(username, timeoutMs = 8e3) {
    if (!this.socket?.connected) {
      await this.init();
    }
    const normalized = username.trim().replace(/^@/, "").toLowerCase();
    if (!normalized || !this.socket) return null;
    return new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        this.socket?.off("search_results", handleResults);
        reject(new Error(`Chat lookup timed out for @${normalized}`));
      }, timeoutMs);
      const handleResults = (results) => {
        const match = (results || []).find((entry) => entry.username?.toLowerCase() === normalized) || null;
        clearTimeout(timeoutId);
        this.socket?.off("search_results", handleResults);
        resolve(match);
      };
      this.socket?.on("search_results", handleResults);
      this.socket?.emit("search_users", normalized);
    });
  }
  async ensureDirectRoomByUsername(username, timeoutMs = 8e3) {
    if (!this.socket?.connected) {
      await this.init();
    }
    const normalized = username.trim().replace(/^@/, "").toLowerCase();
    if (!normalized || !this.socket) throw new Error("Invalid DM target");
    const existingRoom = this.rooms.find(
      (room) => room.type === "dm" && (room.memberDetails?.some((member) => member.username?.toLowerCase() === normalized) || room.name?.toLowerCase().includes(normalized))
    );
    const targetUser = await this.findUserByUsername(normalized, timeoutMs);
    if (!targetUser) throw new Error(`Chat user @${normalized} not found`);
    if (existingRoom) {
      if (!existingRoom.memberDetails?.length) {
        this.joinRoom(existingRoom.id);
      }
      return { room: existingRoom, user: targetUser };
    }
    this.createDM(targetUser.id);
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
      const room = this.rooms.find(
        (entry) => entry.type === "dm" && (entry.memberDetails?.some((member) => member.id === targetUser.id || member.username?.toLowerCase() === normalized) || entry.name?.toLowerCase().includes(normalized))
      );
      if (room) {
        if (!room.memberDetails?.length) {
          this.joinRoom(room.id);
        }
        return { room, user: targetUser };
      }
      await new Promise((resolve) => window.setTimeout(resolve, 250));
    }
    throw new Error(`DM room with @${normalized} not available yet`);
  }
  async sendDirectMessageToUsername(username, content) {
    const { room, user } = await this.ensureDirectRoomByUsername(username);
    if (!user.encryptionPublicKey) {
      throw new Error(`Chat user @${user.username} has no encryption key`);
    }
    await this.sendDirectMessage(room.id, content, user.encryptionPublicKey);
    return { roomId: room.id, userId: user.id };
  }
  logout() {
    localStorage.removeItem("gravity_chat_id");
    localStorage.removeItem("gravity_chat_username");
    localStorage.removeItem("gravity_chat_priv");
    localStorage.removeItem("gravity_chat_pub");
    this.userId = null;
    this.username = null;
    this.rooms = [];
    this.socket?.disconnect();
    this.socket = null;
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: "CHAT_LOGOUT" });
    }
  }
  async handleNewMessage(roomId, message) {
    console.log("[ChatService] New message received:", {
      roomId,
      messageId: message.id,
      isEncrypted: message.isEncrypted,
      content: message.content?.substring(0, 50) + "..."
    });
    const processedMsg = await this.processIncomingMessage(roomId, message);
    const room = this.rooms.find((r) => r.id === roomId);
    if (room) {
      if (room.messages.find((m) => m.id === processedMsg.id)) return;
      room.messages.push(processedMsg);
      this.messageListeners.forEach((listener) => listener(roomId, processedMsg));
      this.notifyRoomUpdate();
      if (processedMsg.senderId !== this.userId) {
        window.dispatchEvent(new CustomEvent("chat-unread", { detail: { roomId } }));
        const badge = document.getElementById("chat-badge");
        if (badge) badge.classList.remove("hidden");
      }
    }
  }
  async processIncomingMessage(roomId, message) {
    const looksEncrypted = message.content && message.content.length > 20 && /^[A-Za-z0-9+/]+=*$/.test(message.content) && !message.content.includes(" ");
    const room = this.rooms.find((r) => r.id === roomId);
    const isEncrypted = message.isEncrypted || looksEncrypted && room?.type === "dm";
    if (!isEncrypted) return message;
    try {
      if (message.senderId === this.userId) {
        const myPrivBase642 = localStorage.getItem("gravity_chat_enc_priv");
        const myPubBase64 = localStorage.getItem("gravity_chat_enc_pub");
        if (!myPrivBase642 || !myPubBase64) {
          return { ...message, content: "(Encrypted Message - keys missing)" };
        }
        const encryptedContent = message.contentForSender || message.content;
        try {
          const myPrivKey2 = await importKeyFromBase64(myPrivBase642, "private");
          const myPubKey = await importKeyFromBase64(myPubBase64, "public");
          const mySharedKey = await deriveSharedSecret(myPrivKey2, myPubKey);
          const decrypted2 = await decryptMessage(encryptedContent, mySharedKey);
          console.log("[ChatService] Successfully decrypted own message");
          return { ...message, content: decrypted2 };
        } catch (e) {
          console.error("[ChatService] Failed to decrypt own message:", e);
          return { ...message, content: "(Encrypted Message sent by you)" };
        }
      }
      const room2 = this.rooms.find((r) => r.id === roomId);
      const sender = room2?.memberDetails?.find((u) => u.id === message.senderId);
      console.log("[ChatService] Decrypting message:", {
        roomId,
        roomType: room2?.type,
        senderId: message.senderId,
        myId: this.userId,
        hasSender: !!sender,
        hasEncryptionKey: !!sender?.encryptionPublicKey,
        memberDetails: room2?.memberDetails?.map((m) => ({ id: m.id, username: m.username, hasKey: !!m.encryptionPublicKey }))
      });
      if (!sender?.encryptionPublicKey) {
        console.warn("[ChatService] Missing encryption key for sender:", message.senderId);
        return { ...message, content: `Encrypted Message (Key not found for ${message.senderName})` };
      }
      const myPrivBase64 = localStorage.getItem("gravity_chat_enc_priv");
      if (!myPrivBase64) {
        console.error("[ChatService] Missing my private encryption key");
        return { ...message, content: "Encrypted Message (You lack keys)" };
      }
      const myPrivKey = await importKeyFromBase64(myPrivBase64, "private");
      const senderPubKey = await importKeyFromBase64(sender.encryptionPublicKey, "public");
      const sharedKey = await deriveSharedSecret(myPrivKey, senderPubKey);
      const decrypted = await decryptMessage(message.content, sharedKey);
      console.log("[ChatService] Successfully decrypted message");
      return { ...message, content: decrypted };
    } catch (e) {
      console.error("[ChatService] Decryption error:", e);
      return { ...message, content: "Decryption Failed" };
    }
  }
  getStoredPrivateKey() {
    return localStorage.getItem("gravity_chat_priv");
  }
  getStoredUsername() {
    return localStorage.getItem("gravity_chat_username");
  }
  handleUserStatusChange(userId, isOnline) {
    let updated = false;
    this.rooms.forEach((room) => {
      const member = room.memberDetails?.find((m) => m.id === userId);
      if (member) {
        member.isOnline = isOnline;
        updated = true;
      }
    });
    if (updated && this.onRoomUpdated) this.onRoomUpdated([...this.rooms]);
  }
}
const chatService = new ChatService();

const authenticateWithGoogle = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: "google_user_123", email: "user@example.com" });
    }, 1e3);
  });
};
const authenticateWithDevice = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: "device_user_123" });
    }, 1e3);
  });
};
const isBiometricsAvailable = async () => {
  if (!window.PublicKeyCredential) return false;
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (e) {
    console.warn("Biometric check failed or not supported in this context", e);
    return false;
  }
};
const registerBiometrics = async () => {
  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
    const host = window.location.hostname || "";
    const isValidDomain = host.includes(".") && host.length < 40;
    const publicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Gravity Wallet",
        id: isValidDomain ? host : void 0
      },
      user: {
        id: window.crypto.getRandomValues(new Uint8Array(16)),
        name: "gravity_user_" + Math.floor(Math.random() * 1e4),
        displayName: "Gravity Wallet Owner"
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },
        // ES256
        { alg: -257, type: "public-key" },
        // RS256
        { alg: -8, type: "public-key" }
        // Ed25519
      ],
      authenticatorSelection: {
        userVerification: "required",
        residentKey: "preferred"
      },
      timeout: 12e4,
      attestation: "none"
    };
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    });
    return !!credential;
  } catch (error) {
    console.error("Biometric registration failed:", error);
    return false;
  }
};

var otplib = {};

var presetDefault = {};

var pluginCrypto = {};

var hasRequiredPluginCrypto;

function requirePluginCrypto () {
	if (hasRequiredPluginCrypto) return pluginCrypto;
	hasRequiredPluginCrypto = 1;

	Object.defineProperty(pluginCrypto, '__esModule', { value: true });

	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

	var crypto = _interopDefault(requireCryptoBrowserify());

	const createDigest = (algorithm, hmacKey, counter) => {
	  const hmac = crypto.createHmac(algorithm, Buffer.from(hmacKey, 'hex'));
	  const digest = hmac.update(Buffer.from(counter, 'hex')).digest();
	  return digest.toString('hex');
	};
	const createRandomBytes = (size, encoding) => {
	  return crypto.randomBytes(size).toString(encoding);
	};

	pluginCrypto.createDigest = createDigest;
	pluginCrypto.createRandomBytes = createRandomBytes;
	return pluginCrypto;
}

var pluginThirtyTwo = {};

var thirtyTwo$1 = {};

var thirtyTwo = {};

var hasRequiredThirtyTwo$1;

function requireThirtyTwo$1 () {
	if (hasRequiredThirtyTwo$1) return thirtyTwo;
	hasRequiredThirtyTwo$1 = 1;

	var charTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	var byteTable = [
	    0xff, 0xff, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f,
	    0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
	    0xff, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
	    0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
	    0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16,
	    0x17, 0x18, 0x19, 0xff, 0xff, 0xff, 0xff, 0xff,
	    0xff, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
	    0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
	    0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16,
	    0x17, 0x18, 0x19, 0xff, 0xff, 0xff, 0xff, 0xff
	];

	function quintetCount(buff) {
	    var quintets = Math.floor(buff.length / 5);
	    return buff.length % 5 === 0 ? quintets: quintets + 1;
	}

	thirtyTwo.encode = function(plain) {
	    if(!Buffer.isBuffer(plain)){
	    	plain = new Buffer(plain);
	    }
	    var i = 0;
	    var j = 0;
	    var shiftIndex = 0;
	    var digit = 0;
	    var encoded = new Buffer(quintetCount(plain) * 8);

	    /* byte by byte isn't as pretty as quintet by quintet but tests a bit
	        faster. will have to revisit. */
	    while(i < plain.length) {
	        var current = plain[i];

	        if(shiftIndex > 3) {
	            digit = current & (0xff >> shiftIndex);
	            shiftIndex = (shiftIndex + 5) % 8;
	            digit = (digit << shiftIndex) | ((i + 1 < plain.length) ?
	                plain[i + 1] : 0) >> (8 - shiftIndex);
	            i++;
	        } else {
	            digit = (current >> (8 - (shiftIndex + 5))) & 0x1f;
	            shiftIndex = (shiftIndex + 5) % 8;
	            if(shiftIndex === 0) i++;
	        }

	        encoded[j] = charTable.charCodeAt(digit);
	        j++;
	    }

	    for(i = j; i < encoded.length; i++) {
	        encoded[i] = 0x3d; //'='.charCodeAt(0)
	    }

	    return encoded;
	};

	thirtyTwo.decode = function(encoded) {
	    var shiftIndex = 0;
	    var plainDigit = 0;
	    var plainChar;
	    var plainPos = 0;
	    if(!Buffer.isBuffer(encoded)){
	    	encoded = new Buffer(encoded);
	    }
	    var decoded = new Buffer(Math.ceil(encoded.length * 5 / 8));

	    /* byte by byte isn't as pretty as octet by octet but tests a bit
	        faster. will have to revisit. */
	    for(var i = 0; i < encoded.length; i++) {
	    	if(encoded[i] === 0x3d){ //'='
	    		break;
	    	}

	        var encodedByte = encoded[i] - 0x30;

	        if(encodedByte < byteTable.length) {
	            plainDigit = byteTable[encodedByte];

	            if(shiftIndex <= 3) {
	                shiftIndex = (shiftIndex + 5) % 8;

	                if(shiftIndex === 0) {
	                    plainChar |= plainDigit;
	                    decoded[plainPos] = plainChar;
	                    plainPos++;
	                    plainChar = 0;
	                } else {
	                    plainChar |= 0xff & (plainDigit << (8 - shiftIndex));
	                }
	            } else {
	                shiftIndex = (shiftIndex + 5) % 8;
	                plainChar |= 0xff & (plainDigit >>> shiftIndex);
	                decoded[plainPos] = plainChar;
	                plainPos++;

	                plainChar = 0xff & (plainDigit << (8 - shiftIndex));
	            }
	        } else {
	        	throw new Error('Invalid input - it is not base32 encoded string');
	        }
	    }

	    return decoded.slice(0, plainPos);
	};
	return thirtyTwo;
}

/*                                                                              
Copyright (c) 2011, Chris Umbel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in      
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
*/

var hasRequiredThirtyTwo;

function requireThirtyTwo () {
	if (hasRequiredThirtyTwo) return thirtyTwo$1;
	hasRequiredThirtyTwo = 1;
	var base32 = requireThirtyTwo$1();

	thirtyTwo$1.encode = base32.encode;
	thirtyTwo$1.decode = base32.decode;
	return thirtyTwo$1;
}

var hasRequiredPluginThirtyTwo;

function requirePluginThirtyTwo () {
	if (hasRequiredPluginThirtyTwo) return pluginThirtyTwo;
	hasRequiredPluginThirtyTwo = 1;

	Object.defineProperty(pluginThirtyTwo, '__esModule', { value: true });

	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

	var thirtyTwo = _interopDefault(requireThirtyTwo());

	const keyDecoder = (encodedSecret, encoding) => {
	  return thirtyTwo.decode(encodedSecret).toString(encoding);
	};
	const keyEncoder = (secret, encoding) => {
	  return thirtyTwo.encode(Buffer.from(secret, encoding).toString('ascii')).toString().replace(/=/g, '');
	};

	pluginThirtyTwo.keyDecoder = keyDecoder;
	pluginThirtyTwo.keyEncoder = keyEncoder;
	return pluginThirtyTwo;
}

var core = {};

var hasRequiredCore;

function requireCore () {
	if (hasRequiredCore) return core;
	hasRequiredCore = 1;
	(function (exports$1) {

		Object.defineProperty(exports$1, '__esModule', { value: true });

		function objectValues(value) {
		  return Object.keys(value).map(key => value[key]);
		}
		(function (HashAlgorithms) {
		  HashAlgorithms["SHA1"] = "sha1";
		  HashAlgorithms["SHA256"] = "sha256";
		  HashAlgorithms["SHA512"] = "sha512";
		})(exports$1.HashAlgorithms || (exports$1.HashAlgorithms = {}));
		const HASH_ALGORITHMS = objectValues(exports$1.HashAlgorithms);
		(function (KeyEncodings) {
		  KeyEncodings["ASCII"] = "ascii";
		  KeyEncodings["BASE64"] = "base64";
		  KeyEncodings["HEX"] = "hex";
		  KeyEncodings["LATIN1"] = "latin1";
		  KeyEncodings["UTF8"] = "utf8";
		})(exports$1.KeyEncodings || (exports$1.KeyEncodings = {}));
		const KEY_ENCODINGS = objectValues(exports$1.KeyEncodings);
		(function (Strategy) {
		  Strategy["HOTP"] = "hotp";
		  Strategy["TOTP"] = "totp";
		})(exports$1.Strategy || (exports$1.Strategy = {}));
		const STRATEGY = objectValues(exports$1.Strategy);
		const createDigestPlaceholder = () => {
		  throw new Error('Please provide an options.createDigest implementation.');
		};
		function isTokenValid(value) {
		  return /^(\d+)$/.test(value);
		}
		function padStart(value, maxLength, fillString) {
		  if (value.length >= maxLength) {
		    return value;
		  }
		  const padding = Array(maxLength + 1).join(fillString);
		  return `${padding}${value}`.slice(-1 * maxLength);
		}
		function keyuri(options) {
		  const tmpl = `otpauth://${options.type}/{labelPrefix}:{accountName}?secret={secret}{query}`;
		  const params = [];
		  if (STRATEGY.indexOf(options.type) < 0) {
		    throw new Error(`Expecting options.type to be one of ${STRATEGY.join(', ')}. Received ${options.type}.`);
		  }
		  if (options.type === 'hotp') {
		    if (options.counter == null || typeof options.counter !== 'number') {
		      throw new Error('Expecting options.counter to be a number when options.type is "hotp".');
		    }
		    params.push(`&counter=${options.counter}`);
		  }
		  if (options.type === 'totp' && options.step) {
		    params.push(`&period=${options.step}`);
		  }
		  if (options.digits) {
		    params.push(`&digits=${options.digits}`);
		  }
		  if (options.algorithm) {
		    params.push(`&algorithm=${options.algorithm.toUpperCase()}`);
		  }
		  if (options.issuer) {
		    params.push(`&issuer=${encodeURIComponent(options.issuer)}`);
		  }
		  return tmpl.replace('{labelPrefix}', encodeURIComponent(options.issuer || options.accountName)).replace('{accountName}', encodeURIComponent(options.accountName)).replace('{secret}', options.secret).replace('{query}', params.join(''));
		}
		class OTP {
		  constructor(defaultOptions = {}) {
		    this._defaultOptions = Object.freeze({ ...defaultOptions
		    });
		    this._options = Object.freeze({});
		  }
		  create(defaultOptions = {}) {
		    return new OTP(defaultOptions);
		  }
		  clone(defaultOptions = {}) {
		    const instance = this.create({ ...this._defaultOptions,
		      ...defaultOptions
		    });
		    instance.options = this._options;
		    return instance;
		  }
		  get options() {
		    return Object.freeze({ ...this._defaultOptions,
		      ...this._options
		    });
		  }
		  set options(options) {
		    this._options = Object.freeze({ ...this._options,
		      ...options
		    });
		  }
		  allOptions() {
		    return this.options;
		  }
		  resetOptions() {
		    this._options = Object.freeze({});
		  }
		}

		function hotpOptionsValidator(options) {
		  if (typeof options.createDigest !== 'function') {
		    throw new Error('Expecting options.createDigest to be a function.');
		  }
		  if (typeof options.createHmacKey !== 'function') {
		    throw new Error('Expecting options.createHmacKey to be a function.');
		  }
		  if (typeof options.digits !== 'number') {
		    throw new Error('Expecting options.digits to be a number.');
		  }
		  if (!options.algorithm || HASH_ALGORITHMS.indexOf(options.algorithm) < 0) {
		    throw new Error(`Expecting options.algorithm to be one of ${HASH_ALGORITHMS.join(', ')}. Received ${options.algorithm}.`);
		  }
		  if (!options.encoding || KEY_ENCODINGS.indexOf(options.encoding) < 0) {
		    throw new Error(`Expecting options.encoding to be one of ${KEY_ENCODINGS.join(', ')}. Received ${options.encoding}.`);
		  }
		}
		const hotpCreateHmacKey = (algorithm, secret, encoding) => {
		  return Buffer.from(secret, encoding).toString('hex');
		};
		function hotpDefaultOptions() {
		  const options = {
		    algorithm: exports$1.HashAlgorithms.SHA1,
		    createHmacKey: hotpCreateHmacKey,
		    createDigest: createDigestPlaceholder,
		    digits: 6,
		    encoding: exports$1.KeyEncodings.ASCII
		  };
		  return options;
		}
		function hotpOptions(opt) {
		  const options = { ...hotpDefaultOptions(),
		    ...opt
		  };
		  hotpOptionsValidator(options);
		  return Object.freeze(options);
		}
		function hotpCounter(counter) {
		  const hexCounter = counter.toString(16);
		  return padStart(hexCounter, 16, '0');
		}
		function hotpDigestToToken(hexDigest, digits) {
		  const digest = Buffer.from(hexDigest, 'hex');
		  const offset = digest[digest.length - 1] & 0xf;
		  const binary = (digest[offset] & 0x7f) << 24 | (digest[offset + 1] & 0xff) << 16 | (digest[offset + 2] & 0xff) << 8 | digest[offset + 3] & 0xff;
		  const token = binary % Math.pow(10, digits);
		  return padStart(String(token), digits, '0');
		}
		function hotpDigest(secret, counter, options) {
		  const hexCounter = hotpCounter(counter);
		  const hmacKey = options.createHmacKey(options.algorithm, secret, options.encoding);
		  return options.createDigest(options.algorithm, hmacKey, hexCounter);
		}
		function hotpToken(secret, counter, options) {
		  const hexDigest = options.digest || hotpDigest(secret, counter, options);
		  return hotpDigestToToken(hexDigest, options.digits);
		}
		function hotpCheck(token, secret, counter, options) {
		  if (!isTokenValid(token)) {
		    return false;
		  }
		  const systemToken = hotpToken(secret, counter, options);
		  return token === systemToken;
		}
		function hotpKeyuri(accountName, issuer, secret, counter, options) {
		  return keyuri({
		    algorithm: options.algorithm,
		    digits: options.digits,
		    type: exports$1.Strategy.HOTP,
		    accountName,
		    counter,
		    issuer,
		    secret
		  });
		}
		class HOTP extends OTP {
		  create(defaultOptions = {}) {
		    return new HOTP(defaultOptions);
		  }
		  allOptions() {
		    return hotpOptions(this.options);
		  }
		  generate(secret, counter) {
		    return hotpToken(secret, counter, this.allOptions());
		  }
		  check(token, secret, counter) {
		    return hotpCheck(token, secret, counter, this.allOptions());
		  }
		  verify(opts) {
		    if (typeof opts !== 'object') {
		      throw new Error('Expecting argument 0 of verify to be an object');
		    }
		    return this.check(opts.token, opts.secret, opts.counter);
		  }
		  keyuri(accountName, issuer, secret, counter) {
		    return hotpKeyuri(accountName, issuer, secret, counter, this.allOptions());
		  }
		}

		function parseWindowBounds(win) {
		  if (typeof win === 'number') {
		    return [Math.abs(win), Math.abs(win)];
		  }
		  if (Array.isArray(win)) {
		    const [past, future] = win;
		    if (typeof past === 'number' && typeof future === 'number') {
		      return [Math.abs(past), Math.abs(future)];
		    }
		  }
		  throw new Error('Expecting options.window to be an number or [number, number].');
		}
		function totpOptionsValidator(options) {
		  hotpOptionsValidator(options);
		  parseWindowBounds(options.window);
		  if (typeof options.epoch !== 'number') {
		    throw new Error('Expecting options.epoch to be a number.');
		  }
		  if (typeof options.step !== 'number') {
		    throw new Error('Expecting options.step to be a number.');
		  }
		}
		const totpPadSecret = (secret, encoding, minLength) => {
		  const currentLength = secret.length;
		  const hexSecret = Buffer.from(secret, encoding).toString('hex');
		  if (currentLength < minLength) {
		    const newSecret = new Array(minLength - currentLength + 1).join(hexSecret);
		    return Buffer.from(newSecret, 'hex').slice(0, minLength).toString('hex');
		  }
		  return hexSecret;
		};
		const totpCreateHmacKey = (algorithm, secret, encoding) => {
		  switch (algorithm) {
		    case exports$1.HashAlgorithms.SHA1:
		      return totpPadSecret(secret, encoding, 20);
		    case exports$1.HashAlgorithms.SHA256:
		      return totpPadSecret(secret, encoding, 32);
		    case exports$1.HashAlgorithms.SHA512:
		      return totpPadSecret(secret, encoding, 64);
		    default:
		      throw new Error(`Expecting algorithm to be one of ${HASH_ALGORITHMS.join(', ')}. Received ${algorithm}.`);
		  }
		};
		function totpDefaultOptions() {
		  const options = {
		    algorithm: exports$1.HashAlgorithms.SHA1,
		    createDigest: createDigestPlaceholder,
		    createHmacKey: totpCreateHmacKey,
		    digits: 6,
		    encoding: exports$1.KeyEncodings.ASCII,
		    epoch: Date.now(),
		    step: 30,
		    window: 0
		  };
		  return options;
		}
		function totpOptions(opt) {
		  const options = { ...totpDefaultOptions(),
		    ...opt
		  };
		  totpOptionsValidator(options);
		  return Object.freeze(options);
		}
		function totpCounter(epoch, step) {
		  return Math.floor(epoch / step / 1000);
		}
		function totpToken(secret, options) {
		  const counter = totpCounter(options.epoch, options.step);
		  return hotpToken(secret, counter, options);
		}
		function totpEpochsInWindow(epoch, direction, deltaPerEpoch, numOfEpoches) {
		  const result = [];
		  if (numOfEpoches === 0) {
		    return result;
		  }
		  for (let i = 1; i <= numOfEpoches; i++) {
		    const delta = direction * i * deltaPerEpoch;
		    result.push(epoch + delta);
		  }
		  return result;
		}
		function totpEpochAvailable(epoch, step, win) {
		  const bounds = parseWindowBounds(win);
		  const delta = step * 1000;
		  return {
		    current: epoch,
		    past: totpEpochsInWindow(epoch, -1, delta, bounds[0]),
		    future: totpEpochsInWindow(epoch, 1, delta, bounds[1])
		  };
		}
		function totpCheck(token, secret, options) {
		  if (!isTokenValid(token)) {
		    return false;
		  }
		  const systemToken = totpToken(secret, options);
		  return token === systemToken;
		}
		function totpCheckByEpoch(epochs, token, secret, options) {
		  let position = null;
		  epochs.some((epoch, idx) => {
		    if (totpCheck(token, secret, { ...options,
		      epoch
		    })) {
		      position = idx + 1;
		      return true;
		    }
		    return false;
		  });
		  return position;
		}
		function totpCheckWithWindow(token, secret, options) {
		  if (totpCheck(token, secret, options)) {
		    return 0;
		  }
		  const epochs = totpEpochAvailable(options.epoch, options.step, options.window);
		  const backward = totpCheckByEpoch(epochs.past, token, secret, options);
		  if (backward !== null) {
		    return backward * -1;
		  }
		  return totpCheckByEpoch(epochs.future, token, secret, options);
		}
		function totpTimeUsed(epoch, step) {
		  return Math.floor(epoch / 1000) % step;
		}
		function totpTimeRemaining(epoch, step) {
		  return step - totpTimeUsed(epoch, step);
		}
		function totpKeyuri(accountName, issuer, secret, options) {
		  return keyuri({
		    algorithm: options.algorithm,
		    digits: options.digits,
		    step: options.step,
		    type: exports$1.Strategy.TOTP,
		    accountName,
		    issuer,
		    secret
		  });
		}
		class TOTP extends HOTP {
		  create(defaultOptions = {}) {
		    return new TOTP(defaultOptions);
		  }
		  allOptions() {
		    return totpOptions(this.options);
		  }
		  generate(secret) {
		    return totpToken(secret, this.allOptions());
		  }
		  checkDelta(token, secret) {
		    return totpCheckWithWindow(token, secret, this.allOptions());
		  }
		  check(token, secret) {
		    const delta = this.checkDelta(token, secret);
		    return typeof delta === 'number';
		  }
		  verify(opts) {
		    if (typeof opts !== 'object') {
		      throw new Error('Expecting argument 0 of verify to be an object');
		    }
		    return this.check(opts.token, opts.secret);
		  }
		  timeRemaining() {
		    const options = this.allOptions();
		    return totpTimeRemaining(options.epoch, options.step);
		  }
		  timeUsed() {
		    const options = this.allOptions();
		    return totpTimeUsed(options.epoch, options.step);
		  }
		  keyuri(accountName, issuer, secret) {
		    return totpKeyuri(accountName, issuer, secret, this.allOptions());
		  }
		}

		function authenticatorOptionValidator(options) {
		  totpOptionsValidator(options);
		  if (typeof options.keyDecoder !== 'function') {
		    throw new Error('Expecting options.keyDecoder to be a function.');
		  }
		  if (options.keyEncoder && typeof options.keyEncoder !== 'function') {
		    throw new Error('Expecting options.keyEncoder to be a function.');
		  }
		}
		function authenticatorDefaultOptions() {
		  const options = {
		    algorithm: exports$1.HashAlgorithms.SHA1,
		    createDigest: createDigestPlaceholder,
		    createHmacKey: totpCreateHmacKey,
		    digits: 6,
		    encoding: exports$1.KeyEncodings.HEX,
		    epoch: Date.now(),
		    step: 30,
		    window: 0
		  };
		  return options;
		}
		function authenticatorOptions(opt) {
		  const options = { ...authenticatorDefaultOptions(),
		    ...opt
		  };
		  authenticatorOptionValidator(options);
		  return Object.freeze(options);
		}
		function authenticatorEncoder(secret, options) {
		  return options.keyEncoder(secret, options.encoding);
		}
		function authenticatorDecoder(secret, options) {
		  return options.keyDecoder(secret, options.encoding);
		}
		function authenticatorGenerateSecret(numberOfBytes, options) {
		  const key = options.createRandomBytes(numberOfBytes, options.encoding);
		  return authenticatorEncoder(key, options);
		}
		function authenticatorToken(secret, options) {
		  return totpToken(authenticatorDecoder(secret, options), options);
		}
		function authenticatorCheckWithWindow(token, secret, options) {
		  return totpCheckWithWindow(token, authenticatorDecoder(secret, options), options);
		}
		class Authenticator extends TOTP {
		  create(defaultOptions = {}) {
		    return new Authenticator(defaultOptions);
		  }
		  allOptions() {
		    return authenticatorOptions(this.options);
		  }
		  generate(secret) {
		    return authenticatorToken(secret, this.allOptions());
		  }
		  checkDelta(token, secret) {
		    return authenticatorCheckWithWindow(token, secret, this.allOptions());
		  }
		  encode(secret) {
		    return authenticatorEncoder(secret, this.allOptions());
		  }
		  decode(secret) {
		    return authenticatorDecoder(secret, this.allOptions());
		  }
		  generateSecret(numberOfBytes = 10) {
		    return authenticatorGenerateSecret(numberOfBytes, this.allOptions());
		  }
		}

		exports$1.Authenticator = Authenticator;
		exports$1.HASH_ALGORITHMS = HASH_ALGORITHMS;
		exports$1.HOTP = HOTP;
		exports$1.KEY_ENCODINGS = KEY_ENCODINGS;
		exports$1.OTP = OTP;
		exports$1.STRATEGY = STRATEGY;
		exports$1.TOTP = TOTP;
		exports$1.authenticatorCheckWithWindow = authenticatorCheckWithWindow;
		exports$1.authenticatorDecoder = authenticatorDecoder;
		exports$1.authenticatorDefaultOptions = authenticatorDefaultOptions;
		exports$1.authenticatorEncoder = authenticatorEncoder;
		exports$1.authenticatorGenerateSecret = authenticatorGenerateSecret;
		exports$1.authenticatorOptionValidator = authenticatorOptionValidator;
		exports$1.authenticatorOptions = authenticatorOptions;
		exports$1.authenticatorToken = authenticatorToken;
		exports$1.createDigestPlaceholder = createDigestPlaceholder;
		exports$1.hotpCheck = hotpCheck;
		exports$1.hotpCounter = hotpCounter;
		exports$1.hotpCreateHmacKey = hotpCreateHmacKey;
		exports$1.hotpDefaultOptions = hotpDefaultOptions;
		exports$1.hotpDigestToToken = hotpDigestToToken;
		exports$1.hotpKeyuri = hotpKeyuri;
		exports$1.hotpOptions = hotpOptions;
		exports$1.hotpOptionsValidator = hotpOptionsValidator;
		exports$1.hotpToken = hotpToken;
		exports$1.isTokenValid = isTokenValid;
		exports$1.keyuri = keyuri;
		exports$1.objectValues = objectValues;
		exports$1.padStart = padStart;
		exports$1.totpCheck = totpCheck;
		exports$1.totpCheckByEpoch = totpCheckByEpoch;
		exports$1.totpCheckWithWindow = totpCheckWithWindow;
		exports$1.totpCounter = totpCounter;
		exports$1.totpCreateHmacKey = totpCreateHmacKey;
		exports$1.totpDefaultOptions = totpDefaultOptions;
		exports$1.totpEpochAvailable = totpEpochAvailable;
		exports$1.totpKeyuri = totpKeyuri;
		exports$1.totpOptions = totpOptions;
		exports$1.totpOptionsValidator = totpOptionsValidator;
		exports$1.totpPadSecret = totpPadSecret;
		exports$1.totpTimeRemaining = totpTimeRemaining;
		exports$1.totpTimeUsed = totpTimeUsed;
		exports$1.totpToken = totpToken; 
	} (core));
	return core;
}

/**
 * @otplib/preset-default
 *
 * @author Gerald Yeo <contact@fusedthought.com>
 * @version: 12.0.1
 * @license: MIT
 **/

var hasRequiredPresetDefault;

function requirePresetDefault () {
	if (hasRequiredPresetDefault) return presetDefault;
	hasRequiredPresetDefault = 1;

	Object.defineProperty(presetDefault, '__esModule', { value: true });

	var pluginCrypto = requirePluginCrypto();
	var pluginThirtyTwo = requirePluginThirtyTwo();
	var core = requireCore();

	const hotp = new core.HOTP({
	  createDigest: pluginCrypto.createDigest
	});
	const totp = new core.TOTP({
	  createDigest: pluginCrypto.createDigest
	});
	const authenticator = new core.Authenticator({
	  createDigest: pluginCrypto.createDigest,
	  createRandomBytes: pluginCrypto.createRandomBytes,
	  keyDecoder: pluginThirtyTwo.keyDecoder,
	  keyEncoder: pluginThirtyTwo.keyEncoder
	});

	presetDefault.authenticator = authenticator;
	presetDefault.hotp = hotp;
	presetDefault.totp = totp;
	return presetDefault;
}

/**
 * otplib
 *
 * @author Gerald Yeo <contact@fusedthought.com>
 * @version: 12.0.1
 * @license: MIT
 **/

var hasRequiredOtplib;

function requireOtplib () {
	if (hasRequiredOtplib) return otplib;
	hasRequiredOtplib = 1;
	(function (exports$1) {

		Object.defineProperty(exports$1, '__esModule', { value: true });

		var presetDefault = requirePresetDefault();



		Object.keys(presetDefault).forEach(function (k) {
			if (k !== 'default') Object.defineProperty(exports$1, k, {
				enumerable: true,
				get: function () {
					return presetDefault[k];
				}
			});
		}); 
	} (otplib));
	return otplib;
}

var otplibExports = requireOtplib();

var browser = {};

var canPromise;
var hasRequiredCanPromise;

function requireCanPromise () {
	if (hasRequiredCanPromise) return canPromise;
	hasRequiredCanPromise = 1;
	// can-promise has a crash in some versions of react native that dont have
	// standard global objects
	// https://github.com/soldair/node-qrcode/issues/157

	canPromise = function () {
	  return typeof Promise === 'function' && Promise.prototype && Promise.prototype.then
	};
	return canPromise;
}

var qrcode = {};

var utils$1 = {};

var hasRequiredUtils$1;

function requireUtils$1 () {
	if (hasRequiredUtils$1) return utils$1;
	hasRequiredUtils$1 = 1;
	let toSJISFunction;
	const CODEWORDS_COUNT = [
	  0, // Not used
	  26, 44, 70, 100, 134, 172, 196, 242, 292, 346,
	  404, 466, 532, 581, 655, 733, 815, 901, 991, 1085,
	  1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185,
	  2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706
	];

	/**
	 * Returns the QR Code size for the specified version
	 *
	 * @param  {Number} version QR Code version
	 * @return {Number}         size of QR code
	 */
	utils$1.getSymbolSize = function getSymbolSize (version) {
	  if (!version) throw new Error('"version" cannot be null or undefined')
	  if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40')
	  return version * 4 + 17
	};

	/**
	 * Returns the total number of codewords used to store data and EC information.
	 *
	 * @param  {Number} version QR Code version
	 * @return {Number}         Data length in bits
	 */
	utils$1.getSymbolTotalCodewords = function getSymbolTotalCodewords (version) {
	  return CODEWORDS_COUNT[version]
	};

	/**
	 * Encode data with Bose-Chaudhuri-Hocquenghem
	 *
	 * @param  {Number} data Value to encode
	 * @return {Number}      Encoded value
	 */
	utils$1.getBCHDigit = function (data) {
	  let digit = 0;

	  while (data !== 0) {
	    digit++;
	    data >>>= 1;
	  }

	  return digit
	};

	utils$1.setToSJISFunction = function setToSJISFunction (f) {
	  if (typeof f !== 'function') {
	    throw new Error('"toSJISFunc" is not a valid function.')
	  }

	  toSJISFunction = f;
	};

	utils$1.isKanjiModeEnabled = function () {
	  return typeof toSJISFunction !== 'undefined'
	};

	utils$1.toSJIS = function toSJIS (kanji) {
	  return toSJISFunction(kanji)
	};
	return utils$1;
}

var errorCorrectionLevel = {};

var hasRequiredErrorCorrectionLevel;

function requireErrorCorrectionLevel () {
	if (hasRequiredErrorCorrectionLevel) return errorCorrectionLevel;
	hasRequiredErrorCorrectionLevel = 1;
	(function (exports$1) {
		exports$1.L = { bit: 1 };
		exports$1.M = { bit: 0 };
		exports$1.Q = { bit: 3 };
		exports$1.H = { bit: 2 };

		function fromString (string) {
		  if (typeof string !== 'string') {
		    throw new Error('Param is not a string')
		  }

		  const lcStr = string.toLowerCase();

		  switch (lcStr) {
		    case 'l':
		    case 'low':
		      return exports$1.L

		    case 'm':
		    case 'medium':
		      return exports$1.M

		    case 'q':
		    case 'quartile':
		      return exports$1.Q

		    case 'h':
		    case 'high':
		      return exports$1.H

		    default:
		      throw new Error('Unknown EC Level: ' + string)
		  }
		}

		exports$1.isValid = function isValid (level) {
		  return level && typeof level.bit !== 'undefined' &&
		    level.bit >= 0 && level.bit < 4
		};

		exports$1.from = function from (value, defaultValue) {
		  if (exports$1.isValid(value)) {
		    return value
		  }

		  try {
		    return fromString(value)
		  } catch (e) {
		    return defaultValue
		  }
		}; 
	} (errorCorrectionLevel));
	return errorCorrectionLevel;
}

var bitBuffer;
var hasRequiredBitBuffer;

function requireBitBuffer () {
	if (hasRequiredBitBuffer) return bitBuffer;
	hasRequiredBitBuffer = 1;
	function BitBuffer () {
	  this.buffer = [];
	  this.length = 0;
	}

	BitBuffer.prototype = {

	  get: function (index) {
	    const bufIndex = Math.floor(index / 8);
	    return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1
	  },

	  put: function (num, length) {
	    for (let i = 0; i < length; i++) {
	      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
	    }
	  },

	  getLengthInBits: function () {
	    return this.length
	  },

	  putBit: function (bit) {
	    const bufIndex = Math.floor(this.length / 8);
	    if (this.buffer.length <= bufIndex) {
	      this.buffer.push(0);
	    }

	    if (bit) {
	      this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
	    }

	    this.length++;
	  }
	};

	bitBuffer = BitBuffer;
	return bitBuffer;
}

/**
 * Helper class to handle QR Code symbol modules
 *
 * @param {Number} size Symbol size
 */

var bitMatrix;
var hasRequiredBitMatrix;

function requireBitMatrix () {
	if (hasRequiredBitMatrix) return bitMatrix;
	hasRequiredBitMatrix = 1;
	function BitMatrix (size) {
	  if (!size || size < 1) {
	    throw new Error('BitMatrix size must be defined and greater than 0')
	  }

	  this.size = size;
	  this.data = new Uint8Array(size * size);
	  this.reservedBit = new Uint8Array(size * size);
	}

	/**
	 * Set bit value at specified location
	 * If reserved flag is set, this bit will be ignored during masking process
	 *
	 * @param {Number}  row
	 * @param {Number}  col
	 * @param {Boolean} value
	 * @param {Boolean} reserved
	 */
	BitMatrix.prototype.set = function (row, col, value, reserved) {
	  const index = row * this.size + col;
	  this.data[index] = value;
	  if (reserved) this.reservedBit[index] = true;
	};

	/**
	 * Returns bit value at specified location
	 *
	 * @param  {Number}  row
	 * @param  {Number}  col
	 * @return {Boolean}
	 */
	BitMatrix.prototype.get = function (row, col) {
	  return this.data[row * this.size + col]
	};

	/**
	 * Applies xor operator at specified location
	 * (used during masking process)
	 *
	 * @param {Number}  row
	 * @param {Number}  col
	 * @param {Boolean} value
	 */
	BitMatrix.prototype.xor = function (row, col, value) {
	  this.data[row * this.size + col] ^= value;
	};

	/**
	 * Check if bit at specified location is reserved
	 *
	 * @param {Number}   row
	 * @param {Number}   col
	 * @return {Boolean}
	 */
	BitMatrix.prototype.isReserved = function (row, col) {
	  return this.reservedBit[row * this.size + col]
	};

	bitMatrix = BitMatrix;
	return bitMatrix;
}

var alignmentPattern = {};

/**
 * Alignment pattern are fixed reference pattern in defined positions
 * in a matrix symbology, which enables the decode software to re-synchronise
 * the coordinate mapping of the image modules in the event of moderate amounts
 * of distortion of the image.
 *
 * Alignment patterns are present only in QR Code symbols of version 2 or larger
 * and their number depends on the symbol version.
 */

var hasRequiredAlignmentPattern;

function requireAlignmentPattern () {
	if (hasRequiredAlignmentPattern) return alignmentPattern;
	hasRequiredAlignmentPattern = 1;
	(function (exports$1) {
		const getSymbolSize = requireUtils$1().getSymbolSize;

		/**
		 * Calculate the row/column coordinates of the center module of each alignment pattern
		 * for the specified QR Code version.
		 *
		 * The alignment patterns are positioned symmetrically on either side of the diagonal
		 * running from the top left corner of the symbol to the bottom right corner.
		 *
		 * Since positions are simmetrical only half of the coordinates are returned.
		 * Each item of the array will represent in turn the x and y coordinate.
		 * @see {@link getPositions}
		 *
		 * @param  {Number} version QR Code version
		 * @return {Array}          Array of coordinate
		 */
		exports$1.getRowColCoords = function getRowColCoords (version) {
		  if (version === 1) return []

		  const posCount = Math.floor(version / 7) + 2;
		  const size = getSymbolSize(version);
		  const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
		  const positions = [size - 7]; // Last coord is always (size - 7)

		  for (let i = 1; i < posCount - 1; i++) {
		    positions[i] = positions[i - 1] - intervals;
		  }

		  positions.push(6); // First coord is always 6

		  return positions.reverse()
		};

		/**
		 * Returns an array containing the positions of each alignment pattern.
		 * Each array's element represent the center point of the pattern as (x, y) coordinates
		 *
		 * Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
		 * and filtering out the items that overlaps with finder pattern
		 *
		 * @example
		 * For a Version 7 symbol {@link getRowColCoords} returns values 6, 22 and 38.
		 * The alignment patterns, therefore, are to be centered on (row, column)
		 * positions (6,22), (22,6), (22,22), (22,38), (38,22), (38,38).
		 * Note that the coordinates (6,6), (6,38), (38,6) are occupied by finder patterns
		 * and are not therefore used for alignment patterns.
		 *
		 * let pos = getPositions(7)
		 * // [[6,22], [22,6], [22,22], [22,38], [38,22], [38,38]]
		 *
		 * @param  {Number} version QR Code version
		 * @return {Array}          Array of coordinates
		 */
		exports$1.getPositions = function getPositions (version) {
		  const coords = [];
		  const pos = exports$1.getRowColCoords(version);
		  const posLength = pos.length;

		  for (let i = 0; i < posLength; i++) {
		    for (let j = 0; j < posLength; j++) {
		      // Skip if position is occupied by finder patterns
		      if ((i === 0 && j === 0) || // top-left
		          (i === 0 && j === posLength - 1) || // bottom-left
		          (i === posLength - 1 && j === 0)) { // top-right
		        continue
		      }

		      coords.push([pos[i], pos[j]]);
		    }
		  }

		  return coords
		}; 
	} (alignmentPattern));
	return alignmentPattern;
}

var finderPattern = {};

var hasRequiredFinderPattern;

function requireFinderPattern () {
	if (hasRequiredFinderPattern) return finderPattern;
	hasRequiredFinderPattern = 1;
	const getSymbolSize = requireUtils$1().getSymbolSize;
	const FINDER_PATTERN_SIZE = 7;

	/**
	 * Returns an array containing the positions of each finder pattern.
	 * Each array's element represent the top-left point of the pattern as (x, y) coordinates
	 *
	 * @param  {Number} version QR Code version
	 * @return {Array}          Array of coordinates
	 */
	finderPattern.getPositions = function getPositions (version) {
	  const size = getSymbolSize(version);

	  return [
	    // top-left
	    [0, 0],
	    // top-right
	    [size - FINDER_PATTERN_SIZE, 0],
	    // bottom-left
	    [0, size - FINDER_PATTERN_SIZE]
	  ]
	};
	return finderPattern;
}

var maskPattern = {};

/**
 * Data mask pattern reference
 * @type {Object}
 */

var hasRequiredMaskPattern;

function requireMaskPattern () {
	if (hasRequiredMaskPattern) return maskPattern;
	hasRequiredMaskPattern = 1;
	(function (exports$1) {
		exports$1.Patterns = {
		  PATTERN000: 0,
		  PATTERN001: 1,
		  PATTERN010: 2,
		  PATTERN011: 3,
		  PATTERN100: 4,
		  PATTERN101: 5,
		  PATTERN110: 6,
		  PATTERN111: 7
		};

		/**
		 * Weighted penalty scores for the undesirable features
		 * @type {Object}
		 */
		const PenaltyScores = {
		  N1: 3,
		  N2: 3,
		  N3: 40,
		  N4: 10
		};

		/**
		 * Check if mask pattern value is valid
		 *
		 * @param  {Number}  mask    Mask pattern
		 * @return {Boolean}         true if valid, false otherwise
		 */
		exports$1.isValid = function isValid (mask) {
		  return mask != null && mask !== '' && !isNaN(mask) && mask >= 0 && mask <= 7
		};

		/**
		 * Returns mask pattern from a value.
		 * If value is not valid, returns undefined
		 *
		 * @param  {Number|String} value        Mask pattern value
		 * @return {Number}                     Valid mask pattern or undefined
		 */
		exports$1.from = function from (value) {
		  return exports$1.isValid(value) ? parseInt(value, 10) : undefined
		};

		/**
		* Find adjacent modules in row/column with the same color
		* and assign a penalty value.
		*
		* Points: N1 + i
		* i is the amount by which the number of adjacent modules of the same color exceeds 5
		*/
		exports$1.getPenaltyN1 = function getPenaltyN1 (data) {
		  const size = data.size;
		  let points = 0;
		  let sameCountCol = 0;
		  let sameCountRow = 0;
		  let lastCol = null;
		  let lastRow = null;

		  for (let row = 0; row < size; row++) {
		    sameCountCol = sameCountRow = 0;
		    lastCol = lastRow = null;

		    for (let col = 0; col < size; col++) {
		      let module = data.get(row, col);
		      if (module === lastCol) {
		        sameCountCol++;
		      } else {
		        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
		        lastCol = module;
		        sameCountCol = 1;
		      }

		      module = data.get(col, row);
		      if (module === lastRow) {
		        sameCountRow++;
		      } else {
		        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
		        lastRow = module;
		        sameCountRow = 1;
		      }
		    }

		    if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
		    if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
		  }

		  return points
		};

		/**
		 * Find 2x2 blocks with the same color and assign a penalty value
		 *
		 * Points: N2 * (m - 1) * (n - 1)
		 */
		exports$1.getPenaltyN2 = function getPenaltyN2 (data) {
		  const size = data.size;
		  let points = 0;

		  for (let row = 0; row < size - 1; row++) {
		    for (let col = 0; col < size - 1; col++) {
		      const last = data.get(row, col) +
		        data.get(row, col + 1) +
		        data.get(row + 1, col) +
		        data.get(row + 1, col + 1);

		      if (last === 4 || last === 0) points++;
		    }
		  }

		  return points * PenaltyScores.N2
		};

		/**
		 * Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
		 * preceded or followed by light area 4 modules wide
		 *
		 * Points: N3 * number of pattern found
		 */
		exports$1.getPenaltyN3 = function getPenaltyN3 (data) {
		  const size = data.size;
		  let points = 0;
		  let bitsCol = 0;
		  let bitsRow = 0;

		  for (let row = 0; row < size; row++) {
		    bitsCol = bitsRow = 0;
		    for (let col = 0; col < size; col++) {
		      bitsCol = ((bitsCol << 1) & 0x7FF) | data.get(row, col);
		      if (col >= 10 && (bitsCol === 0x5D0 || bitsCol === 0x05D)) points++;

		      bitsRow = ((bitsRow << 1) & 0x7FF) | data.get(col, row);
		      if (col >= 10 && (bitsRow === 0x5D0 || bitsRow === 0x05D)) points++;
		    }
		  }

		  return points * PenaltyScores.N3
		};

		/**
		 * Calculate proportion of dark modules in entire symbol
		 *
		 * Points: N4 * k
		 *
		 * k is the rating of the deviation of the proportion of dark modules
		 * in the symbol from 50% in steps of 5%
		 */
		exports$1.getPenaltyN4 = function getPenaltyN4 (data) {
		  let darkCount = 0;
		  const modulesCount = data.data.length;

		  for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];

		  const k = Math.abs(Math.ceil((darkCount * 100 / modulesCount) / 5) - 10);

		  return k * PenaltyScores.N4
		};

		/**
		 * Return mask value at given position
		 *
		 * @param  {Number} maskPattern Pattern reference value
		 * @param  {Number} i           Row
		 * @param  {Number} j           Column
		 * @return {Boolean}            Mask value
		 */
		function getMaskAt (maskPattern, i, j) {
		  switch (maskPattern) {
		    case exports$1.Patterns.PATTERN000: return (i + j) % 2 === 0
		    case exports$1.Patterns.PATTERN001: return i % 2 === 0
		    case exports$1.Patterns.PATTERN010: return j % 3 === 0
		    case exports$1.Patterns.PATTERN011: return (i + j) % 3 === 0
		    case exports$1.Patterns.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
		    case exports$1.Patterns.PATTERN101: return (i * j) % 2 + (i * j) % 3 === 0
		    case exports$1.Patterns.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 === 0
		    case exports$1.Patterns.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 === 0

		    default: throw new Error('bad maskPattern:' + maskPattern)
		  }
		}

		/**
		 * Apply a mask pattern to a BitMatrix
		 *
		 * @param  {Number}    pattern Pattern reference number
		 * @param  {BitMatrix} data    BitMatrix data
		 */
		exports$1.applyMask = function applyMask (pattern, data) {
		  const size = data.size;

		  for (let col = 0; col < size; col++) {
		    for (let row = 0; row < size; row++) {
		      if (data.isReserved(row, col)) continue
		      data.xor(row, col, getMaskAt(pattern, row, col));
		    }
		  }
		};

		/**
		 * Returns the best mask pattern for data
		 *
		 * @param  {BitMatrix} data
		 * @return {Number} Mask pattern reference number
		 */
		exports$1.getBestMask = function getBestMask (data, setupFormatFunc) {
		  const numPatterns = Object.keys(exports$1.Patterns).length;
		  let bestPattern = 0;
		  let lowerPenalty = Infinity;

		  for (let p = 0; p < numPatterns; p++) {
		    setupFormatFunc(p);
		    exports$1.applyMask(p, data);

		    // Calculate penalty
		    const penalty =
		      exports$1.getPenaltyN1(data) +
		      exports$1.getPenaltyN2(data) +
		      exports$1.getPenaltyN3(data) +
		      exports$1.getPenaltyN4(data);

		    // Undo previously applied mask
		    exports$1.applyMask(p, data);

		    if (penalty < lowerPenalty) {
		      lowerPenalty = penalty;
		      bestPattern = p;
		    }
		  }

		  return bestPattern
		}; 
	} (maskPattern));
	return maskPattern;
}

var errorCorrectionCode = {};

var hasRequiredErrorCorrectionCode;

function requireErrorCorrectionCode () {
	if (hasRequiredErrorCorrectionCode) return errorCorrectionCode;
	hasRequiredErrorCorrectionCode = 1;
	const ECLevel = requireErrorCorrectionLevel();

	const EC_BLOCKS_TABLE = [
	// L  M  Q  H
	  1, 1, 1, 1,
	  1, 1, 1, 1,
	  1, 1, 2, 2,
	  1, 2, 2, 4,
	  1, 2, 4, 4,
	  2, 4, 4, 4,
	  2, 4, 6, 5,
	  2, 4, 6, 6,
	  2, 5, 8, 8,
	  4, 5, 8, 8,
	  4, 5, 8, 11,
	  4, 8, 10, 11,
	  4, 9, 12, 16,
	  4, 9, 16, 16,
	  6, 10, 12, 18,
	  6, 10, 17, 16,
	  6, 11, 16, 19,
	  6, 13, 18, 21,
	  7, 14, 21, 25,
	  8, 16, 20, 25,
	  8, 17, 23, 25,
	  9, 17, 23, 34,
	  9, 18, 25, 30,
	  10, 20, 27, 32,
	  12, 21, 29, 35,
	  12, 23, 34, 37,
	  12, 25, 34, 40,
	  13, 26, 35, 42,
	  14, 28, 38, 45,
	  15, 29, 40, 48,
	  16, 31, 43, 51,
	  17, 33, 45, 54,
	  18, 35, 48, 57,
	  19, 37, 51, 60,
	  19, 38, 53, 63,
	  20, 40, 56, 66,
	  21, 43, 59, 70,
	  22, 45, 62, 74,
	  24, 47, 65, 77,
	  25, 49, 68, 81
	];

	const EC_CODEWORDS_TABLE = [
	// L  M  Q  H
	  7, 10, 13, 17,
	  10, 16, 22, 28,
	  15, 26, 36, 44,
	  20, 36, 52, 64,
	  26, 48, 72, 88,
	  36, 64, 96, 112,
	  40, 72, 108, 130,
	  48, 88, 132, 156,
	  60, 110, 160, 192,
	  72, 130, 192, 224,
	  80, 150, 224, 264,
	  96, 176, 260, 308,
	  104, 198, 288, 352,
	  120, 216, 320, 384,
	  132, 240, 360, 432,
	  144, 280, 408, 480,
	  168, 308, 448, 532,
	  180, 338, 504, 588,
	  196, 364, 546, 650,
	  224, 416, 600, 700,
	  224, 442, 644, 750,
	  252, 476, 690, 816,
	  270, 504, 750, 900,
	  300, 560, 810, 960,
	  312, 588, 870, 1050,
	  336, 644, 952, 1110,
	  360, 700, 1020, 1200,
	  390, 728, 1050, 1260,
	  420, 784, 1140, 1350,
	  450, 812, 1200, 1440,
	  480, 868, 1290, 1530,
	  510, 924, 1350, 1620,
	  540, 980, 1440, 1710,
	  570, 1036, 1530, 1800,
	  570, 1064, 1590, 1890,
	  600, 1120, 1680, 1980,
	  630, 1204, 1770, 2100,
	  660, 1260, 1860, 2220,
	  720, 1316, 1950, 2310,
	  750, 1372, 2040, 2430
	];

	/**
	 * Returns the number of error correction block that the QR Code should contain
	 * for the specified version and error correction level.
	 *
	 * @param  {Number} version              QR Code version
	 * @param  {Number} errorCorrectionLevel Error correction level
	 * @return {Number}                      Number of error correction blocks
	 */
	errorCorrectionCode.getBlocksCount = function getBlocksCount (version, errorCorrectionLevel) {
	  switch (errorCorrectionLevel) {
	    case ECLevel.L:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 0]
	    case ECLevel.M:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 1]
	    case ECLevel.Q:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 2]
	    case ECLevel.H:
	      return EC_BLOCKS_TABLE[(version - 1) * 4 + 3]
	    default:
	      return undefined
	  }
	};

	/**
	 * Returns the number of error correction codewords to use for the specified
	 * version and error correction level.
	 *
	 * @param  {Number} version              QR Code version
	 * @param  {Number} errorCorrectionLevel Error correction level
	 * @return {Number}                      Number of error correction codewords
	 */
	errorCorrectionCode.getTotalCodewordsCount = function getTotalCodewordsCount (version, errorCorrectionLevel) {
	  switch (errorCorrectionLevel) {
	    case ECLevel.L:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0]
	    case ECLevel.M:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1]
	    case ECLevel.Q:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2]
	    case ECLevel.H:
	      return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3]
	    default:
	      return undefined
	  }
	};
	return errorCorrectionCode;
}

var polynomial = {};

var galoisField = {};

var hasRequiredGaloisField;

function requireGaloisField () {
	if (hasRequiredGaloisField) return galoisField;
	hasRequiredGaloisField = 1;
	const EXP_TABLE = new Uint8Array(512);
	const LOG_TABLE = new Uint8Array(256)
	/**
	 * Precompute the log and anti-log tables for faster computation later
	 *
	 * For each possible value in the galois field 2^8, we will pre-compute
	 * the logarithm and anti-logarithm (exponential) of this value
	 *
	 * ref {@link https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Introduction_to_mathematical_fields}
	 */
	;(function initTables () {
	  let x = 1;
	  for (let i = 0; i < 255; i++) {
	    EXP_TABLE[i] = x;
	    LOG_TABLE[x] = i;

	    x <<= 1; // multiply by 2

	    // The QR code specification says to use byte-wise modulo 100011101 arithmetic.
	    // This means that when a number is 256 or larger, it should be XORed with 0x11D.
	    if (x & 0x100) { // similar to x >= 256, but a lot faster (because 0x100 == 256)
	      x ^= 0x11D;
	    }
	  }

	  // Optimization: double the size of the anti-log table so that we don't need to mod 255 to
	  // stay inside the bounds (because we will mainly use this table for the multiplication of
	  // two GF numbers, no more).
	  // @see {@link mul}
	  for (let i = 255; i < 512; i++) {
	    EXP_TABLE[i] = EXP_TABLE[i - 255];
	  }
	}());

	/**
	 * Returns log value of n inside Galois Field
	 *
	 * @param  {Number} n
	 * @return {Number}
	 */
	galoisField.log = function log (n) {
	  if (n < 1) throw new Error('log(' + n + ')')
	  return LOG_TABLE[n]
	};

	/**
	 * Returns anti-log value of n inside Galois Field
	 *
	 * @param  {Number} n
	 * @return {Number}
	 */
	galoisField.exp = function exp (n) {
	  return EXP_TABLE[n]
	};

	/**
	 * Multiplies two number inside Galois Field
	 *
	 * @param  {Number} x
	 * @param  {Number} y
	 * @return {Number}
	 */
	galoisField.mul = function mul (x, y) {
	  if (x === 0 || y === 0) return 0

	  // should be EXP_TABLE[(LOG_TABLE[x] + LOG_TABLE[y]) % 255] if EXP_TABLE wasn't oversized
	  // @see {@link initTables}
	  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]]
	};
	return galoisField;
}

var hasRequiredPolynomial;

function requirePolynomial () {
	if (hasRequiredPolynomial) return polynomial;
	hasRequiredPolynomial = 1;
	(function (exports$1) {
		const GF = requireGaloisField();

		/**
		 * Multiplies two polynomials inside Galois Field
		 *
		 * @param  {Uint8Array} p1 Polynomial
		 * @param  {Uint8Array} p2 Polynomial
		 * @return {Uint8Array}    Product of p1 and p2
		 */
		exports$1.mul = function mul (p1, p2) {
		  const coeff = new Uint8Array(p1.length + p2.length - 1);

		  for (let i = 0; i < p1.length; i++) {
		    for (let j = 0; j < p2.length; j++) {
		      coeff[i + j] ^= GF.mul(p1[i], p2[j]);
		    }
		  }

		  return coeff
		};

		/**
		 * Calculate the remainder of polynomials division
		 *
		 * @param  {Uint8Array} divident Polynomial
		 * @param  {Uint8Array} divisor  Polynomial
		 * @return {Uint8Array}          Remainder
		 */
		exports$1.mod = function mod (divident, divisor) {
		  let result = new Uint8Array(divident);

		  while ((result.length - divisor.length) >= 0) {
		    const coeff = result[0];

		    for (let i = 0; i < divisor.length; i++) {
		      result[i] ^= GF.mul(divisor[i], coeff);
		    }

		    // remove all zeros from buffer head
		    let offset = 0;
		    while (offset < result.length && result[offset] === 0) offset++;
		    result = result.slice(offset);
		  }

		  return result
		};

		/**
		 * Generate an irreducible generator polynomial of specified degree
		 * (used by Reed-Solomon encoder)
		 *
		 * @param  {Number} degree Degree of the generator polynomial
		 * @return {Uint8Array}    Buffer containing polynomial coefficients
		 */
		exports$1.generateECPolynomial = function generateECPolynomial (degree) {
		  let poly = new Uint8Array([1]);
		  for (let i = 0; i < degree; i++) {
		    poly = exports$1.mul(poly, new Uint8Array([1, GF.exp(i)]));
		  }

		  return poly
		}; 
	} (polynomial));
	return polynomial;
}

var reedSolomonEncoder;
var hasRequiredReedSolomonEncoder;

function requireReedSolomonEncoder () {
	if (hasRequiredReedSolomonEncoder) return reedSolomonEncoder;
	hasRequiredReedSolomonEncoder = 1;
	const Polynomial = requirePolynomial();

	function ReedSolomonEncoder (degree) {
	  this.genPoly = undefined;
	  this.degree = degree;

	  if (this.degree) this.initialize(this.degree);
	}

	/**
	 * Initialize the encoder.
	 * The input param should correspond to the number of error correction codewords.
	 *
	 * @param  {Number} degree
	 */
	ReedSolomonEncoder.prototype.initialize = function initialize (degree) {
	  // create an irreducible generator polynomial
	  this.degree = degree;
	  this.genPoly = Polynomial.generateECPolynomial(this.degree);
	};

	/**
	 * Encodes a chunk of data
	 *
	 * @param  {Uint8Array} data Buffer containing input data
	 * @return {Uint8Array}      Buffer containing encoded data
	 */
	ReedSolomonEncoder.prototype.encode = function encode (data) {
	  if (!this.genPoly) {
	    throw new Error('Encoder not initialized')
	  }

	  // Calculate EC for this data block
	  // extends data size to data+genPoly size
	  const paddedData = new Uint8Array(data.length + this.degree);
	  paddedData.set(data);

	  // The error correction codewords are the remainder after dividing the data codewords
	  // by a generator polynomial
	  const remainder = Polynomial.mod(paddedData, this.genPoly);

	  // return EC data blocks (last n byte, where n is the degree of genPoly)
	  // If coefficients number in remainder are less than genPoly degree,
	  // pad with 0s to the left to reach the needed number of coefficients
	  const start = this.degree - remainder.length;
	  if (start > 0) {
	    const buff = new Uint8Array(this.degree);
	    buff.set(remainder, start);

	    return buff
	  }

	  return remainder
	};

	reedSolomonEncoder = ReedSolomonEncoder;
	return reedSolomonEncoder;
}

var version = {};

var mode = {};

var versionCheck = {};

/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */

var hasRequiredVersionCheck;

function requireVersionCheck () {
	if (hasRequiredVersionCheck) return versionCheck;
	hasRequiredVersionCheck = 1;
	versionCheck.isValid = function isValid (version) {
	  return !isNaN(version) && version >= 1 && version <= 40
	};
	return versionCheck;
}

var regex = {};

var hasRequiredRegex;

function requireRegex () {
	if (hasRequiredRegex) return regex;
	hasRequiredRegex = 1;
	const numeric = '[0-9]+';
	const alphanumeric = '[A-Z $%*+\\-./:]+';
	let kanji = '(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|' +
	  '[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|' +
	  '[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|' +
	  '[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+';
	kanji = kanji.replace(/u/g, '\\u');

	const byte = '(?:(?![A-Z0-9 $%*+\\-./:]|' + kanji + ')(?:.|[\r\n]))+';

	regex.KANJI = new RegExp(kanji, 'g');
	regex.BYTE_KANJI = new RegExp('[^A-Z0-9 $%*+\\-./:]+', 'g');
	regex.BYTE = new RegExp(byte, 'g');
	regex.NUMERIC = new RegExp(numeric, 'g');
	regex.ALPHANUMERIC = new RegExp(alphanumeric, 'g');

	const TEST_KANJI = new RegExp('^' + kanji + '$');
	const TEST_NUMERIC = new RegExp('^' + numeric + '$');
	const TEST_ALPHANUMERIC = new RegExp('^[A-Z0-9 $%*+\\-./:]+$');

	regex.testKanji = function testKanji (str) {
	  return TEST_KANJI.test(str)
	};

	regex.testNumeric = function testNumeric (str) {
	  return TEST_NUMERIC.test(str)
	};

	regex.testAlphanumeric = function testAlphanumeric (str) {
	  return TEST_ALPHANUMERIC.test(str)
	};
	return regex;
}

var hasRequiredMode;

function requireMode () {
	if (hasRequiredMode) return mode;
	hasRequiredMode = 1;
	(function (exports$1) {
		const VersionCheck = requireVersionCheck();
		const Regex = requireRegex();

		/**
		 * Numeric mode encodes data from the decimal digit set (0 - 9)
		 * (byte values 30HEX to 39HEX).
		 * Normally, 3 data characters are represented by 10 bits.
		 *
		 * @type {Object}
		 */
		exports$1.NUMERIC = {
		  id: 'Numeric',
		  bit: 1 << 0,
		  ccBits: [10, 12, 14]
		};

		/**
		 * Alphanumeric mode encodes data from a set of 45 characters,
		 * i.e. 10 numeric digits (0 - 9),
		 *      26 alphabetic characters (A - Z),
		 *   and 9 symbols (SP, $, %, *, +, -, ., /, :).
		 * Normally, two input characters are represented by 11 bits.
		 *
		 * @type {Object}
		 */
		exports$1.ALPHANUMERIC = {
		  id: 'Alphanumeric',
		  bit: 1 << 1,
		  ccBits: [9, 11, 13]
		};

		/**
		 * In byte mode, data is encoded at 8 bits per character.
		 *
		 * @type {Object}
		 */
		exports$1.BYTE = {
		  id: 'Byte',
		  bit: 1 << 2,
		  ccBits: [8, 16, 16]
		};

		/**
		 * The Kanji mode efficiently encodes Kanji characters in accordance with
		 * the Shift JIS system based on JIS X 0208.
		 * The Shift JIS values are shifted from the JIS X 0208 values.
		 * JIS X 0208 gives details of the shift coded representation.
		 * Each two-byte character value is compacted to a 13-bit binary codeword.
		 *
		 * @type {Object}
		 */
		exports$1.KANJI = {
		  id: 'Kanji',
		  bit: 1 << 3,
		  ccBits: [8, 10, 12]
		};

		/**
		 * Mixed mode will contain a sequences of data in a combination of any of
		 * the modes described above
		 *
		 * @type {Object}
		 */
		exports$1.MIXED = {
		  bit: -1
		};

		/**
		 * Returns the number of bits needed to store the data length
		 * according to QR Code specifications.
		 *
		 * @param  {Mode}   mode    Data mode
		 * @param  {Number} version QR Code version
		 * @return {Number}         Number of bits
		 */
		exports$1.getCharCountIndicator = function getCharCountIndicator (mode, version) {
		  if (!mode.ccBits) throw new Error('Invalid mode: ' + mode)

		  if (!VersionCheck.isValid(version)) {
		    throw new Error('Invalid version: ' + version)
		  }

		  if (version >= 1 && version < 10) return mode.ccBits[0]
		  else if (version < 27) return mode.ccBits[1]
		  return mode.ccBits[2]
		};

		/**
		 * Returns the most efficient mode to store the specified data
		 *
		 * @param  {String} dataStr Input data string
		 * @return {Mode}           Best mode
		 */
		exports$1.getBestModeForData = function getBestModeForData (dataStr) {
		  if (Regex.testNumeric(dataStr)) return exports$1.NUMERIC
		  else if (Regex.testAlphanumeric(dataStr)) return exports$1.ALPHANUMERIC
		  else if (Regex.testKanji(dataStr)) return exports$1.KANJI
		  else return exports$1.BYTE
		};

		/**
		 * Return mode name as string
		 *
		 * @param {Mode} mode Mode object
		 * @returns {String}  Mode name
		 */
		exports$1.toString = function toString (mode) {
		  if (mode && mode.id) return mode.id
		  throw new Error('Invalid mode')
		};

		/**
		 * Check if input param is a valid mode object
		 *
		 * @param   {Mode}    mode Mode object
		 * @returns {Boolean} True if valid mode, false otherwise
		 */
		exports$1.isValid = function isValid (mode) {
		  return mode && mode.bit && mode.ccBits
		};

		/**
		 * Get mode object from its name
		 *
		 * @param   {String} string Mode name
		 * @returns {Mode}          Mode object
		 */
		function fromString (string) {
		  if (typeof string !== 'string') {
		    throw new Error('Param is not a string')
		  }

		  const lcStr = string.toLowerCase();

		  switch (lcStr) {
		    case 'numeric':
		      return exports$1.NUMERIC
		    case 'alphanumeric':
		      return exports$1.ALPHANUMERIC
		    case 'kanji':
		      return exports$1.KANJI
		    case 'byte':
		      return exports$1.BYTE
		    default:
		      throw new Error('Unknown mode: ' + string)
		  }
		}

		/**
		 * Returns mode from a value.
		 * If value is not a valid mode, returns defaultValue
		 *
		 * @param  {Mode|String} value        Encoding mode
		 * @param  {Mode}        defaultValue Fallback value
		 * @return {Mode}                     Encoding mode
		 */
		exports$1.from = function from (value, defaultValue) {
		  if (exports$1.isValid(value)) {
		    return value
		  }

		  try {
		    return fromString(value)
		  } catch (e) {
		    return defaultValue
		  }
		}; 
	} (mode));
	return mode;
}

var hasRequiredVersion;

function requireVersion () {
	if (hasRequiredVersion) return version;
	hasRequiredVersion = 1;
	(function (exports$1) {
		const Utils = requireUtils$1();
		const ECCode = requireErrorCorrectionCode();
		const ECLevel = requireErrorCorrectionLevel();
		const Mode = requireMode();
		const VersionCheck = requireVersionCheck();

		// Generator polynomial used to encode version information
		const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
		const G18_BCH = Utils.getBCHDigit(G18);

		function getBestVersionForDataLength (mode, length, errorCorrectionLevel) {
		  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
		    if (length <= exports$1.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
		      return currentVersion
		    }
		  }

		  return undefined
		}

		function getReservedBitsCount (mode, version) {
		  // Character count indicator + mode indicator bits
		  return Mode.getCharCountIndicator(mode, version) + 4
		}

		function getTotalBitsFromDataArray (segments, version) {
		  let totalBits = 0;

		  segments.forEach(function (data) {
		    const reservedBits = getReservedBitsCount(data.mode, version);
		    totalBits += reservedBits + data.getBitsLength();
		  });

		  return totalBits
		}

		function getBestVersionForMixedData (segments, errorCorrectionLevel) {
		  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
		    const length = getTotalBitsFromDataArray(segments, currentVersion);
		    if (length <= exports$1.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
		      return currentVersion
		    }
		  }

		  return undefined
		}

		/**
		 * Returns version number from a value.
		 * If value is not a valid version, returns defaultValue
		 *
		 * @param  {Number|String} value        QR Code version
		 * @param  {Number}        defaultValue Fallback value
		 * @return {Number}                     QR Code version number
		 */
		exports$1.from = function from (value, defaultValue) {
		  if (VersionCheck.isValid(value)) {
		    return parseInt(value, 10)
		  }

		  return defaultValue
		};

		/**
		 * Returns how much data can be stored with the specified QR code version
		 * and error correction level
		 *
		 * @param  {Number} version              QR Code version (1-40)
		 * @param  {Number} errorCorrectionLevel Error correction level
		 * @param  {Mode}   mode                 Data mode
		 * @return {Number}                      Quantity of storable data
		 */
		exports$1.getCapacity = function getCapacity (version, errorCorrectionLevel, mode) {
		  if (!VersionCheck.isValid(version)) {
		    throw new Error('Invalid QR Code version')
		  }

		  // Use Byte mode as default
		  if (typeof mode === 'undefined') mode = Mode.BYTE;

		  // Total codewords for this QR code version (Data + Error correction)
		  const totalCodewords = Utils.getSymbolTotalCodewords(version);

		  // Total number of error correction codewords
		  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

		  // Total number of data codewords
		  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

		  if (mode === Mode.MIXED) return dataTotalCodewordsBits

		  const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);

		  // Return max number of storable codewords
		  switch (mode) {
		    case Mode.NUMERIC:
		      return Math.floor((usableBits / 10) * 3)

		    case Mode.ALPHANUMERIC:
		      return Math.floor((usableBits / 11) * 2)

		    case Mode.KANJI:
		      return Math.floor(usableBits / 13)

		    case Mode.BYTE:
		    default:
		      return Math.floor(usableBits / 8)
		  }
		};

		/**
		 * Returns the minimum version needed to contain the amount of data
		 *
		 * @param  {Segment} data                    Segment of data
		 * @param  {Number} [errorCorrectionLevel=H] Error correction level
		 * @param  {Mode} mode                       Data mode
		 * @return {Number}                          QR Code version
		 */
		exports$1.getBestVersionForData = function getBestVersionForData (data, errorCorrectionLevel) {
		  let seg;

		  const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);

		  if (Array.isArray(data)) {
		    if (data.length > 1) {
		      return getBestVersionForMixedData(data, ecl)
		    }

		    if (data.length === 0) {
		      return 1
		    }

		    seg = data[0];
		  } else {
		    seg = data;
		  }

		  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl)
		};

		/**
		 * Returns version information with relative error correction bits
		 *
		 * The version information is included in QR Code symbols of version 7 or larger.
		 * It consists of an 18-bit sequence containing 6 data bits,
		 * with 12 error correction bits calculated using the (18, 6) Golay code.
		 *
		 * @param  {Number} version QR Code version
		 * @return {Number}         Encoded version info bits
		 */
		exports$1.getEncodedBits = function getEncodedBits (version) {
		  if (!VersionCheck.isValid(version) || version < 7) {
		    throw new Error('Invalid QR Code version')
		  }

		  let d = version << 12;

		  while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
		    d ^= (G18 << (Utils.getBCHDigit(d) - G18_BCH));
		  }

		  return (version << 12) | d
		}; 
	} (version));
	return version;
}

var formatInfo = {};

var hasRequiredFormatInfo;

function requireFormatInfo () {
	if (hasRequiredFormatInfo) return formatInfo;
	hasRequiredFormatInfo = 1;
	const Utils = requireUtils$1();

	const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
	const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
	const G15_BCH = Utils.getBCHDigit(G15);

	/**
	 * Returns format information with relative error correction bits
	 *
	 * The format information is a 15-bit sequence containing 5 data bits,
	 * with 10 error correction bits calculated using the (15, 5) BCH code.
	 *
	 * @param  {Number} errorCorrectionLevel Error correction level
	 * @param  {Number} mask                 Mask pattern
	 * @return {Number}                      Encoded format information bits
	 */
	formatInfo.getEncodedBits = function getEncodedBits (errorCorrectionLevel, mask) {
	  const data = ((errorCorrectionLevel.bit << 3) | mask);
	  let d = data << 10;

	  while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
	    d ^= (G15 << (Utils.getBCHDigit(d) - G15_BCH));
	  }

	  // xor final data with mask pattern in order to ensure that
	  // no combination of Error Correction Level and data mask pattern
	  // will result in an all-zero data string
	  return ((data << 10) | d) ^ G15_MASK
	};
	return formatInfo;
}

var segments = {};

var numericData;
var hasRequiredNumericData;

function requireNumericData () {
	if (hasRequiredNumericData) return numericData;
	hasRequiredNumericData = 1;
	const Mode = requireMode();

	function NumericData (data) {
	  this.mode = Mode.NUMERIC;
	  this.data = data.toString();
	}

	NumericData.getBitsLength = function getBitsLength (length) {
	  return 10 * Math.floor(length / 3) + ((length % 3) ? ((length % 3) * 3 + 1) : 0)
	};

	NumericData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	NumericData.prototype.getBitsLength = function getBitsLength () {
	  return NumericData.getBitsLength(this.data.length)
	};

	NumericData.prototype.write = function write (bitBuffer) {
	  let i, group, value;

	  // The input data string is divided into groups of three digits,
	  // and each group is converted to its 10-bit binary equivalent.
	  for (i = 0; i + 3 <= this.data.length; i += 3) {
	    group = this.data.substr(i, 3);
	    value = parseInt(group, 10);

	    bitBuffer.put(value, 10);
	  }

	  // If the number of input digits is not an exact multiple of three,
	  // the final one or two digits are converted to 4 or 7 bits respectively.
	  const remainingNum = this.data.length - i;
	  if (remainingNum > 0) {
	    group = this.data.substr(i);
	    value = parseInt(group, 10);

	    bitBuffer.put(value, remainingNum * 3 + 1);
	  }
	};

	numericData = NumericData;
	return numericData;
}

var alphanumericData;
var hasRequiredAlphanumericData;

function requireAlphanumericData () {
	if (hasRequiredAlphanumericData) return alphanumericData;
	hasRequiredAlphanumericData = 1;
	const Mode = requireMode();

	/**
	 * Array of characters available in alphanumeric mode
	 *
	 * As per QR Code specification, to each character
	 * is assigned a value from 0 to 44 which in this case coincides
	 * with the array index
	 *
	 * @type {Array}
	 */
	const ALPHA_NUM_CHARS = [
	  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
	  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
	  ' ', '$', '%', '*', '+', '-', '.', '/', ':'
	];

	function AlphanumericData (data) {
	  this.mode = Mode.ALPHANUMERIC;
	  this.data = data;
	}

	AlphanumericData.getBitsLength = function getBitsLength (length) {
	  return 11 * Math.floor(length / 2) + 6 * (length % 2)
	};

	AlphanumericData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	AlphanumericData.prototype.getBitsLength = function getBitsLength () {
	  return AlphanumericData.getBitsLength(this.data.length)
	};

	AlphanumericData.prototype.write = function write (bitBuffer) {
	  let i;

	  // Input data characters are divided into groups of two characters
	  // and encoded as 11-bit binary codes.
	  for (i = 0; i + 2 <= this.data.length; i += 2) {
	    // The character value of the first character is multiplied by 45
	    let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;

	    // The character value of the second digit is added to the product
	    value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);

	    // The sum is then stored as 11-bit binary number
	    bitBuffer.put(value, 11);
	  }

	  // If the number of input data characters is not a multiple of two,
	  // the character value of the final character is encoded as a 6-bit binary number.
	  if (this.data.length % 2) {
	    bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
	  }
	};

	alphanumericData = AlphanumericData;
	return alphanumericData;
}

var byteData;
var hasRequiredByteData;

function requireByteData () {
	if (hasRequiredByteData) return byteData;
	hasRequiredByteData = 1;
	const Mode = requireMode();

	function ByteData (data) {
	  this.mode = Mode.BYTE;
	  if (typeof (data) === 'string') {
	    this.data = new TextEncoder().encode(data);
	  } else {
	    this.data = new Uint8Array(data);
	  }
	}

	ByteData.getBitsLength = function getBitsLength (length) {
	  return length * 8
	};

	ByteData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	ByteData.prototype.getBitsLength = function getBitsLength () {
	  return ByteData.getBitsLength(this.data.length)
	};

	ByteData.prototype.write = function (bitBuffer) {
	  for (let i = 0, l = this.data.length; i < l; i++) {
	    bitBuffer.put(this.data[i], 8);
	  }
	};

	byteData = ByteData;
	return byteData;
}

var kanjiData;
var hasRequiredKanjiData;

function requireKanjiData () {
	if (hasRequiredKanjiData) return kanjiData;
	hasRequiredKanjiData = 1;
	const Mode = requireMode();
	const Utils = requireUtils$1();

	function KanjiData (data) {
	  this.mode = Mode.KANJI;
	  this.data = data;
	}

	KanjiData.getBitsLength = function getBitsLength (length) {
	  return length * 13
	};

	KanjiData.prototype.getLength = function getLength () {
	  return this.data.length
	};

	KanjiData.prototype.getBitsLength = function getBitsLength () {
	  return KanjiData.getBitsLength(this.data.length)
	};

	KanjiData.prototype.write = function (bitBuffer) {
	  let i;

	  // In the Shift JIS system, Kanji characters are represented by a two byte combination.
	  // These byte values are shifted from the JIS X 0208 values.
	  // JIS X 0208 gives details of the shift coded representation.
	  for (i = 0; i < this.data.length; i++) {
	    let value = Utils.toSJIS(this.data[i]);

	    // For characters with Shift JIS values from 0x8140 to 0x9FFC:
	    if (value >= 0x8140 && value <= 0x9FFC) {
	      // Subtract 0x8140 from Shift JIS value
	      value -= 0x8140;

	    // For characters with Shift JIS values from 0xE040 to 0xEBBF
	    } else if (value >= 0xE040 && value <= 0xEBBF) {
	      // Subtract 0xC140 from Shift JIS value
	      value -= 0xC140;
	    } else {
	      throw new Error(
	        'Invalid SJIS character: ' + this.data[i] + '\n' +
	        'Make sure your charset is UTF-8')
	    }

	    // Multiply most significant byte of result by 0xC0
	    // and add least significant byte to product
	    value = (((value >>> 8) & 0xff) * 0xC0) + (value & 0xff);

	    // Convert result to a 13-bit binary string
	    bitBuffer.put(value, 13);
	  }
	};

	kanjiData = KanjiData;
	return kanjiData;
}

var dijkstra = {exports: {}};

var hasRequiredDijkstra;

function requireDijkstra () {
	if (hasRequiredDijkstra) return dijkstra.exports;
	hasRequiredDijkstra = 1;
	(function (module) {

		/******************************************************************************
		 * Created 2008-08-19.
		 *
		 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
		 *
		 * Copyright (C) 2008
		 *   Wyatt Baldwin <self@wyattbaldwin.com>
		 *   All rights reserved
		 *
		 * Licensed under the MIT license.
		 *
		 *   http://www.opensource.org/licenses/mit-license.php
		 *
		 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
		 * THE SOFTWARE.
		 *****************************************************************************/
		var dijkstra = {
		  single_source_shortest_paths: function(graph, s, d) {
		    // Predecessor map for each node that has been encountered.
		    // node ID => predecessor node ID
		    var predecessors = {};

		    // Costs of shortest paths from s to all nodes encountered.
		    // node ID => cost
		    var costs = {};
		    costs[s] = 0;

		    // Costs of shortest paths from s to all nodes encountered; differs from
		    // `costs` in that it provides easy access to the node that currently has
		    // the known shortest path from s.
		    // XXX: Do we actually need both `costs` and `open`?
		    var open = dijkstra.PriorityQueue.make();
		    open.push(s, 0);

		    var closest,
		        u, v,
		        cost_of_s_to_u,
		        adjacent_nodes,
		        cost_of_e,
		        cost_of_s_to_u_plus_cost_of_e,
		        cost_of_s_to_v,
		        first_visit;
		    while (!open.empty()) {
		      // In the nodes remaining in graph that have a known cost from s,
		      // find the node, u, that currently has the shortest path from s.
		      closest = open.pop();
		      u = closest.value;
		      cost_of_s_to_u = closest.cost;

		      // Get nodes adjacent to u...
		      adjacent_nodes = graph[u] || {};

		      // ...and explore the edges that connect u to those nodes, updating
		      // the cost of the shortest paths to any or all of those nodes as
		      // necessary. v is the node across the current edge from u.
		      for (v in adjacent_nodes) {
		        if (adjacent_nodes.hasOwnProperty(v)) {
		          // Get the cost of the edge running from u to v.
		          cost_of_e = adjacent_nodes[v];

		          // Cost of s to u plus the cost of u to v across e--this is *a*
		          // cost from s to v that may or may not be less than the current
		          // known cost to v.
		          cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

		          // If we haven't visited v yet OR if the current known cost from s to
		          // v is greater than the new cost we just found (cost of s to u plus
		          // cost of u to v across e), update v's cost in the cost list and
		          // update v's predecessor in the predecessor list (it's now u).
		          cost_of_s_to_v = costs[v];
		          first_visit = (typeof costs[v] === 'undefined');
		          if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
		            costs[v] = cost_of_s_to_u_plus_cost_of_e;
		            open.push(v, cost_of_s_to_u_plus_cost_of_e);
		            predecessors[v] = u;
		          }
		        }
		      }
		    }

		    if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
		      var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
		      throw new Error(msg);
		    }

		    return predecessors;
		  },

		  extract_shortest_path_from_predecessor_list: function(predecessors, d) {
		    var nodes = [];
		    var u = d;
		    while (u) {
		      nodes.push(u);
		      predecessors[u];
		      u = predecessors[u];
		    }
		    nodes.reverse();
		    return nodes;
		  },

		  find_path: function(graph, s, d) {
		    var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
		    return dijkstra.extract_shortest_path_from_predecessor_list(
		      predecessors, d);
		  },

		  /**
		   * A very naive priority queue implementation.
		   */
		  PriorityQueue: {
		    make: function (opts) {
		      var T = dijkstra.PriorityQueue,
		          t = {},
		          key;
		      opts = opts || {};
		      for (key in T) {
		        if (T.hasOwnProperty(key)) {
		          t[key] = T[key];
		        }
		      }
		      t.queue = [];
		      t.sorter = opts.sorter || T.default_sorter;
		      return t;
		    },

		    default_sorter: function (a, b) {
		      return a.cost - b.cost;
		    },

		    /**
		     * Add a new item to the queue and ensure the highest priority element
		     * is at the front of the queue.
		     */
		    push: function (value, cost) {
		      var item = {value: value, cost: cost};
		      this.queue.push(item);
		      this.queue.sort(this.sorter);
		    },

		    /**
		     * Return the highest priority element in the queue.
		     */
		    pop: function () {
		      return this.queue.shift();
		    },

		    empty: function () {
		      return this.queue.length === 0;
		    }
		  }
		};


		// node.js module exports
		{
		  module.exports = dijkstra;
		} 
	} (dijkstra));
	return dijkstra.exports;
}

var hasRequiredSegments;

function requireSegments () {
	if (hasRequiredSegments) return segments;
	hasRequiredSegments = 1;
	(function (exports$1) {
		const Mode = requireMode();
		const NumericData = requireNumericData();
		const AlphanumericData = requireAlphanumericData();
		const ByteData = requireByteData();
		const KanjiData = requireKanjiData();
		const Regex = requireRegex();
		const Utils = requireUtils$1();
		const dijkstra = requireDijkstra();

		/**
		 * Returns UTF8 byte length
		 *
		 * @param  {String} str Input string
		 * @return {Number}     Number of byte
		 */
		function getStringByteLength (str) {
		  return unescape(encodeURIComponent(str)).length
		}

		/**
		 * Get a list of segments of the specified mode
		 * from a string
		 *
		 * @param  {Mode}   mode Segment mode
		 * @param  {String} str  String to process
		 * @return {Array}       Array of object with segments data
		 */
		function getSegments (regex, mode, str) {
		  const segments = [];
		  let result;

		  while ((result = regex.exec(str)) !== null) {
		    segments.push({
		      data: result[0],
		      index: result.index,
		      mode: mode,
		      length: result[0].length
		    });
		  }

		  return segments
		}

		/**
		 * Extracts a series of segments with the appropriate
		 * modes from a string
		 *
		 * @param  {String} dataStr Input string
		 * @return {Array}          Array of object with segments data
		 */
		function getSegmentsFromString (dataStr) {
		  const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
		  const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
		  let byteSegs;
		  let kanjiSegs;

		  if (Utils.isKanjiModeEnabled()) {
		    byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
		    kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
		  } else {
		    byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
		    kanjiSegs = [];
		  }

		  const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);

		  return segs
		    .sort(function (s1, s2) {
		      return s1.index - s2.index
		    })
		    .map(function (obj) {
		      return {
		        data: obj.data,
		        mode: obj.mode,
		        length: obj.length
		      }
		    })
		}

		/**
		 * Returns how many bits are needed to encode a string of
		 * specified length with the specified mode
		 *
		 * @param  {Number} length String length
		 * @param  {Mode} mode     Segment mode
		 * @return {Number}        Bit length
		 */
		function getSegmentBitsLength (length, mode) {
		  switch (mode) {
		    case Mode.NUMERIC:
		      return NumericData.getBitsLength(length)
		    case Mode.ALPHANUMERIC:
		      return AlphanumericData.getBitsLength(length)
		    case Mode.KANJI:
		      return KanjiData.getBitsLength(length)
		    case Mode.BYTE:
		      return ByteData.getBitsLength(length)
		  }
		}

		/**
		 * Merges adjacent segments which have the same mode
		 *
		 * @param  {Array} segs Array of object with segments data
		 * @return {Array}      Array of object with segments data
		 */
		function mergeSegments (segs) {
		  return segs.reduce(function (acc, curr) {
		    const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
		    if (prevSeg && prevSeg.mode === curr.mode) {
		      acc[acc.length - 1].data += curr.data;
		      return acc
		    }

		    acc.push(curr);
		    return acc
		  }, [])
		}

		/**
		 * Generates a list of all possible nodes combination which
		 * will be used to build a segments graph.
		 *
		 * Nodes are divided by groups. Each group will contain a list of all the modes
		 * in which is possible to encode the given text.
		 *
		 * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
		 * The group for '12345' will contain then 3 objects, one for each
		 * possible encoding mode.
		 *
		 * Each node represents a possible segment.
		 *
		 * @param  {Array} segs Array of object with segments data
		 * @return {Array}      Array of object with segments data
		 */
		function buildNodes (segs) {
		  const nodes = [];
		  for (let i = 0; i < segs.length; i++) {
		    const seg = segs[i];

		    switch (seg.mode) {
		      case Mode.NUMERIC:
		        nodes.push([seg,
		          { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
		          { data: seg.data, mode: Mode.BYTE, length: seg.length }
		        ]);
		        break
		      case Mode.ALPHANUMERIC:
		        nodes.push([seg,
		          { data: seg.data, mode: Mode.BYTE, length: seg.length }
		        ]);
		        break
		      case Mode.KANJI:
		        nodes.push([seg,
		          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
		        ]);
		        break
		      case Mode.BYTE:
		        nodes.push([
		          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
		        ]);
		    }
		  }

		  return nodes
		}

		/**
		 * Builds a graph from a list of nodes.
		 * All segments in each node group will be connected with all the segments of
		 * the next group and so on.
		 *
		 * At each connection will be assigned a weight depending on the
		 * segment's byte length.
		 *
		 * @param  {Array} nodes    Array of object with segments data
		 * @param  {Number} version QR Code version
		 * @return {Object}         Graph of all possible segments
		 */
		function buildGraph (nodes, version) {
		  const table = {};
		  const graph = { start: {} };
		  let prevNodeIds = ['start'];

		  for (let i = 0; i < nodes.length; i++) {
		    const nodeGroup = nodes[i];
		    const currentNodeIds = [];

		    for (let j = 0; j < nodeGroup.length; j++) {
		      const node = nodeGroup[j];
		      const key = '' + i + j;

		      currentNodeIds.push(key);
		      table[key] = { node: node, lastCount: 0 };
		      graph[key] = {};

		      for (let n = 0; n < prevNodeIds.length; n++) {
		        const prevNodeId = prevNodeIds[n];

		        if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
		          graph[prevNodeId][key] =
		            getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) -
		            getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);

		          table[prevNodeId].lastCount += node.length;
		        } else {
		          if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;

		          graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) +
		            4 + Mode.getCharCountIndicator(node.mode, version); // switch cost
		        }
		      }
		    }

		    prevNodeIds = currentNodeIds;
		  }

		  for (let n = 0; n < prevNodeIds.length; n++) {
		    graph[prevNodeIds[n]].end = 0;
		  }

		  return { map: graph, table: table }
		}

		/**
		 * Builds a segment from a specified data and mode.
		 * If a mode is not specified, the more suitable will be used.
		 *
		 * @param  {String} data             Input data
		 * @param  {Mode | String} modesHint Data mode
		 * @return {Segment}                 Segment
		 */
		function buildSingleSegment (data, modesHint) {
		  let mode;
		  const bestMode = Mode.getBestModeForData(data);

		  mode = Mode.from(modesHint, bestMode);

		  // Make sure data can be encoded
		  if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
		    throw new Error('"' + data + '"' +
		      ' cannot be encoded with mode ' + Mode.toString(mode) +
		      '.\n Suggested mode is: ' + Mode.toString(bestMode))
		  }

		  // Use Mode.BYTE if Kanji support is disabled
		  if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
		    mode = Mode.BYTE;
		  }

		  switch (mode) {
		    case Mode.NUMERIC:
		      return new NumericData(data)

		    case Mode.ALPHANUMERIC:
		      return new AlphanumericData(data)

		    case Mode.KANJI:
		      return new KanjiData(data)

		    case Mode.BYTE:
		      return new ByteData(data)
		  }
		}

		/**
		 * Builds a list of segments from an array.
		 * Array can contain Strings or Objects with segment's info.
		 *
		 * For each item which is a string, will be generated a segment with the given
		 * string and the more appropriate encoding mode.
		 *
		 * For each item which is an object, will be generated a segment with the given
		 * data and mode.
		 * Objects must contain at least the property "data".
		 * If property "mode" is not present, the more suitable mode will be used.
		 *
		 * @param  {Array} array Array of objects with segments data
		 * @return {Array}       Array of Segments
		 */
		exports$1.fromArray = function fromArray (array) {
		  return array.reduce(function (acc, seg) {
		    if (typeof seg === 'string') {
		      acc.push(buildSingleSegment(seg, null));
		    } else if (seg.data) {
		      acc.push(buildSingleSegment(seg.data, seg.mode));
		    }

		    return acc
		  }, [])
		};

		/**
		 * Builds an optimized sequence of segments from a string,
		 * which will produce the shortest possible bitstream.
		 *
		 * @param  {String} data    Input string
		 * @param  {Number} version QR Code version
		 * @return {Array}          Array of segments
		 */
		exports$1.fromString = function fromString (data, version) {
		  const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());

		  const nodes = buildNodes(segs);
		  const graph = buildGraph(nodes, version);
		  const path = dijkstra.find_path(graph.map, 'start', 'end');

		  const optimizedSegs = [];
		  for (let i = 1; i < path.length - 1; i++) {
		    optimizedSegs.push(graph.table[path[i]].node);
		  }

		  return exports$1.fromArray(mergeSegments(optimizedSegs))
		};

		/**
		 * Splits a string in various segments with the modes which
		 * best represent their content.
		 * The produced segments are far from being optimized.
		 * The output of this function is only used to estimate a QR Code version
		 * which may contain the data.
		 *
		 * @param  {string} data Input string
		 * @return {Array}       Array of segments
		 */
		exports$1.rawSplit = function rawSplit (data) {
		  return exports$1.fromArray(
		    getSegmentsFromString(data, Utils.isKanjiModeEnabled())
		  )
		}; 
	} (segments));
	return segments;
}

var hasRequiredQrcode;

function requireQrcode () {
	if (hasRequiredQrcode) return qrcode;
	hasRequiredQrcode = 1;
	const Utils = requireUtils$1();
	const ECLevel = requireErrorCorrectionLevel();
	const BitBuffer = requireBitBuffer();
	const BitMatrix = requireBitMatrix();
	const AlignmentPattern = requireAlignmentPattern();
	const FinderPattern = requireFinderPattern();
	const MaskPattern = requireMaskPattern();
	const ECCode = requireErrorCorrectionCode();
	const ReedSolomonEncoder = requireReedSolomonEncoder();
	const Version = requireVersion();
	const FormatInfo = requireFormatInfo();
	const Mode = requireMode();
	const Segments = requireSegments();

	/**
	 * QRCode for JavaScript
	 *
	 * modified by Ryan Day for nodejs support
	 * Copyright (c) 2011 Ryan Day
	 *
	 * Licensed under the MIT license:
	 *   http://www.opensource.org/licenses/mit-license.php
	 *
	//---------------------------------------------------------------------
	// QRCode for JavaScript
	//
	// Copyright (c) 2009 Kazuhiko Arase
	//
	// URL: http://www.d-project.com/
	//
	// Licensed under the MIT license:
	//   http://www.opensource.org/licenses/mit-license.php
	//
	// The word "QR Code" is registered trademark of
	// DENSO WAVE INCORPORATED
	//   http://www.denso-wave.com/qrcode/faqpatent-e.html
	//
	//---------------------------------------------------------------------
	*/

	/**
	 * Add finder patterns bits to matrix
	 *
	 * @param  {BitMatrix} matrix  Modules matrix
	 * @param  {Number}    version QR Code version
	 */
	function setupFinderPattern (matrix, version) {
	  const size = matrix.size;
	  const pos = FinderPattern.getPositions(version);

	  for (let i = 0; i < pos.length; i++) {
	    const row = pos[i][0];
	    const col = pos[i][1];

	    for (let r = -1; r <= 7; r++) {
	      if (row + r <= -1 || size <= row + r) continue

	      for (let c = -1; c <= 7; c++) {
	        if (col + c <= -1 || size <= col + c) continue

	        if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
	          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
	          (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
	          matrix.set(row + r, col + c, true, true);
	        } else {
	          matrix.set(row + r, col + c, false, true);
	        }
	      }
	    }
	  }
	}

	/**
	 * Add timing pattern bits to matrix
	 *
	 * Note: this function must be called before {@link setupAlignmentPattern}
	 *
	 * @param  {BitMatrix} matrix Modules matrix
	 */
	function setupTimingPattern (matrix) {
	  const size = matrix.size;

	  for (let r = 8; r < size - 8; r++) {
	    const value = r % 2 === 0;
	    matrix.set(r, 6, value, true);
	    matrix.set(6, r, value, true);
	  }
	}

	/**
	 * Add alignment patterns bits to matrix
	 *
	 * Note: this function must be called after {@link setupTimingPattern}
	 *
	 * @param  {BitMatrix} matrix  Modules matrix
	 * @param  {Number}    version QR Code version
	 */
	function setupAlignmentPattern (matrix, version) {
	  const pos = AlignmentPattern.getPositions(version);

	  for (let i = 0; i < pos.length; i++) {
	    const row = pos[i][0];
	    const col = pos[i][1];

	    for (let r = -2; r <= 2; r++) {
	      for (let c = -2; c <= 2; c++) {
	        if (r === -2 || r === 2 || c === -2 || c === 2 ||
	          (r === 0 && c === 0)) {
	          matrix.set(row + r, col + c, true, true);
	        } else {
	          matrix.set(row + r, col + c, false, true);
	        }
	      }
	    }
	  }
	}

	/**
	 * Add version info bits to matrix
	 *
	 * @param  {BitMatrix} matrix  Modules matrix
	 * @param  {Number}    version QR Code version
	 */
	function setupVersionInfo (matrix, version) {
	  const size = matrix.size;
	  const bits = Version.getEncodedBits(version);
	  let row, col, mod;

	  for (let i = 0; i < 18; i++) {
	    row = Math.floor(i / 3);
	    col = i % 3 + size - 8 - 3;
	    mod = ((bits >> i) & 1) === 1;

	    matrix.set(row, col, mod, true);
	    matrix.set(col, row, mod, true);
	  }
	}

	/**
	 * Add format info bits to matrix
	 *
	 * @param  {BitMatrix} matrix               Modules matrix
	 * @param  {ErrorCorrectionLevel}    errorCorrectionLevel Error correction level
	 * @param  {Number}    maskPattern          Mask pattern reference value
	 */
	function setupFormatInfo (matrix, errorCorrectionLevel, maskPattern) {
	  const size = matrix.size;
	  const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
	  let i, mod;

	  for (i = 0; i < 15; i++) {
	    mod = ((bits >> i) & 1) === 1;

	    // vertical
	    if (i < 6) {
	      matrix.set(i, 8, mod, true);
	    } else if (i < 8) {
	      matrix.set(i + 1, 8, mod, true);
	    } else {
	      matrix.set(size - 15 + i, 8, mod, true);
	    }

	    // horizontal
	    if (i < 8) {
	      matrix.set(8, size - i - 1, mod, true);
	    } else if (i < 9) {
	      matrix.set(8, 15 - i - 1 + 1, mod, true);
	    } else {
	      matrix.set(8, 15 - i - 1, mod, true);
	    }
	  }

	  // fixed module
	  matrix.set(size - 8, 8, 1, true);
	}

	/**
	 * Add encoded data bits to matrix
	 *
	 * @param  {BitMatrix}  matrix Modules matrix
	 * @param  {Uint8Array} data   Data codewords
	 */
	function setupData (matrix, data) {
	  const size = matrix.size;
	  let inc = -1;
	  let row = size - 1;
	  let bitIndex = 7;
	  let byteIndex = 0;

	  for (let col = size - 1; col > 0; col -= 2) {
	    if (col === 6) col--;

	    while (true) {
	      for (let c = 0; c < 2; c++) {
	        if (!matrix.isReserved(row, col - c)) {
	          let dark = false;

	          if (byteIndex < data.length) {
	            dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
	          }

	          matrix.set(row, col - c, dark);
	          bitIndex--;

	          if (bitIndex === -1) {
	            byteIndex++;
	            bitIndex = 7;
	          }
	        }
	      }

	      row += inc;

	      if (row < 0 || size <= row) {
	        row -= inc;
	        inc = -inc;
	        break
	      }
	    }
	  }
	}

	/**
	 * Create encoded codewords from data input
	 *
	 * @param  {Number}   version              QR Code version
	 * @param  {ErrorCorrectionLevel}   errorCorrectionLevel Error correction level
	 * @param  {ByteData} data                 Data input
	 * @return {Uint8Array}                    Buffer containing encoded codewords
	 */
	function createData (version, errorCorrectionLevel, segments) {
	  // Prepare data buffer
	  const buffer = new BitBuffer();

	  segments.forEach(function (data) {
	    // prefix data with mode indicator (4 bits)
	    buffer.put(data.mode.bit, 4);

	    // Prefix data with character count indicator.
	    // The character count indicator is a string of bits that represents the
	    // number of characters that are being encoded.
	    // The character count indicator must be placed after the mode indicator
	    // and must be a certain number of bits long, depending on the QR version
	    // and data mode
	    // @see {@link Mode.getCharCountIndicator}.
	    buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));

	    // add binary data sequence to buffer
	    data.write(buffer);
	  });

	  // Calculate required number of bits
	  const totalCodewords = Utils.getSymbolTotalCodewords(version);
	  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
	  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

	  // Add a terminator.
	  // If the bit string is shorter than the total number of required bits,
	  // a terminator of up to four 0s must be added to the right side of the string.
	  // If the bit string is more than four bits shorter than the required number of bits,
	  // add four 0s to the end.
	  if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
	    buffer.put(0, 4);
	  }

	  // If the bit string is fewer than four bits shorter, add only the number of 0s that
	  // are needed to reach the required number of bits.

	  // After adding the terminator, if the number of bits in the string is not a multiple of 8,
	  // pad the string on the right with 0s to make the string's length a multiple of 8.
	  while (buffer.getLengthInBits() % 8 !== 0) {
	    buffer.putBit(0);
	  }

	  // Add pad bytes if the string is still shorter than the total number of required bits.
	  // Extend the buffer to fill the data capacity of the symbol corresponding to
	  // the Version and Error Correction Level by adding the Pad Codewords 11101100 (0xEC)
	  // and 00010001 (0x11) alternately.
	  const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
	  for (let i = 0; i < remainingByte; i++) {
	    buffer.put(i % 2 ? 0x11 : 0xEC, 8);
	  }

	  return createCodewords(buffer, version, errorCorrectionLevel)
	}

	/**
	 * Encode input data with Reed-Solomon and return codewords with
	 * relative error correction bits
	 *
	 * @param  {BitBuffer} bitBuffer            Data to encode
	 * @param  {Number}    version              QR Code version
	 * @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
	 * @return {Uint8Array}                     Buffer containing encoded codewords
	 */
	function createCodewords (bitBuffer, version, errorCorrectionLevel) {
	  // Total codewords for this QR code version (Data + Error correction)
	  const totalCodewords = Utils.getSymbolTotalCodewords(version);

	  // Total number of error correction codewords
	  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

	  // Total number of data codewords
	  const dataTotalCodewords = totalCodewords - ecTotalCodewords;

	  // Total number of blocks
	  const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);

	  // Calculate how many blocks each group should contain
	  const blocksInGroup2 = totalCodewords % ecTotalBlocks;
	  const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;

	  const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);

	  const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
	  const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;

	  // Number of EC codewords is the same for both groups
	  const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;

	  // Initialize a Reed-Solomon encoder with a generator polynomial of degree ecCount
	  const rs = new ReedSolomonEncoder(ecCount);

	  let offset = 0;
	  const dcData = new Array(ecTotalBlocks);
	  const ecData = new Array(ecTotalBlocks);
	  let maxDataSize = 0;
	  const buffer = new Uint8Array(bitBuffer.buffer);

	  // Divide the buffer into the required number of blocks
	  for (let b = 0; b < ecTotalBlocks; b++) {
	    const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;

	    // extract a block of data from buffer
	    dcData[b] = buffer.slice(offset, offset + dataSize);

	    // Calculate EC codewords for this data block
	    ecData[b] = rs.encode(dcData[b]);

	    offset += dataSize;
	    maxDataSize = Math.max(maxDataSize, dataSize);
	  }

	  // Create final data
	  // Interleave the data and error correction codewords from each block
	  const data = new Uint8Array(totalCodewords);
	  let index = 0;
	  let i, r;

	  // Add data codewords
	  for (i = 0; i < maxDataSize; i++) {
	    for (r = 0; r < ecTotalBlocks; r++) {
	      if (i < dcData[r].length) {
	        data[index++] = dcData[r][i];
	      }
	    }
	  }

	  // Apped EC codewords
	  for (i = 0; i < ecCount; i++) {
	    for (r = 0; r < ecTotalBlocks; r++) {
	      data[index++] = ecData[r][i];
	    }
	  }

	  return data
	}

	/**
	 * Build QR Code symbol
	 *
	 * @param  {String} data                 Input string
	 * @param  {Number} version              QR Code version
	 * @param  {ErrorCorretionLevel} errorCorrectionLevel Error level
	 * @param  {MaskPattern} maskPattern     Mask pattern
	 * @return {Object}                      Object containing symbol data
	 */
	function createSymbol (data, version, errorCorrectionLevel, maskPattern) {
	  let segments;

	  if (Array.isArray(data)) {
	    segments = Segments.fromArray(data);
	  } else if (typeof data === 'string') {
	    let estimatedVersion = version;

	    if (!estimatedVersion) {
	      const rawSegments = Segments.rawSplit(data);

	      // Estimate best version that can contain raw splitted segments
	      estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
	    }

	    // Build optimized segments
	    // If estimated version is undefined, try with the highest version
	    segments = Segments.fromString(data, estimatedVersion || 40);
	  } else {
	    throw new Error('Invalid data')
	  }

	  // Get the min version that can contain data
	  const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);

	  // If no version is found, data cannot be stored
	  if (!bestVersion) {
	    throw new Error('The amount of data is too big to be stored in a QR Code')
	  }

	  // If not specified, use min version as default
	  if (!version) {
	    version = bestVersion;

	  // Check if the specified version can contain the data
	  } else if (version < bestVersion) {
	    throw new Error('\n' +
	      'The chosen QR Code version cannot contain this amount of data.\n' +
	      'Minimum version required to store current data is: ' + bestVersion + '.\n'
	    )
	  }

	  const dataBits = createData(version, errorCorrectionLevel, segments);

	  // Allocate matrix buffer
	  const moduleCount = Utils.getSymbolSize(version);
	  const modules = new BitMatrix(moduleCount);

	  // Add function modules
	  setupFinderPattern(modules, version);
	  setupTimingPattern(modules);
	  setupAlignmentPattern(modules, version);

	  // Add temporary dummy bits for format info just to set them as reserved.
	  // This is needed to prevent these bits from being masked by {@link MaskPattern.applyMask}
	  // since the masking operation must be performed only on the encoding region.
	  // These blocks will be replaced with correct values later in code.
	  setupFormatInfo(modules, errorCorrectionLevel, 0);

	  if (version >= 7) {
	    setupVersionInfo(modules, version);
	  }

	  // Add data codewords
	  setupData(modules, dataBits);

	  if (isNaN(maskPattern)) {
	    // Find best mask pattern
	    maskPattern = MaskPattern.getBestMask(modules,
	      setupFormatInfo.bind(null, modules, errorCorrectionLevel));
	  }

	  // Apply mask pattern
	  MaskPattern.applyMask(maskPattern, modules);

	  // Replace format info bits with correct values
	  setupFormatInfo(modules, errorCorrectionLevel, maskPattern);

	  return {
	    modules: modules,
	    version: version,
	    errorCorrectionLevel: errorCorrectionLevel,
	    maskPattern: maskPattern,
	    segments: segments
	  }
	}

	/**
	 * QR Code
	 *
	 * @param {String | Array} data                 Input data
	 * @param {Object} options                      Optional configurations
	 * @param {Number} options.version              QR Code version
	 * @param {String} options.errorCorrectionLevel Error correction level
	 * @param {Function} options.toSJISFunc         Helper func to convert utf8 to sjis
	 */
	qrcode.create = function create (data, options) {
	  if (typeof data === 'undefined' || data === '') {
	    throw new Error('No input text')
	  }

	  let errorCorrectionLevel = ECLevel.M;
	  let version;
	  let mask;

	  if (typeof options !== 'undefined') {
	    // Use higher error correction level as default
	    errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
	    version = Version.from(options.version);
	    mask = MaskPattern.from(options.maskPattern);

	    if (options.toSJISFunc) {
	      Utils.setToSJISFunction(options.toSJISFunc);
	    }
	  }

	  return createSymbol(data, version, errorCorrectionLevel, mask)
	};
	return qrcode;
}

var canvas = {};

var utils = {};

var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;
	(function (exports$1) {
		function hex2rgba (hex) {
		  if (typeof hex === 'number') {
		    hex = hex.toString();
		  }

		  if (typeof hex !== 'string') {
		    throw new Error('Color should be defined as hex string')
		  }

		  let hexCode = hex.slice().replace('#', '').split('');
		  if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
		    throw new Error('Invalid hex color: ' + hex)
		  }

		  // Convert from short to long form (fff -> ffffff)
		  if (hexCode.length === 3 || hexCode.length === 4) {
		    hexCode = Array.prototype.concat.apply([], hexCode.map(function (c) {
		      return [c, c]
		    }));
		  }

		  // Add default alpha value
		  if (hexCode.length === 6) hexCode.push('F', 'F');

		  const hexValue = parseInt(hexCode.join(''), 16);

		  return {
		    r: (hexValue >> 24) & 255,
		    g: (hexValue >> 16) & 255,
		    b: (hexValue >> 8) & 255,
		    a: hexValue & 255,
		    hex: '#' + hexCode.slice(0, 6).join('')
		  }
		}

		exports$1.getOptions = function getOptions (options) {
		  if (!options) options = {};
		  if (!options.color) options.color = {};

		  const margin = typeof options.margin === 'undefined' ||
		    options.margin === null ||
		    options.margin < 0
		    ? 4
		    : options.margin;

		  const width = options.width && options.width >= 21 ? options.width : undefined;
		  const scale = options.scale || 4;

		  return {
		    width: width,
		    scale: width ? 4 : scale,
		    margin: margin,
		    color: {
		      dark: hex2rgba(options.color.dark || '#000000ff'),
		      light: hex2rgba(options.color.light || '#ffffffff')
		    },
		    type: options.type,
		    rendererOpts: options.rendererOpts || {}
		  }
		};

		exports$1.getScale = function getScale (qrSize, opts) {
		  return opts.width && opts.width >= qrSize + opts.margin * 2
		    ? opts.width / (qrSize + opts.margin * 2)
		    : opts.scale
		};

		exports$1.getImageWidth = function getImageWidth (qrSize, opts) {
		  const scale = exports$1.getScale(qrSize, opts);
		  return Math.floor((qrSize + opts.margin * 2) * scale)
		};

		exports$1.qrToImageData = function qrToImageData (imgData, qr, opts) {
		  const size = qr.modules.size;
		  const data = qr.modules.data;
		  const scale = exports$1.getScale(size, opts);
		  const symbolSize = Math.floor((size + opts.margin * 2) * scale);
		  const scaledMargin = opts.margin * scale;
		  const palette = [opts.color.light, opts.color.dark];

		  for (let i = 0; i < symbolSize; i++) {
		    for (let j = 0; j < symbolSize; j++) {
		      let posDst = (i * symbolSize + j) * 4;
		      let pxColor = opts.color.light;

		      if (i >= scaledMargin && j >= scaledMargin &&
		        i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
		        const iSrc = Math.floor((i - scaledMargin) / scale);
		        const jSrc = Math.floor((j - scaledMargin) / scale);
		        pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
		      }

		      imgData[posDst++] = pxColor.r;
		      imgData[posDst++] = pxColor.g;
		      imgData[posDst++] = pxColor.b;
		      imgData[posDst] = pxColor.a;
		    }
		  }
		}; 
	} (utils));
	return utils;
}

var hasRequiredCanvas;

function requireCanvas () {
	if (hasRequiredCanvas) return canvas;
	hasRequiredCanvas = 1;
	(function (exports$1) {
		const Utils = requireUtils();

		function clearCanvas (ctx, canvas, size) {
		  ctx.clearRect(0, 0, canvas.width, canvas.height);

		  if (!canvas.style) canvas.style = {};
		  canvas.height = size;
		  canvas.width = size;
		  canvas.style.height = size + 'px';
		  canvas.style.width = size + 'px';
		}

		function getCanvasElement () {
		  try {
		    return document.createElement('canvas')
		  } catch (e) {
		    throw new Error('You need to specify a canvas element')
		  }
		}

		exports$1.render = function render (qrData, canvas, options) {
		  let opts = options;
		  let canvasEl = canvas;

		  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
		    opts = canvas;
		    canvas = undefined;
		  }

		  if (!canvas) {
		    canvasEl = getCanvasElement();
		  }

		  opts = Utils.getOptions(opts);
		  const size = Utils.getImageWidth(qrData.modules.size, opts);

		  const ctx = canvasEl.getContext('2d');
		  const image = ctx.createImageData(size, size);
		  Utils.qrToImageData(image.data, qrData, opts);

		  clearCanvas(ctx, canvasEl, size);
		  ctx.putImageData(image, 0, 0);

		  return canvasEl
		};

		exports$1.renderToDataURL = function renderToDataURL (qrData, canvas, options) {
		  let opts = options;

		  if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
		    opts = canvas;
		    canvas = undefined;
		  }

		  if (!opts) opts = {};

		  const canvasEl = exports$1.render(qrData, canvas, opts);

		  const type = opts.type || 'image/png';
		  const rendererOpts = opts.rendererOpts || {};

		  return canvasEl.toDataURL(type, rendererOpts.quality)
		}; 
	} (canvas));
	return canvas;
}

var svgTag = {};

var hasRequiredSvgTag;

function requireSvgTag () {
	if (hasRequiredSvgTag) return svgTag;
	hasRequiredSvgTag = 1;
	const Utils = requireUtils();

	function getColorAttrib (color, attrib) {
	  const alpha = color.a / 255;
	  const str = attrib + '="' + color.hex + '"';

	  return alpha < 1
	    ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"'
	    : str
	}

	function svgCmd (cmd, x, y) {
	  let str = cmd + x;
	  if (typeof y !== 'undefined') str += ' ' + y;

	  return str
	}

	function qrToPath (data, size, margin) {
	  let path = '';
	  let moveBy = 0;
	  let newRow = false;
	  let lineLength = 0;

	  for (let i = 0; i < data.length; i++) {
	    const col = Math.floor(i % size);
	    const row = Math.floor(i / size);

	    if (!col && !newRow) newRow = true;

	    if (data[i]) {
	      lineLength++;

	      if (!(i > 0 && col > 0 && data[i - 1])) {
	        path += newRow
	          ? svgCmd('M', col + margin, 0.5 + row + margin)
	          : svgCmd('m', moveBy, 0);

	        moveBy = 0;
	        newRow = false;
	      }

	      if (!(col + 1 < size && data[i + 1])) {
	        path += svgCmd('h', lineLength);
	        lineLength = 0;
	      }
	    } else {
	      moveBy++;
	    }
	  }

	  return path
	}

	svgTag.render = function render (qrData, options, cb) {
	  const opts = Utils.getOptions(options);
	  const size = qrData.modules.size;
	  const data = qrData.modules.data;
	  const qrcodesize = size + opts.margin * 2;

	  const bg = !opts.color.light.a
	    ? ''
	    : '<path ' + getColorAttrib(opts.color.light, 'fill') +
	      ' d="M0 0h' + qrcodesize + 'v' + qrcodesize + 'H0z"/>';

	  const path =
	    '<path ' + getColorAttrib(opts.color.dark, 'stroke') +
	    ' d="' + qrToPath(data, size, opts.margin) + '"/>';

	  const viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"';

	  const width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '" ';

	  const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + '</svg>\n';

	  if (typeof cb === 'function') {
	    cb(null, svgTag);
	  }

	  return svgTag
	};
	return svgTag;
}

var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser;
	hasRequiredBrowser = 1;
	const canPromise = requireCanPromise();

	const QRCode = requireQrcode();
	const CanvasRenderer = requireCanvas();
	const SvgRenderer = requireSvgTag();

	function renderCanvas (renderFunc, canvas, text, opts, cb) {
	  const args = [].slice.call(arguments, 1);
	  const argsNum = args.length;
	  const isLastArgCb = typeof args[argsNum - 1] === 'function';

	  if (!isLastArgCb && !canPromise()) {
	    throw new Error('Callback required as last argument')
	  }

	  if (isLastArgCb) {
	    if (argsNum < 2) {
	      throw new Error('Too few arguments provided')
	    }

	    if (argsNum === 2) {
	      cb = text;
	      text = canvas;
	      canvas = opts = undefined;
	    } else if (argsNum === 3) {
	      if (canvas.getContext && typeof cb === 'undefined') {
	        cb = opts;
	        opts = undefined;
	      } else {
	        cb = opts;
	        opts = text;
	        text = canvas;
	        canvas = undefined;
	      }
	    }
	  } else {
	    if (argsNum < 1) {
	      throw new Error('Too few arguments provided')
	    }

	    if (argsNum === 1) {
	      text = canvas;
	      canvas = opts = undefined;
	    } else if (argsNum === 2 && !canvas.getContext) {
	      opts = text;
	      text = canvas;
	      canvas = undefined;
	    }

	    return new Promise(function (resolve, reject) {
	      try {
	        const data = QRCode.create(text, opts);
	        resolve(renderFunc(data, canvas, opts));
	      } catch (e) {
	        reject(e);
	      }
	    })
	  }

	  try {
	    const data = QRCode.create(text, opts);
	    cb(null, renderFunc(data, canvas, opts));
	  } catch (e) {
	    cb(e);
	  }
	}

	browser.create = QRCode.create;
	browser.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
	browser.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);

	// only svg for now.
	browser.toString = renderCanvas.bind(null, function (data, _, opts) {
	  return SvgRenderer.render(data, opts)
	});
	return browser;
}

var browserExports = requireBrowser();
const QRCode = /*@__PURE__*/getDefaultExportFromCjs(browserExports);

otplibExports.authenticator.options = { window: 1 };
const STORAGE_KEY = "device_totp_secret";
const generateSetup = async (accountName = "GravityWallet") => {
  const secret = otplibExports.authenticator.generateSecret();
  const otpauth = otplibExports.authenticator.keyuri(accountName, "Gravity Wallet", secret);
  try {
    const qrCode = await QRCode.toDataURL(otpauth);
    return { secret, qrCode };
  } catch (err) {
    console.error("QR Gen Error:", err);
    throw err;
  }
};
const verifyTOTP = (token, secret) => {
  try {
    return otplibExports.authenticator.check(token, secret);
  } catch (e) {
    return false;
  }
};
const saveTOTPSecret = async (secret) => {
  const storedValue = btoa(secret);
  if (typeof chrome !== "undefined" && chrome.storage) {
    await chrome.storage.local.set({ [STORAGE_KEY]: storedValue });
  } else {
    localStorage.setItem(STORAGE_KEY, storedValue);
  }
};
const getTOTPSecret = async () => {
  let val;
  if (typeof chrome !== "undefined" && chrome.storage) {
    const res = await chrome.storage.local.get([STORAGE_KEY]);
    val = res[STORAGE_KEY];
  } else {
    val = localStorage.getItem(STORAGE_KEY);
  }
  if (!val) return null;
  try {
    return atob(val);
  } catch (e) {
    return val;
  }
};
const hasTOTPConfigured = async () => {
  const secret = await getTOTPSecret();
  return !!secret;
};

const calculatePasswordStrength = (password) => {
  let score = 0;
  if (!password) return 0;
  if (password.length > 8) score += 1;
  if (password.length > 12) score += 1;
  if (/[A-Z]/.test(password)) score += 0.5;
  if (/[0-9]/.test(password)) score += 0.5;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.floor(Math.min(4, score));
};
const getStrengthLabel = (score) => {
  switch (score) {
    case 0:
    case 1:
      return { label: "Weak", color: "bg-red-500" };
    case 2:
      return { label: "Medium", color: "bg-yellow-500" };
    case 3:
      return { label: "Strong", color: "bg-green-500" };
    case 4:
      return { label: "Very Strong", color: "bg-emerald-500" };
    default:
      return { label: "Weak", color: "bg-slate-500" };
  }
};

const LanguageContext = reactExports.createContext(void 0);
const translations = {
  en: {
    "landing.welcome": "Welcome Back",
    "landing.subtitle": "Select a network to manage your assets",
    "landing.manage_keys": "Manage Keys",
    "landing.dapp_browser": "dApp Browser",
    "wallet.active_key_tooltip": "Active Key Present",
    "wallet.posting_key_tooltip": "Posting Key Present",
    "wallet.refresh_tooltip": "Refresh Balances",
    "wallet.send": "Send",
    "wallet.receive": "Receive",
    "wallet.history": "History",
    "wallet.keys": "Keys",
    "wallet.network_label": "Active Network",
    "bulk.analyze": "Analyze Security",
    "bulk.analyzing": "Analyzing...",
    "bulk.success": "Analysis: No risks found.",
    "bulk.switch_network": "Switch Network",
    // Sidebar
    "sidebar.home": "Home",
    "sidebar.wallet": "Wallet",
    "sidebar.bulk": "Bulk Transfers",
    "sidebar.multisig": "MultiSig",
    "sidebar.manage": "Settings",
    "sidebar.pair": "Pair Phone",
    "sidebar.lock": "Lock Wallet",
    "sidebar.pin": "Detach Window",
    "sidebar.dock": "Dock Window",
    // Actions
    "action.select_network": "Select Network",
    "action.manage_keys": "Manage Keys",
    // Header
    "header.add": "Add Account",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.confirm_operation": "Confirm Operation",
    "common.close": "Close",
    "common.processing": "Processing...",
    "common.recent_recipients": "Recent Recipients",
    "common.account_not_found": "Account not found",
    // Import
    "import.title": "Import Wallet",
    "import.manual": "Manual Entry",
    "import.file": "Upload File",
    "import.select_chain": "Select Chain",
    "import.username": "Username",
    "import.checking": "Checking chain...",
    "import.found": "✓ Found on Chain",
    "import.not_found": "Account not found",
    "import.private_keys": "Private Keys (Paste at least one)",
    "import.key_posting": "POSTING KEY",
    "import.key_active": "ACTIVE KEY",
    "import.key_memo": "MEMO KEY",
    "import.invalid_format": "Invalid Format",
    "import.save": "Save Account",
    "import.verifying": "Verifying Keys...",
    "import.placeholder_username": "username",
    "import.placeholder_key": "Starts with 5...",
    // Settings
    "settings.title": "Configure your wallet",
    "settings.accounts_title": "Managed Accounts",
    "settings.remove": "Remove",
    "settings.add_new": "Add New Account",
    "settings.no_accounts": "No accounts found.",
    "settings.security_title": "Security",
    "settings.change_password": "Change Access Password",
    "settings.biometrics": "Use Biometrics",
    "settings.reset": "Reset Wallet",
    "pair.section_title": "Pair Another Device",
    "pair.section_subtitle": "On the new device, generate a receive code. On the current device, enter that code and approve the encrypted transfer.",
    "pair.send_cta": "Send To New Device",
    "pair.receive_cta": "Get Receive Code",
    "pair.step_badge_send": "Step 2 of 2",
    "pair.step_badge_receive": "Step 1 of 2",
    "pair.send_title": "Send to Another Device",
    "pair.send_subtitle": "Enter the receive code shown on the destination device. Nothing is sent until you confirm it here.",
    "pair.receive_title": "Receive on This Device",
    "pair.receive_subtitle": "On your current device, keep this code visible. On the device that already has the wallet, choose send and enter this code there.",
    "pair.code_label": "Receive code",
    "pair.copy_code": "Copy Code",
    "pair.preparing": "Preparing secure session...",
    "pair.waiting_source": "Waiting for source device...",
    "pair.importing": "Receiving and importing encrypted wallet...",
    "pair.receive_complete": "Import Complete",
    "pair.receive_success_message": "Wallet received successfully. Imported {count} accounts.",
    "pair.transfer_error": "Transfer Error",
    "pair.receive_error": "Unable to receive data",
    "pair.accounts_label": "Accounts",
    "pair.settings_label": "Settings",
    "pair.chat_identity_label": "Chat identity",
    "pair.included": "Included",
    "pair.basic_only": "Basic only",
    "pair.not_found": "Not found",
    "pair.pair_devices": "Pair Devices",
    "pair.waiting_handshake": "Waiting for secure handshake...",
    "pair.approve_and_send": "Approve and Send",
    "pair.sending": "Encrypting and sending wallet...",
    "pair.send_complete": "Transfer Complete",
    "pair.send_complete_subtitle": "The destination device can import the wallet now.",
    "pair.connect_error": "Unable to pair with target device",
    "pair.send_error": "Unable to send encrypted wallet",
    "pair.e2ee_notice": "This device never exposes the private data in plain text.",
    "pair.e2ee_transfer": "End-to-end encrypted manual transfer",
    // MultiSig
    "multisig.title": "MultiSig Wallet",
    "multisig.initiator": "Initiator",
    "multisig.threshold": "Threshold",
    "multisig.signers": "Signers",
    "multisig.proposal": "Proposal",
    "multisig.expiration": "Expiration",
    "multisig.create": "Create Proposal",
    "multisig.approve": "Approve",
    "multisig.construction_title": "Under Construction...",
    "multisig.construction_desc": "We are currently building this feature to ensure maximum security and functionality.",
    "multisig.progress_title": "Multisig Authorization Progress",
    "multisig.status_ready": "Ready to Broadcast",
    "multisig.status_collecting": "Collecting Signatures",
    "multisig.weight_label": "Weight",
    "multisig.threshold_label": "Threshold",
    "multisig.authorities_title": "Required Authorities",
    "multisig.you_label": "(YOU)",
    "multisig.how_it_works": '💡 **How it works:** This account is protected by Multiple Signatures. Each signer has a specific "Weight". Once the total weight reaches the "Threshold" of {threshold}, the transaction can be officially broadcasted to the blockchain.',
    "multisig.success_done": "Transaction Completed!",
    "multisig.reuse": "Reuse",
    "multisig.header_desc": "Build a multisig proposal draft and inspect the live account authority before coordinating signatures.",
    "multisig.alpha_badge": "Alpha",
    "multisig.blurt_only": "MultiSig sync is currently implemented only for {chain}.",
    "multisig.supported_chains": "MultiSig sync is currently implemented for {chains}.",
    "multisig.incoming_title": "Incoming proposals",
    "multisig.incoming_desc": "Review on-chain proposal updates before they enter your local multisig tray.",
    "multisig.incoming_empty": "No pending incoming multisig proposals.",
    "multisig.incoming_from": "From @{user}",
    "multisig.coordination_target": "Coordination target",
    "multisig.accept": "Accept",
    "multisig.reject": "Reject",
    "multisig.coordination_hint": "Coordination requires all selected signers in this draft.",
    "multisig.expiration_hint": "Direct multisig transactions should stay within about {minutes} minutes.",
    "multisig.expiration_hint_practical": "This is the expiration of the signed transaction itself. If it expires before the final broadcast, signatures must be collected again.",
    "multisig.threshold_hint_onchain": "Visible only because this account already exposes a multisig authority on-chain.",
    "multisig.authority_loading": "Inspecting live active authority...",
    "multisig.authority_ready_desc": "On-chain threshold {threshold}. Account auths and keys below are the real source of truth.",
    "multisig.authority_single_desc": "This account signs normally on-chain with a single active authority. Your practical multisig coordination still happens above at the draft level.",
    "multisig.authority_ready_badge": "Ready",
    "multisig.authority_single_badge": "Single Signer",
    "multisig.authority_no_accounts": "No account-based signers defined on-chain.",
    "multisig.authority_reference_hint": "This is a reference view of the live on-chain authority for the initiator account. It does not change the coordination quorum of this draft.",
    "multisig.username_placeholder": "username",
    "multisig.add": "Add",
    "multisig.signers_empty": "No proposal signers selected yet.",
    "multisig.target_account": "Target account",
    "multisig.target_default": "Default: @{user}",
    "multisig.amount_vests": "Amount (VESTS)",
    "multisig.amount_chain": "Amount ({chain})",
    "multisig.undelegate_hint": "This proposal will undelegate the full power delegation from the selected account by setting the delegation amount to zero.",
    "multisig.memo": "Memo",
    "multisig.memo_placeholder": "Optional note",
    "multisig.generated": "Generated",
    "multisig.draft_desc": "Export this JSON to coordinate signatures manually while we finish the full multisig transport flow.",
    "multisig.copied": "Copied",
    "multisig.copy": "Copy",
    "multisig.saved_title": "Saved proposals",
    "multisig.saved_desc": "Keep local drafts here while the wallet syncs signer updates from on-chain multisig events.",
    "multisig.refresh_chain": "Refresh from chain",
    "multisig.refreshing_chain": "Refreshing...",
    "multisig.proposal_label": "Proposal label",
    "multisig.save": "Save",
    "multisig.saved_empty": "No saved multisig proposals yet.",
    "multisig.signers_count": "signers",
    "multisig.required_signers": "Required signers",
    "multisig.coordination": "Coordination",
    "multisig.on_chain": "On-chain",
    "multisig.threshold_mismatch": "Draft coordination threshold differs from current on-chain authority threshold.",
    "multisig.signed_by": "Signed by",
    "multisig.broadcasted_tx": "Broadcasted",
    "multisig.timeline_title": "Proposal history",
    "multisig.timeline_empty": "No history yet.",
    "multisig.timeline_created": "Created",
    "multisig.timeline_signed": "Signed",
    "multisig.timeline_broadcasted": "Broadcasted",
    "multisig.timeline_expired": "Expired",
    "multisig.status_pending": "Pending Signatures",
    "multisig.status_broadcasted": "Broadcasted",
    "multisig.status_expired": "Expired",
    "multisig.load": "Load",
    "multisig.delete": "Delete",
    "multisig.signed": "Signed",
    "multisig.sign": "Sign",
    "multisig.no_local_signer": "No local signer",
    "multisig.signer_unavailable": "Unavailable",
    "multisig.delete_initiator_only": "Only the initiator can delete this proposal from every device.",
    "multisig.validation_hint": "Complete the required fields marked with * before saving.",
    "multisig.validation_required": "Fill in the required fields before saving this proposal.",
    "multisig.broadcast": "Broadcast",
    "multisig.import_desc": "Paste a shared proposal package here to import it into this device.",
    "multisig.import_package": "Import package",
    "multisig.sync_refreshed": "Synced from chain.",
    "multisig.sync_no_updates": "No new on-chain multisig updates found.",
    "multisig.sync_failed": "Failed to refresh multisig updates from chain.",
    "multisig.expired_at": "Expired at",
    "multisig.sign_expired_blocked": "This proposal has expired. Reuse it to generate a fresh one.",
    "multisig.broadcast_expired_blocked": "This proposal has expired. Reuse it to generate a fresh one.",
    "multisig.op_transfer": "Transfer",
    "multisig.op_delegate": "Delegate Power",
    "multisig.op_undelegate": "Undelegate Power",
    "multisig.op_powerup": "Power Up",
    "multisig.no_accounts": "No {chain} accounts imported",
    "multisig.operation_preview": "Operation preview",
    "multisig.proposal_draft": "Proposal draft",
    "multisig.create_section": "Create proposal",
    "multisig.create_desc": "Build the proposal here, then save it to start collecting signatures.",
    "multisig.jump_active": "Go to active proposal",
    "multisig.preview_collapsed": "Collapsed by default to keep the form clean.",
    "multisig.preview_expanded": "Raw operation payload visible for review.",
    "multisig.draft_collapsed": "Collapsed by default to keep attention on active proposals.",
    "multisig.draft_expanded": "Raw draft JSON visible for manual review and export.",
    "multisig.broadcasted_details": "Broadcasted proposal details",
    "multisig.broadcasted_collapsed": "Collapsed by default after successful broadcast.",
    "multisig.broadcasted_expanded": "Full history and actions visible.",
    "multisig.hide_broadcasted_details": "Hide",
    // Bulk
    "bulk.title": "Bulk Transfer",
    "bulk.recipients": "Recipients",
    "bulk.count": "Count",
    "bulk.check": "Check Validity",
    "bulk.checking": "Checking...",
    "bulk.amount": "Amount",
    "bulk.memo": "Memo",
    "bulk.same_amount": "Same Amount",
    "bulk.diff_amount": "Different Amounts",
    "bulk.add_row": "+ Add Row",
    "bulk.verify": "Verify",
    "bulk.import": "Import CSV/TXT",
    "bulk.total": "Total",
    "bulk.sign_broadcast": "Sign & Broadcast",
    "bulk.no_accounts": "No {chain} accounts found.",
    "bulk.sending_from": "Sending from",
    "bulk.asset": "Asset:",
    "bulk.available": "Available:",
    "bulk.title_single": "Same Amount Distribution",
    "bulk.title_multi": "Multi-Amount Distribution",
    "bulk.validation_error": "Validation Error",
    "bulk.error_remove_invalid": "Please remove invalid accounts before sending.",
    "bulk.success_title": "Success!",
    "bulk.success_msg": "Sent {n} transfers successfully. TXID: {txid}...",
    "bulk.error_title": "Error",
    "bulk.error_failed": "Failed to send",
    "bulk.warn_not_found": "⚠ Warning: {n} username(s) not found on {chain} chain.",
    "bulk.error_no_active": "Active key not found for this account.",
    // Lock Screen
    "lock.title": "Welcome Back",
    "lock.unlock": "Unlock Wallet",
    "lock.password_placeholder": "Enter Password",
    "lock.pin_placeholder": "Enter 6-digit PIN",
    "lock.use_pin": "Use PIN",
    "lock.use_password": "Use Password",
    "lock.biometrics": "Unlock with Biometrics",
    "lock.reset": "Reset Wallet",
    "lock.confirm_reset": "Are you sure? This will wipe all data!",
    "lock.create_title": "Create Master Password",
    "lock.unlock_title": "Unlock Your Wallet",
    "lock.create_btn": "Create Wallet",
    "lock.unlock_btn": "Unlock",
    "lock.processing": "Processing...",
    "lock.placeholder_create": "Set Master Password",
    "lock.placeholder_enter": "Enter Master Password",
    "lock.error_length": "Password must be at least 8 characters",
    "lock.or_sign_up": "Or sign up with",
    "lock.or_unlock": "Or unlock with",
    "lock.clear_reset": "Clear Local Data & Reset",
    "lock.session_expired": "Session expired. Please unlock to save changes.",
    "lock.confirm_password": "Confirm Password",
    "lock.passwords_not_match": "Passwords do not match",
    "lock.weak": "Weak",
    "lock.medium": "Medium",
    "lock.strong": "Strong",
    "lock.very_strong": "Very Strong",
    "lock.security_strength": "Security",
    "lock.signup": "Sign Up",
    "lock.unlock_label": "Unlock",
    "lock.google": "Google",
    "lock.device": "DeviceKey",
    "lock.2fa": "2FA Auth",
    "lock.secure_by_design": "Secure By Design",
    "lock.google_title": "Setup wallet using Google OAuth",
    "lock.device_title": "Setup wallet using local hardware keys",
    "lock.google_unlock_title": "Unlock with Google",
    "lock.device_unlock_title": "Unlock with Device Key",
    "lock.error_incorrect_password": "Incorrect password",
    "lock.error_totp_not_configured": "Authenticator not configured. Please unlock with password and configure it in Settings.",
    "lock.error_setup_failed": "Failed to initialize passwordless wallet.",
    "lock.error_decrypt_failed": "Could not decrypt data (Invalid {method} Key).",
    "lock.error_no_auth_data": "No {method} Auth data found. Use Password.",
    "lock.connecting_google": "Connecting to Google...",
    "lock.error_auth_failed": "{method} authentication failed",
    "lock.error_config_missing": "Configuration Error (Secret missing)",
    "lock.totp_verified_pin": "TOTP Verified. Enter PIN.",
    "lock.error_no_key_after_totp": "No secure key found after TOTP.",
    "lock.error_invalid_code": "Invalid Code",
    "lock.error_init_pin_failed": "Failed to initialize PIN wallet.",
    "lock.error_decryption_corrupt": "Decryption failed (Corrupt Vault?)",
    "lock.error_incorrect_pin": "Incorrect PIN",
    // Chat
    "chat.title": "Gravity Messenger",
    "chat.status_connected": "Online",
    "chat.status_connecting": "Connecting...",
    "chat.status_disconnected": "Offline",
    "chat.placeholder_username": "Choose a username...",
    "chat.btn_join": "Join Chat",
    "chat.btn_logout": "Logout",
    "chat.rooms": "Rooms",
    "chat.search": "Search users...",
    "chat.no_rooms": "No rooms found",
    "chat.lobby": "Global Lobby",
    "chat.create_room": "Create Room",
    "chat.room_name": "Room Name",
    "chat.private": "Private Room",
    "chat.btn_create": "Create",
    "chat.invite_user": "Invite User",
    "chat.invited_to": "You were invited to {room}",
    "chat.message_placeholder": "Type a message...",
    "chat.clear_identity": "Clear Stalled Identity",
    "chat.room_participants": "Participants",
    "chat.no_messages": "No messages yet. Say hello!",
    "chat.invite_placeholder": "Username to invite...",
    "chat.btn_invite": "Invite",
    "chat.confirm_delete": "Delete room?",
    "chat.confirm_kick": "Kick user?",
    "chat.confirm_ban": "Ban user?",
    "chat.btn_confirm": "Confirm",
    "chat.btn_cancel": "Cancel",
    "chat.error_reg_failed": "Registration failed",
    "chat.owner_label": "Owner",
    // Manage Account
    "manage.title": "Manage Account",
    "manage.subtitle": "@{name} • {chain}",
    "manage.invalid_posting": "Invalid Posting Key format",
    "manage.invalid_active": "Invalid Active Key format",
    "manage.invalid_memo": "Invalid Memo Key format",
    "manage.validating": "Validating Keys...",
    "manage.save_verify": "Save & Verify",
    "manage.remove_link": "Remove Account",
    "manage.verify_fail": "Key Validation Failed: ",
    "manage.success": "Account verified and saved!",
    "manage.confirm_remove_title": "Remove @{name}?",
    "manage.confirm_remove_desc": "This will remove the account keys. Cannot be undone.",
    "manage.cancel": "Cancel",
    "manage.confirm_remove": "Remove",
    "manage.add_posting": "Add Posting Private Key",
    "manage.add_active": "Add Active Private Key",
    "manage.add_memo": "Add Memo Private Key",
    // New Import Keys
    "import.success_file_parsed": "File parsed. Accounts found: ",
    "import.error_file_read": "Error reading file.",
    "import.drag_drop": "Drag & Drop JSON/CSV/TXT file",
    "import.click_upload": "or click to upload",
    "import.processing": "Processing...",
    "import.bulk_summary": "Imported {count} accounts.",
    "import.no_valid_accounts": "No valid accounts found in file.",
    // Security
    "security.analysis_prompt": "Please analyze this crypto transaction for safety risks in English: ",
    "history.title": "History: {user}",
    "history.loading": "Loading history...",
    "history.empty": "No transfers found in recent history.",
    "history.received": "Received",
    "history.sent": "Sent",
    "history.from": "From",
    "history.to": "To",
    "history.filter_label": "Filter",
    "history.filter_all": "All",
    "history.filter_received": "Received",
    "history.filter_sent": "Sent",
    "history.filter_powerup": "Power Up",
    "history.filter_powerdown": "Power Down",
    "history.type_powerup_in": "Received Power",
    "history.type_powerup_out": "Sent Power",
    "history.type_powerdown": "Power Down",
    // Sign Request
    "sign.title": "Signature Request",
    "sign.transfer_title": "Transfer Request",
    "sign.vote_title": "Vote Request",
    "sign.custom_json_title": "Custom JSON",
    "sign.operation": "Operation",
    "sign.params": "Parameters",
    "sign.author": "Author",
    "sign.weight": "Weight",
    "sign.id": "ID",
    "sign.json_payload": "Payload",
    "sign.from": "From",
    "sign.to": "To",
    "sign.reject": "Reject",
    "sign.confirm": "Confirm",
    "sign.signing": "Signing...",
    "sign.local_file": "Local File",
    "sign.unknown_source": "Unknown Source",
    "sign.loading": "Loading request...",
    "sign.error": "Error",
    "sign.account_not_found": "Account not found in this wallet.",
    "sign.keys_missing": "Keys missing for this account.",
    "sign.user_rejected": "User rejected request",
    "sign.success": "Signed successfully",
    "sign.trust_domain": "Trust this site (Don't ask again)",
    // Errors
    "validation.invalid_amount": "Please enter a valid amount greater than 0.",
    "validation.required": "All fields are required.",
    "validation.account_not_found": "Account not found on {chain}",
    // Transfer Review
    "transfer.available": "Available:",
    "transfer.memo_placeholder": "Public note",
    "transfer.review_title": "Confirm Transfer",
    "transfer.review_btn": "Review Transfer",
    "transfer.back": "Back",
    "transfer.total_amount": "Total Amount",
    "transfer.per_user": "Per User:",
    "transfer.please_review": "Please review carefully.",
    "transfer.operations": "Operations",
    "transfer.no_memo": "No Memo",
    "transfer.optional": "(Optional)",
    // Receive Modal
    "receive.title": "Receive Funds",
    "receive.scan_qr": "Scan QR to send {chain} to this account",
    "receive.account_name": "Account Name",
    "receive.copied": "Copied!",
    "receive.copy": "Copy",
    "receive.close": "Close",
    // Manage Keys Extra
    "manage.label_posting": "Posting Key",
    "manage.label_active": "Active Key",
    "manage.label_memo": "Memo Key",
    // Import Errors Extra
    "import.error_username": "Please enter a valid, existing username.",
    "import.error_format": "One or more keys have an invalid format.",
    "import.error_missing_key": "You must provide at least one private key.",
    "import.match_error_posting": "Posting Key does not match the account on chain.",
    "import.match_error_active": "Active Key does not match the account on chain.",
    "import.match_error_memo": "Memo Key does not match the account on chain.",
    // Sign Request Extra
    "sign.expired": "Request expired or not found",
    "sign.active_key_missing": "Active Key missing",
    "sign.key_missing_type": "{type} key missing for this account",
    "sign.key_missing_generic": "{type} key missing",
    "sign.buffer_title": "Sign Message",
    "sign.message_label": "Message",
    "sign.key_type": "Key",
    // Help Guide
    "help.title": "User Guide",
    "help.keys_title": "Managing Keys",
    "help.keys_desc": "Your account security depends on your keys. Never share your Master Password or Private Keys.",
    "help.posting_key_label": "Posting Key",
    "help.posting_key_desc": "Use this for social actions like voting, posting, and following.",
    "help.active_key_label": "Active Key",
    "help.active_key_desc": "Required for financial transactions like transfers and power ups.",
    "help.memo_key_label": "Memo Key",
    "help.memo_key_desc": "Used to encrypt and decrypt private messages.",
    "help.transactions_title": "Transactions",
    "help.transactions_desc": "Easily manage your assets across multiple chains.",
    "help.transfers_point": "Send funds to any user securely.",
    "help.history_point": "View incoming and outgoing transfers.",
    "help.bulk_point": "Use Bulk Transfer for mass distributions.",
    "help.power_title": "Power & Staking",
    "help.power_desc": "Put your tokens to work by staking them (Powering Up).",
    "help.power_point": "Power Up to increase your voting influence and earn more rewards.",
    "help.power_down_point": "Power Down converts Power back to tokens over 13 weeks.",
    "help.delegate_point": "Delegate Power to others without losing ownership.",
    "help.savings_title": "Savings & RCs",
    "help.savings_desc": "Advanced chain features for Hive and Steem.",
    "help.savings_point": "Deposit HBD/SBD to Savings to earn interest (3-day withdraw notice).",
    "help.rc_point": "Delegate Resource Credits (Hive only) to help new users transacting.",
    "help.security_title": "Security First",
    "help.security_desc": "Transactions are signed locally. Your keys never leave your device unencrypted.",
    "help.chat_title": "Gravity Live Chat",
    "help.chat_desc": "Real-time messaging with custom rooms and DMs.",
    "help.chat_warning": "This chat uses a unique ID separate from your blockchain wallets.",
    "help.chat_cost": "Free & Instant (Off-chain)",
    // Help Buttons
    "help.btn_home": "Return to the main screen to select a network.",
    "help.btn_wallet": "Access your accounts, balances, and actions.",
    "help.btn_bulk": "Send funds to multiple accounts in a single transaction.",
    "help.btn_multisig": "Manage multi-signature accounts (Coming Soon).",
    "help.btn_settings": "Configure accounts, security, and preferences.",
    "help.btn_lock": "Lock your wallet immediately.",
    "help.btn_detach": "Open the wallet in a separate floating window.",
    "help.btn_send": "Transfer funds to another user.",
    "help.btn_receive": "Show QR code to receive funds.",
    "help.btn_history": "View your recent transaction history.",
    "help.btn_keys": "View and manage your private keys.",
    "help.btn_powerup": "Convert tokens to Power to increase voting influence.",
    "help.btn_powerdown": "Start the 13-week power down process.",
    "help.btn_delegate": "Delegate your Power to another account.",
    "help.btn_savings": "Deposit stablecoins to earn interest (Hive/Steem only).",
    "help.btn_rc": "Delegate Resource Credits to help others transact (Hive only).",
    "help.section_actions": "Account Actions",
    "help.section_navigation": "Main Navigation",
    "help.chat_memo_required": "Direct Messages (DMs) are End-to-End Encrypted. Public rooms are not encrypted.",
    "help.2fa_title": "Two-Factor Authentication",
    "help.2fa_multi_app_question": "Can I use multiple apps? (Aegis + Google Auth)",
    "help.2fa_multi_app_answer": "Yes! You can have the same code generated on multiple devices or apps simultaneously. To do this:",
    "help.2fa_step1": "Go to Settings > Authenticator App to reveal the QR Code.",
    "help.2fa_step2": "Scan this same QR code with Aegis.",
    "help.2fa_step3": "Scan it again with Google Authenticator.",
    "help.2fa_step4": "Both apps will now generate identical codes that work for unlocking.",
    "help.visual_guides": "Visual Guides",
    "help.visual_guides_desc": "How to configure your wallet securely:",
    // Power Operations
    "power.powerup_title": "Power Up",
    "power.powerdown_title": "Power Down",
    "power.delegate_title": "Delegate Power",
    "power.powerup_desc": "Convert {token} to {power} to increase your voting power",
    "power.powerdown_desc": "Start powering down your {power} (13 weeks process)",
    "power.delegate_desc": "Delegate your {power} to another account",
    "power.from_account": "From Account",
    "power.recipient": "Recipient",
    "power.recipient_placeholder": "username",
    "power.recipient_hint": "Leave as your username to power up yourself",
    "power.delegatee": "Delegate To",
    "power.delegatee_placeholder": "username",
    "power.amount_token": "Amount ({token})",
    "power.amount_vests": "Amount ({power})",
    "power.powerup_hint": "This will convert {token} to {power}",
    "power.powerdown_hint": "Enter amount in {power} to power down",
    "power.delegate_hint": "Enter amount in {power} to delegate",
    "power.invalid_amount": "Please enter a valid amount",
    "power.invalid_recipient": "Please enter a valid recipient",
    "power.active_key_required": "Active key is required for this operation",
    "power.operation_failed": "Operation failed",
    "power.success": "Operation successful!",
    "power.stop_powerdown": "Stop Power Down",
    "power.stop_powerdown_warning": "This will cancel your active power down. Click Confirm to proceed.",
    "power.stop_powerdown_confirm": "This will stop your active power down.",
    "power.available_power": "Available {power}",
    "power.operation_type": "Operation Type",
    // Savings Operations
    "savings.deposit_title": "Deposit to Savings",
    "savings.withdraw_title": "Withdraw from Savings",
    "savings.deposit_desc": "Earn interest by depositing {token} to savings",
    "savings.withdraw_desc": "Withdraw {token} from savings (3 days waiting period)",
    "savings.account": "Account",
    "savings.amount": "Amount ({token})",
    "savings.deposit_hint": "Funds will be available for withdrawal after 3 days",
    "savings.withdraw_hint": "Withdrawal will be processed after 3 days",
    "savings.deposit_info": "Savings earn interest and have a 3-day withdrawal period for security",
    "savings.withdraw_info": "Withdrawals take 3 days to process. You can cancel during this time.",
    "savings.invalid_amount": "Please enter a valid amount",
    "savings.active_key_required": "Active key is required for this operation",
    "savings.operation_failed": "Operation failed",
    "savings.success": "Operation successful!",
    "savings.not_available": "Not Available",
    "savings.blurt_not_supported": "Blurt does not support savings feature",
    // RC Operations
    "rc.hive_only": "Resource Credits (RC) delegation is only available on the Hive blockchain.",
    "rc.delegate_title": "Delegate Resource Credits",
    "rc.undelegate_title": "Undelegate Resource Credits",
    "rc.delegate_desc": "Help new accounts by delegating them Resource Credits.",
    "rc.undelegate_desc": "Stop delegating RC to an account.",
    "rc.from_account": "From Account",
    "rc.delegatee": "Delegate To",
    "rc.delegatee_placeholder": "username",
    "rc.max_rc": "RC Amount",
    "rc.max_rc_hint": "Enter the amount of RC you want to delegate.",
    "rc.invalid_delegatee": "Please enter a valid delegatee username",
    "rc.invalid_amount": "Please enter a valid RC amount",
    "rc.active_key_required": "Active key is required for RC delegation",
    "rc.operation_failed": "RC Operation failed",
    "rc.success": "RC delegation updated successfully!",
    "rc.not_available": "RC Not Available",
    "rc.delegate_info": "Delegating RC allows accounts to perform more operations on Hive.",
    "rc.undelegate_info": "This will remove the RC delegation from this account.",
    // Mobile Permissions
    "mobile.dapp_permissions": "dApp Permissions",
    "mobile.permissions_desc": "These dApps have permission to sign operations automatically.",
    "mobile.no_permissions": "No permissions granted",
    "mobile.revoke": "Revoke",
    "mobile.domain": "Domain",
    "mobile.access": "Access",
    "mobile.sign_request": "Sign Request",
    "mobile.operation": "Operation",
    "mobile.details": "Details",
    "mobile.remember_permission": "Remember this permission",
    "mobile.remember_permission_desc": "Auto-approve future requests from this site",
    "mobile.duration": "Duration",
    "mobile.1day": "1 Day",
    "mobile.1week": "1 Week",
    "mobile.1month": "1 Month",
    "mobile.sign_warning": "Only approve if you trust this site. This action cannot be undone.",
    "mobile.operation_transfer": "Transfer",
    "mobile.operation_vote": "Vote",
    "mobile.operation_post": "Post",
    "mobile.operation_comment": "Comment",
    "mobile.operation_delegate": "Delegate",
    "mobile.operation_powerup": "Power Up",
    "mobile.operation_powerdown": "Power Down"
  },
  es: {
    "landing.welcome": "Bienvenido",
    "landing.subtitle": "Selecciona una red para gestionar tus activos",
    "landing.manage_keys": "Gestionar Llaves",
    "landing.dapp_browser": "Navegador dApp",
    "wallet.active_key_tooltip": "Llave Activa Presente",
    "wallet.posting_key_tooltip": "Llave Posting Presente",
    "wallet.refresh_tooltip": "Actualizar Saldos",
    "wallet.send": "Enviar",
    "wallet.receive": "Recibir",
    "wallet.history": "Historial",
    "wallet.keys": "LLAVES",
    "wallet.no_accounts_chain": "No hay cuentas añadidas para {chain}",
    "wallet.add_one": "Añadir Cuenta",
    "wallet.network_label": "Red Activa",
    "bulk.analyze": "Analizar Seguridad",
    "bulk.analyzing": "Analizando...",
    "bulk.success": "Análisis: Sin riesgos detectados.",
    "bulk.switch_network": "Cambiar Red",
    // Sidebar
    "sidebar.home": "Inicio",
    "sidebar.wallet": "Billetera",
    "sidebar.bulk": "Transf. Masiva",
    "sidebar.multisig": "Multi-firma",
    "sidebar.manage": "Configuración",
    "sidebar.pair": "Emparejar teléfono",
    "sidebar.lock": "Bloquear",
    "sidebar.pin": "Desanclar Ventana",
    "sidebar.dock": "Anclar Ventana",
    // Actions
    "action.select_network": "Seleccionar Red",
    "action.manage_keys": "Administrar Llaves",
    // Header
    "header.add": "Añadir Cuenta",
    "common.cancel": "Cancelar",
    "common.confirm": "Confirmar",
    "common.close": "Cerrar",
    "common.processing": "Procesando...",
    "common.recent_recipients": "Recipientes Recientes",
    "common.account_not_found": "Cuenta no encontrada",
    // Import
    "import.title": "Importar Billetera",
    "import.manual": "Entrada Manual",
    "import.file": "Subir Archivo",
    "import.select_chain": "Seleccionar Red",
    "import.username": "Usuario",
    "import.checking": "Comprobando red...",
    "import.found": "✓ Encontrado",
    "import.not_found": "Cuenta no encontrada",
    "import.private_keys": "Llaves Privadas (Pegar al menos una)",
    "import.key_posting": "LLAVE POSTING",
    "import.key_active": "LLAVE ACTIVA",
    "import.key_memo": "LLAVE MEMO",
    "import.invalid_format": "Formato Inválido",
    "import.save": "Guardar Cuenta",
    "import.verifying": "Verificando...",
    "import.placeholder_username": "nombre de usuario",
    "import.placeholder_key": "Comienza con 5...",
    // Settings
    "settings.title": "Configura tu wallet",
    "settings.accounts_title": "Cuentas Gestionadas",
    "settings.remove": "Eliminar",
    "settings.add_new": "Añadir Nueva Cuenta",
    "settings.no_accounts": "No hay cuentas encontradas.",
    "settings.security_title": "Seguridad",
    "settings.change_password": "Cambiar Contraseña",
    "settings.biometrics": "Usar Biometría",
    "settings.reset": "Reiniciar Billetera",
    "pair.section_title": "Emparejar Otro Equipo",
    "pair.section_subtitle": "En el equipo nuevo, genera un código de recepción. En el equipo actual, introduce ese código y aprueba la transferencia cifrada.",
    "pair.send_cta": "Enviar Al Equipo Nuevo",
    "pair.receive_cta": "Obtener Código",
    "pair.step_badge_send": "Paso 2 de 2",
    "pair.step_badge_receive": "Paso 1 de 2",
    "pair.send_title": "Enviar a Otro Equipo",
    "pair.send_subtitle": "Introduce el código de recepción que muestra el equipo de destino. No se envía nada hasta que lo confirmes aquí.",
    "pair.receive_title": "Recibir en Este Equipo",
    "pair.receive_subtitle": "Mantén este código visible en este equipo. En el equipo que ya tiene la cartera, elige enviar e introduce allí este código.",
    "pair.code_label": "Código de recepción",
    "pair.copy_code": "Copiar Código",
    "pair.preparing": "Preparando sesión segura...",
    "pair.waiting_source": "Esperando al equipo origen...",
    "pair.importing": "Recibiendo e importando cartera cifrada...",
    "pair.receive_complete": "Importación Completa",
    "pair.receive_success_message": "Cartera recibida correctamente. Se importaron {count} cuentas.",
    "pair.transfer_error": "Error de Transferencia",
    "pair.receive_error": "No se pudieron recibir los datos",
    "pair.accounts_label": "Cuentas",
    "pair.settings_label": "Ajustes",
    "pair.chat_identity_label": "Identidad de chat",
    "pair.included": "Incluido",
    "pair.basic_only": "Sólo básico",
    "pair.not_found": "No encontrado",
    "pair.pair_devices": "Emparejar Equipos",
    "pair.waiting_handshake": "Esperando handshake seguro...",
    "pair.approve_and_send": "Aprobar y Enviar",
    "pair.sending": "Cifrando y enviando cartera...",
    "pair.send_complete": "Transferencia Completa",
    "pair.send_complete_subtitle": "El equipo de destino ya puede importar la cartera.",
    "pair.connect_error": "No se pudo emparejar con el equipo de destino",
    "pair.send_error": "No se pudo enviar la cartera cifrada",
    "pair.e2ee_notice": "Este equipo nunca expone los datos privados en texto plano.",
    "pair.e2ee_transfer": "Transferencia manual cifrada de extremo a extremo",
    // MultiSig
    "multisig.title": "Billetera Multi-firma",
    "multisig.initiator": "Iniciador",
    "multisig.threshold": "Umbral",
    "multisig.signers": "Firmantes",
    "multisig.proposal": "Propuesta",
    "multisig.expiration": "Expiración",
    "multisig.create": "Crear Propuesta",
    "multisig.approve": "Aprobar",
    "multisig.construction_title": "En Construcción...",
    "multisig.construction_desc": "Estamos construyendo esta funcionalidad para asegurar la máxima seguridad.",
    "multisig.progress_title": "Progreso de Autorización Multi-firma",
    "multisig.status_ready": "Listo para Transmitir",
    "multisig.status_collecting": "Recolectando Firmas",
    "multisig.weight_label": "Peso",
    "multisig.threshold_label": "Umbral",
    "multisig.authorities_title": "Autoridades Requeridas",
    "multisig.you_label": "(TÚ)",
    "multisig.how_it_works": '💡 **Cómo funciona:** Esta cuenta está protegida por Firmas Múltiples. Cada firmante tiene un "Peso" específico. Una vez que el peso total alcanza el "Umbral" de {threshold}, la transacción puede ser transmitida oficialmente a la blockchain.',
    "multisig.success_done": "¡Transacción Completada!",
    "multisig.reuse": "Reutilizar",
    "multisig.header_desc": "Construye un borrador multisig y revisa la autoridad activa real antes de coordinar las firmas.",
    "multisig.alpha_badge": "Alpha",
    "multisig.blurt_only": "La sincronización MultiSig está implementada por ahora solo para {chain}.",
    "multisig.supported_chains": "La sincronización MultiSig está implementada por ahora para {chains}.",
    "multisig.incoming_title": "Propuestas entrantes",
    "multisig.incoming_desc": "Revisa las actualizaciones on-chain antes de que entren en tu bandeja local multisig.",
    "multisig.incoming_empty": "No hay propuestas multisig pendientes de revisión.",
    "multisig.incoming_from": "De @{user}",
    "multisig.coordination_target": "Objetivo de coordinación",
    "multisig.accept": "Aceptar",
    "multisig.reject": "Rechazar",
    "multisig.coordination_hint": "La coordinación requiere todos los firmantes seleccionados en este borrador.",
    "multisig.expiration_hint": "Las transacciones multisig directas deberían mantenerse dentro de unos {minutes} minutos.",
    "multisig.expiration_hint_practical": "Esta es la expiración de la propia transacción firmada. Si caduca antes de la transmisión final, habrá que recoger las firmas otra vez.",
    "multisig.threshold_hint_onchain": "Solo se muestra porque esta cuenta ya expone una autoridad multisig on-chain.",
    "multisig.authority_loading": "Inspeccionando la autoridad activa en vivo...",
    "multisig.authority_ready_desc": "Umbral on-chain {threshold}. Las cuentas y claves de abajo son la fuente real de verdad.",
    "multisig.authority_single_desc": "Esta cuenta firma normalmente on-chain con una única autoridad activa. Tu coordinación multisig práctica sigue ocurriendo arriba, a nivel de borrador.",
    "multisig.authority_ready_badge": "Lista",
    "multisig.authority_single_badge": "Un solo firmante",
    "multisig.authority_no_accounts": "No hay firmantes basados en cuentas definidos on-chain.",
    "multisig.authority_reference_hint": "Esta es una vista de referencia de la autoridad on-chain en vivo de la cuenta iniciadora. No cambia el quorum de coordinación de este borrador.",
    "multisig.username_placeholder": "usuario",
    "multisig.add": "Añadir",
    "multisig.signers_empty": "Aún no se han seleccionado firmantes para la propuesta.",
    "multisig.target_account": "Cuenta destino",
    "multisig.target_default": "Por defecto: @{user}",
    "multisig.amount_vests": "Cantidad (VESTS)",
    "multisig.amount_chain": "Cantidad ({chain})",
    "multisig.undelegate_hint": "Esta propuesta retirará por completo la delegación de poder de la cuenta seleccionada estableciendo la cantidad de delegación a cero.",
    "multisig.memo": "Memo",
    "multisig.memo_placeholder": "Nota opcional",
    "multisig.generated": "Generado",
    "multisig.draft_desc": "Exporta este JSON para coordinar firmas manualmente mientras terminamos el flujo completo de transporte multisig.",
    "multisig.copied": "Copiado",
    "multisig.copy": "Copiar",
    "multisig.saved_title": "Propuestas guardadas",
    "multisig.saved_desc": "Guarda aquí los borradores locales mientras la wallet sincroniza las firmas desde eventos multisig on-chain.",
    "multisig.refresh_chain": "Refrescar desde la cadena",
    "multisig.refreshing_chain": "Refrescando...",
    "multisig.proposal_label": "Etiqueta de la propuesta",
    "multisig.save": "Guardar",
    "multisig.saved_empty": "Todavía no hay propuestas multisig guardadas.",
    "multisig.signers_count": "firmantes",
    "multisig.required_signers": "Firmantes requeridos",
    "multisig.coordination": "Coordinación",
    "multisig.on_chain": "On-chain",
    "multisig.threshold_mismatch": "El umbral de coordinación del borrador difiere del umbral actual de autoridad on-chain.",
    "multisig.signed_by": "Firmado por",
    "multisig.broadcasted_tx": "Transmitida",
    "multisig.timeline_title": "Historial de la propuesta",
    "multisig.timeline_empty": "Todavía no hay historial.",
    "multisig.timeline_created": "Creada",
    "multisig.timeline_signed": "Firmada",
    "multisig.timeline_broadcasted": "Transmitida",
    "multisig.timeline_expired": "Caducada",
    "multisig.status_pending": "Firmas pendientes",
    "multisig.status_broadcasted": "Transmitida",
    "multisig.status_expired": "Caducada",
    "multisig.load": "Cargar",
    "multisig.delete": "Eliminar",
    "multisig.signed": "Firmada",
    "multisig.sign": "Firmar",
    "multisig.no_local_signer": "No hay firmante local",
    "multisig.signer_unavailable": "No disponible",
    "multisig.delete_initiator_only": "Solo el iniciador puede borrar esta propuesta de todos los dispositivos.",
    "multisig.validation_hint": "Completa los campos obligatorios marcados con * antes de guardar.",
    "multisig.validation_required": "Completa los campos obligatorios antes de guardar esta propuesta.",
    "multisig.broadcast": "Transmitir",
    "multisig.import_desc": "Pega aquí un paquete compartido de propuesta para importarlo en este dispositivo.",
    "multisig.import_package": "Importar paquete",
    "multisig.sync_refreshed": "Sincronizado desde la cadena.",
    "multisig.sync_no_updates": "No se encontraron nuevas actualizaciones multisig on-chain.",
    "multisig.sync_failed": "No se pudieron refrescar las actualizaciones multisig desde la cadena.",
    "multisig.expired_at": "Caducó el",
    "multisig.sign_expired_blocked": "Esta propuesta ha caducado. Reutilízala para generar una nueva.",
    "multisig.broadcast_expired_blocked": "Esta propuesta ha caducado. Reutilízala para generar una nueva.",
    "multisig.op_transfer": "Transferencia",
    "multisig.op_delegate": "Delegar poder",
    "multisig.op_undelegate": "Retirar delegación",
    "multisig.op_powerup": "Power Up",
    "multisig.no_accounts": "No hay cuentas importadas de {chain}",
    "multisig.operation_preview": "Vista previa de la operación",
    "multisig.proposal_draft": "Borrador de la propuesta",
    "multisig.create_section": "Crear propuesta",
    "multisig.create_desc": "Construye aquí la propuesta y guárdala para empezar a recoger firmas.",
    "multisig.jump_active": "Ir a la propuesta activa",
    "multisig.preview_collapsed": "Plegada por defecto para mantener limpio el formulario.",
    "multisig.preview_expanded": "Payload bruto de la operación visible para revisión.",
    "multisig.draft_collapsed": "Plegado por defecto para centrar la atención en las propuestas activas.",
    "multisig.draft_expanded": "JSON bruto del borrador visible para revisión y exportación manual.",
    "multisig.broadcasted_details": "Detalles de la propuesta transmitida",
    "multisig.broadcasted_collapsed": "Plegada por defecto tras una transmisión correcta.",
    "multisig.broadcasted_expanded": "Historial completo y acciones visibles.",
    "multisig.hide_broadcasted_details": "Ocultar",
    // Bulk
    "bulk.title": "Transferencia Masiva",
    "bulk.recipients": "Destinatarios",
    "bulk.count": "Recuento",
    "bulk.check": "Verificar Validez",
    "bulk.checking": "Comprobando...",
    "bulk.amount": "Cantidad",
    "bulk.memo": "Memo",
    "bulk.same_amount": "Misma Cantidad",
    "bulk.diff_amount": "Cantidades Diferentes",
    "bulk.add_row": "+ Añadir Fila",
    "bulk.verify": "Verificar",
    "bulk.import": "Importar CSV/TXT",
    "bulk.total": "Total",
    "bulk.sign_broadcast": "Firmar y Transmitir",
    "bulk.no_accounts": "No se encontraron cuentas de {chain}.",
    "bulk.sending_from": "Enviando desde",
    "bulk.asset": "Activo:",
    "bulk.available": "Disponible:",
    "bulk.title_single": "Distribución Misma Cantidad",
    "bulk.title_multi": "Distribución Cantidades Múltiples",
    "bulk.validation_error": "Error de Validación",
    "bulk.error_remove_invalid": "Por favor elimina las cuentas inválidas antes de enviar.",
    "bulk.success_title": "¡Éxito!",
    "bulk.success_msg": "Enviadas {n} transferencias exitosamente. TXID: {txid}...",
    "bulk.error_title": "Error",
    "bulk.error_failed": "Error al enviar",
    "bulk.warn_not_found": "⚠ Advertencia: {n} usuario(s) no encontrado(s) en la red {chain}.",
    "bulk.error_no_active": "No se encontró llave activa para esta cuenta.",
    // Lock Screen
    "lock.title": "Bienvenido",
    "lock.unlock": "Desbloquear",
    "lock.password_placeholder": "Contraseña",
    "lock.pin_placeholder": "PIN de 6 dígitos",
    "lock.use_pin": "Usar PIN",
    "lock.use_password": "Usar Contraseña",
    "lock.biometrics": "Usar Biometría",
    "lock.reset": "Reiniciar Billetera",
    "lock.confirm_reset": "¿Seguro? ¡Se borrarán los datos!",
    "lock.create_title": "Crear Contraseña Maestra",
    "lock.unlock_title": "Desbloquear Billetera",
    "lock.create_btn": "Crear Billetera",
    "lock.unlock_btn": "Desbloquear",
    "lock.processing": "Procesando...",
    "lock.placeholder_create": "Establecer Contraseña",
    "lock.placeholder_enter": "Introducir Contraseña",
    "lock.error_length": "La contraseña debe tener al menos 8 caracteres",
    "lock.or_sign_up": "O regístrate con",
    "lock.or_unlock": "O desbloquea con",
    "lock.clear_reset": "Borrar Datos Locales y Reiniciar",
    "lock.session_expired": "Sesión expirada. Desbloquea para guardar cambios.",
    "lock.confirm_password": "Confirmar Contraseña",
    "lock.passwords_not_match": "Las contraseñas no coinciden",
    "lock.weak": "Débil",
    "lock.medium": "Media",
    "lock.strong": "Fuerte",
    "lock.very_strong": "Muy Fuerte",
    "lock.security_strength": "Seguridad",
    "lock.signup": "Registro",
    "lock.unlock_label": "Entrar",
    "lock.google": "Google",
    "lock.device": "LlaveDispositivo",
    "lock.2fa": "2FA Auth",
    "lock.secure_by_design": "Protección Integrada",
    "lock.google_title": "Configurar billetera usando Google OAuth",
    "lock.device_title": "Configurar billetera usando llaves locales de hardware",
    "lock.google_unlock_title": "Desbloquear con Google",
    "lock.device_unlock_title": "Desbloquear con Llave de Dispositivo",
    "lock.error_incorrect_password": "Contraseña incorrecta",
    "lock.error_totp_not_configured": "Autenticador no configurado. Desbloquea con contraseña y configúralo en Ajustes.",
    "lock.error_setup_failed": "Error al inicializar la billetera sin contraseña.",
    "lock.error_decrypt_failed": "No se pudieron desencriptar los datos (Llave {method} inválida).",
    "lock.error_no_auth_data": "No se encontraron datos de autenticación {method}. Usa contraseña.",
    "lock.connecting_google": "Conectando con Google...",
    "lock.error_auth_failed": "Autenticación {method} fallida",
    "lock.error_config_missing": "Error de Configuración (Falta el secreto)",
    "lock.totp_verified_pin": "TOTP Verificado. Ingresa el PIN.",
    "lock.error_no_key_after_totp": "No se encontró una llave segura tras el TOTP.",
    "lock.error_invalid_code": "Código Inválido",
    "lock.error_init_pin_failed": "Error al inicializar la billetera con PIN.",
    "lock.error_decryption_corrupt": "Error de desencriptación (¿Bóveda corrupta?)",
    "lock.error_incorrect_pin": "PIN Incorrecto",
    // Chat
    "chat.title": "Mensajería Gravity",
    "chat.status_connected": "En línea",
    "chat.status_connecting": "Conectando...",
    "chat.status_disconnected": "Desconectado",
    "chat.placeholder_username": "Elige un nombre...",
    "chat.btn_join": "Entrar al Chat",
    "chat.btn_logout": "Cerrar Sesión",
    "chat.rooms": "Salas",
    "chat.search": "Buscar usuarios...",
    "chat.no_rooms": "No hay salas",
    "chat.lobby": "Lobby Global",
    "chat.create_room": "Crear Sala",
    "chat.room_name": "Nombre de Sala",
    "chat.private": "Sala Privada",
    "chat.btn_create": "Crear",
    "chat.invite_user": "Invitar Usuario",
    "chat.invited_to": "Fuiste invitado a {room}",
    "chat.message_placeholder": "Escribe un mensaje...",
    "chat.clear_identity": "Limpiar Identidad Bloqueada",
    "chat.room_participants": "Participantes",
    "chat.no_messages": "Sin mensajes aún. ¡Di hola!",
    "chat.invite_placeholder": "Usuario a invitar...",
    "chat.btn_invite": "Invitar",
    "chat.confirm_delete": "¿Eliminar sala?",
    "chat.confirm_kick": "¿Expulsar usuario?",
    "chat.confirm_ban": "¿Banear usuario?",
    "chat.btn_confirm": "Confirmar",
    "chat.btn_cancel": "Cancelar",
    "chat.error_reg_failed": "Registro fallido",
    "chat.owner_label": "Propietario",
    // Manage Account
    "manage.title": "Gestionar Cuenta",
    "manage.subtitle": "@{name} • {chain}",
    "manage.invalid_posting": "Formato de Llave Posting Inválido",
    "manage.invalid_active": "Formato de Llave Activa Inválido",
    "manage.invalid_memo": "Formato de Llave Memo Inválido",
    "manage.validating": "Validando Llaves...",
    "manage.save_verify": "Guardar y Verificar",
    "manage.remove_link": "Eliminar Cuenta",
    "manage.verify_fail": "Validación Fallida: ",
    "manage.success": "¡Cuenta verificada y guardada!",
    "manage.confirm_remove_title": "¿Eliminar @{name}?",
    "manage.confirm_remove_desc": "Esto eliminará las llaves de la cuenta. No se puede deshacer.",
    "manage.cancel": "Cancelar",
    "manage.confirm_remove": "Eliminar",
    "manage.add_posting": "Añadir Llave Privada Posting",
    "manage.add_active": "Añadir Llave Privada Activa",
    "manage.add_memo": "Añadir Llave Privada Memo",
    // New Import Keys
    "import.success_file_parsed": "Archivo analizado. Cuentas: ",
    "import.error_file_read": "Error al leer archivo.",
    "import.drag_drop": "Arrastra archivo JSON/CSV/TXT",
    "import.click_upload": "o click para subir",
    "import.processing": "Procesando...",
    "import.bulk_summary": "Importadas {count} cuentas.",
    "import.no_valid_accounts": "No se encontraron cuentas válidas.",
    // Security
    "security.analysis_prompt": "Por favor analiza esta transacción en busca de riesgos en Español: ",
    "history.title": "Historial: {user}",
    "history.loading": "Cargando historial...",
    "history.empty": "No se encontraron transferencias recientes.",
    "history.received": "Recibido",
    "history.sent": "Enviado",
    "history.from": "De",
    "history.to": "Para",
    "history.filter_label": "Filtrar",
    "history.filter_all": "Todos",
    "history.filter_received": "Recibidos",
    "history.filter_sent": "Enviados",
    "history.filter_powerup": "Power Up",
    "history.filter_powerdown": "Power Down",
    "history.type_powerup_in": "Power Recibido",
    "history.type_powerup_out": "Power Enviado",
    "history.type_powerdown": "Power Down",
    // Sign Request
    "sign.title": "Solicitud de Firma",
    "sign.transfer_title": "Solicitud de Transferencia",
    "sign.vote_title": "Solicitud de Voto",
    "sign.custom_json_title": "JSON Personalizado",
    "sign.operation": "Operación",
    "sign.params": "Parámetros",
    "sign.author": "Autor",
    "sign.weight": "Peso",
    "sign.id": "ID",
    "sign.json_payload": "Contenido (Payload)",
    "sign.from": "De",
    "sign.to": "Para",
    "sign.reject": "Rechazar",
    "sign.confirm": "Confirmar",
    "sign.signing": "Firmando...",
    "sign.local_file": "Archivo Local",
    "sign.unknown_source": "Fuente Desconocida",
    "sign.loading": "Cargando solicitud...",
    "sign.error": "Error",
    "sign.account_not_found": "Cuenta no encontrada en esta billetera.",
    "sign.keys_missing": "Faltan llaves para esta cuenta.",
    "sign.user_rejected": "El usuario rechazó la solicitud",
    "sign.success": "Firmado exitosamente",
    "sign.trust_domain": "Confiar en este sitio (No volver a preguntar)",
    // Errors
    "validation.invalid_amount": "Por favor ingresa una cantidad válida mayor a 0.",
    "validation.required": "Todos los campos son obligatorios.",
    "validation.account_not_found": "Cuenta no encontrada en {chain}",
    // Transfer Review
    "transfer.available": "Disponible:",
    "transfer.memo_placeholder": "Nota pública",
    "transfer.review_title": "Confirmar Envío",
    "transfer.review_btn": "Revisar Transferencia",
    "transfer.back": "Atrás",
    "transfer.total_amount": "Cantidad Total",
    "transfer.per_user": "Por Usuario:",
    "transfer.please_review": "Por favor revisa atentamente.",
    "transfer.operations": "Operaciones",
    "transfer.no_memo": "Sin Memo",
    "transfer.optional": "(Opcional)",
    // Receive Modal
    "receive.title": "Recibir Fondos",
    "receive.scan_qr": "Escanea el QR para recibir {chain} en esta cuenta",
    "receive.account_name": "Nombre de Cuenta",
    "receive.copied": "¡Copiado!",
    "receive.copy": "Copiar",
    "receive.close": "Cerrar",
    // Manage Keys Extra
    "manage.label_posting": "Clave Posting",
    "manage.label_active": "Clave Active",
    "manage.label_memo": "Clave Memo",
    // Import Errors Extra
    "import.error_username": "Ingresa un usuario válido y existente.",
    "import.error_format": "Una o más claves tienen un formato inválido.",
    "import.error_missing_key": "Debes proveer al menos una clave privada.",
    "import.match_error_posting": "La Clave Posting no coincide con la cuenta.",
    "import.match_error_active": "La Clave Active no coincide con la cuenta.",
    "import.match_error_memo": "La Clave Memo no coincide con la cuenta.",
    // Sign Request Extra
    "sign.expired": "Solicitud expirada o no encontrada",
    "sign.active_key_missing": "Falta Clave Activa",
    "sign.key_missing_type": "Falta clave {type} para esta cuenta",
    "sign.key_missing_generic": "Falta clave {type}",
    "sign.buffer_title": "Firmar Mensaje",
    "sign.message_label": "Mensaje",
    "sign.key_type": "Clave",
    // Ayuda
    "help.title": "Guía de Usuario",
    "help.keys_title": "Gestión de Llaves",
    "help.keys_desc": "La seguridad de su cuenta depende de sus llaves. Nunca comparta su Contraseña Maestra ni sus Llaves Privadas.",
    "help.posting_key_label": "Llave Posting",
    "help.posting_key_desc": "Úsela para acciones sociales como votar, publicar y seguir.",
    "help.active_key_label": "Llave Activa",
    "help.active_key_desc": "Necesaria para transacciones financieras como transferencias.",
    "help.memo_key_label": "Llave Memo",
    "help.memo_key_desc": "Utilizada para cifrar y descifrar mensajes privados.",
    "help.transactions_title": "Transacciones",
    "help.transactions_desc": "Gestione fácilmente sus activos en múltiples redes.",
    "help.transfers_point": "Envíe fondos a cualquier usuario de forma segura.",
    "help.history_point": "Vea transferencias entrantes y salientes.",
    "help.bulk_point": "Use Transferencia Masiva para distribuciones múltiples.",
    "help.power_title": "Poder (Power) y Staking",
    "help.power_desc": "Ponga sus tokens a trabajar haciendo Staking (Power Up).",
    "help.power_point": "Haga Power Up para aumentar su influencia de voto y ganar más recompensas.",
    "help.power_down_point": "El Power Down convierte su Poder de nuevo en tokens durante 13 semanas.",
    "help.delegate_point": "Delegue Poder a otros sin perder la propiedad de sus activos.",
    "help.savings_title": "Ahorros y RCs",
    "help.savings_desc": "Funciones avanzadas para Hive y Steem.",
    "help.savings_point": "Deposite HBD/SBD en Ahorros para ganar intereses (aviso de retiro de 3 días).",
    "help.rc_point": "Delegue Créditos de Recursos (solo Hive) para ayudar a otros usuarios.",
    "help.security_title": "Seguridad ante todo",
    "help.security_desc": "Las transacciones se firman localmente. Sus llaves nunca salen de su dispositivo sin cifrar.",
    "help.chat_title": "Gravity Live Chat",
    "help.chat_desc": "Mensajería en tiempo real con salas personalizadas y mensajes directos.",
    "help.chat_warning": "Este chat usa un ID único separado de tus billeteras blockchain.",
    "help.chat_cost": "Gratis e Instantáneo (Fuera de cadena)",
    // Help Buttons
    "help.btn_home": "Volver a la pantalla principal para seleccionar red.",
    "help.btn_wallet": "Acceder a sus cuentas, saldos y acciones.",
    "help.btn_bulk": "Enviar fondos a múltiples cuentas en una sola transacción.",
    "help.btn_multisig": "Gestionar cuentas multi-firma (Próximamente).",
    "help.btn_settings": "Configurar cuentas, seguridad y preferencias.",
    "help.btn_lock": "Bloquear su billetera inmediatamente.",
    "help.btn_detach": "Abrir la billetera en una ventana flotante separada.",
    "help.btn_send": "Transferir fondos a otro usuario.",
    "help.btn_receive": "Mostrar código QR para recibir fondos.",
    "help.btn_history": "Ver su historial de transacciones recientes.",
    "help.btn_keys": "Ver y gestionar sus llaves privadas.",
    "help.btn_powerup": "Convertir tokens a Power para aumentar influencia de voto.",
    "help.btn_powerdown": "Iniciar el proceso de power down de 13 semanas.",
    "help.btn_delegate": "Delegar tu Power a otra cuenta.",
    "help.btn_savings": "Depositar stablecoins para ganar intereses (solo Hive/Steem).",
    "help.btn_rc": "Delegar Créditos de Recursos para ayudar a otros a transaccionar (solo Hive).",
    "help.section_actions": "Acciones de Cuenta",
    // Mobile Permissions
    "mobile.dapp_permissions": "Permisos de dApp",
    "mobile.permissions_desc": "Estas dApps tienen acceso a firmar operaciones automáticamente.",
    "mobile.no_permissions": "No hay permisos concedidos",
    "mobile.revoke": "Revocar",
    "mobile.domain": "Dominio",
    "mobile.access": "Acceso",
    "mobile.sign_request": "Solicitud de Firma",
    "mobile.operation": "Operación",
    "mobile.details": "Detalles",
    "mobile.remember_permission": "Recordar este permiso",
    "mobile.remember_permission_desc": "Auto-aprobar futuras solicitudes de este sitio",
    "mobile.duration": "Duración",
    "mobile.1day": "1 Día",
    "mobile.1week": "1 Semana",
    "mobile.1month": "1 Mes",
    "mobile.sign_warning": "Solo aprueba si confías en este sitio. Esta acción no se puede deshacer.",
    "mobile.operation_transfer": "Transferencia",
    "mobile.operation_vote": "Votar",
    "mobile.operation_post": "Publicar",
    "mobile.operation_comment": "Comentar",
    "mobile.operation_delegate": "Delegar",
    "mobile.operation_powerup": "Power Up",
    "mobile.operation_powerdown": "Power Down",
    "help.section_navigation": "Navegación Principal",
    "help.chat_memo_required": "Los Mensajes Directos (DMs) están Encriptados de Extremo a Extremo. Las salas públicas no están encriptadas.",
    "help.2fa_title": "Autenticación de Dos Factores",
    "help.2fa_multi_app_question": "¿Puedo usar múltiples apps? (Aegis + Google Auth)",
    "help.2fa_multi_app_answer": "¡Sí! Puedes tener el mismo código generado en múltiples dispositivos o apps simultáneamente. Para hacer esto:",
    "help.2fa_step1": "Ve a Ajustes > Aplicación Autenticadora para revelar el código QR.",
    "help.2fa_step2": "Escanea este mismo código QR con Aegis.",
    "help.2fa_step3": "Escanéalo de nuevo con Google Authenticator.",
    "help.2fa_step4": "Ambas apps ahora generarán códigos idénticos que funcionan para desbloquear.",
    "help.visual_guides": "Guías Visuales",
    "help.visual_guides_desc": "Cómo configurar tu billetera de forma segura:",
    // Operaciones de Power
    "power.powerup_title": "Power Up",
    "power.powerdown_title": "Power Down",
    "power.delegate_title": "Delegar Power",
    "power.powerup_desc": "Convertir {token} a {power} para aumentar tu poder de voto",
    "power.powerdown_desc": "Iniciar power down de tu {power} (proceso de 13 semanas)",
    "power.delegate_desc": "Delegar tu {power} a otra cuenta",
    "power.from_account": "Desde Cuenta",
    "power.recipient": "Destinatario",
    "power.recipient_placeholder": "usuario",
    "power.recipient_hint": "Deja tu usuario para hacer power up a ti mismo",
    "power.delegatee": "Delegar A",
    "power.delegatee_placeholder": "usuario",
    "power.amount_token": "Cantidad ({token})",
    "power.amount_vests": "Cantidad ({power})",
    "power.powerup_hint": "Esto convertirá {token} a {power}",
    "power.powerdown_hint": "Ingrese la cantidad en {power} para retirar",
    "power.delegate_hint": "Ingrese la cantidad en {power} para delegar",
    "power.invalid_amount": "Por favor ingresa una cantidad válida",
    "power.invalid_recipient": "Por favor ingresa un destinatario válido",
    "power.active_key_required": "Se requiere la clave activa para esta operación",
    "power.operation_failed": "Operación fallida",
    "power.success": "¡Operación exitosa!",
    "power.stop_powerdown": "Detener Power Down",
    "power.stop_powerdown_warning": "Esto cancelará tu power down activo. Haz clic en Confirmar para proceder.",
    "power.available_power": "{power} Disponible",
    // Operaciones de Ahorros
    "savings.deposit_title": "Depositar en Ahorros",
    "savings.withdraw_title": "Retirar de Ahorros",
    "savings.deposit_desc": "Gana intereses depositando {token} en ahorros",
    "savings.withdraw_desc": "Retirar {token} de ahorros (período de espera de 3 días)",
    "savings.account": "Cuenta",
    "savings.amount": "Cantidad ({token})",
    "savings.deposit_hint": "Los fondos estarán disponibles para retiro después de 3 días",
    "savings.withdraw_hint": "El retiro se procesará después de 3 días",
    "savings.deposit_info": "Los ahorros generan intereses y tienen un período de retiro de 3 días por seguridad",
    "savings.withdraw_info": "Los retiros tardan 3 días en procesarse. Puedes cancelar durante este tiempo.",
    "savings.invalid_amount": "Por favor ingresa una cantidad válida",
    "savings.active_key_required": "Se requiere la clave activa para esta operación",
    "savings.operation_failed": "Operación fallida",
    "savings.success": "¡Operación exitosa!",
    "savings.not_available": "No Disponible",
    "savings.blurt_not_supported": "Blurt no soporta la función de ahorros",
    // Operaciones de RC
    "rc.hive_only": "La delegación de Créditos de Recursos (RC) solo está disponible en Hive.",
    "rc.delegate_title": "Delegar RC",
    "rc.undelegate_title": "Quitar Delegación RC",
    "rc.delegate_desc": "Ayuda a cuentas nuevas delegándoles Créditos de Recursos.",
    "rc.undelegate_desc": "Deja de delegar RC a una cuenta.",
    "rc.from_account": "Desde la Cuenta",
    "rc.delegatee": "Delegar a",
    "rc.delegatee_placeholder": "usuario",
    "rc.max_rc": "Cantidad de RC",
    "rc.max_rc_hint": "Ingrese la cantidad de RC que desea delegar.",
    "rc.invalid_delegatee": "Por favor ingrese un usuario válido",
    "rc.invalid_amount": "Por favor ingrese una cantidad de RC válida",
    "rc.active_key_required": "Se requiere la clave activa para delegar RC",
    "rc.operation_failed": "La operación de RC falló",
    "rc.success": "¡Delegación de RC actualizada con éxito!",
    "rc.not_available": "RC No Disponible",
    "rc.delegate_info": "Delegar RC permite que las cuentas realicen más operaciones en Hive.",
    "rc.undelegate_info": "Esto eliminará la delegación de RC de esta cuenta."
  },
  fr: {
    "landing.welcome": "Bon retour",
    "landing.subtitle": "Sélectionnez un réseau pour gérer vos actifs",
    "landing.manage_keys": "Gérer les clés",
    "landing.dapp_browser": "Navigateur dApp",
    "wallet.active_key_tooltip": "Clé Active présente",
    "wallet.posting_key_tooltip": "Clé Posting présente",
    "wallet.refresh_tooltip": "Actualiser les soldes",
    "wallet.send": "Envoyer",
    "wallet.receive": "Recevoir",
    "wallet.history": "Historique",
    "wallet.keys": "CLÉS",
    "wallet.network_label": "Réseau Actif",
    "wallet.no_accounts_chain": "Aucun compte ajouté pour {chain}",
    "wallet.add_one": "Ajouter un compte",
    "bulk.analyze": "Analyser la sécurité",
    "bulk.analyzing": "Analyse en cours...",
    "bulk.success": "Analyse : Aucun risque détecté.",
    "bulk.switch_network": "Changer de réseau",
    // Sidebar
    "sidebar.home": "Accueil",
    "sidebar.wallet": "Portefeuille",
    "sidebar.bulk": "Envoi Massif",
    "sidebar.multisig": "MultiSig",
    "sidebar.manage": "Paramètres",
    "sidebar.pair": "Associer telephone",
    "sidebar.lock": "Verrouiller",
    "sidebar.pin": "Détacher Fenêtre",
    "sidebar.dock": "Ancrer Fenêtre",
    "sidebar.language": "Langue",
    // Actions
    "action.select_network": "Sélectionner Réseau",
    "action.manage_keys": "Gérer les clés",
    // Header
    "header.add": "Ajouter un compte",
    "common.cancel": "Annuler",
    "common.confirm": "Confirmer",
    "common.close": "Fermer",
    "common.processing": "Traitement...",
    "common.recent_recipients": "Destinataires Récents",
    "common.account_not_found": "Compte non trouvé",
    // Import
    "import.title": "Importer Portefeuille",
    "import.manual": "Saisie Manuelle",
    "import.file": "Téléverser Fichier",
    "import.select_chain": "Sélectionner Chaîne",
    "import.username": "Nom d'utilisateur",
    "import.checking": "Vérification chaîne...",
    "import.found": "✓ Trouvé",
    "import.not_found": "Compte non trouvé",
    "import.private_keys": "Clés Privées (Coller au moins une)",
    "import.key_posting": "CLÉ POSTING",
    "import.key_active": "CLÉ ACTIVE",
    "import.key_memo": "CLÉ MEMO",
    "import.invalid_format": "Format Invalide",
    "import.save": "Enregistrer",
    "import.verifying": "Vérification...",
    "import.placeholder_username": "nom d'utilisateur",
    "import.placeholder_key": "Commence par 5...",
    "import.error_username": "Veuillez entrer un nom d'utilisateur valide.",
    "import.error_format": "Une ou plusieurs clés ont un format invalide.",
    "import.error_missing_key": "Vous devez fournir au moins une clé privée.",
    "import.match_error_posting": "La clé Posting ne correspond pas au compte.",
    "import.match_error_active": "La clé Active ne correspond pas au compte.",
    "import.match_error_memo": "La clé Memo ne correspond pas au compte.",
    "import.success_file_parsed": "Fichier analysé. Comptes : ",
    "import.error_file_read": "Erreur de lecture du fichier.",
    "import.drag_drop": "Glisser-déposer fichier JSON/CSV/TXT",
    "import.click_upload": "ou cliquer pour téléverser",
    "import.processing": "Traitement...",
    "import.bulk_summary": "{count} comptes importés.",
    "import.no_valid_accounts": "Aucun compte valide trouvé.",
    // Settings
    "settings.title": "Configurer votre portefeuille",
    "settings.accounts_title": "Comptes Gérés",
    "settings.remove": "Supprimer",
    "settings.add_new": "Ajouter Nouveau Compte",
    "settings.no_accounts": "Aucun compte trouvé.",
    "settings.security_title": "Sécurité",
    "settings.change_password": "Changer Mot de Passe",
    "settings.biometrics": "Utiliser Biométrie",
    "settings.reset": "Réinitialiser Portefeuille",
    "pair.section_title": "Associer un Autre Appareil",
    "pair.section_subtitle": "Sur le nouvel appareil, générez un code de réception. Sur l'appareil actuel, saisissez ce code et approuvez le transfert chiffré.",
    "pair.send_cta": "Envoyer Vers le Nouvel Appareil",
    "pair.receive_cta": "Obtenir le Code",
    "pair.step_badge_send": "Étape 2 sur 2",
    "pair.step_badge_receive": "Étape 1 sur 2",
    "pair.send_title": "Envoyer vers un Autre Appareil",
    "pair.send_subtitle": "Saisissez le code de réception affiché sur l'appareil de destination. Rien n'est envoyé tant que vous ne confirmez pas ici.",
    "pair.receive_title": "Recevoir sur Cet Appareil",
    "pair.receive_subtitle": "Gardez ce code visible sur cet appareil. Sur l'appareil qui possède déjà le portefeuille, choisissez envoyer et saisissez ce code.",
    "pair.code_label": "Code de réception",
    "pair.copy_code": "Copier le Code",
    "pair.preparing": "Préparation de la session sécurisée...",
    "pair.waiting_source": "En attente de l'appareil source...",
    "pair.importing": "Réception et importation du portefeuille chiffré...",
    "pair.receive_complete": "Importation Terminée",
    "pair.receive_success_message": "Portefeuille reçu avec succès. {count} comptes importés.",
    "pair.transfer_error": "Erreur de Transfert",
    "pair.receive_error": "Impossible de recevoir les données",
    "pair.accounts_label": "Comptes",
    "pair.settings_label": "Paramètres",
    "pair.chat_identity_label": "Identité de chat",
    "pair.included": "Inclus",
    "pair.basic_only": "Basique seulement",
    "pair.not_found": "Introuvable",
    "pair.pair_devices": "Associer les Appareils",
    "pair.waiting_handshake": "En attente du handshake sécurisé...",
    "pair.approve_and_send": "Approuver et Envoyer",
    "pair.sending": "Chiffrement et envoi du portefeuille...",
    "pair.send_complete": "Transfert Terminé",
    "pair.send_complete_subtitle": "L'appareil de destination peut maintenant importer le portefeuille.",
    "pair.connect_error": "Impossible d'associer l'appareil cible",
    "pair.send_error": "Impossible d'envoyer le portefeuille chiffré",
    "pair.e2ee_notice": "Cet appareil n'expose jamais les données privées en clair.",
    "pair.e2ee_transfer": "Transfert manuel chiffré de bout en bout",
    // MultiSig
    "multisig.title": "Portefeuille MultiSig",
    "multisig.initiator": "Initiateur",
    "multisig.threshold": "Seuil",
    "multisig.signers": "Signataires",
    "multisig.proposal": "Proposition",
    "multisig.expiration": "Expiration",
    "multisig.create": "Créer Proposition",
    "multisig.approve": "Approuver",
    "multisig.construction_title": "En Construction...",
    "multisig.construction_desc": "Nous développons cette fonctionnalité pour assurer une sécurité maximale.",
    // Bulk
    "bulk.title": "Transfert Massif",
    "bulk.recipients": "Destinataires",
    "bulk.count": "Nombre",
    "bulk.check": "Vérifier Validité",
    "bulk.checking": "Vérification...",
    "bulk.amount": "Montant",
    "bulk.memo": "Mémo",
    "bulk.same_amount": "Même Montant",
    "bulk.diff_amount": "Montants Différents",
    "bulk.add_row": "+ Ajouter Ligne",
    "bulk.verify": "Vérifier",
    "bulk.import": "Importer CSV/TXT",
    "bulk.total": "Total",
    "bulk.sign_broadcast": "Signer & Diffuser",
    "bulk.no_accounts": "Aucun compte {chain} trouvé.",
    "bulk.sending_from": "Envoi depuis",
    "bulk.asset": "Actif :",
    "bulk.available": "Disponible :",
    "bulk.title_single": "Distribution Montant Unique",
    "bulk.title_multi": "Distribution Montants Multiples",
    "bulk.validation_error": "Erreur de Validation",
    "bulk.error_remove_invalid": "Veuillez supprimer les comptes invalides avant d'envoyer.",
    "bulk.success_title": "Succès !",
    "bulk.success_msg": "{n} transferts envoyés avec succès. TXID : {txid}...",
    "bulk.error_title": "Erreur",
    "bulk.error_failed": "Échec de l'envoi",
    "bulk.warn_not_found": "⚠ Attention : {n} utilisateur(s) non trouvé(s) sur la chaîne {chain}.",
    "bulk.error_no_active": "Clé active non trouvée pour ce compte.",
    // Lock Screen
    "lock.title": "Bon retour",
    "lock.unlock": "Déverrouiller",
    "lock.password_placeholder": "Entrer Mot de Passe",
    "lock.pin_placeholder": "PIN à 6 chiffres",
    "lock.use_pin": "Utiliser PIN",
    "lock.use_password": "Utiliser Mot de Passe",
    "lock.biometrics": "Déverrouiller avec Biométrie",
    "lock.reset": "Réinitialiser",
    "lock.confirm_reset": "Êtes-vous sûr ? Cela effacera toutes les données !",
    "lock.create_title": "Créer Mot de Passe Maître",
    "lock.unlock_title": "Déverrouiller votre Portefeuille",
    "lock.create_btn": "Créer Portefeuille",
    "lock.unlock_btn": "Déverrouiller",
    "lock.processing": "Traitement...",
    "lock.placeholder_create": "Définir Mot de Passe",
    "lock.placeholder_enter": "Entrer Mot de Passe",
    "lock.error_length": "Le mot de passe doit comporter au moins 8 caractères",
    "lock.or_sign_up": "Ou s'inscrire avec",
    "lock.or_unlock": "Ou déverrouiller avec",
    "lock.clear_reset": "Effacer Données Locales & Réinitialiser",
    "lock.session_expired": "Session expirée. Veuillez déverrouiller pour enregistrer.",
    "lock.confirm_password": "Confirmer le mot de passe",
    "lock.passwords_not_match": "Les mots de passe ne correspondent pas",
    "lock.weak": "Faible",
    "lock.medium": "Moyen",
    "lock.strong": "Fort",
    "lock.very_strong": "Très Fort",
    "lock.security_strength": "Sécurité",
    // Auth
    "auth.authenticator": "Application d'authentification (2FA)",
    "auth.configure_title": "Configurer l'authentification",
    "auth.scan_qr": "Scannez ce QR code avec Aegis ou Google Auth.",
    "auth.enter_code": "Entrez le code à 6 chiffres pour vérifier.",
    "auth.verify": "Vérifier",
    "auth.success": "Authentification configurée avec succès !",
    "auth.backup_code": "Clé de secours (Saisie manuelle)",
    "auth.configure_desc": "Configurer Aegis, Google Auth ou Authy",
    // Manage Account
    "manage.title": "Gérer Compte",
    "manage.subtitle": "@{name} • {chain}",
    "manage.invalid_posting": "Format Clé Posting Invalide",
    "manage.invalid_active": "Format Clé Active Invalide",
    "manage.invalid_memo": "Format Clé Memo Invalide",
    "manage.validating": "Validation Clés...",
    "manage.save_verify": "Enregistrer & Vérifier",
    "manage.remove_link": "Supprimer Compte",
    "manage.verify_fail": "Échec Validation Clé : ",
    "manage.success": "Compte vérifié et enregistré !",
    "manage.confirm_remove_title": "Supprimer @{name} ?",
    "manage.confirm_remove_desc": "Ceci suprimera les clés localement. Irréversible.",
    "manage.cancel": "Annuler",
    "manage.confirm_remove": "Supprimer",
    "manage.label_posting": "Clé Posting",
    "manage.label_active": "Clé Active",
    "manage.label_memo": "Clé Memo",
    "manage.add_posting": "Ajouter Clé Privée Posting",
    "manage.add_active": "Ajouter Clé Privée Active",
    "manage.add_memo": "Ajouter Clé Privée Memo",
    // Security
    "security.analysis_prompt": "Veuillez analyser cette transaction crypto pour les risques en Français : ",
    // History
    "history.title": "Historique : {user}",
    "history.loading": "Chargement historique...",
    "history.empty": "Aucun transfert récent trouvé.",
    "history.received": "Reçu",
    "history.sent": "Envoyé",
    "history.from": "De",
    "history.to": "À",
    // Sign Request
    "sign.title": "Demande de Signature",
    "sign.transfer_title": "Demande de Transfert",
    "sign.vote_title": "Demande de Vote",
    "sign.custom_json_title": "JSON Personnalisé",
    "sign.operation": "Opération",
    "sign.params": "Paramètres",
    "sign.author": "Auteur",
    "sign.weight": "Poids",
    "sign.id": "ID",
    "sign.json_payload": "Contenu",
    "sign.from": "De",
    "sign.to": "À",
    "sign.reject": "Rejeter",
    "sign.confirm": "Confirmer",
    "sign.signing": "Signature...",
    "sign.local_file": "Fichier Local",
    "sign.unknown_source": "Source Inconnue",
    "sign.loading": "Chargement demande...",
    "sign.error": "Erreur",
    "sign.account_not_found": "Compte non trouvé dans ce portefeuille.",
    "sign.keys_missing": "Clés manquantes pour ce compte.",
    "sign.active_key_missing": "Clé Active manquante",
    "sign.key_missing_type": "Clé {type} manquante pour ce compte",
    "sign.key_missing_generic": "Clé {type} manquante",
    "sign.user_rejected": "L'utilisateur a rejeté la demande",
    "sign.success": "Signé avec succès",
    "sign.trust_domain": "Faire confiance à ce site",
    "sign.expired": "Demande expirée ou non trouvée",
    "sign.buffer_title": "Signer Message",
    "sign.message_label": "Message",
    "sign.key_type": "Clé",
    // Errors
    "validation.invalid_amount": "Veuillez entrer un montant valide supérieur à 0.",
    "validation.required": "Tous les champs sont requis.",
    "validation.account_not_found": "Compte non trouvé sur {chain}",
    // Transfer
    "transfer.available": "Disponible :",
    "transfer.memo_placeholder": "Note publique",
    "transfer.review_title": "Confirmer Transfert",
    "transfer.review_btn": "Vérifier Transfert",
    "transfer.back": "Retour",
    "transfer.total_amount": "Montant Total",
    "transfer.per_user": "Par Utilisateur :",
    "transfer.please_review": "Veuillez vérifier attentivement.",
    "transfer.operations": "Opérations",
    "transfer.no_memo": "Pas de Mémo",
    "transfer.optional": "(Optionnel)",
    // Receive
    "receive.title": "Recevoir des Fonds",
    "receive.scan_qr": "Scannez le QR pour envoyer {chain} à ce compte",
    "receive.account_name": "Nom du Compte",
    "receive.copied": "Copié !",
    "receive.copy": "Copier",
    "receive.close": "Fermer",
    // Aide
    "help.title": "Guide Utilisateur",
    "help.keys_title": "Gestion des Clés",
    "help.keys_desc": "La sécurité de votre compte dépend de vos clés. Ne partagez jamais votre mot de passe maître ou vos clés privées.",
    "help.posting_key_label": "Clé Posting",
    "help.posting_key_desc": "Utilisée pour les actions sociales comme voter, publier et suivre.",
    "help.active_key_label": "Clé Active",
    "help.active_key_desc": "Requise pour les transactions financières comme les transferts.",
    "help.memo_key_label": "Clé Memo",
    "help.memo_key_desc": "Utilisée pour chiffrer et déchiffrer les messages privés.",
    "help.transactions_title": "Transactions",
    "help.transactions_desc": "Gérez facilement vos actifs sur plusieurs réseaux.",
    "help.transfers_point": "Envoyez des fonds en toute sécurité.",
    "help.history_point": "Consultez les transferts entrants et sortants.",
    "help.bulk_point": "Utilisez le Transfert Massif pour les distributions.",
    "help.security_title": "Sécurité d'abord",
    "help.security_desc": "Les transactions sont signées localement. Vos clés restent chiffrées sur votre appareil.",
    "help.chat_title": "Gravity Chat en Direct",
    "help.chat_desc": "Messagerie en temps réel avec salons et MP.",
    "help.chat_warning": "Ce chat utilise un ID unique séparé de vos portefeuilles.",
    "help.chat_cost": "Gratuit & Instantané (Hors-chaîne)",
    // Help Buttons
    "help.btn_home": "Retourner à l'écran principal pour choisir un réseau.",
    "help.btn_wallet": "Accéder à vos comptes, soldes et actions.",
    "help.btn_bulk": "Envoyer des fonds à plusieurs comptes en une seule transaction.",
    "help.btn_multisig": "Gérer les comptes multi-signatures (Bientôt).",
    "help.btn_settings": "Configurer les comptes, la sécurité et les préférences.",
    "help.btn_lock": "Verrouiller votre portefeuille immédiatement.",
    "help.btn_detach": "Ouvrir le portefeuille dans une fenêtre flottante séparée.",
    "help.btn_send": "Transférer des fonds à un autre utilisateur.",
    "help.btn_receive": "Afficher le QR code pour recevoir des fonds.",
    "help.btn_history": "Voir votre historique de transactions récent.",
    "help.btn_keys": "Voir et gérer vos clés privées.",
    "help.btn_powerup": "Convertir tokens en Power pour augmenter l'influence de vote.",
    "help.btn_powerdown": "Démarrer le processus de power down de 13 semaines.",
    "help.btn_delegate": "Déléguer votre Power à un autre compte.",
    "help.btn_savings": "Déposer des stablecoins pour gagner des intérêts (Hive/Steem uniquement).",
    "help.btn_rc": "Déléguer des Crédits de Ressources pour aider les autres (Hive uniquement).",
    "help.power_title": "Power & Staking",
    "help.power_desc": "Mettez vos tokens au travail en les stakant (Power Up).",
    "help.power_point": "Power Up pour augmenter votre influence de vote et gagner plus de récompenses.",
    "help.power_down_point": "Power Down convertit le Power en tokens sur 13 semaines.",
    "help.delegate_point": "Déléguez du Power à d'autres sans perdre la propriété.",
    "help.savings_title": "Épargne & RC",
    "help.savings_desc": "Fonctionnalités avancées pour Hive et Steem.",
    "help.savings_point": "Déposez HBD/SBD en Épargne pour gagner des intérêts (préavis de retrait de 3 jours).",
    "help.rc_point": "Déléguez des Crédits de Ressources (Hive uniquement) pour aider les nouveaux utilisateurs.",
    "help.section_actions": "Actions du Compte",
    "help.section_navigation": "Navigation Principale",
    "help.chat_memo_required": "Les Messages Directs (DMs) sont Chiffrés de Bout en Bout. Les salons publics ne sont pas chiffrés.",
    "help.2fa_title": "Authentification à Deux Facteurs",
    "help.2fa_multi_app_question": "Puis-je utiliser plusieurs apps ? (Aegis + Google Auth)",
    "help.2fa_multi_app_answer": "Oui ! Vous pouvez avoir le même code généré sur plusieurs appareils ou apps simultanément. Pour ce faire :",
    "help.2fa_step1": "Allez dans Paramètres > Application d'Authentification pour révéler le QR Code.",
    "help.2fa_step2": "Scannez ce même QR code avec Aegis.",
    "help.2fa_step3": "Scannez-le à nouveau avec Google Authenticator.",
    "help.2fa_step4": "Les deux apps généreront maintenant des codes identiques qui fonctionnent pour déverrouiller.",
    "help.visual_guides": "Guides Visuels",
    "help.visual_guides_desc": "Comment configurer votre portefeuille en toute sécurité :",
    // Lock Screen additions
    "lock.signup": "S'inscrire",
    "lock.unlock_label": "Déverrouiller",
    "lock.google": "Google",
    "lock.device": "CléAppareil",
    "lock.2fa": "Auth 2FA",
    "lock.secure_by_design": "Sécurisé par Conception",
    "lock.google_title": "Configurer le portefeuille avec Google OAuth",
    "lock.device_title": "Configurer le portefeuille avec clés matérielles locales",
    "lock.google_unlock_title": "Déverrouiller avec Google",
    "lock.device_unlock_title": "Déverrouiller avec Clé d'Appareil",
    "lock.error_incorrect_password": "Mot de passe incorrect",
    "lock.error_totp_not_configured": "Authentificateur non configuré. Veuillez déverrouiller avec le mot de passe et le configurer dans Paramètres.",
    "lock.error_setup_failed": "Échec de l'initialisation du portefeuille sans mot de passe.",
    "lock.error_decrypt_failed": "Impossible de déchiffrer les données (Clé {method} invalide).",
    "lock.error_no_auth_data": "Aucune donnée d'authentification {method} trouvée. Utilisez le mot de passe.",
    "lock.connecting_google": "Connexion à Google...",
    "lock.error_auth_failed": "Échec de l'authentification {method}",
    "lock.error_config_missing": "Erreur de Configuration (Secret manquant)",
    "lock.totp_verified_pin": "TOTP Vérifié. Entrez le PIN.",
    "lock.error_no_key_after_totp": "Aucune clé sécurisée trouvée après TOTP.",
    "lock.error_invalid_code": "Code Invalide",
    "lock.error_init_pin_failed": "Échec de l'initialisation du portefeuille PIN.",
    "lock.error_decryption_corrupt": "Échec du déchiffrement (Coffre corrompu ?).",
    "lock.error_incorrect_pin": "PIN Incorrect",
    // Chat
    "chat.title": "Gravity Messenger",
    "chat.status_connected": "En ligne",
    "chat.status_connecting": "Connexion...",
    "chat.status_disconnected": "Hors ligne",
    "chat.placeholder_username": "Choisir un nom d'utilisateur...",
    "chat.btn_join": "Rejoindre le Chat",
    "chat.btn_logout": "Déconnexion",
    "chat.rooms": "Salons",
    "chat.search": "Rechercher utilisateurs...",
    "chat.no_rooms": "Aucun salon trouvé",
    "chat.lobby": "Lobby Global",
    "chat.create_room": "Créer un Salon",
    "chat.room_name": "Nom du Salon",
    "chat.private": "Salon Privé",
    "chat.btn_create": "Créer",
    "chat.invite_user": "Inviter Utilisateur",
    "chat.invited_to": "Vous avez été invité à {room}",
    "chat.message_placeholder": "Tapez un message...",
    "chat.clear_identity": "Effacer Identité Bloquée",
    "chat.room_participants": "Participants",
    "chat.no_messages": "Pas encore de messages. Dites bonjour !",
    "chat.invite_placeholder": "Nom d'utilisateur à inviter...",
    "chat.btn_invite": "Inviter",
    "chat.confirm_delete": "Supprimer le salon ?",
    "chat.confirm_kick": "Expulser l'utilisateur ?",
    "chat.confirm_ban": "Bannir l'utilisateur ?",
    "chat.btn_confirm": "Confirmer",
    "chat.btn_cancel": "Annuler",
    "chat.error_reg_failed": "Échec de l'inscription",
    "chat.owner_label": "Propriétaire",
    // Sidebar additions
    "sidebar.messenger": "Messagerie",
    "sidebar.help": "Aide",
    // Power Operations
    "power.powerup_title": "Power Up",
    "power.powerdown_title": "Power Down",
    "power.delegate_title": "Déléguer Power",
    "power.powerup_desc": "Convertir {token} en {power} pour augmenter votre pouvoir de vote",
    "power.powerdown_desc": "Commencer le power down de votre {power} (processus de 13 semaines)",
    "power.delegate_desc": "Déléguer votre {power} à un autre compte",
    "power.from_account": "Depuis le Compte",
    "power.recipient": "Destinataire",
    "power.recipient_placeholder": "nom d'utilisateur",
    "power.recipient_hint": "Laissez votre nom d'utilisateur pour power up vous-même",
    "power.delegatee": "Déléguer À",
    "power.delegatee_placeholder": "nom d'utilisateur",
    "power.amount_token": "Montant ({token})",
    "power.amount_vests": "Montant ({power})",
    "power.powerup_hint": "Ceci convertira {token} en {power}",
    "power.powerdown_hint": "Entrez le montant en {power} pour power down",
    "power.delegate_hint": "Entrez le montant en {power} pour déléguer",
    "power.invalid_amount": "Veuillez entrer un montant valide",
    "power.invalid_recipient": "Veuillez entrer un destinataire valide",
    "power.active_key_required": "La clé active est requise pour cette opération",
    "power.operation_failed": "Opération échouée",
    "power.success": "Opération réussie !",
    "power.stop_powerdown": "Arrêter Power Down",
    "power.stop_powerdown_warning": "Ceci annulera votre power down actif. Cliquez sur Confirmer pour continuer.",
    "power.available_power": "{power} Disponible",
    // Savings Operations
    "savings.deposit_title": "Déposer en Épargne",
    "savings.withdraw_title": "Retirer de l'Épargne",
    "savings.deposit_desc": "Gagnez des intérêts en déposant {token} en épargne",
    "savings.withdraw_desc": "Retirer {token} de l'épargne (période d'attente de 3 jours)",
    "savings.account": "Compte",
    "savings.amount": "Montant ({token})",
    "savings.deposit_hint": "Les fonds seront disponibles pour retrait après 3 jours",
    "savings.withdraw_hint": "Le retrait sera traité après 3 jours",
    "savings.deposit_info": "L'épargne génère des intérêts et a une période de retrait de 3 jours pour la sécurité",
    "savings.withdraw_info": "Les retraits prennent 3 jours à traiter. Vous pouvez annuler pendant ce temps.",
    "savings.invalid_amount": "Veuillez entrer un montant valide",
    "savings.active_key_required": "La clé active est requise pour cette opération",
    "savings.operation_failed": "Opération échouée",
    "savings.success": "Opération réussie !",
    "savings.not_available": "Non Disponible",
    "savings.blurt_not_supported": "Blurt ne supporte pas la fonction d'épargne",
    // RC Operations
    "rc.hive_only": "La délégation de Crédits de Ressources (RC) n'est disponible que sur la blockchain Hive.",
    "rc.delegate_title": "Déléguer Crédits de Ressources",
    "rc.undelegate_title": "Retirer Délégation RC",
    "rc.delegate_desc": "Aidez les nouveaux comptes en leur déléguant des Crédits de Ressources.",
    "rc.undelegate_desc": "Arrêter de déléguer des RC à un compte.",
    "rc.from_account": "Depuis le Compte",
    "rc.delegatee": "Déléguer À",
    "rc.delegatee_placeholder": "nom d'utilisateur",
    "rc.max_rc": "Montant RC",
    "rc.max_rc_hint": "Entrez le montant de RC que vous souhaitez déléguer.",
    "rc.invalid_delegatee": "Veuillez entrer un nom d'utilisateur valide",
    "rc.invalid_amount": "Veuillez entrer un montant RC valide",
    "rc.active_key_required": "La clé active est requise pour la délégation RC",
    "rc.operation_failed": "Opération RC échouée",
    "rc.success": "Délégation RC mise à jour avec succès !",
    "rc.not_available": "RC Non Disponible",
    "rc.delegate_info": "Déléguer des RC permet aux comptes d'effectuer plus d'opérations sur Hive.",
    "rc.undelegate_info": "Ceci supprimera la délégation RC de ce compte."
  },
  de: {
    "landing.welcome": "Willkommen zurück",
    "landing.subtitle": "Wählen Sie ein Netzwerk zur Verwaltung Ihrer Assets",
    "landing.manage_keys": "Schlüssel verwalten",
    "landing.dapp_browser": "dApp Browser",
    "wallet.active_key_tooltip": "Aktiver Schlüssel vorhanden",
    "wallet.posting_key_tooltip": "Posting-Schlüssel vorhanden",
    "wallet.refresh_tooltip": "Guthaben aktualisieren",
    "wallet.send": "Senden",
    "wallet.receive": "Empfangen",
    "wallet.history": "Verlauf",
    "wallet.keys": "SCHLÜSSEL",
    "wallet.network_label": "Aktives Netzwerk",
    "wallet.no_accounts_chain": "Keine Konten für {chain} hinzugefügt",
    "wallet.add_one": "Konto hinzufügen",
    "bulk.analyze": "Sicherheit analysieren",
    "bulk.analyzing": "Analysiere...",
    "bulk.success": "Analyse: Keine Risiken gefunden.",
    "bulk.switch_network": "Netzwerk wechseln",
    // Sidebar
    "sidebar.home": "Start",
    "sidebar.wallet": "Wallet",
    "sidebar.bulk": "Massenüberweisung",
    "sidebar.multisig": "MultiSig",
    "sidebar.manage": "Einstellungen",
    "sidebar.pair": "Telefon koppeln",
    "sidebar.lock": "Sperren",
    "sidebar.pin": "Fenster lösen",
    "sidebar.dock": "Fenster andocken",
    "sidebar.language": "Sprache",
    // Actions
    "action.select_network": "Netzwerk wählen",
    "action.manage_keys": "Schlüssel verwalten",
    // Header
    "header.add": "Konto hinzufügen",
    "common.cancel": "Abbrechen",
    "common.confirm": "Bestätigen",
    "common.close": "Schließen",
    "common.processing": "Verarbeitung...",
    "common.recent_recipients": "Letzte Empfänger",
    "common.account_not_found": "Konto nicht gefunden",
    // Import
    "import.title": "Wallet importieren",
    "import.manual": "Manuelle Eingabe",
    "import.file": "Datei hochladen",
    "import.select_chain": "Kette wählen",
    "import.username": "Benutzername",
    "import.checking": "Prüfe Kette...",
    "import.found": "✓ Gefunden",
    "import.not_found": "Konto nicht gefunden",
    "import.private_keys": "Private Schlüssel (Mindestens einen einfügen)",
    "import.key_posting": "POSTING KEY",
    "import.key_active": "ACTIVE KEY",
    "import.key_memo": "MEMO KEY",
    "import.invalid_format": "Ungültiges Format",
    "import.save": "Konto speichern",
    "import.verifying": "Verifiziere...",
    "import.placeholder_username": "benutzername",
    "import.placeholder_key": "Beginnt mit 5...",
    "import.error_username": "Bitte geben Sie einen gültigen Benutzernamen ein.",
    "import.error_format": "Ein oder mehrere Schlüssel haben ein ungültiges Format.",
    "import.error_missing_key": "Sie müssen mindestens einen privaten Schlüssel angeben.",
    "import.match_error_posting": "Posting-Schlüssel passt nicht zum Konto.",
    "import.match_error_active": "Aktiver Schlüssel passt nicht zum Konto.",
    "import.match_error_memo": "Memo-Schlüssel passt nicht zum Konto.",
    "import.success_file_parsed": "Datei verarbeitet. Konten: ",
    "import.error_file_read": "Fehler beim Lesen der Datei.",
    "import.drag_drop": "JSON/CSV/TXT Datei hierher ziehen",
    "import.click_upload": "oder klicken zum Hochladen",
    "import.processing": "Verarbeite...",
    "import.bulk_summary": "{count} Konten importiert.",
    "import.no_valid_accounts": "Keine gültigen Konten gefunden.",
    // Settings
    "settings.title": "Wallet konfigurieren",
    "settings.accounts_title": "Verwaltete Konten",
    "settings.remove": "Entfernen",
    "settings.add_new": "Neues Konto hinzufügen",
    "settings.no_accounts": "Keine Konten gefunden.",
    "settings.security_title": "Sicherheit",
    "settings.change_password": "Passwort ändern",
    "settings.biometrics": "Biometrie verwenden",
    "settings.reset": "Wallet zurücksetzen",
    "pair.section_title": "Weiteres Gerät Koppeln",
    "pair.section_subtitle": "Erzeuge auf dem neuen Gerät einen Empfangscode. Gib diesen Code auf dem aktuellen Gerät ein und bestätige die verschlüsselte Übertragung.",
    "pair.send_cta": "An Neues Gerät Senden",
    "pair.receive_cta": "Empfangscode Anzeigen",
    "pair.step_badge_send": "Schritt 2 von 2",
    "pair.step_badge_receive": "Schritt 1 von 2",
    "pair.send_title": "An Anderes Gerät Senden",
    "pair.send_subtitle": "Gib den Empfangscode ein, der auf dem Zielgerät angezeigt wird. Es wird nichts gesendet, bis du hier bestätigst.",
    "pair.receive_title": "Auf Diesem Gerät Empfangen",
    "pair.receive_subtitle": "Lass diesen Code auf diesem Gerät sichtbar. Wähle auf dem Gerät mit der vorhandenen Wallet Senden und gib dort diesen Code ein.",
    "pair.code_label": "Empfangscode",
    "pair.copy_code": "Code Kopieren",
    "pair.preparing": "Sichere Sitzung wird vorbereitet...",
    "pair.waiting_source": "Warte auf Quellgerät...",
    "pair.importing": "Verschlüsselte Wallet wird empfangen und importiert...",
    "pair.receive_complete": "Import Abgeschlossen",
    "pair.receive_success_message": "Wallet erfolgreich empfangen. {count} Konten importiert.",
    "pair.transfer_error": "Übertragungsfehler",
    "pair.receive_error": "Daten konnten nicht empfangen werden",
    "pair.accounts_label": "Konten",
    "pair.settings_label": "Einstellungen",
    "pair.chat_identity_label": "Chat-Identität",
    "pair.included": "Enthalten",
    "pair.basic_only": "Nur Basis",
    "pair.not_found": "Nicht gefunden",
    "pair.pair_devices": "Geräte Koppeln",
    "pair.waiting_handshake": "Warte auf sicheren Handshake...",
    "pair.approve_and_send": "Bestätigen und Senden",
    "pair.sending": "Wallet wird verschlüsselt und gesendet...",
    "pair.send_complete": "Übertragung Abgeschlossen",
    "pair.send_complete_subtitle": "Das Zielgerät kann die Wallet jetzt importieren.",
    "pair.connect_error": "Kopplung mit dem Zielgerät nicht möglich",
    "pair.send_error": "Die verschlüsselte Wallet konnte nicht gesendet werden",
    "pair.e2ee_notice": "Dieses Gerät legt private Daten niemals im Klartext offen.",
    "pair.e2ee_transfer": "Ende-zu-Ende-verschlüsselte manuelle Übertragung",
    // MultiSig
    "multisig.title": "MultiSig Wallet",
    "multisig.initiator": "Initiator",
    "multisig.threshold": "Schwelle",
    "multisig.signers": "Unterzeichner",
    "multisig.proposal": "Vorschlag",
    "multisig.expiration": "Ablauf",
    "multisig.create": "Vorschlag erstellen",
    "multisig.approve": "Genehmigen",
    "multisig.construction_title": "In Bau...",
    "multisig.construction_desc": "Wir entwickeln diese Funktion für maximale Sicherheit.",
    // Bulk
    "bulk.title": "Massenüberweisung",
    "bulk.recipients": "Empfänger",
    "bulk.count": "Anzahl",
    "bulk.check": "Gültigkeit prüfen",
    "bulk.checking": "Prüfe...",
    "bulk.amount": "Betrag",
    "bulk.memo": "Memo",
    "bulk.same_amount": "Gleicher Betrag",
    "bulk.diff_amount": "Unterschiedliche Beträge",
    "bulk.add_row": "+ Zeile hinzufügen",
    "bulk.verify": "Verifizieren",
    "bulk.import": "CSV/TXT importieren",
    "bulk.total": "Gesamt",
    "bulk.sign_broadcast": "Signieren & Senden",
    "bulk.no_accounts": "Keine {chain} Konten gefunden.",
    "bulk.sending_from": "Senden von",
    "bulk.asset": "Asset:",
    "bulk.available": "Verfügbar:",
    "bulk.title_single": "Verteilung gleicher Betrag",
    "bulk.title_multi": "Verteilung unterschiedliche Beträge",
    "bulk.validation_error": "Validierungsfehler",
    "bulk.error_remove_invalid": "Bitte entfernen Sie ungültige Konten vor dem Senden.",
    "bulk.success_title": "Erfolg!",
    "bulk.success_msg": "{n} Überweisungen erfolgreich gesendet. TXID: {txid}...",
    "bulk.error_title": "Fehler",
    "bulk.error_failed": "Senden fehlgeschlagen",
    "bulk.warn_not_found": "[WARN] Warnung: {n} Benutzer nicht auf der {chain} Chain gefunden.",
    "bulk.error_no_active": "Aktiver Schlüssel für dieses Konto nicht gefunden.",
    // Lock Screen
    "lock.title": "Willkommen zurück",
    "lock.unlock": "Entsperren",
    "lock.password_placeholder": "Passwort eingeben",
    "lock.pin_placeholder": "6-stellige PIN",
    "lock.use_pin": "PIN verwenden",
    "lock.use_password": "Passwort verwenden",
    "lock.biometrics": "Mit Biometrie entsperren",
    "lock.reset": "Zurücksetzen",
    "lock.confirm_reset": "Sicher? Alle Daten werden gelöscht!",
    "lock.create_title": "Master-Passwort erstellen",
    "lock.unlock_title": "Wallet entsperren",
    "lock.create_btn": "Wallet erstellen",
    "lock.unlock_btn": "Entsperren",
    "lock.processing": "Verarbeite...",
    "lock.placeholder_create": "Passwort festlegen",
    "lock.placeholder_enter": "Passwort eingeben",
    "lock.error_length": "Passwort muss mindestens 8 Zeichen lang sein",
    "lock.or_sign_up": "Oder registrieren mit",
    "lock.or_unlock": "Oder entsperren mit",
    "lock.clear_reset": "Lokale Daten löschen & Reset",
    "lock.session_expired": "Sitzung abgelaufen. Bitte entsperren.",
    "lock.confirm_password": "Passwort bestätigen",
    "lock.passwords_not_match": "Passwörter stimmen nicht überein",
    "lock.weak": "Schwach",
    "lock.medium": "Mittel",
    "lock.strong": "Stark",
    "lock.very_strong": "Sehr Stark",
    "lock.security_strength": "Sicherheit",
    // Auth
    "auth.authenticator": "Authenticator App (2FA)",
    "auth.configure_title": "Authenticator einrichten",
    "auth.scan_qr": "Scannen Sie diesen QR-Code mit Aegis oder Google Auth.",
    "auth.enter_code": "Geben Sie den 6-stelligen Code zur Überprüfung ein.",
    "auth.verify": "Überprüfen",
    "auth.success": "Authenticator erfolgreich konfiguriert!",
    "auth.backup_code": "Backup-Schlüssel (Manuelle Eingabe)",
    "auth.configure_desc": "Konfigurieren Sie Aegis, Google Auth oder Authy",
    // Manage Account
    "manage.title": "Konto verwalten",
    "manage.subtitle": "@{name} • {chain}",
    "manage.invalid_posting": "Ungültiges Posting-Key-Format",
    "manage.invalid_active": "Ungültiges Active-Key-Format",
    "manage.invalid_memo": "Ungültiges Memo-Key-Format",
    "manage.validating": "Validiere Schlüssel...",
    "manage.save_verify": "Speichern & Prüfen",
    "manage.remove_link": "Konto entfernen",
    "manage.verify_fail": "Schlüsselvalidierung fehlgeschlagen: ",
    "manage.success": "Konto verifiziert und gespeichert!",
    "manage.confirm_remove_title": "@{name} entfernen?",
    "manage.confirm_remove_desc": "Entfernt die Schlüssel. Kann nicht rückgängig gemacht werden.",
    "manage.cancel": "Abbrechen",
    "manage.confirm_remove": "Entfernen",
    "manage.label_posting": "Posting-Schlüssel",
    "manage.label_active": "Aktiver Schlüssel",
    "manage.label_memo": "Memo-Schlüssel",
    "manage.add_posting": "Posting-Schlüssel hinzufügen",
    "manage.add_active": "Aktiven Schlüssel hinzufügen",
    "manage.add_memo": "Memo-Schlüssel hinzufügen",
    // Security
    "security.analysis_prompt": "Bitte analysieren Sie diese Krypto-Transaktion auf Risiken in Deutsch: ",
    // History
    "history.title": "Verlauf: {user}",
    "history.loading": "Lade Verlauf...",
    "history.empty": "Keine kürzlichen Überweisungen gefunden.",
    "history.received": "Empfangen",
    "history.sent": "Gesendet",
    "history.from": "Von",
    "history.to": "An",
    // Sign Request
    "sign.title": "Signaturanfrage",
    "sign.transfer_title": "Überweisungsanfrage",
    "sign.vote_title": "Abstimmungsanfrage",
    "sign.custom_json_title": "Benutzerdefiniertes JSON",
    "sign.operation": "Operation",
    "sign.params": "Parameter",
    "sign.author": "Autor",
    "sign.weight": "Gewicht",
    "sign.id": "ID",
    "sign.json_payload": "Inhalt",
    "sign.from": "Von",
    "sign.to": "An",
    "sign.reject": "Ablehnen",
    "sign.confirm": "Bestätigen",
    "sign.signing": "Signiere...",
    "sign.local_file": "Lokale Datei",
    "sign.unknown_source": "Unbekannte Quelle",
    "sign.loading": "Lade Anfrage...",
    "sign.error": "Fehler",
    "sign.account_not_found": "Konto nicht in dieser Wallet gefunden.",
    "sign.keys_missing": "Schlüssel fehlen für dieses Konto.",
    "sign.active_key_missing": "Aktiver Schlüssel fehlt",
    "sign.key_missing_type": "{type}-Schlüssel fehlt für dieses Konto",
    "sign.key_missing_generic": "{type}-Schlüssel fehlt",
    "sign.user_rejected": "Benutzer hat Anfrage abgelehnt",
    "sign.success": "Erfolgreich signiert",
    "sign.trust_domain": "Dieser Seite vertrauen",
    "sign.expired": "Anfrage abgelaufen oder nicht gefunden",
    "sign.buffer_title": "Nachricht signieren",
    "sign.message_label": "Nachricht",
    "sign.key_type": "Schlüssel",
    // Errors
    "validation.invalid_amount": "Bitte geben Sie einen gültigen Betrag > 0 ein.",
    "validation.required": "Alle Felder sind erforderlich.",
    "validation.account_not_found": "Konto nicht auf {chain} gefunden",
    // Transfer
    "transfer.available": "Verfügbar:",
    "transfer.memo_placeholder": "Öffentliche Notiz",
    "transfer.review_title": "Überweisung bestätigen",
    "transfer.review_btn": "Überweisung prüfen",
    "transfer.back": "Zurück",
    "transfer.total_amount": "Gesamtbetrag",
    "transfer.per_user": "Pro Benutzer:",
    "transfer.please_review": "Bitte sorgfältig prüfen.",
    "transfer.operations": "Operationen",
    "transfer.no_memo": "Kein Memo",
    "transfer.optional": "(Optional)",
    // Receive
    "receive.title": "Guthaben empfangen",
    "receive.scan_qr": "QR scannen um {chain} an dieses Konto zu senden",
    "receive.account_name": "Kontoname",
    "receive.copied": "Kopiert!",
    "receive.copy": "Kopieren",
    "receive.close": "Schließen",
    // Hilfe
    "help.title": "Benutzerhandbuch",
    "help.keys_title": "Schlüsselverwaltung",
    "help.keys_desc": "Ihre Kontosicherheit hängt von Ihren Schlüsseln ab. Teilen Sie niemals Ihr Master-Passwort oder Ihre privaten Schlüssel.",
    "help.posting_key_label": "Posting-Schlüssel",
    "help.posting_key_desc": "Verwenden Sie dies für soziale Aktionen wie Abstimmen und Posten.",
    "help.active_key_label": "Aktiver Schlüssel",
    "help.active_key_desc": "Erforderlich für Finanztransaktionen wie Überweisungen.",
    "help.memo_key_label": "Memo-Schlüssel",
    "help.memo_key_desc": "Wird zum Verschlüsseln und Entschlüsseln privater Nachrichten verwendet.",
    "help.transactions_title": "Transaktionen",
    "help.transactions_desc": "Verwalten Sie Ihre Assets einfach über mehrere Ketten hinweg.",
    "help.transfers_point": "Senden Sie Gelder sicher an jeden Benutzer.",
    "help.history_point": "Sehen Sie eingehende und ausgehende Überweisungen.",
    "help.bulk_point": "Verwenden Sie Massenüberweisung für Verteilungen.",
    "help.security_title": "Sicherheit zuerst",
    "help.security_desc": "Transaktionen werden lokal signiert. Ihre Schlüssel verlassen Ihr Gerät nie unverschlüsselt.",
    "help.chat_title": "Gravity Live Chat",
    "help.chat_desc": "Echtzeit-Nachrichten mit Räumen und DMs.",
    "help.chat_warning": "Dieser Chat verwendet eine eindeutige ID, getrennt von Ihren Wallets.",
    "help.chat_cost": "Kostenlos & Sofort (Off-chain)",
    // Help Buttons
    "help.btn_home": "Zurück zum Hauptbildschirm, um ein Netzwerk auszuwählen.",
    "help.btn_wallet": "Zugriff auf Ihre Konten, Guthaben und Aktionen.",
    "help.btn_bulk": "Senden Sie Gelder an mehrere Konten in einer einzigen Transaktion.",
    "help.btn_multisig": "Multi-Signatur-Konten verwalten (Bald verfügbar).",
    "help.btn_settings": "Konten, Sicherheit und Einstellungen konfigurieren.",
    "help.btn_lock": "Ihr Wallet sofort sperren.",
    "help.btn_detach": "Öffnen Sie das Wallet in einem separaten schwebenden Fenster.",
    "help.btn_send": "Gelder an einen anderen Benutzer überweisen.",
    "help.btn_receive": "QR-Code anzeigen, um Gelder zu empfangen.",
    "help.btn_history": "Ihren letzten Transaktionsverlauf anzeigen.",
    "help.btn_keys": "Ihre privaten Schlüssel anzeigen und verwalten.",
    "help.btn_powerup": "Tokens in Power umwandeln, um Abstimmungseinfluss zu erhöhen.",
    "help.btn_powerdown": "Den 13-wöchigen Power-Down-Prozess starten.",
    "help.btn_delegate": "Ihre Power an ein anderes Konto delegieren.",
    "help.btn_savings": "Stablecoins einzahlen, um Zinsen zu verdienen (nur Hive/Steem).",
    "help.btn_rc": "Resource Credits delegieren, um anderen zu helfen (nur Hive).",
    "help.power_title": "Power & Staking",
    "help.power_desc": "Setzen Sie Ihre Tokens durch Staking (Power Up) ein.",
    "help.power_point": "Power Up, um Ihren Abstimmungseinfluss zu erhöhen und mehr Belohnungen zu verdienen.",
    "help.power_down_point": "Power Down wandelt Power über 13 Wochen zurück in Tokens um.",
    "help.delegate_point": "Delegieren Sie Power an andere, ohne das Eigentum zu verlieren.",
    "help.savings_title": "Ersparnisse & RC",
    "help.savings_desc": "Erweiterte Funktionen für Hive und Steem.",
    "help.savings_point": "HBD/SBD in Ersparnisse einzahlen, um Zinsen zu verdienen (3-Tage-Abhebungsfrist).",
    "help.rc_point": "Resource Credits delegieren (nur Hive), um neuen Benutzern zu helfen.",
    "help.section_actions": "Kontoaktionen",
    "help.section_navigation": "Hauptnavigation",
    "help.chat_memo_required": "Direktnachrichten (DMs) sind Ende-zu-Ende-Verschlüsselt. Öffentliche Räume sind nicht verschlüsselt.",
    "help.2fa_title": "Zwei-Faktor-Authentifizierung",
    "help.2fa_multi_app_question": "Kann ich mehrere Apps verwenden? (Aegis + Google Auth)",
    "help.2fa_multi_app_answer": "Ja! Sie können denselben Code auf mehreren Geräten oder Apps gleichzeitig generieren lassen. Dazu:",
    "help.2fa_step1": "Gehen Sie zu Einstellungen > Authenticator App, um den QR-Code anzuzeigen.",
    "help.2fa_step2": "Scannen Sie diesen QR-Code mit Aegis.",
    "help.2fa_step3": "Scannen Sie ihn erneut mit Google Authenticator.",
    "help.2fa_step4": "Beide Apps generieren nun identische Codes, die zum Entsperren funktionieren.",
    "help.visual_guides": "Visuelle Anleitungen",
    "help.visual_guides_desc": "So konfigurieren Sie Ihr Wallet sicher:",
    // Lock Screen additions
    "lock.signup": "Registrieren",
    "lock.unlock_label": "Entsperren",
    "lock.google": "Google",
    "lock.device": "GeräteSchlüssel",
    "lock.2fa": "2FA Auth",
    "lock.secure_by_design": "Sicher durch Design",
    "lock.google_title": "Wallet mit Google OAuth einrichten",
    "lock.device_title": "Wallet mit lokalen Hardware-Schlüsseln einrichten",
    "lock.google_unlock_title": "Mit Google entsperren",
    "lock.device_unlock_title": "Mit Geräteschlüssel entsperren",
    "lock.error_incorrect_password": "Falsches Passwort",
    "lock.error_totp_not_configured": "Authenticator nicht konfiguriert. Bitte mit Passwort entsperren und in Einstellungen konfigurieren.",
    "lock.error_setup_failed": "Fehler beim Initialisieren des passwortlosen Wallets.",
    "lock.error_decrypt_failed": "Daten konnten nicht entschlüsselt werden (Ungültiger {method}-Schlüssel).",
    "lock.error_no_auth_data": "Keine {method}-Authentifizierungsdaten gefunden. Verwenden Sie Passwort.",
    "lock.connecting_google": "Verbinde mit Google...",
    "lock.error_auth_failed": "{method}-Authentifizierung fehlgeschlagen",
    "lock.error_config_missing": "Konfigurationsfehler (Geheimnis fehlt)",
    "lock.totp_verified_pin": "TOTP verifiziert. PIN eingeben.",
    "lock.error_no_key_after_totp": "Kein sicherer Schlüssel nach TOTP gefunden.",
    "lock.error_invalid_code": "Ungültiger Code",
    "lock.error_init_pin_failed": "Fehler beim Initialisieren des PIN-Wallets.",
    "lock.error_decryption_corrupt": "Entschlüsselung fehlgeschlagen (Beschädigter Tresor?).",
    "lock.error_incorrect_pin": "Falsche PIN",
    // Chat
    "chat.title": "Gravity Messenger",
    "chat.status_connected": "Online",
    "chat.status_connecting": "Verbinde...",
    "chat.status_disconnected": "Offline",
    "chat.placeholder_username": "Benutzernamen wählen...",
    "chat.btn_join": "Chat beitreten",
    "chat.btn_logout": "Abmelden",
    "chat.rooms": "Räume",
    "chat.search": "Benutzer suchen...",
    "chat.no_rooms": "Keine Räume gefunden",
    "chat.lobby": "Globale Lobby",
    "chat.create_room": "Raum erstellen",
    "chat.room_name": "Raumname",
    "chat.private": "Privater Raum",
    "chat.btn_create": "Erstellen",
    "chat.invite_user": "Benutzer einladen",
    "chat.invited_to": "Sie wurden zu {room} eingeladen",
    "chat.message_placeholder": "Nachricht eingeben...",
    "chat.clear_identity": "Blockierte Identität löschen",
    "chat.room_participants": "Teilnehmer",
    "chat.no_messages": "Noch keine Nachrichten. Sagen Sie Hallo!",
    "chat.invite_placeholder": "Benutzername zum Einladen...",
    "chat.btn_invite": "Einladen",
    "chat.confirm_delete": "Raum löschen?",
    "chat.confirm_kick": "Benutzer entfernen?",
    "chat.confirm_ban": "Benutzer bannen?",
    "chat.btn_confirm": "Bestätigen",
    "chat.btn_cancel": "Abbrechen",
    "chat.error_reg_failed": "Registrierung fehlgeschlagen",
    "chat.owner_label": "Besitzer",
    // Sidebar additions
    "sidebar.messenger": "Messenger",
    "sidebar.help": "Hilfe",
    // Power Operations
    "power.powerup_title": "Power Up",
    "power.powerdown_title": "Power Down",
    "power.delegate_title": "Power delegieren",
    "power.powerup_desc": "{token} in {power} umwandeln, um Ihre Abstimmungskraft zu erhöhen",
    "power.powerdown_desc": "Power Down Ihres {power} starten (13-Wochen-Prozess)",
    "power.delegate_desc": "Ihre {power} an ein anderes Konto delegieren",
    "power.from_account": "Vom Konto",
    "power.recipient": "Empfänger",
    "power.recipient_placeholder": "benutzername",
    "power.recipient_hint": "Lassen Sie Ihren Benutzernamen, um sich selbst zu power uppen",
    "power.delegatee": "Delegieren an",
    "power.delegatee_placeholder": "benutzername",
    "power.amount_token": "Betrag ({token})",
    "power.amount_vests": "Betrag ({power})",
    "power.powerup_hint": "Dies wird {token} in {power} umwandeln",
    "power.powerdown_hint": "Betrag in {power} für Power Down eingeben",
    "power.delegate_hint": "Betrag in {power} zum Delegieren eingeben",
    "power.invalid_amount": "Bitte geben Sie einen gültigen Betrag ein",
    "power.invalid_recipient": "Bitte geben Sie einen gültigen Empfänger ein",
    "power.active_key_required": "Aktiver Schlüssel ist für diese Operation erforderlich",
    "power.operation_failed": "Operation fehlgeschlagen",
    "power.success": "Operation erfolgreich!",
    "power.stop_powerdown": "Power Down stoppen",
    "power.stop_powerdown_warning": "Dies wird Ihren aktiven Power Down abbrechen. Klicken Sie auf Bestätigen, um fortzufahren.",
    "power.available_power": "{power} Verfügbar",
    // Savings Operations
    "savings.deposit_title": "In Ersparnisse einzahlen",
    "savings.withdraw_title": "Aus Ersparnissen abheben",
    "savings.deposit_desc": "Verdienen Sie Zinsen, indem Sie {token} in Ersparnisse einzahlen",
    "savings.withdraw_desc": "{token} aus Ersparnissen abheben (3 Tage Wartezeit)",
    "savings.account": "Konto",
    "savings.amount": "Betrag ({token})",
    "savings.deposit_hint": "Gelder sind nach 3 Tagen zur Abhebung verfügbar",
    "savings.withdraw_hint": "Abhebung wird nach 3 Tagen verarbeitet",
    "savings.deposit_info": "Ersparnisse verdienen Zinsen und haben eine 3-Tage-Abhebungsfrist zur Sicherheit",
    "savings.withdraw_info": "Abhebungen dauern 3 Tage zur Verarbeitung. Sie können während dieser Zeit stornieren.",
    "savings.invalid_amount": "Bitte geben Sie einen gültigen Betrag ein",
    "savings.active_key_required": "Aktiver Schlüssel ist für diese Operation erforderlich",
    "savings.operation_failed": "Operation fehlgeschlagen",
    "savings.success": "Operation erfolgreich!",
    "savings.not_available": "Nicht verfügbar",
    "savings.blurt_not_supported": "Blurt unterstützt die Ersparnisfunktion nicht",
    // RC Operations
    "rc.hive_only": "Resource Credits (RC) Delegation ist nur auf der Hive-Blockchain verfügbar.",
    "rc.delegate_title": "Resource Credits delegieren",
    "rc.undelegate_title": "RC-Delegation aufheben",
    "rc.delegate_desc": "Helfen Sie neuen Konten, indem Sie ihnen Resource Credits delegieren.",
    "rc.undelegate_desc": "RC-Delegation an ein Konto beenden.",
    "rc.from_account": "Vom Konto",
    "rc.delegatee": "Delegieren an",
    "rc.delegatee_placeholder": "benutzername",
    "rc.max_rc": "RC-Betrag",
    "rc.max_rc_hint": "Geben Sie den RC-Betrag ein, den Sie delegieren möchten.",
    "rc.invalid_delegatee": "Bitte geben Sie einen gültigen Benutzernamen ein",
    "rc.invalid_amount": "Bitte geben Sie einen gültigen RC-Betrag ein",
    "rc.active_key_required": "Aktiver Schlüssel ist für RC-Delegation erforderlich",
    "rc.operation_failed": "RC-Operation fehlgeschlagen",
    "rc.success": "RC-Delegation erfolgreich aktualisiert!",
    "rc.not_available": "RC nicht verfügbar",
    "rc.delegate_info": "RC-Delegation ermöglicht Konten, mehr Operationen auf Hive durchzuführen.",
    "rc.undelegate_info": "Dies wird die RC-Delegation von diesem Konto entfernen."
  },
  it: {
    "landing.welcome": "Bentornato",
    "landing.subtitle": "Seleziona una rete per gestire le tue risorse",
    "landing.manage_keys": "Gestisci Chiavi",
    "landing.dapp_browser": "Browser dApp",
    "wallet.active_key_tooltip": "Chiave Attiva Presente",
    "wallet.posting_key_tooltip": "Chiave Posting Presente",
    "wallet.refresh_tooltip": "Aggiorna Saldi",
    "wallet.send": "Invia",
    "wallet.receive": "Ricevi",
    "wallet.history": "Storico",
    "wallet.keys": "CHIAVI",
    "wallet.network_label": "Rete Attiva",
    "wallet.no_accounts_chain": "Nessun account aggiunto per {chain}",
    "wallet.add_one": "Aggiungi Account",
    "bulk.analyze": "Analisi Sicurezza",
    "bulk.analyzing": "Analisi in corso...",
    "bulk.success": "Analisi: Nessun rischio rilevato.",
    "bulk.switch_network": "Cambia Rete",
    // Sidebar
    "sidebar.home": "Home",
    "sidebar.wallet": "Portafoglio",
    "sidebar.bulk": "Trasferimento Multiplo",
    "sidebar.multisig": "MultiSig",
    "sidebar.manage": "Impostazioni",
    "sidebar.pair": "Abbina telefono",
    "sidebar.lock": "Blocca",
    "sidebar.pin": "Stacca Finestra",
    "sidebar.dock": "Ancora Finestra",
    "sidebar.language": "Lingua",
    // Actions
    "action.select_network": "Seleziona Rete",
    "action.manage_keys": "Gestisci Chiavi",
    // Header
    "header.add": "Aggiungi Account",
    "common.cancel": "Annulla",
    "common.confirm": "Conferma",
    "common.close": "Chiudi",
    "common.processing": "Elaborazione...",
    "common.recent_recipients": "Destinatari Recenti",
    "common.account_not_found": "Account non trovato",
    // Import
    "import.title": "Importa Portafoglio",
    "import.manual": "Inserimento Manuale",
    "import.file": "Carica File",
    "import.select_chain": "Seleziona Catena",
    "import.username": "Nome Utente",
    "import.checking": "Controllo catena...",
    "import.found": "[OK] Trovato",
    "import.not_found": "Account non trovato",
    "import.private_keys": "Chiavi Private (Incolla almeno una)",
    "import.key_posting": "CHIAVE POSTING",
    "import.key_active": "CHIAVE ACTIVE",
    "import.key_memo": "CHIAVE MEMO",
    "import.invalid_format": "Formato Non Valido",
    "import.save": "Salva Account",
    "import.verifying": "Verifica...",
    "import.placeholder_username": "nome utente",
    "import.placeholder_key": "Inizia con 5...",
    "import.error_username": "Inserisci un nome utente valido.",
    "import.error_format": "Una o più chiavi hanno un formato non valido.",
    "import.error_missing_key": "Devi fornire almeno una chiave privata.",
    "import.match_error_posting": "La Chiave Posting non corrisponde all'account.",
    "import.match_error_active": "La Chiave Active non corrisponde all'account.",
    "import.match_error_memo": "La Chiave Memo non corrisponde all'account.",
    "import.success_file_parsed": "File analizzato. Account: ",
    "import.error_file_read": "Errore lettura file.",
    "import.drag_drop": "Trascina file JSON/CSV/TXT",
    "import.click_upload": "o clicca per caricare",
    "import.processing": "Elaborazione...",
    "import.bulk_summary": "Importati {count} account.",
    "import.no_valid_accounts": "Nessun account valido trovato.",
    // Settings
    "settings.title": "Configura il tuo wallet",
    "settings.accounts_title": "Account Gestiti",
    "settings.remove": "Rimuovi",
    "settings.add_new": "Aggiungi Nuovo Account",
    "settings.no_accounts": "Nessun account trovato.",
    "settings.security_title": "Sicurezza",
    "settings.change_password": "Cambia Password",
    "settings.biometrics": "Usa Biometria",
    "settings.reset": "Reimposta Wallet",
    "pair.section_title": "Abbina un Altro Dispositivo",
    "pair.section_subtitle": "Sul nuovo dispositivo genera un codice di ricezione. Sul dispositivo attuale inserisci quel codice e approva il trasferimento cifrato.",
    "pair.send_cta": "Invia al Nuovo Dispositivo",
    "pair.receive_cta": "Ottieni Codice",
    "pair.step_badge_send": "Passo 2 di 2",
    "pair.step_badge_receive": "Passo 1 di 2",
    "pair.send_title": "Invia a un Altro Dispositivo",
    "pair.send_subtitle": "Inserisci il codice di ricezione mostrato sul dispositivo di destinazione. Nulla viene inviato finché non confermi qui.",
    "pair.receive_title": "Ricevi su Questo Dispositivo",
    "pair.receive_subtitle": "Tieni visibile questo codice su questo dispositivo. Sul dispositivo che ha già il wallet, scegli invia e inserisci lì questo codice.",
    "pair.code_label": "Codice di ricezione",
    "pair.copy_code": "Copia Codice",
    "pair.preparing": "Preparazione della sessione sicura...",
    "pair.waiting_source": "In attesa del dispositivo sorgente...",
    "pair.importing": "Ricezione e importazione del wallet cifrato...",
    "pair.receive_complete": "Importazione Completata",
    "pair.receive_success_message": "Wallet ricevuto correttamente. Importati {count} account.",
    "pair.transfer_error": "Errore di Trasferimento",
    "pair.receive_error": "Impossibile ricevere i dati",
    "pair.accounts_label": "Account",
    "pair.settings_label": "Impostazioni",
    "pair.chat_identity_label": "Identità chat",
    "pair.included": "Incluso",
    "pair.basic_only": "Solo base",
    "pair.not_found": "Non trovato",
    "pair.pair_devices": "Abbina Dispositivi",
    "pair.waiting_handshake": "In attesa dell'handshake sicuro...",
    "pair.approve_and_send": "Approva e Invia",
    "pair.sending": "Cifratura e invio del wallet...",
    "pair.send_complete": "Trasferimento Completato",
    "pair.send_complete_subtitle": "Il dispositivo di destinazione ora può importare il wallet.",
    "pair.connect_error": "Impossibile abbinare il dispositivo di destinazione",
    "pair.send_error": "Impossibile inviare il wallet cifrato",
    "pair.e2ee_notice": "Questo dispositivo non espone mai i dati privati in chiaro.",
    "pair.e2ee_transfer": "Trasferimento manuale cifrato end-to-end",
    // MultiSig
    "multisig.title": "Portafoglio MultiSig",
    "multisig.initiator": "Iniziatore",
    "multisig.threshold": "Soglia",
    "multisig.signers": "Firmatari",
    "multisig.proposal": "Proposta",
    "multisig.expiration": "Scadenza",
    "multisig.create": "Crea Proposta",
    "multisig.approve": "Approva",
    "multisig.construction_title": "In Costruzione...",
    "multisig.construction_desc": "Stiamo costruendo questa funzionalità per garantire la massima sicurezza.",
    // Bulk
    "bulk.title": "Trasferimento Multiplo",
    "bulk.recipients": "Destinatari",
    "bulk.count": "Conteggio",
    "bulk.check": "Controlla Validità",
    "bulk.checking": "Controllo...",
    "bulk.amount": "Importo",
    "bulk.memo": "Memo",
    "bulk.same_amount": "Stesso Importo",
    "bulk.diff_amount": "Importi Diversi",
    "bulk.add_row": "+ Aggiungi Riga",
    "bulk.verify": "Verifica",
    "bulk.import": "Importa CSV/TXT",
    "bulk.total": "Totale",
    "bulk.sign_broadcast": "Firma & Trasmetti",
    "bulk.no_accounts": "Nessun account {chain} trovato.",
    "bulk.sending_from": "Invio da",
    "bulk.asset": "Asset:",
    "bulk.available": "Disponibile:",
    "bulk.title_single": "Distribuzione Stesso Importo",
    "bulk.title_multi": "Distribuzione Importi Multipli",
    "bulk.validation_error": "Errore di Validazione",
    "bulk.error_remove_invalid": "Rimuovi gli account non validi prima di inviare.",
    "bulk.success_title": "Successo!",
    "bulk.success_msg": "Inviati {n} trasferimenti con successo. TXID: {txid}...",
    "bulk.error_title": "Errore",
    "bulk.error_failed": "Invio fallito",
    "bulk.warn_not_found": "[WARN] Attenzione: {n} utente/i non trovato/i sulla catena {chain}.",
    "bulk.error_no_active": "Chiave attiva non trovata per questo account.",
    // Lock Screen
    "lock.title": "Bentornato",
    "lock.unlock": "Sblocca Wallet",
    "lock.password_placeholder": "Inserisci Password",
    "lock.pin_placeholder": "PIN 6 cifre",
    "lock.use_pin": "Usa PIN",
    "lock.use_password": "Usa Password",
    "lock.biometrics": "Sblocca con Biometria",
    "lock.reset": "Reimposta",
    "lock.confirm_reset": "Sei sicuro? Cancellerà tutti i dati!",
    "lock.create_title": "Crea Password Principale",
    "lock.unlock_title": "Sblocca il tuo Wallet",
    "lock.create_btn": "Crea Wallet",
    "lock.unlock_btn": "Sblocca",
    "lock.processing": "Elaborazione...",
    "lock.placeholder_create": "Imposta Password",
    "lock.placeholder_enter": "Inserisci Password",
    "lock.error_length": "La password deve essere di almeno 8 caratteri",
    "lock.or_sign_up": "O registrati con",
    "lock.or_unlock": "O sblocca con",
    "lock.clear_reset": "Cancella Dati Locali & Reset",
    "lock.session_expired": "Sessione scaduta. Sblocca per salvare.",
    "lock.confirm_password": "Conferma Password",
    "lock.passwords_not_match": "Le password non corrispondono",
    "lock.weak": "Debole",
    "lock.medium": "Media",
    "lock.strong": "Forte",
    "lock.very_strong": "Molto Forte",
    "lock.security_strength": "Sicurezza",
    // Auth
    "auth.authenticator": "App Autenticatore (2FA)",
    "auth.configure_title": "Configura Autenticatore",
    "auth.scan_qr": "Scansiona questo codice QR con Aegis o Google Auth.",
    "auth.enter_code": "Inserisci il codice a 6 cifre per verificare.",
    "auth.verify": "Verifica",
    "auth.success": "Autenticatore configurato con successo!",
    "auth.backup_code": "Chiave di Backup (Inserimento Manuale)",
    "auth.configure_desc": "Configura Aegis, Google Auth o Authy",
    // Manage Account
    "manage.title": "Gestisci Account",
    "manage.subtitle": "@{name} • {chain}",
    "manage.invalid_posting": "Formato Chiave Posting Invalido",
    "manage.invalid_active": "Formato Chiave Active Invalido",
    "manage.invalid_memo": "Formato Chiave Memo Invalido",
    "manage.validating": "Validazione Chiavi...",
    "manage.save_verify": "Salva & Verifica",
    "manage.remove_link": "Rimuovi Account",
    "manage.verify_fail": "Validazione Chiave Fallita: ",
    "manage.success": "Account verificato e salvato!",
    "manage.confirm_remove_title": "Rimuovere @{name}?",
    "manage.confirm_remove_desc": "Questo rimuoverà le chiavi dell'account. Non si può annullare.",
    "manage.cancel": "Annulla",
    "manage.confirm_remove": "Rimuovi",
    "manage.label_posting": "Chiave Posting",
    "manage.label_active": "Chiave Active",
    "manage.label_memo": "Chiave Memo",
    "manage.add_posting": "Aggiungi Chiave Privata Posting",
    "manage.add_active": "Aggiungi Chiave Privata Active",
    "manage.add_memo": "Aggiungi Chiave Privata Memo",
    // Security
    "security.analysis_prompt": "Per favore analizza questa transazione crypto per rischi in Italiano: ",
    // History
    "history.title": "Cronologia: {user}",
    "history.loading": "Caricamento cronologia...",
    "history.empty": "Nessun trasferimento recente trovato.",
    "history.received": "Ricevuto",
    "history.sent": "Inviato",
    "history.from": "Da",
    "history.to": "A",
    // Sign Request
    "sign.title": "Richiesta Firma",
    "sign.transfer_title": "Richiesta Trasferimento",
    "sign.vote_title": "Richiesta Voto",
    "sign.custom_json_title": "JSON Personalizzato",
    "sign.operation": "Operazione",
    "sign.params": "Parametri",
    "sign.author": "Autore",
    "sign.weight": "Peso",
    "sign.id": "ID",
    "sign.json_payload": "Contenuto",
    "sign.from": "Da",
    "sign.to": "A",
    "sign.reject": "Rifiuta",
    "sign.confirm": "Conferma",
    "sign.signing": "Firma in corso...",
    "sign.local_file": "File Locale",
    "sign.unknown_source": "Fonte Sconosciuta",
    "sign.loading": "Caricamento richiesta...",
    "sign.error": "Errore",
    "sign.account_not_found": "Account non trovato in questo wallet.",
    "sign.keys_missing": "Chiavi mancanti per questo account.",
    "sign.active_key_missing": "Chiave Attiva mancante",
    "sign.key_missing_type": "Chiave {type} mancante per questo account",
    "sign.key_missing_generic": "Chiave {type} mancante",
    "sign.user_rejected": "L'utente ha rifiutato la richiesta",
    "sign.success": "Firmato con successo",
    "sign.trust_domain": "Fidati di questo sito",
    "sign.expired": "Richiesta scaduta o non trovata",
    "sign.buffer_title": "Firma Messaggio",
    "sign.message_label": "Messaggio",
    "sign.key_type": "Chiave",
    // Errors
    "validation.invalid_amount": "Inserisci un importo valido maggiore di 0.",
    "validation.required": "Tutti i campi sono obbligatori.",
    "validation.account_not_found": "Account non trovato su {chain}",
    // Transfer
    "transfer.available": "Disponibile:",
    "transfer.memo_placeholder": "Nota pubblica",
    "transfer.review_title": "Conferma Trasferimento",
    "transfer.review_btn": "Revisiona Trasferimento",
    "transfer.back": "Indietro",
    "transfer.total_amount": "Importo Totale",
    "transfer.per_user": "Per Utente:",
    "transfer.please_review": "Per favore controlla attentamente.",
    "transfer.operations": "Operazioni",
    "transfer.no_memo": "Nessun Memo",
    "transfer.optional": "(Opzionale)",
    // Receive
    "receive.title": "Ricevi Fondi",
    "receive.scan_qr": "Scansiona il QR per inviare {chain} a questo account",
    "receive.account_name": "Nome Account",
    "receive.copied": "Copiato!",
    "receive.copy": "Copia",
    "receive.close": "Chiudi",
    // Aiuto
    "help.title": "Guida Utente",
    "help.keys_title": "Gestione Chiavi",
    "help.keys_desc": "La sicurezza del tuo account dipende dalle tue chiavi. Non condividere mai la Password Principale o le Chiavi Private.",
    "help.posting_key_label": "Chiave Posting",
    "help.posting_key_desc": "Usalo per azioni sociali come votare, pubblicare e seguire.",
    "help.active_key_label": "Chiave Attiva",
    "help.active_key_desc": "Richiesta per transazioni finanziarie come i trasferimenti.",
    "help.memo_key_label": "Chiave Memo",
    "help.memo_key_desc": "Usata per crittografare e decrittografare messaggi privati.",
    "help.transactions_title": "Transazioni",
    "help.transactions_desc": "Gestisci facilmente le tue risorse su più reti.",
    "help.transfers_point": "Invia fondi a qualsiasi utente in modo sicuro.",
    "help.history_point": "Visualizza trasferimenti in entrata e in uscita.",
    "help.bulk_point": "Usa Trasferimento Multiplo per distribuzioni di massa.",
    "help.security_title": "Sicurezza prima di tutto",
    "help.security_desc": "Le transazioni vengono firmate localmente. Le tue chiavi non lasciano mai il dispositivo non crittografate.",
    "help.chat_title": "Gravity Chat Live",
    "help.chat_desc": "Messaggistica in tempo reale con stanze e DM.",
    "help.chat_warning": "Questa chat usa un ID univoco separato dai tuoi wallet.",
    "help.chat_cost": "Gratis e Istantaneo (Off-chain)",
    // Help Buttons
    "help.btn_home": "Torna alla schermata principale per selezionare una rete.",
    "help.btn_wallet": "Accedi ai tuoi account, saldi e azioni.",
    "help.btn_bulk": "Invia fondi a più account in una singola transazione.",
    "help.btn_multisig": "Gestisci account multi-firma (Prossimamente).",
    "help.btn_settings": "Configura account, sicurezza e preferenze.",
    "help.btn_lock": "Blocca immediatamente il tuo wallet.",
    "help.btn_detach": "Apri il wallet in una finestra mobile separata.",
    "help.btn_send": "Trasferisci fondi a un altro utente.",
    "help.btn_receive": "Mostra codice QR per ricevere fondi.",
    "help.btn_history": "Visualizza la cronologia delle transazioni recenti.",
    "help.btn_keys": "Visualizza e gestisci le tue chiavi private.",
    "help.btn_powerup": "Converti token in Power per aumentare l'influenza di voto.",
    "help.btn_powerdown": "Avvia il processo di power down di 13 settimane.",
    "help.btn_delegate": "Delega il tuo Power a un altro account.",
    "help.btn_savings": "Deposita stablecoin per guadagnare interessi (solo Hive/Steem).",
    "help.btn_rc": "Delega Resource Credits per aiutare gli altri (solo Hive).",
    "help.power_title": "Power & Staking",
    "help.power_desc": "Metti i tuoi token al lavoro facendo staking (Power Up).",
    "help.power_point": "Power Up per aumentare la tua influenza di voto e guadagnare più ricompense.",
    "help.power_down_point": "Power Down converte Power in token in 13 settimane.",
    "help.delegate_point": "Delega Power ad altri senza perdere la proprietà.",
    "help.savings_title": "Risparmi & RC",
    "help.savings_desc": "Funzionalità avanzate per Hive e Steem.",
    "help.savings_point": "Deposita HBD/SBD nei Risparmi per guadagnare interessi (preavviso di prelievo di 3 giorni).",
    "help.rc_point": "Delega Resource Credits (solo Hive) per aiutare i nuovi utenti.",
    "help.section_actions": "Azioni Account",
    "help.section_navigation": "Navigazione Principale",
    "help.chat_memo_required": "I Messaggi Diretti (DM) sono Crittografati End-to-End. Le stanze pubbliche non sono crittografate.",
    "help.2fa_title": "Autenticazione a Due Fattori",
    "help.2fa_multi_app_question": "Posso usare più app? (Aegis + Google Auth)",
    "help.2fa_multi_app_answer": "Sì! Puoi avere lo stesso codice generato su più dispositivi o app contemporaneamente. Per farlo:",
    "help.2fa_step1": "Vai su Impostazioni > App Autenticatore per rivelare il Codice QR.",
    "help.2fa_step2": "Scansiona questo stesso codice QR con Aegis.",
    "help.2fa_step3": "Scansionalo di nuovo con Google Authenticator.",
    "help.2fa_step4": "Entrambe le app genereranno ora codici identici che funzionano per sbloccare.",
    "help.visual_guides": "Guide Visive",
    "help.visual_guides_desc": "Come configurare il tuo wallet in modo sicuro:",
    // Lock Screen additions
    "lock.signup": "Registrati",
    "lock.unlock_label": "Sblocca",
    "lock.google": "Google",
    "lock.device": "ChiaveDispositivo",
    "lock.2fa": "Auth 2FA",
    "lock.secure_by_design": "Sicuro per Design",
    "lock.google_title": "Configura wallet usando Google OAuth",
    "lock.device_title": "Configura wallet usando chiavi hardware locali",
    "lock.google_unlock_title": "Sblocca con Google",
    "lock.device_unlock_title": "Sblocca con Chiave Dispositivo",
    "lock.error_incorrect_password": "Password errata",
    "lock.error_totp_not_configured": "Autenticatore non configurato. Sblocca con password e configuralo nelle Impostazioni.",
    "lock.error_setup_failed": "Inizializzazione wallet senza password fallita.",
    "lock.error_decrypt_failed": "Impossibile decrittografare i dati (Chiave {method} non valida).",
    "lock.error_no_auth_data": "Nessun dato di autenticazione {method} trovato. Usa la password.",
    "lock.connecting_google": "Connessione a Google...",
    "lock.error_auth_failed": "Autenticazione {method} fallita",
    "lock.error_config_missing": "Errore di Configurazione (Segreto mancante)",
    "lock.totp_verified_pin": "TOTP Verificato. Inserisci PIN.",
    "lock.error_no_key_after_totp": "Nessuna chiave sicura trovata dopo TOTP.",
    "lock.error_invalid_code": "Codice Non Valido",
    "lock.error_init_pin_failed": "Inizializzazione wallet PIN fallita.",
    "lock.error_decryption_corrupt": "Decrittografia fallita (Vault corrotto?).",
    "lock.error_incorrect_pin": "PIN Errato",
    // Chat
    "chat.title": "Gravity Messenger",
    "chat.status_connected": "Online",
    "chat.status_connecting": "Connessione...",
    "chat.status_disconnected": "Offline",
    "chat.placeholder_username": "Scegli un nome utente...",
    "chat.btn_join": "Unisciti alla Chat",
    "chat.btn_logout": "Disconnetti",
    "chat.rooms": "Stanze",
    "chat.search": "Cerca utenti...",
    "chat.no_rooms": "Nessuna stanza trovata",
    "chat.lobby": "Lobby Globale",
    "chat.create_room": "Crea Stanza",
    "chat.room_name": "Nome Stanza",
    "chat.private": "Stanza Privata",
    "chat.btn_create": "Crea",
    "chat.invite_user": "Invita Utente",
    "chat.invited_to": "Sei stato invitato a {room}",
    "chat.message_placeholder": "Scrivi un messaggio...",
    "chat.clear_identity": "Cancella Identità Bloccata",
    "chat.room_participants": "Partecipanti",
    "chat.no_messages": "Nessun messaggio ancora. Dì ciao!",
    "chat.invite_placeholder": "Nome utente da invitare...",
    "chat.btn_invite": "Invita",
    "chat.confirm_delete": "Eliminare stanza?",
    "chat.confirm_kick": "Espellere utente?",
    "chat.confirm_ban": "Bannare utente?",
    "chat.btn_confirm": "Conferma",
    "chat.btn_cancel": "Annulla",
    "chat.error_reg_failed": "Registrazione fallita",
    "chat.owner_label": "Proprietario",
    // Sidebar additions
    "sidebar.messenger": "Messenger",
    "sidebar.help": "Aiuto",
    // Power Operations
    "power.powerup_title": "Power Up",
    "power.powerdown_title": "Power Down",
    "power.delegate_title": "Delega Power",
    "power.powerup_desc": "Converti {token} in {power} per aumentare il tuo potere di voto",
    "power.powerdown_desc": "Avvia power down del tuo {power} (processo di 13 settimane)",
    "power.delegate_desc": "Delega il tuo {power} a un altro account",
    "power.from_account": "Dall'Account",
    "power.recipient": "Destinatario",
    "power.recipient_placeholder": "nome utente",
    "power.recipient_hint": "Lascia il tuo nome utente per fare power up a te stesso",
    "power.delegatee": "Delega A",
    "power.delegatee_placeholder": "nome utente",
    "power.amount_token": "Importo ({token})",
    "power.amount_vests": "Importo ({power})",
    "power.powerup_hint": "Questo convertirà {token} in {power}",
    "power.powerdown_hint": "Inserisci importo in {power} per power down",
    "power.delegate_hint": "Inserisci importo in {power} per delegare",
    "power.invalid_amount": "Inserisci un importo valido",
    "power.invalid_recipient": "Inserisci un destinatario valido",
    "power.active_key_required": "La chiave attiva è richiesta per questa operazione",
    "power.operation_failed": "Operazione fallita",
    "power.success": "Operazione riuscita!",
    "power.stop_powerdown": "Ferma Power Down",
    "power.stop_powerdown_warning": "Questo annullerà il tuo power down attivo. Clicca Conferma per procedere.",
    "power.available_power": "{power} Disponibile",
    // Savings Operations
    "savings.deposit_title": "Deposita nei Risparmi",
    "savings.withdraw_title": "Preleva dai Risparmi",
    "savings.deposit_desc": "Guadagna interessi depositando {token} nei risparmi",
    "savings.withdraw_desc": "Preleva {token} dai risparmi (periodo di attesa di 3 giorni)",
    "savings.account": "Account",
    "savings.amount": "Importo ({token})",
    "savings.deposit_hint": "I fondi saranno disponibili per il prelievo dopo 3 giorni",
    "savings.withdraw_hint": "Il prelievo sarà elaborato dopo 3 giorni",
    "savings.deposit_info": "I risparmi guadagnano interessi e hanno un periodo di prelievo di 3 giorni per sicurezza",
    "savings.withdraw_info": "I prelievi richiedono 3 giorni per essere elaborati. Puoi annullare durante questo periodo.",
    "savings.invalid_amount": "Inserisci un importo valido",
    "savings.active_key_required": "La chiave attiva è richiesta per questa operazione",
    "savings.operation_failed": "Operazione fallita",
    "savings.success": "Operazione riuscita!",
    "savings.not_available": "Non Disponibile",
    "savings.blurt_not_supported": "Blurt non supporta la funzione risparmi",
    // RC Operations
    "rc.hive_only": "La delegazione di Resource Credits (RC) è disponibile solo sulla blockchain Hive.",
    "rc.delegate_title": "Delega Resource Credits",
    "rc.undelegate_title": "Rimuovi Delegazione RC",
    "rc.delegate_desc": "Aiuta i nuovi account delegando loro Resource Credits.",
    "rc.undelegate_desc": "Smetti di delegare RC a un account.",
    "rc.from_account": "Dall'Account",
    "rc.delegatee": "Delega A",
    "rc.delegatee_placeholder": "nome utente",
    "rc.max_rc": "Importo RC",
    "rc.max_rc_hint": "Inserisci l'importo di RC che vuoi delegare.",
    "rc.invalid_delegatee": "Inserisci un nome utente valido",
    "rc.invalid_amount": "Inserisci un importo RC valido",
    "rc.active_key_required": "La chiave attiva è richiesta per la delegazione RC",
    "rc.operation_failed": "Operazione RC fallita",
    "rc.success": "Delegazione RC aggiornata con successo!",
    "rc.not_available": "RC Non Disponibile",
    "rc.delegate_info": "Delegare RC permette agli account di eseguire più operazioni su Hive.",
    "rc.undelegate_info": "Questo rimuoverà la delegazione RC da questo account."
  }
};
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = reactExports.useState("en");
  reactExports.useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["language"], (res) => {
        const supported = ["en", "es", "fr", "de", "it"];
        if (res.language && supported.includes(res.language)) {
          setLanguage(res.language);
        }
      });
    }
  }, []);
  const changeLanguage = (lang) => {
    setLanguage(lang);
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ language: lang });
    }
  };
  const t = (key, variables) => {
    let text = translations[language][key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, "g"), String(v));
      });
    }
    return text;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageContext.Provider, { value: { language, setLanguage: changeLanguage, t }, children });
};
const useTranslation = () => {
  const context = reactExports.useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};

const LanguageToggle = ({ className = "", direction = "bottom-right" }) => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const dropdownRef = reactExports.useRef(null);
  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "it", label: "Italiano" }
  ];
  let positionClasses = "absolute right-0 top-full mt-2";
  if (direction === "right-up") {
    positionClasses = "absolute left-full bottom-0 ml-2";
  }
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative ${className}`, ref: dropdownRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "text-xs font-bold text-slate-300 hover:text-white border border-dark-600 hover:border-blue-500/50 rounded-lg px-3 py-1.5 uppercase bg-dark-800/80 backdrop-blur-sm transition-all flex items-center gap-2 shadow-lg",
        title: "Change Language",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70", children: language }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: `w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${positionClasses} w-36 bg-dark-800/95 backdrop-blur-md border border-dark-600 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[9999] overflow-hidden`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-1", children: languages.map((lang) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          setLanguage(lang.code);
          setIsOpen(false);
        },
        className: `w-full text-left px-4 py-2.5 text-xs font-bold transition-all flex justify-between items-center ${language === lang.code ? "text-blue-400 bg-blue-500/10" : "text-slate-400 hover:text-white hover:bg-dark-700"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang.label }),
          language === lang.code && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" })
        ]
      },
      lang.code
    )) }) })
  ] });
};

const LockScreen = ({ onUnlock, walletState, setWalletState, lockReason, onToggleDetach }) => {
  const { t } = useTranslation();
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const isFirstRun = !walletState.encryptedMaster;
  const [error, setError] = reactExports.useState(lockReason || "");
  const [statusMessage, setStatusMessage] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [showPinModal, setShowPinModal] = reactExports.useState(false);
  const [pinValue, setPinValue] = reactExports.useState("");
  const [pinMode, setPinMode] = reactExports.useState("unlock");
  const [showResetConfirmation, setShowResetConfirmation] = reactExports.useState(false);
  reactExports.useEffect(() => {
    isBiometricsAvailable();
    if (!isFirstRun) {
      hasPinProtectedKey().then((hasPin) => {
        if (hasPin) {
          setPinMode("unlock");
          setShowPinModal(true);
        }
      });
    }
  }, [isFirstRun]);
  reactExports.useEffect(() => {
    if (lockReason) setError(lockReason);
  }, [lockReason]);
  reactExports.useEffect(() => {
    if ((pinMode === "unlock" || pinMode === "totp") && pinValue.length === 6 && !isLoading) {
      submitPin();
    }
  }, [pinValue, pinMode]);
  const handlePasswordSubmit = async () => {
    if (isFirstRun) {
      if (password.length < 10) {
        setError("Password must be at least 10 characters long.");
        return;
      }
      const strength = calculatePasswordStrength(password);
      if (strength < 3) {
        setError("Password is too weak. Please include uppercase, numbers, and symbols.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setIsLoading(true);
      setStatusMessage(t("lock.processing"));
      await initVault(password);
      setWalletState((prev) => ({
        ...prev,
        encryptedMaster: true
      }));
      setIsLoading(false);
      onUnlock([]);
    } else {
      setIsLoading(true);
      const vault = await unlockVault(password);
      setIsLoading(false);
      if (vault) {
        onUnlock(vault.accounts);
      } else {
        setError("Incorrect password");
      }
    }
  };
  const handleTOTPAuth = async () => {
    setError("");
    const hasConfig = await hasTOTPConfigured();
    if (hasConfig) {
      setPinMode("totp");
      setPinValue("");
      setShowPinModal(true);
    } else {
      setError(t("lock.error_totp_not_configured"));
    }
  };
  const [pendingMethod, setPendingMethod] = reactExports.useState(null);
  const performSetupWithPin = async (method, pin) => {
    try {
      setIsLoading(true);
      setStatusMessage(`Initializing Protected Vault (${method})...`);
      const { vault } = await initVaultWithGeneratedKey(pin);
      setWalletState((prev) => ({
        ...prev,
        encryptedMaster: true,
        useGoogleAuth: method === "Google",
        useDeviceAuth: method === "Device"
      }));
      setIsLoading(false);
      onUnlock(vault.accounts);
    } catch (e) {
      console.error("Setup failed", e);
      setError(t("lock.error_setup_failed"));
      setIsLoading(false);
    }
  };
  const handleDeviceAuth = async () => {
    setError("");
    setIsLoading(true);
    setStatusMessage("Verifying Device...");
    const user = await authenticateWithDevice();
    if (user) {
      if (isFirstRun) {
        setIsLoading(false);
        setPendingMethod("Device");
        setPinMode("create");
        setPinValue("");
        setShowPinModal(true);
      } else {
        const hasPin = await hasPinProtectedKey();
        if (hasPin) {
          setIsLoading(false);
          setPinMode("unlock");
          setPinValue("");
          setShowPinModal(true);
        } else {
          await performLegacyUnlock("Device");
        }
      }
    } else {
      setIsLoading(false);
      setError(t("lock.error_auth_failed", { method: "Device" }));
    }
  };
  const handleGoogleAuth = async () => {
    setError("");
    setIsLoading(true);
    setStatusMessage(t("lock.connecting_google"));
    const user = await authenticateWithGoogle();
    if (user) {
      if (isFirstRun) {
        setIsLoading(false);
        setPendingMethod("Google");
        setPinMode("create");
        setPinValue("");
        setShowPinModal(true);
      } else {
        const hasPin = await hasPinProtectedKey();
        if (hasPin) {
          setIsLoading(false);
          setPinMode("unlock");
          setPinValue("");
          setShowPinModal(true);
        } else {
          await performLegacyUnlock("Google");
        }
      }
    } else {
      setIsLoading(false);
      setError(t("lock.error_auth_failed", { method: "Google" }));
    }
  };
  const performLegacyUnlock = async (methodName) => {
    const internalKey = await getInternalKey();
    if (internalKey) {
      const vault = await unlockVault(internalKey);
      setIsLoading(false);
      if (vault) {
        onUnlock(vault.accounts);
      } else {
        setError(t("lock.error_decrypt_failed", { method: methodName }));
      }
    } else {
      setIsLoading(false);
      setError(t("lock.error_no_auth_data", { method: methodName }));
    }
  };
  const submitPin = async () => {
    if (pinMode === "totp") {
      if (pinValue.length < 6) return;
      setIsLoading(true);
      const secret = await getTOTPSecret();
      if (!secret) {
        setError("Configuration Error (Secret missing)");
        setIsLoading(false);
        return;
      }
      const isValid = verifyTOTP(pinValue, secret);
      if (isValid) {
        setShowPinModal(false);
        const hasPin = await hasPinProtectedKey();
        if (hasPin) {
          setPinMode("unlock");
          setPinValue("");
          setShowPinModal(true);
          setIsLoading(false);
          setStatusMessage("TOTP Verified. Enter PIN.");
        } else {
          const internalKey = await getInternalKey();
          if (internalKey) {
            const vault = await unlockVault(internalKey);
            if (vault) onUnlock(vault.accounts);
          } else {
            setError("No secure key found after TOTP.");
          }
        }
      } else {
        setIsLoading(false);
        setError("Invalid Code");
        setPinValue("");
      }
      return;
    }
    if (pinMode === "create") {
      if (pinValue.length < 6) return;
      setIsLoading(true);
      setShowPinModal(false);
      if (pendingMethod) {
        await performSetupWithPin(pendingMethod, pinValue);
        setPendingMethod(null);
      } else {
        try {
          const { vault } = await initVaultWithGeneratedKey(pinValue);
          setWalletState((prev) => ({ ...prev, encryptedMaster: true }));
          onUnlock(vault.accounts);
        } catch (e) {
          setError(t("lock.error_init_pin_failed"));
          setIsLoading(false);
        }
      }
    } else {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 100));
      const internalKey = await loadInternalKeyWithPin(pinValue);
      if (internalKey) {
        const vault = await unlockVault(internalKey);
        if (vault) {
          onUnlock(vault.accounts);
        } else {
          setError(t("lock.error_decryption_corrupt"));
          setIsLoading(false);
          setShowPinModal(true);
        }
      } else {
        setIsLoading(false);
        setError(t("lock.error_incorrect_pin"));
        setTimeout(() => {
          setError("");
          setPinValue("");
        }, 1e3);
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#111", minHeight: "600px", width: "100%", color: "white", position: "absolute" }, className: "h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden", children: [
    showPinModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-50 bg-dark-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 p-6 rounded-2xl border border-dark-600 shadow-2xl w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2 text-center", children: pinMode === "create" ? "Create Security PIN" : pinMode === "totp" ? "Authenticator Code" : "Enter Security PIN" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-6 text-center", children: pinMode === "create" ? "Set a 6-digit PIN to encrypt your wallet key. You will need this to login securely." : pinMode === "totp" ? "Enter the 6-digit code from your Aegis/Auth app." : "Enter your 6-digit PIN to decrypt your wallet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "password",
          inputMode: "numeric",
          maxLength: 6,
          autoFocus: true,
          value: pinValue,
          onChange: (e) => setPinValue(e.target.value.replace(/[^0-9]/g, "")),
          className: `w-full bg-dark-900 border ${error && pinMode === "unlock" ? "border-red-500" : "border-blue-500/50"} rounded-lg px-4 py-4 text-center text-2xl tracking-[1em] text-white font-mono mb-6 outline-none focus:ring-2 ring-blue-500`,
          placeholder: "••••••",
          onKeyDown: (e) => e.key === "Enter" && pinValue.length >= 6 && submitPin()
        }
      ),
      error && pinMode === "unlock" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-xs text-center mb-4", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setShowPinModal(false);
              setIsLoading(false);
              setStatusMessage("");
              setPinValue("");
              setError("");
            },
            className: "flex-1 py-3 rounded-lg border border-dark-600 text-slate-400 hover:text-white transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: submitPin,
            disabled: pinValue.length < 6,
            className: "flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            children: pinMode === "create" ? "Set PIN" : "Unlock"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 right-4 z-50 flex items-center gap-2", children: [
      onToggleDetach && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onToggleDetach,
          className: "p-2 text-slate-500 hover:text-slate-300 transition-colors",
          title: "Pin/Unpin Extension",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageToggle, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)] border border-white/10 backdrop-blur-md animate-float", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logowallet.png", alt: "Gravity Wallet", className: "w-16 h-16 object-contain drop-shadow-lg" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400", children: "Gravity Wallet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-sm mb-8", children: isFirstRun ? t("lock.create_title") : t("lock.unlock_title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        error && !showPinModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 mb-2 bg-red-900/40 border border-red-500/50 rounded text-center text-xs text-red-200", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            placeholder: isFirstRun ? t("lock.placeholder_create") : t("lock.placeholder_enter"),
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors",
            onKeyDown: (e) => e.key === "Enter" && handlePasswordSubmit()
          }
        ),
        isFirstRun && password.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-1 space-y-1 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-1 rounded-full overflow-hidden bg-dark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full transition-all duration-300 ${getStrengthLabel(calculatePasswordStrength(password)).color}`,
              style: { width: `${(calculatePasswordStrength(password) + 1) * 20}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Security" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${getStrengthLabel(calculatePasswordStrength(password)).color.replace("bg-", "text-")} font-bold uppercase`, children: getStrengthLabel(calculatePasswordStrength(password)).label })
          ] })
        ] }),
        isFirstRun && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900/50 border border-dark-700/50 rounded-xl p-3 mb-2 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1", children: "Requirements" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1", children: [
            { label: "10+ Characters", met: password.length >= 10 },
            { label: "One Uppercase", met: /[A-Z]/.test(password) },
            { label: "One Number", met: /[0-9]/.test(password) },
            { label: "One Symbol", met: /[^A-Za-z0-9]/.test(password) }
          ].map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1.5 transition-colors ${req.met ? "text-green-400" : "text-slate-600"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: req.met ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-medium leading-none", children: req.label })
          ] }, i)) })
        ] }),
        isFirstRun && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            placeholder: "Confirm Password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            className: `w-full bg-dark-900 border ${confirmPassword && password !== confirmPassword ? "border-red-500" : "border-dark-600"} rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors mb-2`,
            onKeyDown: (e) => e.key === "Enter" && handlePasswordSubmit()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handlePasswordSubmit,
            disabled: isLoading || isFirstRun && (password.length < 10 || calculatePasswordStrength(password) < 3 || password !== confirmPassword),
            className: "w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed",
            children: isLoading ? t("lock.processing") : isFirstRun ? t("lock.create_btn") : t("lock.unlock_btn")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full border-t border-dark-700" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-dark-800 px-2 text-slate-500", children: isFirstRun ? t("lock.or_sign_up") : t("lock.or_unlock") }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleGoogleAuth,
            disabled: isLoading,
            className: "bg-white hover:bg-slate-50 text-gray-700 border border-gray-300 rounded-lg py-2 transition-colors flex flex-col items-center justify-center gap-1 text-[10px] disabled:opacity-50",
            title: isFirstRun ? t("lock.google_title") : t("lock.google_unlock_title"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png", alt: "Google", className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: t("lock.google") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] opacity-70 leading-none", children: isFirstRun ? t("lock.signup") : t("lock.unlock_label") })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleDeviceAuth,
            disabled: isLoading,
            className: "bg-dark-700 hover:bg-dark-600 text-white rounded-lg py-2 transition-colors flex flex-col items-center justify-center gap-1 text-[10px] border border-dark-600",
            title: isFirstRun ? t("lock.device_title") : t("lock.device_unlock_title"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 text-blue-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-tighter", children: t("lock.device") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] opacity-70 leading-none", children: isFirstRun ? t("lock.signup") : t("lock.unlock_label") })
            ]
          }
        ),
        !isFirstRun ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleTOTPAuth,
            disabled: isLoading,
            className: "bg-dark-700 text-slate-300 rounded-lg py-2 hover:bg-dark-600 transition-colors flex flex-col items-center justify-center gap-1 text-[10px] border border-dark-600",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase", children: t("lock.2fa") })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-900/30 rounded-lg border border-dark-700/50 flex flex-col items-center justify-center text-[8px] text-slate-600 uppercase font-bold tracking-widest px-2 text-center leading-tight", children: t("lock.secure_by_design") })
      ] }),
      statusMessage && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-xs text-blue-400 mt-2 animate-pulse font-medium", children: statusMessage }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowResetConfirmation(true),
          className: "text-[10px] underline text-slate-500 hover:text-red-400 transition-colors",
          children: t("lock.clear_reset")
        }
      ) })
    ] }),
    showResetConfirmation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-[60] bg-dark-900/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-red-500/30 p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Delete all data?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-6 leading-relaxed", children: "This action cannot be undone. All encrypted storage (Master Key, PIN, Accounts) will be permanently wiped from this device." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowResetConfirmation(false),
            className: "flex-1 py-3 rounded-lg border border-dark-600 text-slate-300 hover:bg-dark-700 transition-colors font-medium text-sm",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              if (typeof chrome !== "undefined" && chrome.storage) {
                chrome.storage.local.clear(() => window.location.reload());
              } else {
                localStorage.clear();
                window.location.reload();
              }
            },
            className: "flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors text-sm shadow-lg shadow-red-900/20",
            children: "Delete"
          }
        )
      ] })
    ] }) })
  ] });
};

const Sidebar = ({
  currentView,
  onChangeView,
  onLock,
  isDetached = false,
  onToggleDetach
}) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-16 h-full bg-dark-800 border-r border-dark-700 flex flex-col items-center py-4 shrink-0 z-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "/logowallet.png",
        alt: "Gravity",
        onClick: () => onChangeView(ViewState.LANDING),
        className: "w-10 h-10 object-contain mb-6 drop-shadow-md hover:scale-110 transition-transform cursor-pointer shrink-0"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 w-full flex flex-col items-center gap-2 overflow-y-auto overflow-x-hidden custom-scrollbar no-scrollbar scroll-smooth py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.LANDING,
          onClick: () => onChangeView(ViewState.LANDING),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }),
          label: t("sidebar.home") || "Home"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-8 bg-dark-600 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.WALLET,
          onClick: () => onChangeView(ViewState.WALLET),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }),
          label: t("sidebar.wallet") || "Wallet"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.BULK,
          onClick: () => onChangeView(ViewState.BULK),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }),
          label: t("sidebar.bulk") || "Bulk"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.MULTISIG,
          onClick: () => onChangeView(ViewState.MULTISIG),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }),
          label: t("sidebar.multisig") || "MultiSig"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.CHAT,
          onClick: () => onChangeView(ViewState.CHAT),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }),
          label: t("sidebar.messenger") || "Messenger"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: false,
          onClick: () => {
            const event = new CustomEvent("open-pair");
            window.dispatchEvent(event);
          },
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v1m-3 3l3 3m6-3l3 3M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" }),
          label: t("sidebar.pair") || "Pair Mobile"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-8 bg-dark-600 my-1 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.MANAGE,
          onClick: () => onChangeView(ViewState.MANAGE),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
          label: t("sidebar.manage") || "Settings"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex flex-col items-center gap-2 pt-4 bg-dark-800 w-full shrink-0 border-t border-dark-700/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.HELP,
          onClick: () => onChangeView(ViewState.HELP),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }),
          label: t("help.title") || "Help"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageToggle, { direction: "right-up" }),
      onToggleDetach && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onToggleDetach,
          className: `p-2 transition-colors ${isDetached ? "text-blue-400" : "text-slate-500 hover:text-slate-300"}`,
          title: isDetached ? t("sidebar.dock") : t("sidebar.pin"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onLock,
          className: "text-slate-500 hover:text-red-400 transition-colors p-2 mb-2",
          title: t("sidebar.lock") || "Lock Wallet",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) })
        }
      )
    ] })
  ] });
};
const NavIcon = ({ active, onClick, icon, label, raw }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "button",
  {
    onClick,
    title: label,
    className: `group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all ${active ? "bg-dark-700 text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.2)] scale-105 border border-dark-600" : "text-slate-500 hover:bg-dark-700 hover:text-slate-300"}`,
    children: [
      raw ? icon : /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-12 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-dark-600 z-50", children: label })
    ]
  }
);

const Landing = ({ onSelectChain, onManage }) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full space-y-4 relative p-4 overflow-y-auto custom-scrollbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-white/5 backdrop-blur-sm animate-float", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logowallet.png", alt: "App Logo", className: "w-10 h-10 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight", children: t("landing.welcome") || "Welcome Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-xs max-w-[200px] mx-auto leading-relaxed", children: t("landing.subtitle") || "Select a network to manage your assets" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 w-full max-w-[240px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onSelectChain(Chain.BLURT),
          title: `${t("action.select_network")} BLURT`,
          className: "bg-dark-800 hover:bg-blurt/20 border border-dark-700 hover:border-blurt/50 p-4 rounded-xl flex items-center gap-4 transition-all group relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-blurt/5 opacity-0 group-hover:opacity-100 transition-opacity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logoblurt.png", alt: "Blurt", className: "w-full h-full object-contain" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg group-hover:text-blurt transition-colors", children: "BLURT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 ml-auto text-dark-600 group-hover:text-blurt transform group-hover:translate-x-1 transition-all", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onSelectChain(Chain.HIVE),
          title: `${t("action.select_network")} HIVE`,
          className: "bg-dark-800 hover:bg-hive/20 border border-dark-700 hover:border-hive/50 p-4 rounded-xl flex items-center gap-4 transition-all group relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-hive/5 opacity-0 group-hover:opacity-100 transition-opacity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/Logo_hive.png", alt: "Hive", className: "w-full h-full object-contain" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg group-hover:text-hive transition-colors", children: "HIVE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 ml-auto text-dark-600 group-hover:text-hive transform group-hover:translate-x-1 transition-all", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onSelectChain(Chain.STEEM),
          title: `${t("action.select_network")} STEEM`,
          className: "bg-dark-800 hover:bg-steem/20 border border-dark-700 hover:border-steem/50 p-4 rounded-xl flex items-center gap-4 transition-all group relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-steem/5 opacity-0 group-hover:opacity-100 transition-opacity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logosteem.png", alt: "Steem", className: "w-full h-full object-contain" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg group-hover:text-steem transition-colors", children: "STEEM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 ml-auto text-dark-600 group-hover:text-steem transform group-hover:translate-x-1 transition-all", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 w-full max-w-[240px] pt-4 border-t border-dark-700/50 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: onManage,
        title: t("action.manage_keys"),
        className: "flex flex-col items-center justify-center p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 text-slate-400 hover:text-white transition-colors border border-transparent hover:border-dark-600 gap-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider", children: t("landing.manage_keys") || "Keys" })
        ]
      }
    ) })
  ] });
};

const TOTPSetupModal = ({ accounts, onClose, onComplete }) => {
  const [step, setStep] = reactExports.useState("loading");
  const [secret, setSecret] = reactExports.useState("");
  const [qrCode, setQrCode] = reactExports.useState("");
  const [token, setToken] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    const init = async () => {
      try {
        const { secret: secret2, qrCode: qrCode2 } = await generateSetup();
        setSecret(secret2);
        setQrCode(qrCode2);
        setStep("scan");
      } catch (e) {
        setError("Failed to generate QR Code");
      }
    };
    init();
  }, []);
  const handleVerify = async () => {
    if (verifyTOTP(token, secret)) {
      await saveTOTPSecret(secret);
      await enablePasswordless(accounts);
      setStep("success");
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setError("Invalid code. Please try again.");
      setToken("");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-50 bg-dark-900/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-dark-600 rounded-2xl p-6 w-full max-w-sm shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white", children: "Setup Authenticator" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
    ] }),
    step === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" }) }),
    step === "scan" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400", children: [
        "Scan this QR code with ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Aegis" }),
        ", ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Google Authenticator" }),
        ", or any TOTP app."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-2 rounded-lg mx-auto w-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: qrCode, alt: "QR Code", className: "w-48 h-48" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 p-2 rounded text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-500 mb-1", children: "Backup Key (Manual Entry)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-blue-400 font-mono text-sm break-all", children: secret })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setStep("verify"),
          className: "w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4 transition-colors",
          children: "Next"
        }
      )
    ] }),
    step === "verify" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Enter the 6-digit code from your app to verify." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          inputMode: "numeric",
          maxLength: 6,
          autoFocus: true,
          value: token,
          onChange: (e) => {
            const val = e.target.value.replace(/[^0-9]/g, "");
            setToken(val);
            setError("");
          },
          className: "w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-4 text-center text-2xl tracking-[0.5em] text-white font-mono outline-none focus:border-blue-500",
          placeholder: "000000",
          onKeyDown: (e) => e.key === "Enter" && token.length === 6 && handleVerify()
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-xs text-center", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setStep("scan"),
            className: "flex-1 py-3 text-slate-400 hover:text-white",
            children: "Back"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleVerify,
            disabled: token.length !== 6,
            className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg disabled:opacity-50",
            children: "Verify"
          }
        )
      ] })
    ] }),
    step === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Success!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm", children: "Authenticator configured successfully." })
    ] })
  ] }) });
};

const BiometricSetupModal = ({ accounts, setWalletState, onClose, onComplete }) => {
  useTranslation();
  const [step, setStep] = reactExports.useState("intro");
  const [error, setError] = reactExports.useState("");
  const handleSetup = async () => {
    setStep("loading");
    setError("");
    try {
      const isAvailable = await isBiometricsAvailable();
      if (!isAvailable) {
        setStep("error");
        setError("Biometrics not supported on this device or browser context.");
        return;
      }
      const success = await registerBiometrics();
      if (success) {
        await enablePasswordless(accounts);
        setWalletState((prev) => ({
          ...prev,
          useBiometrics: true
        }));
        setStep("success");
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        setStep("error");
        setError("Registration failed. Please try again.");
      }
    } catch (e) {
      setStep("error");
      setError(e.message || "An unexpected error occurred.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-50 bg-dark-900/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in text-white text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-dark-600 rounded-2xl p-8 w-full max-w-sm shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-2 absolute top-4 right-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }) }),
    step === "intro" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black mb-2", children: "Enable Biometrics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Use your fingerprint or face scan to unlock your wallet faster and more securely." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleSetup,
          className: "w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95",
          children: "Setup Now"
        }
      )
    ] }),
    step === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-400 font-bold animate-pulse", children: "Waiting for system..." })
    ] }),
    step === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 space-y-4 animate-bounce-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black text-white", children: "Verified!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400", children: "Biometrics enabled successfully." })
    ] }),
    step === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Error" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-sm", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setStep("intro"),
          className: "w-full bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-xl mt-4",
          children: "Try Again"
        }
      )
    ] })
  ] }) });
};

const BRIDGE_SERVER_URL = "http://136.243.80.162:3030";
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 10;
class DeviceTransferService {
  constructor() {
    this.socket = null;
    this.sessionId = null;
    this.sharedKey = null;
    this.myKeyPair = null;
    this.myPublicKeyB64 = null;
    this.incomingPayloadResolver = null;
    this.statusListener = null;
    this.hasEchoedPublicKey = false;
  }
  onStatusChange(callback) {
    this.statusListener = callback;
  }
  emitStatus(status, detail) {
    this.statusListener?.(status, detail);
  }
  createSessionCode() {
    const bytes = window.crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
    let result = "";
    for (let index = 0; index < CODE_LENGTH; index += 1) {
      result += CODE_ALPHABET[bytes[index] % CODE_ALPHABET.length];
    }
    return result;
  }
  formatCode(code) {
    const normalized = this.normalizeCode(code);
    return normalized.replace(/(.{5})/g, "$1-").replace(/-$/, "");
  }
  normalizeCode(code) {
    return String(code || "").toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, CODE_LENGTH);
  }
  ensureSocket() {
    if (this.socket) return;
    this.socket = lookup(BRIDGE_SERVER_URL, {
      transports: ["polling", "websocket"],
      autoConnect: true,
      reconnectionAttempts: 5,
      timeout: 1e4
    });
    this.socket.on("connect", () => {
      this.emitStatus(this.sharedKey ? "paired" : "connecting");
    });
    this.socket.on("connect_error", (err) => {
      this.emitStatus("error", err.message || "Connection error");
    });
    this.socket.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        this.emitStatus("error", `Disconnected: ${reason}`);
      }
    });
    this.socket.on("bridge_signer_ready", async (data) => {
      if (!this.myKeyPair || !data?.publicKey) return;
      try {
        const remotePublicKey = await importKeyFromBase64(data.publicKey, "public");
        this.sharedKey = await deriveSharedSecret(this.myKeyPair.privateKey, remotePublicKey);
        if (!this.hasEchoedPublicKey && this.sessionId && this.myPublicKeyB64) {
          this.hasEchoedPublicKey = true;
          this.socket?.emit("bridge_join", { sessionId: this.sessionId, publicKey: this.myPublicKeyB64 });
        }
        this.emitStatus("paired");
      } catch (error) {
        this.emitStatus("error", error?.message || "Handshake failed");
      }
    });
    this.socket.on("bridge_sync_accounts", async (data) => {
      if (!this.sharedKey || !data?.encrypted) return;
      try {
        const decrypted = await decryptMessage(data.encrypted, this.sharedKey);
        const payload = JSON.parse(decrypted);
        this.emitStatus("transferred");
        this.incomingPayloadResolver?.(payload);
        this.incomingPayloadResolver = null;
      } catch (error) {
        this.emitStatus("error", error?.message || "Import failed");
      }
    });
  }
  async startReceiveSession() {
    this.disconnect();
    this.ensureSocket();
    this.sessionId = this.createSessionCode();
    this.myKeyPair = await generateEncryptionKeys();
    this.sharedKey = null;
    this.hasEchoedPublicKey = false;
    const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);
    this.myPublicKeyB64 = myPubB64;
    this.emitStatus("waiting");
    this.socket?.emit("bridge_join", { sessionId: this.sessionId, publicKey: myPubB64 });
    return { code: this.formatCode(this.sessionId) };
  }
  async waitForIncomingPayload(timeoutMs = 5 * 60 * 1e3) {
    return new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        this.incomingPayloadResolver = null;
        reject(new Error("Transfer timed out"));
      }, timeoutMs);
      this.incomingPayloadResolver = (payload) => {
        clearTimeout(timeoutId);
        resolve(payload);
      };
    });
  }
  async connectToSession(rawCode, timeoutMs = 3e4) {
    const code = this.normalizeCode(rawCode);
    if (code.length !== CODE_LENGTH) {
      throw new Error("Invalid transfer code");
    }
    this.disconnect();
    this.ensureSocket();
    this.sessionId = code;
    this.myKeyPair = await generateEncryptionKeys();
    this.sharedKey = null;
    this.hasEchoedPublicKey = false;
    const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);
    this.myPublicKeyB64 = myPubB64;
    this.emitStatus("connecting");
    const pairedPromise = new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        reject(new Error("Target device did not respond in time"));
      }, timeoutMs);
      const previousListener = this.statusListener;
      this.statusListener = (status, detail) => {
        previousListener?.(status, detail);
        if (status === "paired") {
          clearTimeout(timeoutId);
          this.statusListener = previousListener;
          resolve();
        } else if (status === "error") {
          clearTimeout(timeoutId);
          this.statusListener = previousListener;
          reject(new Error(detail || "Pairing failed"));
        }
      };
    });
    this.socket?.emit("bridge_join", { sessionId: this.sessionId, publicKey: myPubB64 });
    await pairedPromise;
  }
  async sendPayload(payload) {
    if (!this.socket || !this.sharedKey || !this.sessionId) {
      throw new Error("Transfer session not ready");
    }
    const encrypted = await encryptMessage(JSON.stringify(payload), this.sharedKey);
    this.socket.emit("bridge_sync_accounts", { sessionId: this.sessionId, encrypted });
    this.emitStatus("transferred");
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.sessionId = null;
    this.sharedKey = null;
    this.myKeyPair = null;
    this.myPublicKeyB64 = null;
    this.hasEchoedPublicKey = false;
    this.incomingPayloadResolver = null;
    this.emitStatus("idle");
  }
}
const deviceTransferService = new DeviceTransferService();

const SyncExportModal = ({ accounts, walletConfig, onClose }) => {
  const { t } = useTranslation();
  const [pairCode, setPairCode] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("idle");
  const [errorMsg, setErrorMsg] = reactExports.useState("");
  reactExports.useEffect(() => {
    deviceTransferService.onStatusChange((nextStatus, detail) => {
      if (nextStatus === "connecting" || nextStatus === "waiting") setStatus("connecting");
      if (nextStatus === "paired") setStatus("paired");
      if (nextStatus === "transferred") setStatus("sent");
      if (nextStatus === "error") {
        setStatus("error");
        setErrorMsg(detail || "Transfer failed");
      }
    });
    return () => {
      deviceTransferService.onStatusChange(null);
      deviceTransferService.disconnect();
    };
  }, []);
  const payloadSummary = reactExports.useMemo(() => {
    return {
      accountCount: accounts.length,
      chatIdentity: !!localStorage.getItem("gravity_chat_registration"),
      settingsCount: [
        walletConfig?.useGoogleAuth,
        walletConfig?.useBiometrics,
        walletConfig?.useDeviceAuth,
        walletConfig?.useTOTP
      ].filter((value) => typeof value !== "undefined").length
    };
  }, [accounts, walletConfig]);
  const buildPayload = async () => {
    const payload = {
      timestamp: Date.now(),
      accounts,
      settings: {
        useGoogleAuth: walletConfig?.useGoogleAuth,
        useBiometrics: walletConfig?.useBiometrics,
        useDeviceAuth: walletConfig?.useDeviceAuth,
        useTOTP: walletConfig?.useTOTP
      }
    };
    const registrationRaw = localStorage.getItem("gravity_chat_registration");
    const privateKey = await storageService.getItem("gravity_chat_key");
    const publicKey = await storageService.getItem("gravity_chat_pub");
    if (registrationRaw && privateKey && publicKey) {
      try {
        const registration = JSON.parse(registrationRaw);
        if (registration?.username && registration?.id) {
          payload.chatIdentity = {
            username: registration.username,
            id: registration.id,
            privateKey,
            publicKey
          };
        }
      } catch (e) {
      }
    }
    return payload;
  };
  const handleConnect = async () => {
    setErrorMsg("");
    setStatus("connecting");
    try {
      await deviceTransferService.connectToSession(pairCode);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e?.message || t("pair.connect_error"));
    }
  };
  const handleSend = async () => {
    setErrorMsg("");
    setStatus("sending");
    try {
      const payload = await buildPayload();
      await deviceTransferService.sendPayload(payload);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e?.message || t("pair.send_error"));
    }
  };
  const normalizedCode = deviceTransferService.normalizeCode(pairCode);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-dark-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar my-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 text-slate-400 hover:text-white",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest text-purple-400", children: t("pair.step_badge_send") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black text-white mb-2", children: t("pair.send_title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-6", children: t("pair.send_subtitle") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: pairCode,
          onChange: (event) => setPairCode(event.target.value.toUpperCase()),
          placeholder: "ABCDE-FGHIJ",
          autoCapitalize: "characters",
          autoCorrect: "off",
          spellCheck: false,
          className: "w-full bg-dark-900 border border-dark-700 rounded-xl p-4 text-center text-lg tracking-[0.35em] font-mono text-slate-100 focus:border-purple-500 outline-none uppercase"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900/70 border border-dark-700 rounded-2xl p-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("pair.accounts_label") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white", children: payloadSummary.accountCount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("pair.settings_label") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white", children: payloadSummary.settingsCount ? t("pair.included") : t("pair.basic_only") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("pair.chat_identity_label") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white", children: payloadSummary.chatIdentity ? t("pair.included") : t("pair.not_found") })
        ] })
      ] }),
      errorMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-xs font-bold text-center", children: errorMsg }),
      status === "idle" || status === "error" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleConnect,
          disabled: normalizedCode.length !== 10,
          className: `w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${normalizedCode.length !== 10 ? "bg-dark-700 text-slate-500" : "bg-purple-600 text-white shadow-lg active:scale-95"}`,
          children: t("pair.pair_devices")
        }
      ) : null,
      status === "connecting" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full py-4 rounded-xl bg-dark-900 text-center text-sm font-bold text-slate-300 border border-dark-700", children: t("pair.waiting_handshake") }),
      status === "paired" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleSend,
          className: "w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all bg-blue-600 text-white shadow-lg active:scale-95",
          children: t("pair.approve_and_send")
        }
      ),
      status === "sending" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full py-4 rounded-xl bg-dark-900 text-center text-sm font-bold text-slate-300 border border-dark-700", children: t("pair.sending") }),
      status === "sent" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-green-400 uppercase tracking-widest text-sm", children: t("pair.send_complete") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 mt-1", children: t("pair.send_complete_subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 text-center text-[10px] text-slate-500", children: t("pair.e2ee_transfer") })
    ] })
  ] }) });
};

const SyncImportModal = ({ onClose, onImport }) => {
  const { t } = useTranslation();
  const [pairCode, setPairCode] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("preparing");
  const [errorMsg, setErrorMsg] = reactExports.useState("");
  const [successMsg, setSuccessMsg] = reactExports.useState("");
  const onCloseRef = reactExports.useRef(onClose);
  const onImportRef = reactExports.useRef(onImport);
  reactExports.useEffect(() => {
    onCloseRef.current = onClose;
    onImportRef.current = onImport;
  }, [onClose, onImport]);
  reactExports.useEffect(() => {
    let mounted = true;
    deviceTransferService.onStatusChange((nextStatus, detail) => {
      if (!mounted) return;
      if (nextStatus === "waiting") setStatus("waiting");
      if (nextStatus === "paired") setStatus("waiting");
      if (nextStatus === "error") {
        setStatus("error");
        setErrorMsg(detail || "Transfer failed");
      }
    });
    const prepare = async () => {
      try {
        const { code } = await deviceTransferService.startReceiveSession();
        if (!mounted) return;
        setPairCode(code);
        setStatus("waiting");
        const payload = await deviceTransferService.waitForIncomingPayload();
        if (!mounted) return;
        setStatus("importing");
        await onImportRef.current(payload);
        if (!mounted) return;
        setSuccessMsg(t("pair.receive_success_message", { count: payload.accounts.length }));
        setStatus("done");
      } catch (e) {
        if (!mounted) return;
        setStatus("error");
        setErrorMsg(e?.message || t("pair.receive_error"));
      }
    };
    prepare();
    return () => {
      mounted = false;
      deviceTransferService.onStatusChange(null);
      deviceTransferService.disconnect();
    };
  }, []);
  const handleCopy = async () => {
    if (!pairCode) return;
    await navigator.clipboard.writeText(pairCode);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-dark-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar my-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onCloseRef.current(),
        className: "absolute top-4 right-4 text-slate-400 hover:text-white",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-black uppercase tracking-widest text-green-400", children: t("pair.step_badge_receive") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black text-white mb-2", children: t("pair.receive_title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-6", children: t("pair.receive_subtitle") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-dark-900 border border-dark-700 rounded-2xl p-5 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.28em] font-black text-slate-500 mb-3", children: t("pair.code_label") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-mono tracking-[0.32em] text-white select-all", children: pairCode || "----- -----" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleCopy,
          disabled: !pairCode,
          className: "w-full py-3 bg-dark-700 hover:bg-dark-600 rounded-xl font-mono text-xs text-purple-300 transition-all active:scale-95",
          children: t("pair.copy_code")
        }
      ),
      status === "preparing" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full py-4 rounded-xl bg-dark-900 text-center text-sm font-bold text-slate-300 border border-dark-700", children: t("pair.preparing") }),
      status === "waiting" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full py-4 rounded-xl bg-dark-900 text-center text-sm font-bold text-slate-300 border border-dark-700", children: t("pair.waiting_source") }),
      status === "importing" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full py-4 rounded-xl bg-dark-900 text-center text-sm font-bold text-slate-300 border border-dark-700", children: t("pair.importing") }),
      status === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-green-400 uppercase tracking-widest text-sm", children: t("pair.receive_complete") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-300 mt-2", children: successMsg })
      ] }),
      status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-red-400 uppercase tracking-widest text-sm", children: t("pair.transfer_error") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 mt-1", children: errorMsg })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 text-center text-[10px] text-slate-500", children: t("pair.e2ee_notice") }),
      status === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onCloseRef.current(),
          className: "w-full py-3 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 rounded-xl font-bold text-sm text-green-300 transition-all active:scale-95",
          children: t("common.close")
        }
      )
    ] })
  ] }) });
};

const ManageWallets = ({ accounts, walletState, setWalletState, onEdit, onImport, onSyncImport }) => {
  const { t } = useTranslation();
  const [showTOTP, setShowTOTP] = reactExports.useState(false);
  const [showBio, setShowBio] = reactExports.useState(false);
  const [showSyncExport, setShowSyncExport] = reactExports.useState(false);
  const [showSyncImport, setShowSyncImport] = reactExports.useState(false);
  const chainCounts = {
    hive: accounts.filter((account) => account.chain === Chain.HIVE).length,
    blurt: accounts.filter((account) => account.chain === Chain.BLURT).length,
    steem: accounts.filter((account) => account.chain === Chain.STEEM).length
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full overflow-y-auto custom-scrollbar p-4 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-4 border-b border-dark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold", children: t("settings.accounts_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onImport,
          className: "text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-white font-bold transition-colors",
          children: t("settings.add_new")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-dark-800 border border-dark-700 rounded-2xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-white", children: "Wallet Overview" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 mt-1", children: "Use this screen for security settings and device transfer. Manage individual accounts from the wallet view." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-white", children: accounts.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-slate-500", children: "Accounts" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900/70 border border-dark-700 rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-slate-500", children: "Hive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black text-white mt-1", children: chainCounts.hive })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900/70 border border-dark-700 rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-slate-500", children: "Blurt" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black text-white mt-1", children: chainCounts.blurt })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900/70 border border-dark-700 rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-slate-500", children: "Steem" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black text-white mt-1", children: chainCounts.steem })
          ] })
        ] }),
        accounts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => onEdit(accounts[0]),
            className: "mt-4 w-full bg-dark-900 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex items-center justify-between transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: "Open account manager" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-center text-slate-500 py-4 text-sm", children: t("settings.no_accounts") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-dark-700 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-400 uppercase tracking-wider mb-1", children: t("pair.section_title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-500 -mt-1 mb-2", children: t("pair.section_subtitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowSyncExport(true),
              className: "bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex flex-col items-center gap-2 transition-all group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-xs", children: t("pair.send_cta") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowSyncImport(true),
              className: "bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex flex-col items-center gap-2 transition-all group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 group-hover:bg-green-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-xs", children: t("pair.receive_cta") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-400 uppercase tracking-wider mb-1 mt-4", children: "Security" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowTOTP(true),
            className: "w-full bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex items-center gap-3 transition-all text-left group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: "Authenticator App (2FA)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500", children: "Enable Aegis, Google Auth, or Authy" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-2 py-0.5 rounded text-[8px] font-black uppercase ${walletState.useTOTP ? "bg-green-500/20 text-green-500" : "bg-slate-700 text-slate-400"}`, children: walletState.useTOTP ? "Enabled" : "Off" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setWalletState((prev) => ({ ...prev, useDeviceAuth: !prev.useDeviceAuth })),
            className: "w-full bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex items-center gap-3 transition-all text-left group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: "Device Auth" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500", children: "Persistent secure device key" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-2 py-0.5 rounded text-[8px] font-black uppercase ${walletState.useDeviceAuth ? "bg-blue-500/20 text-blue-500" : "bg-slate-700 text-slate-400"}`, children: walletState.useDeviceAuth ? "Enabled" : "Off" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowBio(true),
            className: "w-full bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex items-center gap-3 transition-all text-left group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-500/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: "Fingerprint / FaceID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500", children: "Fast biometric unlock" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-2 py-0.5 rounded text-[8px] font-black uppercase ${walletState.useBiometrics ? "bg-green-500/20 text-green-500" : "bg-slate-700 text-slate-400"}`, children: walletState.useBiometrics ? "Enabled" : "Off" })
            ]
          }
        )
      ] })
    ] }),
    showTOTP && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TOTPSetupModal,
      {
        accounts,
        onClose: () => setShowTOTP(false),
        onComplete: () => setShowTOTP(false)
      }
    ),
    showBio && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BiometricSetupModal,
      {
        accounts,
        walletState,
        setWalletState,
        onClose: () => setShowBio(false),
        onComplete: () => setShowBio(false)
      }
    ),
    showSyncExport && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SyncExportModal,
      {
        accounts,
        walletConfig: walletState,
        onClose: () => setShowSyncExport(false)
      }
    ),
    showSyncImport && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SyncImportModal,
      {
        onClose: () => setShowSyncImport(false),
        onImport: onSyncImport
      }
    )
  ] });
};

const PowerModal = ({ account, type, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = reactExports.useState("");
  const [recipient, setRecipient] = reactExports.useState(account.name);
  const [delegatee, setDelegatee] = reactExports.useState("");
  const [processing, setProcessing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  const [isStoppingPowerDown, setIsStoppingPowerDown] = reactExports.useState(false);
  const [recentRecipients, setRecentRecipients] = reactExports.useState([]);
  const [showRecent, setShowRecent] = reactExports.useState(null);
  const [showConfirmation, setShowConfirmation] = reactExports.useState(false);
  const [isValidating, setIsValidating] = reactExports.useState(false);
  const [accountError, setAccountError] = reactExports.useState("");
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    const loadRecipients = async () => {
      const saved = await storageService.getItem("recentRecipients");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setRecentRecipients(parsed);
        } catch (e) {
        }
      } else if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get(["recentRecipients"], (result) => {
          if (Array.isArray(result.recentRecipients)) setRecentRecipients(result.recentRecipients);
        });
      }
    };
    loadRecipients();
    setAmount("");
    setRecipient(account.name);
    setDelegatee("");
    setError("");
    setSuccess(false);
    setAccountError("");
    setIsStoppingPowerDown(false);
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [account.name]);
  const saveRecipient = async (name) => {
    if (!name || recentRecipients.includes(name)) return;
    const newList = [name, ...recentRecipients].slice(0, 5);
    setRecentRecipients(newList);
    await storageService.setItem("recentRecipients", JSON.stringify(newList));
  };
  const getTokenSymbol = () => {
    if (account.chain === Chain.HIVE) return "HIVE";
    if (account.chain === Chain.STEEM) return "STEEM";
    return "BLURT";
  };
  const getPowerSymbol = () => {
    if (account.chain === Chain.HIVE) return "HP";
    if (account.chain === Chain.STEEM) return "SP";
    return "BP";
  };
  const validateRecipient = async () => {
    if (!recipient) return false;
    if (recipient === account.name) {
      setAccountError("");
      return true;
    }
    setIsValidating(true);
    setAccountError("");
    try {
      const exists = await checkAccountExists(account.chain, recipient);
      if (!exists) {
        setAccountError(t("error.account_not_found") || `Account @${recipient} not found`);
        return false;
      }
      return true;
    } catch (e) {
      console.warn("Validation error ignored", e);
      return true;
    } finally {
      setIsValidating(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStoppingPowerDown && (!amount || parseFloat(amount) <= 0)) {
      setError(t("power.invalid_amount"));
      return;
    }
    if (type === "delegate" && !delegatee.trim()) {
      setError(t("power.invalid_recipient"));
      return;
    }
    if (!account.activeKey) {
      setError(t("power.active_key_required"));
      return;
    }
    if (type === "powerup") {
      if (accountError) return;
    }
    setError("");
    setShowConfirmation(true);
  };
  const executeOperation = async () => {
    setProcessing(true);
    setError("");
    setShowConfirmation(false);
    try {
      let response;
      const tokenSymbol = getTokenSymbol();
      if (type === "powerup") {
        const formattedAmount = `${parseFloat(amount).toFixed(3)} ${tokenSymbol} `;
        response = await broadcastPowerUp(account.chain, account.name, account.activeKey, recipient, formattedAmount);
      } else if (type === "powerdown") {
        if (isStoppingPowerDown) {
          response = await broadcastPowerDown(account.chain, account.name, account.activeKey, 0);
        } else {
          response = await broadcastPowerDown(account.chain, account.name, account.activeKey, parseFloat(amount));
        }
      } else {
        response = await broadcastDelegation(account.chain, account.name, account.activeKey, delegatee, parseFloat(amount));
      }
      if (response.success) {
        if (type === "powerup" && recipient !== account.name) saveRecipient(recipient);
        if (type === "delegate") saveRecipient(delegatee);
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(response.error || t("power.operation_failed"));
      }
    } catch (err) {
      setError(err.message || t("power.operation_failed"));
    } finally {
      setProcessing(false);
    }
  };
  const handleStopPowerDown = () => {
    setIsStoppingPowerDown(true);
    setError("");
  };
  const getTitle = () => {
    if (type === "powerup") return t("power.powerup_title");
    if (type === "powerdown") return t("power.powerdown_title");
    return t("power.delegate_title");
  };
  const getDescription = () => {
    if (type === "powerup") return t("power.powerup_desc").replace("{token}", getTokenSymbol()).replace("{power}", getPowerSymbol());
    if (type === "powerdown") return t("power.powerdown_desc").replace("{power}", getPowerSymbol());
    const baseDesc = t("power.delegate_desc").replace("{power}", getPowerSymbol());
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2", children: baseDesc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-900/20 border border-blue-500/30 p-2 rounded text-[10px] text-blue-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Note:" }),
        " Delegation is ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "NOT additive" }),
        ". This value will be the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "new total" }),
        ". Set to 0 to remove delegation."
      ] }) })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto my-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white", children: getTitle() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              className: "text-slate-400 hover:text-white transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-2", children: getDescription() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900/50 rounded-lg p-4 border border-dark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mb-1", children: t("power.from_account") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white font-bold", children: [
            "@",
            account.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mt-1", children: account.chain }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-dark-700 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: t("power.available_token").replace("{token}", getTokenSymbol()) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-green-400", children: [
                (account.balance || 0).toFixed(3),
                " ",
                getTokenSymbol()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: t("power.available_power").replace("{power}", getPowerSymbol()) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-blue-400", children: [
                (account.stakedBalance || 0).toFixed(3),
                " ",
                getPowerSymbol()
              ] })
            ] }),
            account.powerDownActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 mt-2 border-t border-dark-700/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-yellow-500 font-medium", children: t("power.active_powerdown") || "Active Power Down" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-yellow-400", children: [
                  "~",
                  (account.powerDownAmount || 0).toFixed(3),
                  " ",
                  getPowerSymbol(),
                  "/week"
                ] })
              ] }),
              account.nextPowerDown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500 text-right mt-1", children: [
                t("power.next_withdrawal") || "Next:",
                " ",
                new Date(account.nextPowerDown).toLocaleDateString()
              ] })
            ] }),
            !account.powerDownActive && type === "powerdown" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 italic mt-2", children: t("power.no_active_powerdown") || "No active power downs" })
          ] })
        ] }),
        type === "powerup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: t("power.recipient") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: recipient,
                onChange: (e) => {
                  setRecipient(e.target.value.replace("@", ""));
                  setAccountError("");
                },
                onFocus: () => setShowRecent("recipient"),
                onBlur: () => {
                  setTimeout(() => setShowRecent(null), 200);
                  validateRecipient();
                },
                className: `w-full bg-dark-900 border ${accountError ? "border-red-500" : "border-dark-700"} rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none pr-10`,
                placeholder: t("power.recipient_placeholder")
              }
            ),
            isValidating && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "animate-spin h-5 w-5 text-blue-500", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
            ] }) })
          ] }),
          accountError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1 font-medium", children: accountError }),
          showRecent === "recipient" && recentRecipients.length > 0 && !recipient && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-10 w-full mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 font-bold px-3 py-2 border-b border-dark-700 uppercase", children: t("common.recent_recipients") || "Recent Recipients" }),
            Array.isArray(recentRecipients) && recentRecipients.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setRecipient(name);
                  setAccountError("");
                },
                className: "w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white transition-colors",
                children: [
                  "@",
                  name
                ]
              },
              name
            ))
          ] }),
          !accountError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1", children: t("power.recipient_hint") })
        ] }),
        type === "delegate" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: t("power.delegatee") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: delegatee,
              onChange: (e) => setDelegatee(e.target.value.replace("@", "")),
              onFocus: () => setShowRecent("delegatee"),
              onBlur: () => setTimeout(() => setShowRecent(null), 200),
              className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none",
              placeholder: t("power.delegatee_placeholder"),
              required: true
            }
          ),
          showRecent === "delegatee" && recentRecipients.length > 0 && !delegatee && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-10 w-full mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 font-bold px-3 py-2 border-b border-dark-700 uppercase", children: t("common.recent_recipients") || "Recent Recipients" }),
            Array.isArray(recentRecipients) && recentRecipients.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setDelegatee(name),
                className: "w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white transition-colors",
                children: [
                  "@",
                  name
                ]
              },
              name
            ))
          ] })
        ] }),
        !isStoppingPowerDown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: type === "powerup" ? t("power.amount_token").replace("{token}", getTokenSymbol()) : t("power.amount_vests").replace("{power}", getPowerSymbol()) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              step: "0.001",
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none",
              placeholder: "0.000",
              required: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1", children: type === "powerup" ? t("power.powerup_hint").replace("{token}", getTokenSymbol()).replace("{power}", getPowerSymbol()) : type === "powerdown" ? t("power.powerdown_hint").replace("{power}", getPowerSymbol()) : t("power.delegate_hint").replace("{power}", getPowerSymbol()) })
        ] }),
        isStoppingPowerDown && type === "powerdown" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-yellow-300", children: t("power.stop_powerdown_warning") })
        ] }) }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm break-all max-h-32 overflow-y-auto custom-scrollbar", children: error }),
        success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm", children: t("power.success") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "flex-1 bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-lg transition-colors",
              disabled: processing,
              children: t("common.cancel")
            }
          ),
          type === "powerdown" && !isStoppingPowerDown && account.powerDownActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleStopPowerDown,
              className: "flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              disabled: processing || success,
              children: t("power.stop_powerdown")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              disabled: processing || success,
              children: processing ? t("common.processing") : t("common.confirm")
            }
          )
        ] })
      ] })
    ] }),
    showConfirmation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-10 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 rounded-xl border border-yellow-500/30 p-6 max-w-sm w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-yellow-400 mb-4", children: t("common.confirm_operation") || "Confirm Operation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-6 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
            t("power.operation_type") || "Type",
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: getTitle() })
        ] }),
        !isStoppingPowerDown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
            t("power.amount") || "Amount",
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
            amount,
            " ",
            type === "powerup" ? getTokenSymbol() : getPowerSymbol()
          ] })
        ] }),
        type === "powerup" && recipient !== account.name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
            t("power.recipient") || "Recipient",
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
            "@",
            recipient
          ] })
        ] }),
        type === "delegate" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
            t("power.delegatee") || "Delegatee",
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
            "@",
            delegatee
          ] })
        ] }),
        isStoppingPowerDown && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-yellow-900/20 border border-yellow-500/30 p-3 rounded text-yellow-300 text-xs", children: t("power.stop_powerdown_confirm") || "This will stop your active power down." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowConfirmation(false),
            className: "flex-1 bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-lg transition-colors",
            children: t("common.cancel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: executeOperation,
            className: "flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg transition-colors",
            children: t("common.confirm")
          }
        )
      ] })
    ] }) })
  ] });
};

const SavingsModal = ({ account, type, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = reactExports.useState("");
  const [processing, setProcessing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const getStablecoinSymbol = () => {
    if (account.chain === Chain.HIVE) return "HBD";
    if (account.chain === Chain.STEEM) return "SBD";
    return "";
  };
  const getAvailableBalance = () => {
    return account.secondaryBalance || 0;
  };
  const handleMaxClick = () => {
    setAmount(getAvailableBalance().toFixed(3));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (account.chain === Chain.BLURT) {
      setError(t("savings.blurt_not_supported"));
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError(t("savings.invalid_amount"));
      return;
    }
    if (!account.activeKey) {
      setError(t("savings.active_key_required"));
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const stablecoin = getStablecoinSymbol();
      const formattedAmount = `${parseFloat(amount).toFixed(3)} ${stablecoin}`;
      let response;
      if (type === "deposit") {
        response = await broadcastSavingsDeposit(account.chain, account.name, account.activeKey, formattedAmount);
      } else {
        const requestId = Date.now();
        response = await broadcastSavingsWithdraw(account.chain, account.name, account.activeKey, formattedAmount, requestId);
      }
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(response.error || t("savings.operation_failed"));
      }
    } catch (err) {
      setError(err.message || t("savings.operation_failed"));
    } finally {
      setProcessing(false);
    }
  };
  if (account.chain === Chain.BLURT) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-yellow-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2", children: t("savings.not_available") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 mb-6", children: t("savings.blurt_not_supported") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors",
          children: t("common.close")
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-dark-700 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white", children: type === "deposit" ? t("savings.deposit_title") : t("savings.withdraw_title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onClose,
            className: "text-slate-400 hover:text-white transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-2", children: type === "deposit" ? t("savings.deposit_desc").replace("{token}", getStablecoinSymbol()) : t("savings.withdraw_desc").replace("{token}", getStablecoinSymbol()) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900/50 rounded-lg p-4 border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mb-1", children: t("savings.account") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white font-bold", children: [
          "@",
          account.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mt-1", children: account.chain }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-dark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex justify-between items-center cursor-pointer hover:bg-white/5 p-1 rounded transition-colors",
            onClick: handleMaxClick,
            title: "Click to use max balance",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase", children: t("wallet.balance") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-blue-400", children: [
                getAvailableBalance().toFixed(3),
                " ",
                getStablecoinSymbol()
              ] })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: t("savings.amount").replace("{token}", getStablecoinSymbol()) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              step: "0.001",
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none pr-16",
              placeholder: "0.000",
              required: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold", children: getStablecoinSymbol() })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-500/10 border border-blue-500/30 rounded-lg p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-blue-300 leading-tight", children: type === "deposit" ? t("savings.deposit_info") : t("savings.withdraw_info") })
      ] }) }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm animate-shake", children: error }),
      success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm", children: t("savings.success") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-lg transition-colors",
            disabled: processing,
            children: t("common.cancel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            disabled: processing || success,
            children: processing ? t("common.processing") : t("common.confirm")
          }
        )
      ] })
    ] }) })
  ] }) });
};

const RCModal = ({ account, type, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [delegatee, setDelegatee] = reactExports.useState("");
  const [amountHP, setAmountHP] = reactExports.useState("");
  const [processing, setProcessing] = reactExports.useState(false);
  const [isValidating, setIsValidating] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  const [recentRecipients, setRecentRecipients] = reactExports.useState([]);
  const [showRecent, setShowRecent] = reactExports.useState(false);
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    chrome.storage?.local.get(["recentRecipients"], (result) => {
      if (Array.isArray(result.recentRecipients)) setRecentRecipients(result.recentRecipients);
    });
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (account.chain !== Chain.HIVE) {
      setError(t("rc.hive_only"));
      return;
    }
    const cleanDelegatee = delegatee.trim().replace("@", "").toLowerCase();
    if (!cleanDelegatee) {
      setError(t("rc.invalid_delegatee"));
      return;
    }
    if (type === "delegate" && (!amountHP || parseFloat(amountHP) <= 0)) {
      setError(t("rc.invalid_amount"));
      return;
    }
    if (!account.activeKey) {
      setError(t("rc.active_key_required"));
      return;
    }
    setProcessing(true);
    setIsValidating(true);
    setError("");
    try {
      const accData = await fetchAccountData(account.chain, cleanDelegatee);
      if (!accData) {
        setError(t("common.account_not_found") || "Account not found");
        setProcessing(false);
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
      let response;
      if (type === "delegate") {
        response = await broadcastRCDelegate(account.chain, account.name, account.activeKey, cleanDelegatee, parseFloat(amountHP));
      } else {
        response = await broadcastRCUndelegate(account.chain, account.name, account.activeKey, cleanDelegatee);
      }
      if (response.success) {
        saveRecipient(cleanDelegatee);
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(response.error || t("rc.operation_failed"));
      }
    } catch (err) {
      setError(err.message || t("rc.operation_failed"));
    } finally {
      setProcessing(false);
      setIsValidating(false);
    }
  };
  const saveRecipient = (name) => {
    chrome.storage?.local.get(["recentRecipients"], (result) => {
      const list = result.recentRecipients || [];
      if (!list.includes(name)) {
        const newList = [name, ...list].slice(0, 10);
        chrome.storage.local.set({ recentRecipients: newList });
      }
    });
  };
  if (account.chain !== Chain.HIVE) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-yellow-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2", children: t("rc.not_available") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 mb-6", children: t("rc.hive_only") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors",
          children: t("common.close")
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-dark-700 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white", children: type === "delegate" ? t("rc.delegate_title") : t("rc.undelegate_title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onClose,
            className: "text-slate-400 hover:text-white transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-2", children: type === "delegate" ? t("rc.delegate_desc") : t("rc.undelegate_desc") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900/50 rounded-lg p-4 border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mb-1", children: t("rc.from_account") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white font-bold", children: [
          "@",
          account.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mt-1", children: "Hive" }),
        account.stakedBalance !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 pt-2 border-t border-dark-700 flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase", children: "Hive Power" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-blue-400 font-bold", children: [
            account.stakedBalance.toFixed(3),
            " HP"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: t("rc.delegatee") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: delegatee,
            onChange: (e) => setDelegatee(e.target.value),
            onFocus: () => setShowRecent(true),
            onBlur: () => setTimeout(() => setShowRecent(false), 200),
            className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none",
            placeholder: t("rc.delegatee_placeholder"),
            required: true
          }
        ),
        showRecent && recentRecipients.length > 0 && !delegatee && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-10 w-full mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 font-bold px-3 py-2 border-b border-dark-700 uppercase", children: t("common.recent_recipients") || "Recent Recipients" }),
          Array.isArray(recentRecipients) && recentRecipients.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setDelegatee(name),
              className: "w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white transition-colors",
              children: [
                "@",
                name
              ]
            },
            name
          ))
        ] })
      ] }),
      type === "delegate" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: t("rc.max_rc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: amountHP,
            onChange: (e) => setAmountHP(e.target.value),
            className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none",
            placeholder: "10.000",
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-2", children: t("rc.max_rc_hint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-500/10 border border-blue-500/30 rounded-lg p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-blue-300 leading-tight", children: type === "delegate" ? t("rc.delegate_info") : t("rc.undelegate_info") })
      ] }) }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm animate-shake", children: error }),
      success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm", children: t("rc.success") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-lg transition-colors",
            disabled: processing,
            children: t("common.cancel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            disabled: processing || success,
            children: processing ? isValidating ? "Validating..." : t("common.processing") : t("common.confirm")
          }
        )
      ] })
    ] }) })
  ] }) });
};

const WalletView = ({
  chain,
  onChainChange,
  accounts,
  isRefreshing = false,
  onManage,
  onSend,
  onReceive,
  onHistory,
  onRefresh,
  onAddAccount
}) => {
  const { t } = useTranslation();
  const [localRefreshing, setLocalRefreshing] = reactExports.useState(false);
  const [modalState, setModalState] = reactExports.useState({ type: null, account: null });
  const openModal = (type, account) => {
    setModalState({ type, account });
  };
  const closeModal = () => {
    setModalState({ type: null, account: null });
  };
  const handleRefreshClick = async () => {
    if (!onRefresh || localRefreshing || isRefreshing) return;
    setLocalRefreshing(true);
    try {
      await Promise.resolve(onRefresh());
    } finally {
      setTimeout(() => setLocalRefreshing(false), 500);
    }
  };
  const refreshing = isRefreshing || localRefreshing;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 relative h-full overflow-y-auto p-4 custom-scrollbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400", children: t("wallet.network_label") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleRefreshClick,
          disabled: refreshing,
          className: "p-2 bg-dark-800 rounded-full hover:bg-dark-700 hover:text-blue-400 transition-colors border border-dark-700",
          title: t("wallet.refresh_tooltip"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: `w-4 h-4 ${refreshing ? "animate-spin" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex p-1 bg-dark-800 rounded-xl mb-6 border border-dark-700", children: [Chain.BLURT, Chain.HIVE, Chain.STEEM].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onChainChange(c),
        className: `flex-1 py-2 text-xs font-bold rounded-lg transition-all ${chain === c ? c === Chain.HIVE ? "bg-hive text-white shadow-lg" : c === Chain.STEEM ? "bg-steem text-white shadow-lg" : "bg-blurt text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`,
        children: c
      },
      c
    )) }),
    accounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-10 opacity-50 bg-dark-800/50 rounded-xl border border-dashed border-dark-700 flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: t("wallet.no_accounts_chain").replace("{chain}", chain) }),
      onAddAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onAddAccount,
          className: "bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg text-xs transition-colors shadow-lg whitespace-normal leading-tight h-auto max-w-[200px]",
          children: t("wallet.add_one")
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: accounts.map((account) => {
      const hasActive = !!account.activeKey;
      const hasPosting = !!account.postingKey;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-dark-800 p-5 rounded-2xl border border-dark-700 shadow-xl overflow-hidden group hover:border-dark-600 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20px] right-[-20px] w-32 h-32 opacity-5 pointer-events-none transform rotate-12 group-hover:opacity-10 transition-opacity duration-500 blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: chain === Chain.HIVE ? "/Logo_hive.png" : chain === Chain.STEEM ? "/logosteem.png" : "/logoblurt.png",
            alt: chain,
            className: "w-full h-full object-contain"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col mb-4 relative z-10 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg text-white flex items-center gap-2", children: [
            "@",
            account.name,
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              hasActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]", title: t("wallet.active_key_tooltip") }),
              hasPosting && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]", title: t("wallet.posting_key_tooltip") })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-500 text-xs tracking-wide", children: chain }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1 h-1 rounded-full ${chain === Chain.HIVE ? "bg-red-500" : chain === Chain.STEEM ? "bg-blue-500" : "bg-orange-500"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white text-lg tracking-tight", title: String(account.balance), children: account.balance !== void 0 ? account.balance.toFixed(3) : "0.000" })
            ] }),
            (chain === Chain.HIVE || chain === Chain.STEEM) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5 ml-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600 font-bold text-[10px]", children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-400 text-sm", title: String(account.secondaryBalance), children: account.secondaryBalance !== void 0 ? account.secondaryBalance.toFixed(3) : "0.000" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-500", children: chain === Chain.HIVE ? "HBD" : "SBD" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5 ml-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600 font-bold text-[10px]", children: "/" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-blue-400 text-sm", title: String(account.stakedBalance), children: account.stakedBalance !== void 0 ? account.stakedBalance.toFixed(3) : "0.000" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-blue-500/80", children: chain === Chain.HIVE ? "HP" : chain === Chain.STEEM ? "SP" : "BP" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2 mt-4 relative z-10 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onSend && onSend(account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-blue-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": t("wallet.send"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-blue-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: t("wallet.send") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onReceive && onReceive(account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-green-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": t("wallet.receive"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-green-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: t("wallet.receive") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onHistory && onHistory(account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-purple-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": t("wallet.history"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-purple-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: t("wallet.history") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onManage && onManage(account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-orange-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": t("wallet.keys"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-orange-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: t("wallet.keys") })
              ]
            }
          )
        ] }),
        hasActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 mt-2 relative z-10 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => openModal("powerup", account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-cyan-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": "Power Up",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-cyan-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: "Power Up" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => openModal("powerdown", account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-yellow-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": "Power Down",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-5 h-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-yellow-400 transition-colors absolute inset-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3 text-red-500 group-hover/btn:text-red-400 transition-colors absolute top-0 right-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: "Power Down" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => openModal("delegate", account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-pink-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": "Delegate",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-pink-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: "Delegate" })
              ]
            }
          )
        ] }),
        hasActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 mt-2 relative z-10 w-full", children: [
          (chain === Chain.HIVE || chain === Chain.STEEM) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => openModal("savings-deposit", account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-emerald-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": "Savings",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-emerald-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: "Savings" })
              ]
            }
          ),
          chain === Chain.HIVE && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => openModal("rc-delegate", account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-indigo-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": "Delegate RC",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-indigo-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: "Delegate RC" })
              ]
            }
          )
        ] })
      ] }, account.name);
    }) }),
    modalState.account && modalState.type && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      (modalState.type === "powerup" || modalState.type === "powerdown" || modalState.type === "delegate") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        PowerModal,
        {
          account: modalState.account,
          type: modalState.type,
          onClose: closeModal,
          onSuccess: () => {
            closeModal();
            onRefresh?.();
          }
        }
      ),
      (modalState.type === "savings-deposit" || modalState.type === "savings-withdraw") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SavingsModal,
        {
          account: modalState.account,
          type: modalState.type === "savings-deposit" ? "deposit" : "withdraw",
          onClose: closeModal,
          onSuccess: () => {
            closeModal();
            onRefresh?.();
          }
        }
      ),
      (modalState.type === "rc-delegate" || modalState.type === "rc-undelegate") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RCModal,
        {
          account: modalState.account,
          type: modalState.type === "rc-delegate" ? "delegate" : "undelegate",
          onClose: closeModal,
          onSuccess: () => {
            closeModal();
            onRefresh?.();
          }
        }
      )
    ] })
  ] });
};

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  type = "info",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  if (!isOpen) return null;
  const colors = {
    info: "text-blue-400 border-blue-500/30",
    warning: "text-orange-400 border-orange-500/30",
    error: "text-red-400 border-red-500/30",
    success: "text-green-400 border-green-500/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-900 border border-dark-700 rounded-xl shadow-2xl max-w-sm w-full transform transition-all scale-100 animate-slideIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: `text-lg font-bold mb-2 ${colors[type].split(" ")[0]}`, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-300 mb-6 leading-relaxed", children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onCancel,
          disabled: isLoading,
          className: "flex-1 py-2 px-4 bg-dark-800 border border-dark-700 rounded-lg text-slate-400 hover:bg-dark-700 text-sm font-medium transition-colors",
          children: cancelLabel
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onConfirm,
          disabled: isLoading,
          className: `flex-1 py-2 px-4 rounded-lg text-white text-sm font-bold shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2
                                ${type === "error" ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"}
                                ${isLoading ? "opacity-70 cursor-wait" : ""}
                            `,
          children: [
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full" }),
            confirmLabel
          ]
        }
      )
    ] })
  ] }) }) });
};

const BulkTransferForm = ({ chain, account, mode, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [singleAmount, setSingleAmount] = reactExports.useState(0);
  const [singleMemo, setSingleMemo] = reactExports.useState("");
  const [recipientsText, setRecipientsText] = reactExports.useState("");
  const [selectedToken, setSelectedToken] = reactExports.useState(
    chain === Chain.HIVE ? "HIVE" : chain === Chain.STEEM ? "STEEM" : "BLURT"
  );
  reactExports.useEffect(() => {
    if (chain === Chain.HIVE) setSelectedToken("HIVE");
    else if (chain === Chain.STEEM) setSelectedToken("STEEM");
    else setSelectedToken("BLURT");
  }, [chain]);
  const [items, setItems] = reactExports.useState([{
    to: "",
    amount: 0,
    memo: "",
    symbol: chain === Chain.HIVE ? "HIVE" : chain === Chain.STEEM ? "STEEM" : "BLURT"
  }]);
  const [validationStatus, setValidationStatus] = reactExports.useState({ valid: [], invalid: [], checking: false });
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [isBroadcasting, setIsBroadcasting] = reactExports.useState(false);
  const [fundError, setFundError] = reactExports.useState(null);
  const totalAmount = mode === "single" ? Number(singleAmount) * recipientsText.split(/[\s,]+/).filter((s) => s).length : items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  reactExports.useEffect(() => {
    if (!account) return;
    let reqMain = 0;
    let reqSec = 0;
    const mainSym = chain === Chain.HIVE ? "HIVE" : chain === Chain.STEEM ? "STEEM" : "BLURT";
    const secSym = chain === Chain.HIVE ? "HBD" : "SBD";
    if (mode === "single") {
      const count = recipientsText.split(/[\s,]+/).filter((s) => s.trim()).length;
      const amt = Number(singleAmount);
      if (selectedToken === secSym) reqSec = amt * count;
      else reqMain = amt * count;
    } else {
      items.forEach((i) => {
        const amt = Number(i.amount) || 0;
        const sym = i.symbol || selectedToken;
        if (sym === secSym) reqSec += amt;
        else reqMain += amt;
      });
    }
    const availMain = account.balance || 0;
    const availSec = account.secondaryBalance || 0;
    let errorMsg = null;
    if (reqMain > availMain) {
      errorMsg = `${t("validation.insufficient_funds") || "Insufficient Funds"}: ${t("common.required") || "Required"} ${reqMain.toFixed(3)} ${mainSym}, ${t("transfer.available") || "Available"} ${availMain.toFixed(3)}`;
    } else if (reqSec > availSec) {
      errorMsg = `${t("validation.insufficient_funds") || "Insufficient Funds"}: ${t("common.required") || "Required"} ${reqSec.toFixed(3)} ${secSym}, ${t("transfer.available") || "Available"} ${availSec.toFixed(3)}`;
    }
    setFundError(errorMsg);
  }, [singleAmount, recipientsText, items, mode, selectedToken, account, chain, t]);
  const recipientCount = mode === "single" ? recipientsText.split(/[\s,]+/).filter((s) => s.trim()).length : items.filter((i) => i.to).length;
  const [toast, setToast] = reactExports.useState(null);
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (mode === "single") {
          const names = text.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s);
          setRecipientsText(names.join(", "));
        } else {
          const lines = text.split(/\r?\n/);
          const newItems = [];
          lines.forEach((line) => {
            const parts = line.trim().split(/[\s,]+/);
            if (parts.length >= 2) {
              newItems.push({
                to: parts[0],
                amount: parseFloat(parts[1]) || 0,
                memo: parts.slice(2).join(" "),
                symbol: selectedToken
              });
            }
          });
          if (newItems.length > 0) {
            setItems(newItems);
            setToast({ msg: t("import.bulk_summary").replace("{count}", String(newItems.length)), type: "success" });
          } else {
            setToast({ msg: t("import.no_valid_accounts"), type: "error" });
          }
        }
      };
      reader.readAsText(file);
    }
  };
  const verifyAccounts = async (isAuto = false) => {
    setValidationStatus((prev) => ({ ...prev, checking: true }));
    let usernamesToCheck = [];
    if (mode === "single") {
      usernamesToCheck = recipientsText.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s).map((u) => u.replace(/^@/, ""));
    } else {
      usernamesToCheck = items.map((i) => i.to.trim()).filter((s) => s).map((u) => u.replace(/^@/, ""));
    }
    usernamesToCheck = [...new Set(usernamesToCheck)];
    if (usernamesToCheck.length === 0) {
      setValidationStatus({ valid: [], invalid: [], checking: false });
      return;
    }
    const valid = [];
    const invalid = [];
    const CHUNK_SIZE = 5;
    for (let i = 0; i < usernamesToCheck.length; i += CHUNK_SIZE) {
      const chunk = usernamesToCheck.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(async (user) => {
        try {
          const data = await fetchAccountData(chain, user);
          if (data) valid.push(user);
          else invalid.push(user);
        } catch (e) {
          invalid.push(user);
        }
      }));
    }
    setValidationStatus({ valid, invalid, checking: false });
    if (isAuto && invalid.length > 0) {
      setToast({
        msg: t("bulk.warn_not_found").replace("{n}", String(invalid.length)).replace("{chain}", chain),
        type: "warning"
      });
    }
  };
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      const hasData = mode === "single" ? recipientsText.trim().length > 0 : items.some((i) => i.to.trim().length > 0);
      if (hasData) {
        verifyAccounts(true);
      } else {
        setValidationStatus({ valid: [], invalid: [], checking: false });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [recipientsText, items, mode, chain]);
  reactExports.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4e3);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const addNewRow = () => setItems([...items, { to: "", amount: 0, memo: "", symbol: selectedToken }]);
  const removeRow = (idx) => setItems(items.filter((_, i) => i !== idx));
  const handleInitiateSend = () => {
    if (mode === "single" && recipientCount === 0) return;
    if (mode === "multi" && items.length === 0) return;
    if (fundError) {
      setConfirmModal({
        isOpen: true,
        title: t("validation.error") || "Validation Error",
        message: fundError,
        type: "error"
      });
      return;
    }
    if (validationStatus.invalid.length > 0) {
      setConfirmModal({
        isOpen: true,
        title: t("bulk.validation_error"),
        message: t("bulk.error_remove_invalid"),
        type: "error"
      });
      return;
    }
    const recipientsList = mode === "single" ? recipientsText.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s) : [];
    const details = mode === "single" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-950 p-3 rounded border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dark-700 pb-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("sign.from") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
            "@",
            account.name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dark-700 pb-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("transfer.total_amount") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-blue-400 font-bold", children: [
            totalAmount.toFixed(3),
            " ",
            selectedToken
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 mb-1 font-bold", children: [
          t("bulk.recipients"),
          " ",
          recipientsList.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 max-h-32 overflow-y-auto mb-3 custom-scrollbar", children: recipientsList.map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-dark-800 text-slate-300 px-2 py-0.5 rounded text-[10px]", children: [
          "@",
          u.replace(/^@/, "")
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px] text-slate-400 bg-dark-900 p-2 rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            t("transfer.per_user"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
              singleAmount,
              " ",
              selectedToken
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic max-w-[150px] truncate", title: singleMemo, children: singleMemo || "No Memo" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-center italic", children: t("transfer.please_review") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-950 p-3 rounded border border-dark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dark-700 pb-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("sign.from") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
          "@",
          account.name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 mb-1 font-bold", children: [
        t("transfer.operations"),
        " (",
        items.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-48 overflow-y-auto custom-scrollbar space-y-1 pr-1", children: items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col bg-dark-900 p-2 rounded border border-dark-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
            "@",
            item.to.replace(/^@/, "")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-400", children: [
            item.amount,
            " ",
            item.symbol || selectedToken
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 italic truncate", title: item.memo, children: item.memo || "No Memo" })
      ] }, idx)) })
    ] }) });
    setConfirmModal({
      isOpen: true,
      title: t("bulk.title"),
      message: details,
      type: "warning"
    });
  };
  const executeSend = async () => {
    setIsBroadcasting(true);
    let finalItems = [];
    if (mode === "single") {
      const names = recipientsText.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s).map((u) => u.replace(/^@/, ""));
      finalItems = names.map((name) => ({
        to: name,
        amount: Number(singleAmount),
        memo: singleMemo,
        symbol: selectedToken
      }));
    } else {
      finalItems = items.filter((i) => i.to && Number(i.amount) > 0).map((i) => ({
        to: i.to.replace(/^@/, ""),
        amount: Number(i.amount),
        memo: i.memo,
        symbol: i.symbol || selectedToken
      }));
    }
    try {
      if (!account.activeKey) throw new Error(t("bulk.error_no_active"));
      if (fundError) throw new Error(fundError);
      const result = await broadcastBulkTransfer(chain, account.name, account.activeKey, finalItems);
      if (result.success) {
        setConfirmModal({
          isOpen: true,
          title: t("bulk.success_title"),
          message: t("bulk.success_msg").replace("{n}", String(finalItems.length)).replace("{txid}", result.txId?.slice(0, 8) || "???"),
          type: "success"
        });
        onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      setConfirmModal({
        isOpen: true,
        title: t("bulk.error_title"),
        message: e.message || t("bulk.error_failed"),
        type: "error"
      });
    } finally {
      setIsBroadcasting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 w-full max-w-2xl h-[90vh] rounded-2xl shadow-2xl flex flex-col border border-dark-700 animate-slide-up relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 text-slate-400 hover:text-white z-10 p-2 bg-dark-800 rounded-full hover:bg-dark-700 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
        }
      ),
      toast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-xl text-xs font-bold transition-opacity duration-500 animate-slide-down backdrop-blur-md ${toast.type === "error" || toast.type === "warning" ? "bg-red-500/80 text-white" : "bg-green-500/80 text-white"}`, children: toast.msg }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-dark-700 bg-dark-800 rounded-t-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white flex items-center gap-2", children: mode === "single" ? t("bulk.title_single") : t("bulk.title_multi") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-400 text-xs mt-0.5 mb-2", children: [
          t("bulk.sending_from"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-blue-400 font-bold", children: [
            "@",
            account.name
          ] })
        ] }),
        fundError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 bg-red-900/30 text-red-300 border border-red-500/30 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }),
          fundError
        ] }),
        !fundError && (chain === Chain.HIVE || chain === Chain.STEEM) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between bg-dark-900/50 p-2 rounded-lg border border-dark-700 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400 w-full text-right", children: [
          t("bulk.available"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-bold font-mono", children: (selectedToken === "HBD" || selectedToken === "SBD" ? account.secondaryBalance : account.balance)?.toFixed(3) }),
          " ",
          selectedToken
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-dark-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden cursor-pointer group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase border border-blue-500/30 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" }) }),
            t("bulk.import"),
            " CSV/TXT"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", onChange: handleFileImport, className: "absolute inset-0 opacity-0 cursor-pointer", accept: ".csv,.txt" })
        ] }) }),
        mode === "single" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800/50 p-4 rounded-xl border border-dark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider", children: [
              t("bulk.amount"),
              " per user"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  inputMode: "decimal",
                  placeholder: "0.000",
                  value: singleAmount,
                  onChange: (e) => {
                    const val = e.target.value.replace(",", ".");
                    if (val === "" || !isNaN(Number(val)) || val.endsWith(".")) {
                      setSingleAmount(val);
                    }
                  },
                  className: "w-full bg-dark-950 border border-dark-600 rounded-lg p-3 text-lg font-mono text-white focus:border-blue-500 outline-none transition-colors"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-1 top-1 bottom-1 flex items-center", children: chain === Chain.HIVE || chain === Chain.STEEM ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: selectedToken,
                  onChange: (e) => setSelectedToken(e.target.value),
                  className: "h-full bg-dark-800 text-xs font-bold text-white border-l border-dark-600 rounded-r-lg px-2 outline-none cursor-pointer hover:bg-dark-700",
                  children: chain === Chain.HIVE ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HIVE", children: "HIVE" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HBD", children: "HBD" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "STEEM", children: "STEEM" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SBD", children: "SBD" })
                  ] })
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 text-xs font-bold text-slate-500", children: selectedToken }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800/50 p-4 rounded-xl border border-dark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: t("bulk.recipients") }),
              validationStatus.checking && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-blue-400 animate-pulse font-mono", children: "Verifying..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: recipientsText,
                onChange: (e) => setRecipientsText(e.target.value.replace(/[\u200B-\u200D\uFEFF]/g, "")),
                className: "w-full h-32 bg-dark-950 border border-dark-600 rounded-lg p-3 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none resize-none custom-scrollbar",
                placeholder: `user1, user2
user3`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-3 max-h-24 overflow-y-auto custom-scrollbar", children: recipientsText.split(/[\s,]+/).filter((s) => s.trim()).map((user, i) => {
              const clean = user.replace(/^@/, "");
              const isValid = validationStatus.valid.includes(clean);
              const isInvalid = validationStatus.invalid.includes(clean);
              let color = "bg-slate-700 text-slate-400";
              let icon = "";
              if (isValid) {
                color = "bg-green-900/40 text-green-400 border border-green-500/30";
                icon = "✓";
              }
              if (isInvalid) {
                color = "bg-red-900/40 text-red-400 border border-red-500/30";
                icon = "✕";
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] px-2 py-0.5 rounded-full ${color} flex items-center gap-1`, children: [
                icon,
                " ",
                clean
              ] }, i);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800/50 p-4 rounded-xl border border-dark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider", children: t("bulk.memo") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: singleMemo,
                onChange: (e) => setSingleMemo(e.target.value),
                className: "w-full h-20 bg-dark-950 border border-dark-600 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none resize-none",
                placeholder: "Public Memo..."
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          items.map((item, idx) => {
            const clean = item.to.replace(/^@/, "");
            const isValid = validationStatus.valid.includes(clean);
            const isInvalid = validationStatus.invalid.includes(clean);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800/50 p-3 rounded-xl border border-dark-700 relative hover:border-dark-600 transition-colors group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      placeholder: t("import.username"),
                      value: item.to,
                      onChange: (e) => {
                        const newItems = [...items];
                        newItems[idx].to = e.target.value.toLowerCase().replace(/[\s\u200B-\u200D\uFEFF]/g, "");
                        setItems(newItems);
                      },
                      className: `w-full bg-dark-950 border rounded-lg px-3 py-2 text-xs outline-none text-white placeholder-slate-600 ${isValid ? "border-green-500/50" : isInvalid ? "border-red-500/50" : "border-dark-600"}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-2 top-2 text-[10px]", children: [
                    isValid && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "✓" }),
                    isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 font-bold", children: "✕" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-1/2 relative bg-dark-950 rounded-lg border border-dark-600 flex items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      inputMode: "decimal",
                      placeholder: "0.000",
                      value: item.amount,
                      onChange: (e) => {
                        const val = e.target.value.replace(",", ".");
                        if (val === "" || !isNaN(Number(val)) || val.endsWith(".")) {
                          const newItems = [...items];
                          newItems[idx].amount = val;
                          setItems(newItems);
                        }
                      },
                      className: "w-full bg-transparent border-none px-3 py-2 text-xs outline-none text-white placeholder-slate-600 font-mono"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-1 top-1 bottom-1 flex items-center", children: chain === Chain.HIVE || chain === Chain.STEEM ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: item.symbol || selectedToken,
                      onChange: (e) => {
                        const newItems = [...items];
                        newItems[idx].symbol = e.target.value;
                        setItems(newItems);
                      },
                      className: "h-full bg-dark-800 text-xs font-bold text-white border-l border-dark-600 rounded-r-lg px-2 outline-none cursor-pointer hover:bg-dark-700",
                      children: chain === Chain.HIVE ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HIVE", children: "HIVE" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HBD", children: "HBD" })
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "STEEM", children: "STEEM" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SBD", children: "SBD" })
                      ] })
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 text-xs font-bold text-slate-500", children: item.symbol || selectedToken }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => removeRow(idx),
                    className: "text-red-400 hover:text-red-200 hover:bg-red-500/10 rounded w-8 flex items-center justify-center transition-colors",
                    title: "Remove row",
                    children: "✕"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  rows: 3,
                  placeholder: t("bulk.memo"),
                  value: item.memo,
                  onChange: (e) => {
                    const newItems = [...items];
                    newItems[idx].memo = e.target.value;
                    setItems(newItems);
                  },
                  className: "w-full bg-dark-950 border border-dark-600 rounded-lg px-3 py-2 text-xs outline-none text-white placeholder-slate-600 resize-none custom-scrollbar"
                }
              ) })
            ] }, idx);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addNewRow, className: "w-full py-3 bg-dark-800 border-2 border-dashed border-dark-600 rounded-xl text-slate-400 text-xs font-bold hover:border-blue-500/50 hover:text-blue-400 transition-all", children: [
            "+ ",
            t("bulk.add_row")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6 pb-4 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleInitiateSend,
            disabled: validationStatus.invalid.length > 0 || validationStatus.checking || isBroadcasting || !!fundError,
            className: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-dark-600 disabled:to-dark-600 disabled:text-slate-500 text-white font-bold py-2 px-6 h-auto min-h-[40px] rounded-full shadow-lg transition-all transform active:scale-[0.98] text-xs tracking-wide whitespace-normal leading-tight max-w-[200px]",
            children: isBroadcasting ? "Broadcasting..." : t("bulk.sign_broadcast")
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationModal,
      {
        isOpen: !!confirmModal,
        title: confirmModal?.title || "",
        message: confirmModal?.message || "",
        type: confirmModal?.type,
        onConfirm: () => {
          if (confirmModal?.type === "success") {
            setConfirmModal(null);
            onClose();
          } else if (confirmModal?.type === "error") {
            setConfirmModal(null);
          } else {
            executeSend();
          }
        },
        onCancel: () => setConfirmModal(null),
        isLoading: isBroadcasting,
        confirmLabel: confirmModal?.type === "warning" ? t("common.confirm") || "Confirm" : "OK",
        cancelLabel: confirmModal?.type === "warning" ? t("common.cancel") || "Cancel" : t("common.close") || "Close"
      }
    )
  ] });
};

const BulkTransfer = ({ chain, accounts, refreshBalance, onChangeChain, onAddAccount }) => {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = reactExports.useState(null);
  const currentChainAccounts = accounts.filter((a) => a.chain === chain);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-dark-900 overflow-hidden relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400 mb-4", children: t("bulk.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex p-1 bg-dark-800 rounded-xl mb-4 border border-dark-700", children: [Chain.BLURT, Chain.HIVE, Chain.STEEM].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onChangeChain && onChangeChain(c),
          className: `flex-1 py-2 text-xs font-bold rounded-lg transition-all ${chain === c ? c === Chain.HIVE ? "bg-hive text-white shadow-lg" : c === Chain.STEEM ? "bg-steem text-white shadow-lg" : "bg-blurt text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`,
          children: c
        },
        c
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-4", children: currentChainAccounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 opacity-50 bg-dark-800/50 rounded-xl border border-dashed border-dark-700 flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-400", children: t("bulk.no_accounts").replace("{chain}", chain) }),
      onAddAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onAddAccount,
          className: "bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg text-xs transition-colors shadow-lg",
          children: t("wallet.add_one")
        }
      )
    ] }) : currentChainAccounts.map((account) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-dark-800 p-5 rounded-2xl border border-dark-700 shadow-xl overflow-hidden group hover:border-dark-600 transition-all", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20px] right-[-20px] w-32 h-32 opacity-5 pointer-events-none transform rotate-12 group-hover:opacity-10 transition-opacity duration-500 blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: chain === Chain.HIVE ? "/Logo_hive.png" : chain === Chain.STEEM ? "/logosteem.png" : "/logoblurt.png",
          alt: chain,
          className: "w-full h-full object-contain"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg text-white flex items-center gap-2", children: [
              "@",
              account.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400 font-bold tracking-wider mt-1", children: [
              chain,
              " COIN"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-black text-white block truncate", children: account.balance !== void 0 ? account.balance.toFixed(3) : "0.000" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-500", children: chain })
            ] }),
            (chain === Chain.HIVE || chain === Chain.STEEM) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 justify-end mt-[-2px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-slate-400 block truncate", children: account.secondaryBalance !== void 0 ? account.secondaryBalance.toFixed(3) : "0.000" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-600", children: chain === Chain.HIVE ? "HBD" : "SBD" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveModal({ account, mode: "single" }),
              className: "bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-blue-500/50 py-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-2 group/btn relative overflow-hidden",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-blue-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-dark-800 rounded-full group-hover/btn:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-blue-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 group-hover/btn:text-white relative z-10", children: t("bulk.same_amount") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveModal({ account, mode: "multi" }),
              className: "bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-purple-500/50 py-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-2 group/btn relative overflow-hidden",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-purple-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-dark-800 rounded-full group-hover/btn:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-purple-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 group-hover/btn:text-white relative z-10", children: t("bulk.diff_amount") })
              ]
            }
          )
        ] })
      ] })
    ] }, account.name)) }),
    activeModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BulkTransferForm,
      {
        chain,
        account: activeModal.account,
        mode: activeModal.mode,
        onClose: () => setActiveModal(null),
        onSuccess: () => {
          setActiveModal(null);
          if (refreshBalance) refreshBalance();
        }
      }
    )
  ] });
};

const NotificationToast = ({ message, type = "success", onClose }) => {
  reactExports.useEffect(() => {
    const timer = setTimeout(onClose, 3e3);
    return () => clearTimeout(timer);
  }, [onClose]);
  const bgColors = {
    success: "bg-green-600/90 border-green-500/50",
    error: "bg-red-600/90 border-red-500/50",
    info: "bg-blue-600/90 border-blue-500/50"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `
                ${bgColors[type]} 
                text-white text-xs font-bold px-6 py-3 rounded-xl shadow-2xl border border-opacity-50
                animate-bounce-in pointer-events-auto flex items-center gap-2 backdrop-blur-md
                max-w-[85vw]
            `, children: [
    type === "success" && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
    type === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-all line-clamp-4 overflow-y-auto max-h-32 custom-scrollbar pr-1", children: message })
  ] }) });
};

const NotificationContext = reactExports.createContext(void 0);
const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = reactExports.useState(null);
  const showNotification = reactExports.useCallback((message, type = "success") => {
    setNotification({ message, type });
  }, []);
  const clearNotification = reactExports.useCallback(() => {
    setNotification(null);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(NotificationContext.Provider, { value: { showNotification }, children: [
    children,
    notification && /* @__PURE__ */ jsxRuntimeExports.jsx(
      NotificationToast,
      {
        message: notification.message,
        type: notification.type,
        onClose: clearNotification
      }
    )
  ] });
};
const useNotification = () => {
  const context = reactExports.useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

const MULTISIG_VISIBLE_OPERATION_TYPES = [
  { value: "transfer", labelKey: "multisig.op_transfer", fallback: "Transfer" },
  { value: "delegate_vesting_shares", labelKey: "multisig.op_delegate", fallback: "Delegate Power" },
  { value: "undelegate_vesting_shares", labelKey: "multisig.op_undelegate", fallback: "Undelegate Power" },
  { value: "transfer_to_vesting", labelKey: "multisig.op_powerup", fallback: "Power Up" }
];
const MULTISIG_STORAGE_KEY = "gravity_multisig_proposals";
const MULTISIG_INCOMING_STORAGE_KEY = "gravity_multisig_incoming_proposals";
const MULTISIG_OUTBOX_STORAGE_KEY = "gravity_multisig_outbox";
const MULTISIG_SYNC_KIND = "gravity-multisig-proposal";
const MULTISIG_CUSTOM_JSON_ID = "gravity.multisig";
const MULTISIG_HISTORY_CURSOR_PREFIX = "gravity_multisig_history_cursor_";
const MULTISIG_SYNC_POLL_MS = 15e3;
const MULTISIG_SUPPORTED_CHAINS = [Chain.BLURT, Chain.HIVE, Chain.STEEM];
const MULTISIG_DEFAULT_CHAIN = Chain.BLURT;
const MULTISIG_EXPIRATION_GRACE_MS = 2 * 60 * 1e3;
const DIRECT_MULTISIG_EXPIRATION_MINUTES = 55;
const getSupportedMultiSigChain = (chain) => MULTISIG_SUPPORTED_CHAINS.includes(chain) ? chain : MULTISIG_DEFAULT_CHAIN;
const getDefaultProposalTitle = (chain, initiator, opType, toValue) => {
  const cleanInitiator = initiator.replace(/^@/, "").trim();
  const cleanTarget = toValue.replace(/^@/, "").trim();
  switch (opType) {
    case "transfer":
      return cleanTarget ? `${chain} transfer • @${cleanInitiator} → @${cleanTarget}` : `${chain} transfer • @${cleanInitiator}`;
    case "delegate_vesting_shares":
      return cleanTarget ? `${chain} delegate • @${cleanInitiator} → @${cleanTarget}` : `${chain} delegate • @${cleanInitiator}`;
    case "undelegate_vesting_shares":
      return cleanTarget ? `${chain} undelegate • @${cleanInitiator} → @${cleanTarget}` : `${chain} undelegate • @${cleanInitiator}`;
    case "transfer_to_vesting":
      return cleanTarget ? `${chain} power up • @${cleanInitiator} → @${cleanTarget}` : `${chain} power up • @${cleanInitiator}`;
    case "withdraw_vesting":
      return `${chain} power down • @${cleanInitiator}`;
    default:
      return `${chain} proposal • @${cleanInitiator || "unknown"}`;
  }
};
const toLocalDateTimeInput = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const getDefaultMultiSigExpiration = () => toLocalDateTimeInput(
  new Date(Date.now() + DIRECT_MULTISIG_EXPIRATION_MINUTES * 60 * 1e3)
);
const normalizeMultiSigExpiration = (rawValue) => {
  const parsed = rawValue ? new Date(rawValue) : /* @__PURE__ */ new Date();
  const safeBase = Number.isNaN(parsed.getTime()) ? /* @__PURE__ */ new Date() : parsed;
  const now = Date.now();
  const maxAllowed = now + DIRECT_MULTISIG_EXPIRATION_MINUTES * 60 * 1e3;
  const clampedTime = Math.min(Math.max(safeBase.getTime(), now + 60 * 1e3), maxAllowed);
  const clampedDate = new Date(clampedTime);
  return {
    localValue: toLocalDateTimeInput(clampedDate),
    isoValue: clampedDate.toISOString()
  };
};
const getCoordinationThreshold = (signers) => {
  const unique = new Set((signers || []).map((name) => name.replace(/^@/, "").trim()).filter(Boolean));
  return Math.max(1, unique.size);
};
const getProposalExpirationTime = (proposal) => {
  if (!proposal.expiration) return null;
  const parsed = new Date(proposal.expiration).getTime();
  return Number.isNaN(parsed) ? null : parsed;
};
const isProposalExpired = (proposal) => {
  if (proposal.lastBroadcastTxId) return false;
  if (proposal.expiredAt) return true;
  const expirationTime = getProposalExpirationTime(proposal);
  return expirationTime !== null && Date.now() >= expirationTime + MULTISIG_EXPIRATION_GRACE_MS;
};
const calculateCoordinationProgress = (proposal, partialSignatures) => {
  const signedNames = new Set(partialSignatures.map((entry) => entry.username));
  const eligibleNames = new Set((proposal.signers || []).map((name) => name.replace(/^@/, "")));
  let current = 0;
  eligibleNames.forEach((name) => {
    if (signedNames.has(name)) current += 1;
  });
  const threshold = getCoordinationThreshold(proposal.signers || []);
  return {
    current,
    threshold,
    canBroadcast: current >= threshold
  };
};
const normalizeSavedProposal = (proposal) => {
  if (!proposal || !proposal.chain || !proposal.initiator || !proposal.operation) {
    return null;
  }
  return {
    id: proposal.id || crypto.randomUUID(),
    title: proposal.title || `${proposal.chain} proposal • @${proposal.initiator}`,
    chain: proposal.chain,
    initiator: proposal.initiator,
    threshold: getCoordinationThreshold(Array.isArray(proposal.signers) ? proposal.signers : []),
    signers: Array.isArray(proposal.signers) ? proposal.signers : [],
    expiration: proposal.expiration || null,
    operationType: proposal.operationType || "custom",
    operation: proposal.operation,
    authoritySnapshot: proposal.authoritySnapshot || null,
    unsignedTransaction: proposal.unsignedTransaction,
    partialSignatures: Array.isArray(proposal.partialSignatures) ? proposal.partialSignatures : [],
    lastBroadcastTxId: proposal.lastBroadcastTxId,
    expiredAt: proposal.expiredAt,
    createdAt: proposal.createdAt || Date.now(),
    updatedAt: proposal.updatedAt || proposal.createdAt || Date.now()
  };
};
const toTransportProposal = (proposal) => {
  let compactOperation = proposal.operation;
  try {
    compactOperation = JSON.stringify(JSON.parse(proposal.operation));
  } catch {
    compactOperation = proposal.operation;
  }
  return {
    ...proposal,
    operation: compactOperation,
    unsignedTransaction: void 0,
    authoritySnapshot: proposal.authoritySnapshot || void 0
  };
};
const isLocalProposalRelevant = (proposal, localUsernames) => {
  if (localUsernames.has(proposal.initiator)) return true;
  return (proposal.signers || []).some((name) => localUsernames.has(name.replace(/^@/, "").trim()));
};
const normalizeChainEvent = (value) => {
  if (!value || value.namespace !== "gravity.multisig" || value.v !== 1 || !value.type || !value.proposalId || !value.chain) {
    return null;
  }
  if (value.type === "proposal_created" && value.proposal) {
    return value;
  }
  if (value.type === "proposal_signed" && value.signature) {
    return value;
  }
  if (value.type === "proposal_broadcasted" && value.txId) {
    return value;
  }
  if (value.type === "proposal_expired" && value.expiredAt) {
    return value;
  }
  if (value.type === "proposal_deleted") {
    return value;
  }
  return null;
};
const getPendingEventId = (event) => {
  switch (event.type) {
    case "proposal_signed":
      return `${event.proposalId}:${event.type}:${event.signature.username}:${event.signature.signature}`;
    case "proposal_broadcasted":
      return `${event.proposalId}:${event.type}:${event.txId}`;
    case "proposal_created":
    case "proposal_deleted":
      return `${event.proposalId}:${event.type}`;
    case "proposal_expired":
      return `${event.proposalId}:${event.type}:${event.expiredAt}`;
  }
};
const IconChevron = ({ open }) => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: `w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) });
const IconJump = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 5l7 7-7 7M5 5h6v14H5" }) });
const IconLoad = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }) });
const IconCopy = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7h8a2 2 0 012 2v8m-10 0H6a2 2 0 01-2-2V7m4 10h8a2 2 0 002-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z" }) });
const IconTrash = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" }) });
const IconSave = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) });
const getProposalStatus = (proposal, coordinationProgress, onChainProgress, t) => {
  if (isProposalExpired(proposal)) {
    return {
      label: t("multisig.status_expired") || "Expired",
      tone: "bg-red-500/10 text-red-400 border border-red-500/20"
    };
  }
  if (proposal.lastBroadcastTxId) {
    return {
      label: t("multisig.status_broadcasted") || "Broadcasted",
      tone: "bg-green-500/10 text-green-400 border border-green-500/20"
    };
  }
  if (coordinationProgress.canBroadcast && onChainProgress?.canBroadcast) {
    return {
      label: t("multisig.status_ready") || "Ready to Broadcast",
      tone: "bg-blue-500/10 text-blue-400 border border-blue-500/20"
    };
  }
  return {
    label: t("multisig.status_pending") || "Pending Signatures",
    tone: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
  };
};
const buildProposalTimeline = (proposal, t) => {
  const entries = [
    {
      id: `${proposal.id}:created`,
      tone: "neutral",
      label: t("multisig.timeline_created") || "Created",
      at: proposal.createdAt || null
    },
    ...proposal.partialSignatures.map((signature) => ({
      id: `${proposal.id}:signed:${signature.username}`,
      tone: "info",
      label: `${t("multisig.timeline_signed") || "Signed"} @${signature.username}`,
      at: signature.signedAt || null
    })),
    ...proposal.expiredAt ? [{
      id: `${proposal.id}:expired`,
      tone: "neutral",
      label: t("multisig.timeline_expired") || "Expired",
      at: proposal.expiredAt
    }] : [],
    ...proposal.lastBroadcastTxId ? [{
      id: `${proposal.id}:broadcasted`,
      tone: "success",
      label: t("multisig.timeline_broadcasted") || "Broadcasted",
      at: proposal.updatedAt || null
    }] : []
  ];
  return entries.sort((left, right) => (left.at || 0) - (right.at || 0));
};
const MultiSig = ({ chain: initialChain, accounts, onChainChange }) => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [selectedChain, setSelectedChain] = reactExports.useState(() => getSupportedMultiSigChain(initialChain));
  const [newSigner, setNewSigner] = reactExports.useState("");
  const [opType, setOpType] = reactExports.useState("transfer");
  const [to, setTo] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [memo, setMemo] = reactExports.useState("");
  const [expiresAt, setExpiresAt] = reactExports.useState(() => getDefaultMultiSigExpiration());
  const [copied, setCopied] = reactExports.useState(false);
  const [saveLabel, setSaveLabel] = reactExports.useState("");
  const [importPayload, setImportPayload] = reactExports.useState("");
  const [savedProposals, setSavedProposals] = reactExports.useState([]);
  const [incomingProposals, setIncomingProposals] = reactExports.useState([]);
  const [proposalBusyId, setProposalBusyId] = reactExports.useState(null);
  const [authorityLoading, setAuthorityLoading] = reactExports.useState(false);
  const [authority, setAuthority] = reactExports.useState(null);
  const [authorityError, setAuthorityError] = reactExports.useState(null);
  const [transportInfo, setTransportInfo] = reactExports.useState(null);
  const [refreshingChain, setRefreshingChain] = reactExports.useState(false);
  const [showOperationPreview, setShowOperationPreview] = reactExports.useState(false);
  const [showProposalDraft, setShowProposalDraft] = reactExports.useState(false);
  const [expandedBroadcasted, setExpandedBroadcasted] = reactExports.useState({});
  const isMountedRef = reactExports.useRef(true);
  const copyResetTimeoutRef = reactExports.useRef(null);
  const savedProposalsRef = reactExports.useRef([]);
  const incomingProposalsRef = reactExports.useRef([]);
  const pendingEventsRef = reactExports.useRef([]);
  const flushingOutboxRef = reactExports.useRef(false);
  const chainAccounts = reactExports.useMemo(
    () => accounts.filter((account) => account.chain === selectedChain),
    [accounts, selectedChain]
  );
  const [request, setRequest] = reactExports.useState({
    initiator: chainAccounts[0]?.name || "",
    signers: [],
    threshold: 1,
    operation: "{}"
  });
  reactExports.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (copyResetTimeoutRef.current) {
        window.clearTimeout(copyResetTimeoutRef.current);
        copyResetTimeoutRef.current = null;
      }
    };
  }, []);
  reactExports.useEffect(() => {
    savedProposalsRef.current = savedProposals;
  }, [savedProposals]);
  reactExports.useEffect(() => {
    incomingProposalsRef.current = incomingProposals;
  }, [incomingProposals]);
  const persistPendingEvents = async (entries) => {
    pendingEventsRef.current = entries;
    await storageService.setItem(MULTISIG_OUTBOX_STORAGE_KEY, JSON.stringify(entries));
  };
  reactExports.useEffect(() => {
    const nextChain = getSupportedMultiSigChain(initialChain);
    if (initialChain !== nextChain) {
      onChainChange?.(nextChain);
    }
    setSelectedChain(nextChain);
  }, [initialChain, onChainChange]);
  reactExports.useEffect(() => {
    let cancelled = false;
    const loadStoredData = async () => {
      try {
        const raw = await storageService.getItem(MULTISIG_STORAGE_KEY);
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw);
          const normalized = parsed.map((proposal) => normalizeSavedProposal(proposal)).filter((proposal) => !!proposal);
          if (isMountedRef.current) {
            setSavedProposals(normalized);
          }
          if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
            await storageService.setItem(MULTISIG_STORAGE_KEY, JSON.stringify(normalized));
          }
        }
        const rawIncoming = await storageService.getItem(MULTISIG_INCOMING_STORAGE_KEY);
        if (!cancelled && rawIncoming) {
          const parsedIncoming = JSON.parse(rawIncoming);
          const normalizedIncoming = parsedIncoming.map((entry) => {
            const normalizedProposal = normalizeSavedProposal(entry?.proposal);
            if (!normalizedProposal) return null;
            return {
              proposal: normalizedProposal,
              sentAt: entry?.sentAt || normalizedProposal.updatedAt || normalizedProposal.createdAt,
              sentBy: entry?.sentBy || "unknown"
            };
          }).filter((entry) => !!entry);
          if (isMountedRef.current) {
            setIncomingProposals(normalizedIncoming);
          }
          if (JSON.stringify(parsedIncoming) !== JSON.stringify(normalizedIncoming)) {
            await storageService.setItem(MULTISIG_INCOMING_STORAGE_KEY, JSON.stringify(normalizedIncoming));
          }
        }
        const rawOutbox = await storageService.getItem(MULTISIG_OUTBOX_STORAGE_KEY);
        if (!cancelled && rawOutbox) {
          try {
            const parsedOutbox = JSON.parse(rawOutbox);
            const normalizedOutbox = (parsedOutbox || []).filter((entry) => entry?.event && entry?.announcerName).map((entry) => ({
              id: entry.id || getPendingEventId(entry.event),
              announcerName: entry.announcerName,
              event: entry.event,
              queuedAt: entry.queuedAt || entry.event.sentAt || Date.now()
            }));
            pendingEventsRef.current = normalizedOutbox;
            if (JSON.stringify(parsedOutbox) !== JSON.stringify(normalizedOutbox)) {
              await storageService.setItem(MULTISIG_OUTBOX_STORAGE_KEY, JSON.stringify(normalizedOutbox));
            }
          } catch (error) {
            console.warn("Failed to load multisig event outbox:", error);
            pendingEventsRef.current = [];
          }
        }
      } catch (error) {
        console.warn("Failed to load saved multisig proposals:", error);
      }
    };
    loadStoredData();
    return () => {
      cancelled = true;
    };
  }, []);
  reactExports.useEffect(() => {
    const fallbackInitiator = chainAccounts[0]?.name || "";
    setRequest((prev) => ({
      ...prev,
      initiator: chainAccounts.some((account) => account.name === prev.initiator) ? prev.initiator : fallbackInitiator,
      signers: prev.signers.filter((signer) => signer.trim().length > 0)
    }));
  }, [chainAccounts]);
  reactExports.useEffect(() => {
    let cancelled = false;
    const loadAuthority = async () => {
      if (!request.initiator) {
        if (isMountedRef.current) {
          setAuthority(null);
          setAuthorityError(null);
        }
        return;
      }
      if (isMountedRef.current) {
        setAuthorityLoading(true);
        setAuthorityError(null);
      }
      try {
        const auth = await getAccountAuthorities(selectedChain, request.initiator, "active");
        if (cancelled) return;
        if (isMountedRef.current) {
          setAuthority(auth);
        }
        if (auth?.threshold && isMountedRef.current) {
          setRequest((prev) => ({
            ...prev,
            threshold: Math.max(1, Math.min(prev.threshold || auth.threshold, auth.threshold))
          }));
        }
      } catch (error) {
        if (cancelled) return;
        if (isMountedRef.current) {
          setAuthority(null);
          setAuthorityError(error?.message || "Failed to inspect account authority.");
        }
      } finally {
        if (!cancelled && isMountedRef.current) setAuthorityLoading(false);
      }
    };
    loadAuthority();
    return () => {
      cancelled = true;
    };
  }, [request.initiator, selectedChain]);
  reactExports.useEffect(() => {
    const asset = selectedChain === Chain.HIVE ? "HIVE" : selectedChain === Chain.STEEM ? "STEEM" : "BLURT";
    const fmtAmount = (value) => `${parseFloat(value || "0").toFixed(3)} ${asset}`;
    const fmtVests = (value) => `${parseFloat(value || "0").toFixed(6)} VESTS`;
    if (opType === "custom") return;
    let operation = {};
    switch (opType) {
      case "transfer":
        operation = [
          "transfer",
          {
            from: request.initiator,
            to,
            amount: fmtAmount(amount),
            memo
          }
        ];
        break;
      case "delegate_vesting_shares":
        operation = [
          "delegate_vesting_shares",
          {
            delegator: request.initiator,
            delegatee: to,
            vesting_shares: fmtVests(amount)
          }
        ];
        break;
      case "undelegate_vesting_shares":
        operation = [
          "delegate_vesting_shares",
          {
            delegator: request.initiator,
            delegatee: to,
            vesting_shares: "0.000000 VESTS"
          }
        ];
        break;
      case "transfer_to_vesting":
        operation = [
          "transfer_to_vesting",
          {
            from: request.initiator,
            to: to || request.initiator,
            amount: fmtAmount(amount)
          }
        ];
        break;
      case "withdraw_vesting":
        operation = [
          "withdraw_vesting",
          {
            account: request.initiator,
            vesting_shares: fmtVests(amount)
          }
        ];
        break;
    }
    setRequest((prev) => ({
      ...prev,
      operation: JSON.stringify(operation, null, 2)
    }));
  }, [amount, memo, opType, request.initiator, selectedChain, to]);
  const availableSigners = reactExports.useMemo(() => {
    const local = chainAccounts.map((account) => account.name);
    const onChain = authority?.accountAuths.map(([name]) => name) || [];
    return Array.from(/* @__PURE__ */ new Set([...local, ...onChain])).filter(Boolean);
  }, [authority?.accountAuths, chainAccounts]);
  const activeAuthorityAccounts = authority?.accountAuths ?? [];
  const activeAuthorityKeys = authority?.keyAuths ?? [];
  const looksLikeMultisig = !!authority && (activeAuthorityAccounts.length > 0 || authority.threshold > 1);
  const activeProposal = reactExports.useMemo(
    () => savedProposals.find((proposal) => !proposal.lastBroadcastTxId && !isProposalExpired(proposal)) || null,
    [savedProposals]
  );
  const addSigner = (signerName) => {
    const signer = (signerName ?? newSigner).trim().replace(/^@/, "");
    if (!signer || request.signers.includes(signer)) return;
    setRequest((prev) => ({ ...prev, signers: [...prev.signers, signer] }));
    setNewSigner("");
  };
  const removeSigner = (signer) => {
    setRequest((prev) => ({ ...prev, signers: prev.signers.filter((candidate) => candidate !== signer) }));
  };
  const handleSelectChain = (chain) => {
    const nextChain = getSupportedMultiSigChain(chain);
    setSelectedChain(nextChain);
    onChainChange?.(nextChain);
  };
  const proposalDraft = reactExports.useMemo(() => {
    const coordinationThreshold = getCoordinationThreshold(request.signers);
    return JSON.stringify({
      chain: selectedChain,
      initiator: request.initiator,
      threshold: coordinationThreshold,
      signers: request.signers,
      expiration: expiresAt ? new Date(expiresAt).toISOString() : null,
      operation: (() => {
        try {
          return JSON.parse(request.operation);
        } catch {
          return request.operation;
        }
      })(),
      authoritySnapshot: authority
    }, null, 2);
  }, [authority, expiresAt, request.initiator, request.operation, request.signers, selectedChain]);
  const saveValidation = reactExports.useMemo(() => {
    const issues = [];
    if (!request.initiator.trim()) {
      issues.push("initiator");
    }
    if (request.signers.length === 0) {
      issues.push("signers");
    }
    if (opType !== "custom") {
      if (opType !== "withdraw_vesting" && !to.trim()) {
        issues.push("target");
      }
      if (opType !== "undelegate_vesting_shares") {
        const numericAmount = Number(amount);
        if (!amount.trim() || Number.isNaN(numericAmount) || numericAmount <= 0) {
          issues.push("amount");
        }
      }
    } else {
      try {
        JSON.parse(request.operation);
      } catch {
        issues.push("operation");
      }
    }
    return {
      isValid: issues.length === 0,
      issues
    };
  }, [amount, opType, request.initiator, request.operation, request.signers, to]);
  const handleCopyDraft = async () => {
    await navigator.clipboard.writeText(proposalDraft);
    if (isMountedRef.current) {
      setCopied(true);
    }
    if (copyResetTimeoutRef.current) {
      window.clearTimeout(copyResetTimeoutRef.current);
    }
    copyResetTimeoutRef.current = window.setTimeout(() => {
      if (isMountedRef.current) {
        setCopied(false);
      }
      copyResetTimeoutRef.current = null;
    }, 1800);
  };
  const persistSavedProposals = async (proposals) => {
    savedProposalsRef.current = proposals;
    if (isMountedRef.current) {
      setSavedProposals(proposals);
    }
    await storageService.setItem(MULTISIG_STORAGE_KEY, JSON.stringify(proposals));
  };
  const persistIncomingProposals = async (entries) => {
    incomingProposalsRef.current = entries;
    if (isMountedRef.current) {
      setIncomingProposals(entries);
    }
    await storageService.setItem(MULTISIG_INCOMING_STORAGE_KEY, JSON.stringify(entries));
  };
  const mergeProposalIntoList = (incoming, current) => {
    const existing = current.find((entry) => entry.id === incoming.id);
    if (!existing) {
      return [incoming, ...current].slice(0, 20);
    }
    const winner = (incoming.updatedAt || incoming.createdAt || 0) >= (existing.updatedAt || existing.createdAt || 0) ? incoming : existing;
    return [
      winner,
      ...current.filter((entry) => entry.id !== incoming.id)
    ].slice(0, 20);
  };
  const mergeIncomingProposal = (incoming, current) => {
    const existing = current.find((entry) => entry.proposal.id === incoming.proposal.id);
    if (!existing) {
      return [incoming, ...current].slice(0, 20);
    }
    const winner = (incoming.proposal.updatedAt || incoming.sentAt || 0) >= (existing.proposal.updatedAt || existing.sentAt || 0) ? incoming : existing;
    return [
      winner,
      ...current.filter((entry) => entry.proposal.id !== incoming.proposal.id)
    ].slice(0, 20);
  };
  const buildSharedPackage = (proposal) => ({
    version: 1,
    kind: MULTISIG_SYNC_KIND,
    proposal: toTransportProposal(proposal)
  });
  const getAnnouncementAccount = (username, chain) => {
    const normalized = username.replace(/^@/, "").trim();
    const account = accounts.find((entry) => entry.chain === chain && entry.name === normalized);
    if (!account) return null;
    if (account.postingKey) return { account, key: account.postingKey, keyType: "Posting" };
    if (account.activeKey) return { account, key: account.activeKey, keyType: "Active" };
    return null;
  };
  const publishMultiSigEvent = reactExports.useCallback(async (event, announcerName, options) => {
    const announcer = getAnnouncementAccount(announcerName, event.chain);
    if (!announcer) {
      const message = `On-chain multisig sync unavailable for @${announcerName}: import a posting or active key first.`;
      if (!options?.silent) {
        if (isMountedRef.current) setTransportInfo(message);
        showNotification(message, "info");
      }
      return false;
    }
    const result = await broadcastCustomJson(
      event.chain,
      announcer.account.name,
      announcer.key,
      MULTISIG_CUSTOM_JSON_ID,
      JSON.stringify(event),
      announcer.keyType
    );
    if (!result.success) {
      const message = result.error || "Failed to publish multisig sync event on-chain.";
      if (!options?.silent) {
        if (isMountedRef.current) setTransportInfo(message);
        showNotification(message, "info");
      }
      return false;
    }
    if (!options?.silent && isMountedRef.current) {
      setTransportInfo(`On-chain multisig update published by @${announcer.account.name}`);
    }
    return true;
  }, [accounts, showNotification]);
  const flushPendingEvents = reactExports.useCallback(async () => {
    if (flushingOutboxRef.current || pendingEventsRef.current.length === 0) return;
    flushingOutboxRef.current = true;
    try {
      let queue = [...pendingEventsRef.current];
      const remaining = [];
      for (const entry of queue) {
        const published = await publishMultiSigEvent(entry.event, entry.announcerName, { silent: true });
        if (!published) {
          remaining.push(entry);
        }
      }
      await persistPendingEvents(remaining);
    } finally {
      flushingOutboxRef.current = false;
    }
  }, [publishMultiSigEvent]);
  const enqueuePendingEvent = reactExports.useCallback(async (event, announcerName) => {
    const entry = {
      id: getPendingEventId(event),
      announcerName,
      event,
      queuedAt: Date.now()
    };
    const nextQueue = [
      entry,
      ...pendingEventsRef.current.filter((pending) => pending.id !== entry.id)
    ].slice(0, 50);
    await persistPendingEvents(nextQueue);
    await flushPendingEvents();
  }, [flushPendingEvents]);
  const ensureProposalArtifacts = async (proposal) => {
    let nextProposal = proposal;
    let changed = false;
    if (!nextProposal.authoritySnapshot) {
      const authoritySnapshot = await getAccountAuthorities(nextProposal.chain, nextProposal.initiator, "active");
      nextProposal = {
        ...nextProposal,
        authoritySnapshot
      };
      changed = true;
    }
    if (!nextProposal.unsignedTransaction) {
      let operationPayload;
      try {
        operationPayload = JSON.parse(nextProposal.operation);
      } catch {
        operationPayload = nextProposal.operation;
      }
      const normalizedExpiration = normalizeMultiSigExpiration(nextProposal.expiration);
      const unsignedTransaction = await createUnsignedTransaction(
        nextProposal.chain,
        Array.isArray(operationPayload) ? [operationPayload] : operationPayload,
        normalizedExpiration.isoValue
      );
      nextProposal = {
        ...nextProposal,
        expiration: normalizedExpiration.isoValue,
        unsignedTransaction
      };
      changed = true;
    }
    if (changed) {
      const persisted = savedProposals.map((entry) => entry.id === nextProposal.id ? { ...nextProposal, updatedAt: entry.updatedAt || Date.now() } : entry);
      await persistSavedProposals(persisted);
      return persisted.find((entry) => entry.id === nextProposal.id) || nextProposal;
    }
    return nextProposal;
  };
  const handleSaveProposal = async () => {
    if (!saveValidation.isValid) {
      showNotification(t("multisig.validation_required") || "Fill in the required fields before saving this proposal.", "info");
      return;
    }
    const coordinationThreshold = getCoordinationThreshold(request.signers);
    const normalizedExpiration = normalizeMultiSigExpiration(expiresAt);
    let operationPayload;
    try {
      operationPayload = JSON.parse(request.operation);
    } catch {
      operationPayload = request.operation;
    }
    const unsignedTransaction = await createUnsignedTransaction(
      selectedChain,
      Array.isArray(operationPayload) ? [operationPayload] : operationPayload,
      normalizedExpiration.isoValue
    );
    const proposal = {
      id: crypto.randomUUID(),
      title: saveLabel.trim() || getDefaultProposalTitle(selectedChain, request.initiator, opType, to),
      chain: selectedChain,
      initiator: request.initiator,
      threshold: coordinationThreshold,
      signers: request.signers,
      expiration: normalizedExpiration.isoValue,
      operationType: opType,
      operation: request.operation,
      authoritySnapshot: authority,
      unsignedTransaction,
      partialSignatures: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const proposals = [proposal, ...savedProposalsRef.current].slice(0, 20);
    await persistSavedProposals(proposals);
    setTransportInfo(`Saved proposal ${proposal.title}`);
    showNotification(`Saved multisig proposal ${proposal.title}`, "success");
    await publishMultiSigEvent({
      v: 1,
      namespace: "gravity.multisig",
      type: "proposal_created",
      proposalId: proposal.id,
      sentAt: Date.now(),
      sender: request.initiator,
      chain: proposal.chain,
      proposal: toTransportProposal(proposal)
    }, request.initiator);
    setSaveLabel("");
  };
  const handleLoadProposal = (proposal) => {
    const normalizedExpiration = normalizeMultiSigExpiration(proposal.expiration);
    setSelectedChain(proposal.chain);
    setOpType(proposal.operationType);
    setExpiresAt(normalizedExpiration.localValue);
    setRequest({
      initiator: proposal.initiator,
      signers: proposal.signers,
      threshold: getCoordinationThreshold(proposal.signers),
      operation: proposal.operation
    });
    try {
      const parsed = JSON.parse(proposal.operation);
      if (Array.isArray(parsed) && parsed.length === 2) {
        const [, payload] = parsed;
        setTo(payload.to || payload.delegatee || "");
        setMemo(payload.memo || "");
        setAmount(
          typeof payload.amount === "string" ? payload.amount.split(" ")[0] : typeof payload.vesting_shares === "string" ? payload.vesting_shares.split(" ")[0] : "0"
        );
      }
    } catch {
      setTo("");
      setMemo("");
      setAmount("");
    }
  };
  const handleReuseProposal = (proposal) => {
    setSaveLabel(`${proposal.title} copy`);
    setTransportInfo(null);
    setProposalBusyId(null);
    handleLoadProposal({
      ...proposal,
      lastBroadcastTxId: void 0,
      partialSignatures: [],
      updatedAt: Date.now(),
      expiration: null
    });
  };
  const handleDeleteProposal = async (proposal) => {
    const initiatorPublisher = getAnnouncementAccount(proposal.initiator, proposal.chain);
    if (!initiatorPublisher) {
      showNotification(t("multisig.delete_initiator_only") || "Only the initiator can delete this proposal from every device.", "info");
      return;
    }
    const proposals = savedProposalsRef.current.filter((entry) => entry.id !== proposal.id);
    const nextIncoming = incomingProposalsRef.current.filter((entry) => entry.proposal.id !== proposal.id);
    await persistSavedProposals(proposals);
    await persistIncomingProposals(nextIncoming);
    if (isMountedRef.current) {
      setTransportInfo(`Deleted ${proposal.title}`);
    }
    showNotification(`Deleted proposal ${proposal.title}`, "success");
    await enqueuePendingEvent({
      v: 1,
      namespace: "gravity.multisig",
      type: "proposal_deleted",
      proposalId: proposal.id,
      sentAt: Date.now(),
      sender: proposal.initiator,
      chain: proposal.chain
    }, proposal.initiator);
  };
  const getProposalSignerStates = (proposal) => {
    const normalizedSignerOrder = Array.from(new Set(
      (proposal.signers || []).map((name) => name.replace(/^@/, "").trim()).filter(Boolean)
    ));
    const signedNames = new Set((proposal.partialSignatures || []).map((entry) => entry.username));
    return normalizedSignerOrder.map((name) => {
      const localAccount = accounts.find((account) => account.chain === proposal.chain && account.name === name);
      const hasActiveKey = !!localAccount?.activeKey;
      return {
        name,
        account: localAccount || null,
        hasActiveKey,
        isSigned: signedNames.has(name),
        canSign: !!localAccount?.activeKey && !signedNames.has(name)
      };
    });
  };
  const handlePartialSignProposal = async (proposal, signer) => {
    if (!signer?.activeKey) return;
    if (isProposalExpired(proposal)) {
      showNotification(t("multisig.sign_expired_blocked") || "This proposal has expired. Reuse it to generate a fresh one.", "info");
      return;
    }
    if (isMountedRef.current) {
      setProposalBusyId(proposal.id);
    }
    try {
      const readyProposal = await ensureProposalArtifacts(proposal);
      const signResult = await signTransactionEnvelope(
        readyProposal.chain,
        readyProposal.unsignedTransaction,
        signer.activeKey,
        signer.name
      );
      if (!signResult.success || !signResult.signature || !signResult.publicKey) {
        throw new Error(signResult.error || "Partial sign failed");
      }
      const nextProposal = {
        ...readyProposal,
        updatedAt: Date.now(),
        partialSignatures: [
          ...readyProposal.partialSignatures.filter((entry) => entry.username !== signer.name),
          {
            username: signer.name,
            pubKey: signResult.publicKey,
            signature: signResult.signature,
            signedAt: Date.now()
          }
        ]
      };
      await persistSavedProposals(savedProposalsRef.current.map((entry) => entry.id === proposal.id ? nextProposal : entry));
      if (isMountedRef.current) {
        setTransportInfo(`Signed locally as @${signer.name}`);
      }
      showNotification(`Signed proposal as @${signer.name}`, "success");
      await publishMultiSigEvent({
        v: 1,
        namespace: "gravity.multisig",
        type: "proposal_signed",
        proposalId: nextProposal.id,
        sentAt: Date.now(),
        sender: signer.name,
        chain: nextProposal.chain,
        signature: nextProposal.partialSignatures[nextProposal.partialSignatures.length - 1]
      }, signer.name);
    } catch (error) {
      console.warn("Failed to partial-sign multisig proposal:", error);
    } finally {
      if (isMountedRef.current) {
        setProposalBusyId(null);
      }
    }
  };
  const handleBroadcastProposal = async (proposal) => {
    if (isProposalExpired(proposal)) {
      showNotification(t("multisig.broadcast_expired_blocked") || "This proposal has expired. Reuse it to generate a fresh one.", "info");
      return;
    }
    if (isMountedRef.current) {
      setProposalBusyId(proposal.id);
    }
    try {
      const readyProposal = await ensureProposalArtifacts(proposal);
      if (!readyProposal.authoritySnapshot || !readyProposal.unsignedTransaction) {
        throw new Error("Proposal is missing authority or transaction data");
      }
      const selectedSignatures = selectBroadcastSignatures(readyProposal.authoritySnapshot, readyProposal.partialSignatures);
      if (selectedSignatures.length === 0) {
        throw new Error("No valid signatures available for broadcast");
      }
      const signedTransaction = {
        ...readyProposal.unsignedTransaction,
        signatures: selectedSignatures.map((entry) => entry.signature)
      };
      const result = await broadcastSignedTransaction(readyProposal.chain, signedTransaction);
      if (!result.success) throw new Error(result.error || "Broadcast failed");
      const nextProposal = {
        ...readyProposal,
        updatedAt: Date.now(),
        lastBroadcastTxId: result.txId
      };
      await persistSavedProposals(savedProposalsRef.current.map((entry) => entry.id === proposal.id ? nextProposal : entry));
      if (isMountedRef.current) {
        setTransportInfo(`Broadcasted ${nextProposal.title} successfully`);
      }
      showNotification(`Broadcasted ${nextProposal.title} successfully`, "success");
      const publisher = proposal.partialSignatures.map((entry) => entry.username).find((username) => !!getAnnouncementAccount(username, nextProposal.chain)) || readyProposal.initiator;
      await enqueuePendingEvent({
        v: 1,
        namespace: "gravity.multisig",
        type: "proposal_broadcasted",
        proposalId: nextProposal.id,
        sentAt: Date.now(),
        sender: publisher,
        chain: nextProposal.chain,
        txId: result.txId || ""
      }, publisher);
    } catch (error) {
      console.warn("Failed to broadcast multisig proposal:", error);
      showNotification(error?.message || "Failed to broadcast multisig proposal", "error");
    } finally {
      if (isMountedRef.current) {
        setProposalBusyId(null);
      }
    }
  };
  const handleCopyProposalPackage = async (proposal) => {
    await navigator.clipboard.writeText(JSON.stringify(buildSharedPackage(proposal), null, 2));
  };
  const handleImportProposal = async () => {
    if (!importPayload.trim()) return;
    try {
      const parsed = JSON.parse(importPayload);
      const proposal = parsed.kind === MULTISIG_SYNC_KIND ? parsed.proposal : parsed;
      if (!proposal || !proposal.chain || !proposal.initiator || !proposal.operation) {
        throw new Error("Invalid proposal package");
      }
      const normalizedProposal = normalizeSavedProposal(proposal);
      if (!normalizedProposal) {
        throw new Error("Invalid proposal package");
      }
      const proposals = [
        ...mergeProposalIntoList(normalizedProposal, savedProposalsRef.current)
      ];
      await persistSavedProposals(proposals);
      setImportPayload("");
    } catch (error) {
      console.warn("Failed to import multisig proposal package:", error);
    }
  };
  const handleAcceptIncomingProposal = async (incoming) => {
    const mergedSaved = mergeProposalIntoList(incoming.proposal, savedProposalsRef.current);
    const nextIncoming = incomingProposalsRef.current.filter((entry) => entry.proposal.id !== incoming.proposal.id);
    await persistSavedProposals(mergedSaved);
    await persistIncomingProposals(nextIncoming);
    if (isMountedRef.current) {
      setTransportInfo(`Accepted update from @${incoming.sentBy}`);
    }
    showNotification(`Accepted multisig update from @${incoming.sentBy}`, "success");
  };
  const handleRejectIncomingProposal = async (proposalId) => {
    const nextIncoming = incomingProposalsRef.current.filter((entry) => entry.proposal.id !== proposalId);
    await persistIncomingProposals(nextIncoming);
  };
  const handleJumpToActiveProposal = () => {
    if (!activeProposal) return;
    const element = document.getElementById(`proposal-card-${activeProposal.id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const getExpirationPublisher = (proposal) => {
    const candidates = [
      proposal.initiator,
      ...proposal.signers,
      ...proposal.partialSignatures.map((entry) => entry.username)
    ].map((value) => value.replace(/^@/, "").trim()).filter(Boolean);
    return candidates.find((username) => !!getAnnouncementAccount(username, proposal.chain)) || null;
  };
  const expireProposalsIfNeeded = reactExports.useCallback(async () => {
    const now = Date.now();
    const expireEntry = (proposal) => !proposal.expiredAt && !proposal.lastBroadcastTxId && getProposalExpirationTime(proposal) !== null && getProposalExpirationTime(proposal) + MULTISIG_EXPIRATION_GRACE_MS <= now ? {
      ...proposal,
      expiredAt: getProposalExpirationTime(proposal) + MULTISIG_EXPIRATION_GRACE_MS,
      updatedAt: Math.max(proposal.updatedAt, getProposalExpirationTime(proposal) + MULTISIG_EXPIRATION_GRACE_MS)
    } : proposal;
    const nextSaved = savedProposalsRef.current.map(expireEntry);
    const nextIncoming = incomingProposalsRef.current.map((entry) => ({
      ...entry,
      proposal: expireEntry(entry.proposal)
    }));
    const newlyExpiredSaved = nextSaved.filter((proposal) => proposal.expiredAt && !savedProposalsRef.current.find((entry) => entry.id === proposal.id)?.expiredAt);
    const newlyExpiredIncoming = nextIncoming.map((entry) => entry.proposal).filter((proposal) => proposal.expiredAt && !incomingProposalsRef.current.find((entry) => entry.proposal.id === proposal.id)?.proposal.expiredAt);
    if (JSON.stringify(nextSaved) !== JSON.stringify(savedProposalsRef.current)) {
      await persistSavedProposals(nextSaved);
    }
    if (JSON.stringify(nextIncoming) !== JSON.stringify(incomingProposalsRef.current)) {
      await persistIncomingProposals(nextIncoming);
    }
    for (const proposal of [...newlyExpiredSaved, ...newlyExpiredIncoming]) {
      const publisher = getExpirationPublisher(proposal);
      if (!publisher) continue;
      await enqueuePendingEvent({
        v: 1,
        namespace: "gravity.multisig",
        type: "proposal_expired",
        proposalId: proposal.id,
        sentAt: Date.now(),
        sender: publisher,
        chain: proposal.chain,
        expiredAt: proposal.expiredAt || now
      }, publisher);
    }
  }, [accounts]);
  const syncOnChainProposals = reactExports.useCallback(async (options) => {
    const resetCursor = !!options?.resetCursor;
    const localAccountNames = accounts.filter((account) => account.chain === selectedChain).map((account) => account.name);
    const relatedRemoteNames = Array.from(new Set(
      [
        ...savedProposalsRef.current.filter((proposal) => proposal.chain === selectedChain).flatMap((proposal) => [proposal.initiator, ...proposal.signers || []]),
        ...incomingProposalsRef.current.filter((entry) => entry.proposal.chain === selectedChain).flatMap((entry) => [entry.proposal.initiator, ...entry.proposal.signers || []])
      ].map((name) => name.replace(/^@/, "").trim()).filter(Boolean)
    ));
    const watchedAccountNames = Array.from(/* @__PURE__ */ new Set([...localAccountNames, ...relatedRemoteNames]));
    const localUsernames = new Set(localAccountNames);
    if (watchedAccountNames.length === 0) return;
    try {
      const cursorKey = `${MULTISIG_HISTORY_CURSOR_PREFIX}${selectedChain}`;
      const rawCursor = resetCursor ? null : await storageService.getItem(cursorKey);
      const lastSeenAt = rawCursor ? Number(rawCursor) : 0;
      const rawEvents = await fetchCustomJsonEventsForAccounts(selectedChain, watchedAccountNames, MULTISIG_CUSTOM_JSON_ID);
      const events = Array.from(
        new Map(
          rawEvents.map((entry) => ({
            event: normalizeChainEvent(entry.json),
            sender: entry.account,
            timestamp: entry.timestamp,
            txId: entry.trxId
          })).filter((entry) => !!entry.event).filter(({ event }) => (event.sentAt || 0) > lastSeenAt).map((entry) => {
            const { event } = entry;
            const dedupeKey = event.type === "proposal_signed" ? `${event.proposalId}:${event.type}:${event.signature.username}:${event.signature.signature}` : event.type === "proposal_broadcasted" ? `${event.proposalId}:${event.type}:${event.txId}` : event.type === "proposal_expired" ? `${event.proposalId}:${event.type}` : `${event.proposalId}:${event.type}`;
            return [dedupeKey, entry];
          })
        ).values()
      ).sort((left, right) => (left.event.sentAt || 0) - (right.event.sentAt || 0));
      let nextSaved = savedProposalsRef.current;
      let nextIncoming = incomingProposalsRef.current;
      let savedChanged = false;
      let incomingChanged = false;
      const shouldNotify = lastSeenAt > 0;
      let maxSeenAt = lastSeenAt;
      for (const { event, sender } of events) {
        if (event.chain !== selectedChain) continue;
        maxSeenAt = Math.max(maxSeenAt, event.sentAt || 0);
        if (event.type === "proposal_created") {
          const normalizedProposal = normalizeSavedProposal(event.proposal);
          if (!normalizedProposal || !isLocalProposalRelevant(normalizedProposal, localUsernames)) continue;
          if (nextSaved.some((entry) => entry.id === normalizedProposal.id)) {
            nextSaved = mergeProposalIntoList({
              ...normalizedProposal,
              updatedAt: Math.max(normalizedProposal.updatedAt, event.sentAt)
            }, nextSaved);
            savedChanged = true;
            continue;
          }
          const incomingEntry = {
            proposal: {
              ...normalizedProposal,
              updatedAt: Math.max(normalizedProposal.updatedAt, event.sentAt)
            },
            sentAt: event.sentAt,
            sentBy: event.sender || sender
          };
          nextIncoming = mergeIncomingProposal(incomingEntry, nextIncoming);
          incomingChanged = true;
          if (shouldNotify) {
            setTransportInfo(`Incoming on-chain proposal pending review from @${incomingEntry.sentBy}`);
            showNotification(`On-chain multisig proposal pending review from @${incomingEntry.sentBy}`, "info");
          }
          continue;
        }
        if (event.type === "proposal_deleted") {
          const hadSaved = nextSaved.some((entry) => entry.id === event.proposalId);
          const hadIncoming = nextIncoming.some((entry) => entry.proposal.id === event.proposalId);
          if (hadSaved) {
            nextSaved = nextSaved.filter((entry) => entry.id !== event.proposalId);
            savedChanged = true;
          }
          if (hadIncoming) {
            nextIncoming = nextIncoming.filter((entry) => entry.proposal.id !== event.proposalId);
            incomingChanged = true;
          }
          continue;
        }
        const applyUpdate = (proposal) => {
          if (event.type === "proposal_signed") {
            return {
              ...proposal,
              updatedAt: Math.max(proposal.updatedAt, event.sentAt),
              partialSignatures: [
                ...proposal.partialSignatures.filter((entry) => entry.username !== event.signature.username),
                {
                  ...event.signature,
                  signedAt: event.sentAt
                }
              ]
            };
          }
          if (event.type === "proposal_expired") {
            const expirationTime = getProposalExpirationTime(proposal);
            const canExpireNow = expirationTime !== null && Date.now() >= expirationTime + MULTISIG_EXPIRATION_GRACE_MS;
            if (!canExpireNow) {
              return proposal;
            }
            return {
              ...proposal,
              updatedAt: Math.max(proposal.updatedAt, event.sentAt),
              expiredAt: Math.max(event.expiredAt, expirationTime + MULTISIG_EXPIRATION_GRACE_MS)
            };
          }
          return {
            ...proposal,
            updatedAt: Math.max(proposal.updatedAt, event.sentAt),
            lastBroadcastTxId: event.txId
          };
        };
        const savedMatch = nextSaved.find((entry) => entry.id === event.proposalId);
        if (savedMatch) {
          if (event.type === "proposal_expired") {
            const expirationTime = getProposalExpirationTime(savedMatch);
            const canExpireNow = expirationTime !== null && Date.now() >= expirationTime + MULTISIG_EXPIRATION_GRACE_MS;
            if (!canExpireNow) {
              continue;
            }
          }
          nextSaved = nextSaved.map((entry) => entry.id === event.proposalId ? applyUpdate(entry) : entry);
          savedChanged = true;
          if (shouldNotify && event.type === "proposal_signed") {
            showNotification(`@${event.signature.username} signed proposal ${savedMatch.title}`, "info");
          }
          if (shouldNotify && event.type === "proposal_broadcasted") {
            showNotification(`Proposal ${savedMatch.title} was broadcasted on-chain`, "success");
          }
          if (shouldNotify && event.type === "proposal_expired") {
            showNotification(`Proposal ${savedMatch.title} expired before broadcast`, "info");
          }
          continue;
        }
        const incomingMatch = nextIncoming.find((entry) => entry.proposal.id === event.proposalId);
        if (incomingMatch) {
          if (event.type === "proposal_expired") {
            const expirationTime = getProposalExpirationTime(incomingMatch.proposal);
            const canExpireNow = expirationTime !== null && Date.now() >= expirationTime + MULTISIG_EXPIRATION_GRACE_MS;
            if (!canExpireNow) {
              continue;
            }
          }
          nextIncoming = nextIncoming.map((entry) => entry.proposal.id === event.proposalId ? {
            ...entry,
            proposal: applyUpdate(entry.proposal),
            sentAt: event.sentAt,
            sentBy: event.sender || sender
          } : entry);
          incomingChanged = true;
        }
      }
      if (savedChanged) {
        await persistSavedProposals(nextSaved);
      }
      if (incomingChanged) {
        await persistIncomingProposals(nextIncoming);
      }
      if (maxSeenAt > lastSeenAt) {
        await storageService.setItem(cursorKey, String(maxSeenAt));
      }
      if (options?.announceRefresh) {
        setTransportInfo(
          maxSeenAt > lastSeenAt ? t("multisig.sync_refreshed") || "Synced from chain." : t("multisig.sync_no_updates") || "No new on-chain multisig updates found."
        );
      }
    } catch (error) {
      console.warn("Failed to sync on-chain multisig events:", error);
      if (options?.announceRefresh) {
        showNotification(t("multisig.sync_failed") || "Failed to refresh multisig updates from chain.", "error");
      }
    }
  }, [accounts, selectedChain, showNotification, t]);
  reactExports.useEffect(() => {
    let cancelled = false;
    const runSync = async () => {
      if (cancelled) return;
      await flushPendingEvents();
      if (cancelled) return;
      await syncOnChainProposals();
    };
    runSync();
    const interval = window.setInterval(runSync, MULTISIG_SYNC_POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [flushPendingEvents, syncOnChainProposals]);
  reactExports.useEffect(() => {
    expireProposalsIfNeeded();
    const interval = window.setInterval(() => {
      expireProposalsIfNeeded();
    }, 3e4);
    return () => window.clearInterval(interval);
  }, [expireProposalsIfNeeded]);
  const handleRefreshFromChain = async () => {
    if (isMountedRef.current) {
      setRefreshingChain(true);
    }
    try {
      await flushPendingEvents();
      await syncOnChainProposals({ resetCursor: true, announceRefresh: true });
    } finally {
      if (isMountedRef.current) {
        setRefreshingChain(false);
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-y-auto custom-scrollbar p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-dark-700 rounded-2xl p-5 shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg sm:text-xl font-black text-white tracking-tight leading-tight text-balance", children: t("multisig.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-2 max-w-md", children: t("multisig.header_desc") || "Build a multisig proposal draft and inspect the live account authority before coordinating signatures." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20", children: t("multisig.alpha_badge") || "Alpha" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: MULTISIG_SUPPORTED_CHAINS.map((chainOption) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => handleSelectChain(chainOption),
          className: `px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.18em] font-black border transition-colors ${selectedChain === chainOption ? "bg-blue-500/15 text-blue-300 border-blue-500/30" : "bg-dark-900 text-slate-400 border-dark-600 hover:text-white hover:border-dark-500"}`,
          children: chainOption
        },
        chainOption
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[10px] text-slate-500", children: (t("multisig.supported_chains") || "MultiSig sync is currently implemented for {chains}.").replace("{chains}", MULTISIG_SUPPORTED_CHAINS.join(" / ")) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-dark-700 rounded-2xl p-5 shadow-xl space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 uppercase font-bold", children: t("multisig.incoming_title") || "Incoming proposals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: t("multisig.incoming_desc") || "Review on-chain proposal updates before they enter your local multisig tray." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: incomingProposals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 italic", children: t("multisig.incoming_empty") || "No pending incoming multisig proposals." }) : incomingProposals.map((incoming) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-white truncate", children: incoming.proposal.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-400 mt-1 break-words", children: [
            (t("multisig.incoming_from") || "From @{user}").replace("{user}", incoming.sentBy),
            " • ",
            incoming.proposal.chain,
            " • @",
            incoming.proposal.initiator
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 mt-1", children: new Date(incoming.sentAt).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-[10px] text-slate-300", children: [
            t("multisig.coordination_target") || "Coordination target",
            ": ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white", children: getCoordinationThreshold(incoming.proposal.signers) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => handleAcceptIncomingProposal(incoming),
              className: "min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-[10px] font-black uppercase tracking-[0.1em] text-slate-200 hover:border-green-500 hover:text-white transition-colors",
              children: t("multisig.accept") || "Accept"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => handleRejectIncomingProposal(incoming.proposal.id),
              className: "min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-[10px] font-black uppercase tracking-[0.1em] text-slate-300 hover:border-red-500 hover:text-red-300 transition-colors",
              children: t("multisig.reject") || "Reject"
            }
          )
        ] })
      ] }) }, `incoming:${incoming.proposal.id}`)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-dark-700 rounded-2xl p-5 shadow-xl space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs text-slate-500 uppercase font-bold", children: [
            t("multisig.initiator"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: request.initiator,
              onChange: (e) => setRequest((prev) => ({ ...prev, initiator: e.target.value })),
              className: "w-full mt-2 bg-dark-900 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500",
              children: [
                chainAccounts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: (t("multisig.no_accounts") || "No {chain} accounts imported").replace("{chain}", selectedChain) }),
                chainAccounts.map((account) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: account.name, children: [
                  "@",
                  account.name
                ] }, `${account.chain}:${account.name}`))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `grid gap-3 ${looksLikeMultisig ? "grid-cols-2" : "grid-cols-1"}`, children: [
          looksLikeMultisig && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold", children: t("multisig.threshold") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full mt-2 bg-dark-900 border border-dark-600 rounded-xl p-3 text-sm text-white", children: authority?.threshold || getCoordinationThreshold(request.signers) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[10px] text-slate-500", children: t("multisig.threshold_hint_onchain") || "Visible only because this account already exposes a multisig authority on-chain." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold", children: t("multisig.expiration") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "datetime-local",
                value: expiresAt,
                onChange: (e) => setExpiresAt(e.target.value),
                className: "w-full mt-2 bg-dark-900 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[10px] text-slate-500", children: (t("multisig.expiration_hint_practical") || "This is the expiration of the signed transaction itself. If it expires before the final broadcast, signatures must be collected again.").replace("{minutes}", String(DIRECT_MULTISIG_EXPIRATION_MINUTES)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-dark-700 rounded-2xl p-5 shadow-xl space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs text-slate-500 uppercase font-bold", children: [
            t("multisig.signers"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_auto] gap-2 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: newSigner,
                onChange: (e) => setNewSigner(e.target.value),
                placeholder: t("multisig.username_placeholder") || "username",
                className: "min-w-0 bg-dark-900 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => addSigner(),
                className: "px-3 sm:px-4 min-w-[64px] rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-black transition-colors",
                children: t("multisig.add") || "Add"
              }
            )
          ] }),
          availableSigners.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: availableSigners.map((signer) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => addSigner(signer),
              className: "px-3 py-1.5 rounded-full bg-dark-900 border border-dark-700 text-xs text-slate-300 hover:border-blue-500 hover:text-white transition-colors",
              children: [
                "@",
                signer
              ]
            },
            signer
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 min-h-[2.5rem]", children: request.signers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 italic", children: t("multisig.signers_empty") || "No proposal signers selected yet." }) : request.signers.map((signer) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 px-3 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs", children: [
          "@",
          signer,
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeSigner(signer), className: "text-blue-200 hover:text-white transition-colors", children: "×" })
        ] }, signer)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dark-700 bg-dark-900/60 p-4 space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 uppercase font-bold", children: t("multisig.create_section") || "Create proposal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: t("multisig.create_desc") || "Build the proposal here, then save it to start collecting signatures." })
          ] }),
          activeProposal && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleJumpToActiveProposal,
              className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-dark-900 border border-dark-600 text-[10px] font-black uppercase tracking-[0.08em] text-slate-200 hover:border-blue-500 hover:text-white transition-colors shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(IconJump, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("multisig.jump_active") || "Go to active proposal" })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold", children: t("multisig.proposal") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: opType,
              onChange: (e) => setOpType(e.target.value),
              className: "w-full mt-2 bg-dark-900 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500",
              children: MULTISIG_VISIBLE_OPERATION_TYPES.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option.value, children: t(option.labelKey) || option.fallback }, option.value))
            }
          )
        ] }),
        opType !== "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-2xl border border-dark-700 bg-dark-900/60 p-4", children: [
          opType !== "withdraw_vesting" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs text-slate-400 block mb-1", children: [
              t("multisig.target_account") || "Target account",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: to,
                onChange: (e) => setTo(e.target.value),
                placeholder: opType === "transfer_to_vesting" ? (t("multisig.target_default") || "Default: @{user}").replace("{user}", request.initiator) : t("multisig.username_placeholder") || "username",
                className: "w-full bg-dark-800 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
              }
            )
          ] }),
          opType !== "undelegate_vesting_shares" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs text-slate-400 block mb-1", children: [
              opType === "delegate_vesting_shares" || opType === "withdraw_vesting" ? t("multisig.amount_vests") || "Amount (VESTS)" : (t("multisig.amount_chain") || "Amount ({chain})").replace("{chain}", selectedChain),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: amount,
                onChange: (e) => setAmount(e.target.value),
                placeholder: "0.000",
                className: "w-full bg-dark-800 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
              }
            )
          ] }),
          opType === "undelegate_vesting_shares" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dark-700 bg-dark-800 px-3 py-3 text-xs text-slate-400", children: t("multisig.undelegate_hint") || "This proposal will undelegate the full power delegation from the selected account by setting the delegation amount to zero." }),
          opType === "transfer" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-400 block mb-1", children: t("multisig.memo") || "Memo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: memo,
                onChange: (e) => setMemo(e.target.value),
                placeholder: t("multisig.memo_placeholder") || "Optional note",
                className: "w-full bg-dark-800 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dark-700 bg-dark-900/60 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowOperationPreview((prev) => !prev),
              className: "w-full flex items-center justify-between gap-3 text-left",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold cursor-pointer", children: t("multisig.operation_preview") || "Operation preview" }),
                    opType !== "custom" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-blue-400", children: t("multisig.generated") || "Generated" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: showOperationPreview ? t("multisig.preview_expanded") || "Raw operation payload visible for review." : t("multisig.preview_collapsed") || "Collapsed by default to keep the form clean." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconChevron, { open: showOperationPreview }) })
              ]
            }
          ),
          showOperationPreview && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              className: `w-full mt-3 bg-dark-950 border border-dark-600 rounded-2xl p-3 text-[11px] font-mono h-32 outline-none focus:border-blue-500 ${opType !== "custom" ? "text-slate-400" : "text-white"}`,
              value: request.operation,
              onChange: (e) => opType === "custom" && setRequest((prev) => ({ ...prev, operation: e.target.value })),
              readOnly: opType !== "custom"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dark-700 bg-dark-900/60 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowProposalDraft((prev) => !prev),
              className: "w-full flex items-center justify-between gap-3 text-left",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 uppercase font-bold", children: t("multisig.proposal_draft") || "Proposal draft" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: showProposalDraft ? t("multisig.draft_expanded") || "Raw draft JSON visible for manual review and export." : t("multisig.draft_collapsed") || "Collapsed by default to keep attention on active proposals." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconChevron, { open: showProposalDraft }) })
              ]
            }
          ),
          showProposalDraft && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleCopyDraft,
                className: "px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-[0.18em] transition-colors shrink-0",
                children: copied ? t("multisig.copied") || "Copied" : t("multisig.copy") || "Copy"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-3 text-[10px] text-slate-300 whitespace-pre-wrap break-all bg-black/30 rounded-xl p-3 border border-dark-700 max-h-48 overflow-y-auto custom-scrollbar", children: proposalDraft })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dark-700 bg-dark-900/60 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 items-stretch", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: saveLabel,
                onChange: (e) => setSaveLabel(e.target.value),
                placeholder: t("multisig.proposal_label") || "Proposal label",
                className: "min-w-0 flex-1 bg-dark-800 border border-dark-600 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleSaveProposal,
                disabled: !saveValidation.isValid,
                title: t("multisig.save") || "Save",
                "aria-label": t("multisig.save") || "Save",
                className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 min-w-[52px] shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-dark-700 disabled:text-slate-500 text-white text-sm font-black transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IconSave, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: t("multisig.save") || "Save" })
                ]
              }
            )
          ] }),
          !saveValidation.isValid && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[10px] text-slate-500", children: t("multisig.validation_hint") || "Complete the required fields marked with * before saving." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dark-700 bg-dark-900/60 p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 uppercase font-bold", children: t("multisig.saved_title") || "Saved proposals" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: t("multisig.saved_desc") || "Keep local drafts here while the wallet syncs signer updates from on-chain multisig events." }),
              transportInfo && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-blue-400 mt-2 break-words", children: transportInfo })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleRefreshFromChain,
                disabled: refreshingChain,
                className: "w-full sm:w-auto px-3 py-2 rounded-xl bg-dark-900 border border-dark-600 text-[10px] font-black uppercase tracking-[0.08em] text-slate-200 hover:border-blue-500 hover:text-white transition-colors disabled:text-slate-600 disabled:border-dark-700 shrink-0",
                children: refreshingChain ? t("multisig.refreshing_chain") || "Refreshing..." : t("multisig.refresh_chain") || "Refresh from chain"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: savedProposals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 italic", children: t("multisig.saved_empty") || "No saved multisig proposals yet." }) : savedProposals.map((proposal) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: `proposal-card-${proposal.id}`, className: "rounded-xl border border-dark-700 bg-dark-800 px-3 py-3", children: (() => {
            const partialSignatures = Array.isArray(proposal.partialSignatures) ? proposal.partialSignatures : [];
            const onChainProgress = proposal.authoritySnapshot ? calculateThresholdProgress(proposal.authoritySnapshot, partialSignatures) : null;
            const coordinationProgress = calculateCoordinationProgress(proposal, partialSignatures);
            const status = getProposalStatus(proposal, coordinationProgress, onChainProgress, t);
            const timeline = buildProposalTimeline(proposal, t);
            const signerStates = getProposalSignerStates(proposal);
            const isBroadcasted = !!proposal.lastBroadcastTxId;
            const isExpired = isProposalExpired(proposal);
            const isBroadcastedExpanded = !!expandedBroadcasted[proposal.id];
            const canDeleteProposal = !!getAnnouncementAccount(proposal.initiator, proposal.chain);
            return isBroadcasted && !isBroadcastedExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setExpandedBroadcasted((prev) => ({ ...prev, [proposal.id]: true })),
                className: "w-full flex items-start justify-between gap-3 text-left",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start gap-2 sm:flex-row sm:items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-white break-words leading-tight", children: proposal.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.08em] ${status.tone}`, children: status.label })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-400 mt-1 break-words", children: [
                      proposal.chain,
                      " • @",
                      proposal.initiator
                    ] }),
                    proposal.signers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] text-slate-300 break-words", children: [
                      t("multisig.required_signers") || "Required signers",
                      ": ",
                      proposal.signers.map((name) => `@${name.replace(/^@/, "")}`).join(", ")
                    ] }),
                    partialSignatures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] text-blue-400 break-words", children: [
                      t("multisig.signed_by") || "Signed by",
                      " ",
                      partialSignatures.map((entry) => `@${entry.username}`).join(", ")
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 mt-1", children: new Date(proposal.updatedAt || proposal.createdAt).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconChevron, { open: false }) })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-white break-words leading-tight", children: proposal.title }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.08em] ${status.tone}`, children: status.label })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-400 mt-1 break-words", children: [
                  proposal.chain,
                  " • @",
                  proposal.initiator
                ] }),
                partialSignatures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] text-blue-400 break-words", children: [
                  t("multisig.signed_by") || "Signed by",
                  " ",
                  partialSignatures.map((entry) => `@${entry.username}`).join(", ")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 mt-2 break-words", children: new Date(proposal.createdAt).toLocaleString() }),
                isBroadcasted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setExpandedBroadcasted((prev) => ({ ...prev, [proposal.id]: false })),
                    title: t("multisig.hide_broadcasted_details") || "Hide",
                    "aria-label": t("multisig.hide_broadcasted_details") || "Hide",
                    className: "inline-flex items-center justify-center p-1.5 rounded-lg bg-dark-900 border border-dark-600 text-slate-300 hover:border-blue-500 hover:text-white transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconChevron, { open: true })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-[10px] text-slate-300", children: [
                  t("multisig.coordination") || "Coordination",
                  ": ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white", children: coordinationProgress.current }),
                  " / ",
                  coordinationProgress.threshold
                ] }),
                onChainProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-[10px] text-slate-400", children: [
                  t("multisig.on_chain") || "On-chain",
                  ": ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white", children: onChainProgress.currentWeight }),
                  " / ",
                  onChainProgress.threshold
                ] }),
                onChainProgress && proposal.threshold !== onChainProgress.threshold && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] text-amber-400 break-words", children: t("multisig.threshold_mismatch") || "Draft coordination threshold differs from current on-chain authority threshold." }),
                partialSignatures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] text-blue-400 break-words", children: [
                  t("multisig.signed_by") || "Signed by",
                  " ",
                  partialSignatures.map((entry) => `@${entry.username}`).join(", ")
                ] }),
                isExpired && !proposal.lastBroadcastTxId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] text-red-400 break-words", children: [
                  t("multisig.expired_at") || "Expired at",
                  ": ",
                  proposal.expiredAt ? new Date(proposal.expiredAt).toLocaleString() : proposal.expiration || "—"
                ] }),
                proposal.lastBroadcastTxId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] text-green-400 break-all", children: [
                  t("multisig.broadcasted_tx") || "Broadcasted",
                  ": ",
                  proposal.lastBroadcastTxId
                ] })
              ] }),
              (!isBroadcasted || isBroadcastedExpanded) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dark-700 bg-dark-900/70 px-3 py-3 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.12em] text-slate-400", children: t("multisig.timeline_title") || "Proposal history" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: timeline.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 italic", children: t("multisig.timeline_empty") || "No history yet." }) : timeline.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 text-[10px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: entry.tone === "success" ? "text-green-400" : entry.tone === "info" ? "text-blue-400" : "text-slate-300", children: entry.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 shrink-0", children: entry.at ? new Date(entry.at).toLocaleString() : "—" })
                ] }, entry.id)) })
              ] }),
              proposal.lastBroadcastTxId || isExpired ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleReuseProposal(proposal),
                  className: "w-full min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-[10px] font-black uppercase tracking-[0.12em] text-slate-200 hover:border-blue-500 hover:text-white transition-colors",
                  children: t("multisig.reuse") || "Reuse"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `grid gap-2 ${canDeleteProposal ? "grid-cols-3" : "grid-cols-2"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleLoadProposal(proposal),
                      title: t("multisig.load") || "Load",
                      "aria-label": t("multisig.load") || "Load",
                      className: "min-w-0 inline-flex items-center justify-center px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-slate-300 hover:border-blue-500 hover:text-white transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconLoad, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleCopyProposalPackage(proposal),
                      title: t("multisig.copy") || "Copy",
                      "aria-label": t("multisig.copy") || "Copy",
                      className: "min-w-0 inline-flex items-center justify-center px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-slate-300 hover:border-purple-500 hover:text-white transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconCopy, {})
                    }
                  ),
                  canDeleteProposal && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleDeleteProposal(proposal),
                      title: t("multisig.delete") || "Delete",
                      "aria-label": t("multisig.delete") || "Delete",
                      className: "min-w-0 inline-flex items-center justify-center px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-slate-300 hover:border-red-500 hover:text-red-300 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconTrash, {})
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: signerStates.length > 0 ? signerStates.map((signer) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => signer.account && handlePartialSignProposal(proposal, signer.account),
                      disabled: proposalBusyId === proposal.id || !signer.canSign || isExpired,
                      className: "min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-[9px] leading-tight font-black uppercase tracking-[0.08em] text-slate-300 hover:border-purple-500 hover:text-white transition-colors disabled:text-slate-600 disabled:border-dark-700",
                      children: proposalBusyId === proposal.id && signer.canSign ? "..." : signer.isSigned ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block break-words normal-case tracking-normal font-bold", children: [
                        t("multisig.signed") || "Signed",
                        " @",
                        signer.name
                      ] }) : signer.hasActiveKey ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block break-words normal-case tracking-normal font-bold", children: [
                        t("multisig.sign") || "Sign",
                        " @",
                        signer.name
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block break-words normal-case tracking-normal font-bold", children: [
                        t("multisig.signer_unavailable") || "Unavailable",
                        " @",
                        signer.name
                      ] })
                    },
                    `${proposal.id}:${proposal.chain}:${signer.name}`
                  )) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-700 text-[10px] text-slate-500 text-center", children: t("multisig.no_local_signer") || "No local signer" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleBroadcastProposal(proposal),
                      disabled: !coordinationProgress.canBroadcast || !onChainProgress?.canBroadcast || proposalBusyId === proposal.id || !!proposal.lastBroadcastTxId || isExpired,
                      className: "w-full min-w-0 px-2 py-2 rounded-lg bg-dark-900 border border-dark-600 text-[9px] leading-tight font-black uppercase tracking-[0.08em] text-slate-300 hover:border-green-500 hover:text-white transition-colors disabled:text-slate-600 disabled:border-dark-700",
                      children: t("multisig.broadcast") || "Broadcast"
                    }
                  )
                ] })
              ] })
            ] });
          })() }, proposal.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-dark-700/80 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400", children: t("multisig.import_desc") || "Paste a shared proposal package here to import it into this device." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: importPayload,
                onChange: (e) => setImportPayload(e.target.value),
                placeholder: '{"kind":"gravity-multisig-proposal", ...}',
                className: "w-full bg-dark-950 border border-dark-600 rounded-2xl p-3 text-[11px] font-mono h-24 outline-none focus:border-blue-500 text-slate-300"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleImportProposal,
                disabled: !importPayload.trim(),
                className: "px-4 py-2 rounded-xl bg-dark-900 border border-dark-600 disabled:text-slate-600 disabled:border-dark-700 text-slate-200 text-xs font-black uppercase tracking-[0.14em] hover:border-blue-500 hover:text-white transition-colors",
                children: t("multisig.import_package") || "Import package"
              }
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-800 border border-dark-700 rounded-2xl p-5 shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dark-700 bg-dark-900/60 p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 uppercase font-bold", children: t("multisig.authorities_title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: t("multisig.authority_reference_hint") || "This is a reference view of the live on-chain authority for the initiator account. It does not change the coordination quorum of this draft." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 mt-2", children: authorityLoading ? t("multisig.authority_loading") || "Inspecting live active authority..." : looksLikeMultisig ? (t("multisig.authority_ready_desc") || "On-chain threshold {threshold}. Account auths and keys below are the real source of truth.").replace("{threshold}", String(authority?.threshold || 0)) : t("multisig.authority_single_desc") || "This account signs normally on-chain with a single active authority. Your practical multisig coordination still happens above at the draft level." })
          ] }),
          authority && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] ${looksLikeMultisig ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`, children: looksLikeMultisig ? t("multisig.authority_ready_badge") || "Ready" : t("multisig.authority_single_badge") || "Single Signer" })
        ] }),
        authorityError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl p-3", children: authorityError }),
        authority && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-300", children: [
            t("multisig.threshold_label") || "Threshold",
            ": ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-white", children: authority.threshold })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            activeAuthorityAccounts.length > 0 ? activeAuthorityAccounts.map(([name, weight]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-200", children: [
                "@",
                name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-blue-400 font-black", children: [
                "+",
                weight
              ] })
            ] }, `acc:${name}`)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 italic", children: t("multisig.authority_no_accounts") || "No account-based signers defined on-chain." }),
            activeAuthorityKeys.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1 space-y-2", children: activeAuthorityKeys.map(([key, weight]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-[11px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400 font-mono truncate", children: [
                key.slice(0, 10),
                "...",
                key.slice(-8)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-purple-400 font-black", children: [
                "+",
                weight
              ] })
            ] }, `key:${key}`)) })
          ] })
        ] })
      ] }) })
    ] })
  ] }) });
};

const validateUsername = (username) => {
  if (!username) return "Username is required";
  const trimmed = username.trim().toLowerCase();
  const usernameRegex = /^[a-z][a-z0-9\-.]{2,15}$/;
  if (!usernameRegex.test(trimmed)) {
    return "Invalid username format (3-16 chars, lowercase)";
  }
  return null;
};
const validatePrivateKey = (key) => {
  if (!key) return null;
  const trimmed = key.trim();
  const wifRegex = /^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/;
  if (!wifRegex.test(trimmed)) {
    return "Invalid Private Key format";
  }
  return null;
};
const verifyKeyAgainstChain = async (chain, username, privateKey, type) => {
  try {
    if (!privateKey) return true;
    const accountData = await fetchAccountData(chain, username);
    if (!accountData) return false;
    let derivedPub;
    if (chain === Chain.HIVE || chain === Chain.BLURT) {
      derivedPub = indexBrowserExports.PrivateKey.fromString(privateKey).createPublic().toString();
    } else {
      derivedPub = indexBrowserExports$1.PrivateKey.fromString(privateKey).createPublic().toString();
    }
    const validPrefixes = ["STM", "BLT", "TST", "GLS"];
    const pubKeyBody = derivedPub.slice(3);
    const possibleKeys = validPrefixes.map((prefix) => prefix + pubKeyBody);
    possibleKeys.push(derivedPub);
    if (type === "memo") {
      return possibleKeys.includes(accountData.memo_key);
    } else {
      const auths = type === "active" ? accountData.active.key_auths : accountData.posting.key_auths;
      return auths.some((auth) => possibleKeys.includes(auth[0]));
    }
  } catch (e) {
    console.error("Key Verification Error:", e);
    return false;
  }
};

const ImportModal = ({ onClose, onImport, initialChain }) => {
  const { t } = useTranslation();
  const [method, setMethod] = reactExports.useState("manual");
  const [selectedChain, setSelectedChain] = reactExports.useState(initialChain || Chain.HIVE);
  const [username, setUsername] = reactExports.useState("");
  const [postingKey, setPostingKey] = reactExports.useState("");
  const [activeKey, setActiveKey] = reactExports.useState("");
  const [memoKey, setMemoKey] = reactExports.useState("");
  const [isVerifying, setIsVerifying] = reactExports.useState(false);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [chainData, setChainData] = reactExports.useState(null);
  const [usernameError, setUsernameError] = reactExports.useState(null);
  const [generalError, setGeneralError] = reactExports.useState(null);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      if (username.length > 2) {
        verifyUsername();
      } else {
        setChainData(null);
        setUsernameError(null);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [username, selectedChain]);
  const verifyUsername = async () => {
    const formatError = validateUsername(username);
    if (formatError) {
      setUsernameError(formatError);
      setChainData(null);
      return;
    }
    setIsVerifying(true);
    setUsernameError(null);
    const data = await fetchAccountData(selectedChain, username.trim().toLowerCase());
    setIsVerifying(false);
    if (data) {
      setChainData(data);
    } else {
      setChainData(null);
      setUsernameError(t("import.not_found").replace("{chain}", selectedChain));
    }
  };
  const processManualImport = async () => {
    setGeneralError(null);
    if (usernameError || !chainData) {
      setGeneralError(t("import.error_username"));
      return;
    }
    const postingErr = validatePrivateKey(postingKey);
    const activeErr = validatePrivateKey(activeKey);
    const memoErr = validatePrivateKey(memoKey);
    if (postingErr || activeErr || memoErr) {
      setGeneralError(t("import.error_format"));
      return;
    }
    if (!postingKey && !activeKey && !memoKey) {
      setGeneralError(t("import.error_missing_key"));
      return;
    }
    setIsSaving(true);
    if (postingKey) {
      const isValid = await verifyKeyAgainstChain(selectedChain, username, postingKey, "posting");
      if (!isValid) {
        setGeneralError(t("import.match_error_posting"));
        setIsSaving(false);
        return;
      }
    }
    if (activeKey) {
      const isValid = await verifyKeyAgainstChain(selectedChain, username, activeKey, "active");
      if (!isValid) {
        setGeneralError(t("import.match_error_active"));
        setIsSaving(false);
        return;
      }
    }
    if (memoKey) {
      const isValid = await verifyKeyAgainstChain(selectedChain, username, memoKey, "memo");
      if (!isValid) {
        setGeneralError(t("import.match_error_memo"));
        setIsSaving(false);
        return;
      }
    }
    const newAccount = {
      name: chainData.name,
      chain: selectedChain,
      publicKey: "IMPORTED",
      // Placeholder
      postingKey: postingKey.trim() || void 0,
      activeKey: activeKey.trim() || void 0,
      memoKey: memoKey.trim() || void 0
    };
    onImport([newAccount]);
    setIsSaving(false);
  };
  const processFileContent = (text) => {
    try {
      let newAccounts = [];
      if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
        const json = JSON.parse(text);
        const list = Array.isArray(json) ? json : json.list || json.accounts || [json];
        newAccounts = list.map((item) => ({
          name: item.name || item.username || item.account,
          chain: selectedChain,
          publicKey: "IMPORTED",
          postingKey: item.postingKey || item.posting || item.privatePostingKey,
          activeKey: item.activeKey || item.active || item.privateActiveKey,
          memoKey: item.memoKey || item.memo || item.privateMemoKey
        })).filter((a) => a.name && (a.postingKey || a.activeKey));
      } else {
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        newAccounts = lines.map((line) => {
          const parts = line.replace(/"/g, "").split(/[,;\t]/).map((s) => s.trim());
          if (parts.length < 2) return null;
          return {
            name: parts[0],
            chain: selectedChain,
            publicKey: "IMPORTED",
            postingKey: parts[1],
            activeKey: parts[2],
            memoKey: parts[3]
          };
        }).filter(Boolean);
      }
      if (newAccounts.length > 0) {
        onImport(newAccounts);
        onClose();
      } else {
        setGeneralError(t("import.no_valid_accounts"));
      }
    } catch (err) {
      setGeneralError(t("import.error_file_read"));
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => processFileContent(ev.target?.result);
      reader.readAsText(file);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto my-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: t("import.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-white", children: "✕" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mb-5 text-sm border-b border-dark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `pb-2 border-b-2 px-2 transition-colors ${method === "manual" ? "border-blue-500 text-white font-medium" : "border-transparent text-slate-500"}`, onClick: () => setMethod("manual"), children: t("import.manual") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `pb-2 border-b-2 px-2 transition-colors ${method === "file" ? "border-blue-500 text-white font-medium" : "border-transparent text-slate-500"}`, onClick: () => setMethod("file"), children: t("import.file") })
    ] }),
    method === "manual" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 overflow-y-auto custom-scrollbar pr-1 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-400 uppercase font-bold mb-2 block", children: t("import.select_chain") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [Chain.HIVE, Chain.STEEM, Chain.BLURT].map((chain) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                setSelectedChain(chain);
                setChainData(null);
              },
              className: `py-2 rounded-lg text-xs font-bold transition-all border ${selectedChain === chain ? chain === Chain.HIVE ? "bg-hive border-hive text-white" : chain === Chain.STEEM ? "bg-steem border-steem text-white" : "bg-blurt border-blurt text-white" : "bg-dark-900 border-dark-700 text-slate-400 hover:bg-dark-700"}`,
              children: chain
            },
            chain
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-400 uppercase font-bold mb-1 block", children: t("import.username") }),
            isVerifying && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-blue-400 animate-pulse", children: t("import.checking") }),
            chainData && !isVerifying && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-green-400 font-bold", children: t("import.found") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-2.5 text-slate-500", children: "@" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: username,
                onChange: (e) => setUsername(e.target.value.toLowerCase().replace(/[@\s\u200B-\u200D\uFEFF]/g, "")),
                className: `w-full bg-dark-900 border ${usernameError ? "border-red-500" : chainData ? "border-green-500" : "border-dark-600"} rounded-lg py-2 pl-7 pr-3 text-sm text-white focus:outline-none`,
                placeholder: t("import.placeholder_username"),
                disabled: isSaving
              }
            )
          ] }),
          usernameError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-red-400 mt-1", children: usernameError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-500 uppercase font-bold tracking-wider border-b border-dark-700 pb-1", children: t("import.private_keys") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] text-blue-400 mb-1 block flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("import.key_posting") }),
              validatePrivateKey(postingKey) && postingKey.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: t("import.invalid_format") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "password",
                value: postingKey,
                onChange: (e) => {
                  setPostingKey(e.target.value);
                  setGeneralError(null);
                },
                className: "w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none",
                placeholder: t("import.placeholder_key"),
                disabled: isSaving
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] text-green-400 mb-1 block flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("import.key_active") }),
              validatePrivateKey(activeKey) && activeKey.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: t("import.invalid_format") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "password",
                value: activeKey,
                onChange: (e) => {
                  setActiveKey(e.target.value);
                  setGeneralError(null);
                },
                className: "w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none",
                placeholder: t("import.placeholder_key"),
                disabled: isSaving
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] text-slate-400 mb-1 block flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("import.key_memo") }),
              validatePrivateKey(memoKey) && memoKey.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: t("import.invalid_format") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "password",
                value: memoKey,
                onChange: (e) => {
                  setMemoKey(e.target.value);
                  setGeneralError(null);
                },
                className: "w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none",
                placeholder: t("import.placeholder_key"),
                disabled: isSaving
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-4 border-t border-dark-700", children: [
        generalError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-900/20 border border-red-500/50 p-2 rounded text-xs text-red-200 text-center mb-2", children: generalError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: processManualImport,
            disabled: !chainData || !!usernameError || isSaving,
            className: `w-full py-3 rounded-lg font-bold transition-all shadow-lg ${!chainData || !!usernameError || isSaving ? "bg-dark-700 text-slate-500 cursor-not-allowed" : selectedChain === Chain.HIVE ? "bg-hive hover:bg-red-700 text-white" : selectedChain === Chain.STEEM ? "bg-steem hover:bg-blue-800 text-white" : "bg-blurt hover:bg-orange-700 text-white"}`,
            children: isSaving ? t("import.verifying") : t("import.save")
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center mb-4 transition-colors relative group ${isDragging ? "bg-blue-900/20 border-blue-500" : "bg-dark-900/50 border-dark-600 hover:bg-dark-800"}`,
        onDragOver: (e) => {
          e.preventDefault();
          setIsDragging(true);
        },
        onDragLeave: () => setIsDragging(false),
        onDrop: handleDrop,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: `w-12 h-12 mb-3 transition-opacity ${isDragging ? "text-blue-400 scale-110" : "text-blue-500 opacity-50 group-hover:opacity-100"}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 font-bold pointer-events-none", children: t("import.drag_drop") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1 pointer-events-none", children: t("import.click_upload") }),
          generalError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 mt-2 absolute bottom-4 w-full text-center px-4", children: generalError }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: ".json,.csv,.txt",
              className: "absolute inset-0 opacity-0 cursor-pointer",
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => processFileContent(ev.target?.result);
                  reader.readAsText(file);
                }
              }
            }
          )
        ]
      }
    )
  ] }) });
};

const ManageAccountModal = ({ account, onClose, onSave, onDelete }) => {
  const { t } = useTranslation();
  const [postingKey, setPostingKey] = reactExports.useState(account.postingKey || "");
  const [activeKey, setActiveKey] = reactExports.useState(account.activeKey || "");
  const [memoKey, setMemoKey] = reactExports.useState(account.memoKey || "");
  const [showConfirmDelete, setShowConfirmDelete] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [isValidating, setIsValidating] = reactExports.useState(false);
  const handleSave = async () => {
    setError(null);
    const pErr = validatePrivateKey(postingKey);
    const aErr = validatePrivateKey(activeKey);
    const mErr = validatePrivateKey(memoKey);
    if (pErr && postingKey) return setError(t("manage.invalid_posting"));
    if (aErr && activeKey) return setError(t("manage.invalid_active"));
    if (mErr && memoKey) return setError(t("manage.invalid_memo"));
    setIsValidating(true);
    const chainResult = await validateAccountKeys(account.chain, account.name, {
      active: activeKey || void 0,
      posting: postingKey || void 0,
      memo: memoKey || void 0
    });
    setIsValidating(false);
    if (!chainResult.valid) {
      setError(t("manage.verify_fail") + chainResult.error);
      return;
    }
    onSave({
      ...account,
      postingKey: postingKey.trim() || void 0,
      activeKey: activeKey.trim() || void 0,
      memoKey: memoKey.trim() || void 0
    });
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto my-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: t("manage.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
          "@",
          account.name,
          " • ",
          account.chain
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-white", children: "✕" })
    ] }),
    !showConfirmDelete ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-blue-400 mb-1 block uppercase font-bold", children: t("manage.label_posting") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              value: postingKey,
              onChange: (e) => setPostingKey(e.target.value),
              className: `w-full bg-dark-900 border ${validatePrivateKey(postingKey) && postingKey ? "border-red-500" : "border-dark-600"} rounded p-2 text-xs font-mono text-slate-300 focus:outline-none`,
              placeholder: t("manage.add_posting")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-green-400 mb-1 block uppercase font-bold", children: t("manage.label_active") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              value: activeKey,
              onChange: (e) => setActiveKey(e.target.value),
              className: `w-full bg-dark-900 border ${validatePrivateKey(activeKey) && activeKey ? "border-red-500" : "border-dark-600"} rounded p-2 text-xs font-mono text-slate-300 focus:outline-none`,
              placeholder: t("manage.add_active")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 mb-1 block uppercase font-bold", children: t("manage.label_memo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              value: memoKey,
              onChange: (e) => setMemoKey(e.target.value),
              className: `w-full bg-dark-900 border ${validatePrivateKey(memoKey) && memoKey ? "border-red-500" : "border-dark-600"} rounded p-2 text-xs font-mono text-slate-300 focus:outline-none`,
              placeholder: t("manage.add_memo")
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 text-center mb-2", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleSave,
            disabled: isValidating,
            className: "w-full py-3 h-auto min-h-[48px] rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg disabled:opacity-50 whitespace-normal leading-tight",
            children: isValidating ? t("manage.validating") : t("manage.save_verify")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowConfirmDelete(true),
            className: "text-xs text-red-400 hover:text-red-300 underline",
            children: t("manage.remove_link")
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-white mb-2", children: t("manage.confirm_remove_title").replace("{name}", account.name) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-6", children: t("manage.confirm_remove_desc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowConfirmDelete(false),
            className: "flex-1 py-2 rounded bg-dark-700 hover:bg-dark-600 text-slate-300 text-sm",
            children: t("manage.cancel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => onDelete(account),
            className: "flex-1 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-sm",
            children: t("manage.confirm_remove")
          }
        )
      ] })
    ] })
  ] }) });
};

const TransferModal = ({ account: initialAccount, accounts, onClose, onTransfer, disableAccountSelection }) => {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = reactExports.useState(initialAccount);
  const [to, setTo] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [memo, setMemo] = reactExports.useState("");
  const [currency, setCurrency] = reactExports.useState(
    initialAccount.chain === "HIVE" ? "HIVE" : initialAccount.chain === "STEEM" ? "STEEM" : "BLURT"
  );
  const [isSending, setIsSending] = reactExports.useState(false);
  const [recentRecipients, setRecentRecipients] = reactExports.useState([]);
  const [showRecent, setShowRecent] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const c = selectedAccount.chain;
    if (c === "HIVE") setCurrency("HIVE");
    else if (c === "STEEM") setCurrency("STEEM");
    else setCurrency("BLURT");
  }, [selectedAccount.chain]);
  reactExports.useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(["recentRecipients"], (result) => {
        if (Array.isArray(result.recentRecipients)) {
          setRecentRecipients(result.recentRecipients);
        }
      });
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const [error, setError] = reactExports.useState(null);
  const [isValidRecipient, setIsValidRecipient] = reactExports.useState(null);
  const [isValidating, setIsValidating] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setError(null);
    const check = async () => {
      if (!to || to.length < 3) {
        setIsValidRecipient(null);
        setIsValidating(false);
        return;
      }
      setIsValidating(true);
      try {
        const data = await fetchAccountData(selectedAccount.chain, to.replace(/^@/, ""));
        setIsValidRecipient(!!data);
      } catch {
        setIsValidRecipient(false);
      } finally {
        setIsValidating(false);
      }
    };
    const timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, [to, selectedAccount.chain]);
  reactExports.useEffect(() => {
    if (error) setError(null);
  }, [amount]);
  const hasActiveKey = !!selectedAccount.activeKey;
  const [step, setStep] = reactExports.useState("input");
  const handleReview = () => {
    setError(null);
    if (!to) {
      setError(t("validation.required"));
      return;
    }
    if (isValidRecipient === false) {
      return;
    }
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setError(t("validation.invalid_amount"));
      return;
    }
    setStep("review");
  };
  const saveRecipient = (name) => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["recentRecipients"], (result) => {
        const list = result.recentRecipients || [];
        if (!list.includes(name)) {
          const newList = [name, ...list].slice(0, 10);
          chrome.storage.local.set({ recentRecipients: newList });
        }
      });
    }
  };
  const handleConfirm = async () => {
    setIsSending(true);
    try {
      await onTransfer(selectedAccount, to, amount, memo, currency);
      saveRecipient(to);
      onClose();
    } catch (e) {
      console.error(e);
      setError(t("bulk.error_failed"));
    } finally {
      setIsSending(false);
    }
  };
  const handleMaxClick = () => {
    const bal = currency === "HBD" || currency === "SBD" ? selectedAccount.secondaryBalance : selectedAccount.balance;
    if (bal !== void 0) {
      setAmount(bal.toString());
    }
  };
  if (step === "review") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col animate-fadeIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white mb-4", children: t("transfer.review_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-950 p-4 rounded-lg border border-dark-700 space-y-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-dark-800 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 uppercase font-bold", children: t("sign.from") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-white", children: [
            "@",
            selectedAccount.name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-dark-800 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 uppercase font-bold", children: t("sign.to") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-white", children: [
            "@",
            to
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-dark-800 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 uppercase font-bold", children: t("bulk.amount") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-blue-400", children: [
            amount,
            " ",
            currency
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 uppercase font-bold block mb-1", children: t("bulk.memo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-300 italic bg-dark-900 p-2 rounded break-all max-h-20 overflow-y-auto", children: memo || t("transfer.no_memo") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setStep("input"),
            disabled: isSending,
            className: "flex-1 py-3 rounded-lg font-bold bg-dark-800 text-slate-400 hover:bg-dark-700 transition-colors",
            children: t("transfer.back")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleConfirm,
            disabled: isSending,
            className: "flex-1 py-3 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg flex justify-center items-center gap-2",
            children: isSending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" }) : t("wallet.send")
          }
        )
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold flex items-center gap-2", children: [
        t("wallet.send"),
        " ",
        selectedAccount.chain
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-white", children: "✕" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-dark-900 rounded-lg border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 block mb-1", children: t("sign.from") }),
        disableAccountSelection ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-dark-800 text-slate-400 border border-dark-600 rounded p-2 text-sm font-bold flex items-center gap-2 cursor-not-allowed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-slate-500" }),
          "@",
          selectedAccount.name
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: `${selectedAccount.chain}-${selectedAccount.name}`,
            onChange: (e) => {
              const [c, n] = e.target.value.split("-");
              const acc = accounts.find((a) => a.chain === c && a.name === n);
              if (acc) setSelectedAccount(acc);
            },
            className: "w-full bg-dark-800 text-white border border-dark-600 rounded p-2 text-sm outline-none focus:border-blue-500",
            children: accounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: `${a.chain}-${a.name}`, children: [
              "@",
              a.name,
              " (",
              a.chain,
              ")"
            ] }, `${a.chain}-${a.name}`))
          }
        )
      ] }),
      !hasActiveKey && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-900/20 text-red-400 p-2 rounded text-xs text-center border border-red-500/30", children: t("sign.keys_missing") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-400 uppercase font-bold mb-1 block", children: t("sign.to") }),
          isValidating && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-blue-400 animate-pulse", children: t("bulk.checking") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-2.5 text-slate-500", children: "@" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: to,
              onFocus: () => !to && setShowRecent(true),
              onBlur: () => setTimeout(() => setShowRecent(false), 200),
              onChange: (e) => {
                const val = e.target.value.toLowerCase().replace(/[@\s\u200B-\u200D\uFEFF]/g, "");
                setTo(val);
                setShowRecent(false);
              },
              className: `w-full bg-dark-900 border rounded-lg py-2 pl-7 pr-8 text-sm outline-none transition-colors ${isValidRecipient === false ? "border-red-500/50 focus:border-red-500" : isValidRecipient === true ? "border-green-500/50 focus:border-green-500" : "border-dark-600 focus:border-blue-500"}`,
              placeholder: t("import.placeholder_username"),
              autoComplete: "off"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-3 top-2.5 text-xs", children: [
            isValidRecipient === true && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "✓" }),
            isValidRecipient === false && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 font-bold", children: "✕" })
          ] }),
          showRecent && recentRecipients.length > 0 && !to && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 right-0 z-50 mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl max-h-40 overflow-y-auto custom-scrollbar animate-slide-down", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-dark-700 bg-dark-900/50", children: t("common.recent_recipients") }),
            Array.isArray(recentRecipients) && recentRecipients.map((recipient) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => {
                  setTo(recipient);
                  setShowRecent(false);
                },
                className: "px-3 py-2 text-sm text-slate-300 hover:bg-blue-600/20 hover:text-white cursor-pointer transition-colors flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center text-[10px] text-slate-400 font-bold", children: recipient.charAt(0).toUpperCase() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: recipient })
                ]
              },
              recipient
            ))
          ] })
        ] }),
        isValidRecipient === false && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-red-400 mt-1", children: t("validation.account_not_found").replace("{chain}", selectedAccount.chain) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-400 uppercase font-bold mb-1 block", children: t("bulk.amount") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              className: "w-full bg-dark-900 border border-dark-600 rounded-lg py-2 pl-3 pr-20 text-sm focus:border-blue-500 outline-none",
              placeholder: "0.000"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-1 top-1 bottom-1 flex items-center", children: selectedAccount.chain === "HIVE" || selectedAccount.chain === "STEEM" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: currency,
              onChange: (e) => setCurrency(e.target.value),
              className: "h-full bg-dark-800 text-xs font-bold text-white border-l border-dark-600 rounded-r-lg px-2 outline-none cursor-pointer hover:bg-dark-700",
              children: selectedAccount.chain === "HIVE" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HIVE", children: "HIVE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HBD", children: "HBD" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "STEEM", children: "STEEM" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SBD", children: "SBD" })
              ] })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 text-xs font-bold text-slate-500", children: selectedAccount.chain }) })
        ] }),
        (() => {
          const bal = currency === "HBD" || currency === "SBD" ? selectedAccount.secondaryBalance : selectedAccount.balance;
          if (bal !== void 0) {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-slate-500 mt-1 text-right", children: [
              t("transfer.available"),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { onClick: handleMaxClick, className: "font-bold text-white cursor-pointer hover:text-blue-400 ml-1", children: [
                bal.toFixed(3),
                " ",
                currency
              ] })
            ] });
          }
          return null;
        })()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs text-slate-400 uppercase font-bold mb-1 block", children: [
          t("bulk.memo"),
          " ",
          t("transfer.optional")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: memo,
            onChange: (e) => setMemo(e.target.value),
            rows: 3,
            className: "w-full bg-dark-900 border border-dark-600 rounded-lg py-2 px-3 text-sm focus:border-blue-500 outline-none resize-none custom-scrollbar",
            placeholder: t("transfer.memo_placeholder")
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-400 text-xs text-center font-bold mb-3 animate-pulse bg-red-900/20 p-2 rounded border border-red-500/30", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: handleReview,
        disabled: isSending || !to || !amount || !hasActiveKey,
        className: "w-full py-3 h-auto min-h-[48px] rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 whitespace-normal leading-tight",
        children: isSending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "animate-spin h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
          ] }),
          t("bulk.sign_broadcast"),
          "..."
        ] }) : t("transfer.review_btn")
      }
    )
  ] }) });
};

const ReceiveModal = ({ account: initialAccount, onClose }) => {
  const { t } = useTranslation();
  const [selectedAccount] = reactExports.useState(initialAccount);
  const [copied, setCopied] = reactExports.useState(false);
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const handleCopy = () => {
    navigator.clipboard.writeText(selectedAccount.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 shadow-2xl flex flex-col overflow-hidden relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-dark-700 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white", children: t("receive.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "text-slate-400 hover:text-white transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 border border-dark-600 rounded px-2 py-1 text-xs text-white mx-auto inline-block font-bold", children: [
        "@",
        selectedAccount.name,
        " (",
        selectedAccount.chain,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-6", children: t("receive.scan_qr").replace("{chain}", selectedAccount.chain) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-2 rounded-lg mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedAccount.name}`,
          alt: "QR Code",
          className: "w-32 h-32"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-2", children: t("receive.account_name") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: handleCopy,
          className: "w-full bg-dark-900 border border-dark-600 rounded-lg py-3 px-4 flex justify-between items-center cursor-pointer hover:border-blue-500 transition-colors group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-lg text-white", children: [
              "@",
              selectedAccount.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs ${copied ? "text-green-400" : "text-slate-500 group-hover:text-white"}`, children: copied ? t("receive.copied") : t("receive.copy") })
          ]
        }
      )
    ] })
  ] }) });
};

const HistoryModal = ({ account, onClose }) => {
  const { t } = useTranslation();
  const [history, setHistory] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [filter, setFilter] = reactExports.useState("all");
  reactExports.useEffect(() => {
    setLoading(true);
    fetchAccountHistory(account.chain, account.name).then((data) => setHistory(data)).catch((err) => console.error(err)).finally(() => setLoading(false));
  }, [account]);
  const filteredHistory = history.filter((item) => {
    if (filter === "all") return true;
    if (filter === "received") return item.type === "receive";
    if (filter === "sent") return item.type === "send";
    if (filter === "powerup") return item.type === "powerup_in" || item.type === "powerup_out";
    if (filter === "powerdown") return item.type === "powerdown";
    return true;
  });
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "receive":
      case "powerup_in":
        return "bg-green-500/10 text-green-400";
      case "send":
      case "powerup_out":
      case "powerdown":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };
  const getTypeLabel = (type) => {
    switch (type) {
      case "receive":
        return t("history.received");
      case "send":
        return t("history.sent");
      case "powerup_in":
        return t("history.type_powerup_in");
      case "powerup_out":
        return t("history.type_powerup_out");
      case "powerdown":
        return t("history.type_powerdown");
      default:
        return type;
    }
  };
  const getFilterIcon = (type) => {
    switch (type) {
      case "all":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) });
      case "received":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) });
      case "sent":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }) });
      case "powerup":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) });
      case "powerdown":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-5 h-5 flex items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 absolute inset-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3 text-red-500 absolute top-0 right-0 bg-dark-800 rounded-full", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) })
        ] });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col border border-dark-600 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border-b border-dark-600", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex justify-between items-center bg-dark-700/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-lg text-white tracking-tight", children: t("history.title").replace("{user}", account.name) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "w-8 h-8 flex items-center justify-center rounded-full bg-dark-700 text-slate-400 hover:text-white transition-colors", children: "×" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 bg-dark-900 flex items-center gap-2 overflow-x-auto no-scrollbar justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-blue-500 shrink-0 flex items-center mr-2", title: t("history.filter_label"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z", clipRule: "evenodd" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-1 justify-end", children: ["all", "received", "sent", "powerup", "powerdown"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setFilter(f),
            title: t(`history.filter_${f}`),
            className: `p-2 rounded-lg transition-all border flex items-center justify-center w-9 h-9 ${filter === f ? "bg-blue-600 border-blue-500 text-white shadow-md" : "bg-dark-800 border-dark-700 text-slate-500 hover:border-dark-500 hover:text-slate-300"}`,
            children: getFilterIcon(f)
          },
          f
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar bg-dark-900/40", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center text-slate-500 flex flex-col items-center gap-3 mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest opacity-75", children: t("history.loading") })
    ] }) : history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 text-center text-slate-600 font-bold text-sm bg-dark-900/50 m-4 rounded-xl border border-dark-800 border-dashed", children: t("history.empty") }) : filteredHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 text-center text-slate-600 font-bold text-sm bg-dark-900/50 m-4 rounded-xl border border-dark-800 border-dashed", children: t("history.empty") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-dark-800/50", children: filteredHistory.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 hover:bg-white/[0.02] transition-colors group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-wider ${getTypeBadgeClass(item.type)}`, children: getTypeLabel(item.type) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-slate-600 group-hover:text-slate-500 transition-colors", children: new Date(item.date).toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 font-medium", children: item.type === "receive" || item.type === "powerup_in" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          t("history.from"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-200 font-bold hover:text-blue-400 cursor-pointer transition-colors", children: [
            "@",
            item.from
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          t("history.to"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-200 font-bold hover:text-blue-400 cursor-pointer transition-colors", children: [
            "@",
            item.to
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `font-mono font-black text-sm tracking-tight ${item.type === "receive" || item.type === "powerup_in" ? "text-green-400" : "text-red-400"}`, children: [
          item.type === "receive" || item.type === "powerup_in" ? "+" : "-",
          item.amount
        ] })
      ] }),
      item.memo && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 bg-dark-800 p-2.5 rounded-lg border border-dark-700/50 break-all font-medium leading-relaxed shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-75", children: item.memo }) })
    ] }, idx)) }) })
  ] }) });
};

const MultiSigProgress = ({
  authority,
  progress,
  currentUser,
  currentUserWeight
}) => {
  const { t } = useTranslation();
  const percentage = Math.min(100, progress.currentWeight / progress.threshold * 100);
  const isDone = progress.canBroadcast;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `w-full bg-dark-800 rounded-xl p-6 border transition-all duration-500 shadow-lg animate-fade-in ${isDone ? "border-green-500/50 bg-green-500/5" : "border-dark-600"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-6 text-center", children: t("multisig.progress_title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex mb-2 items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full transition-colors duration-500 ${isDone ? "text-green-600 bg-green-200" : "text-blue-600 bg-blue-200"}`, children: isDone ? t("multisig.success_done") : t("multisig.status_collecting") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-semibold inline-block transition-colors duration-500 ${isDone ? "text-green-400" : "text-blue-400"}`, children: [
          progress.currentWeight,
          " / ",
          progress.threshold,
          " ",
          t("multisig.weight_label")
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-dark-900 border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: { width: `${percentage}%` },
            className: `shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-700 ${isDone ? "bg-green-500" : "bg-blue-500"}`
          }
        ),
        !isDone && currentUserWeight > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: { width: `${Math.min(100 - percentage, currentUserWeight / progress.threshold * 100)}%` },
            className: "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-400/30 animate-pulse border-l border-blue-400/50"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-slate-500 px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${isDone ? "text-green-400" : "text-blue-400"} font-bold transition-colors duration-500`, children: [
          t("multisig.threshold_label"),
          ": ",
          progress.threshold
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-slate-500 border-b border-dark-700 pb-2 mb-2", children: t("multisig.authorities_title") }),
      authority.keyAuths.map(([key, weight]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center bg-dark-900/50 p-2 rounded-lg group hover:bg-dark-900 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-slate-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-slate-400 group-hover:text-slate-300 truncate w-32", children: [
            key.substring(0, 8),
            "...",
            key.substring(key.length - 8)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-bold transition-colors ${isDone ? "text-green-400" : "text-slate-300"}`, children: [
          "+",
          weight
        ] }) })
      ] }, key)),
      authority.accountAuths.map(([acc, weight]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center bg-dark-900/50 p-2 rounded-lg group hover:bg-dark-900 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${acc === currentUser ? isDone ? "bg-green-500" : "bg-blue-500 animate-pulse" : "bg-slate-600"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs ${acc === currentUser ? isDone ? "text-green-400 font-bold" : "text-blue-400 font-bold" : "text-slate-400 group-hover:text-slate-200"}`, children: [
            "@",
            acc,
            " ",
            acc === currentUser && t("multisig.you_label")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-bold transition-colors ${isDone ? "text-green-400" : "text-slate-300"}`, children: [
          "+",
          weight
        ] }) })
      ] }, acc))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-6 p-4 rounded-lg border transition-colors duration-500 ${isDone ? "bg-green-500/5 border-green-500/10" : "bg-blue-500/5 border-blue-500/10"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] leading-relaxed italic transition-colors duration-500 ${isDone ? "text-green-400" : "text-blue-400"}`, children: t("multisig.how_it_works", { threshold: progress.threshold }) }) })
  ] });
};

const SignRequest = ({ requestId, accounts, onComplete }) => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [request, setRequest] = reactExports.useState(null);
  const [origin, setOrigin] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState("");
  const [processing, setProcessing] = reactExports.useState(false);
  const [voteWeight, setVoteWeight] = reactExports.useState(1e4);
  const [chainHint, setChainHint] = reactExports.useState(null);
  const [authority, setAuthority] = reactExports.useState(null);
  const [multisigProgress, setMultisigProgress] = reactExports.useState(null);
  const [isMultisig, setIsMultisig] = reactExports.useState(false);
  reactExports.useEffect(() => {
    chrome.runtime.sendMessage({ type: "gravity_get_request", requestId }, (resp) => {
      if (resp && resp.request) {
        setRequest(resp.request);
        setOrigin(resp.origin || t("sign.unknown_source"));
        if (resp.chain) setChainHint(resp.chain);
        const method2 = resp.request.method;
        if (method2 === "requestVote" || method2 === "vote") {
          setVoteWeight(Number(resp.request.params[3]));
        }
      } else {
        setError(t("sign.expired"));
      }
      setLoading(false);
    });
  }, [requestId, t]);
  const extractBroadcastOperations = (value) => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      if (Array.isArray(value.operations)) return value.operations;
      if (value.tx && Array.isArray(value.tx.operations)) return value.tx.operations;
      if (value.transaction && Array.isArray(value.transaction.operations)) return value.transaction.operations;
    }
    return value ? [value] : [];
  };
  const [trustDomain, setTrustDomain] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!request || !accounts.length) return;
    const checkMultisig = async () => {
      let username = request.params[0];
      let targetChain = chainHint;
      let account = accounts.find((a) => a.name === username && (targetChain ? a.chain === targetChain : true));
      if (!account && !targetChain) {
        account = accounts.find((a) => a.name === username && a.chain === "HIVE");
      }
      if (!account) account = accounts.find((a) => a.name === username);
      if (!account && Array.isArray(request.params)) {
        const operations = extractBroadcastOperations(request.params[1]);
        const accountNames = accounts.map((a) => a.name.toLowerCase());
        for (const op of operations) {
          if (Array.isArray(op) && op.length >= 2 && typeof op[1] === "object") {
            const opData = op[1];
            const possibleUsers = [opData.voter, opData.from, opData.author, opData.delegator, opData.account].filter((u) => typeof u === "string");
            for (const possibleUser of possibleUsers) {
              if (accountNames.includes(possibleUser.toLowerCase())) {
                username = possibleUser;
                account = accounts.find((a) => a.name.toLowerCase() === possibleUser.toLowerCase());
                if (account) break;
              }
            }
            if (account) break;
          }
        }
      }
      if (!account) return;
      const isActiveOp = ["requestTransfer", "requestPowerUp", "requestPowerDown", "requestDelegation", "requestWitnessVote"].includes(request.method);
      const authType = isActiveOp ? "active" : "posting";
      const auth = await getAccountAuthorities(account.chain, account.name, authType);
      if (auth && auth.threshold > 1) {
        setAuthority(auth);
        setIsMultisig(true);
        setMultisigProgress({
          currentWeight: 0,
          threshold: auth.threshold,
          canBroadcast: false
        });
      }
    };
    checkMultisig();
  }, [request, accounts, chainHint]);
  const handleDecision = async (accept) => {
    if (!accept) {
      notifyBackground(null, t("sign.user_rejected"));
      return;
    }
    if (trustDomain && domain) {
      chrome.storage.local.get(["gravity_whitelist"], (res) => {
        const whitelist = res.gravity_whitelist || [];
        const username = request.params[0];
        const method2 = request.method;
        const exists = whitelist.some(
          (e) => e.domain === domain && e.username === username && e.method === method2
        );
        if (!exists) {
          chrome.storage.local.set({
            gravity_whitelist: [...whitelist, { domain, username, method: method2 }]
          });
        }
      });
    }
    setProcessing(true);
    try {
      let username = request.params[0];
      let targetChain = chainHint;
      let account = accounts.find((a) => a.name === username && (targetChain ? a.chain === targetChain : true));
      if (!account && !targetChain) {
        account = accounts.find((a) => a.name === username && a.chain === "HIVE");
      }
      if (!account) {
        account = accounts.find((a) => a.name === username);
      }
      if (!account && Array.isArray(request.params)) {
        const operations = extractBroadcastOperations(request.params[1]);
        const accountNames = accounts.map((a) => a.name.toLowerCase());
        for (const op of operations) {
          if (Array.isArray(op) && op.length >= 2 && typeof op[1] === "object") {
            const opData = op[1];
            const possibleUsers = [
              opData.voter,
              // vote operation
              opData.from,
              // transfer operation  
              opData.author,
              // comment/post operation (when user is posting)
              opData.delegator,
              // delegation operation
              opData.account
              // witness_vote, account_update, etc.
            ].filter((u) => typeof u === "string");
            for (const possibleUser of possibleUsers) {
              if (accountNames.includes(possibleUser.toLowerCase())) {
                username = possibleUser;
                account = accounts.find((a) => a.name.toLowerCase() === possibleUser.toLowerCase() && (targetChain ? a.chain === targetChain : true)) || accounts.find((a) => a.name.toLowerCase() === possibleUser.toLowerCase());
                if (account) break;
              }
            }
            if (account) break;
          }
        }
      }
      if (!account && Array.isArray(request.params)) {
        const accountNames = accounts.map((a) => a.name.toLowerCase());
        const matched = request.params.find((p) => typeof p === "string" && accountNames.includes(p.toLowerCase()));
        if (typeof matched === "string") {
          username = matched;
          account = accounts.find((a) => a.name === username && (targetChain ? a.chain === targetChain : true)) || accounts.find((a) => a.name === username);
        }
      }
      if (!account) {
        throw new Error(t("sign.account_not_found"));
      }
      console.log("[SignRequest] Account found:", {
        name: account.name,
        chain: account.chain,
        hasActiveKey: !!account.activeKey,
        activeKeyPrefix: account.activeKey ? account.activeKey.substring(0, 8) + "..." : "NONE",
        hasPostingKey: !!account.postingKey,
        postingKeyPrefix: account.postingKey ? account.postingKey.substring(0, 8) + "..." : "NONE",
        hasMemoKey: !!account.memoKey
      });
      if (isMultisig && multisigProgress && !multisigProgress.canBroadcast) {
        const msResult = await handleMultisigSign(account);
        showNotification(msResult.message || "Signature collected", "success");
        notifyBackground(msResult, null);
        return;
      }
      let result = { success: false };
      const method2 = request.method;
      const isTransfer2 = method2 === "requestTransfer";
      const isVote2 = method2 === "requestVote" || method2 === "vote";
      const isCustomJson2 = method2 === "requestCustomJson" || method2 === "customJSON";
      const isSignBuffer2 = method2 === "requestSignBuffer" || method2 === "signBuffer";
      const isBroadcast2 = method2 === "requestBroadcast" || method2 === "broadcast";
      const isPowerUp = method2 === "requestPowerUp" || method2 === "powerUp";
      const isPowerDown = method2 === "requestPowerDown" || method2 === "powerDown";
      const isDelegation = method2 === "requestDelegation" || method2 === "delegation";
      const isPost2 = method2 === "requestPost" || method2 === "post";
      const isWitnessVote2 = method2 === "requestWitnessVote" || method2 === "witnessVote";
      const needsActive = isTransfer2 || isPowerUp || isPowerDown || isDelegation || isWitnessVote2 || isBroadcast2 && !account.postingKey || // Broadcast assumes Active?
      isCustomJson2 && request.params[2] === "Active";
      if (needsActive && !account.activeKey) {
        throw new Error(t("sign.active_missing"));
      }
      if (isTransfer2) {
        const to = request.params[1];
        const amount = request.params[2];
        const memo = request.params[3] || "";
        const response = await broadcastTransfer(account.chain, account.name, account.activeKey, to, amount, memo);
        if (!response.success) throw new Error(response.error);
        const opResult = response.opResult || response.txId;
        result = {
          result: response.txId || opResult,
          txId: response.txId,
          tx_id: response.txId,
          broadcastPayload: opResult,
          opResult,
          message: t("sign.success"),
          ...response
        };
      } else if (isVote2) {
        const author = request.params[2];
        const permlink = request.params[1];
        const weight = voteWeight;
        const key = account.postingKey || account.activeKey;
        if (!key) throw new Error(t("sign.keys_missing"));
        const response = await broadcastVote(account.chain, account.name, key, author, permlink, weight);
        if (!response.success) throw new Error(response.error);
        const opResult = response.opResult || response.txId;
        result = {
          result: response.txId || opResult,
          txId: response.txId,
          tx_id: response.txId,
          broadcastPayload: opResult,
          opResult,
          message: t("sign.success"),
          ...response
        };
      } else if (isCustomJson2) {
        const id = request.params[1];
        const type = request.params[2];
        const json = request.params[3];
        let key = account.postingKey;
        if (type === "Active") key = account.activeKey;
        if (!key) throw new Error(t("sign.key_missing_type").replace("{type}", type));
        const response = await broadcastCustomJson(account.chain, account.name, key, id, typeof json === "string" ? json : JSON.stringify(json), type);
        if (!response.success) throw new Error(response.error);
        const opResult = response.opResult || response.txId;
        result = {
          result: response.txId || opResult,
          txId: response.txId,
          tx_id: response.txId,
          broadcastPayload: opResult,
          opResult,
          message: t("sign.success"),
          ...response
        };
      } else if (isSignBuffer2) {
        const message = request.params[1];
        const type = request.params[2];
        console.log("[SignRequest] signBuffer request:", {
          chain: account.chain,
          username: account.name,
          keyType: type,
          messageType: typeof message,
          messageLength: typeof message === "string" ? message.length : "N/A",
          messagePreview: typeof message === "string" ? message.substring(0, 100) : JSON.stringify(message).substring(0, 100)
        });
        let keyStr = "";
        if (type === "Posting") keyStr = account.postingKey || "";
        else if (type === "Active") keyStr = account.activeKey || "";
        else if (type === "Memo") keyStr = account.memoKey || "";
        if (!keyStr) throw new Error(t("sign.key_missing_generic").replace("{type}", type));
        const response = signMessage(account.chain, message, keyStr);
        console.log("[SignRequest] signMessage response:", {
          success: response.success,
          error: response.error,
          resultLength: response.result ? response.result.length : 0,
          resultPreview: response.result ? response.result.substring(0, 40) + "..." : "NONE",
          publicKey: response.publicKey
        });
        if (!response.success) throw new Error(response.error);
        const { success: _s, result: _r, publicKey: _pk, ...restResponse } = response;
        result = {
          success: true,
          result: response.result,
          signature: response.result,
          // Some dApps expect 'signature'
          publicKey: response.publicKey,
          pubkey: response.publicKey,
          // Some dApps expect 'pubkey'
          // CRITICAL: blurt.media/peerhub expects data.username
          data: {
            username: account.name,
            message,
            publicKey: response.publicKey,
            signature: response.result
          },
          message: t("sign.success"),
          ...restResponse
        };
        console.log("[SignRequest] Final result to return:", {
          hasResult: !!result.result,
          hasPublicKey: !!result.publicKey,
          keys: Object.keys(result)
        });
      } else if (isBroadcast2) {
        let rawOperations = request.params[1];
        const keyType = request.params[2];
        const originalEnvelope = request._gravityBroadcastEnvelope || (request._gravityOriginalParams && Array.isArray(request._gravityOriginalParams) ? request._gravityOriginalParams[1] : null);
        if (rawOperations && typeof rawOperations === "object" && !Array.isArray(rawOperations)) {
          console.log("[SignRequest Broadcast] Extracting operations from transaction envelope:", Object.keys(rawOperations));
          rawOperations = rawOperations.operations || rawOperations.tx?.operations || rawOperations.transaction?.operations || rawOperations;
        }
        let operations = (Array.isArray(rawOperations) ? rawOperations : [rawOperations]).map((op) => {
          if (Array.isArray(op)) return op;
          if (op && typeof op === "object") {
            const type = op.type || op.operation || op.method;
            const data = op.data || op.op || op.operation_data || (({ type: _t, operation: _o, method: _m, ...rest }) => rest)(op);
            if (type) return [type, data];
          }
          return op;
        });
        const firstOperation = operations.find((op) => Array.isArray(op) || op && typeof op === "object");
        const firstOperationName = Array.isArray(firstOperation) ? firstOperation[0] : firstOperation?.type || firstOperation?.operation || firstOperation?.method || null;
        const requiresActiveKey = operations.some((op) => {
          const opName = Array.isArray(op) ? op[0] : op.type || op[0];
          const activeKeyOps = [
            "witness_update",
            "witness_set_properties",
            "account_witness_vote",
            "account_update",
            "account_update2",
            "transfer",
            "transfer_to_vesting",
            "withdraw_vesting",
            "delegate_vesting_shares",
            "account_create",
            "account_create_with_delegation",
            "transfer_to_savings",
            "transfer_from_savings",
            "escrow_transfer",
            "escrow_release",
            "escrow_dispute",
            "escrow_approve",
            "claim_reward_balance",
            "delegate_rc",
            "create_proposal",
            "update_proposal_votes",
            "remove_proposal",
            // Market operations (wallet.hive.blog, etc.)
            "limit_order_create",
            "limit_order_create2",
            "limit_order_cancel",
            "convert",
            "collateralized_convert",
            "fill_convert_request",
            "cancel_transfer_from_savings",
            "set_withdraw_vesting_route"
          ];
          return activeKeyOps.includes(opName);
        });
        let key = account.postingKey;
        if (keyType === "Active") key = account.activeKey;
        else if (requiresActiveKey) key = account.activeKey;
        if (!key && account.activeKey) key = account.activeKey;
        console.log("[SignRequest Broadcast] Key selection:", {
          keyType,
          requiresActiveKey,
          hasActiveKey: !!account.activeKey,
          hasPostingKey: !!account.postingKey,
          selectedKeyPrefix: key ? key.substring(0, 10) + "..." : "NONE",
          operations: operations.map((op) => Array.isArray(op) ? op[0] : op.type)
        });
        const requiredKeyType = requiresActiveKey ? "Active" : keyType || "Posting";
        if (!key) throw new Error(t("sign.key_missing_type").replace("{type}", requiredKeyType));
        if (requiresActiveKey && key !== account.activeKey && account.activeKey) {
          console.log("[SignRequest] FORCING Active key for operation requiring active authority");
          key = account.activeKey;
        }
        console.log("[SignRequest Broadcast] FINAL key being used:", {
          keyPrefix: key.substring(0, 10) + "...",
          isActiveKey: key === account.activeKey,
          requiresActiveKey
        });
        const response = await broadcastOperations(account.chain, key, operations);
        if (!response.success) throw new Error(response.error);
        const opResult = response.opResult || response.txId;
        const isSplinterlands = /(^|\.)splinterlands\.com$/i.test(domain);
        const envelopePayload = originalEnvelope && typeof originalEnvelope === "object" ? {
          ...originalEnvelope,
          operations: Array.isArray(originalEnvelope.operations) ? originalEnvelope.operations : operations
        } : null;
        const resultPayload = isSplinterlands ? {
          ...envelopePayload || {},
          ...opResult && typeof opResult === "object" ? opResult : {},
          id: response.txId || (opResult && typeof opResult === "object" ? opResult.id : void 0),
          txId: response.txId,
          tx_id: response.txId,
          operation: firstOperationName,
          op: firstOperationName,
          operations
        } : response.txId || opResult;
        result = {
          result: resultPayload,
          txId: response.txId,
          tx_id: response.txId,
          transaction: envelopePayload || void 0,
          broadcastPayload: opResult,
          opResult,
          operation: firstOperationName,
          operations,
          message: t("sign.success"),
          ...response
        };
      } else if (isPowerUp) {
        const to = request.params[1] || account.name;
        let amount = request.params[2];
        if (amount && !amount.includes(" ")) {
          const symbol = account.chain === Chain.HIVE ? "HIVE" : account.chain === Chain.STEEM ? "STEEM" : "BLURT";
          amount = `${parseFloat(amount).toFixed(3)} ${symbol}`;
        }
        const response = await broadcastPowerUp(account.chain, account.name, account.activeKey, to, amount);
        if (!response.success) throw new Error(response.error);
        const opResult = response.opResult || response.txId;
        result = {
          result: response.txId || opResult,
          txId: response.txId,
          tx_id: response.txId,
          broadcastPayload: opResult,
          opResult,
          message: t("sign.success"),
          ...response
        };
      } else if (isPowerDown) {
        let vestingShares = request.params[1];
        if (vestingShares && !vestingShares.includes(" ")) {
          vestingShares = `${parseFloat(vestingShares).toFixed(6)} VESTS`;
        }
        const response = await broadcastPowerDown(account.chain, account.name, account.activeKey, vestingShares);
        if (!response.success) throw new Error(response.error);
        const opResult = response.opResult || response.txId;
        result = {
          result: response.txId || opResult,
          txId: response.txId,
          tx_id: response.txId,
          broadcastPayload: opResult,
          opResult,
          message: t("sign.success"),
          ...response
        };
      } else if (isDelegation) {
        const delegatee = request.params[1];
        const amount = request.params[2];
        const unit = request.params[3] || "VESTS";
        let vestingShares = amount;
        if (amount && !amount.includes(" ")) {
          vestingShares = `${amount} ${unit}`;
        }
        const response = await broadcastDelegation(account.chain, account.name, account.activeKey, delegatee, vestingShares);
        if (!response.success) throw new Error(response.error);
        const opResult = response.opResult || response.txId;
        result = {
          result: response.txId || opResult,
          txId: response.txId,
          tx_id: response.txId,
          broadcastPayload: opResult,
          opResult,
          message: t("sign.success"),
          ...response
        };
      } else if (isWitnessVote2) {
        const witness = request.params[1];
        const approve = request.params[2] === true || request.params[2] === "true" || request.params[2] === 1;
        const response = await broadcastWitnessVote(account.chain, account.name, account.activeKey, witness, approve);
        if (!response.success) throw new Error(response.error);
        const opResult = response.opResult || response.txId;
        result = {
          result: response.txId || opResult,
          txId: response.txId,
          tx_id: response.txId,
          broadcastPayload: opResult,
          opResult,
          message: t("sign.success"),
          ...response
        };
      } else if (isPost2) {
        const title = request.params[1];
        const body = request.params[2];
        let parentPermlink = request.params[3];
        const parentAuthor = request.params[4];
        const jsonMetadata = request.params[5];
        const permlink = request.params[6];
        if (!parentPermlink) {
          try {
            const metadata = typeof jsonMetadata === "string" ? JSON.parse(jsonMetadata) : jsonMetadata;
            if (metadata && metadata.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0) {
              parentPermlink = metadata.tags[0];
            }
          } catch (e) {
          }
          if (!parentPermlink) parentPermlink = "general";
        }
        const op = ["comment", {
          parent_author: parentAuthor || "",
          parent_permlink: parentPermlink || "general",
          author: username || "",
          permlink: permlink || "",
          title: title || "",
          body: body || "",
          json_metadata: typeof jsonMetadata === "string" ? jsonMetadata : JSON.stringify(jsonMetadata || {})
        }];
        console.log("SignRequest: About to broadcast operation:", JSON.stringify(op, null, 2));
        const opPayload = op[1];
        console.log("SignRequest: Operation fields:", {
          parent_author: opPayload.parent_author,
          parent_permlink: opPayload.parent_permlink,
          author: opPayload.author,
          permlink: opPayload.permlink,
          title: opPayload.title,
          body: opPayload.body?.substring(0, 50),
          json_metadata: opPayload.json_metadata?.substring(0, 100)
        });
        const response = await broadcastOperations(account.chain, account.postingKey || account.activeKey, [op]);
        if (!response.success) throw new Error(response.error);
        result = { success: true, result: response.opResult || response.txId };
      }
      notifyBackground(result, null);
    } catch (e) {
      setError(e.message);
      setProcessing(false);
      notifyBackground(null, e.message);
    }
  };
  reactExports.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !processing && !loading && !error) {
        handleDecision(true);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [processing, loading, error, request]);
  const handleMultisigSign = async (account) => {
    console.log(`[Multisig] Partial signing for @${account.name} on ${account.chain}`);
    return {
      success: true,
      status: "PARTIAL",
      message: "Signature submitted! Waiting for other co-signers.",
      txId: "pending-" + Date.now()
    };
  };
  const notifyBackground = (result, err) => {
    chrome.runtime.sendMessage({
      type: "gravity_resolve_request",
      requestId,
      result,
      error: err
    }, () => {
      if (chrome.runtime.lastError) console.error("Gravity: Failed to resolve request", chrome.runtime.lastError);
      onComplete();
    });
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center text-slate-400", children: t("sign.loading") });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex items-center justify-center text-red-400 p-8 text-center", children: [
    t("sign.error"),
    ": ",
    error
  ] });
  const method = request?.method;
  const isTransfer = method === "requestTransfer";
  const isVote = method === "requestVote" || method === "vote";
  const isCustomJson = method === "requestCustomJson" || method === "customJSON";
  const isSignBuffer = method === "requestSignBuffer" || method === "signBuffer";
  const isPost = method === "requestPost" || method === "post";
  const isWitnessVote = method === "requestWitnessVote" || method === "witnessVote";
  const isFile = origin === "file" || origin.startsWith("file://");
  const domain = isFile ? t("sign.local_file") : (origin.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/im) || [null, origin])[1];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full bg-dark-900 text-slate-200 flex flex-col relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 p-4 border-b border-dark-700 flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-blue-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-white text-lg", children: t("sign.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: domain })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 flex flex-col items-center", children: [
      isMultisig && authority && multisigProgress && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        MultiSigProgress,
        {
          authority,
          progress: multisigProgress,
          currentUser: request.params[0],
          currentUserWeight: 0
        }
      ) }),
      isTransfer ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg text-center animate-fade-in-down", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-4", children: t("sign.transfer_title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-white", children: request.params[2] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-blue-400", children: request.params[4] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm mt-6 border-t border-dark-700 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: t("sign.from") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-white", children: [
              "@",
              request.params[0]
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-600", children: "->" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: t("sign.to") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-white", children: [
              "@",
              request.params[1]
            ] })
          ] })
        ] }),
        request.params[3] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-dark-900/50 p-3 rounded-lg text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-slate-500 mb-1", children: "Memo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-300 italic", children: [
            '"',
            request.params[3],
            '"'
          ] })
        ] })
      ] }) : isVote ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg text-center animate-fade-in-down", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-4", children: t("sign.vote_title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-5xl font-black text-blue-500", children: [
            voteWeight / 100,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: "0",
                max: "10000",
                step: "100",
                value: voteWeight,
                onChange: (e) => setVoteWeight(Number(e.target.value)),
                className: "w-full mt-4 h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between w-full mt-3 px-1", children: [0, 25, 50, 75, 100].map((pct) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setVoteWeight(pct * 100),
                className: "text-[10px] font-bold text-slate-500 hover:text-white bg-dark-900 border border-dark-700 hover:border-blue-500 hover:bg-dark-700 px-2 py-1 rounded transition-all transform hover:scale-105",
                children: [
                  pct,
                  "%"
                ]
              },
              pct
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 text-sm border-t border-dark-700 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("sign.author") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
              "@",
              request.params[2]
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-900/50 p-3 rounded-lg text-left overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-300 truncate", children: request.params[1] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sign.from") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
              "@",
              request.params[0]
            ] })
          ] })
        ] })
      ] }) : isCustomJson ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg animate-fade-in-down", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-4 text-center", children: t("sign.custom_json_title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dark-700 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: t("sign.id") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-blue-400 font-bold", children: request.params[1] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mb-1", children: t("sign.json_payload") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-900 p-3 rounded-lg border border-dark-700 max-h-60 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[10px] text-green-400 whitespace-pre-wrap break-all font-mono", children: (() => {
              try {
                const data = typeof request.params[3] === "string" ? JSON.parse(request.params[3]) : request.params[3];
                return JSON.stringify(data, null, 2);
              } catch (e) {
                return String(request.params[3]);
              }
            })() }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-dark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sign.from") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
              "@",
              request.params[0]
            ] })
          ] })
        ] })
      ] }) : isSignBuffer ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg animate-fade-in-down", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-4 text-center", children: t("sign.buffer_title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 p-4 rounded-lg border border-dark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mb-2 uppercase", children: t("sign.message_label") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 font-mono break-all", children: request.params[1] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sign.key_type") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400 font-bold", children: request.params[2] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-dark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sign.from") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
              "@",
              request.params[0]
            ] })
          ] })
        ] })
      ] }) : isPost ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg animate-fade-in-down", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-4 text-center", children: t("sign.post_title") || "POST / COMMENT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          request.params[1] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-slate-500 mb-1", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white", children: request.params[1] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-slate-500 mb-1", children: "Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-900 p-3 rounded-lg border border-dark-700 max-h-60 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-300 whitespace-pre-wrap font-mono", children: request.params[2] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-dark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sign.author") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
              "@",
              request.params[0]
            ] })
          ] })
        ] })
      ] }) : isWitnessVote ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg text-center animate-fade-in-down", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-blue-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-2", children: request.params[2] === false || request.params[2] === "false" || request.params[2] === 0 ? "UNVOTE WITNESS" : "VOTE WITNESS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-bold text-white mb-6", children: [
          "@",
          request.params[1]
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-dark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sign.author") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
            "@",
            request.params[0]
          ] })
        ] })
      ] }) : (
        // Generic Request ViewFallback
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-4 max-w-xs mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 p-4 rounded-xl border border-dark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase text-slate-500 mb-1", children: t("sign.operation") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-blue-400 font-bold", children: request?.method })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 p-4 rounded-xl border border-dark-700 w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase text-slate-500 mb-2", children: t("sign.params") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2", children: request.params.map((param, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 text-xs border-b border-dark-700 last:border-0 pb-2 last:pb-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-500 w-6 font-mono opacity-50 shrink-0", children: [
                idx,
                ":"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 font-mono break-all leading-relaxed", children: typeof param === "object" ? JSON.stringify(param, null, 2) : String(param) })
            ] }, idx)) })
          ] })
        ] })
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pb-8 bg-dark-800 border-t border-dark-700", children: [
      !isFile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2 cursor-pointer select-none group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: trustDomain,
            onChange: (e) => setTrustDomain(e.target.checked),
            className: "form-checkbox h-4 w-4 text-blue-600 rounded border-dark-600 bg-dark-900 focus:ring-blue-500 focus:ring-offset-dark-800 transition duration-150 ease-in-out"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 group-hover:text-slate-300 transition-colors", children: t("sign.trust_domain") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 max-w-xs mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleDecision(false),
            className: "flex-1 py-3 px-2 h-auto min-h-[48px] rounded-lg font-bold text-slate-400 hover:text-white hover:bg-dark-700 transition-colors whitespace-normal leading-tight",
            children: t("sign.reject")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleDecision(true),
            disabled: processing,
            className: "flex-1 py-3 px-2 h-auto min-h-[48px] rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] whitespace-normal leading-tight",
            children: processing ? t("sign.signing") : isMultisig && !multisigProgress?.canBroadcast ? "Partial Sign" : t("sign.confirm")
          }
        )
      ] })
    ] })
  ] });
};

const HelpView = () => {
  const { t } = useTranslation();
  const icons = {
    home: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }),
    wallet: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }),
    bulk: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }),
    multisig: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }),
    settings: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
    lock: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }),
    detach: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z", stroke: "currentColor", fill: "currentColor" }),
    send: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }),
    receive: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }),
    history: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }),
    power: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }),
    savings: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }),
    rc: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" })
  };
  const navItems = [
    { icon: icons.home, label: t("sidebar.home"), desc: t("help.btn_home") },
    { icon: icons.wallet, label: t("sidebar.wallet"), desc: t("help.btn_wallet") },
    { icon: icons.bulk, label: t("sidebar.bulk"), desc: t("help.btn_bulk") },
    { icon: icons.multisig, label: t("sidebar.multisig"), desc: t("help.btn_multisig") },
    { icon: icons.settings, label: t("sidebar.manage"), desc: t("help.btn_settings") },
    { icon: icons.lock, label: t("sidebar.lock"), desc: t("help.btn_lock") },
    { icon: icons.detach, label: t("sidebar.pin"), desc: t("help.btn_detach") }
  ];
  const actionItems = [
    { icon: icons.send, label: t("wallet.send"), desc: t("help.btn_send") },
    { icon: icons.receive, label: t("wallet.receive"), desc: t("help.btn_receive") },
    { icon: icons.history, label: t("wallet.history"), desc: t("help.btn_history") },
    { icon: icons.power, label: "Power up/down", desc: t("help.btn_powerup") },
    { icon: icons.savings, label: "Savings", desc: t("help.btn_savings") },
    { icon: icons.rc, label: "Resource Credits", desc: t("help.btn_rc") }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto p-4 custom-scrollbar text-slate-300 space-y-8 animate-fadeIn", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white mb-6 border-b border-dark-700 pb-2", children: t("help.title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-dark-800 p-5 rounded-2xl border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-blue-400 font-bold mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }) }),
          t("help.keys_title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-4", children: t("help.keys_desc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: "Posting:" }),
            " ",
            t("help.posting_key_desc")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: "Active:" }),
            " ",
            t("help.active_key_desc")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: "Memo:" }),
            " ",
            t("help.memo_key_desc")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-dark-800 p-5 rounded-2xl border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-pink-400 font-bold mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }),
          t("help.power_title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-4", children: t("help.power_desc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-slate-300", children: [
            "• ",
            t("help.power_point")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-slate-300", children: [
            "• ",
            t("help.power_down_point")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-slate-300", children: [
            "• ",
            t("help.delegate_point")
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-400 uppercase tracking-widest mb-4", children: t("help.section_actions") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: actionItems.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 bg-dark-900/50 p-3 rounded-xl border border-dark-700/50 hover:border-dark-600 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: item.icon }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-white text-[13px]", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-0.5 leading-tight", children: item.desc })
        ] })
      ] }, idx)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-400 uppercase tracking-widest mb-4", children: t("help.section_navigation") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: navItems.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 bg-dark-900/50 p-3 rounded-xl border border-dark-700/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: item.icon }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-white text-[13px]", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-0.5 leading-tight", children: item.desc })
        ] })
      ] }, idx)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-dark-800 p-5 rounded-2xl border border-dark-700 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-green-400 font-bold mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }),
        t("help.chat_title")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 mb-2", children: t("help.chat_desc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-900 p-3 rounded-lg border border-dark-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-xs text-slate-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-500", children: "⚠" }),
          " ",
          t("help.chat_warning")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400", children: "ℹ" }),
          " ",
          t("help.chat_cost")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "✓" }),
          " ",
          t("help.chat_memo_required")
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-blue-900/10 rounded-2xl p-6 border border-blue-500/20 shadow-lg mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-blue-400 mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }),
        t("help.security_title")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-slate-400", children: t("help.security_desc") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-dark-800 rounded-2xl p-6 border border-dark-700 shadow-lg mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-white mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-green-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" }) }),
        t("help.2fa_title")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-sm text-blue-400 mb-2", children: t("help.2fa_multi_app_question") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 leading-relaxed mb-3", children: t("help.2fa_multi_app_answer") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal list-inside text-xs text-slate-300 space-y-2 ml-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: t("help.2fa_step1") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: t("help.2fa_step2") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: t("help.2fa_step3") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: t("help.2fa_step4") }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-dark-700 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-sm text-purple-400 mb-2", children: t("help.visual_guides") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-4", children: t("help.visual_guides_desc") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 p-2 rounded-lg border border-dark-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-dark-800 rounded flex items-center justify-center mb-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: "/images/help/setup_2fa.gif",
                  alt: "2FA Setup Animation",
                  className: "w-full h-full object-cover opacity-80",
                  onError: (e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgY2xhc3M9InRleHQtc2xhdGUtNzAwIj48cGF0aCBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiIGQ9Ik0xNSAxMGEzIDMgMCAxMTYgMCAzIDMgMCAwMS02IDB6Ii8+PHBhdGggc3Ryb2tlPSJjdXJyZW50Q29xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiIGQ9Ik0yLjQ1OCAxMmMyLjUxOS02Ljg3NiA5LjY3Mi02Ljg3NiAxOS4wODQgMG0tMi40NTggNmMtMi41MTkgNi44NzYtOS42NzIgNi44NzYtMTkuMDg0IDAiLz48L3N2Zz4=";
                    e.target.classList.add("p-8");
                  }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-mono block text-center", children: "setup_2fa.gif" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 p-2 rounded-lg border border-dark-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-dark-800 rounded flex items-center justify-center mb-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: "/images/help/multi_chain.gif",
                  alt: "Multi Chain Animation",
                  className: "w-full h-full object-cover opacity-80",
                  onError: (e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgY2xhc3M9InRleHQtc2xhdGUtNzAwIj48cGF0aCBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiIGQ9Ik0xMyAxMFYzbC05IDExaDd2N2w5LTExaC03eiIvPjwvc3ZnPg==";
                    e.target.classList.add("p-8");
                  }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-mono block text-center", children: "multi_chain.gif" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};

const ChatView = ({ onClose }) => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [user, setUser] = reactExports.useState(null);
  const [isRegistering, setIsRegistering] = reactExports.useState(false);
  const [usernameInput, setUsernameInput] = reactExports.useState("");
  const [regError, setRegError] = reactExports.useState(null);
  const [socketStatus, setSocketStatus] = reactExports.useState("disconnected");
  const [lastError, setLastError] = reactExports.useState(null);
  const [rooms, setRooms] = reactExports.useState([]);
  const [activeRoomId, setActiveRoomId] = reactExports.useState(() => {
    return localStorage.getItem("gravity_chat_active_room");
  });
  const [messages, setMessages] = reactExports.useState([]);
  const [inputText, setInputText] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [searchResults, setSearchResults] = reactExports.useState([]);
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const [newRoomName, setNewRoomName] = reactExports.useState("");
  const [isPrivateRoom, setIsPrivateRoom] = reactExports.useState(false);
  const [showParticipants, setShowParticipants] = reactExports.useState(false);
  const [chatModal, setChatModal] = reactExports.useState(null);
  const [modalInput, setModalInput] = reactExports.useState("");
  const [editingMessageId, setEditingMessageId] = reactExports.useState(null);
  const [editBuffer, setEditBuffer] = reactExports.useState("");
  const messagesEndRef = reactExports.useRef(null);
  const pendingRoomResetRef = reactExports.useRef(null);
  const activeRoomIdRef = reactExports.useRef(null);
  const handleCreateRoom = () => {
    if (newRoomName.trim().length < 3) return;
    chatService.createRoom(newRoomName.trim(), isPrivateRoom);
    setNewRoomName("");
    setIsPrivateRoom(false);
    setIsCreating(false);
  };
  reactExports.useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      try {
        const maybePromise = chrome.runtime.sendMessage({ type: "CHAT_UI_OPENED" });
        if (maybePromise && typeof maybePromise.catch === "function") {
          maybePromise.catch(() => {
          });
        }
      } catch {
      }
    }
    const existingRooms = chatService.getRooms();
    if (existingRooms.length > 0) {
      console.log("[ChatView] Restoring", existingRooms.length, "rooms from service");
      setRooms(existingRooms);
    }
    if (activeRoomId && !existingRooms.find((r) => r.id === activeRoomId)) {
      setActiveRoomId(null);
      localStorage.removeItem("gravity_chat_active_room");
    }
    const existing = chatService.getCurrentUser();
    if (existing) {
      setUser(existing);
      setSocketStatus("authenticated");
    } else {
      const storedUsername = localStorage.getItem("gravity_chat_username");
      const storedId = localStorage.getItem("gravity_chat_id");
      if (storedUsername && storedId) {
        setUser({ id: storedId, username: storedUsername });
        setSocketStatus("authenticated");
      }
    }
    chatService.onAuthSuccess = (u) => {
      setUser(u);
      setIsRegistering(false);
      setSocketStatus("authenticated");
    };
    chatService.onStatusChange = (status, errMsg) => {
      setSocketStatus(status);
      if (errMsg) setLastError(errMsg);
      if (errMsg && (errMsg.includes("taken") || errMsg.includes("expired"))) {
        setIsRegistering(false);
      }
    };
    chatService.onRoomAdded = (room) => {
      setRooms((prev) => {
        if (prev.find((r) => r.id === room.id)) return prev;
        return [...prev, room];
      });
      if (room.type === "dm" || room.type === "private") {
        showNotification(t("chat.invited_to", { room: room.name }), "success");
      }
    };
    chatService.onRoomUpdated = (updatedRooms) => {
      setRooms(updatedRooms);
      const currentActive = activeRoomIdRef.current;
      if (currentActive) {
        const roomExists = updatedRooms.find((r) => r.id === currentActive);
        if (!roomExists) {
          if (pendingRoomResetRef.current) {
            window.clearTimeout(pendingRoomResetRef.current);
          }
          pendingRoomResetRef.current = window.setTimeout(() => {
            const stillMissing = !chatService.getRooms().find((r) => r.id === currentActive);
            if (stillMissing) {
              console.log("[ChatView] Active room no longer exists, returning to room list:", currentActive);
              setActiveRoomId(null);
              localStorage.removeItem("gravity_chat_active_room");
              showNotification("Room was closed", "info");
            }
          }, 400);
        } else if (pendingRoomResetRef.current) {
          window.clearTimeout(pendingRoomResetRef.current);
          pendingRoomResetRef.current = null;
        }
      }
    };
    if (chatService.getCurrentUser()) {
      setSocketStatus("authenticated");
    } else if (chatService.isConnected()) {
      setSocketStatus("connected");
    } else {
      setSocketStatus("connecting");
    }
    chatService.init();
    chatService.onError = (err) => {
      showNotification(err, "error");
      setIsRegistering(false);
    };
    const handleSearch = (e) => {
      setSearchResults(e.detail);
    };
    const handleKicked = (e) => {
      if (e.detail.roomId === activeRoomId) {
        setActiveRoomId(null);
        showNotification("You have been removed from this room", "info");
      }
    };
    window.addEventListener("chat-search-results", handleSearch);
    window.addEventListener("chat-room-kicked", handleKicked);
    return () => {
      window.removeEventListener("chat-search-results", handleSearch);
      window.removeEventListener("chat-room-kicked", handleKicked);
    };
  }, []);
  reactExports.useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
  }, [activeRoomId]);
  reactExports.useEffect(() => {
    const chatListener = (roomId, msg) => {
      if (roomId === activeRoomId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        scrollToBottom();
      }
    };
    chatService.addMessageListener(chatListener);
    return () => chatService.removeMessageListener(chatListener);
  }, [activeRoomId]);
  reactExports.useEffect(() => {
    if (activeRoomId) {
      localStorage.setItem("gravity_chat_active_room", activeRoomId);
    } else {
      localStorage.removeItem("gravity_chat_active_room");
    }
  }, [activeRoomId]);
  const [pushGranted, setPushGranted] = reactExports.useState(false);
  const handleEnablePush = async () => {
    try {
      if (window.innerWidth < 600 && typeof chrome !== "undefined" && chrome.tabs) {
        console.log("Gravity: Detected popup mode, opening dedicated tab for permissions");
        chrome.tabs.create({ url: chrome.runtime.getURL("index.html?action=enable_notifications") });
        window.close();
        return;
      }
      const perm = await Notification.requestPermission();
      console.log("Gravity: Notification Permission Result:", perm);
      if (perm === "granted") {
        setPushGranted(true);
        if (typeof chrome !== "undefined" && chrome.runtime) {
          chrome.runtime.sendMessage({ type: "CHAT_ENABLE_PUSH" }, (res) => {
            const lastError2 = chrome.runtime.lastError;
            if (lastError2) {
              console.error("Gravity: Runtime Message Error:", lastError2);
              showNotification("Extension Error: " + lastError2.message, "error");
              setPushGranted(false);
              return;
            }
            if (res && res.success) {
              console.log("Gravity: Push Subscribed via Background");
              if (res.subscription) chatService.syncPushSubscription(res.subscription);
            } else {
              console.error("Gravity: Push Background Error", res?.error);
              showNotification("Push Error: " + (res?.error || "Unknown"), "error");
              setPushGranted(false);
            }
          });
        }
      } else {
        console.warn("Gravity: Notification permission denied/closed");
        showNotification("Notifications blocked. Please enable them in browser settings.", "info");
      }
    } catch (e) {
      console.error("Gravity: Exception requesting permission", e);
      showNotification("Error: " + e.message, "error");
    }
  };
  reactExports.useEffect(() => {
    if (socketStatus === "authenticated") {
      if (Notification.permission === "granted") {
        if (typeof chrome !== "undefined" && chrome.runtime) {
          chrome.runtime.sendMessage({ type: "CHAT_CHECK_PUSH" }, (res) => {
            if (res && res.success && res.subscription) {
              console.log("Gravity: Push Sync OK");
              setPushGranted(true);
              chatService.syncPushSubscription(res.subscription);
            } else {
              console.log("Gravity: Push granted but missing sub. Requesting user action.");
              setPushGranted(false);
              chrome.runtime.sendMessage({ type: "CHAT_ENABLE_PUSH" }, (res2) => {
                if (res2 && res2.success) {
                  setPushGranted(true);
                  chatService.syncPushSubscription(res2.subscription);
                }
              });
            }
          });
        }
      } else {
        setPushGranted(false);
      }
    }
  }, [socketStatus]);
  reactExports.useEffect(() => {
    if (activeRoomId) {
      chatService.joinRoom(activeRoomId);
      const room = rooms.find((r) => r.id === activeRoomId);
      if (room) {
        setMessages(room.messages);
        scrollToBottom();
      }
    }
  }, [activeRoomId, rooms]);
  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  const handleRegister = () => {
    if (usernameInput.trim().length < 3) {
      setRegError("Username must be at least 3 chars");
      return;
    }
    setIsRegistering(true);
    setRegError(null);
    chatService.register(usernameInput.trim());
  };
  const handleSend = () => {
    if (!activeRoomId || !inputText.trim()) return;
    const room = rooms.find((r) => r.id === activeRoomId);
    const partner = room?.type === "dm" ? room.memberDetails?.find((m) => m.id !== user?.id) : null;
    if (partner?.encryptionPublicKey) {
      chatService.sendDirectMessage(activeRoomId, inputText, partner.encryptionPublicKey);
    } else {
      chatService.sendMessage(activeRoomId, inputText);
    }
    setInputText("");
  };
  const handleModalAction = () => {
    if (!chatModal) return;
    const { type, data } = chatModal;
    switch (type) {
      case "invite":
        if (modalInput.trim() && activeRoomId) {
          chatService.inviteUser(activeRoomId, modalInput.trim());
          showNotification(`Invitation sent to ${modalInput}`, "success");
        }
        break;
      case "confirm_delete":
        if (activeRoomId) {
          chatService.closeRoom(activeRoomId);
          setActiveRoomId(null);
          showNotification("Room deleted", "info");
        }
        break;
      case "confirm_kick":
        if (activeRoomId && data) {
          chatService.kickUser(activeRoomId, data.id);
          showNotification(`Kicked @${data.username}`, "info");
        }
        break;
      case "confirm_ban":
        if (activeRoomId && data) {
          chatService.banUser(activeRoomId, data.id);
          showNotification(`Banned @${data.username} permanently`, "error");
        }
        break;
      case "confirm_delete_message":
        if (activeRoomId && data) {
          chatService.deleteMessage(activeRoomId, data.messageId);
        }
        break;
    }
    setChatModal(null);
    setModalInput("");
  };
  const handleSearchUsers = (q) => {
    setSearchQuery(q);
    if (q.length > 1) {
      chatService.searchUsers(q);
    } else {
      setSearchResults([]);
    }
  };
  const startDM = (targetUserId) => {
    chatService.createDM(targetUserId);
    setSearchResults([]);
    setSearchQuery("");
    showNotification("Creating DM...", "info");
  };
  if (!user && (socketStatus === "connecting" || socketStatus === "disconnected")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-dark-900 text-white items-center justify-center p-6 text-center", children: [
      socketStatus === "connecting" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 animate-pulse font-medium", children: t("chat.status_connecting") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-600 mt-2 max-w-[200px]", children: "Establishing secure connection with Gravity Servers." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 font-bold mb-1", children: "Connection Failed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-500 mb-2", children: "Could not reach the chat server." }),
        lastError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-red-500/70 mb-6 italic max-w-xs", children: lastError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setSocketStatus("connecting");
              setLastError(null);
              chatService.init();
            },
            className: "bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-bold transition-all active:scale-95 mb-4",
            children: "Retry Connection"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-600 text-xs hover:text-white transition-colors mt-2 underline", children: t("common.close") })
    ] });
  }
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col h-full bg-dark-900 text-white items-center justify-center p-6 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm bg-dark-800 p-8 rounded-2xl border border-dark-700 shadow-xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-2", children: t("chat.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm mb-6", children: "Create a unique username to join the community. This ID is separate from your wallets." }),
      regError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-500/10 text-red-400 text-xs p-3 rounded-lg mb-4 border border-red-500/20 flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: regError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              chatService.logout();
              window.location.reload();
            },
            className: "bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-3 py-1.5 rounded text-[9px] font-black uppercase self-center transition-colors",
            children: t("chat.clear_identity")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white mb-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-slate-600",
          placeholder: t("chat.placeholder_username"),
          value: usernameInput,
          onChange: (e) => setUsernameInput(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleRegister()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleRegister,
          disabled: isRegistering,
          className: "w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-lg shadow-purple-900/20",
          children: isRegistering ? t("common.processing") : t("chat.btn_join")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "mt-4 text-slate-500 text-xs hover:text-white underline", children: t("common.cancel") })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full bg-dark-900 text-white overflow-hidden animate-fadeIn relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `w-80 flex flex-col border-r border-dark-700 bg-dark-850 ${activeRoomId ? "hidden md:flex" : "flex w-full"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-dark-700 bg-dark-800 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold shadow-sm", children: user.username.substring(0, 2).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-xs truncate max-w-[100px]", children: user.username }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-green-400 flex items-center gap-1", children: "Online" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsCreating(true), className: "p-1.5 bg-dark-700 hover:bg-purple-600/20 text-slate-400 hover:text-purple-400 rounded-lg transition-all", title: "New Room", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) })
      ] }),
      !pushGranted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border-b border-dark-700 bg-indigo-900/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleEnablePush, className: "w-full text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) }),
        "Enable Notifications"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-dark-700 bg-dark-900/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "w-full bg-dark-900 border border-dark-700 rounded-lg pl-8 pr-4 py-1.5 text-xs outline-none focus:border-purple-500 transition-all placeholder-slate-600",
              placeholder: "Find ID or Room...",
              value: searchQuery,
              onChange: (e) => handleSearchUsers(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })
        ] }),
        searchResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-2 right-2 mt-1 z-50 bg-dark-800 border border-dark-600 rounded-xl shadow-2xl overflow-hidden animate-slideDown", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 border-b border-dark-700 flex justify-between items-center bg-dark-900/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-slate-500 uppercase", children: "Search Results" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearchResults([]), className: "text-slate-500 hover:text-white", children: "X" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto", children: searchResults.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => startDM(u.id), className: "px-3 py-2 hover:bg-purple-900/20 cursor-pointer flex items-center gap-2 border-b border-dark-700/50 last:border-0 transition-colors group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 bg-dark-700 group-hover:bg-purple-600 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-400 group-hover:text-white transition-colors", children: u.username.substring(0, 2).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium", children: [
                "@",
                u.username
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-500", children: "Click to start DM" })
            ] })
          ] }, u.id)) })
        ] })
      ] }),
      isCreating && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "m-3 p-3 bg-dark-800 rounded-xl border border-purple-500/30 animate-fadeIn shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            autoFocus: true,
            className: "w-full bg-dark-950 border border-dark-700 rounded-lg px-3 py-2 text-xs mb-3 focus:border-purple-500 outline-none",
            placeholder: "My awesome room...",
            value: newRoomName,
            onChange: (e) => setNewRoomName(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") handleCreateRoom();
              if (e.key === "Escape") setIsCreating(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-3 group cursor-pointer", onClick: () => setIsPrivateRoom(!isPrivateRoom), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-3.5 h-3.5 rounded border flex items-center justify-center mr-2 transition-colors ${isPrivateRoom ? "bg-purple-600 border-purple-600" : "border-dark-600 bg-dark-900/50"}`, children: isPrivateRoom && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-2.5 h-2.5 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 cursor-pointer group-hover:text-slate-200", children: "Private (Invite Only)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setIsCreating(false);
            setIsPrivateRoom(false);
          }, className: "text-[10px] py-1.5 px-3 rounded-lg hover:bg-dark-700 text-slate-400 transition-colors", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCreateRoom, className: "text-[10px] py-1.5 px-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold transition-all shadow-md", children: "Create Room" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2 mt-2", children: t("chat.rooms") }),
        rooms.filter((r) => r.type === "public" || r.type === "private").map((room) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => {
              setActiveRoomId(room.id);
              setRooms((prev) => prev.map((r) => r.id === room.id ? { ...r, unreadCount: 0 } : r));
            },
            className: `p-3 rounded-lg cursor-pointer flex flex-col transition-colors ${activeRoomId === room.id ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20" : "hover:bg-dark-700 text-slate-300"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-sm flex items-center gap-2 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70 text-xs", children: room.type === "public" ? "#" : "[P]" }),
              " ",
              room.name,
              (room.unreadCount ?? 0) > 0 && activeRoomId !== room.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse ml-auto" })
            ] })
          },
          room.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2 mt-4", children: "Direct Messages" }),
        rooms.filter((r) => r.type === "dm").map((room) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => {
              setActiveRoomId(room.id);
              setRooms((prev) => prev.map((r) => r.id === room.id ? { ...r, unreadCount: 0 } : r));
            },
            className: `p-3 rounded-lg cursor-pointer flex flex-col transition-colors ${activeRoomId === room.id ? "bg-indigo-600 text-white shadow-lg" : "hover:bg-dark-700 text-slate-300"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-sm flex items-center gap-2 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }),
              room.name.replace(user.username, "").replace(" & ", "").trim() || "Chat",
              (room.unreadCount ?? 0) > 0 && activeRoomId !== room.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse ml-auto" })
            ] })
          },
          room.id
        )),
        rooms.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 p-4 text-center italic", children: t("chat.no_rooms") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-1 flex flex-col bg-dark-900 ${!activeRoomId ? "hidden" : "flex"} ${showParticipants ? "pr-64" : "pr-0"} transition-all duration-300`, children: !activeRoomId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-600 opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-16 h-16 mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8S21 7.582 21 12z" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Select a room to start chatting" })
    ] }) : (() => {
      const room = rooms.find((r) => r.id === activeRoomId);
      if (!room) return null;
      const isOwner = room.owner === user?.id;
      const isDM = room.type === "dm";
      const cleanName = isDM ? room.name.replace(user?.username || "", "").replace(" & ", "").replace(user?.username || "", "").trim() : room.name;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-14 border-b border-dark-700 flex items-center px-4 bg-dark-800 justify-between shrink-0 shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveRoomId(null), className: "md:hidden p-1 text-slate-400 hover:text-white hover:bg-dark-700 rounded-lg transition-all active:scale-90", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold flex items-center gap-2 truncate", children: [
              room.type === "dm" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] shadow-lg font-black text-white shrink-0", children: cleanName.substring(0, 1).toUpperCase() }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-lg font-mono", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col truncate", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm md:text-base text-slate-100 font-bold tracking-tight", children: cleanName }),
                (room.type === "private" || isOwner) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 -mt-0.5", children: [
                  room.type === "private" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-orange-400/80 flex items-center gap-0.5 uppercase tracking-tighter", children: "Private" }),
                  isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-purple-400 font-bold flex items-center gap-0.5 uppercase tracking-tighter", children: "Owner" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 items-center shrink-0 ml-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  console.log("Toggling participants panel:", !showParticipants);
                  setShowParticipants(!showParticipants);
                },
                className: `p-2 rounded-lg transition-all active:scale-95 ${showParticipants ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-slate-400 hover:bg-dark-700"}`,
                title: "View Members",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) })
              }
            ),
            room.type === "private" && isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setChatModal({ type: "invite" }),
                className: "bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors active:scale-95",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }),
                  "Invite"
                ]
              }
            ),
            isOwner && room.id !== "global-lobby" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setChatModal({ type: "confirm_delete" }),
                className: "bg-red-900/40 hover:bg-red-600 border border-red-700/50 text-red-100 text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95",
                title: "Delete Room",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
                  "Close"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-white hidden md:block p-1.5 transition-colors", children: "X" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar", children: [
          messages.map((msg, i) => {
            const isMe = msg.senderId === user.id;
            const showAvatar = i === 0 || messages[i - 1].senderId !== msg.senderId;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-2 group ${isMe ? "flex-row-reverse" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold ${showAvatar ? isMe ? "bg-purple-600" : "bg-slate-600" : "opacity-0"}`, children: msg.senderName.substring(0, 2).toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col max-w-[80%] ${isMe ? "items-end" : "items-start"}`, children: [
                showAvatar && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-500 mb-0.5 px-1", children: msg.senderName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 group/bubble", children: [
                  isMe && !editingMessageId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity ${isMe ? "flex-row" : "flex-row-reverse"}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          setEditingMessageId(msg.id);
                          setEditBuffer(msg.content.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&"));
                        },
                        className: "p-1 text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-colors",
                        title: "Edit",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => setChatModal({ type: "confirm_delete_message", data: { messageId: msg.id } }),
                        className: "p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors",
                        title: "Delete",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
                      }
                    )
                  ] }),
                  isOwner && !isMe && !editingMessageId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setChatModal({ type: "confirm_delete_message", data: { messageId: msg.id } }),
                      className: "opacity-0 group-hover/bubble:opacity-100 p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-opacity",
                      title: "Admin Delete",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-3 py-1.5 rounded-xl text-sm leading-relaxed break-all ${isMe ? "bg-purple-600 text-white rounded-tr-sm" : "bg-dark-700 text-slate-200 rounded-tl-sm"}`, children: editingMessageId === msg.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 min-w-[180px]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "textarea",
                      {
                        autoFocus: true,
                        className: "bg-dark-800 text-white p-2 rounded border border-purple-500 outline-none w-full text-xs min-h-[60px] resize-none",
                        value: editBuffer,
                        onChange: (e) => setEditBuffer(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Escape") setEditingMessageId(null);
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            chatService.editMessage(activeRoomId, msg.id, editBuffer);
                            setEditingMessageId(null);
                          }
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingMessageId(null), className: "text-[9px] px-2 py-1 hover:bg-white/10 rounded", children: "Cancel" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => {
                            chatService.editMessage(activeRoomId, msg.id, editBuffer);
                            setEditingMessageId(null);
                          },
                          className: "text-[9px] px-2 py-1 bg-white text-purple-600 font-bold rounded",
                          children: "Save"
                        }
                      )
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    (() => {
                      const urlRegex = /(https?:\/\/[^\s]+)/g;
                      const parts = msg.content.split(urlRegex);
                      return parts.map((part, index) => {
                        if (part.match(urlRegex)) {
                          const url = part;
                          const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
                          const isYouTube = /youtube\.com|youtu\.be/i.test(url);
                          const trustedDomains = ["imgur.com", "giphy.com", "gstatic.com", "youtube.com", "youtu.be", "google.com", "github.com", "hive.blog", "peakd.com", "steemit.com", "blurt.blog"];
                          const domain = new URL(url).hostname.replace("www.", "");
                          const isTrusted = trustedDomains.some((d) => domain === d || domain.endsWith("." + d));
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block mt-1 first:mt-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "a",
                              {
                                href: url,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: `underline break-all flex items-center gap-1 ${isTrusted ? "text-blue-300" : "text-orange-400"}`,
                                title: isTrusted ? "Trusted Domain" : "Unknown Domain - Be careful!",
                                children: [
                                  !isTrusted && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3 text-orange-400", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
                                  url
                                ]
                              }
                            ),
                            isTrusted && isImage && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "Shared", className: "mt-2 rounded-lg max-w-full max-h-48 border border-white/10 shadow-lg cursor-pointer hover:scale-[1.02] transition-transform" }),
                            isTrusted && isYouTube && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-[10px] text-slate-400 italic flex items-center gap-1 bg-black/20 p-2 rounded", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" }) }),
                              "YouTube Video Link"
                            ] })
                          ] }, index);
                        }
                        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: part }, index);
                      });
                    })(),
                    msg.isEdited && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] opacity-50 block mt-1 italic border-t border-white/10 pt-1", children: [
                      "Edited ",
                      new Date(msg.editTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    ] })
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-600 mt-0.5 px-1 opacity-70", children: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
              ] })
            ] }, msg.id || i);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 md:p-3 bg-dark-800 border-t border-dark-700 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-dark-900 border border-dark-600 rounded-xl px-2 py-1.5 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8S21 7.582 21 12z" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "flex-1 bg-transparent px-1 text-white placeholder-slate-600 outline-none text-sm min-w-0",
              placeholder: room.type === "dm" ? `Message ${cleanName}...` : `Message #${room.name}...`,
              value: inputText,
              onChange: (e) => setInputText(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleSend()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleSend,
              disabled: !inputText.trim(),
              className: "p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:bg-dark-700 shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }) })
            }
          )
        ] }) })
      ] });
    })() }),
    activeRoomId && showParticipants && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 top-0 bottom-0 w-64 bg-dark-800 border-l border-dark-700 flex flex-col z-50 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[10px] uppercase tracking-wider text-slate-500", children: "Participants" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowParticipants(false), className: "text-slate-500 hover:text-white", children: "X" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar", children: (() => {
        const currentRoom = rooms.find((r) => r.id === activeRoomId);
        const members = currentRoom?.memberDetails;
        console.log("Room participants debug:", {
          roomId: activeRoomId,
          room: currentRoom,
          memberDetails: members,
          memberCount: members?.length
        });
        if (!members || members.length === 0) {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-slate-500 text-sm py-8", children: "No participants found" });
        }
        return members.map((member) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 p-2 rounded hover:bg-dark-700/50 transition-colors border border-transparent hover:border-dark-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full flex-shrink-0 ${member.isOnline ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]" : "bg-slate-600"}`, title: member.isOnline ? "Online" : "Offline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${member.id === user?.id ? "text-purple-400 font-bold" : "text-white"}`, children: [
              "@",
              member.username
            ] }),
            rooms.find((r) => r.id === activeRoomId)?.owner === member.id && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[8px] bg-orange-900/30 border border-orange-500/30 px-1 rounded text-orange-400 flex-shrink-0", children: "Owner" })
          ] }) }),
          member.id !== user?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mt-1", children: [
            rooms.find((r) => r.id === activeRoomId)?.type !== "dm" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  startDM(member.id);
                  setShowParticipants(false);
                },
                className: "flex-1 text-[9px] bg-blue-900/40 border border-blue-600 hover:bg-blue-800 px-1.5 py-1 rounded text-blue-200 hover:text-white transition-colors font-bold",
                children: "DM"
              }
            ),
            rooms.find((r) => r.id === activeRoomId)?.owner === user?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                chatService.muteUser(activeRoomId, member.id);
                showNotification(`User @${member.username} muted`, "info");
              }, className: "flex-1 text-[9px] bg-dark-900 border border-dark-600 hover:bg-slate-700 px-1.5 py-1 rounded text-slate-400 hover:text-white transition-colors", children: "Mute" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setChatModal({ type: "confirm_kick", data: member }), className: "flex-1 text-[9px] bg-dark-900 border border-dark-600 hover:bg-red-900/20 px-1.5 py-1 rounded text-slate-400 hover:text-red-400 transition-colors", children: "Kick" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setChatModal({ type: "confirm_ban", data: member }), className: "flex-1 text-[9px] bg-red-900/40 border border-red-700 hover:bg-red-800 px-1.5 py-1 rounded text-white transition-colors font-bold", children: "Ban" })
            ] })
          ] })
        ] }, member.id));
      })() })
    ] }),
    chatModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-dark-950/80 backdrop-blur-sm", onClick: () => setChatModal(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-xs bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl p-6 animate-fadeIn", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-lg font-bold mb-2", children: [
          chatModal.type === "invite" && "Invite Member",
          chatModal.type === "confirm_delete" && "Delete Room?",
          chatModal.type === "confirm_kick" && `Kick @${chatModal.data?.username}?`,
          chatModal.type === "confirm_ban" && `Ban @${chatModal.data?.username}?`,
          chatModal.type === "confirm_delete_message" && "Delete Message?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400 mb-6 font-medium", children: [
          chatModal.type === "invite" && "Type the username of the person you want to invite to this private room.",
          chatModal.type === "confirm_delete" && "This action is permanent. All messages and room history will be lost.",
          chatModal.type === "confirm_kick" && "This user will be removed from the room but can rejoin if it is a public room.",
          chatModal.type === "confirm_ban" && "This user will be permanently banned from this room.",
          chatModal.type === "confirm_delete_message" && "This message will be permanently removed for everyone."
        ] }),
        chatModal.type === "invite" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white mb-6 outline-none focus:border-purple-500", placeholder: "Username...", value: modalInput, onChange: (e) => setModalInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleModalAction() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setChatModal(null);
            setModalInput("");
          }, className: "flex-1 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-slate-300 font-bold transition-all", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleModalAction, className: `flex-1 py-2 rounded-lg font-bold transition-all ${chatModal.type === "invite" ? "bg-purple-600 hover:bg-purple-500" : "bg-red-600 hover:bg-red-500"} text-white`, children: chatModal.type === "invite" ? "Invite" : "Confirm" })
        ] })
      ] })
    ] })
  ] });
};

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/third-party/qrcodegen/index.ts
/**
 * @license QR Code generator library (TypeScript)
 * Copyright (c) Project Nayuki.
 * SPDX-License-Identifier: MIT
 */
var qrcodegen;
((qrcodegen2) => {
  const _QrCode = class {
    constructor(version, errorCorrectionLevel, dataCodewords, msk) {
      this.version = version;
      this.errorCorrectionLevel = errorCorrectionLevel;
      this.modules = [];
      this.isFunction = [];
      if (version < _QrCode.MIN_VERSION || version > _QrCode.MAX_VERSION)
        throw new RangeError("Version value out of range");
      if (msk < -1 || msk > 7)
        throw new RangeError("Mask value out of range");
      this.size = version * 4 + 17;
      let row = [];
      for (let i = 0; i < this.size; i++)
        row.push(false);
      for (let i = 0; i < this.size; i++) {
        this.modules.push(row.slice());
        this.isFunction.push(row.slice());
      }
      this.drawFunctionPatterns();
      const allCodewords = this.addEccAndInterleave(dataCodewords);
      this.drawCodewords(allCodewords);
      if (msk == -1) {
        let minPenalty = 1e9;
        for (let i = 0; i < 8; i++) {
          this.applyMask(i);
          this.drawFormatBits(i);
          const penalty = this.getPenaltyScore();
          if (penalty < minPenalty) {
            msk = i;
            minPenalty = penalty;
          }
          this.applyMask(i);
        }
      }
      assert(0 <= msk && msk <= 7);
      this.mask = msk;
      this.applyMask(msk);
      this.drawFormatBits(msk);
      this.isFunction = [];
    }
    static encodeText(text, ecl) {
      const segs = qrcodegen2.QrSegment.makeSegments(text);
      return _QrCode.encodeSegments(segs, ecl);
    }
    static encodeBinary(data, ecl) {
      const seg = qrcodegen2.QrSegment.makeBytes(data);
      return _QrCode.encodeSegments([seg], ecl);
    }
    static encodeSegments(segs, ecl, minVersion = 1, maxVersion = 40, mask = -1, boostEcl = true) {
      if (!(_QrCode.MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= _QrCode.MAX_VERSION) || mask < -1 || mask > 7)
        throw new RangeError("Invalid value");
      let version;
      let dataUsedBits;
      for (version = minVersion; ; version++) {
        const dataCapacityBits2 = _QrCode.getNumDataCodewords(version, ecl) * 8;
        const usedBits = QrSegment.getTotalBits(segs, version);
        if (usedBits <= dataCapacityBits2) {
          dataUsedBits = usedBits;
          break;
        }
        if (version >= maxVersion)
          throw new RangeError("Data too long");
      }
      for (const newEcl of [_QrCode.Ecc.MEDIUM, _QrCode.Ecc.QUARTILE, _QrCode.Ecc.HIGH]) {
        if (boostEcl && dataUsedBits <= _QrCode.getNumDataCodewords(version, newEcl) * 8)
          ecl = newEcl;
      }
      let bb = [];
      for (const seg of segs) {
        appendBits(seg.mode.modeBits, 4, bb);
        appendBits(seg.numChars, seg.mode.numCharCountBits(version), bb);
        for (const b of seg.getData())
          bb.push(b);
      }
      assert(bb.length == dataUsedBits);
      const dataCapacityBits = _QrCode.getNumDataCodewords(version, ecl) * 8;
      assert(bb.length <= dataCapacityBits);
      appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
      appendBits(0, (8 - bb.length % 8) % 8, bb);
      assert(bb.length % 8 == 0);
      for (let padByte = 236; bb.length < dataCapacityBits; padByte ^= 236 ^ 17)
        appendBits(padByte, 8, bb);
      let dataCodewords = [];
      while (dataCodewords.length * 8 < bb.length)
        dataCodewords.push(0);
      bb.forEach((b, i) => dataCodewords[i >>> 3] |= b << 7 - (i & 7));
      return new _QrCode(version, ecl, dataCodewords, mask);
    }
    getModule(x, y) {
      return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
    }
    getModules() {
      return this.modules;
    }
    drawFunctionPatterns() {
      for (let i = 0; i < this.size; i++) {
        this.setFunctionModule(6, i, i % 2 == 0);
        this.setFunctionModule(i, 6, i % 2 == 0);
      }
      this.drawFinderPattern(3, 3);
      this.drawFinderPattern(this.size - 4, 3);
      this.drawFinderPattern(3, this.size - 4);
      const alignPatPos = this.getAlignmentPatternPositions();
      const numAlign = alignPatPos.length;
      for (let i = 0; i < numAlign; i++) {
        for (let j = 0; j < numAlign; j++) {
          if (!(i == 0 && j == 0 || i == 0 && j == numAlign - 1 || i == numAlign - 1 && j == 0))
            this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
        }
      }
      this.drawFormatBits(0);
      this.drawVersion();
    }
    drawFormatBits(mask) {
      const data = this.errorCorrectionLevel.formatBits << 3 | mask;
      let rem = data;
      for (let i = 0; i < 10; i++)
        rem = rem << 1 ^ (rem >>> 9) * 1335;
      const bits = (data << 10 | rem) ^ 21522;
      assert(bits >>> 15 == 0);
      for (let i = 0; i <= 5; i++)
        this.setFunctionModule(8, i, getBit(bits, i));
      this.setFunctionModule(8, 7, getBit(bits, 6));
      this.setFunctionModule(8, 8, getBit(bits, 7));
      this.setFunctionModule(7, 8, getBit(bits, 8));
      for (let i = 9; i < 15; i++)
        this.setFunctionModule(14 - i, 8, getBit(bits, i));
      for (let i = 0; i < 8; i++)
        this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));
      for (let i = 8; i < 15; i++)
        this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));
      this.setFunctionModule(8, this.size - 8, true);
    }
    drawVersion() {
      if (this.version < 7)
        return;
      let rem = this.version;
      for (let i = 0; i < 12; i++)
        rem = rem << 1 ^ (rem >>> 11) * 7973;
      const bits = this.version << 12 | rem;
      assert(bits >>> 18 == 0);
      for (let i = 0; i < 18; i++) {
        const color = getBit(bits, i);
        const a = this.size - 11 + i % 3;
        const b = Math.floor(i / 3);
        this.setFunctionModule(a, b, color);
        this.setFunctionModule(b, a, color);
      }
    }
    drawFinderPattern(x, y) {
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          const xx = x + dx;
          const yy = y + dy;
          if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size)
            this.setFunctionModule(xx, yy, dist != 2 && dist != 4);
        }
      }
    }
    drawAlignmentPattern(x, y) {
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++)
          this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
      }
    }
    setFunctionModule(x, y, isDark) {
      this.modules[y][x] = isDark;
      this.isFunction[y][x] = true;
    }
    addEccAndInterleave(data) {
      const ver = this.version;
      const ecl = this.errorCorrectionLevel;
      if (data.length != _QrCode.getNumDataCodewords(ver, ecl))
        throw new RangeError("Invalid argument");
      const numBlocks = _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
      const blockEccLen = _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver];
      const rawCodewords = Math.floor(_QrCode.getNumRawDataModules(ver) / 8);
      const numShortBlocks = numBlocks - rawCodewords % numBlocks;
      const shortBlockLen = Math.floor(rawCodewords / numBlocks);
      let blocks = [];
      const rsDiv = _QrCode.reedSolomonComputeDivisor(blockEccLen);
      for (let i = 0, k = 0; i < numBlocks; i++) {
        let dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
        k += dat.length;
        const ecc = _QrCode.reedSolomonComputeRemainder(dat, rsDiv);
        if (i < numShortBlocks)
          dat.push(0);
        blocks.push(dat.concat(ecc));
      }
      let result = [];
      for (let i = 0; i < blocks[0].length; i++) {
        blocks.forEach((block, j) => {
          if (i != shortBlockLen - blockEccLen || j >= numShortBlocks)
            result.push(block[i]);
        });
      }
      assert(result.length == rawCodewords);
      return result;
    }
    drawCodewords(data) {
      if (data.length != Math.floor(_QrCode.getNumRawDataModules(this.version) / 8))
        throw new RangeError("Invalid argument");
      let i = 0;
      for (let right = this.size - 1; right >= 1; right -= 2) {
        if (right == 6)
          right = 5;
        for (let vert = 0; vert < this.size; vert++) {
          for (let j = 0; j < 2; j++) {
            const x = right - j;
            const upward = (right + 1 & 2) == 0;
            const y = upward ? this.size - 1 - vert : vert;
            if (!this.isFunction[y][x] && i < data.length * 8) {
              this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
              i++;
            }
          }
        }
      }
      assert(i == data.length * 8);
    }
    applyMask(mask) {
      if (mask < 0 || mask > 7)
        throw new RangeError("Mask value out of range");
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          let invert;
          switch (mask) {
            case 0:
              invert = (x + y) % 2 == 0;
              break;
            case 1:
              invert = y % 2 == 0;
              break;
            case 2:
              invert = x % 3 == 0;
              break;
            case 3:
              invert = (x + y) % 3 == 0;
              break;
            case 4:
              invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0;
              break;
            case 5:
              invert = x * y % 2 + x * y % 3 == 0;
              break;
            case 6:
              invert = (x * y % 2 + x * y % 3) % 2 == 0;
              break;
            case 7:
              invert = ((x + y) % 2 + x * y % 3) % 2 == 0;
              break;
            default:
              throw new Error("Unreachable");
          }
          if (!this.isFunction[y][x] && invert)
            this.modules[y][x] = !this.modules[y][x];
        }
      }
    }
    getPenaltyScore() {
      let result = 0;
      for (let y = 0; y < this.size; y++) {
        let runColor = false;
        let runX = 0;
        let runHistory = [0, 0, 0, 0, 0, 0, 0];
        for (let x = 0; x < this.size; x++) {
          if (this.modules[y][x] == runColor) {
            runX++;
            if (runX == 5)
              result += _QrCode.PENALTY_N1;
            else if (runX > 5)
              result++;
          } else {
            this.finderPenaltyAddHistory(runX, runHistory);
            if (!runColor)
              result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
            runColor = this.modules[y][x];
            runX = 1;
          }
        }
        result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * _QrCode.PENALTY_N3;
      }
      for (let x = 0; x < this.size; x++) {
        let runColor = false;
        let runY = 0;
        let runHistory = [0, 0, 0, 0, 0, 0, 0];
        for (let y = 0; y < this.size; y++) {
          if (this.modules[y][x] == runColor) {
            runY++;
            if (runY == 5)
              result += _QrCode.PENALTY_N1;
            else if (runY > 5)
              result++;
          } else {
            this.finderPenaltyAddHistory(runY, runHistory);
            if (!runColor)
              result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
            runColor = this.modules[y][x];
            runY = 1;
          }
        }
        result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * _QrCode.PENALTY_N3;
      }
      for (let y = 0; y < this.size - 1; y++) {
        for (let x = 0; x < this.size - 1; x++) {
          const color = this.modules[y][x];
          if (color == this.modules[y][x + 1] && color == this.modules[y + 1][x] && color == this.modules[y + 1][x + 1])
            result += _QrCode.PENALTY_N2;
        }
      }
      let dark = 0;
      for (const row of this.modules)
        dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark);
      const total = this.size * this.size;
      const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
      assert(0 <= k && k <= 9);
      result += k * _QrCode.PENALTY_N4;
      assert(0 <= result && result <= 2568888);
      return result;
    }
    getAlignmentPatternPositions() {
      if (this.version == 1)
        return [];
      else {
        const numAlign = Math.floor(this.version / 7) + 2;
        const step = this.version == 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
        let result = [6];
        for (let pos = this.size - 7; result.length < numAlign; pos -= step)
          result.splice(1, 0, pos);
        return result;
      }
    }
    static getNumRawDataModules(ver) {
      if (ver < _QrCode.MIN_VERSION || ver > _QrCode.MAX_VERSION)
        throw new RangeError("Version number out of range");
      let result = (16 * ver + 128) * ver + 64;
      if (ver >= 2) {
        const numAlign = Math.floor(ver / 7) + 2;
        result -= (25 * numAlign - 10) * numAlign - 55;
        if (ver >= 7)
          result -= 36;
      }
      assert(208 <= result && result <= 29648);
      return result;
    }
    static getNumDataCodewords(ver, ecl) {
      return Math.floor(_QrCode.getNumRawDataModules(ver) / 8) - _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] * _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
    }
    static reedSolomonComputeDivisor(degree) {
      if (degree < 1 || degree > 255)
        throw new RangeError("Degree out of range");
      let result = [];
      for (let i = 0; i < degree - 1; i++)
        result.push(0);
      result.push(1);
      let root = 1;
      for (let i = 0; i < degree; i++) {
        for (let j = 0; j < result.length; j++) {
          result[j] = _QrCode.reedSolomonMultiply(result[j], root);
          if (j + 1 < result.length)
            result[j] ^= result[j + 1];
        }
        root = _QrCode.reedSolomonMultiply(root, 2);
      }
      return result;
    }
    static reedSolomonComputeRemainder(data, divisor) {
      let result = divisor.map((_) => 0);
      for (const b of data) {
        const factor = b ^ result.shift();
        result.push(0);
        divisor.forEach((coef, i) => result[i] ^= _QrCode.reedSolomonMultiply(coef, factor));
      }
      return result;
    }
    static reedSolomonMultiply(x, y) {
      if (x >>> 8 != 0 || y >>> 8 != 0)
        throw new RangeError("Byte out of range");
      let z = 0;
      for (let i = 7; i >= 0; i--) {
        z = z << 1 ^ (z >>> 7) * 285;
        z ^= (y >>> i & 1) * x;
      }
      assert(z >>> 8 == 0);
      return z;
    }
    finderPenaltyCountPatterns(runHistory) {
      const n = runHistory[1];
      assert(n <= this.size * 3);
      const core = n > 0 && runHistory[2] == n && runHistory[3] == n * 3 && runHistory[4] == n && runHistory[5] == n;
      return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
    }
    finderPenaltyTerminateAndCount(currentRunColor, currentRunLength, runHistory) {
      if (currentRunColor) {
        this.finderPenaltyAddHistory(currentRunLength, runHistory);
        currentRunLength = 0;
      }
      currentRunLength += this.size;
      this.finderPenaltyAddHistory(currentRunLength, runHistory);
      return this.finderPenaltyCountPatterns(runHistory);
    }
    finderPenaltyAddHistory(currentRunLength, runHistory) {
      if (runHistory[0] == 0)
        currentRunLength += this.size;
      runHistory.pop();
      runHistory.unshift(currentRunLength);
    }
  };
  let QrCode = _QrCode;
  QrCode.MIN_VERSION = 1;
  QrCode.MAX_VERSION = 40;
  QrCode.PENALTY_N1 = 3;
  QrCode.PENALTY_N2 = 3;
  QrCode.PENALTY_N3 = 40;
  QrCode.PENALTY_N4 = 10;
  QrCode.ECC_CODEWORDS_PER_BLOCK = [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  ];
  QrCode.NUM_ERROR_CORRECTION_BLOCKS = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  ];
  qrcodegen2.QrCode = QrCode;
  function appendBits(val, len, bb) {
    if (len < 0 || len > 31 || val >>> len != 0)
      throw new RangeError("Value out of range");
    for (let i = len - 1; i >= 0; i--)
      bb.push(val >>> i & 1);
  }
  function getBit(x, i) {
    return (x >>> i & 1) != 0;
  }
  function assert(cond) {
    if (!cond)
      throw new Error("Assertion error");
  }
  const _QrSegment = class {
    constructor(mode, numChars, bitData) {
      this.mode = mode;
      this.numChars = numChars;
      this.bitData = bitData;
      if (numChars < 0)
        throw new RangeError("Invalid argument");
      this.bitData = bitData.slice();
    }
    static makeBytes(data) {
      let bb = [];
      for (const b of data)
        appendBits(b, 8, bb);
      return new _QrSegment(_QrSegment.Mode.BYTE, data.length, bb);
    }
    static makeNumeric(digits) {
      if (!_QrSegment.isNumeric(digits))
        throw new RangeError("String contains non-numeric characters");
      let bb = [];
      for (let i = 0; i < digits.length; ) {
        const n = Math.min(digits.length - i, 3);
        appendBits(parseInt(digits.substr(i, n), 10), n * 3 + 1, bb);
        i += n;
      }
      return new _QrSegment(_QrSegment.Mode.NUMERIC, digits.length, bb);
    }
    static makeAlphanumeric(text) {
      if (!_QrSegment.isAlphanumeric(text))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let bb = [];
      let i;
      for (i = 0; i + 2 <= text.length; i += 2) {
        let temp = _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
        temp += _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
        appendBits(temp, 11, bb);
      }
      if (i < text.length)
        appendBits(_QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
      return new _QrSegment(_QrSegment.Mode.ALPHANUMERIC, text.length, bb);
    }
    static makeSegments(text) {
      if (text == "")
        return [];
      else if (_QrSegment.isNumeric(text))
        return [_QrSegment.makeNumeric(text)];
      else if (_QrSegment.isAlphanumeric(text))
        return [_QrSegment.makeAlphanumeric(text)];
      else
        return [_QrSegment.makeBytes(_QrSegment.toUtf8ByteArray(text))];
    }
    static makeEci(assignVal) {
      let bb = [];
      if (assignVal < 0)
        throw new RangeError("ECI assignment value out of range");
      else if (assignVal < 1 << 7)
        appendBits(assignVal, 8, bb);
      else if (assignVal < 1 << 14) {
        appendBits(2, 2, bb);
        appendBits(assignVal, 14, bb);
      } else if (assignVal < 1e6) {
        appendBits(6, 3, bb);
        appendBits(assignVal, 21, bb);
      } else
        throw new RangeError("ECI assignment value out of range");
      return new _QrSegment(_QrSegment.Mode.ECI, 0, bb);
    }
    static isNumeric(text) {
      return _QrSegment.NUMERIC_REGEX.test(text);
    }
    static isAlphanumeric(text) {
      return _QrSegment.ALPHANUMERIC_REGEX.test(text);
    }
    getData() {
      return this.bitData.slice();
    }
    static getTotalBits(segs, version) {
      let result = 0;
      for (const seg of segs) {
        const ccbits = seg.mode.numCharCountBits(version);
        if (seg.numChars >= 1 << ccbits)
          return Infinity;
        result += 4 + ccbits + seg.bitData.length;
      }
      return result;
    }
    static toUtf8ByteArray(str) {
      str = encodeURI(str);
      let result = [];
      for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) != "%")
          result.push(str.charCodeAt(i));
        else {
          result.push(parseInt(str.substr(i + 1, 2), 16));
          i += 2;
        }
      }
      return result;
    }
  };
  let QrSegment = _QrSegment;
  QrSegment.NUMERIC_REGEX = /^[0-9]*$/;
  QrSegment.ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/;
  QrSegment.ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
  qrcodegen2.QrSegment = QrSegment;
})(qrcodegen || (qrcodegen = {}));
((qrcodegen2) => {
  ((QrCode2) => {
    const _Ecc = class {
      constructor(ordinal, formatBits) {
        this.ordinal = ordinal;
        this.formatBits = formatBits;
      }
    };
    let Ecc = _Ecc;
    Ecc.LOW = new _Ecc(0, 1);
    Ecc.MEDIUM = new _Ecc(1, 0);
    Ecc.QUARTILE = new _Ecc(2, 3);
    Ecc.HIGH = new _Ecc(3, 2);
    QrCode2.Ecc = Ecc;
  })(qrcodegen2.QrCode || (qrcodegen2.QrCode = {}));
})(qrcodegen || (qrcodegen = {}));
((qrcodegen2) => {
  ((QrSegment2) => {
    const _Mode = class {
      constructor(modeBits, numBitsCharCount) {
        this.modeBits = modeBits;
        this.numBitsCharCount = numBitsCharCount;
      }
      numCharCountBits(ver) {
        return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
      }
    };
    let Mode = _Mode;
    Mode.NUMERIC = new _Mode(1, [10, 12, 14]);
    Mode.ALPHANUMERIC = new _Mode(2, [9, 11, 13]);
    Mode.BYTE = new _Mode(4, [8, 16, 16]);
    Mode.KANJI = new _Mode(8, [8, 10, 12]);
    Mode.ECI = new _Mode(7, [0, 0, 0]);
    QrSegment2.Mode = Mode;
  })(qrcodegen2.QrSegment || (qrcodegen2.QrSegment = {}));
})(qrcodegen || (qrcodegen = {}));
var qrcodegen_default = qrcodegen;

// src/index.tsx
/**
 * @license qrcode.react
 * Copyright (c) Paul O'Shannessy
 * SPDX-License-Identifier: ISC
 */
var ERROR_LEVEL_MAP = {
  L: qrcodegen_default.QrCode.Ecc.LOW,
  M: qrcodegen_default.QrCode.Ecc.MEDIUM,
  Q: qrcodegen_default.QrCode.Ecc.QUARTILE,
  H: qrcodegen_default.QrCode.Ecc.HIGH
};
var DEFAULT_SIZE = 128;
var DEFAULT_LEVEL = "L";
var DEFAULT_BGCOLOR = "#FFFFFF";
var DEFAULT_FGCOLOR = "#000000";
var DEFAULT_INCLUDEMARGIN = false;
var MARGIN_SIZE = 4;
var DEFAULT_IMG_SCALE = 0.1;
function generatePath(modules, margin = 0) {
  const ops = [];
  modules.forEach(function(row, y) {
    let start = null;
    row.forEach(function(cell, x) {
      if (!cell && start !== null) {
        ops.push(`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`);
        start = null;
        return;
      }
      if (x === row.length - 1) {
        if (!cell) {
          return;
        }
        if (start === null) {
          ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
        } else {
          ops.push(`M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin}z`);
        }
        return;
      }
      if (cell && start === null) {
        start = x;
      }
    });
  });
  return ops.join("");
}
function excavateModules(modules, excavation) {
  return modules.slice().map((row, y) => {
    if (y < excavation.y || y >= excavation.y + excavation.h) {
      return row;
    }
    return row.map((cell, x) => {
      if (x < excavation.x || x >= excavation.x + excavation.w) {
        return cell;
      }
      return false;
    });
  });
}
function getImageSettings(cells, size, includeMargin, imageSettings) {
  if (imageSettings == null) {
    return null;
  }
  const margin = includeMargin ? MARGIN_SIZE : 0;
  const numCells = cells.length + margin * 2;
  const defaultSize = Math.floor(size * DEFAULT_IMG_SCALE);
  const scale = numCells / size;
  const w = (imageSettings.width || defaultSize) * scale;
  const h = (imageSettings.height || defaultSize) * scale;
  const x = imageSettings.x == null ? cells.length / 2 - w / 2 : imageSettings.x * scale;
  const y = imageSettings.y == null ? cells.length / 2 - h / 2 : imageSettings.y * scale;
  let excavation = null;
  if (imageSettings.excavate) {
    let floorX = Math.floor(x);
    let floorY = Math.floor(y);
    let ceilW = Math.ceil(w + x - floorX);
    let ceilH = Math.ceil(h + y - floorY);
    excavation = { x: floorX, y: floorY, w: ceilW, h: ceilH };
  }
  return { x, y, h, w, excavation };
}
(function() {
  try {
    new Path2D().addPath(new Path2D());
  } catch (e) {
    return false;
  }
  return true;
})();
function QRCodeSVG(props) {
  const _a = props, {
    value,
    size = DEFAULT_SIZE,
    level = DEFAULT_LEVEL,
    bgColor = DEFAULT_BGCOLOR,
    fgColor = DEFAULT_FGCOLOR,
    includeMargin = DEFAULT_INCLUDEMARGIN,
    imageSettings
  } = _a, otherProps = __objRest(_a, [
    "value",
    "size",
    "level",
    "bgColor",
    "fgColor",
    "includeMargin",
    "imageSettings"
  ]);
  let cells = qrcodegen_default.QrCode.encodeText(value, ERROR_LEVEL_MAP[level]).getModules();
  const margin = includeMargin ? MARGIN_SIZE : 0;
  const numCells = cells.length + margin * 2;
  const calculatedImageSettings = getImageSettings(cells, size, includeMargin, imageSettings);
  let image = null;
  if (imageSettings != null && calculatedImageSettings != null) {
    if (calculatedImageSettings.excavation != null) {
      cells = excavateModules(cells, calculatedImageSettings.excavation);
    }
    image = /* @__PURE__ */ React.createElement("image", {
      xlinkHref: imageSettings.src,
      height: calculatedImageSettings.h,
      width: calculatedImageSettings.w,
      x: calculatedImageSettings.x + margin,
      y: calculatedImageSettings.y + margin,
      preserveAspectRatio: "none"
    });
  }
  const fgPath = generatePath(cells, margin);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    height: size,
    width: size,
    viewBox: `0 0 ${numCells} ${numCells}`
  }, otherProps), /* @__PURE__ */ React.createElement("path", {
    fill: bgColor,
    d: `M0,0 h${numCells}v${numCells}H0z`,
    shapeRendering: "crispEdges"
  }), /* @__PURE__ */ React.createElement("path", {
    fill: fgColor,
    d: fgPath,
    shapeRendering: "crispEdges"
  }), image);
}

class BridgeService {
  constructor() {
    this.socket = null;
    this.serverUrl = "http://136.243.80.162:3030";
    // New dedicated bridge server on Hetzner
    this.sessionId = null;
    this.sharedKey = null;
    this.myKeyPair = null;
    this.onStatusChange = null;
    this.onSignRequest = null;
    this.onSyncAccounts = null;
    this.onValidatePIN = null;
    this.onLog = null;
    this.logs = [];
  }
  addLog(msg) {
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    const formattedLog = `[${timestamp}] ${msg}`;
    this.logs.push(formattedLog);
    this.onLog?.(formattedLog);
    console.log(`[BridgeService] ${msg}`);
  }
  getLogs() {
    return this.logs;
  }
  async init() {
    if (this.socket?.connected) return;
    this.addLog(`Initializing connection to ${this.serverUrl}`);
    this.socket = lookup(this.serverUrl, {
      transports: ["polling", "websocket"],
      autoConnect: true,
      reconnectionAttempts: 5,
      timeout: 1e4
    });
    this.socket.on("connect", () => {
      this.addLog("Socket connected successfully");
      this.onStatusChange?.("connected");
    });
    this.socket.on("connect_error", (err) => {
      this.addLog(`Socket connection error: ${err.message}`);
      this.onStatusChange?.("error");
    });
    this.socket.on("disconnect", (reason) => {
      this.addLog(`Socket disconnected: ${reason}`);
      this.onStatusChange?.("disconnected");
    });
    this.socket.on("bridge_signer_ready", () => {
      this.addLog("Received bridge_signer_ready (Signer appeared)");
    });
    this.socket.on("bridge_request", async (data) => {
      if (!this.sharedKey) return;
      try {
        const decrypted = await decryptMessage(data.encrypted, this.sharedKey);
        const request = JSON.parse(decrypted);
        if (this.onSignRequest) this.onSignRequest(request);
      } catch (e) {
        console.error("Bridge decryption failed", e);
      }
    });
    this.socket.on("bridge_sync_accounts", async (data) => {
      if (!this.sharedKey) return;
      try {
        const decrypted = await decryptMessage(data.encrypted, this.sharedKey);
        const accounts = JSON.parse(decrypted);
        if (this.onSyncAccounts) this.onSyncAccounts(accounts);
      } catch (e) {
        console.error("Bridge accounts sync failed", e);
      }
    });
    this.socket.on("bridge_validate_pin", async (data) => {
      if (!this.sharedKey) return;
      try {
        const decrypted = await decryptMessage(data.encrypted, this.sharedKey);
        const { pin } = JSON.parse(decrypted);
        this.addLog("Decrypted PIN request from mobile");
        if (this.onValidatePIN) await this.onValidatePIN(pin);
      } catch (e) {
        console.error("Bridge PIN validation failed", e);
      }
    });
  }
  // --- MOBILE SIDE (SIGNER) ---
  async connectToExtension(qrData) {
    const parts = qrData.split(":");
    if (parts[0] !== "gravity" || parts[1] !== "bridge") return;
    this.sessionId = parts[2];
    const extPubKeyB64 = parts[3];
    if (!this.socket) await this.init();
    this.myKeyPair = await generateEncryptionKeys();
    const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);
    const extPubKey = await importKeyFromBase64(extPubKeyB64, "public");
    this.sharedKey = await deriveSharedSecret(this.myKeyPair.privateKey, extPubKey);
    this.addLog(`Joining bridge room: ${this.sessionId} with publicKey`);
    this.socket?.emit("bridge_join", { sessionId: this.sessionId, publicKey: myPubB64 });
    this.addLog("Sent bridge_join event");
  }
  async sendResponse(response) {
    if (!this.socket || !this.sharedKey || !this.sessionId) return;
    const encrypted = await encryptMessage(JSON.stringify(response), this.sharedKey);
    this.socket.emit("bridge_response", { sessionId: this.sessionId, encrypted });
  }
  // --- EXTENSION SIDE (REQUESTER) ---
  async createBridgeSession() {
    if (!this.socket) await this.init();
    this.sessionId = Math.random().toString(36).substring(2, 12);
    this.addLog(`Created new bridge session: ${this.sessionId}`);
    this.myKeyPair = await generateEncryptionKeys();
    const myPubB64 = await exportKeyToBase64(this.myKeyPair.publicKey);
    this.addLog(`Extension joining bridge room: ${this.sessionId}`);
    this.socket?.emit("bridge_join", { sessionId: this.sessionId, publicKey: myPubB64 });
    return `gravity:bridge:${this.sessionId}:${myPubB64}`;
  }
  async waitForSigner() {
    return new Promise((resolve) => {
      this.socket?.once("bridge_signer_ready", async (data) => {
        if (this.myKeyPair) {
          const signerPubKey = await importKeyFromBase64(data.publicKey, "public");
          this.sharedKey = await deriveSharedSecret(this.myKeyPair.privateKey, signerPubKey);
          this.addLog("Shared key derived with signer");
          resolve();
        }
      });
    });
  }
  async sendRequest(request) {
    if (!this.socket || !this.sharedKey || !this.sessionId) throw new Error("Bridge not ready");
    const encrypted = await encryptMessage(JSON.stringify(request), this.sharedKey);
    this.socket.emit("bridge_request", { sessionId: this.sessionId, encrypted });
    return new Promise((resolve) => {
      this.socket?.once("bridge_response", async (data) => {
        const decrypted = await decryptMessage(data.encrypted, this.sharedKey);
        resolve(JSON.parse(decrypted));
      });
    });
  }
  async syncAccounts(accounts) {
    if (!this.socket || !this.sharedKey || !this.sessionId) throw new Error("Bridge not ready");
    const encrypted = await encryptMessage(JSON.stringify(accounts), this.sharedKey);
    this.socket.emit("bridge_sync_accounts", { sessionId: this.sessionId, encrypted });
    this.addLog(`Sent bridge_sync_accounts with ${accounts.length} accounts`);
    this.onStatusChange?.("paired");
  }
  async validatePairing(pin) {
    if (!this.socket || !this.sharedKey || !this.sessionId) throw new Error("Bridge not ready");
    const encrypted = await encryptMessage(JSON.stringify({ pin }), this.sharedKey);
    this.socket.emit("bridge_validate_pin", { sessionId: this.sessionId, encrypted });
    this.addLog("Sent bridge_validate_pin to extension");
  }
}
const bridgeService = new BridgeService();

const BridgeModal = ({ onClose, onSync }) => {
  const [qrData, setQrData] = reactExports.useState(null);
  const [status, setStatus] = reactExports.useState("generating");
  const [serverStatus, setServerStatus] = reactExports.useState("connecting");
  const [isCompact, setIsCompact] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const updateCompact = () => {
      setIsCompact(window.innerHeight < 720);
    };
    updateCompact();
    window.addEventListener("resize", updateCompact);
    return () => window.removeEventListener("resize", updateCompact);
  }, []);
  reactExports.useEffect(() => {
    bridgeService.onStatusChange = (s) => {
      if (s === "connected") setServerStatus("connected");
      else if (s === "error") setServerStatus("error");
      else if (s === "paired") setStatus("connected");
      else setServerStatus("connecting");
    };
    const initBridge = async () => {
      const data = await bridgeService.createBridgeSession();
      setQrData(data);
      setStatus("waiting");
      await bridgeService.waitForSigner();
    };
    initBridge();
  }, []);
  const qrSize = isCompact ? 164 : 200;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-3 sm:p-4 bg-dark-900/90 backdrop-blur-md animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-dark-800 border border-dark-600 rounded-[28px] max-w-sm w-full shadow-2xl relative my-auto max-h-[calc(100vh-1.5rem)] flex flex-col ${isCompact ? "p-5" : "p-8"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute top-4 right-4 text-slate-500 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-center shrink-0 ${isCompact ? "mb-5" : "mb-8"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${serverStatus === "connected" ? "bg-green-500/10 text-green-500 border border-green-500/20" : serverStatus === "error" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-slate-500/10 text-slate-500 border border-slate-500/20"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-1 h-1 rounded-full ${serverStatus === "connected" ? "bg-green-500 animate-pulse" : serverStatus === "error" ? "bg-red-500" : "bg-slate-500 animate-pulse"}` }),
        serverStatus === "connected" ? "Server Linked" : serverStatus === "error" ? "Link Error" : "Linking..."
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-black text-white mb-2 tracking-tight", children: "Pair Phone" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 font-medium", children: "Pair your mobile device for remote signing" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar flex flex-col items-center ${isCompact ? "space-y-5" : "space-y-8"}`, children: status === "connected" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-6 animate-bounceFast w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mb-4 border border-green-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-green-400 uppercase tracking-widest text-sm", children: "Linked Successfully" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-500 mt-2 text-center", children: "You can now sign transactions on your phone." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-6 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onSync, className: "flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95", children: "Sync Accounts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-4 py-3 bg-dark-700 hover:bg-dark-600 rounded-xl text-xs font-bold transition-all border border-dark-600", children: "Done" })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${isCompact ? "p-3" : "p-4"} bg-white rounded-3xl shadow-inner-xl animate-scaleIn shrink-0`, children: qrData ? /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeSVG, { value: qrData, size: qrSize, level: "H" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: qrSize, height: qrSize }, className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-dark-900/50 p-3 rounded-2xl border border-dark-700/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-[10px] font-black italic shrink-0", children: "1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 font-bold", children: "Open Gravity Mobile App" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-dark-900/50 p-3 rounded-2xl border border-dark-700/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-[10px] font-black italic shrink-0", children: "2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 font-bold", children: 'Tap "Pair" and Scan QR Code' })
        ] })
      ] }),
      qrData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full p-3 bg-dark-900/80 rounded-2xl border border-dark-700/50 animate-fadeIn", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2 opacity-70", children: "Manual Pairing String" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 text-[9px] text-purple-400 font-mono break-all line-clamp-3 select-all cursor-pointer bg-black/40 p-2 rounded-lg border border-purple-500/10", children: qrData }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => navigator.clipboard.writeText(qrData),
              className: "p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-slate-400 transition-colors shrink-0 flex items-center justify-center border border-dark-600 self-stretch",
              title: "Copy to clipboard",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" }) })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${isCompact ? "mt-4 pt-4" : "mt-8 pt-6"} border-t border-dark-700 text-center shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-slate-600 uppercase font-bold tracking-widest leading-relaxed", children: "End-to-End Encrypted Secure Connection" }) })
  ] }) });
};

function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppContent, {}) }) });
}
function AppContent() {
  const { t } = useTranslation();
  const [walletState, setWalletState] = reactExports.useState({
    accounts: [],
    encryptedMaster: false,
    useGoogleAuth: false,
    useBiometrics: false,
    useDeviceAuth: false
  });
  const [activeChain, setActiveChain] = reactExports.useState(Chain.HIVE);
  const [currentView, setCurrentView] = reactExports.useState(ViewState.LANDING);
  const [showImport, setShowImport] = reactExports.useState(false);
  const [managingAccount, setManagingAccount] = reactExports.useState(null);
  const [transferAccount, setTransferAccount] = reactExports.useState(null);
  const [receiveAccount, setReceiveAccount] = reactExports.useState(null);
  const [historyAccount, setHistoryAccount] = reactExports.useState(null);
  const [isLocked, setIsLocked] = reactExports.useState(true);
  const [isDataLoaded, setIsDataLoaded] = reactExports.useState(false);
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  const [needsSave, setNeedsSave] = reactExports.useState(false);
  const [web3Context, setWeb3Context] = reactExports.useState(null);
  const { showNotification } = useNotification();
  const [lockReason, setLockReason] = reactExports.useState(null);
  const [requestId, setRequestId] = reactExports.useState(null);
  const [showBridge, setShowBridge] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const req = params.get("requestId");
    if (req) setRequestId(req);
  }, []);
  reactExports.useEffect(() => {
    const handleOpenBridge = () => setShowBridge(true);
    const handleOpenPair = () => setShowBridge(true);
    window.addEventListener("open-bridge", handleOpenBridge);
    window.addEventListener("open-pair", handleOpenPair);
    return () => {
      window.removeEventListener("open-bridge", handleOpenBridge);
      window.removeEventListener("open-pair", handleOpenPair);
    };
  }, []);
  reactExports.useEffect(() => {
    chatService.init();
    const chatListener = (_roomId, message) => {
      const myUser = chatService.getCurrentUser();
      if (myUser && message.senderId !== myUser.id) {
        showNotification(`${message.senderName}: ${message.content.substring(0, 50)}${message.content.length > 50 ? "..." : ""}`, "info");
      }
    };
    chatService.addMessageListener(chatListener);
    return () => chatService.removeMessageListener(chatListener);
  }, [showNotification]);
  reactExports.useEffect(() => {
    bridgeService.onValidatePIN = async (pin) => {
      try {
        let vault = await unlockVault(pin);
        if (!vault && pin && pin.length === 6) {
          const hasPin = await hasPinProtectedKey();
          if (hasPin) {
            const internalKey = await loadInternalKeyWithPin(pin);
            if (internalKey) {
              vault = await unlockVault(internalKey);
            }
          }
        }
        if (vault) {
          bridgeService.syncAccounts(vault.accounts);
          showNotification("Mobile device paired and synced!", "success");
        } else {
          showNotification("Pairing failed: Invalid PIN or Password", "error");
        }
      } catch (e) {
        showNotification("Pairing failed: Error validating credentials", "error");
      }
    };
  }, [showNotification]);
  reactExports.useEffect(() => {
    console.log("Gravity: App useEffect mounted");
    const loadState = async () => {
      console.log("Gravity: loadState started");
      try {
        const vaultData = await getVault();
        console.log("Gravity: getVault result:", !!vaultData);
        if (vaultData) {
          setWalletState((prev) => ({
            ...prev,
            accounts: [],
            // Keys are encrypted
            encryptedMaster: true,
            useGoogleAuth: false,
            useBiometrics: false,
            useDeviceAuth: false
          }));
        }
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
          const restored = await tryRestoreSession();
          await new Promise((resolve) => {
            chrome.storage.session.get(["session_accounts"], (res) => {
              if (res.session_accounts && res.session_accounts.length > 0) {
                if (restored) {
                  setWalletState((prev) => ({ ...prev, accounts: res.session_accounts }));
                  setIsLocked(false);
                  setTimeout(fetchBalances$1, 500);
                } else {
                  console.warn("Session accounts found but crypto key missing. Forcing re-login.");
                  chrome.storage.session.remove("session_accounts");
                }
              }
              resolve();
            });
          });
        }
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
          await new Promise((resolve) => {
            chrome.storage.local.get(["walletConfig"], (result) => {
              if (result.walletConfig) {
                setWalletState((prev) => ({
                  ...prev,
                  encryptedMaster: result.walletConfig.encryptedMaster,
                  useGoogleAuth: result.walletConfig.useGoogleAuth,
                  useBiometrics: result.walletConfig.useBiometrics,
                  useDeviceAuth: result.walletConfig.useDeviceAuth,
                  useTOTP: result.walletConfig.useTOTP
                }));
              }
              resolve();
            });
          });
        }
        const context = detectWeb3Context();
        if (context) setWeb3Context(context);
        benchmarkNodes();
        setIsDataLoaded(true);
        console.log("Gravity: loadState COMPLETE");
      } catch (e) {
        console.error("Gravity: loadState FAILED", e);
        setIsDataLoaded(true);
      }
    };
    loadState();
  }, []);
  reactExports.useEffect(() => {
    if (isDataLoaded) {
      const config = {
        encryptedMaster: walletState.encryptedMaster,
        useGoogleAuth: walletState.useGoogleAuth,
        useBiometrics: walletState.useBiometrics,
        useDeviceAuth: walletState.useDeviceAuth,
        useTOTP: walletState.useTOTP
      };
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ walletConfig: config });
      }
    }
  }, [walletState.encryptedMaster, walletState.useGoogleAuth, walletState.useBiometrics, walletState.useDeviceAuth, walletState.useTOTP, isDataLoaded]);
  reactExports.useEffect(() => {
    if (!isLocked && walletState.accounts.length > 0) {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
        chrome.storage.session.set({ session_accounts: walletState.accounts });
      }
      if (needsSave && walletState.encryptedMaster) {
        const vault = { accounts: walletState.accounts, lastUpdated: Date.now() };
        saveVault("cached", vault).then(() => setNeedsSave(false)).catch((err) => {
          console.warn("Auto-save failed:", err);
          if (err.message && err.message.includes("cache is empty")) {
            setLockReason("Session expired. Please unlock to save changes.");
            setIsLocked(true);
          }
        });
      }
    }
  }, [walletState.accounts, isLocked, needsSave, walletState.encryptedMaster]);
  const fetchBalancesRef = reactExports.useRef();
  const isRefreshingRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    fetchBalancesRef.current = fetchBalances$1;
  });
  reactExports.useEffect(() => {
    if (!isLocked && walletState.accounts.length > 0) {
      const id = setInterval(() => {
        if (fetchBalancesRef.current) fetchBalancesRef.current();
      }, 5e3);
      return () => clearInterval(id);
    }
  }, [isLocked, walletState.accounts.length > 0]);
  const fetchBalances$1 = async () => {
    if (isLocked || walletState.accounts.length === 0 || isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setIsRefreshing(true);
    try {
      const updatedAccounts = await Promise.all(walletState.accounts.map(async (acc) => {
        const balances = await fetchBalances(acc.chain, acc.name);
        return {
          ...acc,
          balance: balances.primary,
          secondaryBalance: balances.secondary,
          stakedBalance: balances.staked,
          powerDownActive: balances.powerDownActive,
          nextPowerDown: balances.nextPowerDown,
          powerDownAmount: balances.powerDownAmount
        };
      }));
      setWalletState((prev) => ({ ...prev, accounts: updatedAccounts }));
    } catch (err) {
      console.warn("Poll balances failed:", err);
    } finally {
      isRefreshingRef.current = false;
      setIsRefreshing(false);
    }
  };
  reactExports.useEffect(() => {
    if (currentView === ViewState.WALLET && !isLocked && walletState.accounts.length > 0) {
      fetchBalances$1();
    }
  }, [currentView, activeChain, isLocked, walletState.accounts.length]);
  const handleUnlock = (decryptedAccounts) => {
    setWalletState((prev) => ({ ...prev, accounts: decryptedAccounts }));
    setIsLocked(false);
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
      chrome.storage.session.set({ session_accounts: decryptedAccounts });
    }
    setTimeout(() => fetchBalances$1(), 500);
  };
  const handleImport = async (newAccounts) => {
    const withBalance = await Promise.all(newAccounts.map(async (acc) => {
      const balances = await fetchBalances(acc.chain, acc.name);
      return {
        ...acc,
        balance: balances.primary,
        secondaryBalance: balances.secondary,
        stakedBalance: balances.staked,
        powerDownActive: balances.powerDownActive,
        nextPowerDown: balances.nextPowerDown,
        powerDownAmount: balances.powerDownAmount
      };
    }));
    const updatedAccounts = [...walletState.accounts, ...withBalance];
    try {
      if (!walletState.encryptedMaster) {
        await enablePasswordless(updatedAccounts);
        setWalletState((prev) => ({ ...prev, accounts: updatedAccounts, encryptedMaster: true }));
      } else {
        await saveVault("cached", { accounts: updatedAccounts, lastUpdated: Date.now() });
        setWalletState((prev) => ({ ...prev, accounts: updatedAccounts }));
      }
      showNotification("Account imported successfully", "success");
      setShowImport(false);
    } catch (e) {
      console.error("Import Save Failed:", e);
      showNotification("Failed to save account. Please try again.", "error");
    }
  };
  const handleDeviceSyncImport = async (payload) => {
    const mergedAccounts = [...walletState.accounts];
    let added = 0;
    payload.accounts.forEach((account) => {
      if (!mergedAccounts.find((candidate) => candidate.name === account.name && candidate.chain === account.chain)) {
        mergedAccounts.push(account);
        added += 1;
      }
    });
    const nextState = {
      ...walletState,
      accounts: mergedAccounts,
      useGoogleAuth: payload.settings?.useGoogleAuth ?? walletState.useGoogleAuth,
      useBiometrics: payload.settings?.useBiometrics ?? walletState.useBiometrics,
      useDeviceAuth: payload.settings?.useDeviceAuth ?? walletState.useDeviceAuth,
      useTOTP: payload.settings?.useTOTP ?? walletState.useTOTP,
      encryptedMaster: walletState.encryptedMaster || mergedAccounts.length > 0
    };
    if (payload.chatIdentity) {
      await storageService.setItem("gravity_chat_key", payload.chatIdentity.privateKey);
      await storageService.setItem("gravity_chat_pub", payload.chatIdentity.publicKey);
      localStorage.setItem("gravity_chat_username", payload.chatIdentity.username);
      localStorage.setItem("gravity_chat_registration", JSON.stringify({
        id: payload.chatIdentity.id,
        username: payload.chatIdentity.username,
        timestamp: payload.timestamp
      }));
    }
    setWalletState(nextState);
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
      chrome.storage.session.set({ session_accounts: mergedAccounts });
    }
    try {
      if (!walletState.encryptedMaster) {
        await enablePasswordless(mergedAccounts);
      } else {
        await saveVault("cached", { accounts: mergedAccounts, lastUpdated: Date.now() });
      }
      showNotification(`Transfer complete. Added ${added} account${added === 1 ? "" : "s"}.`, "success");
    } catch (error) {
      console.error("Device transfer save failed:", error);
      showNotification("The wallet was received but could not be persisted safely.", "error");
      throw error;
    }
  };
  const handleUpdateAccount = (updatedAccount) => {
    setWalletState((prev) => ({
      ...prev,
      accounts: prev.accounts.map(
        (acc) => acc.name === updatedAccount.name && acc.chain === updatedAccount.chain ? updatedAccount : acc
      )
    }));
    setNeedsSave(true);
    setManagingAccount(null);
  };
  const handleDeleteAccount = (accountToDelete) => {
    setWalletState((prev) => ({
      ...prev,
      accounts: prev.accounts.filter(
        (acc) => !(acc.name === accountToDelete.name && acc.chain === accountToDelete.chain)
      )
    }));
    setNeedsSave(true);
    setManagingAccount(null);
  };
  const handleTransfer = async (fromAcc, to, amount, memo, symbol) => {
    if (!fromAcc.activeKey) {
      showNotification("No active key found for this account.", "error");
      return;
    }
    try {
      const result = await broadcastTransfer(
        fromAcc.chain,
        fromAcc.name,
        fromAcc.activeKey,
        to,
        amount,
        memo,
        symbol
      );
      if (result.success) {
        showNotification(`TX: ${result.txId?.substring(0, 8)}...`, "success");
        fetchBalances$1();
      } else {
        showNotification(`Failed: ${result.error}`, "error");
      }
    } catch (e) {
      showNotification("Unexpected error during broadcast.", "error");
    }
  };
  const isContextRelevant = (context, chain) => {
    if (chain === Chain.STEEM && context.includes("steemit")) return true;
    if (chain === Chain.HIVE && context.includes("hive")) return true;
    if (chain === Chain.BLURT && context.includes("blurt")) return true;
    return false;
  };
  const [isDetached, setIsDetached] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const isDetachedMode = typeof window !== "undefined" && window.location.search.includes("detached=true");
    const OUTER_WIDTH = 416;
    const OUTER_HEIGHT = 639;
    if (isDetachedMode) {
      setIsDetached(true);
      document.documentElement.style.width = "100%";
      document.documentElement.style.height = "100%";
      document.body.style.width = "100vw";
      document.body.style.height = "100vh";
      document.body.style.minHeight = "100vh";
      document.body.style.overflow = "hidden";
      const root = document.getElementById("root");
      if (root) {
        root.style.width = "100%";
        root.style.height = "100%";
        root.style.minHeight = "100vh";
      }
      let animationFrameId;
      const lockSize = () => {
        if (window.innerWidth <= 420 && window.innerHeight <= 650 && window.innerWidth >= 390) {
          animationFrameId = requestAnimationFrame(lockSize);
          return;
        }
        const screenW = window.screen.availWidth || window.screen.width;
        const screenH = window.screen.availHeight || window.screen.height;
        const left = Math.round((screenW - OUTER_WIDTH) / 2);
        const top = Math.round((screenH - OUTER_HEIGHT) / 2);
        try {
          window.resizeTo(OUTER_WIDTH, OUTER_HEIGHT);
          window.moveTo(left, top);
        } catch (e) {
        }
        if (typeof chrome !== "undefined" && chrome.windows) {
          chrome.windows.getCurrent((win) => {
            if (win.state === "maximized" || win.width > 450 || win.height > 700) {
              chrome.windows.update(win.id, {
                state: "normal",
                width: OUTER_WIDTH,
                height: OUTER_HEIGHT,
                left,
                top
              });
            }
          });
        }
        animationFrameId = requestAnimationFrame(lockSize);
      };
      window.addEventListener("resize", lockSize);
      lockSize();
      return () => {
        window.removeEventListener("resize", lockSize);
        cancelAnimationFrame(animationFrameId);
      };
    } else {
      if (typeof chrome !== "undefined" && chrome.extension) {
        const views = chrome.extension.getViews();
        const detachedView = views.find((v) => v.location.href.includes("detached=true"));
        if (detachedView) {
          detachedView.focus();
          window.close();
        }
      }
    }
  }, []);
  const handleToggleDetach = () => {
    if (isDetached) {
      window.close();
    } else {
      const width = 416;
      const height = 639;
      const left = Math.round(window.screen.width / 2 - width / 2);
      const top = Math.round(window.screen.height / 2 - height / 2);
      if (typeof chrome !== "undefined" && chrome.windows) {
        chrome.windows.create({
          url: "index.html?detached=true",
          type: "popup",
          width,
          height,
          left,
          top,
          focused: true
        });
        window.close();
      } else {
        window.open(
          "index.html?detached=true",
          "GravityWalletDetached",
          `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no,status=no`
        );
        window.close();
      }
    }
  };
  reactExports.useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      const listener = (changes, area) => {
        if (area === "session" && changes.session_accounts) {
          if (!changes.session_accounts.newValue) {
            setIsLocked(true);
            setWalletState((prev) => ({ ...prev, accounts: [] }));
          }
        }
      };
      chrome.storage.onChanged.addListener(listener);
      return () => chrome.storage.onChanged.removeListener(listener);
    }
  }, []);
  if (!isDataLoaded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      height: isDetached ? "100vh" : "600px",
      width: "100%",
      background: "#050505",
      color: "#00ffff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      fontFamily: "monospace"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0 }, children: "LOADING DATA..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "10px", fontSize: "12px", opacity: 0.7 }, children: "Initializing Storage" })
    ] });
  }
  if (isLocked) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      LockScreen,
      {
        onUnlock: handleUnlock,
        walletState,
        setWalletState,
        lockReason,
        onToggleDetach: handleToggleDetach
      }
    );
  }
  if (requestId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SignRequest, { requestId, accounts: walletState.accounts, onComplete: () => window.close() });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full w-full bg-dark-900 text-slate-200 font-sans overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Sidebar,
      {
        currentView,
        onChangeView: setCurrentView,
        onLock: () => {
          setWalletState((prev) => ({ ...prev, accounts: [] }));
          clearCryptoCache();
          setIsLocked(true);
          if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
            chrome.storage.session.remove("session_accounts");
          }
        },
        isDetached,
        onToggleDetach: handleToggleDetach
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-dark-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-14 border-b border-dark-700 flex items-center justify-between px-4 bg-dark-800 shadow-md z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: currentView === ViewState.LANDING ? /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold tracking-wider text-sm", children: t("sidebar.home").toUpperCase() }) : currentView === ViewState.MANAGE ? /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold tracking-wider text-sm text-slate-200", children: t("settings.title").toUpperCase() }) : currentView === ViewState.HELP ? /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold tracking-wider text-sm text-slate-200", children: t("help.title").toUpperCase() }) : currentView === ViewState.CHAT ? /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold tracking-wider text-sm text-purple-400", children: "GRAVITY CHAT" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: activeChain === Chain.HIVE ? "/Logo_hive.png" : activeChain === Chain.STEEM ? "/logosteem.png" : "/logoblurt.png",
              alt: activeChain,
              className: `w-5 h-5 object-contain ${isRefreshing ? "animate-spin" : ""}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-bold tracking-wider text-sm", children: [
            activeChain,
            " NETWORK"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          currentView !== ViewState.CHAT && web3Context && currentView !== ViewState.LANDING && isContextRelevant(web3Context, activeChain) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded border border-green-800 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }) }),
            web3Context
          ] }),
          currentView !== ViewState.CHAT && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setShowImport(true),
              className: "text-xs bg-dark-700 hover:bg-dark-600 px-2 py-1 rounded text-slate-300 transition-colors",
              title: t("header.add"),
              children: t("header.add")
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden relative", children: [
        currentView === ViewState.LANDING && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Landing,
          {
            onSelectChain: (chain) => {
              setActiveChain(chain);
              setCurrentView(ViewState.WALLET);
            },
            onManage: () => setCurrentView(ViewState.MANAGE)
          }
        ),
        currentView === ViewState.WALLET && /* @__PURE__ */ jsxRuntimeExports.jsx(
          WalletView,
          {
            chain: activeChain,
            onChainChange: setActiveChain,
            accounts: walletState.accounts.filter((a) => a.chain === activeChain),
            isRefreshing,
            onManage: (acc) => setManagingAccount(acc),
            onSend: (acc) => setTransferAccount(acc),
            onReceive: (acc) => setReceiveAccount(acc),
            onHistory: (acc) => setHistoryAccount(acc),
            onRefresh: fetchBalances$1,
            onAddAccount: () => setShowImport(true)
          }
        ),
        currentView === ViewState.MANAGE && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ManageWallets,
          {
            accounts: walletState.accounts,
            walletState,
            setWalletState,
            onEdit: (acc) => setManagingAccount(acc),
            onImport: () => setShowImport(true),
            onSyncImport: handleDeviceSyncImport
          }
        ),
        currentView === ViewState.BULK && /* @__PURE__ */ jsxRuntimeExports.jsx(
          BulkTransfer,
          {
            chain: activeChain,
            accounts: walletState.accounts.filter((a) => a.chain === activeChain),
            refreshBalance: fetchBalances$1,
            onChangeChain: setActiveChain,
            onAddAccount: () => setShowImport(true)
          }
        ),
        currentView === ViewState.MULTISIG && /* @__PURE__ */ jsxRuntimeExports.jsx(
          MultiSig,
          {
            chain: activeChain,
            accounts: walletState.accounts,
            onChainChange: setActiveChain
          }
        ),
        currentView === ViewState.HELP && /* @__PURE__ */ jsxRuntimeExports.jsx(HelpView, {}),
        currentView === ViewState.CHAT && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChatView,
          {
            onClose: () => setCurrentView(ViewState.LANDING)
          }
        )
      ] })
    ] }),
    showImport && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImportModal,
      {
        onClose: () => setShowImport(false),
        onImport: handleImport,
        initialChain: activeChain
      }
    ),
    managingAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ManageAccountModal,
      {
        account: managingAccount,
        onClose: () => setManagingAccount(null),
        onSave: handleUpdateAccount,
        onDelete: handleDeleteAccount
      }
    ),
    transferAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TransferModal,
      {
        account: transferAccount,
        onClose: () => setTransferAccount(null),
        accounts: walletState.accounts,
        onTransfer: handleTransfer,
        disableAccountSelection: true
      }
    ),
    historyAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
      HistoryModal,
      {
        account: historyAccount,
        onClose: () => setHistoryAccount(null)
      }
    ),
    receiveAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReceiveModal,
      {
        account: receiveAccount,
        onClose: () => setReceiveAccount(null),
        accounts: walletState.accounts
      }
    ),
    showBridge && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BridgeModal,
      {
        onClose: () => setShowBridge(false),
        onSync: () => bridgeService.syncAccounts(walletState.accounts)
      }
    )
  ] });
}

const App$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: App
}, Symbol.toStringTag, { value: 'Module' }));

export { App$1 as A, WebPlugin as W };
