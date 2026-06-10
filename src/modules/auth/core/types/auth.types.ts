export type UserProfile = {
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar: string;
};

export type HostAccess = {
  hasProperty: boolean;
  propertyId: number | null;
  propertyName: string | null;
  propertyCount: number;
};

export type AuthSession = {
  authId: number | null;
  email: string | null;
  profile: UserProfile | null;
  roles: string[];
  permissions: string[];
  isSuperAdmin: boolean;
  isHost: boolean;
  canAccessHostDashboard: boolean;
  hostAccess: HostAccess | null;
};

export type MeResponse = {
  id: number;
  email: string;
  roles: string[];
  permissions: string[];
  isSuperAdmin: boolean;
  profile: {
    userId: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatar: string;
  } | null;
  hostAccess: {
    isHost: boolean;
    hasProperty: boolean;
    propertyId: number | null;
    propertyName: string | null;
    propertyCount: number;
  } | null;
};

export const emptyAuthSession: AuthSession = {
  authId: null,
  email: null,
  profile: null,
  roles: [],
  permissions: [],
  isSuperAdmin: false,
  isHost: false,
  canAccessHostDashboard: false,
  hostAccess: null,
};
