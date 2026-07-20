import { type FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import type { PaymentSession } from '../../../payment/core/types/payment.types';
import {
  getCompleteCheckoutUseCase,
  getInitiateCheckoutUseCase,
} from '../../application/composition/cart.composition';
import type { UpdateCartItemPayload } from '../../core/types/cart.types';
import { formatCartPrice } from '../../core/types/cart.types';
import { useCart } from './useCart';

export type CheckoutStep = 'review' | 'payment' | 'success';

export function useCartCheckout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, isLoading, removeItem, updateItem, syncCart } = useCart();
  const initiateCheckoutUseCase = useMemo(() => getInitiateCheckoutUseCase(), []);
  const completeCheckoutUseCase = useMemo(() => getCompleteCheckoutUseCase(), []);
  const [step, setStep] = useState<CheckoutStep>('review');
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);

  const totalLabel = useMemo(
    () => formatCartPrice(cart?.totalPrice ?? 0),
    [cart?.totalPrice],
  );

  const itemCount = cart?.itemCount ?? 0;

  const handleRemove = async (itemId: number) => {
    setRemovingId(itemId);
    setError(null);
    const result = await removeItem(itemId);
    setRemovingId(null);

    if (!result.success) {
      setError(result.error ?? 'Impossible de retirer l’article.');
    }
  };

  const handleUpdate = async (itemId: number, payload: UpdateCartItemPayload) => {
    setUpdatingId(itemId);
    setError(null);
    const result = await updateItem(itemId, payload);
    setUpdatingId(null);
    return result;
  };

  const handleCheckout = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/cart')}`);
      return;
    }

    setLoading(true);
    const result = await initiateCheckoutUseCase.execute(cart);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setPaymentSession(result.session);
    setStep('payment');
  };

  const handlePaymentSuccess = async () => {
    if (!paymentSession) {
      return;
    }

    const result = await completeCheckoutUseCase.execute(paymentSession.paymentId);

    if (result.success) {
      syncCart(result.cart);
    }

    setStep('success');
  };

  return {
    cart,
    isLoading,
    step,
    loading,
    removingId,
    updatingId,
    error,
    paymentSession,
    totalLabel,
    itemCount,
    isAuthenticated,
    handleRemove,
    handleUpdate,
    handleCheckout,
    handlePaymentSuccess,
    setStep,
    navigate,
  };
}
