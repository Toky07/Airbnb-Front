import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import { extractApiToken, parseApiError } from '../../../../shared/http/parse-api-error';
import type { HttpClient } from '../../../../shared/http/ports/http-client';
import type {
  LoginCredentials,
  LoginResult,
  MutationResult,
  PasswordSetupValidation,
  RegisterPayload,
} from '../types/auth-mutation.types';
import type { MeResponse } from '../types/auth.types';
import { mapMeResponse } from './resolve-auth-session';

export class AuthService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient = getHttpClient()) {
    this.httpClient = httpClient;
  }

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const response = await this.httpClient.post('/auth/login', credentials);
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
    const response = await this.httpClient.post('/auth/register', payload);
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
    const response = await this.httpClient.post(
      '/auth/password-setup/validate',
      { token },
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
    const response = await this.httpClient.post('/auth/password-setup', {
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

  async fetchMe(): Promise<MeResponse | null> {
    const response = await this.httpClient.get('/auth/me');
    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return mapMeResponse(data);
  }
}
