import type {
  ConversationRepository,
  ConversationListResult,
  ConversationResult,
  MessageListResult,
  SendMessageResult,
  MarkReadResult,
} from '../ports/conversation.repository';

export class ListMyConversationsUseCase {
  private readonly repository: ConversationRepository;

  constructor(repository: ConversationRepository) {
    this.repository = repository;
  }

  execute(): Promise<ConversationListResult> {
    return this.repository.listMine();
  }
}

export class GetOrCreateConversationUseCase {
  private readonly repository: ConversationRepository;

  constructor(repository: ConversationRepository) {
    this.repository = repository;
  }

  execute(reservationId: number): Promise<ConversationResult> {
    return this.repository.getOrCreateFromReservation(reservationId);
  }
}

export class ListMessagesUseCase {
  private readonly repository: ConversationRepository;

  constructor(repository: ConversationRepository) {
    this.repository = repository;
  }

  execute(conversationId: number, since?: string): Promise<MessageListResult> {
    return this.repository.listMessages(conversationId, since);
  }
}

export class SendMessageUseCase {
  private readonly repository: ConversationRepository;

  constructor(repository: ConversationRepository) {
    this.repository = repository;
  }

  execute(conversationId: number, body: string): Promise<SendMessageResult> {
    return this.repository.sendMessage(conversationId, body);
  }
}

export class MarkConversationReadUseCase {
  private readonly repository: ConversationRepository;

  constructor(repository: ConversationRepository) {
    this.repository = repository;
  }

  execute(conversationId: number): Promise<MarkReadResult> {
    return this.repository.markRead(conversationId);
  }
}
