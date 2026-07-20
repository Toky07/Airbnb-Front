import type {
  AuthRepository,
  MutationResult,
  RegisterPayload,
} from '../ports/auth.repository';

export class RegisterUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(payload: RegisterPayload): Promise<MutationResult> {
    return this.authRepository.register(payload);
  }
}
