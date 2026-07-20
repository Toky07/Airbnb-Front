import type { ListQueryParams, PaginatedResponse } from '../../../../shared/pagination/types';
import type { CategorySummary, RoomListItem } from '../../../rooms/core/types/room.types';
import type { RoomFormPayload } from '../../../core/types/host.types';

export type RoomMutationResult =
  | { success: true; room: RoomListItem }
  | { success: false; error: string };

export type DeleteRoomResult =
  | { success: true }
  | { success: false; error: string };

export interface HostRoomRepository {
  listRooms(
    propertyId: number,
    params?: ListQueryParams,
  ): Promise<PaginatedResponse<RoomListItem>>;
  createRoom(propertyId: number, payload: RoomFormPayload): Promise<RoomMutationResult>;
  updateRoom(
    propertyId: number,
    id: number,
    payload: RoomFormPayload,
  ): Promise<RoomMutationResult>;
  deleteRoom(propertyId: number, id: number): Promise<DeleteRoomResult>;
  listPropertyTypeOptions(): Promise<CategorySummary[]>;
  listRoomTypeOptions(): Promise<CategorySummary[]>;
}
