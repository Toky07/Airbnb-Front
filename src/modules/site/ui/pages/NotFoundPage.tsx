import { Link } from 'react-router';
import PublicPageLayout from '../components/PublicPageLayout';
import { PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { getButtonClassName } from '../../../../shared/ui/button/button-classes';

const NotFoundPage = () => {
  usePageTitle('Page introuvable');

  return (
    <PublicPageLayout>
      <PageContainer className="page-mist flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          Erreur 404
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Page introuvable
        </h1>
        <p className="mt-4 max-w-md text-ink/60">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/" className={getButtonClassName('primary', 'md')}>
            Retour à l&apos;accueil
          </Link>
          <Link to="/search" className={getButtonClassName('secondary', 'md')}>
            Explorer les logements
          </Link>
        </div>
      </PageContainer>
    </PublicPageLayout>
  );
};

export default NotFoundPage;
