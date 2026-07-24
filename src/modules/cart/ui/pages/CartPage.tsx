import { Button, PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';
import CartItemsList from '../components/CartItemsList';
import CartOrderSummary from '../components/CartOrderSummary';
import CartPaymentView from '../components/CartPaymentView';
import CartSuccessView from '../components/CartSuccessView';
import { useCartCheckout } from '../hooks/useCartCheckout';

const CartPage = () => {
  usePageTitle('Panier');
  const {
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
  } = useCartCheckout();

  if (isLoading) {
    return (
      <PublicPageLayout>
        <PageContainer className="py-16">
          <div className="h-56 animate-pulse rounded-2xl bg-mist" />
        </PageContainer>
      </PublicPageLayout>
    );
  }

  if (step === 'success') {
    return (
      <CartSuccessView
        onViewPurchases={() => navigate('/account/purchases')}
        onGoHome={() => navigate('/')}
      />
    );
  }

  if (step === 'payment' && paymentSession) {
    return (
      <CartPaymentView
        paymentSession={paymentSession}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setStep('review')}
      />
    );
  }

  return (
    <PublicPageLayout>
      <div className="page-mist">
        <PageContainer className="py-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Réservation
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Votre panier
              </h1>
              <p className="mt-3 text-base text-ink/60">
                Vérifiez vos séjours sélectionnés avant de procéder au paiement sécurisé.
              </p>
            </div>

            {!cart?.items.length ? (
              <div className="mt-12 rounded-2xl border border-dashed border-line bg-surface/80 p-12 text-center soft-shadow">
                <p className="text-lg font-medium text-ink/70">Votre panier est vide</p>
                <p className="mt-2 text-sm text-ink/50">
                  Explorez nos hébergements et ajoutez un séjour à votre panier.
                </p>
                <Button type="button" className="mt-8" onClick={() => navigate('/search')}>
                  Rechercher une chambre
                </Button>
              </div>
            ) : (
              <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                <CartItemsList
                  items={cart.items}
                  removingId={removingId}
                  updatingId={updatingId}
                  onRemove={handleRemove}
                  onUpdate={handleUpdate}
                />
                <CartOrderSummary
                  items={cart.items}
                  itemCount={itemCount}
                  totalLabel={totalLabel}
                  pricingBreakdown={cart.pricingBreakdown}
                  error={error}
                  loading={loading}
                  isAuthenticated={isAuthenticated}
                  onCheckout={handleCheckout}
                />
              </div>
            )}
          </div>
        </PageContainer>
      </div>
    </PublicPageLayout>
  );
};

export default CartPage;
