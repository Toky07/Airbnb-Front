import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { useMemo } from 'react';
import StripeCheckoutForm from './StripeCheckoutForm';

type StripePaymentPanelProps = {
  clientSecret: string;
  publishableKey: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const stripeCache = new Map<string, Promise<Stripe | null>>();

function getStripePromise(publishableKey: string): Promise<Stripe | null> {
  if (!stripeCache.has(publishableKey)) {
    stripeCache.set(publishableKey, loadStripe(publishableKey));
  }

  return stripeCache.get(publishableKey)!;
}

const StripePaymentPanel = ({
  clientSecret,
  publishableKey,
  onSuccess,
  onCancel,
}: StripePaymentPanelProps) => {
  const stripePromise = useMemo(
    () => getStripePromise(publishableKey),
    [publishableKey],
  );

  if (!publishableKey) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Le paiement en ligne n&apos;est pas configuré pour le moment.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripeCheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
};

export default StripePaymentPanel;
