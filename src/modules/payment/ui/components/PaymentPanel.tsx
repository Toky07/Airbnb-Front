import type { PaymentPanelProps } from '../../application/ports/payment-panel.registry';
import { PAYMENT_PROVIDER } from '../../core/types/payment.types';
import StripePaymentPanel from '../../infrastructure/stripe/StripePaymentPanel';
import UnsupportedPaymentPanel from './UnsupportedPaymentPanel';

const PaymentPanel = ({ session, onSuccess, onCancel }: PaymentPanelProps) => {
  switch (session.provider) {
    case PAYMENT_PROVIDER.STRIPE:
      return (
        <StripePaymentPanel session={session} onSuccess={onSuccess} onCancel={onCancel} />
      );
    default:
      return <UnsupportedPaymentPanel provider={session.provider} />;
  }
};

export default PaymentPanel;
