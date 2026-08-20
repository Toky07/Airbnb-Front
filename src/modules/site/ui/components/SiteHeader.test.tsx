import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { NotificationProvider } from '../../../../shared/notifications';
import {
  AuthContext,
  type AuthContextValue,
} from '../../../auth/ui/context/auth.context';
import type { AuthSession } from '../../../auth/core/types/auth.types';
import SiteHeaderAuthActions from './SiteHeaderAuthActions';

const session: AuthSession = {
  authId: 1,
  email: 'host@test.com',
  profile: {
    userId: 5,
    firstName: 'Jean',
    lastName: 'Dupont',
    phoneNumber: '+33601020304',
    avatar: '',
  },
  roles: ['host'],
  permissions: ['host.dashboard.read'],
  isSuperAdmin: false,
  isHost: true,
  canAccessHostDashboard: true,
  hostAccess: {
    hasProperty: true,
    propertyId: 10,
    propertyName: 'Hôtel Azur',
    propertyCount: 1,
  },
};

const authValue: AuthContextValue = {
  isAuthenticated: true,
  isLoading: false,
  session,
  isHost: true,
  canAccessHostDashboard: true,
  hostAccess: session.hostAccess,
  email: 'host@test.com',
  permissions: ['host.dashboard.read'],
  login: vi.fn(),
  logout: vi.fn(),
  refreshSession: vi.fn(),
  can: () => true,
};

describe('SiteHeaderAuthActions', () => {
  it('affiche le menu utilisateur connecté', () => {
    render(
      <MemoryRouter>
        <NotificationProvider>
          <AuthContext.Provider value={authValue}>
            <SiteHeaderAuthActions />
          </AuthContext.Provider>
        </NotificationProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /jean dupont/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /connexion/i })).not.toBeInTheDocument();
  });
});
