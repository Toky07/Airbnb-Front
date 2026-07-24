import type { Conversation, Message } from '../../core/types/conversation.types';

export type ConversationListResult =
  | { success: true; conversations: Conversation[] }
  | { success: false; error: string };

export type ConversationResult =
  | { success: true; conversation: Conversation }
  | { success: false; error: string };

export type MessageListResult =
  | { success: true; messages: Message[] }
  | { success: false; error: string };

export type SendMessageResult =
  | { success: true; message: Message }
  | { success: false; error: string };

export type MarkReadResult =
  | { success: true }
  | { success: false; error: string };

export interface ConversationRepository {
  listMine(): Promise<ConversationListResult>;
  getOrCreateFromReservation(reservationId: number): Promise<ConversationResult>;
  listMessages(conversationId: number, since?: string): Promise<MessageListResult>;
  sendMessage(conversationId: number, body: string): Promise<SendMessageResult>;
  markRead(conversationId: number): Promise<MarkReadResult>;
}
