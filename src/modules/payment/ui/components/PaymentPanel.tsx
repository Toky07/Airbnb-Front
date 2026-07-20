import { getPaymentPanelRegistry } from '../../application/composition/payment.composition';
import type { PaymentPanelProps } from '../../application/ports/payment-panel.registry';
import UnsupportedPaymentPanel from './UnsupportedPaymentPanel';

const PaymentPanel = ({ session, onSuccess, onCancel }: PaymentPanelProps) => {
  const Panel = getPaymentPanelRegistry().resolve(session);

  if (!Panel) {
    return <UnsupportedPaymentPanel provider={session.provider} />;
  }

  return <Panel session={session} onSuccess={onSuccess} onCancel={onCancel} />;
};

export default PaymentPanel;
