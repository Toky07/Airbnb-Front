export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'no_show';

export type Reservation = {
  id: number;
  itemId: number;
  roomId: number;
  userId: number;
  paymentId: number | null;
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
  arrivalGuide: ReservationArrivalGuide | null;
  createdAt: string;
  updatedAt: string;
};

export type ReservationArrivalGuide = {
  address: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  houseRules: string | null;
  checkInInstructions: string | null;
  wifiName: string | null;
  wifiPassword: string | null;
  emergencyContact: string | null;
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
    no_show: 'No-show',
  };
  return labels[status] ?? status;
}
