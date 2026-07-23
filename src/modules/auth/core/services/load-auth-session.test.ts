import { describe, expect, it, vi } from 'vitest';
import { emptyAuthSession } from '../types/auth.types';
import type { AuthService } from './auth.service';
import { loadAuthSession } from './load-auth-session';
import type { SessionStore } from './token-session.store';

function buildToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

function createSessionStore(overrides: Partial<SessionStore> = {}): SessionStore {
  return {
    getToken: vi.fn(),
    setToken: vi.fn(),
    clearToken: vi.fn(),
    isAuthenticated: vi.fn(),
    ...overrides,
  };
}

function createAuthService(overrides: Partial<AuthService> = {}): AuthService {
  return {
    login: vi.fn(),
    register: vi.fn(),
    validatePasswordSetup: vi.fn(),
    setPassword: vi.fn(),
    fetchMe: vi.fn(),
    ...overrides,
  } as unknown as AuthService;
}

describe('loadAuthSession', () => {
  it('retourne une session vide sans token', async () => {
    const sessionStore = createSessionStore({ getToken: vi.fn().mockReturnValue(null) });

    await expect(
      loadAuthSession({ sessionStore, authService: createAuthService() }),
    ).resolves.toEqual(emptyAuthSession);
  });

  it('retourne une session vide si le token est expiré', async () => {
    const expiredToken = buildToken({
      sub: 1,
      email: 'user@test.com',
      exp: Math.floor(Date.now() / 1000) - 60,
    });
    const sessionStore = createSessionStore({
      getToken: vi.fn().mockReturnValue(expiredToken),
    });

    await expect(
      loadAuthSession({ sessionStore, authService: createAuthService() }),
    ).resolves.toEqual(emptyAuthSession);
  });

  it('fusionne /auth/me avec le token pour construire la session', async () => {
    const token = buildToken({
      sub: 1,
      email: 'host@test.com',
      roles: ['host'],
      permissions: ['host.dashboard.read'],
      isSuperAdmin: false,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const authService = createAuthService({
      fetchMe: vi.fn().mockResolvedValue({
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
          avatar: '',
        },
        hostAccess: {
          isHost: true,
          hasProperty: true,
          propertyId: 10,
          propertyName: 'Hôtel Azur',
          propertyCount: 1,
        },
      }),
    });
    const sessionStore = createSessionStore({ getToken: vi.fn().mockReturnValue(token) });

    const session = await loadAuthSession({ sessionStore, authService });

    expect(authService.fetchMe).toHaveBeenCalledOnce();
    expect(session.canAccessHostDashboard).toBe(true);
    expect(session.profile?.firstName).toBe('Jean');
    expect(session.hostAccess?.propertyName).toBe('Hôtel Azur');
  });
});
