import type { AuthSession } from '../types/auth.types';
import { isSafeInternalRedirect } from '../../../../shared/http/parse-api-error';

export function resolvePostLoginRedirect(
  session: AuthSession,
  redirectPath?: string | null,
): string {
  if (isSafeInternalRedirect(redirectPath)) {
    return redirectPath;
  }

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
