import type { ProfileFormPayload } from '../application/ports/profile.repository';

export function buildProfileFormData(payload: ProfileFormPayload): FormData {
  const form = new FormData();
  form.append('firstName', payload.firstName);
  form.append('lastName', payload.lastName);
  form.append('phoneNumber', payload.phoneNumber);

  if (payload.avatarFile) {
    form.append('avatar', payload.avatarFile);
  }

  return form;
}
