import { getCartSessionId } from './cart-session.storage';
import type { HttpClient } from './ports/http-client';
import { getTokenStorage, notifyUnauthorized } from './token-storage';

export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;
  private readonly tokenStorage = getTokenStorage();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = { Accept: 'application/json', ...extra };
    const token = this.tokenStorage.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const cartSessionId = getCartSessionId();
    if (cartSessionId) {
      headers['X-Cart-Session'] = cartSessionId;
    }
    return headers;
  }

  private async request(url: string, init: RequestInit): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${url}`, init);

    if (response.status === 401 && !url.includes('/auth/login')) {
      this.tokenStorage.clearToken();
      notifyUnauthorized();
    }

    return response;
  }

  get(url: string): Promise<Response> {
    return this.request(url, { method: 'GET', headers: this.buildHeaders() });
  }

  post(url: string, body: unknown): Promise<Response> {
    return this.request(url, {
      method: 'POST',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    });
  }

  put(url: string, body: unknown): Promise<Response> {
    return this.request(url, {
      method: 'PUT',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    });
  }

  patch(url: string, body: unknown): Promise<Response> {
    return this.request(url, {
      method: 'PATCH',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    });
  }

  delete(url: string): Promise<Response> {
    return this.request(url, { method: 'DELETE', headers: this.buildHeaders() });
  }

  postFormData(url: string, body: FormData): Promise<Response> {
    return this.request(url, { method: 'POST', headers: this.buildHeaders(), body });
  }

  putFormData(url: string, body: FormData): Promise<Response> {
    return this.request(url, { method: 'PUT', headers: this.buildHeaders(), body });
  }
}
