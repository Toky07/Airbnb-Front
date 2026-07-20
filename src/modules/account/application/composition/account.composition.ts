import type { ProfileRepository } from '../ports/profile.repository';
import { UpdateProfileUseCase } from '../use-cases/update-profile.use-case';
import { HttpProfileRepository } from '../../infrastructure/http-profile.repository';

let profileRepository: ProfileRepository | null = null;
let updateProfileUseCase: UpdateProfileUseCase | null = null;

export function getProfileRepository(): ProfileRepository {
  if (!profileRepository) {
    profileRepository = new HttpProfileRepository();
  }
  return profileRepository;
}

export function getUpdateProfileUseCase(): UpdateProfileUseCase {
  if (!updateProfileUseCase) {
    updateProfileUseCase = new UpdateProfileUseCase(getProfileRepository());
  }
  return updateProfileUseCase;
}
