import type { PaginatedResponse } from '../../../../shared/pagination/types';
import type { Reservation, ReservationStatus } from '../types/reservation.types';
import {
  isReservationItemApi,
  isReservationOutputApi,
  type ReservationItemApi,
  type ReservationOutputApi,
} from '../types/reservation-api.types';

function mapReservationItemApi(
  reservation: ReservationOutputApi,
  item: ReservationItemApi,
): Reservation {
  return {
    id: reservation.id,
    itemId: item.id,
    roomId: item.roomId,
    userId: reservation.userId,
    paymentId:
      typeof reservation.paymentId === 'number' ? reservation.paymentId : null,
    startDate: item.startDate,
    endDate: item.endDate,
    guestCount: item.guestCount,
    totalPrice: item.price,
    nights: item.nights,
    status: reservation.status as ReservationStatus,
    roomName: item.roomName,
    roomSlug: item.roomSlug,
    propertyName: item.propertyName,
    propertyCity: item.propertyCity,
    imageUrl: item.imageUrl,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export function mapReservationOutput(data: unknown): Reservation[] {
  if (!isReservationOutputApi(data)) {
    return [];
  }

  return data.items
    .filter(isReservationItemApi)
    .map((item) => mapReservationItemApi(data, item));
}

export function mapReservationOutputs(data: unknown): Reservation[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.flatMap((entry) => mapReservationOutput(entry));
}

export function mapFirstReservation(data: unknown): Reservation | null {
  return mapReservationOutput(data)[0] ?? null;
}

export function parsePaginatedReservationList(
  data: unknown,
): PaginatedResponse<Reservation> {
  if (!data || typeof data !== 'object') {
    return {
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  const record = data as Record<string, unknown>;
  const metaRecord =
    record.meta && typeof record.meta === 'object'
      ? (record.meta as Record<string, unknown>)
      : {};

  const reservations = Array.isArray(record.data)
    ? record.data.flatMap((entry) => mapReservationOutput(entry))
    : [];

  return {
    data: reservations,
    meta: {
      page: typeof metaRecord.page === 'number' ? metaRecord.page : 1,
      limit: typeof metaRecord.limit === 'number' ? metaRecord.limit : 12,
      total: typeof metaRecord.total === 'number' ? metaRecord.total : reservations.length,
      totalPages:
        typeof metaRecord.totalPages === 'number' ? metaRecord.totalPages : 0,
    },
  };
}
