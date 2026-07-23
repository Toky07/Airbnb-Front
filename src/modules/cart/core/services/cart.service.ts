import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { mapPaymentSession } from '../../../payment/core/mappers/map-payment-session';
import {
  mapCart,
  type AddReservationToCartPayload,
  type UpdateCartItemPayload,
} from '../types/cart.types';
import type { CartResult, CheckoutResult } from '../types/cart-mutation.types';
import {
  getLocalStorageCartSessionStore,
  type CartSessionStore,
} from './cart-session.store';

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

export class CartService {
  private readonly httpClient: HttpClient;
  private readonly sessionStore: CartSessionStore;

  constructor(
    httpClient: HttpClient = getHttpClient(),
    sessionStore: CartSessionStore = getLocalStorageCartSessionStore(),
  ) {
    this.httpClient = httpClient;
    this.sessionStore = sessionStore;
  }

  private persistOnSuccess(result: CartResult): CartResult {
    if (result.success) {
      this.sessionStore.setSessionId(result.cart.sessionId);
    }
    return result;
  }

  async getCart(): Promise<CartResult> {
    const response = await this.httpClient.get('/cart');
    return this.persistOnSuccess(await parseCartResponse(response, 'Impossible de charger le panier.'));
  }

  async addReservation(payload: AddReservationToCartPayload): Promise<CartResult> {
    const response = await this.httpClient.post('/cart/items', payload);
    return this.persistOnSuccess(
      await parseCartResponse(response, 'Impossible d’ajouter au panier.'),
    );
  }

  async updateItem(itemId: number, payload: UpdateCartItemPayload): Promise<CartResult> {
    const response = await this.httpClient.patch(`/cart/items/${itemId}`, payload);
    return this.persistOnSuccess(
      await parseCartResponse(response, 'Impossible de modifier l’article.'),
    );
  }

  async removeItem(itemId: number): Promise<CartResult> {
    const response = await this.httpClient.delete(`/cart/items/${itemId}`);
    return this.persistOnSuccess(
      await parseCartResponse(response, 'Impossible de retirer l’article.'),
    );
  }

  async merge(): Promise<CartResult> {
    const response = await this.httpClient.post('/cart/merge', {});
    return this.persistOnSuccess(
      await parseCartResponse(response, 'Impossible de fusionner le panier.'),
    );
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

    const session = mapPaymentSession(data);
    if (!session) {
      return { success: false, error: 'Réponse de paiement invalide.' };
    }

    return { success: true, session };
  }

  async completeCheckout(paymentId: number): Promise<CartResult> {
    const response = await this.httpClient.post('/cart/checkout/complete', { paymentId });
    return this.persistOnSuccess(
      await parseCartResponse(response, 'Impossible de finaliser le paiement.'),
    );
  }
}
