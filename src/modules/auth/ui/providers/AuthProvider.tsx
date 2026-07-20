import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { onUnauthorized } from '../../../../shared/http/token-storage';
import { clearCartSessionId } from '../../../../shared/http/cart-session.storage';
import { canAccess } from '../../../../shared/permissions/permissions';
import type { PermissionKey } from '../../../../shared/permissions/permissions';
import {
  getLoadSessionUseCase,
  getSessionStore,
} from '../../application/composition/auth.composition';
import {
  emptyAuthSession,
  type AuthSession,
} from '../../core/types/auth.types';
import { AuthContext } from '../context/auth.context';

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const sessionStore = useMemo(() => getSessionStore(), []);
  const loadSessionUseCase = useMemo(() => getLoadSessionUseCase(), []);
  const [token, setToken] = useState<string | null>(() => sessionStore.getToken());
  const [session, setSession] = useState<AuthSession>(emptyAuthSession);
  const [isLoading, setIsLoading] = useState(true);

  const resolveSession = useCallback(
    async (nextToken: string | null): Promise<AuthSession> => {
      const nextSession = await loadSessionUseCase.execute(nextToken);
      setSession(nextSession);
      return nextSession;
    },
    [loadSessionUseCase],
  );

  const refreshSession = useCallback(async () => {
    const currentToken = sessionStore.getToken();
    setToken(currentToken);
    await resolveSession(currentToken);
  }, [resolveSession, sessionStore]);

  const logout = useCallback(() => {
    sessionStore.clearToken();
    clearCartSessionId();
    setToken(null);
    setSession(emptyAuthSession);
  }, [sessionStore]);

  const login = useCallback(
    async (nextToken: string): Promise<AuthSession> => {
      sessionStore.setToken(nextToken);
      setToken(nextToken);
      return resolveSession(nextToken);
    },
    [resolveSession, sessionStore],
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
    if (token && !sessionStore.isAuthenticated()) {
      logout();
    }
  }, [token, sessionStore, logout]);

  const isAuthenticated = sessionStore.isAuthenticated();

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
