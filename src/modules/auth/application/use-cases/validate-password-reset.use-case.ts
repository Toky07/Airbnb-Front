import type { AuthRepository } from '../ports/auth.repository';

export class ValidatePasswordResetUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(token: string) {
    return this.authRepository.validatePasswordReset(token);
  }
}
