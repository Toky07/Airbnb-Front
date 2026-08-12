import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
};

export type ButtonLinkVariant = ButtonVariant | 'nav' | 'nav-cta';

export type ButtonLinkProps = {
  href: string;
  variant?: ButtonLinkVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
};
