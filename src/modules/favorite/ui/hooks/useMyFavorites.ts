import { useCallback, useEffect, useMemo, useState } from 'react';
import { getListMyFavoritesUseCase } from '../../application/composition/favorite.composition';
import type { FavoriteItem } from '../../core/types/favorite.types';

export function useMyFavorites() {
  const listMyFavoritesUseCase = useMemo(() => getListMyFavoritesUseCase(), []);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await listMyFavoritesUseCase.execute();

    if (!result.success) {
      setError(result.error);
      setFavorites([]);
    } else {
      setFavorites(result.favorites);
    }

    setLoading(false);
  }, [listMyFavoritesUseCase]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    favorites,
    loading,
    error,
    refresh,
  };
}
