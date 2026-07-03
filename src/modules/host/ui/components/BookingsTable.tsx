import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { HostBookingOrder } from '../../core/types/host-booking.types';
import { formatHostCurrency, formatHostDate } from '../utils/host-formatters';
import PaymentBadge from './PaymentBadge';

type BookingsTableProps = {
  bookings: HostBookingOrder[];
  loading: boolean;
};

const BookingsTable = ({ bookings, loading }: BookingsTableProps) => {
  if (loading) {
    return (
      <div className="space-y-4 p-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-50" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
          <FontAwesomeIcon icon={faCalendarCheck} className="h-8 w-8 text-slate-300" />
        </div>
        <p className="mt-6 text-xl font-bold text-slate-900">Aucune réservation</p>
        <p className="mt-2 text-slate-500">Les réservations de vos clients apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">
              Client
            </th>
            <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">
              Date
            </th>
            <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">
              Articles
            </th>
            <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">
              Montant
            </th>
            <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">
              Statut
            </th>
            <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">
              Réf.
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {bookings.map((booking) => (
            <tr key={booking.paymentId} className="transition-colors hover:bg-slate-50/50">
              <td className="whitespace-nowrap px-8 py-5">
                <div>
                  <p className="font-bold text-slate-900">{booking.customerName}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{booking.customerEmail}</p>
                </div>
              </td>
              <td className="whitespace-nowrap px-8 py-5 text-slate-600">
                {formatHostDate(booking.paidAt)}
              </td>
              <td className="px-8 py-5">
                <span className="font-medium text-slate-900">
                  {booking.itemCount} chambre{booking.itemCount > 1 ? 's' : ''}
                </span>
                {booking.previewLabel ? (
                  <p className="mt-1 max-w-[250px] truncate text-sm text-slate-500">
                    {booking.previewLabel}
                  </p>
                ) : null}
              </td>
              <td className="whitespace-nowrap px-8 py-5 text-lg font-bold text-slate-900">
                {formatHostCurrency(booking.amount)}
              </td>
              <td className="whitespace-nowrap px-8 py-5">
                <PaymentBadge status={booking.paymentStatus} />
              </td>
              <td className="whitespace-nowrap px-8 py-5">
                <span className="font-mono text-xs text-slate-400">
                  {booking.transactionId.slice(0, 12)}...
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
