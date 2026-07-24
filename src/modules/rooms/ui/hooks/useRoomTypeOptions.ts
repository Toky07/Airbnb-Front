import { useEffect, useState } from 'react';
import { getHttpClient } from '../../../../shared/http/composition/http.composition';

export type RoomTypeOption = {
  id: number;
  name: string;
  slug: string;
};

export function useRoomTypeOptions() {
  const [roomTypes, setRoomTypes] = useState<RoomTypeOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await getHttpClient().get('/room-types/options');
        if (!response.ok || cancelled) {
          return;
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data) || cancelled) {
          return;
        }

        setRoomTypes(
          data
            .map((entry) => {
              if (!entry || typeof entry !== 'object') {
                return null;
              }

              const record = entry as Record<string, unknown>;
              const id = Number(record.id);
              const name = typeof record.name === 'string' ? record.name : '';
              const slug = typeof record.slug === 'string' ? record.slug : '';

              if (!Number.isFinite(id) || !name) {
                return null;
              }

              return { id, name, slug };
            })
            .filter((entry): entry is RoomTypeOption => entry !== null),
        );
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
  }, []);

  return { roomTypes, loading };
}
