import { describe, expect, it } from 'vitest';
import {
  resolveHostAdminLabel,
  resolvePostLoginRedirect,
} from './resolve-post-login-redirect';
import type { AuthSession } from '../types/auth.types';

const hostSession: AuthSession = {
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

describe('resolve-post-login-redirect', () => {
  it('redirige un hôte vers /host', () => {
    expect(resolvePostLoginRedirect(hostSession)).toBe('/host');
  });

  it('affiche le nom de l’établissement dans le libellé admin', () => {
    expect(resolveHostAdminLabel(hostSession)).toBe('Gérer Hôtel Azur');
  });
});
