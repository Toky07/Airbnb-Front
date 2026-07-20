import { describe, expect, it, vi } from 'vitest';
import {
  CreateHostPropertyUseCase,
  ListHostPropertiesUseCase,
} from './host-property.use-cases';
import type { HostPropertyRepository } from '../ports/host-property.repository';
import type { HostProperty } from '../../../core/types/host.types';

const sampleProperty: HostProperty = {
  id: 1,
  name: 'Hôtel Riviera',
  description: '',
  address: '12 rue de la Mer',
  city: 'Nice',
  country: 'France',
  latitude: 0,
  longitude: 0,
  checkInTime: '15:00',
  checkOutTime: '11:00',
  ownerId: 5,
  propertyTypeId: 1,
  propertyType: { id: 1, name: 'Hôtel', slug: 'hotel' },
  image: null,
  roomCount: 4,
};

function createHostPropertyRepository(
  overrides: Partial<HostPropertyRepository> = {},
): HostPropertyRepository {
  return {
    getProfile: vi.fn(),
    listProperties: vi.fn(),
    getProperty: vi.fn(),
    createProperty: vi.fn(),
    updateProperty: vi.fn(),
    ...overrides,
  };
}

describe('ListHostPropertiesUseCase', () => {
  it('délègue la liste au repository', async () => {
    const repository = createHostPropertyRepository({
      listProperties: vi.fn().mockResolvedValue([sampleProperty]),
    });
    const useCase = new ListHostPropertiesUseCase(repository);

    const properties = await useCase.execute();

    expect(repository.listProperties).toHaveBeenCalledOnce();
    expect(properties).toEqual([sampleProperty]);
  });
});

describe('CreateHostPropertyUseCase', () => {
  it('délègue la création au repository', async () => {
    const payload = {
      name: 'Hôtel Riviera',
      description: '',
      address: '',
      city: 'Nice',
      country: 'France',
      latitude: 0,
      longitude: 0,
      checkInTime: '15:00',
      checkOutTime: '11:00',
      propertyTypeId: 1,
    };
    const repository = createHostPropertyRepository({
      createProperty: vi.fn().mockResolvedValue({ success: true, property: sampleProperty }),
    });
    const useCase = new CreateHostPropertyUseCase(repository);

    const result = await useCase.execute(payload);

    expect(repository.createProperty).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ success: true, property: sampleProperty });
  });
});
