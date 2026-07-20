import { getApiClient } from '../../../shared/http/api-client';
import { parseApiError } from '../../../shared/http/parse-api-error';
import { mapProfileUpdateResponse } from '../core/mappers/map-profile-response';
import type {
  ProfileFormPayload,
  ProfileRepository,
  UpdateProfileResult,
} from '../application/ports/profile.repository';
import { buildProfileFormData } from './build-profile-form-data';

export class HttpProfileRepository implements ProfileRepository {
  async updateProfile(payload: ProfileFormPayload): Promise<UpdateProfileResult> {
    const response = await getApiClient().putFormData(
      '/auth/profile',
      buildProfileFormData(payload),
    );
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Mise à jour impossible.'),
      };
    }

    const profile = mapProfileUpdateResponse(data);
    if (!profile) {
      return { success: false, error: 'Réponse invalide.' };
    }

    return { success: true, profile };
  }
}
