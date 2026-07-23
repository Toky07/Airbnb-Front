import { describe, expect, it, vi } from 'vitest';
import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { sampleCartApi } from '../../../../test/fixtures/cart-api.fixtures';
import type { CartSessionStore } from './cart-session.store';
import { CartService } from './cart.service';

function createHttpClient(overrides: Partial<HttpClient> = {}): HttpClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    postFormData: vi.fn(),
    putFormData: vi.fn(),
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

describe('CartService', () => {
  it('met à jour un article via PATCH /cart/items/:id', async () => {
    const updatedCart = {
      ...sampleCartApi,
      items: [
        {
          ...sampleCartApi.items[0],
          guestCount: 3,
          startDate: '2026-08-05',
          endDate: '2026-08-08',
        },
      ],
    };
    const httpClient = createHttpClient({
      patch: vi.fn().mockResolvedValue(new Response(JSON.stringify(updatedCart), { status: 200 })),
    });
    const service = new CartService(httpClient);
    const result = await service.updateItem(10, {
      guestCount: 3,
      startDate: '2026-08-05',
      endDate: '2026-08-08',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.cart.items[0]?.guestCount).toBe(3);
      expect(result.cart.items[0]?.startDate).toBe('2026-08-05');
    }

    expect(httpClient.patch).toHaveBeenCalledWith('/cart/items/10', {
      guestCount: 3,
      startDate: '2026-08-05',
      endDate: '2026-08-08',
    });
  });

  it('retourne une erreur API lors de la mise à jour', async () => {
    const httpClient = createHttpClient({
      patch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Dates indisponibles' }), { status: 400 }),
      ),
    });
    const service = new CartService(httpClient);
    const result = await service.updateItem(10, {
      startDate: '2026-08-01',
      endDate: '2026-08-03',
    });

    expect(result).toEqual({ success: false, error: 'Dates indisponibles' });
  });

  it('prépare un paiement via POST /cart/checkout', async () => {
    const httpClient = createHttpClient({
      post: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            paymentId: 42,
            clientSecret: 'secret',
            publishableKey: 'pk_test',
            amount: 24000,
            currency: 'eur',
          }),
          { status: 200 },
        ),
      ),
    });
    const service = new CartService(httpClient);
    const result = await service.checkout();

    expect(result).toEqual({
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
    });
  });

  it('persiste la session après une mise à jour réussie', async () => {
    const sessionStore = createSessionStore();
    const httpClient = createHttpClient({
      patch: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 1,
            sessionId: 'new-session',
            userId: null,
            items: [],
            totalPrice: 0,
            itemCount: 0,
          }),
          { status: 200 },
        ),
      ),
    });
    const service = new CartService(httpClient, sessionStore);

    await service.updateItem(10, { guestCount: 2 });

    expect(sessionStore.setSessionId).toHaveBeenCalledWith('new-session');
  });

  it('ne persiste pas la session en cas d’erreur', async () => {
    const sessionStore = createSessionStore();
    const httpClient = createHttpClient({
      patch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Erreur' }), { status: 400 }),
      ),
    });
    const service = new CartService(httpClient, sessionStore);

    await service.updateItem(10, { guestCount: 2 });

    expect(sessionStore.setSessionId).not.toHaveBeenCalled();
  });
});
