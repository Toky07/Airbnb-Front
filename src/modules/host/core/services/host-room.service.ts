import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { buildListQuery } from '../../../../shared/pagination/build-list-query';
import { parsePaginatedResponse } from '../../../../shared/pagination/parse-paginated-response';
import type { ListQueryParams, PaginatedResponse } from '../../../../shared/pagination/types';
import { mapRoomListItem } from '../../../rooms/core/mappers/map-room-list-item';
import type { CategorySummary, RoomListItem } from '../../../rooms/core/types/room.types';
import { mapCategoryOption } from '../mappers/map-host-property';
import type { RoomFormPayload } from '../types/host.types';
import type { DeleteRoomResult, RoomMutationResult } from '../types/host-room-mutation.types';
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

export class HostRoomService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient = getHttpClient()) {
    this.httpClient = httpClient;
  }

  async listRooms(propertyId: number, params: ListQueryParams = {}) {
    const response = await this.httpClient.get(
      `/host/rooms${buildListQuery({ ...params, propertyId })}`,
    );

    if (!response.ok) {
      return EMPTY_ROOM_LIST;
    }

    const data: unknown = await response.json();
    return parsePaginatedResponse(data, mapRoomListItem);
  }

  createRoom(propertyId: number, payload: RoomFormPayload): Promise<RoomMutationResult> {
    return this.httpClient
      .postFormData(`/host/rooms?propertyId=${propertyId}`, buildRoomFormData(payload))
      .then((response) => parseRoomMutationResponse(response, 'Création impossible.'));
  }

  updateRoom(
    propertyId: number,
    id: number,
    payload: RoomFormPayload,
  ): Promise<RoomMutationResult> {
    return this.httpClient
      .putFormData(`/host/rooms/${id}?propertyId=${propertyId}`, buildRoomFormData(payload))
      .then((response) => parseRoomMutationResponse(response, 'Modification impossible.'));
  }

  async deleteRoom(propertyId: number, id: number): Promise<DeleteRoomResult> {
    const response = await this.httpClient.delete(`/host/rooms/${id}?propertyId=${propertyId}`);
    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, error: parseApiError(data, 'Suppression impossible.') };
    }

    return { success: true };
  }

  async listPropertyTypeOptions() {
    const response = await this.httpClient.get('/host/property-types/options');
    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    return mapCategoryOptions(data);
  }

  async listRoomTypeOptions() {
    const response = await this.httpClient.get('/host/room-types/options');
    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    return mapCategoryOptions(data);
  }
}
