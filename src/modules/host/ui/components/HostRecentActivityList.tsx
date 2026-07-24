import type { HostReservationActivity } from '../../core/types/host-booking.types';
import { formatHostCurrency, formatHostDate } from '../utils/host-formatters';

type HostRecentActivityListProps = {
  activities: HostReservationActivity[];
};

const HostRecentActivityList = ({ activities }: HostRecentActivityListProps) => {
  if (!activities.length) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-mist/60 px-5 py-8 text-center text-sm text-ink/50">
        Aucune réservation récente pour le moment.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-ink/8 rounded-xl border border-ink/8 bg-surface">
      {activities.map((activity) => (
        <li key={activity.id} className="flex items-start justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{activity.label}</p>
            <p className="mt-1 text-sm text-ink/50">{formatHostDate(activity.createdAt)}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-ink">
            {formatHostCurrency(activity.totalPrice)}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default HostRecentActivityList;
