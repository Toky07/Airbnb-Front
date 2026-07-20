import { emptyCartApi } from '../../fixtures/empty-cart-api.fixtures';
import { sampleCartApi } from '../../fixtures/cart-api.fixtures';

export type CartApiState = typeof emptyCartApi;

let cartState: CartApiState = structuredClone(emptyCartApi);

export function getCartState(): CartApiState {
  return cartState;
}

export function setCartState(next: CartApiState): void {
  cartState = structuredClone(next);
}

export function resetCartState(): void {
  cartState = structuredClone(emptyCartApi);
}

export function loadCartWithItems(): void {
  cartState = structuredClone(sampleCartApi);
}
