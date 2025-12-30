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
// Render Loading state immediately
console.log("Gravity: Inside Index.tsx - Render Start");
root.render(
  <div style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', color: '#fff' }}>
    <h3>Loading Gravity...</h3>
  </div>
);

// 3. Dynamic Import of App
import('./App').then(({ default: App }) => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(err => {
  console.error("CRITICAL: Failed to load App", err);
  document.body.innerHTML = `<div style="padding:20px; color:red; font-family:sans-serif;">
      <h1>Critical Error</h1>
      <p>Failed to load application.</p>
      <pre style="background:#333; color:#f88; padding:10px; overflow:auto;">${err?.message || String(err)}</pre>
      <p>Please check console for details.</p>
    </div>`;
});
