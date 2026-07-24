import { useCallback, useMemo } from 'react';
import { getCreateReviewUseCase } from '../../application/composition/review.composition';
import type { CreateReviewPayload } from '../../core/types/review.types';

export function useCreateReview() {
  const useCase = useMemo(() => getCreateReviewUseCase(), []);

  const createReview = useCallback(
    (payload: CreateReviewPayload) => useCase.execute(payload),
    [useCase],
  );

  return { createReview };
}
