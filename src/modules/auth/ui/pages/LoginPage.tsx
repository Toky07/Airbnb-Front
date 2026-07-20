import { Link } from 'react-router';
import { buildAuthRouteWithRedirect } from '../../core/services/resolve-post-login-redirect';
import { useLoginForm } from '../hooks/useLoginForm';
import { AuthFormHeader, AuthFormShell, Button, FormErrorAlert, TextField } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';

const LoginPage = () => {
  usePageTitle('Connexion');
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    submit,
    redirect,
  } = useLoginForm();
  const registerHref = buildAuthRouteWithRedirect('/register', redirect);

  return (
    <AuthFormShell onSubmit={submit}>
      <AuthFormHeader
        title="Connexion"
        description="Connectez-vous pour réserver un séjour ou accéder à votre espace hôte"
      />

      {error ? <FormErrorAlert message={error} className="mb-6" /> : null}

      <div className="space-y-4">
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Pas encore de compte ?{' '}
        <Link to={registerHref} className="font-semibold text-brand hover:text-brand-dark">
          S&apos;inscrire
        </Link>
      </p>
    </AuthFormShell>
  );
};

export default LoginPage;
