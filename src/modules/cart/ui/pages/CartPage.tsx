import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import { formatPaymentAmount } from '../../../payment/core/types/payment.types';
import type { PaymentIntentResult } from '../../../payment/core/types/payment.types';
import StripePaymentPanel from '../../../payment/ui/components/StripePaymentPanel';
import { getCartService } from '../../core/services/cart.service';
import { formatCartPrice } from '../../core/types/cart.types';
import { mapCartItemToProductDetails } from '../../core/utils/map-cart-item-details';
import { useCart } from '../hooks/useCart';
import { Button, PageContainer } from '../../../../shared/ui';
import {
  StayProductCard,
  parseProductLabel,
} from '../../../../shared/ui/product/StayProductCard';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';
import { type FormEvent, useMemo, useState } from 'react';

type CheckoutStep = 'review' | 'payment' | 'success';

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

  if (isLoading) {
    return (
      <PublicPageLayout>
        <PageContainer className="py-16">
          <div className="h-56 animate-pulse rounded-3xl bg-slate-100" />
        </PageContainer>
      </PublicPageLayout>
    );
  }

  if (step === 'success') {
    return (
      <PublicPageLayout>
        <PageContainer className="py-16">
          <div className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-10 text-center shadow-lg shadow-emerald-100/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
              ✓
            </div>
            <h1 className="mt-6 text-2xl font-bold text-emerald-900">Paiement confirmé</h1>
            <p className="mt-3 text-sm leading-6 text-emerald-800">
              Vos réservations ont été confirmées. Retrouvez-les dans votre espace achats.
            </p>
            <Button type="button" className="mt-8 w-full" onClick={() => navigate('/account/purchases')}>
              Voir mes achats
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="mt-3 w-full"
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
          <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div className="border-b border-slate-100 bg-slate-50 px-8 py-6">
              <h1 className="text-2xl font-bold text-slate-900">Paiement sécurisé</h1>
              <p className="mt-2 text-sm text-slate-500">
                Montant total : {formatPaymentAmount(paymentIntent.amount, paymentIntent.currency)}
              </p>
            </div>
            <div className="p-8">
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
      <div className="bg-gradient-to-b from-slate-50 via-white to-white">
        <PageContainer className="py-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Réservation
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Votre panier
              </h1>
              <p className="mt-3 text-base text-slate-600">
                Vérifiez vos séjours sélectionnés avant de procéder au paiement sécurisé.
              </p>
            </div>

            {!cart?.items.length ? (
              <div className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-white/80 p-12 text-center shadow-sm">
                <p className="text-lg font-medium text-slate-700">Votre panier est vide</p>
                <p className="mt-2 text-sm text-slate-500">
                  Explorez nos hébergements et ajoutez un séjour à votre panier.
                </p>
                <Button type="button" className="mt-8" onClick={() => navigate('/search')}>
                  Rechercher une chambre
                </Button>
              </div>
            ) : (
              <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                <div className="space-y-5">
                  {cart.items.map((item) => {
                    const details = mapCartItemToProductDetails(item);
                    const fallback = parseProductLabel(item.label);

                    return (
                      <StayProductCard
                        key={item.id}
                        badge={item.itemType === 'reservation' ? 'Séjour' : 'Service'}
                        details={{
                          ...details,
                          roomName: details.roomName || fallback.roomName,
                          propertyName: details.propertyName || fallback.propertyName,
                        }}
                        footerLink={
                          item.roomId
                            ? { to: `/rooms/${item.roomId}`, label: 'Voir la chambre' }
                            : undefined
                        }
                        action={
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            disabled={removingId === item.id}
                            className="rounded-full px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {removingId === item.id ? 'Suppression…' : 'Retirer'}
                          </button>
                        }
                      />
                    );
                  })}
                </div>

                <aside className="lg:sticky lg:top-24">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                    <div className="border-b border-slate-100 bg-slate-900 px-6 py-5 text-white">
                      <h2 className="text-lg font-semibold">Récapitulatif</h2>
                      <p className="mt-1 text-sm text-slate-300">
                        {itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier
                      </p>
                    </div>

                    <div className="space-y-4 px-6 py-5">
                      {cart.items.map((item) => {
                        const parsed = parseProductLabel(item.label);
                        return (
                          <div key={`summary-${item.id}`} className="flex items-start justify-between gap-4 text-sm">
                            <div>
                              <p className="font-medium text-slate-900">
                                {item.roomName ?? parsed.roomName}
                              </p>
                              <p className="text-slate-500">{item.propertyName ?? parsed.propertyName}</p>
                            </div>
                            <p className="font-semibold text-slate-900">
                              {formatCartPrice(item.totalPrice)}
                            </p>
                          </div>
                        );
                      })}

                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">Total</span>
                          <span className="text-2xl font-bold text-slate-900">{totalLabel}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Taxes et frais inclus</p>
                      </div>

                      {error ? (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {error}
                        </p>
                      ) : null}

                      <form onSubmit={handleCheckout}>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading
                            ? 'Préparation…'
                            : isAuthenticated
                              ? 'Procéder au paiement'
                              : 'Se connecter pour payer'}
                        </Button>
                      </form>

                      {!isAuthenticated ? (
                        <p className="text-center text-xs text-slate-500">
                          Pas encore de compte ?{' '}
                          <Link
                            to="/register?redirect=%2Fcart"
                            className="font-semibold text-brand hover:text-brand-dark"
                          >
                            Créer un compte
                          </Link>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </PageContainer>
      </div>
    </PublicPageLayout>
  );
};

export default CartPage;
