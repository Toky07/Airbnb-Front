import { type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { getAuthService } from '../../core/services/auth.service';
import { Button, PageContainer } from '../../../../shared/ui';
import { notifyMessages, useNotification } from '../../../../shared/notifications';

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const { success: notifySuccess } = useNotification();

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setError('Lien d’activation invalide.');
      return;
    }

    void getAuthService()
      .validatePasswordSetup(token)
      .then((result) => {
        if (!result.valid) {
          setError('Lien invalide ou expiré.');
          return;
        }
        setEmail(result.email ?? null);
      })
      .finally(() => setValidating(false));
  }, [token]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const result = await getAuthService().setPassword(token, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Activation impossible.');
      return;
    }

    notifySuccess(notifyMessages.auth.passwordSet());
    navigate('/login');
  };

  return (
    <PageContainer className="flex min-h-[70vh] items-center justify-center py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
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

        {!validating && !error?.includes('invalide') && token ? (
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
