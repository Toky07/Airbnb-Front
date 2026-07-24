import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import type { AuthRepository } from '../ports/auth.repository';
import type { SessionStore } from '../ports/session.store';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LoadSessionUseCase } from '../use-cases/load-session.use-case';
import { RegisterUseCase } from '../use-cases/register.use-case';
import { BecomeHostUseCase } from '../use-cases/become-host.use-case';
import { SetPasswordUseCase } from '../use-cases/set-password.use-case';
import { ValidatePasswordSetupUseCase } from '../use-cases/validate-password-setup.use-case';
import { RequestPasswordResetUseCase } from '../use-cases/request-password-reset.use-case';
import { ValidatePasswordResetUseCase } from '../use-cases/validate-password-reset.use-case';
import { ResetPasswordUseCase } from '../use-cases/reset-password.use-case';
import { HttpAuthRepository } from '../../infrastructure/http-auth.repository';
import { getTokenSessionStore } from '../../infrastructure/token-session.store';

let authRepository: AuthRepository | null = null;
let loginUseCase: LoginUseCase | null = null;
let loadSessionUseCase: LoadSessionUseCase | null = null;
let registerUseCase: RegisterUseCase | null = null;
let becomeHostUseCase: BecomeHostUseCase | null = null;
let validatePasswordSetupUseCase: ValidatePasswordSetupUseCase | null = null;
let setPasswordUseCase: SetPasswordUseCase | null = null;
let requestPasswordResetUseCase: RequestPasswordResetUseCase | null = null;
let validatePasswordResetUseCase: ValidatePasswordResetUseCase | null = null;
let resetPasswordUseCase: ResetPasswordUseCase | null = null;

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

export function getBecomeHostUseCase(): BecomeHostUseCase {
  if (!becomeHostUseCase) {
    becomeHostUseCase = new BecomeHostUseCase(getAuthRepository());
  }
  return becomeHostUseCase;
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

export function getRequestPasswordResetUseCase(): RequestPasswordResetUseCase {
  if (!requestPasswordResetUseCase) {
    requestPasswordResetUseCase = new RequestPasswordResetUseCase(getAuthRepository());
  }
  return requestPasswordResetUseCase;
}

export function getValidatePasswordResetUseCase(): ValidatePasswordResetUseCase {
  if (!validatePasswordResetUseCase) {
    validatePasswordResetUseCase = new ValidatePasswordResetUseCase(getAuthRepository());
  }
  return validatePasswordResetUseCase;
}

export function getResetPasswordUseCase(): ResetPasswordUseCase {
  if (!resetPasswordUseCase) {
    resetPasswordUseCase = new ResetPasswordUseCase(getAuthRepository());
  }
  return resetPasswordUseCase;
}
