import type { ListQueryParams, PaginatedResponse } from '../../../../shared/pagination/types';
import type { RoomListItem } from '../../core/types/room.types';

export interface RoomRepository {
  list(params?: ListQueryParams): Promise<PaginatedResponse<RoomListItem>>;
  getById(id: number): Promise<RoomListItem | null>;
  getBySlug(slug: string): Promise<RoomListItem | null>;
}
