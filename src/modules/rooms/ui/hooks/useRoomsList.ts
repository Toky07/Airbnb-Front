import { useEffect, useMemo, useState } from 'react';
import { getListRoomsUseCase } from '../../application/composition/room.composition';
import type { RoomListItem } from '../../core/types/room.types';
import type { ListQueryParams, PaginatedResponse } from '../../../../shared/pagination/types';

type UseRoomsListResult = {
  result: PaginatedResponse<RoomListItem>;
  loading: boolean;
  error: string | null;
};

const emptyResult: PaginatedResponse<RoomListItem> = {
  data: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

export function useRoomsList(params: ListQueryParams): UseRoomsListResult {
  const listRoomsUseCase = useMemo(() => getListRoomsUseCase(), []);
  const [result, setResult] = useState<PaginatedResponse<RoomListItem>>(emptyResult);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await listRoomsUseCase.execute(params);
        if (!cancelled) {
          setResult(response);
        }
      } catch {
        if (!cancelled) {
          setError('Impossible de charger les logements.');
          setResult(emptyResult);
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
    // Primitive deps avoid refetch loops when callers pass inline `{ page, limit }` objects.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- params fields tracked individually
  }, [listRoomsUseCase, params.page, params.limit, params.search, params.propertyId, params.checkIn, params.checkOut]);

  return { result, loading, error };
}
