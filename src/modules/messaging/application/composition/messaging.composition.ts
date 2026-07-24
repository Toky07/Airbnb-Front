import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import type { ConversationRepository } from '../ports/conversation.repository';
import {
  GetOrCreateConversationUseCase,
  ListMessagesUseCase,
  ListMyConversationsUseCase,
  MarkConversationReadUseCase,
  SendMessageUseCase,
} from '../use-cases/conversation.use-cases';
import { HttpConversationRepository } from '../../infrastructure/http-conversation.repository';

let conversationRepository: ConversationRepository | null = null;
let listMyConversationsUseCase: ListMyConversationsUseCase | null = null;
let getOrCreateConversationUseCase: GetOrCreateConversationUseCase | null = null;
let listMessagesUseCase: ListMessagesUseCase | null = null;
let sendMessageUseCase: SendMessageUseCase | null = null;
let markConversationReadUseCase: MarkConversationReadUseCase | null = null;

export function getConversationRepository(): ConversationRepository {
  if (!conversationRepository) {
    conversationRepository = new HttpConversationRepository(getHttpClient());
  }
  return conversationRepository;
}

export function getListMyConversationsUseCase(): ListMyConversationsUseCase {
  if (!listMyConversationsUseCase) {
    listMyConversationsUseCase = new ListMyConversationsUseCase(
      getConversationRepository(),
    );
  }
  return listMyConversationsUseCase;
}

export function getGetOrCreateConversationUseCase(): GetOrCreateConversationUseCase {
  if (!getOrCreateConversationUseCase) {
    getOrCreateConversationUseCase = new GetOrCreateConversationUseCase(
      getConversationRepository(),
    );
  }
  return getOrCreateConversationUseCase;
}

export function getListMessagesUseCase(): ListMessagesUseCase {
  if (!listMessagesUseCase) {
    listMessagesUseCase = new ListMessagesUseCase(getConversationRepository());
  }
  return listMessagesUseCase;
}

export function getSendMessageUseCase(): SendMessageUseCase {
  if (!sendMessageUseCase) {
    sendMessageUseCase = new SendMessageUseCase(getConversationRepository());
  }
  return sendMessageUseCase;
}

export function getMarkConversationReadUseCase(): MarkConversationReadUseCase {
  if (!markConversationReadUseCase) {
    markConversationReadUseCase = new MarkConversationReadUseCase(
      getConversationRepository(),
    );
  }
  return markConversationReadUseCase;
}
