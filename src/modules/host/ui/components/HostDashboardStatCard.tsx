import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type HostDashboardStatCardProps = {
  icon: IconProp;
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
  <div className="relative overflow-hidden rounded-2xl border border-ink/8 bg-surface p-6 soft-shadow">
    <div className="flex items-center gap-5">
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <FontAwesomeIcon icon={icon} className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold uppercase tracking-wider text-ink/40">{label}</p>
        <p className="mt-1 font-display text-3xl font-bold text-ink">{value}</p>
      </div>
    </div>
  </div>
);

export default HostDashboardStatCard;
