type FavoriteApiItem = {
  id: number;
  roomId: number;
  createdAt: string;
  room: Record<string, unknown>;
};

let favorites: FavoriteApiItem[] = [];

export function getFavoriteState(): FavoriteApiItem[] {
  return favorites;
}

export function setFavoriteState(next: FavoriteApiItem[]): void {
  favorites = next;
}

export function resetFavoriteState(): void {
  favorites = [];
}
