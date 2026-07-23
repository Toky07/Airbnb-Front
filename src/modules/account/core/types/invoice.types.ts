export type Invoice = {
  id: number;
  invoiceNumber: string;
  paymentType: string;
  paymentId: number;
  createdAt: string;
};

export function mapInvoice(data: unknown): Invoice | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (
    typeof record.id !== 'number' ||
    typeof record.invoiceNumber !== 'string' ||
    typeof record.paymentId !== 'number'
  ) {
    return null;
  }

  return {
    id: record.id,
    invoiceNumber: record.invoiceNumber,
    paymentType: String(record.paymentType ?? 'reservation'),
    paymentId: record.paymentId,
    createdAt: String(record.createdAt ?? ''),
  };
}

export function mapInvoices(data: unknown): Invoice[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((entry) => mapInvoice(entry))
    .filter((invoice): invoice is Invoice => invoice !== null);
}
