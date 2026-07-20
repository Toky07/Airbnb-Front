import { Link } from 'react-router';
import { useRegisterForm } from '../hooks/useRegisterForm';
import {
  AuthFormHeader,
  AuthFormShell,
  Button,
  FormErrorAlert,
  TextField,
} from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';

const RegisterPage = () => {
  usePageTitle('Inscription');
  const { form, update, error, success, loading, submit, loginHref } = useRegisterForm();

  if (success) {
    return (
      <AuthFormShell maxWidth="lg">
        <AuthFormHeader
          title="Inscription enregistrée"
          description="Un email vous a été envoyé avec un lien pour définir votre mot de passe et activer votre compte."
        />
        <Link
          to={loginHref}
          className="mt-6 inline-flex w-full justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
        >
          Aller à la connexion
        </Link>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell onSubmit={submit} maxWidth="lg">
      <AuthFormHeader
        title="Devenir hôte"
        description="Créez votre compte — vous recevrez un email pour définir votre mot de passe"
      />

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
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Téléphone"
          value={form.phoneNumber}
          onChange={(event) => update('phoneNumber', event.target.value)}
          required
          fullWidth
        />
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
    </AuthFormShell>
  );
};

export default RegisterPage;
