import { describe, expect, it } from 'vitest';
import { mergeMeIntoSession } from './resolve-auth-session';
import type { MeResponse } from '../types/auth.types';

function buildToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

describe('resolve-auth-session', () => {
  it('fusionne /auth/me avec le token pour détecter un hôte propriétaire', () => {
    const token = buildToken({
      sub: 1,
      email: 'host@test.com',
      roles: ['host'],
      permissions: ['host.dashboard.read'],
      isSuperAdmin: false,
    });

    const me: MeResponse = {
      id: 1,
      email: 'host@test.com',
      roles: ['host'],
      permissions: ['host.dashboard.read'],
      isSuperAdmin: false,
      profile: {
        userId: 5,
        firstName: 'Jean',
        lastName: 'Dupont',
        phoneNumber: '+33601020304',
        avatar: 'uploads/users/5/avatar.jpg',
      },
      hostAccess: {
        isHost: true,
        hasProperty: true,
        propertyId: 10,
        propertyName: 'Hôtel Azur',
      },
    };

    const session = mergeMeIntoSession(token, me);

    expect(session.canAccessHostDashboard).toBe(true);
    expect(session.profile?.firstName).toBe('Jean');
    expect(session.hostAccess?.propertyName).toBe('Hôtel Azur');
  });
});
