import type { HttpClient } from '../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { extractApiToken, parseApiError } from '../../../shared/http/parse-api-error';
import { mapMeResponse } from '../core/services/resolve-auth-session';
import type {
  AuthRepository,
  LoginCredentials,
  LoginResult,
  MutationResult,
  PasswordResetValidation,
  PasswordSetupValidation,
  RegisterPayload,
} from '../application/ports/auth.repository';

export class HttpAuthRepository implements AuthRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
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

  async becomeHost(): Promise<LoginResult> {
    const response = await this.httpClient.post('/auth/become-host', {});
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de devenir hôte.'),
      };
    }

    const token = extractApiToken(data);
    if (!token) {
      return { success: false, error: 'Impossible de devenir hôte.' };
    }

    return { success: true, token };
  }

  async validatePasswordSetup(token: string): Promise<PasswordSetupValidation> {
    const response = await this.httpClient.get(
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

  async requestPasswordReset(email: string): Promise<MutationResult> {
    const response = await this.httpClient.post('/auth/forgot-password', { email });
    if (!response.ok) {
      const data: unknown = await response.json();
      return {
        success: false,
        error: parseApiError(data, 'Demande impossible.'),
      };
    }

    return { success: true };
  }

  async validatePasswordReset(token: string): Promise<PasswordResetValidation> {
    const response = await this.httpClient.get(
      `/auth/reset-password/validate?token=${encodeURIComponent(token)}`,
    );

    if (!response.ok) {
      return { valid: false };
    }

    const data = (await response.json()) as { email?: string };
    return {
      valid: true,
      email: data.email,
    };
  }

  async resetPassword(token: string, password: string): Promise<MutationResult> {
    const response = await this.httpClient.post('/auth/reset-password', {
      token,
      password,
    });
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Réinitialisation impossible.'),
      };
    }

    return { success: true };
  }

  async fetchMe() {
    const response = await this.httpClient.get('/auth/me');
    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return mapMeResponse(data);
  }
}
