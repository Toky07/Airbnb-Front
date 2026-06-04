import type { ButtonSize, ButtonVariant } from './types';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-brand)] text-white shadow-lg shadow-rose-500/30 hover:bg-[var(--color-brand-dark)]',
  secondary: 'bg-white text-slate-900 shadow-sm hover:bg-slate-100',
  ghost: 'text-white hover:bg-white/10',
  outline: 'border border-white/25 text-white hover:bg-white/10',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-6 py-3.5 text-sm',
};

export function getButtonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  extra?: string,
): string {
  return [
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition',
    variantClasses[variant],
    sizeClasses[size],
    extra ?? '',
  ].join(' ');
}
