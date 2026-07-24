import type { RoomListItem } from '../../../rooms/core/types/room.types';

export type FavoriteItem = {
  id: number;
  roomId: number;
  createdAt: string;
  room: RoomListItem;
};

export type FavoriteCheckMap = Record<string, boolean>;

export type FavoriteListResult =
  | { success: true; favorites: FavoriteItem[] }
  | { success: false; error: string };

export type FavoriteMutationResult =
  | { success: true; favorite?: FavoriteItem }
  | { success: false; error: string };

export type FavoriteCheckResult =
  | { success: true; favorites: FavoriteCheckMap }
  | { success: false; error: string };
