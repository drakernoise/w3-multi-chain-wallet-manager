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
      'regenerator-runtime/runtime': path.resolve(__dirname, 'src/regenerator-shim.js'),
      'regenerator-runtime': path.resolve(__dirname, 'src/regenerator-shim.js'),
      '@hiveio/dhive': path.resolve(__dirname, '../../node_modules/@hiveio/dhive/lib/index-browser.js'),
      'dsteem': path.resolve(__dirname, '../../node_modules/dsteem/lib/index-browser.js'),
      'vm': path.resolve(__dirname, 'src/empty-module.js'),
      // Monorepo Aliases
      'gravity-shared': path.resolve(__dirname, '../../packages/shared'),
      '@components': path.resolve(__dirname, '../../packages/shared/components'),
      '@services': path.resolve(__dirname, '../../packages/shared/services'),
      '@contexts': path.resolve(__dirname, '../../packages/shared/contexts'),
      '@types': path.resolve(__dirname, '../../packages/shared/types.ts'),
      '@utils': path.resolve(__dirname, '../../packages/shared/utils'),
      '@config': path.resolve(__dirname, '../../packages/shared/config')
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    minify: false, // Prevent mangling of legacy libraries
    chunkSizeWarningLimit: 2500,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        background: path.resolve(__dirname, 'src/background/index.ts'),
        content: path.resolve(__dirname, 'src/content/index.ts'),
        provider: path.resolve(__dirname, 'src/content/provider.ts')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      }
    },
  },
})