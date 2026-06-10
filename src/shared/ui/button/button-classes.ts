import type { ButtonSize, ButtonVariant } from './types';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)]',
  secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
  ghost: 'text-slate-700 hover:bg-slate-100',
  outline: 'border border-slate-900 text-slate-900 hover:bg-slate-50',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export function getButtonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  extra?: string,
): string {
  return [
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition',
    variantClasses[variant],
    sizeClasses[size],
    extra ?? '',
  ].join(' ');
}
