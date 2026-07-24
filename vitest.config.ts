import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const stripeJsMock = path.resolve(rootDir, './src/test/mocks/stripe-js.mock.ts');
const stripeReactMock = path.resolve(rootDir, './src/test/mocks/stripe-react.mock.ts');
const reactLeafletMock = path.resolve(rootDir, './src/test/mocks/react-leaflet.mock.tsx');

const sharedTestOptions = {
  globals: true,
  css: false as const,
  deps: {
    optimizer: {
      web: {
        enabled: true,
      },
    },
  },
};

export default defineConfig({
  // Tailwind is not needed for tests and slows down startup.
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@stripe/stripe-js': stripeJsMock,
      '@stripe/react-stripe-js': stripeReactMock,
      'react-leaflet': reactLeafletMock,
    },
  },
  test: {
    ...sharedTestOptions,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit-logic',
          include: ['src/**/*.test.ts'],
          exclude: [
            'src/**/*.integration.test.ts',
            'src/shared/ui/calendar/useDatePickerCalendar.test.ts',
          ],
          environment: 'node',
          setupFiles: ['./src/test/setup.ts'],
          pool: 'forks',
          sequence: { groupOrder: 0 },
        },
      },
      {
        extends: true,
        test: {
          name: 'unit-dom',
          include: ['src/**/*.test.tsx', 'src/shared/ui/calendar/useDatePickerCalendar.test.ts'],
          exclude: ['src/**/*.integration.test.tsx'],
          environment: 'happy-dom',
          setupFiles: ['./src/test/setup.ts'],
          pool: 'forks',
          sequence: { groupOrder: 1 },
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['src/**/*.integration.test.{ts,tsx}'],
          environment: 'happy-dom',
          environmentMatchGlobs: [['**/server.integration.test.ts', 'node']],
          setupFiles: ['./src/test/setup.ts', './src/test/setup-msw.ts'],
          pool: 'forks',
          maxWorkers: 1,
          isolate: false,
          sequence: { groupOrder: 2 },
        },
      },
    ],
  },
});
