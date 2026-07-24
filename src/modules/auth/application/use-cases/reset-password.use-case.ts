import type { AuthRepository } from '../ports/auth.repository';

export class ResetPasswordUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(token: string, password: string) {
    return this.authRepository.resetPassword(token, password);
  }
}
