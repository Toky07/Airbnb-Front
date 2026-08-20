import { Link } from 'react-router';
import { BrandLogo, PageContainer } from '../../../../shared/ui';
import { footerColumns, footerLegalLinks } from '../../core/config/footer-nav.config';

const isInternalLink = (href: string) => href.startsWith('/');

const SiteFooter = () => (
  <footer className="border-t border-ink/8 bg-mist/40">
    <PageContainer className="py-14">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <BrandLogo variant="dark" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">
            Parcourez les logements publiés depuis votre back-office et réservez
            votre prochain séjour.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h3 className="font-display text-sm font-semibold text-ink">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  {isInternalLink(link.href) ? (
                    <Link
                      to={link.href}
                      className="text-sm text-ink/60 transition duration-200 hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-ink/60 transition duration-200 hover:text-brand"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink/8 pt-8 sm:flex-row">
        <p className="text-sm text-ink/45">
          © {new Date().getFullYear()} Airbnb — Projet démo.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {footerLegalLinks.map((link) =>
            isInternalLink(link.href) ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-ink/45 transition duration-200 hover:text-ink"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-ink/45 transition duration-200 hover:text-ink"
              >
                {link.label}
              </a>
            ),
          )}
        </div>
      </div>
    </PageContainer>
  </footer>
);

export default SiteFooter;
