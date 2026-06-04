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
      'flex items-center gap-2.5 transition hover:opacity-90',
      variant === 'light' ? 'text-white' : 'text-slate-900',
    ].join(' ')}
  >
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-brand)] text-white shadow-lg shadow-rose-500/25">
      <FontAwesomeIcon icon={faHouse} className="h-4 w-4" />
    </span>
    <span className="text-lg font-bold tracking-tight">airbnb</span>
  </Link>
);

export default BrandLogo;
