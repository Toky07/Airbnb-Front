import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCreateHostRoomBlockedDateUseCase,
  getDeleteHostRoomBlockedDateUseCase,
  getListHostRoomBlockedDatesUseCase,
} from '../../application/blocked-date/composition/host-blocked-date.composition';
import type { RoomBlockedDate } from '../../core/types/blocked-date.types';

export function useHostRoomBlockedDates(
  propertyId: number | null,
  roomId: number | null,
) {
  const listUseCase = useMemo(() => getListHostRoomBlockedDatesUseCase(), []);
  const createUseCase = useMemo(() => getCreateHostRoomBlockedDateUseCase(), []);
  const deleteUseCase = useMemo(() => getDeleteHostRoomBlockedDateUseCase(), []);

  const [items, setItems] = useState<RoomBlockedDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!propertyId || !roomId) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await listUseCase.execute(propertyId, roomId);
      setItems(result);
    } catch {
      setError('Impossible de charger les périodes bloquées.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [listUseCase, propertyId, roomId]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (startDate: string, endDate: string, reason?: string) => {
      if (!propertyId || !roomId) {
        return false;
      }

      setSaving(true);
      setError(null);
      try {
        const result = await createUseCase.execute(propertyId, roomId, {
          startDate,
          endDate,
          reason,
        });
        if (!result.success) {
          setError(result.error);
          return false;
        }
        await load();
        return true;
      } catch {
        setError('Impossible de bloquer ces dates.');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [createUseCase, load, propertyId, roomId],
  );

  const remove = useCallback(
    async (blockedDateId: number) => {
      if (!propertyId || !roomId) {
        return false;
      }

      setSaving(true);
      setError(null);
      try {
        const result = await deleteUseCase.execute(propertyId, roomId, blockedDateId);
        if (!result.success) {
          setError(result.error ?? 'Suppression impossible.');
          return false;
        }
        await load();
        return true;
      } catch {
        setError('Suppression impossible.');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [deleteUseCase, load, propertyId, roomId],
  );

  return { items, loading, saving, error, create, remove, setError };
}
