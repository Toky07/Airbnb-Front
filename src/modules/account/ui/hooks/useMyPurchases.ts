import { useCallback, useEffect, useMemo, useState } from 'react';
import { getListMyReservationsUseCase } from '../../../reservation/application/composition/reservation.composition';
import type { Reservation } from '../../../reservation/core/types/reservation.types';
import { useMyInvoices } from './useMyInvoices';

export function useMyPurchases() {
  const listMyReservationsUseCase = useMemo(() => getListMyReservationsUseCase(), []);
  const {
    invoiceByPaymentId,
    downloadingId,
    download,
    error: invoiceError,
  } = useMyInvoices();
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

  return {
    reservations,
    invoiceByPaymentId,
    downloadingId,
    downloadInvoice: download,
    loading,
    error: error ?? invoiceError,
    refresh,
  };
}
