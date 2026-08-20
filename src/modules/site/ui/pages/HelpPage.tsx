import { Link } from 'react-router';
import { getButtonClassName } from '../../../../shared/ui/button/button-classes';
import { PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { HELP_ARTICLES } from '../../core/content/help-articles';
import { SITE_PATHS } from '../../core/config/site-urls';

const HelpPage = () => {
  usePageTitle('Centre d’aide');

  return (
    <PageContainer className="page-mist py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Assistance</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Centre d’aide
        </h1>
        <p className="mt-3 text-base text-ink/60">
          Les réponses les plus fréquentes sur la réservation, l’annulation et l’espace hôte.
        </p>

        <dl className="mt-10 space-y-6">
          {HELP_ARTICLES.map((article) => (
            <div
              key={article.question}
              className="rounded-2xl border border-line bg-surface px-6 py-5"
            >
              <dt className="font-display text-lg font-semibold text-ink">{article.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink/70">{article.answer}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 rounded-2xl border border-dashed border-line bg-surface/80 p-8 text-center">
          <p className="font-medium text-ink">Vous ne trouvez pas votre réponse ?</p>
          <p className="mt-2 text-sm text-ink/50">Écrivez-nous, nous répondons par email.</p>
          <Link
            to={SITE_PATHS.contact}
            className={getButtonClassName('primary', 'md', 'mt-6 inline-flex')}
          >
            Contacter le support
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default HelpPage;
