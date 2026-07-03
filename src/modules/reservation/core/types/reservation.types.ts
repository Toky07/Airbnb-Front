export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export type Reservation = {
  id: number;
  itemId: number;
  roomId: number;
  userId: number;
  startDate: string;
  endDate: string;
  guestCount: number;
  totalPrice: number;
  nights: number;
  status: ReservationStatus;
  roomName: string | null;
  roomSlug: string | null;
  propertyName: string | null;
  propertyCity: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BookingFormValues = {
  startDate: string;
  endDate: string;
  guestCount: number;
};

export type CreateReservationPayload = {
  roomId: number;
  startDate: string;
  endDate: string;
  guestCount: number;
};

export function getReservationStatusLabel(status: ReservationStatus): string {
  const labels: Record<ReservationStatus, string> = {
    pending: 'En attente de paiement',
    confirmed: 'Confirmée',
    cancelled: 'Annulée',
  };
  return labels[status] ?? status;
}
