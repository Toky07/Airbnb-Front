import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../../shared/http/composition/http.composition';
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
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async listBookings(params: ListQueryParams = {}) {
    const response = await this.httpClient.get(
      `/reservations/bookings/host${buildListQuery(params)}`,
    );

    if (!response.ok) {
      return EMPTY_BOOKINGS;
    }

    const data: unknown = await response.json();
    return parsePaginatedResponse(data, mapBookingOrderListItem);
  }

  async getStatsOverview() {
    const response = await this.httpClient.get('/reservations/stats');
    if (!response.ok) {
      return EMPTY_STATS_OVERVIEW;
    }

    const data: unknown = await response.json();
    return mapReservationStatsOverview(data);
  }

  async cancelReservation(reservationId: number) {
    const response = await this.httpClient.post(
      `/host/reservations/${reservationId}/cancel`,
      {},
    );

    if (!response.ok) {
      const data: unknown = await response.json().catch(() => null);
      const message =
        data && typeof data === 'object' && 'message' in data
          ? String((data as { message: unknown }).message)
          : 'Impossible d’annuler la réservation.';
      return { success: false as const, error: message };
    }

    return { success: true as const };
  }

  async markNoShow(reservationId: number) {
    const response = await this.httpClient.post(
      `/host/reservations/${reservationId}/no-show`,
      {},
    );

    if (!response.ok) {
      const data: unknown = await response.json().catch(() => null);
      const message =
        data && typeof data === 'object' && 'message' in data
          ? String((data as { message: unknown }).message)
          : 'Impossible de marquer le no-show.';
      return { success: false as const, error: message };
    }

    return { success: true as const };
  }
}
