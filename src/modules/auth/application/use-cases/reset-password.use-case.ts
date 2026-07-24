import type { AuthRepository } from '../ports/auth.repository';

export class ResetPasswordUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(token: string, password: string) {
    return this.authRepository.resetPassword(token, password);
  }
}
