import { useEffect, useState } from 'react';
import { getRoomService } from '../../core/services/room.service';
import type { RoomListItem } from '../../core/types/room.types';

type UseRoomDetailResult = {
  room: RoomListItem | null;
  loading: boolean;
  error: string | null;
};

export function useRoomDetail(id: number | null): UseRoomDetailResult {
  const [room, setRoom] = useState<RoomListItem | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !Number.isFinite(id)) {
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
        const data = await getRoomService().getById(id as number);
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
  }, [id]);

  return { room, loading, error };
}
