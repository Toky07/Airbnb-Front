import {
  clearCartSessionId,
  setCartSessionId,
} from '../../../shared/http/cart-session.storage';
import type { CartSessionStore } from '../application/ports/cart-session.store';

export class LocalStorageCartSessionStore implements CartSessionStore {
  setSessionId(sessionId: string): void {
    setCartSessionId(sessionId);
  }

  clear(): void {
    clearCartSessionId();
  }
}

let store: LocalStorageCartSessionStore | null = null;

export function getLocalStorageCartSessionStore(): LocalStorageCartSessionStore {
  if (!store) {
    store = new LocalStorageCartSessionStore();
  }
  return store;
}
