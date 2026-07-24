import { describe, expect, it, vi } from 'vitest';
import { LoginUseCase } from './login.use-case';
import type { AuthRepository } from '../ports/auth.repository';

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

describe('LoginUseCase', () => {
  it('retourne le token lorsque les identifiants sont valides', async () => {
    const authRepository = createAuthRepository({
      login: vi.fn().mockResolvedValue({ success: true, token: 'jwt-token' }),
    });
    const useCase = new LoginUseCase(authRepository);

    const result = await useCase.execute({
      email: 'user@test.com',
      password: 'secret',
    });

    expect(result).toEqual({ success: true, token: 'jwt-token' });
    expect(authRepository.login).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'secret',
    });
  });

  it('retourne une erreur lorsque les identifiants sont invalides', async () => {
    const authRepository = createAuthRepository({
      login: vi.fn().mockResolvedValue({
        success: false,
        error: 'Identifiants invalides.',
      }),
    });
    const useCase = new LoginUseCase(authRepository);

    const result = await useCase.execute({
      email: 'user@test.com',
      password: 'wrong',
    });

    expect(result).toEqual({
      success: false,
      error: 'Identifiants invalides.',
    });
  });
});
