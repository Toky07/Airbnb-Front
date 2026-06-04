import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function usePermission() {
  const { can } = useAuth();
  return { can };
}
