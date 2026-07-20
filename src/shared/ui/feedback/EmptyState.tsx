import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  dashed?: boolean;
};

const EmptyState = ({
  title,
  description,
  action,
  className = '',
  dashed = true,
}: EmptyStateProps) => (
  <div
    className={[
      'rounded-3xl px-6 py-12 text-center sm:py-16',
      dashed ? 'border border-dashed border-slate-200 bg-white/80 shadow-sm' : 'border border-slate-200 bg-white',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <p className="text-lg font-medium text-slate-700">{title}</p>
    {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
    {action ? <div className="mt-8">{action}</div> : null}
  </div>
);

export default EmptyState;
