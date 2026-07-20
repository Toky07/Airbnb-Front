import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import {
  getAddReservationToCartUseCase,
  getLoadCartUseCase,
  getMergeCartUseCase,
  getRemoveCartItemUseCase,
  getUpdateCartItemUseCase,
} from '../../application/composition/cart.composition';
import type { Cart } from '../../core/types/cart.types';
import { CartContext, type CartContextValue } from '../context/cart.context';

type CartProviderProps = {
  children: ReactNode;
};

const CartProvider = ({ children }: CartProviderProps) => {
  const { isAuthenticated } = useAuth();
  const loadCartUseCase = useMemo(() => getLoadCartUseCase(), []);
  const addReservationUseCase = useMemo(() => getAddReservationToCartUseCase(), []);
  const updateCartItemUseCase = useMemo(() => getUpdateCartItemUseCase(), []);
  const removeCartItemUseCase = useMemo(() => getRemoveCartItemUseCase(), []);
  const mergeCartUseCase = useMemo(() => getMergeCartUseCase(), []);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    const result = await loadCartUseCase.execute();
    if (result.success) {
      setCart(result.cart);
    }
  }, [loadCartUseCase]);

  const syncCart = useCallback((nextCart: Cart) => {
    setCart(nextCart);
  }, []);

  const mergeCartIfNeeded = useCallback(async () => {
    const result = await mergeCartUseCase.execute();
    if (result.success) {
      setCart(result.cart);
    }
  }, [mergeCartUseCase]);

  useEffect(() => {
    void refreshCart().finally(() => setIsLoading(false));
  }, [refreshCart]);

  useEffect(() => {
    if (isAuthenticated) {
      void mergeCartIfNeeded();
    }
  }, [isAuthenticated, mergeCartIfNeeded]);

  const addReservation: CartContextValue['addReservation'] = useCallback(
    async (payload) => {
      const result = await addReservationUseCase.execute({
        itemType: 'reservation',
        ...payload,
      });

      if (!result.success) {
        return { success: false, error: result.error };
      }

      setCart(result.cart);
      return { success: true };
    },
    [addReservationUseCase],
  );

  const updateItem: CartContextValue['updateItem'] = useCallback(
    async (itemId, payload) => {
      const result = await updateCartItemUseCase.execute(itemId, payload);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      setCart(result.cart);
      return { success: true };
    },
    [updateCartItemUseCase],
  );

  const removeItem: CartContextValue['removeItem'] = useCallback(
    async (itemId) => {
      const result = await removeCartItemUseCase.execute(itemId);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      setCart(result.cart);
      return { success: true };
    },
    [removeCartItemUseCase],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isLoading,
      refreshCart,
      syncCart,
      addReservation,
      updateItem,
      removeItem,
      itemCount: cart?.itemCount ?? 0,
    }),
    [cart, isLoading, refreshCart, syncCart, addReservation, updateItem, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
