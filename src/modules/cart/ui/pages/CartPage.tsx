import { type FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import { formatPaymentAmount } from '../../../payment/core/types/payment.types';
import type { PaymentIntentResult } from '../../../payment/core/types/payment.types';
import StripePaymentPanel from '../../../payment/ui/components/StripePaymentPanel';
import { getCartService } from '../../core/services/cart.service';
import { formatCartPrice, type CartItem } from '../../core/types/cart.types';
import { useCart } from '../hooks/useCart';
import { Button, PageContainer } from '../../../../shared/ui';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';

type CheckoutStep = 'review' | 'payment' | 'success';

function CartItemRow({
  item,
  onRemove,
  removing,
}: {
  item: CartItem;
  onRemove: (itemId: number) => void;
  removing: boolean;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {item.itemType === 'reservation' ? 'Séjour' : 'Service'}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{item.label}</h2>
          {item.itemType === 'reservation' && item.startDate && item.endDate ? (
            <p className="mt-2 text-sm text-slate-600">
              Du {item.startDate} au {item.endDate}
              {item.guestCount ? ` · ${item.guestCount} voyageur${item.guestCount > 1 ? 's' : ''}` : ''}
              {item.nights ? ` · ${item.nights} nuit${item.nights > 1 ? 's' : ''}` : ''}
            </p>
          ) : null}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">{formatCartPrice(item.totalPrice)}</p>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={removing}
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            Retirer
          </button>
        </div>
      </div>
    </article>
  );
}

const CartPage = () => {
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

  if (isLoading) {
    return (
      <PublicPageLayout>
        <PageContainer className="py-16">
          <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
        </PageContainer>
      </PublicPageLayout>
    );
  }

  if (step === 'success') {
    return (
      <PublicPageLayout>
        <PageContainer className="py-16">
          <div className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <h1 className="text-2xl font-bold text-emerald-900">Paiement confirmé</h1>
            <p className="mt-3 text-sm text-emerald-800">
              Vos réservations ont été confirmées. Vous recevrez un récapitulatif par email.
            </p>
            <Button type="button" className="mt-6" onClick={() => navigate('/account/purchases')}>
              Voir mes achats
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="mt-3"
              onClick={() => navigate('/')}
            >
              Retour à l’accueil
            </Button>
          </div>
        </PageContainer>
      </PublicPageLayout>
    );
  }

  if (step === 'payment' && paymentIntent) {
    return (
      <PublicPageLayout>
        <PageContainer className="py-16">
          <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-slate-900">Paiement sécurisé</h1>
            <p className="mt-2 text-sm text-slate-500">
              Montant total : {formatPaymentAmount(paymentIntent.amount, paymentIntent.currency)}
            </p>
            <div className="mt-6">
              <StripePaymentPanel
                clientSecret={paymentIntent.clientSecret}
                publishableKey={paymentIntent.publishableKey}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setStep('review')}
              />
            </div>
          </div>
        </PageContainer>
      </PublicPageLayout>
    );
  }

  return (
    <PublicPageLayout>
      <PageContainer className="py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-slate-900">Votre panier</h1>
          <p className="mt-2 text-sm text-slate-500">
            Ajoutez des séjours ou services, puis procédez au paiement.
          </p>

          {!cart?.items.length ? (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <p className="text-slate-600">Votre panier est vide.</p>
              <Button type="button" className="mt-6" onClick={() => navigate('/search')}>
                Rechercher une chambre
              </Button>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  removing={removingId === item.id}
                />
              ))}

              <div className="rounded-2xl bg-slate-900 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Total</span>
                  <span className="text-2xl font-bold">{totalLabel}</span>
                </div>
              </div>

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <form onSubmit={handleCheckout}>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Préparation…' : isAuthenticated ? 'Payer' : 'Se connecter pour payer'}
                </Button>
              </form>

              {!isAuthenticated ? (
                <p className="text-center text-xs text-slate-500">
                  Pas encore de compte ?{' '}
                  <Link to="/register?redirect=%2Fcart" className="font-medium text-brand hover:text-brand-dark">
                    Créer un compte
                  </Link>
                </p>
              ) : null}
            </div>
          )}
        </div>
      </PageContainer>
    </PublicPageLayout>
  );
};

export default CartPage;
