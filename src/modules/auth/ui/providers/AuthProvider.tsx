import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { onUnauthorized } from '../../../../shared/http/token-storage';
import { canAccess } from '../../../../shared/permissions/permissions';
import type { PermissionKey } from '../../../../shared/permissions/permissions';
import {
  getAuthSessionService,
} from '../../core/services/auth.service';
import { extractSessionFromToken } from '../../core/utils/jwt-payload.util';
import { AuthContext } from '../context/auth.context';

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const sessionService = useMemo(() => getAuthSessionService(), []);
  const [token, setToken] = useState<string | null>(() => sessionService.getToken());

  const session = useMemo(() => extractSessionFromToken(token), [token]);

  const logout = useCallback(() => {
    sessionService.clearSession();
    setToken(null);
  }, [sessionService]);

  const login = useCallback(
    (nextToken: string) => {
      sessionService.setSession(nextToken);
      setToken(nextToken);
    },
    [sessionService],
  );

  useEffect(() => {
    return onUnauthorized(() => {
      setToken(null);
    });
  }, []);

  useEffect(() => {
    if (token && sessionService.isTokenExpired(token)) {
      logout();
    }
  }, [token, sessionService, logout]);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token) && sessionService.isAuthenticated(),
      isHost: session.isHost,
      email: session.email,
      permissions: session.permissions,
      login,
      logout,
      can: (permission: PermissionKey) =>
        canAccess(session.permissions, permission, session.isSuperAdmin),
    }),
    [token, session, sessionService, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
