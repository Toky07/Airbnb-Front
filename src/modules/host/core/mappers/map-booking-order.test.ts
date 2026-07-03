import { describe, expect, it } from 'vitest';
import { sampleBookingOrderListItemApi } from '../../../../test/fixtures/reservation-api.fixtures';
import { mapBookingOrderListItem } from './map-booking-order';

describe('mapBookingOrderListItem', () => {
  it('mappe une commande host depuis l’API', () => {
    expect(mapBookingOrderListItem(sampleBookingOrderListItemApi)).toEqual({
      paymentId: 9,
      paidAt: '2026-06-02T10:00:00.000Z',
      amount: 200,
      currency: 'eur',
      paymentStatus: 'succeeded',
      itemCount: 1,
      customerName: 'Jean Dupont',
      customerEmail: 'jean@example.com',
      previewLabel: 'Suite Deluxe · Hotel Test',
      transactionId: 'pi_test_123456',
      startDate: '2026-08-01',
      endDate: '2026-08-03',
      propertyId: 1,
      propertyName: 'Hotel Test',
    });
  });

  it('retourne null si paymentId est absent', () => {
    expect(mapBookingOrderListItem({ amount: 10 })).toBeNull();
  });
});
