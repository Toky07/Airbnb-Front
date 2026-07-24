import type { AuthRepository, LoginResult } from '../ports/auth.repository';

export class BecomeHostUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(): Promise<LoginResult> {
    return this.authRepository.becomeHost();
  }
}
