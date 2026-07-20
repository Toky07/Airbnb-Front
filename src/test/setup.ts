import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

class LocalStorageMock implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const localStorageMock = new LocalStorageMock();

if (typeof globalThis.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    configurable: true,
  });
}

if (typeof globalThis.window === 'undefined') {
  const windowShim = new EventTarget() as Window & EventTarget;
  Object.defineProperty(windowShim, 'localStorage', {
    value: localStorageMock,
    configurable: true,
  });
  Object.defineProperty(globalThis, 'window', {
    value: windowShim,
    configurable: true,
  });
}

afterEach(() => {
  cleanup();
  localStorageMock.clear();
  vi.restoreAllMocks();
});
