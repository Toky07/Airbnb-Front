import type {
  CreateReservationPayload,
  ReservationRepository,
} from '../ports/reservation.repository';

export class CreateReservationUseCase {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  execute(payload: CreateReservationPayload) {
    return this.reservationRepository.create(payload);
  }
}

export class ListMyReservationsUseCase {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  execute(page = 1, limit = 20) {
    return this.reservationRepository.listMine(page, limit);
  }
}
