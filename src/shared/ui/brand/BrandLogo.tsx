import { faHouse } from '@fortawesome/free-solid-svg-icons';
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
      'flex items-center gap-2 transition hover:opacity-80',
      variant === 'light' ? 'text-white' : 'text-[var(--color-brand)]',
    ].join(' ')}
  >
    <FontAwesomeIcon icon={faHouse} className="h-8 w-8" />
    <span className="hidden text-xl font-bold tracking-tight md:block">airbnb</span>
  </Link>
);

export default BrandLogo;
