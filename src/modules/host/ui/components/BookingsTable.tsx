import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { HostBookingOrder } from '../../core/types/host-booking.types';
import { formatHostCurrency, formatHostDate } from '../utils/host-formatters';
import PaymentBadge from './PaymentBadge';
import {
  canHostCancelBooking,
  canHostMarkNoShow,
  useHostBookingActions,
} from '../hooks/useHostBookingActions';
import { getReservationStatusLabel } from '../../../reservation/core/types/reservation.types';
import type { ReservationStatus } from '../../../reservation/core/types/reservation.types';

type BookingsTableProps = {
  bookings: HostBookingOrder[];
  loading: boolean;
  onUpdated?: () => void;
};

const BookingsTable = ({ bookings, loading, onUpdated }: BookingsTableProps) => {
  const { cancelReservation, markNoShow, pendingId, error, clearError } =
    useHostBookingActions(onUpdated);

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
          <FontAwesomeIcon icon="calendar-check" className="h-8 w-8 text-slate-300" />
        </div>
        <p className="mt-6 text-xl font-bold text-slate-900">Aucune réservation</p>
        <p className="mt-2 text-slate-500">Les réservations de vos clients apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {error ? (
        <div className="mx-8 mt-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" onClick={clearError} className="font-semibold underline">
            Fermer
          </button>
        </div>
      ) : null}
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
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {bookings.map((booking) => {
            const reservationId = booking.reservationId;
            const canCancel =
              reservationId !== null &&
              canHostCancelBooking(booking.reservationStatus, booking.checkIn);
            const canNoShow =
              reservationId !== null &&
              canHostMarkNoShow(booking.reservationStatus, booking.checkIn);
            const isPending = reservationId !== null && pendingId === reservationId;
            const reservationLabel =
              booking.reservationStatus &&
              ['confirmed', 'cancelled', 'no_show'].includes(booking.reservationStatus)
                ? getReservationStatusLabel(booking.reservationStatus as ReservationStatus)
                : null;

            return (
              <tr
                key={`${booking.paymentId}-${booking.propertyId ?? 0}-${reservationId ?? 0}`}
                className="transition-colors hover:bg-slate-50/50"
              >
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
                  {booking.propertyName ? (
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                      {booking.propertyName}
                    </p>
                  ) : null}
                  {booking.checkIn ? (
                    <p className="mt-1 text-xs text-slate-500">Arrivée : {booking.checkIn}</p>
                  ) : null}
                </td>
                <td className="whitespace-nowrap px-8 py-5 text-lg font-bold text-slate-900">
                  {formatHostCurrency(booking.amount)}
                </td>
                <td className="whitespace-nowrap px-8 py-5">
                  <div className="flex flex-col gap-2">
                    <PaymentBadge status={booking.paymentStatus} />
                    {reservationLabel ? (
                      <span className="text-xs font-medium text-slate-500">{reservationLabel}</span>
                    ) : null}
                  </div>
                </td>
                <td className="whitespace-nowrap px-8 py-5">
                  {canCancel || canNoShow ? (
                    <div className="flex flex-col gap-2">
                      {canCancel ? (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => void cancelReservation(reservationId!)}
                          className="text-left text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {isPending ? 'Traitement…' : 'Annuler'}
                        </button>
                      ) : null}
                      {canNoShow ? (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => void markNoShow(reservationId!)}
                          className="text-left text-sm font-semibold text-orange-600 hover:text-orange-700 disabled:opacity-50"
                        >
                          {isPending ? 'Traitement…' : 'No-show'}
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
