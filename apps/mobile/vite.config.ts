import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      'gravity-shared': path.resolve(__dirname, '../../packages/shared'),
      '@components': path.resolve(__dirname, '../../packages/shared/components'),
      '@services': path.resolve(__dirname, '../../packages/shared/services'),
      '@contexts': path.resolve(__dirname, '../../packages/shared/contexts'),
      '@types': path.resolve(__dirname, '../../packages/shared/types.ts'),
      '@utils': path.resolve(__dirname, '../../packages/shared/utils'),
      '@config': path.resolve(__dirname, '../../packages/shared/config'),
      // Fix for legacy blockchain libs in mobile
      '@hiveio/dhive': path.resolve(__dirname, '../../node_modules/@hiveio/dhive/lib/index-browser.js'),
      'dsteem': path.resolve(__dirname, '../../node_modules/dsteem/lib/index-browser.js'),
    }
  },
  define: {
    'process.env': {},
    'process.browser': true,
    'process.version': '"v16.0.0"',
    'global': 'window',
  },
  build: {
    target: 'es2017',
    outDir: 'dist',
    emptyOutDir: true
  }
})
