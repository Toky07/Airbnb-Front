import { useEffect, useMemo, useState } from 'react';
import { getGetRoomBySlugUseCase } from '../../application/composition/room.composition';
import type { RoomListItem } from '../../core/types/room.types';

type UseRoomDetailResult = {
  room: RoomListItem | null;
  loading: boolean;
  error: string | null;
};

export function useRoomDetail(slug: string | null): UseRoomDetailResult {
  const getRoomBySlugUseCase = useMemo(() => getGetRoomBySlugUseCase(), []);
  const [room, setRoom] = useState<RoomListItem | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setRoom(null);
      setLoading(false);
      setError('Identifiant invalide.');
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getRoomBySlugUseCase.execute(slug as string);
        if (!cancelled) {
          setRoom(data);
          if (!data) {
            setError('Logement introuvable.');
          }
        }
      } catch {
        if (!cancelled) {
          setRoom(null);
          setError('Impossible de charger ce logement.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [getRoomBySlugUseCase, slug]);

  return { room, loading, error };
}
