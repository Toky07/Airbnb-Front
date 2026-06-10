import { type FormEvent, useState } from 'react';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Button } from '../../../../shared/ui';

type StripeCheckoutFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const StripeCheckoutForm = ({ onSuccess, onCancel }: StripeCheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? 'Le paiement a échoué.');
      return;
    }

    if (result.paymentIntent?.status === 'succeeded') {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={!stripe || submitting}>
        {submitting ? 'Paiement en cours…' : 'Payer maintenant'}
      </Button>

      <button
        type="button"
        onClick={onCancel}
        className="w-full text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        Modifier les dates
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
