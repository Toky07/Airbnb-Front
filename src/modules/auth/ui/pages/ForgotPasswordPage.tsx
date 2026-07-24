import { Link } from 'react-router';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';
import { AuthFormHeader, AuthFormShell, Button, FormErrorAlert, TextField } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';

const ForgotPasswordPage = () => {
  usePageTitle('Mot de passe oublié');
  const { email, setEmail, error, success, loading, submit } = useForgotPasswordForm();

  return (
    <AuthFormShell onSubmit={submit}>
      <AuthFormHeader
        title="Mot de passe oublié"
        description="Entrez votre email pour recevoir un lien de réinitialisation."
      />

      {error ? <FormErrorAlert message={error} className="mb-6" /> : null}
      {success ? (
        <p className="mb-6 text-sm text-emerald-700">
          Si un compte actif existe pour cet email, un lien de réinitialisation a été envoyé.
        </p>
      ) : null}

      {!success ? (
        <>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? 'Envoi…' : 'Envoyer le lien'}
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

export default ForgotPasswordPage;
