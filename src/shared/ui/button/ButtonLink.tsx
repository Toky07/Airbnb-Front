import { getButtonClassName } from './button-classes';
import type { ButtonLinkProps } from './types';

const navVariantClasses: Record<string, string> = {
  nav: 'rounded-xl px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-white/10',
  'nav-cta':
    'rounded-xl bg-surface px-4 py-2 text-sm font-semibold text-ink transition duration-200 hover:bg-mist',
};

const ButtonLink = ({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: ButtonLinkProps) => {
  if (variant === 'nav' || variant === 'nav-cta') {
    return (
      <a href={href} className={[navVariantClasses[variant], className].join(' ')}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={getButtonClassName(variant, size, className)}>
      {children}
    </a>
  );
};

export default ButtonLink;
