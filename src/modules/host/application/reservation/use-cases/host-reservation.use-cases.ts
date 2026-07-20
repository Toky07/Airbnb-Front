import type { ListQueryParams } from '../../../../../shared/pagination/types';
import type { HostReservationRepository } from '../ports/host-reservation.repository';

export class ListHostBookingsUseCase {
  private readonly hostReservationRepository: HostReservationRepository;

  constructor(hostReservationRepository: HostReservationRepository) {
    this.hostReservationRepository = hostReservationRepository;
  }

  execute(params: ListQueryParams = {}) {
    return this.hostReservationRepository.listBookings(params);
  }
}

export class GetHostReservationStatsOverviewUseCase {
  private readonly hostReservationRepository: HostReservationRepository;

  constructor(hostReservationRepository: HostReservationRepository) {
    this.hostReservationRepository = hostReservationRepository;
  }

  execute() {
    return this.hostReservationRepository.getStatsOverview();
  }
}
