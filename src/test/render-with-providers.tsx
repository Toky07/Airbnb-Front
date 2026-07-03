import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router';
import AuthProvider from '../modules/auth/ui/providers/AuthProvider';
import CartProvider from '../modules/cart/ui/providers/CartProvider';
import { NotificationProvider } from '../shared/notifications';

type RenderWithProvidersOptions = RenderOptions & {
  routerInitialEntries?: MemoryRouterProps['initialEntries'];
};

export function renderWithProviders(
  ui: ReactElement,
  { routerInitialEntries, ...options }: RenderWithProvidersOptions = {},
) {
  return render(
    <MemoryRouter initialEntries={routerInitialEntries}>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>{ui}</CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </MemoryRouter>,
    options,
  );
}
