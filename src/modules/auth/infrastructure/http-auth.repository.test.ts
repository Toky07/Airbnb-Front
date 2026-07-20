import { describe, expect, it, vi } from 'vitest';
import { HttpAuthRepository } from './http-auth.repository';

describe('HttpAuthRepository', () => {
  it('retourne un token lors du login', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ token: 'jwt-token' }), { status: 200 }),
    );

    const repository = new HttpAuthRepository();
    const result = await repository.login({
      email: 'user@test.com',
      password: 'secret',
    });

    expect(result).toEqual({ success: true, token: 'jwt-token' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('retourne une erreur API lors du login', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Identifiants invalides.' }), {
        status: 401,
      }),
    );

    const repository = new HttpAuthRepository();
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
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
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
    );

    const repository = new HttpAuthRepository();
    const me = await repository.fetchMe();

    expect(me?.email).toBe('user@test.com');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/me'),
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
