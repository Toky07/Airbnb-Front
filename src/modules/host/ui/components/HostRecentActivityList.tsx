import type { HostReservationActivity } from '../../core/types/host-booking.types';
import { formatHostCurrency, formatHostDate } from '../utils/host-formatters';

type HostRecentActivityListProps = {
  activities: HostReservationActivity[];
};

const HostRecentActivityList = ({ activities }: HostRecentActivityListProps) => {
  if (!activities.length) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
        Aucune réservation récente pour le moment.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
      {activities.map((activity) => (
        <li key={activity.id} className="flex items-start justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{activity.label}</p>
            <p className="mt-1 text-sm text-slate-500">{formatHostDate(activity.createdAt)}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-slate-900">
            {formatHostCurrency(activity.totalPrice)}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default HostRecentActivityList;
