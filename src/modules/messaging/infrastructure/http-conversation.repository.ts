import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../shared/http/parse-api-error';
import {
  mapConversation,
  mapConversations,
  mapMessage,
  mapMessages,
} from '../core/types/conversation.types';
import type {
  ConversationRepository,
  ConversationListResult,
  ConversationResult,
  MessageListResult,
  SendMessageResult,
  MarkReadResult,
} from '../application/ports/conversation.repository';
import type { HttpClient } from '../../../shared/http/ports/http-client';

export class HttpConversationRepository implements ConversationRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async listMine(): Promise<ConversationListResult> {
    const response = await this.httpClient.get('/conversations/me');
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de charger vos conversations.'),
      };
    }

    return { success: true, conversations: mapConversations(data) };
  }

  async getOrCreateFromReservation(
    reservationId: number,
  ): Promise<ConversationResult> {
    const response = await this.httpClient.post(
      `/conversations/from-reservation/${reservationId}`,
    );
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible d’ouvrir la conversation.'),
      };
    }

    const conversation = mapConversation(data);
    if (!conversation) {
      return { success: false, error: 'Réponse de conversation invalide.' };
    }

    return { success: true, conversation };
  }

  async listMessages(
    conversationId: number,
    since?: string,
  ): Promise<MessageListResult> {
    const query = since ? `?since=${encodeURIComponent(since)}` : '';
    const response = await this.httpClient.get(
      `/conversations/${conversationId}/messages${query}`,
    );
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de charger les messages.'),
      };
    }

    return { success: true, messages: mapMessages(data) };
  }

  async sendMessage(
    conversationId: number,
    body: string,
  ): Promise<SendMessageResult> {
    const response = await this.httpClient.post(
      `/conversations/${conversationId}/messages`,
      { body },
    );
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible d’envoyer le message.'),
      };
    }

    const message = mapMessage(data);
    if (!message) {
      return { success: false, error: 'Réponse de message invalide.' };
    }

    return { success: true, message };
  }

  async markRead(conversationId: number): Promise<MarkReadResult> {
    const response = await this.httpClient.post(
      `/conversations/${conversationId}/read`,
    );

    if (!response.ok) {
      const data: unknown = await response.json();
      return {
        success: false,
        error: parseApiError(data, 'Impossible de marquer la conversation comme lue.'),
      };
    }

    return { success: true };
  }
}
