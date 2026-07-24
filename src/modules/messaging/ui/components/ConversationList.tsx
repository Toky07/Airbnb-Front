import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { getGetOrCreateConversationUseCase } from '../../application/composition/messaging.composition';
import type { Conversation } from '../../core/types/conversation.types';
import { formatMessageTime } from '../../core/types/conversation.types';

type ConversationListProps = {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (conversationId: number) => void;
  basePath: string;
};

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  basePath,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-ink/50">
        Aucune conversation pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedId;

        return (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={[
              'w-full rounded-xl border px-4 py-4 text-left transition duration-200',
              isSelected
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-surface hover:border-brand/30 hover:bg-mist',
            ].join(' ')}
          >
            <p className="font-medium">Réservation #{conversation.reservationId}</p>
            <p
              className={[
                'mt-1 text-sm',
                isSelected ? 'text-white/80' : 'text-ink/50',
              ].join(' ')}
            >
              {conversation.lastMessageAt
                ? `Dernier message ${formatMessageTime(conversation.lastMessageAt)}`
                : 'Aucun message'}
            </p>
            <Link
              to={`${basePath}/${conversation.id}`}
              className="sr-only"
              onClick={(event) => event.stopPropagation()}
            >
              Ouvrir la conversation
            </Link>
          </button>
        );
      })}
    </div>
  );
}

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
