import type { CreateReservationPayload } from '../../core/types/reservation.types';
import type { ReservationRepository } from '../ports/reservation.repository';

export class CreateReservationUseCase {
  private readonly reservationRepository: ReservationRepository;

  constructor(reservationRepository: ReservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  execute(payload: CreateReservationPayload) {
    return this.reservationRepository.create(payload);
  }
}

export class ListMyReservationsUseCase {
  private readonly reservationRepository: ReservationRepository;

  constructor(reservationRepository: ReservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  execute(page = 1, limit = 20) {
    return this.reservationRepository.listMine(page, limit);
  }
}

export class GetCancellationPreviewUseCase {
  private readonly reservationRepository: ReservationRepository;

  constructor(reservationRepository: ReservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  execute(reservationId: number) {
    return this.reservationRepository.getCancellationPreview(reservationId);
  }
}

export class CancelMyReservationUseCase {
  private readonly reservationRepository: ReservationRepository;

  constructor(reservationRepository: ReservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  execute(reservationId: number) {
    return this.reservationRepository.cancelMine(reservationId);
  }
}
