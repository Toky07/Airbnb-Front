import { describe, expect, it, vi } from 'vitest';
import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { sampleReservationOutputApi } from '../../../../test/fixtures/reservation-api.fixtures';
import { ReservationService } from './reservation.service';

function createHttpClient(overrides: Partial<HttpClient> = {}): HttpClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    postFormData: vi.fn(),
    putFormData: vi.fn(),
    ...overrides,
  };
}

describe('ReservationService', () => {
  it('crée une réservation à partir d’un ReservationOutput API', async () => {
    const httpClient = createHttpClient({
      post: vi.fn().mockResolvedValue(
        new Response(JSON.stringify(sampleReservationOutputApi), { status: 201 }),
      ),
    });
    const service = new ReservationService(httpClient);
    const result = await service.create({
      roomId: 3,
      startDate: '2026-08-01',
      endDate: '2026-08-03',
      guestCount: 2,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.reservation.id).toBe(12);
      expect(result.reservation.roomId).toBe(3);
      expect(result.reservation.status).toBe('confirmed');
    }

    expect(httpClient.post).toHaveBeenCalledWith('/reservations', {
      roomId: 3,
      startDate: '2026-08-01',
      endDate: '2026-08-03',
      guestCount: 2,
    });
  });

  it('retourne une erreur API lors de la création', async () => {
    const httpClient = createHttpClient({
      post: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Dates indisponibles' }), { status: 400 }),
      ),
    });
    const service = new ReservationService(httpClient);
    const result = await service.create({
      roomId: 3,
      startDate: '2026-08-01',
      endDate: '2026-08-03',
      guestCount: 2,
    });

    expect(result).toEqual({ success: false, error: 'Dates indisponibles' });
  });

  it('aplatit les réservations paginées pour /reservations/me', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [sampleReservationOutputApi],
            meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
          }),
          { status: 200 },
        ),
      ),
    });
    const service = new ReservationService(httpClient);
    const result = await service.listMine();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.reservations).toHaveLength(1);
      expect(result.reservations[0]?.roomName).toBe('Suite Deluxe');
    }

    expect(httpClient.get).toHaveBeenCalledWith('/reservations/me?page=1&limit=20');
  });
});
