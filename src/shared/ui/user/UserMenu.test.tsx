import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import UserMenu, { buildUserMenuItems } from './UserMenu';
import type { AuthSession } from '../../../modules/auth/core/types/auth.types';

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
  },
};

describe('UserMenu', () => {
  it('affiche le nom et ouvre le menu avec les liens', () => {
    render(
      <MemoryRouter>
        <UserMenu
          session={session}
          email="host@test.com"
          canAccessHostDashboard
          onLogout={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /jean dupont/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /jean dupont/i }));

    expect(screen.getByRole('menuitem', { name: /mon profil/i })).toHaveAttribute(
      'href',
      '/account/profile',
    );
    expect(screen.getByRole('menuitem', { name: /gérer mon hôtel/i })).toHaveAttribute(
      'href',
      '/host',
    );
    expect(screen.getByRole('menuitem', { name: /déconnexion/i })).toBeInTheDocument();
  });

  it('construit les entrées du menu hôte', () => {
    const items = buildUserMenuItems({
      canAccessHostDashboard: true,
      hasProperty: true,
      onLogout: vi.fn(),
    });

    expect(items.map((item) => item.label)).toEqual([
      'Mon profil',
      'Mes achats',
      'Gérer mon hôtel',
      'Déconnexion',
    ]);
  });
});
