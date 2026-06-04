import { getApiClient } from '../../../../shared/http/api-client';
import { getTokenStorage } from '../../../../shared/http/token-storage';
import { mapMeResponse } from './resolve-auth-session';
import type { MeResponse } from '../types/auth.types';

export class AuthSessionService {
  getToken(): string | null {
    return getTokenStorage().getToken();
  }

  setSession(token: string): void {
    getTokenStorage().setToken(token);
  }

  clearSession(): void {
    getTokenStorage().clearToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }
      const payload = JSON.parse(atob(parts[1])) as { exp?: number };
      if (typeof payload.exp !== 'number') {
        return false;
      }
      return Date.now() >= payload.exp * 1000;
    } catch {
      return false;
    }
  }
}

let service: AuthSessionService | null = null;

export function getAuthSessionService(): AuthSessionService {
  if (!service) {
    service = new AuthSessionService();
  }
  return service;
}

export type LoginResult =
  | { success: true; token: string }
  | { success: false; error: string };

export class AuthService {
  async login(email: string, password: string): Promise<LoginResult> {
    const response = await getApiClient().post('/auth/login', { email, password });
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: extractErrorMessage(data, 'Identifiants invalides.'),
      };
    }

    const token = extractToken(data);
    if (!token) {
      return { success: false, error: 'Identifiants invalides.' };
    }

    return { success: true, token };
  }

  async register(payload: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }): Promise<{ success: boolean; error?: string }> {
    const response = await getApiClient().post('/auth/register', payload);
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: extractErrorMessage(data, 'Inscription impossible.'),
      };
    }

    return { success: true };
  }

  async validatePasswordSetup(token: string): Promise<{
    valid: boolean;
    email?: string;
    firstName?: string;
    lastName?: string;
  }> {
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

  async setPassword(
    token: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    const response = await getApiClient().post('/auth/password-setup', {
      token,
      password,
    });
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: extractErrorMessage(data, 'Activation impossible.'),
      };
    }

    return { success: true };
  }

  async fetchMe(): Promise<MeResponse | null> {
    const response = await getApiClient().get('/auth/me');
    if (!response.ok) {
      return null;
    }
    const data: unknown = await response.json();
    return mapMeResponse(data);
  }
}

let authService: AuthService | null = null;

export function getAuthService(): AuthService {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
}

function extractToken(data: unknown): string | null {
  if (data && typeof data === 'object' && typeof (data as Record<string, unknown>).token === 'string') {
    return (data as Record<string, unknown>).token as string;
  }
  return null;
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.message === 'string') {
      return record.message;
    }
    if (Array.isArray(record.message)) {
      return record.message.join(', ');
    }
  }
  return fallback;
}
