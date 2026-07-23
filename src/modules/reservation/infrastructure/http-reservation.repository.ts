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

  async getCancellationPreview(reservationId: number) {
    const response = await this.httpClient.get(
      `/reservations/${reservationId}/cancellation-preview`,
    );
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false as const,
        error: parseApiError(data, 'Impossible de prévisualiser l’annulation.'),
      };
    }

    const record = data as Record<string, unknown>;
    if (typeof record.refundAmount !== 'number') {
      return { success: false as const, error: 'Réponse invalide.' };
    }

    return {
      success: true as const,
      preview: {
        reservationId: Number(record.reservationId ?? reservationId),
        refundAmount: record.refundAmount,
        refundPercent: Number(record.refundPercent ?? 0),
        policyLabel: String(record.policyLabel ?? ''),
        cancellationPolicy: String(record.cancellationPolicy ?? ''),
        paymentAmount: Number(record.paymentAmount ?? 0),
        currency: String(record.currency ?? 'eur'),
      },
    };
  }

  async cancelMine(reservationId: number) {
    const response = await this.httpClient.post(
      `/reservations/me/${reservationId}/cancel`,
      {},
    );
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false as const,
        error: parseApiError(data, 'Impossible d’annuler la réservation.'),
      };
    }

    const record = data as Record<string, unknown>;
    const reservationPayload =
      record.reservation && typeof record.reservation === 'object'
        ? record.reservation
        : data;
    const reservation = mapFirstReservation(reservationPayload);
    if (!reservation) {
      return { success: false as const, error: 'Réponse invalide.' };
    }

    return {
      success: true as const,
      reservation,
      refundAmount: Number(record.refundAmount ?? 0),
      refundPercent: Number(record.refundPercent ?? 0),
      policyLabel: String(record.policyLabel ?? ''),
    };
  }
}
