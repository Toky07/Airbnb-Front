const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

export class ApiClient {
  private readonly baseUrl = baseUrl;

  async get(url: string): Promise<Response> {
    return fetch(`${this.baseUrl}${url}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  }
}

let client: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!client) {
    client = new ApiClient();
  }
  return client;
}
