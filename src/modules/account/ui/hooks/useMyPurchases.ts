import { useEffect, useMemo, useState } from 'react';
import { getListMyReservationsUseCase } from '../../../reservation/application/composition/reservation.composition';
import type { Reservation } from '../../../reservation/core/types/reservation.types';

export function useMyPurchases() {
  const listMyReservationsUseCase = useMemo(() => getListMyReservationsUseCase(), []);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void listMyReservationsUseCase
      .execute()
      .then((result) => {
        if (!result.success) {
          setError(result.error);
          return;
        }

        setReservations(
          result.reservations.filter((reservation) => reservation.status !== 'pending'),
        );
      })
      .finally(() => setLoading(false));
  }, [listMyReservationsUseCase]);

  return { reservations, loading, error };
}
