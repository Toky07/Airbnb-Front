import { getHttpClient } from '../../../../../shared/http/composition/http.composition';
import type { HostReservationRepository } from '../ports/host-reservation.repository';
import {
  GetHostReservationStatsOverviewUseCase,
  ListHostBookingsUseCase,
} from '../use-cases/host-reservation.use-cases';
import {
  CancelHostReservationUseCase,
  MarkHostReservationNoShowUseCase,
} from '../use-cases/host-reservation-actions.use-cases';
import { HttpHostReservationRepository } from '../../../infrastructure/reservation/http-host-reservation.repository';

let hostReservationRepository: HostReservationRepository | null = null;
let listHostBookingsUseCase: ListHostBookingsUseCase | null = null;
let getHostReservationStatsOverviewUseCase: GetHostReservationStatsOverviewUseCase | null = null;
let cancelHostReservationUseCase: CancelHostReservationUseCase | null = null;
let markHostReservationNoShowUseCase: MarkHostReservationNoShowUseCase | null = null;

export function getHostReservationRepository(): HostReservationRepository {
  if (!hostReservationRepository) {
    hostReservationRepository = new HttpHostReservationRepository(getHttpClient());
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

export function getCancelHostReservationUseCase(): CancelHostReservationUseCase {
  if (!cancelHostReservationUseCase) {
    cancelHostReservationUseCase = new CancelHostReservationUseCase(getHostReservationRepository());
  }
  return cancelHostReservationUseCase;
}

export function getMarkHostReservationNoShowUseCase(): MarkHostReservationNoShowUseCase {
  if (!markHostReservationNoShowUseCase) {
    markHostReservationNoShowUseCase = new MarkHostReservationNoShowUseCase(
      getHostReservationRepository(),
    );
  }
  return markHostReservationNoShowUseCase;
}
