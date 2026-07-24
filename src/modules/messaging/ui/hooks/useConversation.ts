import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Message } from '../../core/types/conversation.types';
import {
  getListMessagesUseCase,
  getMarkConversationReadUseCase,
} from '../../application/composition/messaging.composition';

export function useConversation(conversationId: number | null) {
  const listMessagesUseCase = useMemo(() => getListMessagesUseCase(), []);
  const markConversationReadUseCase = useMemo(
    () => getMarkConversationReadUseCase(),
    [],
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await listMessagesUseCase.execute(conversationId);
    if (!result.success) {
      setError(result.error);
      setMessages([]);
    } else {
      setMessages(result.messages);
      await markConversationReadUseCase.execute(conversationId);
    }

    setLoading(false);
  }, [conversationId, listMessagesUseCase, markConversationReadUseCase]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { messages, loading, error, refresh };
}
