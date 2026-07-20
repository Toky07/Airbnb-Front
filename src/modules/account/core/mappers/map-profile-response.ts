import type { UserProfile } from '../../../auth/core/types/auth.types';

export function mapProfileUpdateResponse(data: unknown): UserProfile | null {
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
