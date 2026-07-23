import { useMemo, useState } from 'react';
import {
  getCancelMyReservationUseCase,
  getGetCancellationPreviewUseCase,
} from '../../../reservation/application/composition/reservation.composition';
import type { CancellationPreview } from '../../../reservation/application/ports/reservation.repository';

export function useCancelReservation() {
  const getPreviewUseCase = useMemo(() => getGetCancellationPreviewUseCase(), []);
  const cancelUseCase = useMemo(() => getCancelMyReservationUseCase(), []);
  const [preview, setPreview] = useState<CancellationPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreview = async (reservationId: number) => {
    setLoading(true);
    setError(null);
    const result = await getPreviewUseCase.execute(reservationId);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      setPreview(null);
      return null;
    }

    setPreview(result.preview);
    return result.preview;
  };

  const cancel = async (reservationId: number) => {
    setLoading(true);
    setError(null);
    const result = await cancelUseCase.execute(reservationId);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return result;
    }

    setPreview(null);
    return result;
  };

  const reset = () => {
    setPreview(null);
    setError(null);
  };

  return { preview, loading, error, loadPreview, cancel, reset };
}
