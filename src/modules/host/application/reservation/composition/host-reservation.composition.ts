import type { HostReservationRepository } from '../ports/host-reservation.repository';
import {
  GetHostReservationStatsOverviewUseCase,
  ListHostBookingsUseCase,
} from '../use-cases/host-reservation.use-cases';
import { HttpHostReservationRepository } from '../../../infrastructure/reservation/http-host-reservation.repository';

let hostReservationRepository: HostReservationRepository | null = null;
let listHostBookingsUseCase: ListHostBookingsUseCase | null = null;
let getHostReservationStatsOverviewUseCase: GetHostReservationStatsOverviewUseCase | null = null;

export function getHostReservationRepository(): HostReservationRepository {
  if (!hostReservationRepository) {
    hostReservationRepository = new HttpHostReservationRepository();
  }
  return hostReservationRepository;
}

export function getListHostBookingsUseCase(): ListHostBookingsUseCase {
  if (!listHostBookingsUseCase) {
    listHostBookingsUseCase = new ListHostBookingsUseCase(getHostReservationRepository());
  }
  return listHostBookingsUseCase;
}

export function getGetHostReservationStatsOverviewUseCase(): GetHostReservationStatsOverviewUseCase {
  if (!getHostReservationStatsOverviewUseCase) {
    getHostReservationStatsOverviewUseCase = new GetHostReservationStatsOverviewUseCase(
      getHostReservationRepository(),
    );
  }
  return getHostReservationStatsOverviewUseCase;
}
