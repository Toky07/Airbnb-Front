import { describe, expect, it, vi } from 'vitest';
import { emptyAuthSession } from '../../core/types/auth.types';
import { LoadSessionUseCase } from './load-session.use-case';
import type { AuthRepository } from '../ports/auth.repository';
import type { SessionStore } from '../ports/session.store';

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

function createAuthRepository(
  overrides: Partial<AuthRepository> = {},
): AuthRepository {
  return {
    login: vi.fn(),
    register: vi.fn(),
    becomeHost: vi.fn(),
    validatePasswordSetup: vi.fn(),
    setPassword: vi.fn(),
    requestPasswordReset: vi.fn(),
    validatePasswordReset: vi.fn(),
    resetPassword: vi.fn(),
    fetchMe: vi.fn(),
    ...overrides,
  };
}

describe('LoadSessionUseCase', () => {
  it('retourne une session vide sans token', async () => {
    const useCase = new LoadSessionUseCase(
      createSessionStore({ getToken: vi.fn().mockReturnValue(null) }),
      createAuthRepository(),
    );

    await expect(useCase.execute()).resolves.toEqual(emptyAuthSession);
  });

  it('retourne une session vide si le token est expiré', async () => {
    const expiredToken = buildToken({
      sub: 1,
      email: 'user@test.com',
      exp: Math.floor(Date.now() / 1000) - 60,
    });
    const useCase = new LoadSessionUseCase(
      createSessionStore({ getToken: vi.fn().mockReturnValue(expiredToken) }),
      createAuthRepository(),
    );

    await expect(useCase.execute()).resolves.toEqual(emptyAuthSession);
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
    const authRepository = createAuthRepository({
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
    const useCase = new LoadSessionUseCase(
      createSessionStore({ getToken: vi.fn().mockReturnValue(token) }),
      authRepository,
    );

    const session = await useCase.execute();

    expect(authRepository.fetchMe).toHaveBeenCalledOnce();
    expect(session.canAccessHostDashboard).toBe(true);
    expect(session.profile?.firstName).toBe('Jean');
    expect(session.hostAccess?.propertyName).toBe('Hôtel Azur');
  });
});
