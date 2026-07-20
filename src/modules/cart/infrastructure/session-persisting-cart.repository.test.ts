import { describe, expect, it, vi } from 'vitest';
import { SessionPersistingCartRepository } from './session-persisting-cart.repository';
import type { CartRepository } from '../application/ports/cart.repository';
import type { CartSessionStore } from '../application/ports/cart-session.store';

function createInnerRepository(
  overrides: Partial<CartRepository> = {},
): CartRepository {
  return {
    getCart: vi.fn(),
    addReservation: vi.fn(),
    updateItem: vi.fn().mockResolvedValue({
      success: true,
      cart: { id: 1, sessionId: 'new-session', userId: null, items: [], totalPrice: 0, itemCount: 0 },
    }),
    removeItem: vi.fn(),
    merge: vi.fn(),
    checkout: vi.fn(),
    completeCheckout: vi.fn(),
    ...overrides,
  };
}

function createSessionStore(
  overrides: Partial<CartSessionStore> = {},
): CartSessionStore {
  return {
    setSessionId: vi.fn(),
    clear: vi.fn(),
    ...overrides,
  };
}

describe('SessionPersistingCartRepository', () => {
  it('persiste la session après une mise à jour réussie', async () => {
    const sessionStore = createSessionStore();
    const inner = createInnerRepository();
    const repository = new SessionPersistingCartRepository(inner, sessionStore);

    await repository.updateItem(10, { guestCount: 2 });

    expect(sessionStore.setSessionId).toHaveBeenCalledWith('new-session');
  });

  it('ne persiste pas la session en cas d’erreur', async () => {
    const sessionStore = createSessionStore();
    const inner = createInnerRepository({
      updateItem: vi.fn().mockResolvedValue({ success: false, error: 'Erreur' }),
    });
    const repository = new SessionPersistingCartRepository(inner, sessionStore);

    await repository.updateItem(10, { guestCount: 2 });

    expect(sessionStore.setSessionId).not.toHaveBeenCalled();
  });
});
