import type { CartRepository, CartResult, CheckoutResult } from '../application/ports/cart.repository';
import type { CartSessionStore } from '../application/ports/cart-session.store';
import type {
  AddReservationToCartPayload,
  UpdateCartItemPayload,
} from '../core/types/cart.types';

export class SessionPersistingCartRepository implements CartRepository {
  constructor(
    private readonly inner: CartRepository,
    private readonly sessionStore: CartSessionStore,
  ) {}

  private persistOnSuccess<T extends CartResult | CheckoutResult>(result: T): T {
    if ('cart' in result && result.success) {
      this.sessionStore.setSessionId(result.cart.sessionId);
    }
    return result;
  }

  getCart(): Promise<CartResult> {
    return this.inner.getCart().then((result) => this.persistOnSuccess(result));
  }

  addReservation(payload: AddReservationToCartPayload): Promise<CartResult> {
    return this.inner.addReservation(payload).then((result) => this.persistOnSuccess(result));
  }

  updateItem(itemId: number, payload: UpdateCartItemPayload): Promise<CartResult> {
    return this.inner.updateItem(itemId, payload).then((result) => this.persistOnSuccess(result));
  }

  removeItem(itemId: number): Promise<CartResult> {
    return this.inner.removeItem(itemId).then((result) => this.persistOnSuccess(result));
  }

  merge(): Promise<CartResult> {
    return this.inner.merge().then((result) => this.persistOnSuccess(result));
  }

  checkout(): Promise<CheckoutResult> {
    return this.inner.checkout();
  }

  completeCheckout(paymentId: number): Promise<CartResult> {
    return this.inner.completeCheckout(paymentId).then((result) => this.persistOnSuccess(result));
  }
}
