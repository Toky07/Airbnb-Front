import type { PaymentProvider } from '../../core/types/payment.types';

type UnsupportedPaymentPanelProps = {
  provider: PaymentProvider;
};

const UnsupportedPaymentPanel = ({ provider }: UnsupportedPaymentPanelProps) => (
  <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
    Le mode de paiement « {provider} » n&apos;est pas encore pris en charge.
  </p>
);

export default UnsupportedPaymentPanel;
