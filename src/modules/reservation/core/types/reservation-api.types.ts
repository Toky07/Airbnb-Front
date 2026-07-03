import type { ReservationStatus } from '../types/reservation.types';

export type ReservationItemApi = {
  id: number;
  reservationId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  price: number;
  nights: number;
  roomName: string | null;
  roomSlug: string | null;
  propertyName: string | null;
  propertyCity: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReservationOutputApi = {
  id: number;
  userId: number;
  status: ReservationStatus;
  items: ReservationItemApi[];
  createdAt: string;
  updatedAt: string;
};

export function isReservationItemApi(data: unknown): data is ReservationItemApi {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const record = data as Record<string, unknown>;
  return (
    typeof record.id === 'number' &&
    typeof record.reservationId === 'number' &&
    typeof record.roomId === 'number' &&
    typeof record.startDate === 'string' &&
    typeof record.endDate === 'string'
  );
}

export function isReservationOutputApi(data: unknown): data is ReservationOutputApi {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const record = data as Record<string, unknown>;
  return (
    typeof record.id === 'number' &&
    typeof record.userId === 'number' &&
    typeof record.status === 'string' &&
    Array.isArray(record.items)
  );
}
