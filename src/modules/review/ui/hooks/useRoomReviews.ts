import { useEffect, useMemo, useState } from 'react';
import {
  getGetRoomRatingSummaryUseCase,
  getListRoomReviewsUseCase,
} from '../../application/composition/review.composition';
import type { Review, RoomRatingSummary } from '../../core/types/review.types';

export function useRoomReviews(slug: string | null) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<RoomRatingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listUseCase = useMemo(() => getListRoomReviewsUseCase(), []);
  const summaryUseCase = useMemo(() => getGetRoomRatingSummaryUseCase(), []);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void Promise.all([
      listUseCase.execute(slug),
      summaryUseCase.execute(slug),
    ])
      .then(([reviewResult, summaryResult]) => {
        if (cancelled) {
          return;
        }
        setReviews(reviewResult.data);
        setSummary(summaryResult);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Impossible de charger les avis.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug, listUseCase, summaryUseCase]);

  return { reviews, summary, loading, error };
}
