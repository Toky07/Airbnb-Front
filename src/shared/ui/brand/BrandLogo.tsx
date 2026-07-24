import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';

type BrandLogoProps = {
  variant?: 'light' | 'dark';
  to?: string;
};

const BrandLogo = ({ variant = 'dark', to = '/' }: BrandLogoProps) => (
  <Link
    to={to}
    className={[
      'flex items-center gap-2.5 transition duration-200 hover:opacity-80',
      variant === 'light' ? 'text-white' : 'text-brand',
    ].join(' ')}
  >
    <FontAwesomeIcon icon="house" className="h-9 w-9" />
    <span className="font-display hidden text-2xl font-bold tracking-tight md:block">airbnb</span>
  </Link>
);

export default BrandLogo;
