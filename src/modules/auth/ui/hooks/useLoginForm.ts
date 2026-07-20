import { type FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { notifyMessages, useNotification } from '../../../../shared/notifications';
import { getLoginUseCase } from '../../application/composition/auth.composition';
import { resolvePostLoginRedirect } from '../../core/services/resolve-post-login-redirect';
import { useAuth } from './useAuth';

export function useLoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { login } = useAuth();
  const { success: notifySuccess } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await getLoginUseCase().execute({ email, password });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    const session = await login(result.token);
    notifySuccess(notifyMessages.auth.login());
    navigate(resolvePostLoginRedirect(session, redirect));
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    submit,
    redirect,
  };
}
