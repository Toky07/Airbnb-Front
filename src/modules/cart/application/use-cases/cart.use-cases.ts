import type { Cart } from '../../core/types/cart.types';
import type {
  AddReservationToCartPayload,
  CartRepository,
  CartResult,
  CheckoutResult,
  UpdateCartItemPayload,
} from '../ports/cart.repository';

export class LoadCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(): Promise<CartResult> {
    return this.cartRepository.getCart();
  }
}

export class AddReservationToCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(payload: AddReservationToCartPayload): Promise<CartResult> {
    return this.cartRepository.addReservation(payload);
  }
}

export class UpdateCartItemUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(itemId: number, payload: UpdateCartItemPayload): Promise<CartResult> {
    return this.cartRepository.updateItem(itemId, payload);
  }
}

export class RemoveCartItemUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(itemId: number): Promise<CartResult> {
    return this.cartRepository.removeItem(itemId);
  }
}

export class MergeCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(): Promise<CartResult> {
    return this.cartRepository.merge();
  }
}

export class InitiateCheckoutUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(cart: Cart | null): Promise<CheckoutResult> {
    if (!cart?.items.length) {
      return Promise.resolve({ success: false, error: 'Votre panier est vide.' });
    }

    return this.cartRepository.checkout();
  }
}

export class CompleteCheckoutUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(paymentId: number): Promise<CartResult> {
    return this.cartRepository.completeCheckout(paymentId);
  }
}
