import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import type { HostRateOverrideRepository } from '../../application/rate-override/ports/host-rate-override.repository';
import type {
  CreateRoomRateOverridePayload,
  RoomRateOverride,
  RoomRateOverrideMutationResult,
} from '../../core/types/rate-override.types';
import { mapRoomRateOverride } from '../../core/mappers/map-room-rate-override';

export class HttpHostRateOverrideRepository implements HostRateOverrideRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async listRateOverrides(propertyId: number, roomId: number): Promise<RoomRateOverride[]> {
    const response = await this.httpClient.get(
      `/host/rooms/${roomId}/rate-overrides?propertyId=${propertyId}`,
    );

    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    return Array.isArray(data)
      ? data.map(mapRoomRateOverride).filter((item): item is RoomRateOverride => item !== null)
      : [];
  }

  async createRateOverride(
    propertyId: number,
    roomId: number,
    payload: CreateRoomRateOverridePayload,
  ): Promise<RoomRateOverrideMutationResult> {
    const response = await this.httpClient.post(
      `/host/rooms/${roomId}/rate-overrides?propertyId=${propertyId}`,
      payload,
    );
    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, error: parseApiError(data, 'Impossible d’enregistrer ce tarif.') };
    }

    const rateOverride = mapRoomRateOverride(data);
    if (!rateOverride) {
      return { success: false, error: 'Réponse invalide.' };
    }

    return { success: true, rateOverride };
  }

  async deleteRateOverride(
    propertyId: number,
    roomId: number,
    rateOverrideId: number,
  ): Promise<{ success: boolean; error?: string }> {
    const response = await this.httpClient.delete(
      `/host/rooms/${roomId}/rate-overrides/${rateOverrideId}?propertyId=${propertyId}`,
    );

    if (!response.ok) {
      const data: unknown = await response.json().catch(() => null);
      return {
        success: false,
        error: parseApiError(data, 'Suppression impossible.'),
      };
    }

    return { success: true };
  }
}
