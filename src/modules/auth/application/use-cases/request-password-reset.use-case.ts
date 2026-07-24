import type { AuthRepository } from '../ports/auth.repository';

export class RequestPasswordResetUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(email: string) {
    return this.authRepository.requestPasswordReset(email);
  }
}
