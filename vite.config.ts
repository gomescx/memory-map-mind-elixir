import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => ({
  plugins: [react()],
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
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
}));
