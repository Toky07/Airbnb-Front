import type { AuthRepository } from '../ports/auth.repository';

export class ValidatePasswordSetupUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(token: string) {
    return this.authRepository.validatePasswordSetup(token);
  }
}
