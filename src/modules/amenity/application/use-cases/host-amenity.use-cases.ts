import type { AmenityScope } from '../../core/types/amenity.types';
import type { HostAmenityRepository } from '../ports/host-amenity.repository';

export class ListHostAmenityOptionsUseCase {
  private readonly hostAmenityRepository: HostAmenityRepository;

  constructor(hostAmenityRepository: HostAmenityRepository) {
    this.hostAmenityRepository = hostAmenityRepository;
  }

  execute(scope: AmenityScope) {
    return this.hostAmenityRepository.listOptions(scope);
  }
}

export class ListPropertyAmenitiesUseCase {
  private readonly hostAmenityRepository: HostAmenityRepository;

  constructor(hostAmenityRepository: HostAmenityRepository) {
    this.hostAmenityRepository = hostAmenityRepository;
  }

  execute(propertyId: number) {
    return this.hostAmenityRepository.listForProperty(propertyId);
  }
}

export class SyncPropertyAmenitiesUseCase {
  private readonly hostAmenityRepository: HostAmenityRepository;

  constructor(hostAmenityRepository: HostAmenityRepository) {
    this.hostAmenityRepository = hostAmenityRepository;
  }

  execute(propertyId: number, amenityIds: number[]) {
    return this.hostAmenityRepository.syncForProperty(propertyId, amenityIds);
  }
}

export class ListRoomAmenitiesUseCase {
  private readonly hostAmenityRepository: HostAmenityRepository;

  constructor(hostAmenityRepository: HostAmenityRepository) {
    this.hostAmenityRepository = hostAmenityRepository;
  }

  execute(propertyId: number, roomId: number) {
    return this.hostAmenityRepository.listForRoom(propertyId, roomId);
  }
}

export class SyncRoomAmenitiesUseCase {
  private readonly hostAmenityRepository: HostAmenityRepository;

  constructor(hostAmenityRepository: HostAmenityRepository) {
    this.hostAmenityRepository = hostAmenityRepository;
  }

  execute(propertyId: number, roomId: number, amenityIds: number[]) {
    return this.hostAmenityRepository.syncForRoom(propertyId, roomId, amenityIds);
  }
}
