// Background Service Worker Loader
// This script runs BEFORE the main bundle to inject necessary polyfills for MV3 environment.

// 1. Polyfill 'window' (required by many browser-compatible libs like dhive/blurtjs)
if (typeof self.window === 'undefined') {
    self.window = self;
}

// 2. Polyfill 'global' (required by Node buffers/streams in browser)
if (typeof self.global === 'undefined') {
    self.global = self;
}

// 3. Polyfill 'process' (basic env)
if (typeof self.process === 'undefined') {
    self.process = {
        env: { NODE_ENV: 'production' },
        version: '',
        nextTick: (cb) => setTimeout(cb, 0)
    };
}

console.log("Gravity: Global polyfills injected. Loading main background...");

// 4. Load the actual background logic (Vite output)
// We use dynamic import to ensure polyfills are active before modules resolve.
try {
    import("./assets/background.js");
} catch (e) {
    console.error("Gravity: Critical Error loading background.js", e);
}
