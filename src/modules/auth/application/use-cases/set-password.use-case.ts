import type { AuthRepository, MutationResult } from '../ports/auth.repository';

export class SetPasswordUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(token: string, password: string): Promise<MutationResult> {
    return this.authRepository.setPassword(token, password);
  }
}
