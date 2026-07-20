import { type ReactNode } from 'react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router';
import { useAuth } from '../modules/auth/ui/hooks/useAuth';
import { useCart } from '../modules/cart/ui/hooks/useCart';
import AuthProvider from '../modules/auth/ui/providers/AuthProvider';
import CartProvider from '../modules/cart/ui/providers/CartProvider';
import { NotificationProvider } from '../shared/notifications';

export function ProvidersReadyGate({ children }: { children: ReactNode }) {
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

export function AppProviders({
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
