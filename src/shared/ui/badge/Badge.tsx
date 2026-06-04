import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'default' | 'overlay' | 'brand';
  className?: string;
};

const variantClasses = {
  default: 'bg-slate-100 text-slate-700',
  overlay: 'bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm',
  brand: 'border border-white/20 bg-white/10 text-white/90 backdrop-blur-sm',
};

const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => (
  <span
    className={[
      'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold',
      variantClasses[variant],
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export default Badge;
