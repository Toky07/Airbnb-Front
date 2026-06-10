import { Link } from "react-router";
import { type Reservation, getReservationStatusLabel } from "../../../reservation/core/types/reservation.types";
import { formatPricePerNight } from "../../../rooms/core/types/room.types";

export default function PurchaseCard({ reservation }: { reservation: Reservation }) {
    return (
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Réservation #{reservation.id}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              Chambre #{reservation.roomId}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Du {reservation.startDate} au {reservation.endDate}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {reservation.guestCount} voyageur{reservation.guestCount > 1 ? 's' : ''} ·{' '}
              {reservation.nights} nuit{reservation.nights > 1 ? 's' : ''}
            </p>
          </div>
  
          <div className="text-right">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {getReservationStatusLabel(reservation.status)}
            </span>
            <p className="mt-3 text-lg font-bold text-slate-900">
              {formatPricePerNight(reservation.totalPrice)}
            </p>
            <Link
              to={`/rooms/${reservation.roomId}`}
              className="mt-2 inline-block text-sm font-medium text-brand hover:text-brand-dark"
            >
              Voir la chambre
            </Link>
          </div>
        </div>
      </article>
    );
  }