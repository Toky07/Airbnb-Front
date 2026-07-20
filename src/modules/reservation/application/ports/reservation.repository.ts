import type {
  CreateReservationPayload,
  Reservation,
} from '../../core/types/reservation.types';

export type CreateReservationResult =
  | { success: true; reservation: Reservation }
  | { success: false; error: string };

export type ListMyReservationsResult =
  | { success: true; reservations: Reservation[]; total: number }
  | { success: false; error: string };

export interface ReservationRepository {
  create(payload: CreateReservationPayload): Promise<CreateReservationResult>;
  listMine(page?: number, limit?: number): Promise<ListMyReservationsResult>;
}
