import type {
  ConversationRepository,
  ConversationListResult,
  ConversationResult,
  MessageListResult,
  SendMessageResult,
  MarkReadResult,
} from '../ports/conversation.repository';

export class ListMyConversationsUseCase {
  constructor(private readonly repository: ConversationRepository) {}

  execute(): Promise<ConversationListResult> {
    return this.repository.listMine();
  }
}

export class GetOrCreateConversationUseCase {
  constructor(private readonly repository: ConversationRepository) {}

  execute(reservationId: number): Promise<ConversationResult> {
    return this.repository.getOrCreateFromReservation(reservationId);
  }
}

export class ListMessagesUseCase {
  constructor(private readonly repository: ConversationRepository) {}

  execute(conversationId: number, since?: string): Promise<MessageListResult> {
    return this.repository.listMessages(conversationId, since);
  }
}

export class SendMessageUseCase {
  constructor(private readonly repository: ConversationRepository) {}

  execute(conversationId: number, body: string): Promise<SendMessageResult> {
    return this.repository.sendMessage(conversationId, body);
  }
}

export class MarkConversationReadUseCase {
  constructor(private readonly repository: ConversationRepository) {}

  execute(conversationId: number): Promise<MarkReadResult> {
    return this.repository.markRead(conversationId);
  }
}
