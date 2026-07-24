import { Link } from 'react-router';
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
