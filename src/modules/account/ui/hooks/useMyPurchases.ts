import { useEffect, useState } from 'react';
import { getReservationService } from '../../../reservation/core/services/reservation.service';
import type { Reservation } from '../../../reservation/core/types/reservation.types';

export function useMyPurchases() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getReservationService()
      .listMine()
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
  }, []);

  return { reservations, loading, error };
}
