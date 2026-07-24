import type { AuthRepository } from '../ports/auth.repository';

export class RequestPasswordResetUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string) {
    return this.authRepository.requestPasswordReset(email);
  }
}
