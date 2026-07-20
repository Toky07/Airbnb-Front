import type {
  ProfileFormPayload,
  ProfileRepository,
} from '../ports/profile.repository';

export class UpdateProfileUseCase {
  private readonly profileRepository: ProfileRepository;

  constructor(profileRepository: ProfileRepository) {
    this.profileRepository = profileRepository;
  }

  execute(payload: ProfileFormPayload) {
    return this.profileRepository.updateProfile(payload);
  }
}
