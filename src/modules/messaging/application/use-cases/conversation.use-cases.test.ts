import { describe, expect, it, vi } from 'vitest';
import {
  GetOrCreateConversationUseCase,
  ListMessagesUseCase,
  ListMyConversationsUseCase,
  MarkConversationReadUseCase,
  SendMessageUseCase,
} from './conversation.use-cases';
import type { ConversationRepository } from '../ports/conversation.repository';

function createRepositoryMock(): ConversationRepository {
  return {
    listMine: vi.fn().mockResolvedValue({ success: true, conversations: [] }),
    getOrCreateFromReservation: vi
      .fn()
      .mockResolvedValue({ success: true, conversation: { id: 1 } }),
    listMessages: vi.fn().mockResolvedValue({ success: true, messages: [] }),
    sendMessage: vi.fn().mockResolvedValue({ success: true, message: { id: 1 } }),
    markRead: vi.fn().mockResolvedValue({ success: true }),
  } as unknown as ConversationRepository;
}

describe('conversation use cases', () => {
  it('lists conversations for the current user', async () => {
    const repository = createRepositoryMock();
    const useCase = new ListMyConversationsUseCase(repository);

    await useCase.execute();

    expect(repository.listMine).toHaveBeenCalled();
  });

  it('gets or creates a conversation from a reservation', async () => {
    const repository = createRepositoryMock();
    const useCase = new GetOrCreateConversationUseCase(repository);

    await useCase.execute(10);

    expect(repository.getOrCreateFromReservation).toHaveBeenCalledWith(10);
  });

  it('lists messages for a conversation', async () => {
    const repository = createRepositoryMock();
    const useCase = new ListMessagesUseCase(repository);

    await useCase.execute(1, '2026-01-01T00:00:00.000Z');

    expect(repository.listMessages).toHaveBeenCalledWith(
      1,
      '2026-01-01T00:00:00.000Z',
    );
  });

  it('sends a message', async () => {
    const repository = createRepositoryMock();
    const useCase = new SendMessageUseCase(repository);

    await useCase.execute(1, 'Bonjour');

    expect(repository.sendMessage).toHaveBeenCalledWith(1, 'Bonjour');
  });

  it('marks a conversation as read', async () => {
    const repository = createRepositoryMock();
    const useCase = new MarkConversationReadUseCase(repository);

    await useCase.execute(1);

    expect(repository.markRead).toHaveBeenCalledWith(1);
  });
});
