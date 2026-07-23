import { getTokenStorage, type TokenStorage } from '../../../../shared/http/token-storage';
import { isTokenExpired } from '../utils/jwt-payload.util';

export interface SessionStore {
  getToken(): string | null;
  setToken(token: string): void;
  clearToken(): void;
  isAuthenticated(): boolean;
}

export class TokenSessionStore implements SessionStore {
  private readonly storage: TokenStorage;

  constructor(storage: TokenStorage) {
    this.storage = storage;
  }

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
