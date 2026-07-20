import { mergeMeIntoSession } from '../../core/services/resolve-auth-session';
import { emptyAuthSession, type AuthSession } from '../../core/types/auth.types';
import { isTokenExpired } from '../../core/utils/jwt-payload.util';
import type { AuthRepository } from '../ports/auth.repository';
import type { SessionStore } from '../ports/session.store';

export class LoadSessionUseCase {
  private readonly sessionStore: SessionStore;
  private readonly authRepository: AuthRepository;

  constructor(sessionStore: SessionStore, authRepository: AuthRepository) {
    this.sessionStore = sessionStore;
    this.authRepository = authRepository;
  }

  async execute(token?: string | null): Promise<AuthSession> {
    const effectiveToken = token ?? this.sessionStore.getToken();

    if (!effectiveToken || isTokenExpired(effectiveToken)) {
      return emptyAuthSession;
    }

    const me = await this.authRepository.fetchMe();
    return mergeMeIntoSession(effectiveToken, me);
  }
}
