const TOKEN_KEY = 'auth_token';

export class TokenStorage {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}

let storage: TokenStorage | null = null;

export function getTokenStorage(): TokenStorage {
  if (!storage) {
    storage = new TokenStorage();
  }
  return storage;
}

export function onUnauthorized(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener('auth:unauthorized', handler);
  return () => window.removeEventListener('auth:unauthorized', handler);
}

function notifyUnauthorized(): void {
  window.dispatchEvent(new Event('auth:unauthorized'));
}

export { notifyUnauthorized };
