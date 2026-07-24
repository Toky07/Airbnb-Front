import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import type { FavoriteRepository } from '../ports/favorite.repository';
import {
  AddFavoriteUseCase,
  CheckFavoritesUseCase,
  ListMyFavoritesUseCase,
  RemoveFavoriteUseCase,
} from '../use-cases/favorite.use-cases';
import { HttpFavoriteRepository } from '../../infrastructure/http-favorite.repository';

let favoriteRepository: FavoriteRepository | null = null;
let listMyFavoritesUseCase: ListMyFavoritesUseCase | null = null;
let addFavoriteUseCase: AddFavoriteUseCase | null = null;
let removeFavoriteUseCase: RemoveFavoriteUseCase | null = null;
let checkFavoritesUseCase: CheckFavoritesUseCase | null = null;

export function getFavoriteRepository(): FavoriteRepository {
  if (!favoriteRepository) {
    favoriteRepository = new HttpFavoriteRepository(getHttpClient());
  }
  return favoriteRepository;
}

export function getListMyFavoritesUseCase(): ListMyFavoritesUseCase {
  if (!listMyFavoritesUseCase) {
    listMyFavoritesUseCase = new ListMyFavoritesUseCase(getFavoriteRepository());
  }
  return listMyFavoritesUseCase;
}

export function getAddFavoriteUseCase(): AddFavoriteUseCase {
  if (!addFavoriteUseCase) {
    addFavoriteUseCase = new AddFavoriteUseCase(getFavoriteRepository());
  }
  return addFavoriteUseCase;
}

export function getRemoveFavoriteUseCase(): RemoveFavoriteUseCase {
  if (!removeFavoriteUseCase) {
    removeFavoriteUseCase = new RemoveFavoriteUseCase(getFavoriteRepository());
  }
  return removeFavoriteUseCase;
}

export function getCheckFavoritesUseCase(): CheckFavoritesUseCase {
  if (!checkFavoritesUseCase) {
    checkFavoritesUseCase = new CheckFavoritesUseCase(getFavoriteRepository());
  }
  return checkFavoritesUseCase;
}
