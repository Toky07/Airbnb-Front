import type { MeResponse } from '../../core/types/auth.types';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type LoginResult =
  | { success: true; token: string }
  | { success: false; error: string };

export type MutationResult =
  | { success: true }
  | { success: false; error: string };

export type PasswordSetupValidation = {
  valid: boolean;
  email?: string;
  firstName?: string;
  lastName?: string;
};

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResult>;
  register(payload: RegisterPayload): Promise<MutationResult>;
  validatePasswordSetup(token: string): Promise<PasswordSetupValidation>;
  setPassword(token: string, password: string): Promise<MutationResult>;
  fetchMe(): Promise<MeResponse | null>;
}
