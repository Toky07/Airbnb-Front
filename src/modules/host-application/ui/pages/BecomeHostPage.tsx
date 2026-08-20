import {
  Button,
  FormErrorAlert,
  PageContainer,
  PageSkeleton,
  TextField,
} from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import {
  HOST_APPLICATION_STATUS,
  getHostApplicationStatusLabel,
} from '../../core/types/host-application.types';
import { useBecomeHostApplication } from '../hooks/useBecomeHostApplication';

const BecomeHostPage = () => {
  usePageTitle('Devenir hôte');
  const {
    application,
    form,
    loading,
    saving,
    error,
    update,
    submit,
    openHostSpace,
  } = useBecomeHostApplication();

  if (loading) {
    return (
      <PageContainer className="page-mist py-10">
        <PageSkeleton className="mx-auto h-80 max-w-2xl" />
      </PageContainer>
    );
  }

  const pending = application?.status === HOST_APPLICATION_STATUS.PENDING;
  const rejected = application?.status === HOST_APPLICATION_STATUS.REJECTED;
  const approved = application?.status === HOST_APPLICATION_STATUS.APPROVED;

  return (
    <PageContainer className="page-mist py-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Hébergement
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
          Devenir hôte
        </h1>
        <p className="mt-2 text-ink/50">
          Décrivez votre projet. Un administrateur examine chaque demande, puis
          vous recevez la réponse par email.
        </p>

        {pending ? (
          <div className="mt-8 rounded-2xl border border-line bg-surface p-6 soft-shadow sm:p-8">
            <p className="text-sm font-semibold text-brand">
              {getHostApplicationStatusLabel(application.status)}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold text-ink">
              Demande en cours d’examen
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              Ville : {application.city}
              {application.propertyName ? ` · ${application.propertyName}` : ''}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm text-ink/80">
              {application.message}
            </p>
            <p className="mt-6 text-sm text-ink/50">
              Nous vous écrirons dès qu’une décision sera prise. Inutile de
              renvoyer une demande tant que celle-ci est ouverte.
            </p>
          </div>
        ) : null}

        {approved ? (
          <div className="mt-8 rounded-2xl border border-line bg-surface p-6 soft-shadow sm:p-8">
            <p className="text-sm font-semibold text-brand">Demande acceptée</p>
            <p className="mt-2 text-sm text-ink/70">
              Votre compte hôte est activé. Accédez à votre espace pour créer
              votre établissement.
            </p>
            <Button type="button" className="mt-6" onClick={() => void openHostSpace()}>
              Ouvrir l’espace hôte
            </Button>
          </div>
        ) : null}

        {rejected ? (
          <div className="mt-8 rounded-2xl border border-line bg-surface p-6 soft-shadow sm:p-8">
            <p className="text-sm font-semibold text-ink/70">
              Demande refusée
            </p>
            {application.reviewComment ? (
              <p className="mt-2 text-sm text-ink/70">
                Motif : {application.reviewComment}
              </p>
            ) : null}
            <p className="mt-4 text-sm text-ink/50">
              Vous pouvez déposer une nouvelle demande ci-dessous.
            </p>
          </div>
        ) : null}

        {!pending && !approved ? (
          <form
            onSubmit={submit}
            className="mt-8 rounded-2xl border border-line bg-surface p-6 soft-shadow sm:p-8"
          >
            {error ? <FormErrorAlert message={error} className="mb-6" /> : null}

            <div className="grid gap-4">
              <TextField
                label="Ville"
                value={form.city}
                onChange={(event) => update('city', event.target.value)}
                required
                placeholder="Paris"
              />
              <TextField
                label="Nom de l’établissement envisagé"
                value={form.propertyName}
                onChange={(event) => update('propertyName', event.target.value)}
                placeholder="Optionnel"
              />
              <TextField
                multiline
                label="Présentez votre projet"
                value={form.message}
                onChange={(event) => update('message', event.target.value)}
                required
                rows={6}
                placeholder="Type de logement, capacité, ce que vous souhaitez proposer aux voyageurs…"
              />
            </div>

            <Button type="submit" className="mt-6" disabled={saving}>
              {saving ? 'Envoi…' : 'Envoyer ma demande'}
            </Button>
          </form>
        ) : null}
      </div>
    </PageContainer>
  );
};

export default BecomeHostPage;
