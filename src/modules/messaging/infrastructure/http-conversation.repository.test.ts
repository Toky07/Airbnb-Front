import { describe, expect, it, vi } from 'vitest';
import { HttpConversationRepository } from './http-conversation.repository';
import { sampleConversationApi, sampleMessageApi } from '../../../test/fixtures/messaging-api.fixtures';

describe('HttpConversationRepository', () => {
  it('maps conversation list responses', async () => {
    const httpClient = {
      get: vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [sampleConversationApi],
      }),
    };

    const repository = new HttpConversationRepository(httpClient as never);
    const result = await repository.listMine();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.conversations[0]?.id).toBe(1);
    }
  });

  it('maps send message responses', async () => {
    const httpClient = {
      post: vi.fn().mockResolvedValue({
        ok: true,
        json: async () => sampleMessageApi,
      }),
    };

    const repository = new HttpConversationRepository(httpClient as never);
    const result = await repository.sendMessage(1, 'Bonjour');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.message.body).toBe('Bonjour');
    }
  });
});
