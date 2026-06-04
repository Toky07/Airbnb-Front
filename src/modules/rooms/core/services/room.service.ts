import { getApiClient } from '../../../../shared/http/api-client';
import { buildListQuery } from '../../../../shared/pagination/build-list-query';
import { parsePaginatedResponse } from '../../../../shared/pagination/parse-paginated-response';
import type { ListQueryParams, PaginatedResponse } from '../../../../shared/pagination/types';
import { mapRoomListItem, type RoomListItem } from '../types/room.types';

export class RoomService {
  async list(params: ListQueryParams = {}): Promise<PaginatedResponse<RoomListItem>> {
    const response = await getApiClient().get(`/rooms${buildListQuery(params)}`);

    if (!response.ok) {
      return {
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }

    const data: unknown = await response.json();
    return parsePaginatedResponse(data, mapRoomListItem);
  }

  async getById(id: number): Promise<RoomListItem | null> {
    const response = await getApiClient().get(`/rooms/${id}`);

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return mapRoomListItem(data);
  }
}

let service: RoomService | null = null;

export function getRoomService(): RoomService {
  if (!service) {
    service = new RoomService();
  }
  return service;
}
