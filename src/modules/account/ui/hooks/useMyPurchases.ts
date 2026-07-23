import { useCallback, useEffect, useMemo, useState } from 'react';
import { getListMyReservationsUseCase } from '../../../reservation/application/composition/reservation.composition';
import type { Reservation } from '../../../reservation/core/types/reservation.types';

export function useMyPurchases() {
  const listMyReservationsUseCase = useMemo(() => getListMyReservationsUseCase(), []);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await listMyReservationsUseCase.execute();
    if (!result.success) {
      setError(result.error);
      setReservations([]);
    } else {
      setReservations(
        result.reservations.filter((reservation) => reservation.status !== 'pending'),
      );
    }
    setLoading(false);
  }, [listMyReservationsUseCase]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { reservations, loading, error, refresh };
}
