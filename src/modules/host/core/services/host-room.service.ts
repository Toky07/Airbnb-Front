import { getApiClient } from '../../../../shared/http/api-client';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import { buildListQuery } from '../../../../shared/pagination/build-list-query';
import { parsePaginatedResponse } from '../../../../shared/pagination/parse-paginated-response';
import type { ListQueryParams } from '../../../../shared/pagination/types';
import type { CategorySummary, RoomListItem } from '../../../rooms/core/types/room.types';
import { mapRoomListItem } from '../../../rooms/core/types/room.types';
import { mapCategoryOption } from '../mappers/map-host-property';
import { buildRoomFormData } from '../utils/build-room-form-data';
import type { RoomFormPayload } from '../types/host.types';

export class HostRoomService {
  async listRooms(propertyId: number, params: ListQueryParams = {}) {
    const response = await getApiClient().get(
      `/host/rooms${buildListQuery({ ...params, propertyId })}`,
    );

    if (!response.ok) {
      return {
        data: [] as RoomListItem[],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }

    const data: unknown = await response.json();
    return parsePaginatedResponse(data, mapRoomListItem);
  }

  async createRoom(
    propertyId: number,
    payload: RoomFormPayload,
  ): Promise<{ success: boolean; room?: RoomListItem; error?: string }> {
    const response = await getApiClient().postFormData(
      `/host/rooms?propertyId=${propertyId}`,
      buildRoomFormData(payload),
    );

    if (!response.ok) {
      const data: unknown = await response.json().catch(() => null);
      return {
        success: false,
        error: parseApiError(data, 'Création impossible.'),
      };
    }

    const data: unknown = await response.json();
    const room = mapRoomListItem(data);
    return room ? { success: true, room } : { success: false, error: 'Réponse invalide.' };
  }

  async updateRoom(
    propertyId: number,
    id: number,
    payload: RoomFormPayload,
  ): Promise<{ success: boolean; room?: RoomListItem; error?: string }> {
    const response = await getApiClient().putFormData(
      `/host/rooms/${id}?propertyId=${propertyId}`,
      buildRoomFormData(payload),
    );

    if (!response.ok) {
      const data: unknown = await response.json().catch(() => null);
      return {
        success: false,
        error: parseApiError(data, 'Modification impossible.'),
      };
    }

    const data: unknown = await response.json();
    const room = mapRoomListItem(data);
    return room ? { success: true, room } : { success: false, error: 'Réponse invalide.' };
  }

  async deleteRoom(
    propertyId: number,
    id: number,
  ): Promise<{ success: boolean; error?: string }> {
    const response = await getApiClient().delete(`/host/rooms/${id}?propertyId=${propertyId}`);

    if (!response.ok) {
      const data: unknown = await response.json().catch(() => null);
      return {
        success: false,
        error: parseApiError(data, 'Suppression impossible.'),
      };
    }

    return { success: true };
  }

  async listPropertyTypeOptions(): Promise<CategorySummary[]> {
    const response = await getApiClient().get('/host/property-types/options');
    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    return Array.isArray(data)
      ? data.map(mapCategoryOption).filter((item): item is CategorySummary => item !== null)
      : [];
  }

  async listRoomTypeOptions(): Promise<CategorySummary[]> {
    const response = await getApiClient().get('/host/room-types/options');
    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    return Array.isArray(data)
      ? data.map(mapCategoryOption).filter((item): item is CategorySummary => item !== null)
      : [];
  }
}

let roomService: HostRoomService | null = null;

export function getHostRoomService(): HostRoomService {
  if (!roomService) {
    roomService = new HostRoomService();
  }
  return roomService;
}
