import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type HostDashboardStatCardProps = {
  icon: IconDefinition;
  label: string;
  value: string | number;
  accent: string;
};

const HostDashboardStatCard = ({
  icon,
  label,
  value,
  accent,
}: HostDashboardStatCardProps) => (
  <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center gap-5">
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
        <FontAwesomeIcon icon={icon} className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

export default HostDashboardStatCard;
