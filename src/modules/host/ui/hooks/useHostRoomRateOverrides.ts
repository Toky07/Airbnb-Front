import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCreateHostRoomRateOverrideUseCase,
  getDeleteHostRoomRateOverrideUseCase,
  getListHostRoomRateOverridesUseCase,
} from '../../application/rate-override/composition/host-rate-override.composition';
import type { RoomRateOverride } from '../../core/types/rate-override.types';

export function useHostRoomRateOverrides(
  propertyId: number | null,
  roomId: number | null,
) {
  const listUseCase = useMemo(() => getListHostRoomRateOverridesUseCase(), []);
  const createUseCase = useMemo(() => getCreateHostRoomRateOverrideUseCase(), []);
  const deleteUseCase = useMemo(() => getDeleteHostRoomRateOverrideUseCase(), []);

  const [items, setItems] = useState<RoomRateOverride[]>([]);
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
      setError('Impossible de charger les tarifs spéciaux.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [listUseCase, propertyId, roomId]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (
      startDate: string,
      endDate: string,
      pricePerNight: number,
      label?: string,
    ) => {
      if (!propertyId || !roomId) {
        return false;
      }

      setSaving(true);
      setError(null);
      try {
        const result = await createUseCase.execute(propertyId, roomId, {
          startDate,
          endDate,
          pricePerNight,
          label,
        });
        if (!result.success) {
          setError(result.error);
          return false;
        }
        await load();
        return true;
      } catch {
        setError('Impossible d’enregistrer ce tarif.');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [createUseCase, load, propertyId, roomId],
  );

  const remove = useCallback(
    async (rateOverrideId: number) => {
      if (!propertyId || !roomId) {
        return false;
      }

      setSaving(true);
      setError(null);
      try {
        const result = await deleteUseCase.execute(propertyId, roomId, rateOverrideId);
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
