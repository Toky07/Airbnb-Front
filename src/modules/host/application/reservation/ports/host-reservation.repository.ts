import type { ListQueryParams, PaginatedResponse } from '../../../../shared/pagination/types';
import type {
  HostBookingOrder,
  HostReservationStatsOverview,
} from '../../../core/types/host-booking.types';

export interface HostReservationRepository {
  listBookings(params?: ListQueryParams): Promise<PaginatedResponse<HostBookingOrder>>;
  getStatsOverview(): Promise<HostReservationStatsOverview>;
}
