import { mapRoomListItem } from '../../../rooms/core/mappers/map-room-list-item';
import type { FavoriteItem } from '../types/favorite.types';

export function mapFavoriteItem(data: unknown): FavoriteItem | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (
    typeof record.id !== 'number' ||
    typeof record.roomId !== 'number' ||
    typeof record.createdAt !== 'string'
  ) {
    return null;
  }

  const room = mapRoomListItem(record.room);
  if (!room) {
    return null;
  }

  return {
    id: record.id,
    roomId: record.roomId,
    createdAt: record.createdAt,
    room,
  };
}

export function mapFavoriteItems(data: unknown): FavoriteItem[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(mapFavoriteItem)
    .filter((item): item is FavoriteItem => item !== null);
}

export function mapFavoriteCheckMap(data: unknown): Record<string, boolean> {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const record = data as Record<string, unknown>;
  const favorites = record.favorites;
  if (!favorites || typeof favorites !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(favorites as Record<string, unknown>).map(([key, value]) => [
      key,
      Boolean(value),
    ]),
  );
}
