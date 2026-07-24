import type { AuthRepository } from '../ports/auth.repository';

export class ValidatePasswordResetUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(token: string) {
    return this.authRepository.validatePasswordReset(token);
  }
}
