export type BookingFormValues = {
  startDate: string;
  endDate: string;
  guestCount: number;
};

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export type Reservation = {
  id: number;
  roomId: number;
  userId: number;
  startDate: string;
  endDate: string;
  guestCount: number;
  totalPrice: number;
  nights: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateReservationPayload = {
  roomId: number;
  startDate: string;
  endDate: string;
  guestCount: number;
};

export function mapReservation(data: unknown): Reservation | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (
    typeof record.id !== 'number' ||
    typeof record.roomId !== 'number' ||
    typeof record.startDate !== 'string' ||
    typeof record.endDate !== 'string'
  ) {
    return null;
  }

  return {
    id: record.id,
    roomId: record.roomId,
    userId: Number(record.userId ?? 0),
    startDate: record.startDate,
    endDate: record.endDate,
    guestCount: Number(record.guestCount ?? 1),
    totalPrice: Number(record.totalPrice ?? 0),
    nights: Number(record.nights ?? 0),
    status: (record.status as ReservationStatus) ?? 'pending',
    createdAt: String(record.createdAt ?? ''),
    updatedAt: String(record.updatedAt ?? ''),
  };
}

export function getReservationStatusLabel(status: ReservationStatus): string {
  const labels: Record<ReservationStatus, string> = {
    pending: 'En attente de paiement',
    confirmed: 'Confirmée',
    cancelled: 'Annulée',
  };
  return labels[status] ?? status;
}
