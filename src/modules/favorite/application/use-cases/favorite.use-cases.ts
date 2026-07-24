import type { FavoriteRepository } from '../ports/favorite.repository';

export class ListMyFavoritesUseCase {
  private readonly favoriteRepository: FavoriteRepository;

  constructor(favoriteRepository: FavoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  execute() {
    return this.favoriteRepository.listMine();
  }
}

export class AddFavoriteUseCase {
  private readonly favoriteRepository: FavoriteRepository;

  constructor(favoriteRepository: FavoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  execute(roomId: number) {
    return this.favoriteRepository.add(roomId);
  }
}

export class RemoveFavoriteUseCase {
  private readonly favoriteRepository: FavoriteRepository;

  constructor(favoriteRepository: FavoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  execute(roomId: number) {
    return this.favoriteRepository.remove(roomId);
  }
}

export class CheckFavoritesUseCase {
  private readonly favoriteRepository: FavoriteRepository;

  constructor(favoriteRepository: FavoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  execute(roomIds: number[]) {
    return this.favoriteRepository.check(roomIds);
  }
}
