import type { HostReservationRepository } from '../ports/host-reservation.repository';

export class CancelHostReservationUseCase {
  private readonly hostReservationRepository: HostReservationRepository;

  constructor(hostReservationRepository: HostReservationRepository) {
    this.hostReservationRepository = hostReservationRepository;
  }

  execute(reservationId: number) {
    return this.hostReservationRepository.cancelReservation(reservationId);
  }
}

export class MarkHostReservationNoShowUseCase {
  private readonly hostReservationRepository: HostReservationRepository;

  constructor(hostReservationRepository: HostReservationRepository) {
    this.hostReservationRepository = hostReservationRepository;
  }

  execute(reservationId: number) {
    return this.hostReservationRepository.markNoShow(reservationId);
  }
}
