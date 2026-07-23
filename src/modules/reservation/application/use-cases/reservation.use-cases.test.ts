import { describe, expect, it, vi } from 'vitest';
import type { Reservation } from '../../core/types/reservation.types';
import {
  CreateReservationUseCase,
  ListMyReservationsUseCase,
} from './reservation.use-cases';
import type { ReservationRepository } from '../ports/reservation.repository';

const sampleReservation: Reservation = {
  id: 12,
  itemId: 7,
  roomId: 3,
  userId: 5,
  startDate: '2026-08-01',
  endDate: '2026-08-03',
  guestCount: 2,
  totalPrice: 200,
  nights: 2,
  status: 'confirmed',
  roomName: 'Suite Deluxe',
  roomSlug: 'suite-deluxe',
  propertyName: 'Hotel Test',
  propertyCity: 'Paris',
  imageUrl: null,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
};

function createReservationRepository(
  overrides: Partial<ReservationRepository> = {},
): ReservationRepository {
  return {
    create: vi.fn(),
    listMine: vi.fn(),
    getCancellationPreview: vi.fn(),
    cancelMine: vi.fn(),
    ...overrides,
  };
}

describe('CreateReservationUseCase', () => {
  it('délègue la création au repository', async () => {
    const reservationRepository = createReservationRepository({
      create: vi.fn().mockResolvedValue({ success: true, reservation: sampleReservation }),
    });
    const useCase = new CreateReservationUseCase(reservationRepository);

    const result = await useCase.execute({
      roomId: 3,
      startDate: '2026-08-01',
      endDate: '2026-08-03',
      guestCount: 2,
    });

    expect(reservationRepository.create).toHaveBeenCalledWith({
      roomId: 3,
      startDate: '2026-08-01',
      endDate: '2026-08-03',
      guestCount: 2,
    });
    expect(result).toEqual({ success: true, reservation: sampleReservation });
  });
});

describe('ListMyReservationsUseCase', () => {
  it('délègue la liste au repository', async () => {
    const reservationRepository = createReservationRepository({
      listMine: vi.fn().mockResolvedValue({
        success: true,
        reservations: [sampleReservation],
        total: 1,
      }),
    });
    const useCase = new ListMyReservationsUseCase(reservationRepository);

    const result = await useCase.execute(1, 20);

    expect(reservationRepository.listMine).toHaveBeenCalledWith(1, 20);
    expect(result.success).toBe(true);
  });
});
