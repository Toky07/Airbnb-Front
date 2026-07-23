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

export type CancellationPreview = {
  reservationId: number;
  refundAmount: number;
  refundPercent: number;
  policyLabel: string;
  cancellationPolicy: string;
  paymentAmount: number;
  currency: string;
};

export type CancelReservationResult =
  | {
      success: true;
      reservation: Reservation;
      refundAmount: number;
      refundPercent: number;
      policyLabel: string;
    }
  | { success: false; error: string };

export interface ReservationRepository {
  create(payload: CreateReservationPayload): Promise<CreateReservationResult>;
  listMine(page?: number, limit?: number): Promise<ListMyReservationsResult>;
  getCancellationPreview(reservationId: number): Promise<
    | { success: true; preview: CancellationPreview }
    | { success: false; error: string }
  >;
  cancelMine(reservationId: number): Promise<CancelReservationResult>;
}
