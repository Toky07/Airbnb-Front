import { describe, expect, it, vi } from 'vitest';
import type { Cart } from '../../core/types/cart.types';
import {
  InitiateCheckoutUseCase,
  UpdateCartItemUseCase,
} from './cart.use-cases';
import type { CartRepository } from '../ports/cart.repository';

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
};

function createCartRepository(
  overrides: Partial<CartRepository> = {},
): CartRepository {
  return {
    getCart: vi.fn(),
    addReservation: vi.fn(),
    updateItem: vi.fn(),
    removeItem: vi.fn(),
    merge: vi.fn(),
    checkout: vi.fn(),
    completeCheckout: vi.fn(),
    ...overrides,
  };
}

describe('UpdateCartItemUseCase', () => {
  it('délègue la mise à jour au repository', async () => {
    const cartRepository = createCartRepository({
      updateItem: vi.fn().mockResolvedValue({ success: true, cart: sampleCart }),
    });
    const useCase = new UpdateCartItemUseCase(cartRepository);

    const result = await useCase.execute(10, { guestCount: 3 });

    expect(cartRepository.updateItem).toHaveBeenCalledWith(10, { guestCount: 3 });
    expect(result).toEqual({ success: true, cart: sampleCart });
  });
});

describe('InitiateCheckoutUseCase', () => {
  it('refuse le checkout d’un panier vide', async () => {
    const cartRepository = createCartRepository();
    const useCase = new InitiateCheckoutUseCase(cartRepository);

    const result = await useCase.execute({
      ...sampleCart,
      items: [],
      itemCount: 0,
    });

    expect(result).toEqual({ success: false, error: 'Votre panier est vide.' });
    expect(cartRepository.checkout).not.toHaveBeenCalled();
  });

  it('délègue le checkout au repository lorsque le panier contient des articles', async () => {
    const cartRepository = createCartRepository({
      checkout: vi.fn().mockResolvedValue({
        success: true,
        intent: {
          paymentId: 42,
          clientSecret: 'secret',
          publishableKey: 'pk_test',
          amount: 24000,
          currency: 'eur',
        },
      }),
    });
    const useCase = new InitiateCheckoutUseCase(cartRepository);

    const result = await useCase.execute(sampleCart);

    expect(cartRepository.checkout).toHaveBeenCalledOnce();
    expect(result.success).toBe(true);
  });
});
