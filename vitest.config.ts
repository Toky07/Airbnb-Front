import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Tailwind is not needed for unit tests and slows down startup.
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  test: {
    name: 'frontend',
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    pool: 'threads',
    css: false,
    deps: {
      optimizer: {
        web: {
          enabled: true,
        },
      },
    },
  },
});
