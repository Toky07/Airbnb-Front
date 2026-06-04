type StatCardProps = {
  value: string;
  label: string;
  highlight?: boolean;
};

const StatCard = ({ value, label, highlight = true }: StatCardProps) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-6 text-center">
    <p
      className={[
        'text-3xl font-extrabold tracking-tight sm:text-4xl',
        highlight ? 'text-[var(--color-brand)]' : 'text-slate-900',
      ].join(' ')}
    >
      {value}
    </p>
    <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
  </div>
);

export default StatCard;
