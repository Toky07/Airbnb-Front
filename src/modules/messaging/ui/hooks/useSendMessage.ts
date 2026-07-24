import { useCallback, useMemo, useState } from 'react';
import { getSendMessageUseCase } from '../../application/composition/messaging.composition';

export function useSendMessage() {
  const sendMessageUseCase = useMemo(() => getSendMessageUseCase(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (conversationId: number, body: string) => {
      setLoading(true);
      setError(null);

      const result = await sendMessageUseCase.execute(conversationId, body);
      setLoading(false);

      if (!result.success) {
        setError(result.error);
        return null;
      }

      return result.message;
    },
    [sendMessageUseCase],
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { sendMessage, loading, error, reset };
}
