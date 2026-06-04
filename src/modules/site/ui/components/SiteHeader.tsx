import { Link } from 'react-router';
import { BrandLogo, PageContainer } from '../../../../shared/ui';
import { headerNavLinks } from '../../core/config/header-nav.config';
import { useAuth } from '../../../auth/ui/hooks/useAuth';

const SiteHeader = () => {
  const { isAuthenticated, isHost, email, logout } = useAuth();

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
          {isAuthenticated && isHost ? (
            <>
              <Link
                to="/host"
                className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 sm:inline-flex"
              >
                Espace hôte
              </Link>
              <span className="hidden text-sm text-slate-500 lg:inline">{email}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
              >
                Devenir hôte
              </Link>
            </>
          )}
        </div>
      </PageContainer>
    </header>
  );
};

export default SiteHeader;
