import type { PaymentSession } from '../../../payment/core/types/payment.types';
import type { Cart } from './cart.types';

export type CartResult =
  | { success: true; cart: Cart }
  | { success: false; error: string };

export type CheckoutResult =
  | { success: true; session: PaymentSession }
  | { success: false; error: string };
