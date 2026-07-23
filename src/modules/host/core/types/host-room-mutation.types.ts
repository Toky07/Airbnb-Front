import type { RoomListItem } from '../../../rooms/core/types/room.types';

export type RoomMutationResult =
  | { success: true; room: RoomListItem }
  | { success: false; error: string };

export type DeleteRoomResult =
  | { success: true }
  | { success: false; error: string };
