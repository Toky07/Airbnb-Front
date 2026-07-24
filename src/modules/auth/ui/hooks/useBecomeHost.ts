import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { getBecomeHostUseCase } from '../../application/composition/auth.composition';
import { useAuth } from './useAuth';
import { useNotification } from '../../../../shared/notifications';

export function useBecomeHost() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [isBecomingHost, setIsBecomingHost] = useState(false);

  const becomeHost = useCallback(async () => {
    if (isBecomingHost) {
      return;
    }

    setIsBecomingHost(true);
    try {
      const result = await getBecomeHostUseCase().execute();
      if (!result.success) {
        notifyError(result.error);
        return;
      }

      await login(result.token);
      notifySuccess('Bienvenue dans l’espace hôte.');
      navigate('/host');
    } catch {
      notifyError('Impossible de devenir hôte.');
    } finally {
      setIsBecomingHost(false);
    }
  }, [isBecomingHost, login, navigate, notifyError, notifySuccess]);

  return { becomeHost, isBecomingHost };
}
