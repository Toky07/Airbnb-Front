import { describe, expect, it, vi } from 'vitest';
import { sampleCartApi } from '../../../test/fixtures/cart-api.fixtures';
import { HttpCartRepository } from './http-cart.repository';

describe('HttpCartRepository', () => {
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

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(updatedCart), { status: 200 }),
    );

    const repository = new HttpCartRepository();
    const result = await repository.updateItem(10, {
      guestCount: 3,
      startDate: '2026-08-05',
      endDate: '2026-08-08',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.cart.items[0]?.guestCount).toBe(3);
      expect(result.cart.items[0]?.startDate).toBe('2026-08-05');
    }

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/cart/items/10'),
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('retourne une erreur API lors de la mise à jour', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Dates indisponibles' }), { status: 400 }),
    );

    const repository = new HttpCartRepository();
    const result = await repository.updateItem(10, {
      startDate: '2026-08-01',
      endDate: '2026-08-03',
    });

    expect(result).toEqual({ success: false, error: 'Dates indisponibles' });
  });

  it('prépare un paiement via POST /cart/checkout', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
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
    );

    const repository = new HttpCartRepository();
    const result = await repository.checkout();

    expect(result).toEqual({
      success: true,
      intent: {
        paymentId: 42,
        clientSecret: 'secret',
        publishableKey: 'pk_test',
        amount: 24000,
        currency: 'eur',
      },
    });
  });
});
