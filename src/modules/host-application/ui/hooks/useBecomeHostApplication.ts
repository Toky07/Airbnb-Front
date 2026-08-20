import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import { useNotification } from '../../../../shared/notifications';
import {
  getMyHostApplicationUseCase,
  getSubmitHostApplicationUseCase,
} from '../../application/composition/host-application.composition';
import {
  HOST_APPLICATION_MESSAGE_MIN_LENGTH,
  type HostApplication,
} from '../../core/types/host-application.types';

const emptyForm = {
  city: '',
  propertyName: '',
  message: '',
};

export function useBecomeHostApplication() {
  const { session, canAccessHostDashboard, refreshSession } = useAuth();
  const navigate = useNavigate();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [application, setApplication] = useState<HostApplication | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMine = useMemo(() => getMyHostApplicationUseCase(), []);
  const submitUseCase = useMemo(() => getSubmitHostApplicationUseCase(), []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const current = await getMine.execute();
    setApplication(current);
    setLoading(false);
  }, [getMine]);

  useEffect(() => {
    if (canAccessHostDashboard) {
      navigate('/host', { replace: true });
      return;
    }

    void load();
  }, [canAccessHostDashboard, load, navigate]);

  const update = useCallback(<K extends keyof typeof emptyForm>(key: K, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  }, []);

  const submit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const city = form.city.trim();
      const message = form.message.trim();
      const propertyName = form.propertyName.trim();

      if (city.length < 2) {
        setError('Indiquez la ville où vous souhaitez accueillir des voyageurs.');
        return;
      }

      if (message.length < HOST_APPLICATION_MESSAGE_MIN_LENGTH) {
        setError(
          `Présentez votre projet en au moins ${HOST_APPLICATION_MESSAGE_MIN_LENGTH} caractères.`,
        );
        return;
      }

      setSaving(true);
      setError(null);
      const result = await submitUseCase.execute({
        city,
        message,
        propertyName: propertyName || undefined,
      });
      setSaving(false);

      if (!result.success) {
        setError(result.error);
        notifyError(result.error);
        return;
      }

      setApplication(result.application);
      setForm(emptyForm);
      notifySuccess('Votre demande a été envoyée. Vous serez informé par email.');
    },
    [form, notifyError, notifySuccess, submitUseCase],
  );

  const openHostSpace = useCallback(async () => {
    await refreshSession();
    navigate('/host');
  }, [navigate, refreshSession]);

  return {
    session,
    application,
    form,
    loading,
    saving,
    error,
    update,
    submit,
    openHostSpace,
  };
}
