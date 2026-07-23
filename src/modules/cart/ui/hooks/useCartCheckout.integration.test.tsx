import { type FormEvent } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { sampleCartApi } from '../../../../test/fixtures/cart-api.fixtures';
import { apiUrl } from '../../../../test/msw/api-base-url';
import { server } from '../../../../test/msw/server';
import { createAppWrapper, waitForProvidersReady } from '../../../../test/render-with-providers';
import { useCartCheckout } from './useCartCheckout';

describe('useCartCheckout (integration)', () => {
  it('initie le paiement via POST /cart/checkout lorsque l’utilisateur est connecté', async () => {
    localStorage.setItem('auth_token', 'jwt-token');
    server.use(http.get(apiUrl('/cart'), () => HttpResponse.json(sampleCartApi)));

    const wrapper = createAppWrapper({ routerInitialEntries: ['/cart'] });
    const { result } = renderHook(() => useCartCheckout(), { wrapper });
    await waitForProvidersReady();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.cart?.items.length).toBeGreaterThan(0);
    });

    await act(async () => {
      await result.current.handleCheckout({ preventDefault() {} } as FormEvent);
    });

    await waitFor(() => {
      expect(result.current.step).toBe('payment');
      expect(result.current.paymentSession?.paymentId).toBe(42);
      expect(result.current.paymentSession?.holdUntil).toBe(
        '2099-01-01T12:00:00.000Z',
      );
    });
  });
});
