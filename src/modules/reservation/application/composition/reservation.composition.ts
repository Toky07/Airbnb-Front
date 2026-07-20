import type { ReservationRepository } from '../ports/reservation.repository';
import {
  CreateReservationUseCase,
  ListMyReservationsUseCase,
} from '../use-cases/reservation.use-cases';
import { HttpReservationRepository } from '../../infrastructure/http-reservation.repository';

let reservationRepository: ReservationRepository | null = null;
let createReservationUseCase: CreateReservationUseCase | null = null;
let listMyReservationsUseCase: ListMyReservationsUseCase | null = null;

export function getReservationRepository(): ReservationRepository {
  if (!reservationRepository) {
    reservationRepository = new HttpReservationRepository();
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
