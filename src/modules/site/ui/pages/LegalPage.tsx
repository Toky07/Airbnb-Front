import { Link, useParams } from 'react-router';
import { PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { getLegalDocument } from '../../core/content/legal-documents';
import { SITE_PATHS } from '../../core/config/site-urls';

const LegalPage = () => {
  const { slug } = useParams();
  const document = getLegalDocument(slug);
  usePageTitle(document?.title ?? 'Document introuvable');

  if (!document) {
    return (
      <PageContainer className="page-mist py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold text-ink">Document introuvable</h1>
          <p className="mt-3 text-ink/60">Cette page légale n’existe pas.</p>
          <Link to={SITE_PATHS.help} className="mt-6 inline-block text-sm font-semibold text-brand">
            Centre d’aide
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="page-mist py-12 lg:py-16">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Informations légales</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {document.title}
        </h1>
        <p className="mt-3 text-sm text-ink/50">Dernière mise à jour : {document.updatedAt}</p>

        <div className="mt-10 space-y-10">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-semibold text-ink">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mt-3 text-sm leading-relaxed text-ink/70">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </PageContainer>
  );
};

export default LegalPage;
