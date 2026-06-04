import type { AuthSession } from '../types/auth.types';

export function resolvePostLoginRedirect(session: AuthSession): string {
  if (session.canAccessHostDashboard) {
    return '/host';
  }

  return '/';
}

export function resolveHostAdminLabel(session: AuthSession): string {
  if (session.hostAccess?.propertyName) {
    return `Gérer ${session.hostAccess.propertyName}`;
  }

  if (session.hostAccess?.hasProperty) {
    return 'Gérer mon établissement';
  }

  return 'Espace hôte';
}
