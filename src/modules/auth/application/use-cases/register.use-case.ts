import type {
  AuthRepository,
  MutationResult,
  RegisterPayload,
} from '../ports/auth.repository';

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(payload: RegisterPayload): Promise<MutationResult> {
    return this.authRepository.register(payload);
  }
}
