import { getApiClient } from '../../../../shared/http/api-client';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import { parsePaginatedResponse } from '../../../../shared/pagination/parse-paginated-response';
import {
  mapReservation,
  type CreateReservationPayload,
  type Reservation,
} from '../types/reservation.types';

export class ReservationService {
  async create(payload: CreateReservationPayload): Promise<{
    success: true;
    reservation: Reservation;
  } | { success: false; error: string }> {
    const response = await getApiClient().post('/reservations', payload);
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de créer la réservation.'),
      };
    }

    const reservation = mapReservation(data);
    if (!reservation) {
      return { success: false, error: 'Réponse de réservation invalide.' };
    }

    return { success: true, reservation };
  }

  async listMine(page = 1, limit = 20): Promise<{
    success: true;
    reservations: Reservation[];
    total: number;
  } | { success: false; error: string }> {
    const response = await getApiClient().get(
      `/reservations/me?page=${page}&limit=${limit}`,
    );
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de charger vos achats.'),
      };
    }

    const parsed = parsePaginatedResponse(data, mapReservation);

    return {
      success: true,
      reservations: parsed.data,
      total: parsed.meta.total,
    };
  }
}

let service: ReservationService | null = null;

export function getReservationService(): ReservationService {
  if (!service) {
    service = new ReservationService();
  }
  return service;
}
