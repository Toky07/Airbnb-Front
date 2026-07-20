import { getTokenStorage, type TokenStorage } from '../../../shared/http/token-storage';
import { isTokenExpired } from '../core/utils/jwt-payload.util';
import type { SessionStore } from '../application/ports/session.store';

export class TokenSessionStore implements SessionStore {
  constructor(private readonly storage: TokenStorage) {}

  getToken(): string | null {
    return this.storage.getToken();
  }

  setToken(token: string): void {
    this.storage.setToken(token);
  }

  clearToken(): void {
    this.storage.clearToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return Boolean(token && !isTokenExpired(token));
  }
}

let sessionStore: TokenSessionStore | null = null;

export function getTokenSessionStore(): TokenSessionStore {
  if (!sessionStore) {
    sessionStore = new TokenSessionStore(getTokenStorage());
  }
  return sessionStore;
}
