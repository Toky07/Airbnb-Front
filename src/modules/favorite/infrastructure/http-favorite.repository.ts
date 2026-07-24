import type { HttpClient } from '../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../shared/http/parse-api-error';
import {
  mapFavoriteCheckMap,
  mapFavoriteItem,
  mapFavoriteItems,
} from '../core/mappers/map-favorite';
import type {
  FavoriteCheckResult,
  FavoriteListResult,
  FavoriteMutationResult,
  FavoriteRepository,
} from '../application/ports/favorite.repository';

export class HttpFavoriteRepository implements FavoriteRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async listMine(): Promise<FavoriteListResult> {
    const response = await this.httpClient.get('/favorites/me');
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de charger vos favoris.'),
      };
    }

    return { success: true, favorites: mapFavoriteItems(data) };
  }

  async add(roomId: number): Promise<FavoriteMutationResult> {
    const response = await this.httpClient.post('/favorites', { roomId });
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible d’ajouter aux favoris.'),
      };
    }

    const favorite = mapFavoriteItem(data);
    if (!favorite) {
      return { success: false, error: 'Réponse de favori invalide.' };
    }

    return { success: true, favorite };
  }

  async remove(roomId: number): Promise<FavoriteMutationResult> {
    const response = await this.httpClient.delete(`/favorites/${roomId}`);

    if (!response.ok) {
      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      return {
        success: false,
        error: parseApiError(data, 'Impossible de retirer des favoris.'),
      };
    }

    return { success: true };
  }

  async check(roomIds: number[]): Promise<FavoriteCheckResult> {
    if (roomIds.length === 0) {
      return { success: true, favorites: {} };
    }

    const response = await this.httpClient.get(
      `/favorites/check?roomIds=${roomIds.join(',')}`,
    );
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de vérifier les favoris.'),
      };
    }

    return { success: true, favorites: mapFavoriteCheckMap(data) };
  }
}
