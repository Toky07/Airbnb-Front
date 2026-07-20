import type { ListQueryParams } from '../../../../shared/pagination/types';
import type { HostReservationRepository } from '../ports/host-reservation.repository';

export class ListHostBookingsUseCase {
  constructor(private readonly hostReservationRepository: HostReservationRepository) {}

  execute(params: ListQueryParams = {}) {
    return this.hostReservationRepository.listBookings(params);
  }
}

export class GetHostReservationStatsOverviewUseCase {
  constructor(private readonly hostReservationRepository: HostReservationRepository) {}

  execute() {
    return this.hostReservationRepository.getStatsOverview();
  }
}
