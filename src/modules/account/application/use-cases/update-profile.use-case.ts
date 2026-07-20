import type {
  ProfileFormPayload,
  ProfileRepository,
} from '../ports/profile.repository';

export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  execute(payload: ProfileFormPayload) {
    return this.profileRepository.updateProfile(payload);
  }
}
