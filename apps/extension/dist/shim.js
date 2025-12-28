// Polyfill for legacy libraries (blurtjs, dsteem)
window.global = window;
window.process = { env: { NODE_DEBUG: false, NODE_ENV: 'production' }, version: '' };
window.Buffer = window.Buffer || [];

// Fix 'module is not defined' or 'exports' errors
window.exports = window.exports || {};
window.module = window.module || { exports: window.exports };

// Fix 'Illegal invocation' for libraries using unbounded fetch (dhive, blurtjs)
if (window.fetch) {
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
        return originalFetch.call(window, url, options);
    };
}
