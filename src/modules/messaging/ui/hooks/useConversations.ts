import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Conversation } from '../../core/types/conversation.types';
import { getListMyConversationsUseCase } from '../../application/composition/messaging.composition';

export function useConversations() {
  const listMyConversationsUseCase = useMemo(
    () => getListMyConversationsUseCase(),
    [],
  );
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await listMyConversationsUseCase.execute();
    if (!result.success) {
      setError(result.error);
      setConversations([]);
    } else {
      setConversations(result.conversations);
    }

    setLoading(false);
  }, [listMyConversationsUseCase]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { conversations, loading, error, refresh };
}
