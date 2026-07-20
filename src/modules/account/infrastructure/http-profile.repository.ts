import type { HttpClient } from '../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../shared/http/parse-api-error';
import { mapProfileUpdateResponse } from '../core/mappers/map-profile-response';
import type {
  ProfileFormPayload,
  ProfileRepository,
  UpdateProfileResult,
} from '../application/ports/profile.repository';
import { buildProfileFormData } from './build-profile-form-data';

export class HttpProfileRepository implements ProfileRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async updateProfile(payload: ProfileFormPayload): Promise<UpdateProfileResult> {
    const response = await this.httpClient.putFormData(
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
