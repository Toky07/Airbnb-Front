import { useEffect, useState } from 'react';
import {
  formatHoldUntilLabel,
  isPaymentHoldExpired,
  type PaymentSession,
} from '../../../payment/core/types/payment.types';
import { formatPaymentAmount } from '../../../payment/core/utils/format-payment-amount';
import PaymentPanel from '../../../payment/ui/components/PaymentPanel';
import { InlineErrorPanel, PageContainer } from '../../../../shared/ui';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';

type CartPaymentViewProps = {
  paymentSession: PaymentSession;
  onSuccess: () => void;
  onCancel: () => void;
};

const CartPaymentView = ({ paymentSession, onSuccess, onCancel }: CartPaymentViewProps) => {
  const [holdExpired, setHoldExpired] = useState(
    isPaymentHoldExpired(paymentSession.holdUntil),
  );
  const holdLabel = formatHoldUntilLabel(paymentSession.holdUntil);

  useEffect(() => {
    if (!paymentSession.holdUntil) {
      return;
    }

    const tick = () => {
      setHoldExpired(isPaymentHoldExpired(paymentSession.holdUntil));
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [paymentSession.holdUntil]);

  return (
    <PublicPageLayout>
      <PageContainer className="page-mist py-16">
        <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-line bg-surface soft-shadow">
          <div className="border-b border-line bg-mist px-8 py-6">
            <h1 className="font-display text-2xl font-bold text-ink">Paiement sécurisé</h1>
            <p className="mt-2 text-sm text-ink/50">
              Montant total : {formatPaymentAmount(paymentSession.amount, paymentSession.currency)}
            </p>
            {holdLabel && !holdExpired ? (
              <p className="mt-2 text-sm font-medium text-ink/70">
                Réservation garantie jusqu’à {holdLabel}
              </p>
            ) : null}
          </div>
          <div className="p-8">
            {holdExpired ? (
              <div className="space-y-4">
                <InlineErrorPanel message="Le délai de réservation a expiré. Relancez le paiement depuis le panier." />
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-brand-dark"
                >
                  Retour au panier
                </button>
              </div>
            ) : (
              <PaymentPanel session={paymentSession} onSuccess={onSuccess} onCancel={onCancel} />
            )}
          </div>
        </div>
      </PageContainer>
    </PublicPageLayout>
  );
};

export default CartPaymentView;
