import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import type { ReservationRepository } from '../ports/reservation.repository';
import {
  CancelMyReservationUseCase,
  CreateReservationUseCase,
  GetCancellationPreviewUseCase,
  ListMyReservationsUseCase,
} from '../use-cases/reservation.use-cases';
import { HttpReservationRepository } from '../../infrastructure/http-reservation.repository';

let reservationRepository: ReservationRepository | null = null;
let createReservationUseCase: CreateReservationUseCase | null = null;
let listMyReservationsUseCase: ListMyReservationsUseCase | null = null;
let getCancellationPreviewUseCase: GetCancellationPreviewUseCase | null = null;
let cancelMyReservationUseCase: CancelMyReservationUseCase | null = null;

export function getReservationRepository(): ReservationRepository {
  if (!reservationRepository) {
    reservationRepository = new HttpReservationRepository(getHttpClient());
  }
  return reservationRepository;
}

export function getCreateReservationUseCase(): CreateReservationUseCase {
  if (!createReservationUseCase) {
    createReservationUseCase = new CreateReservationUseCase(getReservationRepository());
  }
  return createReservationUseCase;
}

export function getListMyReservationsUseCase(): ListMyReservationsUseCase {
  if (!listMyReservationsUseCase) {
    listMyReservationsUseCase = new ListMyReservationsUseCase(getReservationRepository());
  }
  return listMyReservationsUseCase;
}

export function getGetCancellationPreviewUseCase(): GetCancellationPreviewUseCase {
  if (!getCancellationPreviewUseCase) {
    getCancellationPreviewUseCase = new GetCancellationPreviewUseCase(
      getReservationRepository(),
    );
  }
  return getCancellationPreviewUseCase;
}

export function getCancelMyReservationUseCase(): CancelMyReservationUseCase {
  if (!cancelMyReservationUseCase) {
    cancelMyReservationUseCase = new CancelMyReservationUseCase(getReservationRepository());
  }
  return cancelMyReservationUseCase;
}
