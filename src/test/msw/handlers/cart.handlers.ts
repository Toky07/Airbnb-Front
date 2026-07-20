import { http, HttpResponse } from 'msw';
import { emptyCartApi } from '../../fixtures/empty-cart-api.fixtures';
import { sampleCartApi } from '../../fixtures/cart-api.fixtures';
import { apiUrl } from '../api-base-url';

export const cartHandlers = [
  http.get(apiUrl('/cart'), () => HttpResponse.json(emptyCartApi)),

  http.post(apiUrl('/cart/merge'), () => HttpResponse.json(sampleCartApi)),
];
