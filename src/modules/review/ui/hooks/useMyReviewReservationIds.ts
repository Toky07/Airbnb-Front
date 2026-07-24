import { useCallback, useEffect, useMemo, useState } from 'react';
import { getListMyReviewsUseCase } from '../../application/composition/review.composition';

export function useMyReviewReservationIds() {
  const [reservationIds, setReservationIds] = useState<Set<number>>(new Set());
  const useCase = useMemo(() => getListMyReviewsUseCase(), []);

  useEffect(() => {
    let cancelled = false;

    void useCase.execute(1, 100).then((result) => {
      if (cancelled) {
        return;
      }
      setReservationIds(
        new Set(result.data.map((review) => review.reservationId)),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [useCase]);

  const markReviewed = useCallback((reservationId: number) => {
    setReservationIds((current) => new Set(current).add(reservationId));
  }, []);

  return { reservationIds, markReviewed };
}
