import { type ReactElement, type ReactNode } from 'react';
import { render, waitFor, type RenderOptions } from '@testing-library/react';
import { Route, Routes, type MemoryRouterProps } from 'react-router';
import { AppProviders } from './app-providers';

type RenderWithProvidersOptions = RenderOptions & {
  routerInitialEntries?: MemoryRouterProps['initialEntries'];
};

export async function waitForProvidersReady(): Promise<void> {
  await waitFor(() => {
    const readyMarker = document.querySelector('[data-testid="providers-ready"]');
    expect(readyMarker).toHaveAttribute('data-ready', 'true');
  });
}

export async function renderWithProviders(
  ui: ReactElement,
  { routerInitialEntries, ...options }: RenderWithProvidersOptions = {},
) {
  const view = render(ui, {
    wrapper: ({ children }) => (
      <AppProviders routerInitialEntries={routerInitialEntries}>{children}</AppProviders>
    ),
    ...options,
  });

  await waitForProvidersReady();

  return view;
}

export async function renderWithRoute(
  routePath: string,
  ui: ReactElement,
  {
    routerInitialEntries,
    ...options
  }: RenderWithProvidersOptions & { routerInitialEntries: MemoryRouterProps['initialEntries'] },
) {
  return renderWithProviders(
    <Routes>
      <Route path={routePath} element={ui} />
    </Routes>,
    { routerInitialEntries, ...options },
  );
}

export function createAppWrapper(options: RenderWithProvidersOptions = {}) {
  return function AppWrapper({ children }: { children: ReactNode }) {
    return (
      <AppProviders routerInitialEntries={options.routerInitialEntries}>
        {children}
      </AppProviders>
    );
  };
}
