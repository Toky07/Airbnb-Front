export interface CartSessionStore {
  setSessionId(sessionId: string): void;
  clear(): void;
}
