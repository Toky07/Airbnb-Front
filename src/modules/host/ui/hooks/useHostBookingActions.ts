import { useCallback, useState } from 'react';
import {
  getCancelHostReservationUseCase,
  getMarkHostReservationNoShowUseCase,
  getRestoreHostReservationFromNoShowUseCase,
} from '../../application/reservation/composition/host-reservation.composition';

export function useHostBookingActions(onSuccess?: () => void) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cancelReservation = useCallback(
    async (reservationId: number) => {
      setPendingId(reservationId);
      setError(null);
      const result = await getCancelHostReservationUseCase().execute(reservationId);
      setPendingId(null);
      if (!result.success) {
        setError(result.error ?? 'Erreur lors de l’annulation.');
        return false;
      }
      onSuccess?.();
      return true;
    },
    [onSuccess],
  );

  const markNoShow = useCallback(
    async (reservationId: number) => {
      setPendingId(reservationId);
      setError(null);
      const result = await getMarkHostReservationNoShowUseCase().execute(reservationId);
      setPendingId(null);
      if (!result.success) {
        setError(result.error ?? 'Erreur lors du marquage no-show.');
        return false;
      }
      onSuccess?.();
      return true;
    },
    [onSuccess],
  );

  const restoreFromNoShow = useCallback(
    async (reservationId: number) => {
      setPendingId(reservationId);
      setError(null);
      const result = await getRestoreHostReservationFromNoShowUseCase().execute(reservationId);
      setPendingId(null);
      if (!result.success) {
        setError(result.error ?? 'Erreur lors du rétablissement.');
        return false;
      }
      onSuccess?.();
      return true;
    },
    [onSuccess],
  );

  return {
    cancelReservation,
    markNoShow,
    restoreFromNoShow,
    pendingId,
    error,
    clearError: () => setError(null),
  };
}

export function canHostCancelBooking(
  reservationStatus: string | null,
  checkIn: string | null,
): boolean {
  if (reservationStatus !== 'confirmed' || !checkIn) {
    return false;
  }
  const today = new Date().toISOString().slice(0, 10);
  return checkIn > today;
}

export function canHostMarkNoShow(
  reservationStatus: string | null,
  checkIn: string | null,
): boolean {
  if (reservationStatus !== 'confirmed' || !checkIn) {
    return false;
  }
  const today = new Date().toISOString().slice(0, 10);
  return checkIn <= today;
}

export function canHostRestoreFromNoShow(reservationStatus: string | null): boolean {
  return reservationStatus === 'no_show';
}
