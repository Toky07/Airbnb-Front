import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import { buildAuthRouteWithRedirect } from '../../../auth/core/services/resolve-post-login-redirect';
import {
  getAddFavoriteUseCase,
  getCheckFavoritesUseCase,
  getRemoveFavoriteUseCase,
} from '../../application/composition/favorite.composition';

export function useFavoriteToggle(roomId: number) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const addFavoriteUseCase = useMemo(() => getAddFavoriteUseCase(), []);
  const removeFavoriteUseCase = useMemo(() => getRemoveFavoriteUseCase(), []);
  const checkFavoritesUseCase = useMemo(() => getCheckFavoritesUseCase(), []);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      setIsFavorite(false);
      return;
    }

    let cancelled = false;
    setChecking(true);

    void checkFavoritesUseCase.execute([roomId]).then((result) => {
      if (cancelled) {
        return;
      }

      if (result.success) {
        setIsFavorite(Boolean(result.favorites[String(roomId)]));
      }
      setChecking(false);
    });

    return () => {
      cancelled = true;
    };
  }, [authLoading, checkFavoritesUseCase, isAuthenticated, roomId]);

  const toggle = useCallback(async () => {
    setError(null);

    if (!isAuthenticated) {
      navigate(buildAuthRouteWithRedirect('/login', location.pathname));
      return;
    }

    setLoading(true);
    const result = isFavorite
      ? await removeFavoriteUseCase.execute(roomId)
      : await addFavoriteUseCase.execute(roomId);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setIsFavorite((current) => !current);
  }, [
    addFavoriteUseCase,
    isAuthenticated,
    isFavorite,
    location.pathname,
    navigate,
    removeFavoriteUseCase,
    roomId,
  ]);

  return {
    isFavorite,
    loading: loading || checking,
    error,
    toggle,
    isAuthenticated,
  };
}
