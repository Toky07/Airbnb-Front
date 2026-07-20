import { type FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router';
import { notifyMessages, useNotification } from '../../../../shared/notifications';
import { getRegisterUseCase } from '../../application/composition/auth.composition';
import { buildAuthRouteWithRedirect } from '../../core/services/resolve-post-login-redirect';

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

const emptyForm: RegisterForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
};

export function useRegisterForm() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const loginHref = buildAuthRouteWithRedirect('/login', redirect);
  const [form, setForm] = useState<RegisterForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success: notifySuccess } = useNotification();

  const update = (field: keyof RegisterForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await getRegisterUseCase().execute(form);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    notifySuccess(notifyMessages.auth.registered(), { duration: 8000 });
  };

  return {
    form,
    update,
    error,
    success,
    loading,
    submit,
    loginHref,
  };
}
