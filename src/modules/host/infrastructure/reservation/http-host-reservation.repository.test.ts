import { describe, expect, it, vi } from 'vitest';
import { sampleBookingOrderListItemApi } from '../../../../test/fixtures/reservation-api.fixtures';
import { HttpHostReservationRepository } from './http-host-reservation.repository';

describe('HttpHostReservationRepository', () => {
  it('mappe les commandes host paginées', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [sampleBookingOrderListItemApi],
          meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
        }),
        { status: 200 },
      ),
    );

    const repository = new HttpHostReservationRepository();
    const result = await repository.listBookings();

    expect(result.data[0]?.paymentId).toBe(9);
    expect(result.data[0]?.customerName).toBe('Jean Dupont');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/reservations/bookings/host'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('mappe stats et activité récente via GET /reservations/stats', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          activeCount: 2,
          pendingCount: 1,
          monthlyRevenue: 500,
          totalCount: 5,
          occupancyRate: 42,
          recentActivity: [
            {
              id: 3,
              label: 'Chambre double',
              totalPrice: 180,
              createdAt: '2026-08-02T08:00:00.000Z',
            },
          ],
        }),
        { status: 200 },
      ),
    );

    const repository = new HttpHostReservationRepository();
    const result = await repository.getStatsOverview();

    expect(result.stats?.occupancyRate).toBe(42);
    expect(result.recentActivity).toHaveLength(1);
  });
});
