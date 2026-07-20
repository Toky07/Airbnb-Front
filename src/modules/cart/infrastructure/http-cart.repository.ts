import type { HttpClient } from '../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../shared/http/parse-api-error';
import { mapPaymentIntent } from '../../payment/core/types/payment.types';
import {
  mapCart,
  type AddReservationToCartPayload,
  type UpdateCartItemPayload,
} from '../core/types/cart.types';
import type {
  CartRepository,
  CartResult,
  CheckoutResult,
} from '../application/ports/cart.repository';

const INVALID_CART_RESPONSE = 'Réponse de panier invalide.';

async function parseCartResponse(
  response: Response,
  errorFallback: string,
): Promise<CartResult> {
  const data: unknown = await response.json();

  if (!response.ok) {
    return { success: false, error: parseApiError(data, errorFallback) };
  }

  const cart = mapCart(data);
  if (!cart) {
    return { success: false, error: INVALID_CART_RESPONSE };
  }

  return { success: true, cart };
}

export class HttpCartRepository implements CartRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  getCart(): Promise<CartResult> {
    return this.httpClient
      .get('/cart')
      .then((response) => parseCartResponse(response, 'Impossible de charger le panier.'));
  }

  addReservation(payload: AddReservationToCartPayload): Promise<CartResult> {
    return this.httpClient
      .post('/cart/items', payload)
      .then((response) => parseCartResponse(response, 'Impossible d’ajouter au panier.'));
  }

  updateItem(itemId: number, payload: UpdateCartItemPayload): Promise<CartResult> {
    return this.httpClient
      .patch(`/cart/items/${itemId}`, payload)
      .then((response) => parseCartResponse(response, 'Impossible de modifier l’article.'));
  }

  removeItem(itemId: number): Promise<CartResult> {
    return this.httpClient
      .delete(`/cart/items/${itemId}`)
      .then((response) => parseCartResponse(response, 'Impossible de retirer l’article.'));
  }

  merge(): Promise<CartResult> {
    return this.httpClient
      .post('/cart/merge', {})
      .then((response) => parseCartResponse(response, 'Impossible de fusionner le panier.'));
  }

  async checkout(): Promise<CheckoutResult> {
    const response = await this.httpClient.post('/cart/checkout', {});
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de préparer le paiement.'),
      };
    }

    const intent = mapPaymentIntent(data);
    if (!intent) {
      return { success: false, error: 'Réponse de paiement invalide.' };
    }

    return { success: true, intent };
  }

  completeCheckout(paymentId: number): Promise<CartResult> {
    return this.httpClient
      .post('/cart/checkout/complete', { paymentId })
      .then((response) => parseCartResponse(response, 'Impossible de finaliser le paiement.'));
  }
}
