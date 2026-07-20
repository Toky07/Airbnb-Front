import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { useMemo } from 'react';
import type { PaymentPanelProps } from '../../application/ports/payment-panel.registry';
import { isStripePaymentSession } from '../../core/types/payment.types';
import StripeCheckoutForm from './StripeCheckoutForm';

const stripeCache = new Map<string, Promise<Stripe | null>>();

function getStripePromise(publishableKey: string): Promise<Stripe | null> {
  if (!stripeCache.has(publishableKey)) {
    stripeCache.set(publishableKey, loadStripe(publishableKey));
  }

  return stripeCache.get(publishableKey)!;
}

const StripePaymentPanel = ({ session, onSuccess, onCancel }: PaymentPanelProps) => {
  const stripeSession = isStripePaymentSession(session) ? session : null;
  const stripePromise = useMemo(
    () => (stripeSession ? getStripePromise(stripeSession.publishableKey) : null),
    [stripeSession],
  );

  if (!stripeSession) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Session de paiement Stripe invalide.
      </p>
    );
  }

  if (!stripeSession.publishableKey) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Le paiement en ligne n&apos;est pas configuré pour le moment.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret: stripeSession.clientSecret }}>
      <StripeCheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
};

export default StripePaymentPanel;
