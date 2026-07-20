import { describe, expect, it, vi } from 'vitest';
import {
  ListHostAmenityOptionsUseCase,
  SyncPropertyAmenitiesUseCase,
} from './host-amenity.use-cases';
import type { HostAmenityRepository } from '../ports/host-amenity.repository';
import type { AmenityItem } from '../../core/types/amenity.types';

const sampleAmenity: AmenityItem = {
  id: 1,
  name: 'Wi-Fi',
  icon: 'wifi',
  scope: 'property',
  isActive: true,
};

function createHostAmenityRepository(
  overrides: Partial<HostAmenityRepository> = {},
): HostAmenityRepository {
  return {
    listOptions: vi.fn(),
    listForProperty: vi.fn(),
    syncForProperty: vi.fn(),
    listForRoom: vi.fn(),
    syncForRoom: vi.fn(),
    ...overrides,
  };
}

describe('ListHostAmenityOptionsUseCase', () => {
  it('délègue au repository', async () => {
    const repository = createHostAmenityRepository({
      listOptions: vi.fn().mockResolvedValue({ success: true, amenities: [sampleAmenity] }),
    });
    const useCase = new ListHostAmenityOptionsUseCase(repository);

    const result = await useCase.execute('property');

    expect(repository.listOptions).toHaveBeenCalledWith('property');
    expect(result.success).toBe(true);
  });
});

describe('SyncPropertyAmenitiesUseCase', () => {
  it('délègue la synchronisation au repository', async () => {
    const repository = createHostAmenityRepository({
      syncForProperty: vi.fn().mockResolvedValue({ success: true, amenities: [sampleAmenity] }),
    });
    const useCase = new SyncPropertyAmenitiesUseCase(repository);

    const result = await useCase.execute(1, [1, 2]);

    expect(repository.syncForProperty).toHaveBeenCalledWith(1, [1, 2]);
    expect(result.success).toBe(true);
  });
});
