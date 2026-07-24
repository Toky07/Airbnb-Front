import { type FormEvent, useState } from 'react';
import { getRequestPasswordResetUseCase } from '../../application/composition/auth.composition';

export function useForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await getRequestPasswordResetUseCase().execute(email.trim());
      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, error, success, loading, submit };
}
