import { describe, expect, it, vi } from 'vitest';
import { sampleReservationOutputApi } from '../../../test/fixtures/reservation-api.fixtures';
import { HttpReservationRepository } from './http-reservation.repository';

describe('HttpReservationRepository', () => {
  it('crée une réservation à partir d’un ReservationOutput API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(sampleReservationOutputApi), { status: 201 }),
    );

    const repository = new HttpReservationRepository();
    const result = await repository.create({
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

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/reservations'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('retourne une erreur API lors de la création', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Dates indisponibles' }), { status: 400 }),
    );

    const repository = new HttpReservationRepository();
    const result = await repository.create({
      roomId: 3,
      startDate: '2026-08-01',
      endDate: '2026-08-03',
      guestCount: 2,
    });

    expect(result).toEqual({ success: false, error: 'Dates indisponibles' });
  });

  it('aplatit les réservations paginées pour /reservations/me', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [sampleReservationOutputApi],
          meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
        }),
        { status: 200 },
      ),
    );

    const repository = new HttpReservationRepository();
    const result = await repository.listMine();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.reservations).toHaveLength(1);
      expect(result.reservations[0]?.roomName).toBe('Suite Deluxe');
    }

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/reservations/me?page=1&limit=20'),
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
