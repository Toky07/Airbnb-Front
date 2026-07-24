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
      'rounded-2xl px-6 py-12 text-center sm:py-16',
      dashed
        ? 'border border-dashed border-line bg-surface/80 soft-shadow'
        : 'surface soft-shadow',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <p className="font-display text-lg font-medium text-ink/80">{title}</p>
    {description ? <p className="mt-2 text-sm text-ink/60">{description}</p> : null}
    {action ? <div className="mt-8">{action}</div> : null}
  </div>
);

export default EmptyState;
