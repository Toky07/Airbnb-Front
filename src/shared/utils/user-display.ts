import type { AuthSession } from '../../modules/auth/core/types/auth.types';

export function getUserDisplayName(session: Pick<AuthSession, 'profile' | 'email'>): string {
  const firstName = session.profile?.firstName?.trim() ?? '';
  const lastName = session.profile?.lastName?.trim() ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName;
  }

  return session.email ?? 'Mon compte';
}

export function getUserInitials(session: Pick<AuthSession, 'profile' | 'email'>): string {
  const firstName = session.profile?.firstName?.trim() ?? '';
  const lastName = session.profile?.lastName?.trim() ?? '';

  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';
  }

  const email = session.email?.trim() ?? '';
  return email.slice(0, 2).toUpperCase() || '?';
}
