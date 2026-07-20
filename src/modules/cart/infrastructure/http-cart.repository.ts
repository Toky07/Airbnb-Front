import { getApiClient } from '../../../shared/http/api-client';
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
  getCart(): Promise<CartResult> {
    return getApiClient()
      .get('/cart')
      .then((response) => parseCartResponse(response, 'Impossible de charger le panier.'));
  }

  addReservation(payload: AddReservationToCartPayload): Promise<CartResult> {
    return getApiClient()
      .post('/cart/items', payload)
      .then((response) => parseCartResponse(response, 'Impossible d’ajouter au panier.'));
  }

  updateItem(itemId: number, payload: UpdateCartItemPayload): Promise<CartResult> {
    return getApiClient()
      .patch(`/cart/items/${itemId}`, payload)
      .then((response) => parseCartResponse(response, 'Impossible de modifier l’article.'));
  }

  removeItem(itemId: number): Promise<CartResult> {
    return getApiClient()
      .delete(`/cart/items/${itemId}`)
      .then((response) => parseCartResponse(response, 'Impossible de retirer l’article.'));
  }

  merge(): Promise<CartResult> {
    return getApiClient()
      .post('/cart/merge', {})
      .then((response) => parseCartResponse(response, 'Impossible de fusionner le panier.'));
  }

  async checkout(): Promise<CheckoutResult> {
    const response = await getApiClient().post('/cart/checkout', {});
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
    return getApiClient()
      .post('/cart/checkout/complete', { paymentId })
      .then((response) => parseCartResponse(response, 'Impossible de finaliser le paiement.'));
  }
}
