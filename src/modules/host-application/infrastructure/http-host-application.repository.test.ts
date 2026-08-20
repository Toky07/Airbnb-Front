import { describe, expect, it, vi } from 'vitest';
import { HttpHostApplicationRepository } from './http-host-application.repository';
import type { HttpClient } from '../../../shared/http/ports/http-client';

function createHttpClient(overrides: Partial<HttpClient> = {}): HttpClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    postFormData: vi.fn(),
    putFormData: vi.fn(),
    ...overrides,
  };
}

describe('HttpHostApplicationRepository', () => {
  it('lit la demande courante', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 1,
            userId: 10,
            city: 'Paris',
            message: 'Projet d’appartement lumineux dans le 11e.',
            status: 'pending',
            propertyName: 'Maison Léa',
            reviewComment: null,
            reviewedAt: null,
            createdAt: '2026-08-17T10:00:00.000Z',
          }),
          { status: 200 },
        ),
      ),
    });

    const result = await new HttpHostApplicationRepository(httpClient).getMine();

    expect(result?.city).toBe('Paris');
    expect(httpClient.get).toHaveBeenCalledWith('/host-applications/me');
  });

  it('accepte une réponse vide comme absence de demande', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(new Response('', { status: 200 })),
    });

    const result = await new HttpHostApplicationRepository(httpClient).getMine();

    expect(result).toBeNull();
  });

  it('envoie une candidature', async () => {
    const httpClient = createHttpClient({
      post: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 2,
            userId: 10,
            city: 'Lyon',
            message: 'Je souhaite proposer un loft au centre-ville de Lyon.',
            status: 'pending',
            propertyName: null,
            reviewComment: null,
            reviewedAt: null,
            createdAt: '2026-08-17T10:00:00.000Z',
          }),
          { status: 201 },
        ),
      ),
    });

    const result = await new HttpHostApplicationRepository(httpClient).submit({
      city: 'Lyon',
      message: 'Je souhaite proposer un loft au centre-ville de Lyon.',
    });

    expect(result.success).toBe(true);
    expect(httpClient.post).toHaveBeenCalledWith('/host-applications', {
      city: 'Lyon',
      message: 'Je souhaite proposer un loft au centre-ville de Lyon.',
    });
  });
});
