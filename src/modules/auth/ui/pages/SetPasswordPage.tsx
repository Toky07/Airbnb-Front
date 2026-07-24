import { Link, useSearchParams } from 'react-router';
import { useSetPasswordForm } from '../hooks/useSetPasswordForm';
import {
  AuthFormHeader,
  AuthFormShell,
  Button,
  FormErrorAlert,
  TextField,
} from '../../../../shared/ui';
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
    <AuthFormShell onSubmit={submit} maxWidth="lg">
      <AuthFormHeader
        title="Définir votre mot de passe"
        description={
          email ? `Compte : ${email}` : 'Choisissez un mot de passe pour activer votre accès.'
        }
      />

      {validating ? <p className="text-center text-sm text-ink/50">Vérification du lien…</p> : null}
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
            {loading ? 'Activation…' : 'Activer mon compte'}
          </Button>
        </>
      ) : null}

      <p className="mt-6 text-center text-sm text-ink/50">
        <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">
          Retour à la connexion
        </Link>
      </p>
    </AuthFormShell>
  );
};

export default SetPasswordPage;
