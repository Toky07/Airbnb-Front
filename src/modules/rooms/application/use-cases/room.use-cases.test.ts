import { describe, expect, it, vi } from 'vitest';
import {
  GetRoomBySlugUseCase,
  ListRoomsUseCase,
} from './room.use-cases';
import type { RoomRepository } from '../ports/room.repository';
import type { RoomListItem } from '../../core/types/room.types';

const sampleRoom: RoomListItem = {
  id: 1,
  name: 'Suite vue mer',
  slug: 'suite-vue-mer',
  description: '',
  pricePerNight: 120,
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  quantity: 1,
  size: 35,
  status: 'available',
  propertyId: 1,
  property: null,
  roomTypeId: null,
  roomType: null,
  images: [],
};

function createRoomRepository(
  overrides: Partial<RoomRepository> = {},
): RoomRepository {
  return {
    list: vi.fn(),
    getById: vi.fn(),
    getBySlug: vi.fn(),
    ...overrides,
  };
}

describe('ListRoomsUseCase', () => {
  it('délègue la liste au repository', async () => {
    const roomRepository = createRoomRepository({
      list: vi.fn().mockResolvedValue({
        data: [sampleRoom],
        meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
      }),
    });
    const useCase = new ListRoomsUseCase(roomRepository);

    const result = await useCase.execute({ page: 1, limit: 12, search: 'Nice' });

    expect(roomRepository.list).toHaveBeenCalledWith({
      page: 1,
      limit: 12,
      search: 'Nice',
    });
    expect(result.data).toHaveLength(1);
  });
});

describe('GetRoomBySlugUseCase', () => {
  it('retourne null pour un slug vide', async () => {
    const roomRepository = createRoomRepository();
    const useCase = new GetRoomBySlugUseCase(roomRepository);

    await expect(useCase.execute('')).resolves.toBeNull();
    await expect(useCase.execute('   ')).resolves.toBeNull();
    expect(roomRepository.getBySlug).not.toHaveBeenCalled();
  });

  it('délègue la récupération au repository', async () => {
    const roomRepository = createRoomRepository({
      getBySlug: vi.fn().mockResolvedValue(sampleRoom),
    });
    const useCase = new GetRoomBySlugUseCase(roomRepository);

    const room = await useCase.execute('suite-vue-mer');

    expect(roomRepository.getBySlug).toHaveBeenCalledWith('suite-vue-mer');
    expect(room).toEqual(sampleRoom);
  });
});
