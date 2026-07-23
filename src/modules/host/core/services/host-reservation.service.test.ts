import { describe, expect, it, vi } from 'vitest';
import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { sampleBookingOrderListItemApi } from '../../../../test/fixtures/reservation-api.fixtures';
import { HostReservationService } from './host-reservation.service';

function createHttpClient(overrides: Partial<HttpClient> = {}): HttpClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    postFormData: vi.fn(),
    putFormData: vi.fn(),
    ...overrides,
  };
}

describe('HostReservationService', () => {
  it('mappe les commandes host paginées', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [sampleBookingOrderListItemApi],
            meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
          }),
          { status: 200 },
        ),
      ),
    });
    const service = new HostReservationService(httpClient);
    const result = await service.listBookings();

    expect(result.data[0]?.paymentId).toBe(9);
    expect(result.data[0]?.customerName).toBe('Jean Dupont');
    expect(httpClient.get).toHaveBeenCalledWith('/reservations/bookings/host?page=1&limit=10');
  });

  it('mappe stats et activité récente via GET /reservations/stats', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(
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
      ),
    });
    const service = new HostReservationService(httpClient);
    const result = await service.getStatsOverview();

    expect(result.stats?.occupancyRate).toBe(42);
    expect(result.recentActivity).toHaveLength(1);
  });
});
