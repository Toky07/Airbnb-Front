import {
  paymentStatusConfig,
  type PaymentStatusKey,
} from '../constants/reservation-status.config';

type PaymentBadgeProps = {
  status: string;
};

const PaymentBadge = ({ status }: PaymentBadgeProps) => {
  const config = paymentStatusConfig[status as PaymentStatusKey] ?? paymentStatusConfig.pending;

  return (
    <span
      className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default PaymentBadge;
