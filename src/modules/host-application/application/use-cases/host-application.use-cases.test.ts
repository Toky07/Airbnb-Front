import { describe, expect, it, vi } from 'vitest';
import {
  GetMyHostApplicationUseCase,
  SubmitHostApplicationUseCase,
} from './host-application.use-cases';
import type { HostApplicationRepository } from '../ports/host-application.repository';

describe('host-application use-cases', () => {
  it('lit la demande courante', async () => {
    const repository: HostApplicationRepository = {
      getMine: vi.fn().mockResolvedValue(null),
      submit: vi.fn(),
    };

    const result = await new GetMyHostApplicationUseCase(repository).execute();

    expect(result).toBeNull();
    expect(repository.getMine).toHaveBeenCalledOnce();
  });

  it('envoie une candidature', async () => {
    const repository: HostApplicationRepository = {
      getMine: vi.fn(),
      submit: vi.fn().mockResolvedValue({
        success: true,
        application: { id: 1, city: 'Lyon' },
      }),
    };

    const result = await new SubmitHostApplicationUseCase(repository).execute({
      city: 'Lyon',
      message: 'Je souhaite proposer un loft au centre-ville de Lyon.',
    });

    expect(result.success).toBe(true);
    expect(repository.submit).toHaveBeenCalledWith({
      city: 'Lyon',
      message: 'Je souhaite proposer un loft au centre-ville de Lyon.',
    });
  });
});
