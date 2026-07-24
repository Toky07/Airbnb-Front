import type { ButtonSize, ButtonVariant } from './types';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/20',
  secondary:
    'border border-line bg-white text-ink hover:bg-mist focus-visible:ring-2 focus-visible:ring-brand/20',
  ghost:
    'text-ink/70 hover:bg-mist focus-visible:ring-2 focus-visible:ring-brand/20',
  outline:
    'border border-ink text-ink hover:bg-mist focus-visible:ring-2 focus-visible:ring-brand/20',
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
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus-visible:outline-none',
    variantClasses[variant],
    sizeClasses[size],
    extra ?? '',
  ].join(' ');
}
