import { getButtonClassName } from './button-classes';
import type { ButtonProps } from './types';

const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) => (
  <button type={type} className={getButtonClassName(variant, size, className)} {...rest}>
    {children}
  </button>
);

export default Button;
