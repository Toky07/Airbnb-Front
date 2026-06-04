import { HOST_ROLE_SLUG } from '../../../../shared/permissions/permissions';

export type JwtPayload = {
  sub?: number;
  email?: string;
  roles?: string[];
  permissions?: string[];
  isSuperAdmin?: boolean;
  exp?: number;
};

export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    return JSON.parse(atob(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractSessionFromToken(token: string | null) {
  if (!token) {
    return {
      authId: null,
      email: null,
      roles: [] as string[],
      permissions: [] as string[],
      isSuperAdmin: false,
      isHost: false,
    };
  }

  const payload = parseJwtPayload(token);
  const roles = payload?.roles ?? [];
  const isSuperAdmin = Boolean(payload?.isSuperAdmin);

  return {
    authId: typeof payload?.sub === 'number' ? payload.sub : null,
    email: payload?.email ?? null,
    roles,
    permissions: payload?.permissions ?? [],
    isSuperAdmin,
    isHost: roles.includes(HOST_ROLE_SLUG) || isSuperAdmin,
  };
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (typeof payload?.exp !== 'number') {
    return false;
  }
  return Date.now() >= payload.exp * 1000;
}
