import { type FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { getAuthService } from '../../core/services/auth.service';
import { resolvePostLoginRedirect } from '../../core/services/resolve-post-login-redirect';
import { useAuth } from '../hooks/useAuth';
import { Button, PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { notifyMessages, useNotification } from '../../../../shared/notifications';

const LoginPage = () => {
  usePageTitle('Connexion');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { success: notifySuccess } = useNotification();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await getAuthService().login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    const session = await login(result.token);
    notifySuccess(notifyMessages.auth.login());
    navigate(resolvePostLoginRedirect(session, redirect));
  };

  return (
    <PageContainer className="flex min-h-[70vh] items-center justify-center py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Connexion hôte</h1>
          <p className="mt-2 text-sm text-slate-500">Gérez votre établissement et vos chambres</p>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
            />
          </label>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-semibold text-brand hover:text-brand-dark">
            S&apos;inscrire
          </Link>
        </p>
      </form>
    </PageContainer>
  );
};

export default LoginPage;
