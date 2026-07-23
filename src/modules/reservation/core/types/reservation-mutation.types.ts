import type { Reservation } from './reservation.types';

export type CreateReservationResult =
  | { success: true; reservation: Reservation }
  | { success: false; error: string };

export type ListMyReservationsResult =
  | { success: true; reservations: Reservation[]; total: number }
  | { success: false; error: string };
