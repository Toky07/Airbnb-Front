import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import type { HostBlockedDateRepository } from '../../application/blocked-date/ports/host-blocked-date.repository';
import type {
  CreateRoomBlockedDatePayload,
  RoomBlockedDate,
  RoomBlockedDateMutationResult,
} from '../../core/types/blocked-date.types';
import { mapRoomBlockedDate } from '../../core/mappers/map-room-blocked-date';

export class HttpHostBlockedDateRepository implements HostBlockedDateRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async listBlockedDates(propertyId: number, roomId: number): Promise<RoomBlockedDate[]> {
    const response = await this.httpClient.get(
      `/host/rooms/${roomId}/blocked-dates?propertyId=${propertyId}`,
    );

    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    return Array.isArray(data)
      ? data.map(mapRoomBlockedDate).filter((item): item is RoomBlockedDate => item !== null)
      : [];
  }

  async createBlockedDate(
    propertyId: number,
    roomId: number,
    payload: CreateRoomBlockedDatePayload,
  ): Promise<RoomBlockedDateMutationResult> {
    const response = await this.httpClient.post(
      `/host/rooms/${roomId}/blocked-dates?propertyId=${propertyId}`,
      payload,
    );
    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de bloquer ces dates.'),
      };
    }

    const blockedDate = mapRoomBlockedDate(data);
    if (!blockedDate) {
      return { success: false, error: 'Réponse invalide.' };
    }

    return { success: true, blockedDate };
  }

  async deleteBlockedDate(
    propertyId: number,
    roomId: number,
    blockedDateId: number,
  ): Promise<{ success: boolean; error?: string }> {
    const response = await this.httpClient.delete(
      `/host/rooms/${roomId}/blocked-dates/${blockedDateId}?propertyId=${propertyId}`,
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
