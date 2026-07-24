import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import ConversationList from '../components/ConversationList';
import MessageThread from '../components/MessageThread';
import { useConversation } from '../hooks/useConversation';
import { useConversationPolling } from '../hooks/useConversationPolling';
import { useConversations } from '../hooks/useConversations';

const HostMessagesPage = () => {
  const navigate = useNavigate();
  const { conversationId: conversationIdParam } = useParams();
  const { session } = useAuth();
  const { conversations, loading, error, refresh: refreshConversations } = useConversations();

  const selectedId = useMemo(() => {
    const parsed = Number(conversationIdParam);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : conversations[0]?.id ?? null;
  }, [conversationIdParam, conversations]);

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    refresh: refreshMessages,
  } = useConversation(selectedId);

  const refreshAll = async () => {
    await Promise.all([refreshConversations(), refreshMessages()]);
  };

  useConversationPolling(refreshAll, Boolean(selectedId));

  const handleSelect = (conversationId: number) => {
    navigate(`/host/messages/${conversationId}`);
  };

  return (
    <div>
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Hôte
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
          Messages
        </h1>
        <p className="mt-3 text-base text-ink/60">
          Répondez aux voyageurs à propos de leurs réservations.
        </p>
      </div>

      {loading ? (
        <div className="mt-10 h-64 animate-pulse rounded-2xl bg-mist" />
      ) : null}

      {error ? (
        <p className="mt-10 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelect}
            basePath="/host/messages"
          />

          {selectedId ? (
            messagesLoading ? (
              <div className="h-[32rem] animate-pulse rounded-2xl bg-mist" />
            ) : messagesError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {messagesError}
              </p>
            ) : (
              <MessageThread
                conversationId={selectedId}
                messages={messages}
                currentUserId={session.profile?.userId ?? null}
                onMessageSent={refreshAll}
              />
            )
          ) : (
            <div className="flex h-[32rem] items-center justify-center rounded-2xl border border-dashed border-line bg-surface text-sm text-ink/50">
              Sélectionnez une conversation.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default HostMessagesPage;
