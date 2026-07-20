import { getApiClient } from '../../../../shared/http/api-client';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import { buildListQuery } from '../../../../shared/pagination/build-list-query';
import { parsePaginatedResponse } from '../../../../shared/pagination/parse-paginated-response';
import type { ListQueryParams, PaginatedResponse } from '../../../../shared/pagination/types';
import type { CategorySummary, RoomListItem } from '../../../rooms/core/types/room.types';
import { mapRoomListItem } from '../../../rooms/core/types/room.types';
import { mapCategoryOption } from '../../core/mappers/map-host-property';
import type {
  DeleteRoomResult,
  HostRoomRepository,
  RoomMutationResult,
} from '../../application/room/ports/host-room.repository';
import type { RoomFormPayload } from '../../core/types/host.types';
import { buildRoomFormData } from './build-room-form-data';

const EMPTY_ROOM_LIST: PaginatedResponse<RoomListItem> = {
  data: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

async function parseRoomMutationResponse(
  response: Response,
  errorFallback: string,
): Promise<RoomMutationResult> {
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return { success: false, error: parseApiError(data, errorFallback) };
  }

  const room = mapRoomListItem(data);
  if (!room) {
    return { success: false, error: 'Réponse invalide.' };
  }

  return { success: true, room };
}

function mapCategoryOptions(data: unknown): CategorySummary[] {
  return Array.isArray(data)
    ? data.map(mapCategoryOption).filter((item): item is CategorySummary => item !== null)
    : [];
}

export class HttpHostRoomRepository implements HostRoomRepository {
  async listRooms(propertyId: number, params: ListQueryParams = {}) {
    const response = await getApiClient().get(
      `/host/rooms${buildListQuery({ ...params, propertyId })}`,
    );

    if (!response.ok) {
      return EMPTY_ROOM_LIST;
    }

    const data: unknown = await response.json();
    return parsePaginatedResponse(data, mapRoomListItem);
  }

  createRoom(propertyId: number, payload: RoomFormPayload): Promise<RoomMutationResult> {
    return getApiClient()
      .postFormData(`/host/rooms?propertyId=${propertyId}`, buildRoomFormData(payload))
      .then((response) => parseRoomMutationResponse(response, 'Création impossible.'));
  }

  updateRoom(
    propertyId: number,
    id: number,
    payload: RoomFormPayload,
  ): Promise<RoomMutationResult> {
    return getApiClient()
      .putFormData(`/host/rooms/${id}?propertyId=${propertyId}`, buildRoomFormData(payload))
      .then((response) => parseRoomMutationResponse(response, 'Modification impossible.'));
  }

  async deleteRoom(propertyId: number, id: number): Promise<DeleteRoomResult> {
    const response = await getApiClient().delete(`/host/rooms/${id}?propertyId=${propertyId}`);
    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, error: parseApiError(data, 'Suppression impossible.') };
    }

    return { success: true };
  }

  async listPropertyTypeOptions() {
    const response = await getApiClient().get('/host/property-types/options');
    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    return mapCategoryOptions(data);
  }

  async listRoomTypeOptions() {
    const response = await getApiClient().get('/host/room-types/options');
    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    return mapCategoryOptions(data);
  }
}
