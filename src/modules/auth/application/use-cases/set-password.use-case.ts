import type { AuthRepository, MutationResult } from '../ports/auth.repository';

export class SetPasswordUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(token: string, password: string): Promise<MutationResult> {
    return this.authRepository.setPassword(token, password);
  }
}
