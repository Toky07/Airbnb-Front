import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BecomeHostUseCase } from './become-host.use-case';
import type { AuthRepository } from '../ports/auth.repository';

describe('BecomeHostUseCase', () => {
  const authRepository = {
    becomeHost: vi.fn(),
  } as unknown as AuthRepository;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('délègue au repository', async () => {
    vi.mocked(authRepository.becomeHost).mockResolvedValue({
      success: true,
      token: 'jwt',
    });

    const useCase = new BecomeHostUseCase(authRepository);
    const result = await useCase.execute();

    expect(authRepository.becomeHost).toHaveBeenCalledOnce();
    expect(result).toEqual({ success: true, token: 'jwt' });
  });
});
