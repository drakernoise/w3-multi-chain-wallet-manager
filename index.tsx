// import './src/polyfills'; // Removed manual polyfill import
import React from 'react';
import ReactDOM from 'react-dom/client';
import './src/index.css';

// 2. Initialize Root
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);

// 3. Dynamic Import of App
// This guarantees that 'dhive' (inside App) is not loaded until
// AFTER lines 1-13 have fully executed.
import('./App').then(({ default: App }) => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
