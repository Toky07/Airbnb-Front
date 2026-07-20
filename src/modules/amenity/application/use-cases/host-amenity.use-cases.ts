import type { AmenityScope } from '../../core/types/amenity.types';
import type { HostAmenityRepository } from '../ports/host-amenity.repository';

export class ListHostAmenityOptionsUseCase {
  constructor(private readonly hostAmenityRepository: HostAmenityRepository) {}

  execute(scope: AmenityScope) {
    return this.hostAmenityRepository.listOptions(scope);
  }
}

export class ListPropertyAmenitiesUseCase {
  constructor(private readonly hostAmenityRepository: HostAmenityRepository) {}

  execute(propertyId: number) {
    return this.hostAmenityRepository.listForProperty(propertyId);
  }
}

export class SyncPropertyAmenitiesUseCase {
  constructor(private readonly hostAmenityRepository: HostAmenityRepository) {}

  execute(propertyId: number, amenityIds: number[]) {
    return this.hostAmenityRepository.syncForProperty(propertyId, amenityIds);
  }
}

export class ListRoomAmenitiesUseCase {
  constructor(private readonly hostAmenityRepository: HostAmenityRepository) {}

  execute(propertyId: number, roomId: number) {
    return this.hostAmenityRepository.listForRoom(propertyId, roomId);
  }
}

export class SyncRoomAmenitiesUseCase {
  constructor(private readonly hostAmenityRepository: HostAmenityRepository) {}

  execute(propertyId: number, roomId: number, amenityIds: number[]) {
    return this.hostAmenityRepository.syncForRoom(propertyId, roomId, amenityIds);
  }
}
