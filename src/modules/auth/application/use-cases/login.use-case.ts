import type {
  AuthRepository,
  LoginCredentials,
  LoginResult,
} from '../ports/auth.repository';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(credentials: LoginCredentials): Promise<LoginResult> {
    return this.authRepository.login(credentials);
  }
}
