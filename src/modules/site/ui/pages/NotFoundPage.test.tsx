import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../test/render-with-providers';
import NotFoundPage from './NotFoundPage';

vi.mock('../../../cart/core/services/cart.service', () => ({
  getCartService: () => ({
    getCart: vi.fn().mockResolvedValue({
      success: true,
      cart: {
        id: 1,
        sessionId: 'test-session',
        userId: null,
        items: [],
        totalPrice: 0,
        itemCount: 0,
      },
    }),
    merge: vi.fn().mockResolvedValue({
      success: true,
      cart: {
        id: 1,
        sessionId: 'test-session',
        userId: null,
        items: [],
        totalPrice: 0,
        itemCount: 0,
      },
    }),
    addReservation: vi.fn(),
    updateItem: vi.fn(),
    removeItem: vi.fn(),
    checkout: vi.fn(),
  }),
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
