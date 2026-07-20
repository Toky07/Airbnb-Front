import { Link, useSearchParams } from 'react-router';
import { useSetPasswordForm } from '../hooks/useSetPasswordForm';
import { Button, PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';

const SetPasswordPage = () => {
  usePageTitle('Définir le mot de passe');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    email,
    error,
    loading,
    validating,
    submit,
    canShowForm,
  } = useSetPasswordForm(token);

  return (
    <PageContainer className="flex min-h-[70vh] items-center justify-center py-12">
      <form onSubmit={submit} className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Définir votre mot de passe</h1>
          <p className="mt-2 text-sm text-slate-500">
            {email ? `Compte : ${email}` : 'Choisissez un mot de passe pour activer votre accès.'}
          </p>
        </div>

        {validating ? (
          <p className="text-center text-sm text-slate-500">Vérification du lien…</p>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {canShowForm ? (
          <>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  required
                  minLength={6}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Confirmation</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  required
                  minLength={6}
                />
              </label>
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={loading}>
              {loading ? 'Activation…' : 'Activer mon compte'}
            </Button>
          </>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">
            Retour à la connexion
          </Link>
        </p>
      </form>
    </PageContainer>
  );
};

export default SetPasswordPage;
