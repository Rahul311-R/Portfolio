import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // Only truly-eager vendors get manual groups. Charts (recharts —
            // one lazy Lab experiment) and three.js (one lazy Home component)
            // are deliberately NOT grouped: manual groups are modulepreloaded
            // from index.html, which previously pulled 341KB of charts into
            // every page's critical path.
            { name: 'vendor-motion', test: /node_modules[\\/]framer-motion/ },
            { name: 'vendor-forms', test: /node_modules[\\/](react-hook-form|@hookform[\\/]|zod)/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
