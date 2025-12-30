import './src/polyfills';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../packages/shared/styles/global.css';

// 2. Initialize Root
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);

// 3. Dynamic Import of App
// This guarantees that 'dhive' (inside App) is not loaded until
// AFTER lines 1-13 have fully executed.
// Native DOM loader to verify rendering capability
console.log("Gravity: Initializing native loader...");
const loader = document.createElement('div');
loader.id = 'gravity-loader';
loader.innerHTML = '<div><h2>INITIALIZING GRAVITY...</h2><p style="font-size:12px;opacity:0.7">Core systems loading</p></div>';
loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#0ff;display:flex;justify-content:center;align-items:center;z-index:99999;font-family:monospace;text-align:center;';
document.body.appendChild(loader);

// 3. Dynamic Import of App
console.log("Gravity: Requesting App module...");
import('./App').then(({ default: App }) => {
  console.log("Gravity: App module resolved. Unmounting loader and starting React.");
  const l = document.getElementById('gravity-loader');
  if (l) l.remove();

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(err => {
  console.error("CRITICAL: Failed to load App", err);
  if (loader) {
    loader.style.background = '#200';
    loader.style.color = '#f55';
    loader.innerHTML = `<div style="padding:20px">
      <h3>BOOT FAILED</h3>
      <pre style="text-align:left;background:#411;padding:10px;overflow:auto;max-width:100%;">${err?.message || String(err)}</pre>
      </div>`;
  }
});
