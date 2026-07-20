import { describe, expect, it, vi } from 'vitest';
import {
  DeleteHostRoomUseCase,
  ListHostRoomsUseCase,
} from './host-room.use-cases';
import type { HostRoomRepository } from '../ports/host-room.repository';
import type { RoomListItem } from '../../../core/types/host.types';

const sampleRoom: RoomListItem = {
  id: 5,
  name: 'Suite Deluxe',
  slug: 'suite-deluxe',
  description: '',
  pricePerNight: 180,
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  quantity: 1,
  size: 40,
  status: 'available',
  propertyId: 1,
  property: null,
  roomTypeId: 1,
  roomType: { id: 1, name: 'Suite', slug: 'suite' },
  images: [],
};

function createHostRoomRepository(
  overrides: Partial<HostRoomRepository> = {},
): HostRoomRepository {
  return {
    listRooms: vi.fn(),
    createRoom: vi.fn(),
    updateRoom: vi.fn(),
    deleteRoom: vi.fn(),
    listPropertyTypeOptions: vi.fn(),
    listRoomTypeOptions: vi.fn(),
    ...overrides,
  };
}

describe('ListHostRoomsUseCase', () => {
  it('délègue la liste au repository', async () => {
    const repository = createHostRoomRepository({
      listRooms: vi.fn().mockResolvedValue({
        data: [sampleRoom],
        meta: { page: 1, limit: 25, total: 1, totalPages: 1 },
      }),
    });
    const useCase = new ListHostRoomsUseCase(repository);

    const result = await useCase.execute(1, { page: 1, limit: 25 });

    expect(repository.listRooms).toHaveBeenCalledWith(1, { page: 1, limit: 25 });
    expect(result.data).toHaveLength(1);
  });
});

describe('DeleteHostRoomUseCase', () => {
  it('délègue la suppression au repository', async () => {
    const repository = createHostRoomRepository({
      deleteRoom: vi.fn().mockResolvedValue({ success: true }),
    });
    const useCase = new DeleteHostRoomUseCase(repository);

    const result = await useCase.execute(1, 5);

    expect(repository.deleteRoom).toHaveBeenCalledWith(1, 5);
    expect(result).toEqual({ success: true });
  });
});
