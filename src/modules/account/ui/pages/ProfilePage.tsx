import { Link } from 'react-router';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import { Button, ImageFileInput, PageContainer } from '../../../../shared/ui';
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
    <PageContainer className="py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-brand">Compte</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Mon profil</h1>
          <p className="mt-2 text-slate-500">
            Gérez vos informations personnelles et votre photo de profil.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-8">
            <p className="mb-1 text-lg font-semibold text-slate-900">{displayName}</p>
            <p className="mb-6 text-sm text-slate-500">{email}</p>
            <ImageFileInput
              label="Photo de profil"
              value={avatarPreview || session.profile?.avatar || ''}
              fallbackInitials={initials}
              onChange={setAvatarPreview}
              onFileSelect={setAvatarFile}
            />
          </div>

          {error ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Prénom</span>
              <input
                value={form.firstName}
                onChange={(event) => update('firstName', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nom</span>
              <input
                value={form.lastName}
                onChange={(event) => update('lastName', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                required
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                value={email ?? ''}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Téléphone</span>
              <input
                value={form.phoneNumber}
                onChange={(event) => update('phoneNumber', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                required
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
            {session.canAccessHostDashboard ? (
              <Link
                to="/host"
                className="inline-flex items-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
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
