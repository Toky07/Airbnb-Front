import { canAccess, HOST_ROLE_SLUG } from '../../../../shared/permissions/permissions';
import type { AuthSession, MeResponse, UserProfile } from '../types/auth.types';
import { extractSessionFromToken } from '../utils/jwt-payload.util';

function mapProfile(raw: unknown): UserProfile | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as Record<string, unknown>;
  if (typeof record.userId !== 'number') {
    return null;
  }

  return {
    userId: record.userId,
    firstName: String(record.firstName ?? ''),
    lastName: String(record.lastName ?? ''),
    phoneNumber: String(record.phoneNumber ?? ''),
    avatar: String(record.avatar ?? ''),
  };
}

export function mapMeResponse(data: unknown): MeResponse | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (typeof record.id !== 'number' || typeof record.email !== 'string') {
    return null;
  }

  const hostAccessRaw = record.hostAccess;
  const hostAccess =
    hostAccessRaw && typeof hostAccessRaw === 'object'
      ? {
          isHost: Boolean((hostAccessRaw as Record<string, unknown>).isHost),
          hasProperty: Boolean(
            (hostAccessRaw as Record<string, unknown>).hasProperty,
          ),
          propertyId:
            typeof (hostAccessRaw as Record<string, unknown>).propertyId ===
            'number'
              ? ((hostAccessRaw as Record<string, unknown>).propertyId as number)
              : null,
          propertyName:
            typeof (hostAccessRaw as Record<string, unknown>).propertyName ===
            'string'
              ? ((hostAccessRaw as Record<string, unknown>).propertyName as string)
              : null,
        }
      : null;

  return {
    id: record.id,
    email: record.email,
    roles: Array.isArray(record.roles)
      ? record.roles.filter((role): role is string => typeof role === 'string')
      : [],
    permissions: Array.isArray(record.permissions)
      ? record.permissions.filter(
          (permission): permission is string => typeof permission === 'string',
        )
      : [],
    isSuperAdmin: Boolean(record.isSuperAdmin),
    profile: mapProfile(record.profile),
    hostAccess,
  };
}

function buildHostAccess(isHost: boolean, hostAccess: MeResponse['hostAccess']) {
  if (!isHost && !hostAccess?.hasProperty) {
    return null;
  }

  return hostAccess
    ? {
        hasProperty: hostAccess.hasProperty,
        propertyId: hostAccess.propertyId,
        propertyName: hostAccess.propertyName,
      }
    : {
        hasProperty: false,
        propertyId: null,
        propertyName: null,
      };
}

export function sessionFromToken(token: string | null): AuthSession {
  const tokenSession = extractSessionFromToken(token);

  return {
    authId: tokenSession.authId,
    email: tokenSession.email,
    profile: null,
    roles: tokenSession.roles,
    permissions: tokenSession.permissions,
    isSuperAdmin: tokenSession.isSuperAdmin,
    isHost: tokenSession.isHost,
    canAccessHostDashboard:
      tokenSession.isHost &&
      canAccess(
        tokenSession.permissions,
        'host.dashboard.read',
        tokenSession.isSuperAdmin,
      ),
    hostAccess: tokenSession.isHost
      ? {
          hasProperty: false,
          propertyId: null,
          propertyName: null,
        }
      : null,
  };
}

export function mergeMeIntoSession(
  token: string | null,
  me: MeResponse | null,
): AuthSession {
  if (!me) {
    return sessionFromToken(token);
  }

  const isHost =
    Boolean(me.hostAccess?.isHost) ||
    Boolean(me.hostAccess?.hasProperty) ||
    me.roles.includes(HOST_ROLE_SLUG) ||
    me.isSuperAdmin;

  return {
    authId: me.id,
    email: me.email,
    profile: me.profile,
    roles: me.roles,
    permissions: me.permissions,
    isSuperAdmin: me.isSuperAdmin,
    isHost,
    canAccessHostDashboard:
      isHost && canAccess(me.permissions, 'host.dashboard.read', me.isSuperAdmin),
    hostAccess: buildHostAccess(isHost, me.hostAccess),
  };
}
