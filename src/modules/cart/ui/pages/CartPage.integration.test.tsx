import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { loadCartWithItems } from '../../../../test/msw/handlers/cart.handlers';
import { renderWithRoute } from '../../../../test/render-with-providers';
import CartPage from './CartPage';

describe('CartPage (integration)', () => {
  it('affiche un panier vide après chargement via GET /cart', async () => {
    await renderWithRoute('/cart', <CartPage />, { routerInitialEntries: ['/cart'] });

    await waitFor(() => {
      expect(screen.getByText(/votre panier est vide/i)).toBeInTheDocument();
    });
  });

  it('affiche les articles du panier lorsque GET /cart retourne des items', async () => {
    loadCartWithItems();

    await renderWithRoute('/cart', <CartPage />, { routerInitialEntries: ['/cart'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Suite' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retirer/i })).toBeInTheDocument();
    });
  });

  it('retire un article via DELETE /cart/items/:id', async () => {
    loadCartWithItems();

    await renderWithRoute('/cart', <CartPage />, { routerInitialEntries: ['/cart'] });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retirer/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /retirer/i }));

    await waitFor(() => {
      expect(screen.getByText(/votre panier est vide/i)).toBeInTheDocument();
    });
  });
});
