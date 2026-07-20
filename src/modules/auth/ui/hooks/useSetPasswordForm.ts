import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { notifyMessages, useNotification } from '../../../../shared/notifications';
import {
  getSetPasswordUseCase,
  getValidatePasswordSetupUseCase,
} from '../../application/composition/auth.composition';

const MIN_PASSWORD_LENGTH = 6;

export function useSetPasswordForm(token: string) {
  const navigate = useNavigate();
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

    void getValidatePasswordSetupUseCase()
      .execute(token)
      .then((result) => {
        if (!result.valid) {
          setError('Lien invalide ou expiré.');
          return;
        }
        setEmail(result.email ?? null);
      })
      .finally(() => setValidating(false));
  }, [token]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const result = await getSetPasswordUseCase().execute(token, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    notifySuccess(notifyMessages.auth.passwordSet());
    navigate('/login');
  };

  const canShowForm = !validating && !error?.includes('invalide') && Boolean(token);

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
