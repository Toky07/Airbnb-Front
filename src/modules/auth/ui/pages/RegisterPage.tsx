import { type FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { getAuthService } from '../../core/services/auth.service';
import { buildAuthRouteWithRedirect } from '../../core/services/resolve-post-login-redirect';
import { Button, PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { notifyMessages, useNotification } from '../../../../shared/notifications';

const RegisterPage = () => {
  usePageTitle('Inscription');
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const loginHref = buildAuthRouteWithRedirect('/login', redirect);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success: notifySuccess } = useNotification();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await getAuthService().register(form);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Inscription impossible.');
      return;
    }

    setSuccess(true);
    notifySuccess(notifyMessages.auth.registered(), { duration: 8000 });
  };

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  if (success) {
    return (
      <PageContainer className="flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900">Inscription enregistrée</h1>
          <p className="mt-4 text-sm text-slate-600">
            Un email vous a été envoyé avec un lien pour définir votre mot de passe et activer votre compte.
          </p>
          <Link
            to={loginHref}
            className="mt-6 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
          >
            Aller à la connexion
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex min-h-[70vh] items-center justify-center py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Devenir hôte</h1>
          <p className="mt-2 text-sm text-slate-500">
            Créez votre compte — vous recevrez un email pour définir votre mot de passe
          </p>
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
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
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

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? 'Création…' : 'Créer mon compte'}
        </Button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Déjà inscrit ?{' '}
          <Link to={loginHref} className="font-semibold text-brand hover:text-brand-dark">
            Se connecter
          </Link>
        </p>
      </form>
    </PageContainer>
  );
};

export default RegisterPage;
