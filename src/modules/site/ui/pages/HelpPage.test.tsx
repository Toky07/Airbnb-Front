import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../test/render-with-providers';
import HelpPage from './HelpPage';

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

describe('HelpPage', () => {
  it('affiche la FAQ et le lien contact', async () => {
    await renderWithProviders(<HelpPage />);

    expect(screen.getByRole('heading', { name: 'Centre d’aide' })).toBeInTheDocument();
    expect(screen.getByText('Comment réserver un logement ?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contacter le support' })).toHaveAttribute(
      'href',
      '/contact',
    );
  });
});
