import type { Cart } from '../../core/types/cart.types';
import type {
  AddReservationToCartPayload,
  UpdateCartItemPayload,
} from '../../core/types/cart.types';
import type { CartRepository, CartResult, CheckoutResult } from '../ports/cart.repository';

export class LoadCartUseCase {
  private readonly cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  execute(): Promise<CartResult> {
    return this.cartRepository.getCart();
  }
}

export class AddReservationToCartUseCase {
  private readonly cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  execute(payload: AddReservationToCartPayload): Promise<CartResult> {
    return this.cartRepository.addReservation(payload);
  }
}

export class UpdateCartItemUseCase {
  private readonly cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  execute(itemId: number, payload: UpdateCartItemPayload): Promise<CartResult> {
    return this.cartRepository.updateItem(itemId, payload);
  }
}

export class RemoveCartItemUseCase {
  private readonly cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  execute(itemId: number): Promise<CartResult> {
    return this.cartRepository.removeItem(itemId);
  }
}

export class MergeCartUseCase {
  private readonly cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  execute(): Promise<CartResult> {
    return this.cartRepository.merge();
  }
}

export class InitiateCheckoutUseCase {
  private readonly cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  execute(cart: Cart | null): Promise<CheckoutResult> {
    if (!cart?.items.length) {
      return Promise.resolve({ success: false, error: 'Votre panier est vide.' });
    }

    return this.cartRepository.checkout();
  }
}

export class CompleteCheckoutUseCase {
  private readonly cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  execute(paymentId: number): Promise<CartResult> {
    return this.cartRepository.completeCheckout(paymentId);
  }
}
