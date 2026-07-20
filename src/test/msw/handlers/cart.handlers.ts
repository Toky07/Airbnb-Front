import { http, HttpResponse } from 'msw';
import { sampleCartApi } from '../../fixtures/cart-api.fixtures';
import { apiUrl } from '../api-base-url';
import { getCartState, loadCartWithItems, resetCartState, setCartState } from '../state/cart.state';

export { loadCartWithItems, resetCartState };

export const cartHandlers = [
  http.get(apiUrl('/cart'), () => HttpResponse.json(getCartState())),

  http.post(apiUrl('/cart/items'), async ({ request }) => {
    const body = (await request.json()) as {
      roomId?: number;
      startDate?: string;
      endDate?: string;
      guestCount?: number;
    };

    if (!body.roomId || !body.startDate || !body.endDate) {
      return HttpResponse.json({ message: 'Données invalides.' }, { status: 400 });
    }

    setCartState(sampleCartApi);
    return HttpResponse.json(getCartState());
  }),

  http.patch(apiUrl('/cart/items/:itemId'), async ({ params, request }) => {
    const itemId = Number(params.itemId);
    const cart = getCartState();
    const item = cart.items.find((entry) => entry.id === itemId);

    if (!item) {
      return HttpResponse.json({ message: 'Article introuvable.' }, { status: 404 });
    }

    const body = (await request.json()) as {
      guestCount?: number;
      startDate?: string;
      endDate?: string;
    };

    const updated = structuredClone(cart);
    updated.items = updated.items.map((entry) =>
      entry.id === itemId
        ? {
            ...entry,
            guestCount: body.guestCount ?? entry.guestCount,
            startDate: body.startDate ?? entry.startDate,
            endDate: body.endDate ?? entry.endDate,
          }
        : entry,
    );

    setCartState(updated);
    return HttpResponse.json(getCartState());
  }),

  http.delete(apiUrl('/cart/items/:itemId'), ({ params }) => {
    const itemId = Number(params.itemId);
    const cart = getCartState();
    const updated = structuredClone(cart);
    updated.items = updated.items.filter((entry) => entry.id !== itemId);
    updated.itemCount = updated.items.length;
    updated.totalPrice = updated.items.reduce((sum, entry) => sum + entry.totalPrice, 0);
    setCartState(updated);
    return HttpResponse.json(getCartState());
  }),

  http.post(apiUrl('/cart/merge'), () => {
    loadCartWithItems();
    return HttpResponse.json(getCartState());
  }),

  http.post(apiUrl('/cart/checkout'), () =>
    HttpResponse.json({
      paymentId: 42,
      clientSecret: 'secret',
      publishableKey: 'pk_test',
      amount: 24000,
      currency: 'eur',
      provider: 'stripe',
    }),
  ),

  http.post(apiUrl('/cart/checkout/complete'), () => {
    resetCartState();
    return HttpResponse.json(getCartState());
  }),
];
