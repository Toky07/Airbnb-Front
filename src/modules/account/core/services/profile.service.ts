import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { mapProfileUpdateResponse } from '../mappers/map-profile-response';
import type { ProfileFormPayload, UpdateProfileResult } from '../types/profile.types';
import { buildProfileFormData } from './build-profile-form-data';

export class ProfileService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient = getHttpClient()) {
    this.httpClient = httpClient;
  }

  async update(payload: ProfileFormPayload): Promise<UpdateProfileResult> {
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
