import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Make vite preview behave like GitHub Pages by emulating the /memory-map-mind-elixir/ base.
//
// Vite preview serves dist/ at the server root (ignoring the `base` config for routing).
// This means:
//   - dist/index.html is at http://localhost:4173/              ← no base prefix
//   - dist/tools/memory-map/index.html is at /tools/memory-map/ ← no base prefix
//   - BUT the built HTML has absolute asset paths like
//     /memory-map-mind-elixir/tools/memory-map/assets/foo.js   ← production prefix
// So assets 404 locally unless we strip the prefix from every inbound request.
//
// This middleware does two things:
//   1. Redirects bare /  →  /memory-map-mind-elixir/  so the browser URL matches production.
//   2. Strips /memory-map-mind-elixir from any request URL before Vite's static handler
//      sees it, so the static files are found and asset requests succeed.
// Make vite preview behave like GitHub Pages by emulating the /memory-map-mind-elixir/ base.
//
// Vite preview serves dist/ at the server root (ignoring the `base` config for routing):
//   - dist/index.html            → http://localhost:4173/
//   - dist/tools/memory-map/…   → http://localhost:4173/tools/memory-map/
//
// BUT the built HTML has absolute asset paths baked in at build time, e.g.:
//   /memory-map-mind-elixir/tools/memory-map/assets/foo.js   ← production prefix
//
// Those 404 locally unless we strip the base prefix from every inbound request.
// The middleware below does exactly that: any request starting with
// /memory-map-mind-elixir/… has the prefix stripped, so Vite's static handler
// finds the file in dist/ as expected.
//
// NOTE: We do NOT add a / → /memory-map-mind-elixir/ redirect here.  That
// would trigger Vite's own base-path redirect back to /memory-map-mind-elixir/,
// creating an infinite loop. Locally the launcher lives at http://localhost:4173/
// and the Memory Map lives at http://localhost:4173/tools/memory-map/ — which is
// fine for local dev.
const previewBaseRedirect = {
  name: 'preview-base-redirect',
  configurePreviewServer(server: import('vite').PreviewServer) {
    // Register middleware WITHOUT returning a factory function.
    // Returning a function puts the middleware AFTER Vite's static handler
    // (post-processing), which is too late — 404 responses are already sent.
    // Calling server.middlewares.use() directly places it BEFORE the static handler.
    server.middlewares.use((req, res, next) => {
      const BASE = '/memory-map-mind-elixir';

      // Strip the base prefix so Vite's static file handler can locate the file
      // in dist/. This makes absolute asset URLs like
      //   /memory-map-mind-elixir/tools/memory-map/assets/foo.js
      // resolve correctly in the local preview server.
      if (req.url?.startsWith(`${BASE}/`)) {
        req.url = req.url.slice(BASE.length) || '/';
      }

      next();
    });
  },
};

export default defineConfig(({ command }) => ({
  plugins: [react(), previewBaseRedirect],
  appType: 'mpa',
  base: command === 'serve'
    ? '/'
    : '/memory-map-mind-elixir/',
  build: {
    target: 'ES2020',
    minify: 'terser',
    rollupOptions: {
      input: {
        'memory-map': path.resolve(__dirname, 'tools/memory-map/index.html'),
      },
      output: {
        assetFileNames: 'tools/memory-map/assets/[name]-[hash].[ext]',
        chunkFileNames: 'tools/memory-map/assets/[name]-[hash].js',
        entryFileNames: 'tools/memory-map/assets/[name]-[hash].js',
        manualChunks: {
          vendor: ['mind-elixir'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@services': path.resolve(__dirname, './src/services'),
      '@state': path.resolve(__dirname, './src/state'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
    open: '/index.html',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
}));
