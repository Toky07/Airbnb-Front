import { describe, expect, it, vi } from 'vitest';
import type { HttpClient } from '../../../shared/http/ports/http-client';
import { HttpAuthRepository } from './http-auth.repository';

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

describe('HttpAuthRepository', () => {
  it('retourne un token lors du login', async () => {
    const httpClient = createHttpClient({
      post: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ token: 'jwt-token' }), { status: 200 }),
      ),
    });
    const repository = new HttpAuthRepository(httpClient);
    const result = await repository.login({
      email: 'user@test.com',
      password: 'secret',
    });

    expect(result).toEqual({ success: true, token: 'jwt-token' });
    expect(httpClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'user@test.com',
      password: 'secret',
    });
  });

  it('retourne une erreur API lors du login', async () => {
    const httpClient = createHttpClient({
      post: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Identifiants invalides.' }), {
          status: 401,
        }),
      ),
    });
    const repository = new HttpAuthRepository(httpClient);
    const result = await repository.login({
      email: 'user@test.com',
      password: 'wrong',
    });

    expect(result).toEqual({
      success: false,
      error: 'Identifiants invalides.',
    });
  });

  it('récupère le profil courant via /auth/me', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 1,
            email: 'user@test.com',
            roles: [],
            permissions: [],
            isSuperAdmin: false,
            profile: null,
            hostAccess: null,
          }),
          { status: 200 },
        ),
      ),
    });
    const repository = new HttpAuthRepository(httpClient);
    const me = await repository.fetchMe();

    expect(me?.email).toBe('user@test.com');
    expect(httpClient.get).toHaveBeenCalledWith('/auth/me');
  });
});
