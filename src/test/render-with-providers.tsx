import { type ReactElement, type ReactNode } from 'react';
import { render, waitFor, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, Route, Routes, type MemoryRouterProps } from 'react-router';
import { useAuth } from '../modules/auth/ui/hooks/useAuth';
import { useCart } from '../modules/cart/ui/hooks/useCart';
import AuthProvider from '../modules/auth/ui/providers/AuthProvider';
import CartProvider from '../modules/cart/ui/providers/CartProvider';
import { NotificationProvider } from '../shared/notifications';

type RenderWithProvidersOptions = RenderOptions & {
  routerInitialEntries?: MemoryRouterProps['initialEntries'];
};

function ProvidersReadyGate({ children }: { children: ReactNode }) {
  const { isLoading: authLoading } = useAuth();
  const { isLoading: cartLoading } = useCart();
  const isReady = !authLoading && !cartLoading;

  return (
    <>
      <div data-testid="providers-ready" data-ready={isReady ? 'true' : 'false'} hidden />
      {children}
    </>
  );
}

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
          <CartProvider>
            <ProvidersReadyGate>{children}</ProvidersReadyGate>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </MemoryRouter>
  );
}

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
