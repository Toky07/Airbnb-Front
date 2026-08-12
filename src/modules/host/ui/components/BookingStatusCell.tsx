import PaymentBadge from './PaymentBadge';
import {
  stayStatusConfig,
  type StayStatusKey,
} from '../constants/reservation-status.config';

type BookingStatusCellProps = {
  paymentStatus: string;
  reservationStatus: string | null;
};

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  );
}

const BookingStatusCell = ({
  paymentStatus,
  reservationStatus,
}: BookingStatusCellProps) => {
  const stay =
    reservationStatus && reservationStatus in stayStatusConfig
      ? stayStatusConfig[reservationStatus as StayStatusKey]
      : null;

  return (
    <div className="flex min-w-[11rem] flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <PaymentBadge status={paymentStatus} />
        {stay ? <StatusPill label={stay.label} className={stay.className} /> : null}
      </div>
      {stay?.hint ? (
        <p className="max-w-[13rem] text-xs leading-snug text-ink/45">{stay.hint}</p>
      ) : null}
    </div>
  );
};

export default BookingStatusCell;
