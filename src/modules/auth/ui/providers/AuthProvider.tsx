import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { onUnauthorized } from '../../../../shared/http/token-storage';
import { clearCartSessionId } from '../../../../shared/http/cart-session.storage';
import { canAccess } from '../../../../shared/permissions/permissions';
import type { PermissionKey } from '../../../../shared/permissions/permissions';
import {
  getAuthService,
  getAuthSessionService,
} from '../../core/services/auth.service';
import { mergeMeIntoSession } from '../../core/services/resolve-auth-session';
import {
  emptyAuthSession,
  type AuthSession,
} from '../../core/types/auth.types';
import { AuthContext } from '../context/auth.context';

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const sessionService = useMemo(() => getAuthSessionService(), []);
  const authService = useMemo(() => getAuthService(), []);
  const [token, setToken] = useState<string | null>(() => sessionService.getToken());
  const [session, setSession] = useState<AuthSession>(emptyAuthSession);
  const [isLoading, setIsLoading] = useState(true);

  const resolveSession = useCallback(
    async (nextToken: string | null): Promise<AuthSession> => {
      if (!nextToken || sessionService.isTokenExpired(nextToken)) {
        setSession(emptyAuthSession);
        return emptyAuthSession;
      }

      const me = await authService.fetchMe();
      const nextSession = mergeMeIntoSession(nextToken, me);
      setSession(nextSession);
      return nextSession;
    },
    [authService, sessionService],
  );

  const refreshSession = useCallback(async () => {
    const currentToken = sessionService.getToken();
    setToken(currentToken);
    await resolveSession(currentToken);
  }, [resolveSession, sessionService]);

  const logout = useCallback(() => {
    sessionService.clearSession();
    clearCartSessionId();
    setToken(null);
    setSession(emptyAuthSession);
  }, [sessionService]);

  const login = useCallback(
    async (nextToken: string): Promise<AuthSession> => {
      sessionService.setSession(nextToken);
      setToken(nextToken);
      return resolveSession(nextToken);
    },
    [resolveSession, sessionService],
  );

  useEffect(() => {
    return onUnauthorized(() => {
      logout();
    });
  }, [logout]);

  useEffect(() => {
    void resolveSession(token).finally(() => setIsLoading(false));
  }, [resolveSession, token]);

  useEffect(() => {
    if (token && sessionService.isTokenExpired(token)) {
      logout();
    }
  }, [token, sessionService, logout]);

  const effectiveToken = token ?? sessionService.getToken();
  const isAuthenticated = Boolean(
    effectiveToken && !sessionService.isTokenExpired(effectiveToken),
  );

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      session,
      isHost: session.isHost,
      canAccessHostDashboard: session.canAccessHostDashboard,
      hostAccess: session.hostAccess,
      email: session.email,
      permissions: session.permissions,
      login,
      logout,
      refreshSession,
      can: (permission: PermissionKey) =>
        canAccess(session.permissions, permission, session.isSuperAdmin),
    }),
    [isAuthenticated, isLoading, session, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
