import { getTokenStorage, notifyUnauthorized } from './token-storage';
import { getCartSessionId } from './cart-session.storage';

const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

export class ApiClient {
  private readonly baseUrl = baseUrl;
  private readonly tokenStorage = getTokenStorage();

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

  async get(url: string): Promise<Response> {
    return this.request(url, { method: 'GET', headers: this.buildHeaders() });
  }

  async post(url: string, body: unknown): Promise<Response> {
    return this.request(url, {
      method: 'POST',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    });
  }

  async put(url: string, body: unknown): Promise<Response> {
    return this.request(url, {
      method: 'PUT',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    });
  }

  async delete(url: string): Promise<Response> {
    return this.request(url, { method: 'DELETE', headers: this.buildHeaders() });
  }

  async postFormData(url: string, body: FormData): Promise<Response> {
    return this.request(url, { method: 'POST', headers: this.buildHeaders(), body });
  }

  async putFormData(url: string, body: FormData): Promise<Response> {
    return this.request(url, { method: 'PUT', headers: this.buildHeaders(), body });
  }
}

let client: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!client) {
    client = new ApiClient();
  }
  return client;
}
