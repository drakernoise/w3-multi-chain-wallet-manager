import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'
import { fileURLToPath } from 'url'

// robust way to get current directory in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      exclude: ['vm', 'console'], // Avoid vm (eval) and console overrides
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  base: './',
  resolve: {
    alias: {
      // Force 'regenerator-runtime' to use our empty shim file
      // This prevents the "unsafe-eval" error in Chrome Extensions
      'regenerator-runtime/runtime': path.resolve(__dirname, 'src/regenerator-shim.js'),
      'regenerator-runtime': path.resolve(__dirname, 'src/regenerator-shim.js'),
      // Force 'dhive' and 'dsteem' to use the unbundled browser entry point
      // allowing Vite to process them and apply the regenerator shim
      '@hiveio/dhive': path.resolve(__dirname, 'node_modules/@hiveio/dhive/lib/index-browser.js'),
      'dsteem': path.resolve(__dirname, 'node_modules/dsteem/lib/index-browser.js'),
      'vm': path.resolve(__dirname, 'src/empty-module.js'),
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2500,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        main: 'index.html',
        background: 'src/background/index.ts',
        content: 'src/content/index.ts',
        provider: 'src/content/provider.ts'
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks: (id) => {
          // Separate vendor libs
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Separate services (shared logic)
          if (id.includes('/services/')) {
            return 'chainService';
          }
          // Helper: Separate polyfills?
          return null;
        },

      }
    },
  },
})