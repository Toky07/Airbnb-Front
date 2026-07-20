import { describe, expect, it, vi } from 'vitest';
import { UpdateProfileUseCase } from './update-profile.use-case';
import type { ProfileRepository } from '../ports/profile.repository';

const sampleProfile = {
  userId: 5,
  firstName: 'Jean',
  lastName: 'Dupont',
  phoneNumber: '+33601020304',
  avatar: '',
};

function createProfileRepository(
  overrides: Partial<ProfileRepository> = {},
): ProfileRepository {
  return {
    updateProfile: vi.fn(),
    ...overrides,
  };
}

describe('UpdateProfileUseCase', () => {
  it('délègue la mise à jour au repository', async () => {
    const profileRepository = createProfileRepository({
      updateProfile: vi.fn().mockResolvedValue({ success: true, profile: sampleProfile }),
    });
    const useCase = new UpdateProfileUseCase(profileRepository);

    const payload = {
      firstName: 'Jean',
      lastName: 'Dupont',
      phoneNumber: '+33601020304',
      avatarFile: null,
    };
    const result = await useCase.execute(payload);

    expect(profileRepository.updateProfile).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ success: true, profile: sampleProfile });
  });
});
