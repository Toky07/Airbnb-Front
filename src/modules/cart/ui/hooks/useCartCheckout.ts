import { type FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import type { PaymentIntentResult } from '../../../payment/core/types/payment.types';
import { getCartService } from '../../core/services/cart.service';
import { formatCartPrice } from '../../core/types/cart.types';
import { useCart } from './useCart';

export type CheckoutStep = 'review' | 'payment' | 'success';

export function useCartCheckout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, isLoading, removeItem, syncCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('review');
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResult | null>(null);

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

  const handleCheckout = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/cart')}`);
      return;
    }

    if (!cart?.items.length) {
      setError('Votre panier est vide.');
      return;
    }

    setLoading(true);
    const result = await getCartService().checkout();
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setPaymentIntent(result.intent);
    setStep('payment');
  };

  const handlePaymentSuccess = async () => {
    if (!paymentIntent) {
      return;
    }

    const result = await getCartService().completeCheckout(paymentIntent.paymentId);

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
    error,
    paymentIntent,
    totalLabel,
    itemCount,
    isAuthenticated,
    handleRemove,
    handleCheckout,
    handlePaymentSuccess,
    setStep,
    navigate,
  };
}
