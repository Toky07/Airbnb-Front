import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getDownloadInvoiceUseCase,
  getListMyInvoicesUseCase,
} from '../../application/composition/account.composition';
import type { Invoice } from '../../core/types/invoice.types';

export function useMyInvoices() {
  const listMyInvoicesUseCase = useMemo(() => getListMyInvoicesUseCase(), []);
  const downloadInvoiceUseCase = useMemo(() => getDownloadInvoiceUseCase(), []);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await listMyInvoicesUseCase.execute();
    if (!result.success) {
      setError(result.error);
      setInvoices([]);
    } else {
      setInvoices(result.invoices);
    }
    setLoading(false);
  }, [listMyInvoicesUseCase]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const download = useCallback(
    async (invoiceId: number) => {
      setDownloadingId(invoiceId);
      setError(null);
      const result = await downloadInvoiceUseCase.execute(invoiceId);
      setDownloadingId(null);

      if (!result.success) {
        setError(result.error);
      }

      return result.success;
    },
    [downloadInvoiceUseCase],
  );

  const invoiceByPaymentId = useMemo(() => {
    const map = new Map<number, Invoice>();
    for (const invoice of invoices) {
      map.set(invoice.paymentId, invoice);
    }
    return map;
  }, [invoices]);

  return {
    invoices,
    invoiceByPaymentId,
    loading,
    downloadingId,
    error,
    refresh,
    download,
  };
}
