import { describe, expect, it, vi } from 'vitest';
import type { Cart } from '../types/cart.types';
import type { CartService } from '../services/cart.service';
import { initiateCartCheckout } from './initiate-cart-checkout';

const sampleCart: Cart = {
  id: 1,
  sessionId: 'session-abc',
  userId: null,
  items: [
    {
      id: 10,
      itemType: 'reservation',
      label: 'Suite',
      unitPrice: 120,
      totalPrice: 240,
      quantity: 1,
      propertyId: 1,
      roomId: 5,
      serviceId: null,
      startDate: '2026-08-01',
      endDate: '2026-08-03',
      guestCount: 2,
      nights: 2,
      roomName: 'Suite',
      roomSlug: 'suite',
      propertyName: 'Hôtel Azur',
      propertyCity: 'Nice',
      imageUrl: null,
    },
  ],
  totalPrice: 240,
  itemCount: 1,
  pricingBreakdown: null,
};

function createCartService(overrides: Partial<CartService> = {}): CartService {
  return {
    getCart: vi.fn(),
    addReservation: vi.fn(),
    updateItem: vi.fn(),
    removeItem: vi.fn(),
    merge: vi.fn(),
    checkout: vi.fn(),
    completeCheckout: vi.fn(),
    ...overrides,
  } as unknown as CartService;
}

describe('initiateCartCheckout', () => {
  it('refuse le checkout d’un panier vide', async () => {
    const cartService = createCartService();

    const result = await initiateCartCheckout(cartService, {
      ...sampleCart,
      items: [],
      itemCount: 0,
    });

    expect(result).toEqual({ success: false, error: 'Votre panier est vide.' });
    expect(cartService.checkout).not.toHaveBeenCalled();
  });

  it('délègue le checkout au service lorsque le panier contient des articles', async () => {
    const cartService = createCartService({
      checkout: vi.fn().mockResolvedValue({
        success: true,
        session: {
          paymentId: 42,
          clientSecret: 'secret',
          publishableKey: 'pk_test',
          amount: 24000,
          currency: 'eur',
          provider: 'stripe',
          holdUntil: null,
        },
      }),
    });

    const result = await initiateCartCheckout(cartService, sampleCart);

    expect(cartService.checkout).toHaveBeenCalledOnce();
    expect(result.success).toBe(true);
  });
});
