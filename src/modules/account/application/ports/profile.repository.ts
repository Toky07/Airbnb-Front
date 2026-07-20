import type { UserProfile } from '../../../auth/core/types/auth.types';

export type ProfileFormPayload = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarFile?: File | null;
};

export type UpdateProfileResult =
  | { success: true; profile: UserProfile }
  | { success: false; error: string };

export interface ProfileRepository {
  updateProfile(payload: ProfileFormPayload): Promise<UpdateProfileResult>;
}
