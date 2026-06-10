import { describe, expect, it, vi } from 'vitest';
import { getReservationService } from './reservation.service';

describe('ReservationService', () => {
  it('crée une réservation', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 12,
          roomId: 3,
          userId: 5,
          startDate: '2026-08-01',
          endDate: '2026-08-03',
          guestCount: 2,
          totalPrice: 200,
          nights: 2,
          status: 'pending',
          createdAt: '2026-06-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        }),
        { status: 201 },
      ),
    );

    const result = await getReservationService().create({
      roomId: 3,
      startDate: '2026-08-01',
      endDate: '2026-08-03',
      guestCount: 2,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.reservation.id).toBe(12);
      expect(result.reservation.status).toBe('pending');
    }
  });

  it('retourne une erreur API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Dates indisponibles' }), { status: 400 }),
    );

    const result = await getReservationService().create({
      roomId: 3,
      startDate: '2026-08-01',
      endDate: '2026-08-03',
      guestCount: 2,
    });

    expect(result).toEqual({ success: false, error: 'Dates indisponibles' });
  });
});
