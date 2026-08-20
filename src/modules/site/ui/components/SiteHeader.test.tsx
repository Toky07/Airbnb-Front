import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import SiteHeaderAuthActions from './SiteHeaderAuthActions';

vi.mock('../../../auth/ui/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    canAccessHostDashboard: true,
    session: {
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
    },
    email: 'host@test.com',
    logout: vi.fn(),
  }),
}));

vi.mock('../../../../shared/notifications', () => ({
  useNotification: () => ({ success: vi.fn() }),
}));

describe('SiteHeaderAuthActions', () => {
  it('affiche le menu utilisateur connecté', () => {
    render(
      <MemoryRouter>
        <SiteHeaderAuthActions />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /jean dupont/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /connexion/i })).not.toBeInTheDocument();
  });
});
