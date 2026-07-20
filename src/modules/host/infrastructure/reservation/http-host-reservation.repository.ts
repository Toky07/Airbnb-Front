import { getApiClient } from '../../../../shared/http/api-client';
import { buildListQuery } from '../../../../shared/pagination/build-list-query';
import { parsePaginatedResponse } from '../../../../shared/pagination/parse-paginated-response';
import type { ListQueryParams, PaginatedResponse } from '../../../../shared/pagination/types';
import { mapBookingOrderListItem } from '../../core/mappers/map-booking-order';
import { mapReservationStatsOverview } from '../../core/mappers/map-reservation-stats';
import type {
  HostBookingOrder,
  HostReservationStatsOverview,
} from '../../core/types/host-booking.types';
import type { HostReservationRepository } from '../../application/reservation/ports/host-reservation.repository';

const EMPTY_BOOKINGS: PaginatedResponse<HostBookingOrder> = {
  data: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

const EMPTY_STATS_OVERVIEW: HostReservationStatsOverview = {
  stats: null,
  recentActivity: [],
};

export class HttpHostReservationRepository implements HostReservationRepository {
  async listBookings(params: ListQueryParams = {}) {
    const response = await getApiClient().get(
      `/reservations/bookings/host${buildListQuery(params)}`,
    );

    if (!response.ok) {
      return EMPTY_BOOKINGS;
    }

    const data: unknown = await response.json();
    return parsePaginatedResponse(data, mapBookingOrderListItem);
  }

  async getStatsOverview() {
    const response = await getApiClient().get('/reservations/stats');
    if (!response.ok) {
      return EMPTY_STATS_OVERVIEW;
    }

    const data: unknown = await response.json();
    return mapReservationStatsOverview(data);
  }
}
