import { getApiClient } from '../../../../shared/http/api-client';
import type { UserProfile } from '../../../auth/core/types/auth.types';

export type ProfileFormPayload = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarFile?: File | null;
};

function buildProfileFormData(payload: ProfileFormPayload): FormData {
  const form = new FormData();
  form.append('firstName', payload.firstName);
  form.append('lastName', payload.lastName);
  form.append('phoneNumber', payload.phoneNumber);
  if (payload.avatarFile) {
    form.append('avatar', payload.avatarFile);
  }
  return form;
}

function mapProfile(data: unknown): UserProfile | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (typeof record.id !== 'number') {
    return null;
  }

  return {
    userId: record.id,
    firstName: String(record.firstName ?? ''),
    lastName: String(record.lastName ?? ''),
    phoneNumber: String(record.phoneNumber ?? ''),
    avatar: String(record.avatar ?? ''),
  };
}

async function parseError(response: Response, fallback: string): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      if (typeof record.message === 'string') {
        return record.message;
      }
      if (Array.isArray(record.message)) {
        return record.message.join(', ');
      }
    }
  } catch {
    // ignore
  }

  return fallback;
}

export class ProfileService {
  async updateProfile(
    payload: ProfileFormPayload,
  ): Promise<{ success: true; profile: UserProfile } | { success: false; error: string }> {
    const response = await getApiClient().putFormData(
      '/auth/profile',
      buildProfileFormData(payload),
    );

    if (!response.ok) {
      return {
        success: false,
        error: await parseError(response, 'Mise à jour impossible.'),
      };
    }

    const profile = mapProfile(await response.json());
    if (!profile) {
      return { success: false, error: 'Réponse invalide.' };
    }

    return { success: true, profile };
  }
}

let service: ProfileService | null = null;

export function getProfileService(): ProfileService {
  if (!service) {
    service = new ProfileService();
  }
  return service;
}
