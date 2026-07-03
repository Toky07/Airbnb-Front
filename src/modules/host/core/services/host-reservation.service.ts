import { getApiClient } from '../../../../shared/http/api-client';
import { buildListQuery } from '../../../../shared/pagination/build-list-query';
import type { ListQueryParams } from '../../../../shared/pagination/types';
import { mapBookingOrderListItem } from '../mappers/map-booking-order';
import { mapReservationStatsOverview } from '../mappers/map-reservation-stats';
import type {
  HostBookingOrder,
  HostReservationActivity,
  HostReservationStats,
  HostReservationStatsOverview,
} from '../types/host-booking.types';
import { parsePaginatedResponse } from '../../../../shared/pagination/parse-paginated-response';

export class HostReservationService {
  async listBookings(params: ListQueryParams = {}) {
    const response = await getApiClient().get(
      `/reservations/bookings/host${buildListQuery(params)}`,
    );

    if (!response.ok) {
      return {
        data: [] as HostBookingOrder[],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }

    const data: unknown = await response.json();
    return parsePaginatedResponse(data, mapBookingOrderListItem);
  }

  async getStatsOverview(): Promise<HostReservationStatsOverview> {
    const response = await getApiClient().get('/reservations/stats');
    if (!response.ok) {
      return { stats: null, recentActivity: [] };
    }

    const data: unknown = await response.json();
    return mapReservationStatsOverview(data);
  }

  async getStats(): Promise<HostReservationStats | null> {
    const overview = await this.getStatsOverview();
    return overview.stats;
  }

  async getRecentActivity(): Promise<HostReservationActivity[]> {
    const overview = await this.getStatsOverview();
    return overview.recentActivity;
  }
}

let reservationService: HostReservationService | null = null;

export function getHostReservationService(): HostReservationService {
  if (!reservationService) {
    reservationService = new HostReservationService();
  }
  return reservationService;
}
