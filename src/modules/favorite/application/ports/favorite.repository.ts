import type {
  FavoriteCheckResult,
  FavoriteListResult,
  FavoriteMutationResult,
} from '../../core/types/favorite.types';

export interface FavoriteRepository {
  listMine(): Promise<FavoriteListResult>;
  add(roomId: number): Promise<FavoriteMutationResult>;
  remove(roomId: number): Promise<FavoriteMutationResult>;
  check(roomIds: number[]): Promise<FavoriteCheckResult>;
}
