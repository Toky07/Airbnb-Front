import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import { getCartService } from '../../core/services/cart.service';
import type { Cart } from '../../core/types/cart.types';
import { CartContext, type CartContextValue } from '../context/cart.context';

type CartProviderProps = {
  children: ReactNode;
};

const CartProvider = ({ children }: CartProviderProps) => {
  const { isAuthenticated } = useAuth();
  const cartService = useMemo(() => getCartService(), []);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    const result = await cartService.getCart();
    if (result.success) {
      setCart(result.cart);
    }
  }, [cartService]);

  const syncCart = useCallback((nextCart: Cart) => {
    setCart(nextCart);
  }, []);

  const mergeCartIfNeeded = useCallback(async () => {
    const result = await cartService.merge();
    if (result.success) {
      setCart(result.cart);
    }
  }, [cartService]);

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
      const result = await cartService.addReservation({
        itemType: 'reservation',
        ...payload,
      });

      if (!result.success) {
        return { success: false, error: result.error };
      }

      setCart(result.cart);
      return { success: true };
    },
    [cartService],
  );

  const removeItem: CartContextValue['removeItem'] = useCallback(
    async (itemId) => {
      const result = await cartService.removeItem(itemId);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      setCart(result.cart);
      return { success: true };
    },
    [cartService],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isLoading,
      refreshCart,
      syncCart,
      addReservation,
      removeItem,
      itemCount: cart?.itemCount ?? 0,
    }),
    [cart, isLoading, refreshCart, syncCart, addReservation, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
