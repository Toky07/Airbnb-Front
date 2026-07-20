import { getApiClient } from '../../../shared/http/api-client';
import { extractApiToken, parseApiError } from '../../../shared/http/parse-api-error';
import { mapMeResponse } from '../core/services/resolve-auth-session';
import type {
  AuthRepository,
  LoginCredentials,
  LoginResult,
  MutationResult,
  PasswordSetupValidation,
  RegisterPayload,
} from '../application/ports/auth.repository';

export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const response = await getApiClient().post('/auth/login', credentials);
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Identifiants invalides.'),
      };
    }

    const token = extractApiToken(data);
    if (!token) {
      return { success: false, error: 'Identifiants invalides.' };
    }

    return { success: true, token };
  }

  async register(payload: RegisterPayload): Promise<MutationResult> {
    const response = await getApiClient().post('/auth/register', payload);
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Inscription impossible.'),
      };
    }

    return { success: true };
  }

  async validatePasswordSetup(token: string): Promise<PasswordSetupValidation> {
    const response = await getApiClient().get(
      `/auth/password-setup/validate?token=${encodeURIComponent(token)}`,
    );

    if (!response.ok) {
      return { valid: false };
    }

    const data = (await response.json()) as {
      valid?: boolean;
      email?: string;
      firstName?: string;
      lastName?: string;
    };

    return {
      valid: Boolean(data.valid),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };
  }

  async setPassword(token: string, password: string): Promise<MutationResult> {
    const response = await getApiClient().post('/auth/password-setup', {
      token,
      password,
    });
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Activation impossible.'),
      };
    }

    return { success: true };
  }

  async fetchMe() {
    const response = await getApiClient().get('/auth/me');
    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return mapMeResponse(data);
  }
}
