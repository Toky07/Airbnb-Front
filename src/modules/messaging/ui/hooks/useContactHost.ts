import { useMemo, useState } from 'react';
import { getGetOrCreateConversationUseCase } from '../../application/composition/messaging.composition';

export function useContactHost(reservationId: number) {
  const getOrCreateConversationUseCase = useMemo(
    () => getGetOrCreateConversationUseCase(),
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactHost = async (): Promise<number | null> => {
    setLoading(true);
    setError(null);

    const result = await getOrCreateConversationUseCase.execute(reservationId);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return null;
    }

    return result.conversation.id;
  };

  return { contactHost, loading, error };
}
