type StatCardProps = {
  value: string;
  label: string;
  highlight?: boolean;
};

const StatCard = ({ value, label, highlight = true }: StatCardProps) => (
  <div className="rounded-2xl border border-line bg-mist/60 p-6 text-center">
    <p
      className={[
        'font-display text-3xl font-extrabold tracking-tight sm:text-4xl',
        highlight ? 'text-brand' : 'text-ink',
      ].join(' ')}
    >
      {value}
    </p>
    <p className="mt-1 text-sm font-medium text-ink/60">{label}</p>
  </div>
);

export default StatCard;
