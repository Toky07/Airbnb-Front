import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../test/render-with-providers';
import NotFoundPage from './NotFoundPage';

const emptyCart = {
  id: 1,
  sessionId: 'test-session',
  userId: null,
  items: [],
  totalPrice: 0,
  itemCount: 0,
};

vi.mock('../../../cart/application/composition/cart.composition', () => ({
  getLoadCartUseCase: () => ({
    execute: vi.fn().mockResolvedValue({ success: true, cart: emptyCart }),
  }),
  getMergeCartUseCase: () => ({
    execute: vi.fn().mockResolvedValue({ success: true, cart: emptyCart }),
  }),
  getAddReservationToCartUseCase: () => ({ execute: vi.fn() }),
  getUpdateCartItemUseCase: () => ({ execute: vi.fn() }),
  getRemoveCartItemUseCase: () => ({ execute: vi.fn() }),
  getInitiateCheckoutUseCase: () => ({ execute: vi.fn() }),
  getCompleteCheckoutUseCase: () => ({ execute: vi.fn() }),
}));

describe('NotFoundPage', () => {
  it('affiche le message 404 et les liens de navigation', () => {
    renderWithProviders(<NotFoundPage />);

    expect(screen.getByRole('heading', { name: 'Page introuvable' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: "Retour à l'accueil" })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('link', { name: 'Explorer les logements' })).toHaveAttribute(
      'href',
      '/search',
    );
  });
});
