import { afterEach, describe, expect, it, vi } from 'vitest';
import { sampleBookingOrderListItemApi } from '../../../../test/fixtures/reservation-api.fixtures';
import { getHostReservationService } from './host-reservation.service';

describe('HostReservationService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

    const result = await getHostReservationService().listBookings();

    expect(result.data[0]?.paymentId).toBe(9);
    expect(result.data[0]?.customerName).toBe('Jean Dupont');
  });

  it('mappe stats et activité récente en un seul appel', async () => {
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

    const result = await getHostReservationService().getStatsOverview();

    expect(result.stats?.occupancyRate).toBe(42);
    expect(result.recentActivity).toHaveLength(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
