import { getApiClient } from '../../../shared/http/api-client';
import { buildListQuery } from '../../../shared/pagination/build-list-query';
import { parsePaginatedResponse } from '../../../shared/pagination/parse-paginated-response';
import type { ListQueryParams, PaginatedResponse } from '../../../shared/pagination/types';
import { mapRoomListItem, type RoomListItem } from '../core/types/room.types';
import type { RoomRepository } from '../application/ports/room.repository';

const EMPTY_LIST_RESULT: PaginatedResponse<RoomListItem> = {
  data: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

export class HttpRoomRepository implements RoomRepository {
  async list(params: ListQueryParams = {}): Promise<PaginatedResponse<RoomListItem>> {
    const response = await getApiClient().get(`/rooms${buildListQuery(params)}`);

    if (!response.ok) {
      return EMPTY_LIST_RESULT;
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

  async getBySlug(slug: string): Promise<RoomListItem | null> {
    const response = await getApiClient().get(`/rooms/by-slug/${slug}`);

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return mapRoomListItem(data);
  }
}
