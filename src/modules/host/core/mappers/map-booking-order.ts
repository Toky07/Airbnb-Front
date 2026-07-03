import type { HostBookingOrder } from '../types/host-booking.types';

export function mapBookingOrderListItem(data: unknown): HostBookingOrder | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (typeof record.paymentId !== 'number') {
    return null;
  }

  return {
    paymentId: record.paymentId,
    paidAt: String(record.paidAt ?? ''),
    amount: Number(record.amount ?? 0),
    currency: String(record.currency ?? 'eur'),
    paymentStatus: String(record.paymentStatus ?? 'pending'),
    customerName: String(record.customerName ?? 'Client'),
    customerEmail: String(record.customerEmail ?? ''),
    itemCount: Number(record.itemCount ?? 0),
    previewLabel: String(record.previewLabel ?? ''),
    transactionId: String(record.transactionId ?? ''),
    startDate: typeof record.startDate === 'string' ? record.startDate : null,
    endDate: typeof record.endDate === 'string' ? record.endDate : null,
    propertyId: typeof record.propertyId === 'number' ? record.propertyId : null,
    propertyName: typeof record.propertyName === 'string' ? record.propertyName : null,
  };
}
