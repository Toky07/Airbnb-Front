import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';
import { BrandLogo, PageContainer } from '../../../../shared/ui';
import { useCart } from '../../../cart/ui/hooks/useCart';
import { headerNavLinks } from '../../core/config/header-nav.config';
import SiteHeaderAuthActions from './SiteHeaderAuthActions';

const SiteHeader = () => {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <PageContainer className="flex h-16 items-center justify-between gap-6">
        <BrandLogo />

        <nav className="hidden items-center gap-8 md:flex">
          {headerNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            aria-label={itemCount > 0 ? `Panier (${itemCount} article${itemCount > 1 ? 's' : ''})` : 'Panier'}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-50"
          >
            <FontAwesomeIcon icon={faCartShopping} className="h-4 w-4" />
            {itemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            ) : null}
          </Link>
          <SiteHeaderAuthActions />
        </div>
      </PageContainer>
    </header>
  );
};

export default SiteHeader;
