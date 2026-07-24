import { Link, useSearchParams } from 'react-router';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';
import {
  AuthFormHeader,
  AuthFormShell,
  Button,
  FormErrorAlert,
  TextField,
} from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';

const ResetPasswordPage = () => {
  usePageTitle('Réinitialiser le mot de passe');
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
  } = useResetPasswordForm(token);

  return (
    <AuthFormShell onSubmit={submit} maxWidth="lg">
      <AuthFormHeader
        title="Nouveau mot de passe"
        description={email ? `Compte : ${email}` : 'Choisissez un nouveau mot de passe.'}
      />

      {validating ? <p className="text-center text-sm text-slate-500">Vérification du lien…</p> : null}
      {error ? <FormErrorAlert message={error} className="mb-6" /> : null}

      {canShowForm ? (
        <>
          <div className="space-y-4">
            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
            <TextField
              label="Confirmation"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? 'Enregistrement…' : 'Réinitialiser'}
          </Button>
        </>
      ) : null}

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">
          Retour à la connexion
        </Link>
      </p>
    </AuthFormShell>
  );
};

export default ResetPasswordPage;
