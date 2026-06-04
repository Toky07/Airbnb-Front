import { createContext } from 'react';
import type { PermissionKey } from '../../../../shared/permissions/permissions';

export type AuthContextValue = {
  isAuthenticated: boolean;
  isHost: boolean;
  email: string | null;
  permissions: string[];
  login: (token: string) => void;
  logout: () => void;
  can: (permission: PermissionKey) => boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
