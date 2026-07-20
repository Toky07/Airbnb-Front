import type { HttpClient } from '../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../shared/http/parse-api-error';
import {
  mapFirstReservation,
  parsePaginatedReservationList,
} from '../core/mappers/map-reservation-output';
import type {
  CreateReservationPayload,
} from '../core/types/reservation.types';
import type {
  CreateReservationResult,
  ListMyReservationsResult,
  ReservationRepository,
} from '../application/ports/reservation.repository';

export class HttpReservationRepository implements ReservationRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async create(payload: CreateReservationPayload): Promise<CreateReservationResult> {
    const response = await this.httpClient.post('/reservations', payload);
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de créer la réservation.'),
      };
    }

    const reservation = mapFirstReservation(data);
    if (!reservation) {
      return { success: false, error: 'Réponse de réservation invalide.' };
    }

    return { success: true, reservation };
  }

  async listMine(page = 1, limit = 20): Promise<ListMyReservationsResult> {
    const response = await this.httpClient.get(
      `/reservations/me?page=${page}&limit=${limit}`,
    );
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de charger vos achats.'),
      };
    }

    const parsed = parsePaginatedReservationList(data);

    return {
      success: true,
      reservations: parsed.data,
      total: parsed.meta.total,
    };
  }
}
