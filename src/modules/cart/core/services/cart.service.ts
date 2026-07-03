import { getApiClient } from '../../../../shared/http/api-client';
import { setCartSessionId } from '../../../../shared/http/cart-session.storage';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import { mapPaymentIntent, type PaymentIntentResult } from '../../../payment/core/types/payment.types';
import {
  mapCart,
  type AddReservationToCartPayload,
  type Cart,
  type UpdateCartItemPayload,
} from '../types/cart.types';

export class CartService {
  private persistSession(cart: Cart): void {
    setCartSessionId(cart.sessionId);
  }

  async getCart(): Promise<{ success: true; cart: Cart } | { success: false; error: string }> {
    const response = await getApiClient().get('/cart');
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de charger le panier.'),
      };
    }

    const cart = mapCart(data);
    if (!cart) {
      return { success: false, error: 'Réponse de panier invalide.' };
    }

    this.persistSession(cart);
    return { success: true, cart };
  }

  async addReservation(
    payload: AddReservationToCartPayload,
  ): Promise<{ success: true; cart: Cart } | { success: false; error: string }> {
    const response = await getApiClient().post('/cart/items', payload);
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible d’ajouter au panier.'),
      };
    }

    const cart = mapCart(data);
    if (!cart) {
      return { success: false, error: 'Réponse de panier invalide.' };
    }

    this.persistSession(cart);
    return { success: true, cart };
  }

  async updateItem(
    itemId: number,
    payload: UpdateCartItemPayload,
  ): Promise<{ success: true; cart: Cart } | { success: false; error: string }> {
    const response = await getApiClient().patch(`/cart/items/${itemId}`, payload);
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de modifier l’article.'),
      };
    }

    const cart = mapCart(data);
    if (!cart) {
      return { success: false, error: 'Réponse de panier invalide.' };
    }

    this.persistSession(cart);
    return { success: true, cart };
  }

  async removeItem(
    itemId: number,
  ): Promise<{ success: true; cart: Cart } | { success: false; error: string }> {
    const response = await getApiClient().delete(`/cart/items/${itemId}`);
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de retirer l’article.'),
      };
    }

    const cart = mapCart(data);
    if (!cart) {
      return { success: false, error: 'Réponse de panier invalide.' };
    }

    this.persistSession(cart);
    return { success: true, cart };
  }

  async merge(): Promise<{ success: true; cart: Cart } | { success: false; error: string }> {
    const response = await getApiClient().post('/cart/merge', {});
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de fusionner le panier.'),
      };
    }

    const cart = mapCart(data);
    if (!cart) {
      return { success: false, error: 'Réponse de panier invalide.' };
    }

    this.persistSession(cart);
    return { success: true, cart };
  }

  async checkout(): Promise<
    { success: true; intent: PaymentIntentResult } | { success: false; error: string }
  > {
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

  async completeCheckout(
    paymentId: number,
  ): Promise<{ success: true; cart: Cart } | { success: false; error: string }> {
    const response = await getApiClient().post('/cart/checkout/complete', { paymentId });
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de finaliser le paiement.'),
      };
    }

    const cart = mapCart(data);
    if (!cart) {
      return { success: false, error: 'Réponse de panier invalide.' };
    }

    this.persistSession(cart);
    return { success: true, cart };
  }
}

let service: CartService | null = null;

export function getCartService(): CartService {
  if (!service) {
    service = new CartService();
  }
  return service;
}
