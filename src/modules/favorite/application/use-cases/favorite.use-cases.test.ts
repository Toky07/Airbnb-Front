import { describe, expect, it } from 'vitest';
import {
  AddFavoriteUseCase,
  CheckFavoritesUseCase,
  ListMyFavoritesUseCase,
  RemoveFavoriteUseCase,
} from './favorite.use-cases';

describe('favorite use cases', () => {
  const repository = {
    listMine: async () => ({ success: true as const, favorites: [] }),
    add: async (roomId: number) => ({
      success: true as const,
      favorite: {
        id: 1,
        roomId,
        createdAt: '2026-01-01T00:00:00.000Z',
        room: {
          id: roomId,
          name: 'Suite',
          slug: 'suite',
          description: '',
          pricePerNight: 100,
          maxGuests: 2,
          bedrooms: 1,
          bathrooms: 1,
          beds: 1,
          quantity: 1,
          size: 30,
          status: 'available',
          propertyId: 1,
          property: null,
          roomTypeId: null,
          roomType: null,
          images: [],
        },
      },
    }),
    remove: async () => ({ success: true as const }),
    check: async (roomIds: number[]) => ({
      success: true as const,
      favorites: Object.fromEntries(roomIds.map((id) => [String(id), false])),
    }),
  };

  it('délègue au repository', async () => {
    await expect(new ListMyFavoritesUseCase(repository).execute()).resolves.toEqual({
      success: true,
      favorites: [],
    });
    await expect(new AddFavoriteUseCase(repository).execute(5)).resolves.toMatchObject({
      success: true,
    });
    await expect(new RemoveFavoriteUseCase(repository).execute(5)).resolves.toEqual({
      success: true,
    });
    await expect(new CheckFavoritesUseCase(repository).execute([1, 2])).resolves.toEqual({
      success: true,
      favorites: { '1': false, '2': false },
    });
  });
});
