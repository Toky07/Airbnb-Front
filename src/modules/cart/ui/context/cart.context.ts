import { createContext } from 'react';
import type { Cart } from '../core/types/cart.types';

export type CartContextValue = {
  cart: Cart | null;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
  syncCart: (cart: Cart) => void;
  addReservation: (payload: {
    roomId: number;
    startDate: string;
    endDate: string;
    guestCount: number;
  }) => Promise<{ success: boolean; error?: string }>;
  removeItem: (itemId: number) => Promise<{ success: boolean; error?: string }>;
  itemCount: number;
};

export const CartContext = createContext<CartContextValue | null>(null);
