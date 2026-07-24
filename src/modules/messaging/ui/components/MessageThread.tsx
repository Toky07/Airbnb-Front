import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../../shared/ui';
import type { Message } from '../../core/types/conversation.types';
import { formatMessageTime } from '../../core/types/conversation.types';
import { useSendMessage } from '../hooks/useSendMessage';

type MessageThreadProps = {
  conversationId: number;
  messages: Message[];
  currentUserId: number | null;
  onMessageSent: () => Promise<void>;
};

export default function MessageThread({
  conversationId,
  messages,
  currentUserId,
  onMessageSent,
}: MessageThreadProps) {
  const { sendMessage, loading, error } = useSendMessage();
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body) {
      return;
    }

    const message = await sendMessage(conversationId, body);
    if (message) {
      setDraft('');
      await onMessageSent();
    }
  };

  return (
    <div className="flex h-[32rem] flex-col rounded-2xl border border-line bg-surface soft-shadow">
      <div className="flex-1 space-y-3 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <p className="text-sm text-ink/50">Commencez la conversation.</p>
        ) : null}

        {messages.map((message) => {
          const isMine = currentUserId === message.senderId;

          return (
            <div
              key={message.id}
              className={['flex', isMine ? 'justify-end' : 'justify-start'].join(' ')}
            >
              <div
                className={[
                  'max-w-[80%] rounded-xl px-4 py-3 text-sm',
                  isMine ? 'bg-brand text-white' : 'bg-mist text-ink/80',
                ].join(' ')}
              >
                <p>{message.body}</p>
                <p
                  className={[
                    'mt-2 text-xs',
                    isMine ? 'text-white/70' : 'text-ink/50',
                  ].join(' ')}
                >
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="border-t border-line p-4"
      >
        <div className="flex gap-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={2}
            placeholder="Écrivez votre message…"
            className="min-h-[3rem] flex-1 resize-none rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <Button type="submit" disabled={loading || draft.trim().length === 0}>
            Envoyer
          </Button>
        </div>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </form>
    </div>
  );
}
