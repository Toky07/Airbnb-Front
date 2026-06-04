import { Link } from 'react-router';
import { BrandLogo, PageContainer } from '../../../../shared/ui';
import { headerNavLinks } from '../../core/config/header-nav.config';

const SiteHeader = () => (
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
          to="/search"
          className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 sm:inline-flex"
        >
          Explorer
        </Link>
      </div>
    </PageContainer>
  </header>
);

export default SiteHeader;
