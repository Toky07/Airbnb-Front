export const HOST_ROLE_SLUG = 'host';

export type PermissionKey =
  | 'host.dashboard.read'
  | 'host.property.read'
  | 'host.property.create'
  | 'host.property.update'
  | 'host.rooms.read'
  | 'host.rooms.create'
  | 'host.rooms.update'
  | 'host.rooms.delete';

export function canAccess(
  permissions: string[],
  required: PermissionKey | PermissionKey[],
  isSuperAdmin = false,
): boolean {
  if (isSuperAdmin) {
    return true;
  }

  const keys = Array.isArray(required) ? required : [required];
  return keys.every((key) => permissions.includes(key));
}

export function isHost(roles: string[]): boolean {
  return roles.includes(HOST_ROLE_SLUG);
}
