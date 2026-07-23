import { emptyAuthSession, type AuthSession } from '../types/auth.types';
import { isTokenExpired } from '../utils/jwt-payload.util';
import type { AuthService } from './auth.service';
import { mergeMeIntoSession } from './resolve-auth-session';
import type { SessionStore } from './token-session.store';

type LoadAuthSessionParams = {
  token?: string | null;
  sessionStore: SessionStore;
  authService: AuthService;
};

export async function loadAuthSession({
  token,
  sessionStore,
  authService,
}: LoadAuthSessionParams): Promise<AuthSession> {
  const effectiveToken = token ?? sessionStore.getToken();

  if (!effectiveToken || isTokenExpired(effectiveToken)) {
    return emptyAuthSession;
  }

  const me = await authService.fetchMe();
  return mergeMeIntoSession(effectiveToken, me);
}
