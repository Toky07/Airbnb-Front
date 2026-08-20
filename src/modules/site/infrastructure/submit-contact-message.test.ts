import { describe, expect, it, vi } from 'vitest';
import { submitContactMessage } from './submit-contact-message';
import type { HttpClient } from '../../../shared/http/ports/http-client';

describe('submitContactMessage', () => {
  it('envoie le payload vers POST /contact', async () => {
    const httpClient: HttpClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ accepted: true, message: 'Envoyé.' }), { status: 201 }),
      ),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      postFormData: vi.fn(),
      putFormData: vi.fn(),
    };

    const result = await submitContactMessage(
      {
        name: 'Léa',
        email: 'lea@test.com',
        subject: 'Question',
        message: 'Bonjour, j’ai une question sur mon séjour.',
      },
      httpClient,
    );

    expect(result).toEqual({ success: true, message: 'Envoyé.' });
    expect(httpClient.post).toHaveBeenCalledWith('/contact', {
      name: 'Léa',
      email: 'lea@test.com',
      subject: 'Question',
      message: 'Bonjour, j’ai une question sur mon séjour.',
    });
  });
});
