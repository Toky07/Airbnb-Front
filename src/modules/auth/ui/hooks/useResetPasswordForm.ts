import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  getResetPasswordUseCase,
  getValidatePasswordResetUseCase,
} from '../../application/composition/auth.composition';

export function useResetPasswordForm(token: string) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [canShowForm, setCanShowForm] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function validate() {
      if (!token.trim()) {
        setError('Lien invalide ou expiré.');
        setValidating(false);
        return;
      }

      const result = await getValidatePasswordResetUseCase().execute(token);
      if (cancelled) {
        return;
      }

      if (!result.valid) {
        setError('Lien invalide ou expiré.');
        setCanShowForm(false);
      } else {
        setEmail(result.email ?? '');
        setCanShowForm(true);
      }

      setValidating(false);
    }

    void validate();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const submit = async (event: FormEvent) => {
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
    try {
      const result = await getResetPasswordUseCase().execute(token, password);
      if (!result.success) {
        setError(result.error);
        return;
      }

      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
