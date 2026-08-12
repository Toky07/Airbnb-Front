import { describe, expect, it, vi } from 'vitest';
import {
  GetHostReservationStatsOverviewUseCase,
  ListHostBookingsUseCase,
} from './host-reservation.use-cases';
import type { HostReservationRepository } from '../ports/host-reservation.repository';

function createHostReservationRepository(
  overrides: Partial<HostReservationRepository> = {},
): HostReservationRepository {
  return {
    listBookings: vi.fn(),
    getStatsOverview: vi.fn(),
    cancelReservation: vi.fn(),
    markNoShow: vi.fn(),
    restoreFromNoShow: vi.fn(),
    ...overrides,
  };
}

describe('ListHostBookingsUseCase', () => {
  it('délègue la liste au repository', async () => {
    const repository = createHostReservationRepository({
      listBookings: vi.fn().mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      }),
    });
    const useCase = new ListHostBookingsUseCase(repository);

    await useCase.execute({ page: 2, search: 'Jean' });

    expect(repository.listBookings).toHaveBeenCalledWith({ page: 2, search: 'Jean' });
  });
});

describe('GetHostReservationStatsOverviewUseCase', () => {
  it('délègue la récupération des stats au repository', async () => {
    const overview = {
      stats: {
        activeCount: 1,
        pendingCount: 0,
        monthlyRevenue: 100,
        totalRevenue: 100,
        totalCount: 1,
        occupancyRate: 50,
      },
      recentActivity: [],
    };
    const repository = createHostReservationRepository({
      getStatsOverview: vi.fn().mockResolvedValue(overview),
    });
    const useCase = new GetHostReservationStatsOverviewUseCase(repository);

    const result = await useCase.execute();

    expect(repository.getStatsOverview).toHaveBeenCalledOnce();
    expect(result).toEqual(overview);
  });
});
