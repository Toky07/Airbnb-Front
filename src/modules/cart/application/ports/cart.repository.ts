import type { PaymentSession } from '../../../payment/core/types/payment.types';
import type {
  AddReservationToCartPayload,
  Cart,
  UpdateCartItemPayload,
} from '../../core/types/cart.types';

export type CartResult =
  | { success: true; cart: Cart }
  | { success: false; error: string };

export type CheckoutResult =
  | { success: true; session: PaymentSession }
  | { success: false; error: string };

export interface CartRepository {
  getCart(): Promise<CartResult>;
  addReservation(payload: AddReservationToCartPayload): Promise<CartResult>;
  updateItem(itemId: number, payload: UpdateCartItemPayload): Promise<CartResult>;
  removeItem(itemId: number): Promise<CartResult>;
  merge(): Promise<CartResult>;
  checkout(): Promise<CheckoutResult>;
  completeCheckout(paymentId: number): Promise<CartResult>;
}
