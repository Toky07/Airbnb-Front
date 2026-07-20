import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import type { CartRepository } from '../ports/cart.repository';
import {
  AddReservationToCartUseCase,
  CompleteCheckoutUseCase,
  InitiateCheckoutUseCase,
  LoadCartUseCase,
  MergeCartUseCase,
  RemoveCartItemUseCase,
  UpdateCartItemUseCase,
} from '../use-cases/cart.use-cases';
import { HttpCartRepository } from '../../infrastructure/http-cart.repository';
import { getLocalStorageCartSessionStore } from '../../infrastructure/cart-session.store';
import { SessionPersistingCartRepository } from '../../infrastructure/session-persisting-cart.repository';

let cartRepository: CartRepository | null = null;
let loadCartUseCase: LoadCartUseCase | null = null;
let addReservationToCartUseCase: AddReservationToCartUseCase | null = null;
let updateCartItemUseCase: UpdateCartItemUseCase | null = null;
let removeCartItemUseCase: RemoveCartItemUseCase | null = null;
let mergeCartUseCase: MergeCartUseCase | null = null;
let initiateCheckoutUseCase: InitiateCheckoutUseCase | null = null;
let completeCheckoutUseCase: CompleteCheckoutUseCase | null = null;

export function getCartRepository(): CartRepository {
  if (!cartRepository) {
    cartRepository = new SessionPersistingCartRepository(
      new HttpCartRepository(getHttpClient()),
      getLocalStorageCartSessionStore(),
    );
  }
  return cartRepository;
}

export function getLoadCartUseCase(): LoadCartUseCase {
  if (!loadCartUseCase) {
    loadCartUseCase = new LoadCartUseCase(getCartRepository());
  }
  return loadCartUseCase;
}

export function getAddReservationToCartUseCase(): AddReservationToCartUseCase {
  if (!addReservationToCartUseCase) {
    addReservationToCartUseCase = new AddReservationToCartUseCase(getCartRepository());
  }
  return addReservationToCartUseCase;
}

export function getUpdateCartItemUseCase(): UpdateCartItemUseCase {
  if (!updateCartItemUseCase) {
    updateCartItemUseCase = new UpdateCartItemUseCase(getCartRepository());
  }
  return updateCartItemUseCase;
}

export function getRemoveCartItemUseCase(): RemoveCartItemUseCase {
  if (!removeCartItemUseCase) {
    removeCartItemUseCase = new RemoveCartItemUseCase(getCartRepository());
  }
  return removeCartItemUseCase;
}

export function getMergeCartUseCase(): MergeCartUseCase {
  if (!mergeCartUseCase) {
    mergeCartUseCase = new MergeCartUseCase(getCartRepository());
  }
  return mergeCartUseCase;
}

export function getInitiateCheckoutUseCase(): InitiateCheckoutUseCase {
  if (!initiateCheckoutUseCase) {
    initiateCheckoutUseCase = new InitiateCheckoutUseCase(getCartRepository());
  }
  return initiateCheckoutUseCase;
}

export function getCompleteCheckoutUseCase(): CompleteCheckoutUseCase {
  if (!completeCheckoutUseCase) {
    completeCheckoutUseCase = new CompleteCheckoutUseCase(getCartRepository());
  }
  return completeCheckoutUseCase;
}
