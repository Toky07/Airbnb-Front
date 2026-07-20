import type { HttpClient } from '../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { buildListQuery } from '../../../shared/pagination/build-list-query';
import { parsePaginatedResponse } from '../../../shared/pagination/parse-paginated-response';
import type { ListQueryParams, PaginatedResponse } from '../../../shared/pagination/types';
import { mapRoomListItem } from '../core/mappers/map-room-list-item';
import type { RoomListItem } from '../core/types/room.types';
import type { RoomRepository } from '../application/ports/room.repository';

const EMPTY_LIST_RESULT: PaginatedResponse<RoomListItem> = {
  data: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

export class HttpRoomRepository implements RoomRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async list(params: ListQueryParams = {}): Promise<PaginatedResponse<RoomListItem>> {
    const response = await this.httpClient.get(`/rooms${buildListQuery(params)}`);

    if (!response.ok) {
      return EMPTY_LIST_RESULT;
    }

    const data: unknown = await response.json();
    return parsePaginatedResponse(data, mapRoomListItem);
  }

  async getById(id: number): Promise<RoomListItem | null> {
    const response = await this.httpClient.get(`/rooms/${id}`);

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return mapRoomListItem(data);
  }

  async getBySlug(slug: string): Promise<RoomListItem | null> {
    const response = await this.httpClient.get(`/rooms/by-slug/${slug}`);

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return mapRoomListItem(data);
  }
}
