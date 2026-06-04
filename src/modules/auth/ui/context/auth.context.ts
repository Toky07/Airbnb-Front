import { createContext } from 'react';
import type { PermissionKey } from '../../../../shared/permissions/permissions';
import type { AuthSession, HostAccess } from '../../core/types/auth.types';

export type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: AuthSession;
  isHost: boolean;
  canAccessHostDashboard: boolean;
  hostAccess: HostAccess | null;
  email: string | null;
  permissions: string[];
  login: (token: string) => Promise<AuthSession>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  can: (permission: PermissionKey) => boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
