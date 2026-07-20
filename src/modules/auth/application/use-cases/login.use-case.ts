import type {
  AuthRepository,
  LoginCredentials,
  LoginResult,
} from '../ports/auth.repository';

export class LoginUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(credentials: LoginCredentials): Promise<LoginResult> {
    return this.authRepository.login(credentials);
  }
}
