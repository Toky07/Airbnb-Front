import { type FormEvent } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getCartState } from '../../../../test/msw/state/cart.state';
import { createAppWrapper, waitForProvidersReady } from '../../../../test/render-with-providers';
import { useAddToCart } from './useAddToCart';

describe('useAddToCart (integration)', () => {
  it('ajoute une réservation au panier via POST /cart/items', async () => {
    const wrapper = createAppWrapper({ routerInitialEntries: ['/rooms/suite-vue-mer'] });
    const { result } = renderHook(
      () =>
        useAddToCart({
          roomId: 1,
          roomSlug: 'suite-vue-mer',
          pricePerNight: 120,
          maxGuests: 2,
        }),
      { wrapper },
    );
    await waitForProvidersReady();

    await waitFor(() => {
      expect(result.current.form.startDate).not.toBe('');
      expect(result.current.form.endDate).not.toBe('');
    });

    await act(async () => {
      await result.current.submit({ preventDefault() {} } as FormEvent);
    });

    await waitFor(() => {
      expect(result.current.added).toBe(true);
    });

    expect(getCartState().items).toHaveLength(1);
  });
});
