import { describe, expect, it, vi } from 'vitest';
import {
  CreateHostRoomBlockedDateUseCase,
  DeleteHostRoomBlockedDateUseCase,
  ListHostRoomBlockedDatesUseCase,
} from './host-blocked-date.use-cases';
import type { HostBlockedDateRepository } from '../ports/host-blocked-date.repository';

function createRepositoryMock(
  overrides: Partial<HostBlockedDateRepository> = {},
): HostBlockedDateRepository {
  return {
    listBlockedDates: vi.fn().mockResolvedValue([]),
    createBlockedDate: vi.fn().mockResolvedValue({
      success: true,
      blockedDate: {
        id: 1,
        roomId: 10,
        startDate: '2026-08-01',
        endDate: '2026-08-05',
        reason: null,
      },
    }),
    deleteBlockedDate: vi.fn().mockResolvedValue({ success: true }),
    ...overrides,
  };
}

describe('host blocked date use-cases', () => {
  it('liste les périodes bloquées', async () => {
    const repository = createRepositoryMock({
      listBlockedDates: vi.fn().mockResolvedValue([
        {
          id: 1,
          roomId: 10,
          startDate: '2026-08-01',
          endDate: '2026-08-05',
          reason: 'Travaux',
        },
      ]),
    });

    const result = await new ListHostRoomBlockedDatesUseCase(repository).execute(1, 10);
    expect(result).toHaveLength(1);
    expect(repository.listBlockedDates).toHaveBeenCalledWith(1, 10);
  });

  it('crée une période bloquée', async () => {
    const repository = createRepositoryMock();
    const result = await new CreateHostRoomBlockedDateUseCase(repository).execute(1, 10, {
      startDate: '2026-08-01',
      endDate: '2026-08-05',
    });

    expect(result.success).toBe(true);
    expect(repository.createBlockedDate).toHaveBeenCalledWith(1, 10, {
      startDate: '2026-08-01',
      endDate: '2026-08-05',
    });
  });

  it('supprime une période bloquée', async () => {
    const repository = createRepositoryMock();
    const result = await new DeleteHostRoomBlockedDateUseCase(repository).execute(1, 10, 3);

    expect(result.success).toBe(true);
    expect(repository.deleteBlockedDate).toHaveBeenCalledWith(1, 10, 3);
  });
});
