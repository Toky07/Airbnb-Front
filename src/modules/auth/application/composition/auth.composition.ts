import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import type { AuthRepository } from '../ports/auth.repository';
import type { SessionStore } from '../ports/session.store';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LoadSessionUseCase } from '../use-cases/load-session.use-case';
import { RegisterUseCase } from '../use-cases/register.use-case';
import { SetPasswordUseCase } from '../use-cases/set-password.use-case';
import { ValidatePasswordSetupUseCase } from '../use-cases/validate-password-setup.use-case';
import { HttpAuthRepository } from '../../infrastructure/http-auth.repository';
import { getTokenSessionStore } from '../../infrastructure/token-session.store';

let authRepository: AuthRepository | null = null;
let loginUseCase: LoginUseCase | null = null;
let loadSessionUseCase: LoadSessionUseCase | null = null;
let registerUseCase: RegisterUseCase | null = null;
let validatePasswordSetupUseCase: ValidatePasswordSetupUseCase | null = null;
let setPasswordUseCase: SetPasswordUseCase | null = null;

export function getAuthRepository(): AuthRepository {
  if (!authRepository) {
    authRepository = new HttpAuthRepository(getHttpClient());
  }
  return authRepository;
}

export function getSessionStore(): SessionStore {
  return getTokenSessionStore();
}

export function getLoginUseCase(): LoginUseCase {
  if (!loginUseCase) {
    loginUseCase = new LoginUseCase(getAuthRepository());
  }
  return loginUseCase;
}

export function getLoadSessionUseCase(): LoadSessionUseCase {
  if (!loadSessionUseCase) {
    loadSessionUseCase = new LoadSessionUseCase(getSessionStore(), getAuthRepository());
  }
  return loadSessionUseCase;
}

export function getRegisterUseCase(): RegisterUseCase {
  if (!registerUseCase) {
    registerUseCase = new RegisterUseCase(getAuthRepository());
  }
  return registerUseCase;
}

export function getValidatePasswordSetupUseCase(): ValidatePasswordSetupUseCase {
  if (!validatePasswordSetupUseCase) {
    validatePasswordSetupUseCase = new ValidatePasswordSetupUseCase(getAuthRepository());
  }
  return validatePasswordSetupUseCase;
}

export function getSetPasswordUseCase(): SetPasswordUseCase {
  if (!setPasswordUseCase) {
    setPasswordUseCase = new SetPasswordUseCase(getAuthRepository());
  }
  return setPasswordUseCase;
}
