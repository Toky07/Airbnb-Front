import { formatPaymentAmount } from '../../../payment/core/types/payment.types';
import type { PaymentIntentResult } from '../../../payment/core/types/payment.types';
import StripePaymentPanel from '../../../payment/ui/components/StripePaymentPanel';
import { PageContainer } from '../../../../shared/ui';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';

type CartPaymentViewProps = {
  paymentIntent: PaymentIntentResult;
  onSuccess: () => void;
  onCancel: () => void;
};

const CartPaymentView = ({ paymentIntent, onSuccess, onCancel }: CartPaymentViewProps) => (
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
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </div>
      </div>
    </PageContainer>
  </PublicPageLayout>
);

export default CartPaymentView;
