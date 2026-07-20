import { FetchHttpClient } from '../fetch-http-client';
import type { HttpClient } from '../ports/http-client';

const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

let httpClient: HttpClient | null = null;

export function getHttpClient(): HttpClient {
  if (!httpClient) {
    httpClient = new FetchHttpClient(baseUrl);
  }
  return httpClient;
}
