import { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, Route, Routes, type MemoryRouterProps } from 'react-router';
import AuthProvider from '../modules/auth/ui/providers/AuthProvider';
import CartProvider from '../modules/cart/ui/providers/CartProvider';
import { NotificationProvider } from '../shared/notifications';

type RenderWithProvidersOptions = RenderOptions & {
  routerInitialEntries?: MemoryRouterProps['initialEntries'];
};

function AppProviders({
  children,
  routerInitialEntries,
}: {
  children: ReactNode;
  routerInitialEntries?: MemoryRouterProps['initialEntries'];
}) {
  return (
    <MemoryRouter initialEntries={routerInitialEntries}>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </MemoryRouter>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  { routerInitialEntries, ...options }: RenderWithProvidersOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AppProviders routerInitialEntries={routerInitialEntries}>{children}</AppProviders>
    ),
    ...options,
  });
}

export function renderWithRoute(
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
