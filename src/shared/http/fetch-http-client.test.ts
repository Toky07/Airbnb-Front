import { afterEach, describe, expect, it, vi } from 'vitest';
import { FetchHttpClient } from './fetch-http-client';
import type { HttpClient } from './ports/http-client';
import * as cartSessionStorage from './cart-session.storage';
import * as tokenStorage from './token-storage';

describe('FetchHttpClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('envoie GET avec Accept et l’URL de base', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));

    const client = new FetchHttpClient('http://api.test');
    await client.get('/rooms');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/rooms',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Accept: 'application/json' }),
      }),
    );
  });

  it('envoie POST avec Content-Type JSON', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));

    const client = new FetchHttpClient('http://api.test');
    await client.post('/auth/login', { email: 'a@b.c', password: 'secret' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/auth/login',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ email: 'a@b.c', password: 'secret' }),
      }),
    );
  });

  it('ajoute Authorization et X-Cart-Session quand disponibles', async () => {
    vi.spyOn(tokenStorage, 'getTokenStorage').mockReturnValue({
      getToken: () => 'jwt-token',
      setToken: vi.fn(),
      clearToken: vi.fn(),
    });
    vi.spyOn(cartSessionStorage, 'getCartSessionId').mockReturnValue('cart-session-1');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));

    const client = new FetchHttpClient('http://api.test');
    await client.get('/cart');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/cart',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-token',
          'X-Cart-Session': 'cart-session-1',
        }),
      }),
    );
  });

  it('efface le token et notifie une déconnexion sur 401 hors login', async () => {
    const clearToken = vi.fn();
    vi.spyOn(tokenStorage, 'getTokenStorage').mockReturnValue({
      getToken: () => 'jwt-token',
      setToken: vi.fn(),
      clearToken,
    });
    const notifySpy = vi.spyOn(tokenStorage, 'notifyUnauthorized');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 401 }));

    const client = new FetchHttpClient('http://api.test');
    await client.get('/auth/me');

    expect(clearToken).toHaveBeenCalled();
    expect(notifySpy).toHaveBeenCalled();
  });

  it('n’efface pas le token sur 401 login', async () => {
    const clearToken = vi.fn();
    vi.spyOn(tokenStorage, 'getTokenStorage').mockReturnValue({
      getToken: () => null,
      setToken: vi.fn(),
      clearToken,
    });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 401 }));

    const client = new FetchHttpClient('http://api.test');
    await client.post('/auth/login', { email: 'a@b.c', password: 'wrong' });

    expect(clearToken).not.toHaveBeenCalled();
  });
});

describe('HttpClient port', () => {
  it('permet d’injecter un client mock dans un repository', async () => {
    const httpClient: HttpClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue(new Response(JSON.stringify({ token: 'mock' }), { status: 200 })),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      postFormData: vi.fn(),
      putFormData: vi.fn(),
    };

    const response = await httpClient.post('/auth/login', {});
    const data = await response.json();

    expect(data).toEqual({ token: 'mock' });
    expect(httpClient.post).toHaveBeenCalledWith('/auth/login', {});
  });
});
