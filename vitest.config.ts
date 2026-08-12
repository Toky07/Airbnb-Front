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
  // Accélère les imports répétés (React, Testing Library, etc.).
  deps: {
    optimizer: {
      web: {
        enabled: true,
      },
    },
  },
};

export default defineConfig({
  // Tailwind n’est pas nécessaire pour les tests et ralentit le démarrage.
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
    // Les projets tournent en parallèle (plus de groupOrder séquentiel).
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
          setupFiles: ['./src/test/setup-node.ts'],
          pool: 'threads',
          isolate: false,
          fileParallelism: true,
          // Tourne en parallèle avec unit-dom (même maxWorkers implicite).
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
          pool: 'threads',
          // Réutilise le même environnement happy-dom (cleanup dans setup.ts).
          isolate: false,
          fileParallelism: true,
          sequence: { groupOrder: 0 },
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
          // MSW + état partagé : un seul worker, sans ré-isolation par fichier.
          pool: 'forks',
          maxWorkers: 1,
          isolate: false,
          fileParallelism: false,
          // Après les unitaires (maxWorkers différent ⇒ groupOrder unique requis).
          sequence: { groupOrder: 1 },
        },
      },
    ],
  },
});
