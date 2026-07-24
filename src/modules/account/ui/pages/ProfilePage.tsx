import { Link } from 'react-router';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import { Button, FormErrorAlert, ImageFileInput, PageContainer, PhoneInput, TextField } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { getUserDisplayName, getUserInitials } from '../../../../shared/utils/user-display';
import { useProfileForm } from '../hooks/useProfileForm';

const ProfilePage = () => {
  usePageTitle('Mon profil');
  const { email } = useAuth();
  const {
    session,
    form,
    avatarPreview,
    error,
    saving,
    setAvatarPreview,
    setAvatarFile,
    update,
    handleSubmit,
  } = useProfileForm();

  const displayName = getUserDisplayName(session);
  const initials = getUserInitials(session);

  return (
    <PageContainer className="page-mist py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Compte</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">Mon profil</h1>
          <p className="mt-2 text-ink/50">
            Gérez vos informations personnelles et votre photo de profil.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="surface rounded-2xl p-6 soft-shadow sm:p-8"
        >
          <div className="mb-8">
            <p className="mb-1 text-lg font-semibold text-ink">{displayName}</p>
            <p className="mb-6 text-sm text-ink/50">{email}</p>
            <ImageFileInput
              label="Photo de profil"
              value={avatarPreview || session.profile?.avatar || ''}
              fallbackInitials={initials}
              onChange={setAvatarPreview}
              onFileSelect={setAvatarFile}
            />
          </div>

          {error ? <FormErrorAlert message={error} className="mb-6" /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Prénom"
              value={form.firstName}
              onChange={(event) => update('firstName', event.target.value)}
              required
            />
            <TextField
              label="Nom"
              value={form.lastName}
              onChange={(event) => update('lastName', event.target.value)}
              required
            />
            <TextField label="Email" value={email ?? ''} disabled fullWidth />
            <PhoneInput
              label="Téléphone"
              value={form.phoneNumber}
              onChange={(value) => update('phoneNumber', value)}
              required
              fullWidth
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
            {session.canAccessHostDashboard ? (
              <Link
                to="/host"
                className="inline-flex items-center rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-ink/70 transition duration-200 hover:border-brand/30 hover:bg-mist"
              >
                Accéder à mon établissement
              </Link>
            ) : null}
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
