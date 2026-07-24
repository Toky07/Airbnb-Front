import type { FavoriteRepository } from '../ports/favorite.repository';

export class ListMyFavoritesUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  execute() {
    return this.favoriteRepository.listMine();
  }
}

export class AddFavoriteUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  execute(roomId: number) {
    return this.favoriteRepository.add(roomId);
  }
}

export class RemoveFavoriteUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  execute(roomId: number) {
    return this.favoriteRepository.remove(roomId);
  }
}

export class CheckFavoritesUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  execute(roomIds: number[]) {
    return this.favoriteRepository.check(roomIds);
  }
}
