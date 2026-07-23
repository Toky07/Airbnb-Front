import type { CartService } from '../services/cart.service';
import type { Cart } from '../types/cart.types';
import type { CheckoutResult } from '../types/cart-mutation.types';

export function initiateCartCheckout(
  cartService: CartService,
  cart: Cart | null,
): Promise<CheckoutResult> {
  if (!cart?.items.length) {
    return Promise.resolve({ success: false, error: 'Votre panier est vide.' });
  }

  return cartService.checkout();
}
