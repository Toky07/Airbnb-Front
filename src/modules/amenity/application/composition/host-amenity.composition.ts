import type { HostAmenityRepository } from '../ports/host-amenity.repository';
import {
  ListHostAmenityOptionsUseCase,
  ListPropertyAmenitiesUseCase,
  ListRoomAmenitiesUseCase,
  SyncPropertyAmenitiesUseCase,
  SyncRoomAmenitiesUseCase,
} from '../use-cases/host-amenity.use-cases';
import { HttpHostAmenityRepository } from '../../infrastructure/http-host-amenity.repository';

let hostAmenityRepository: HostAmenityRepository | null = null;
let listHostAmenityOptionsUseCase: ListHostAmenityOptionsUseCase | null = null;
let listPropertyAmenitiesUseCase: ListPropertyAmenitiesUseCase | null = null;
let syncPropertyAmenitiesUseCase: SyncPropertyAmenitiesUseCase | null = null;
let listRoomAmenitiesUseCase: ListRoomAmenitiesUseCase | null = null;
let syncRoomAmenitiesUseCase: SyncRoomAmenitiesUseCase | null = null;

export function getHostAmenityRepository(): HostAmenityRepository {
  if (!hostAmenityRepository) {
    hostAmenityRepository = new HttpHostAmenityRepository();
  }
  return hostAmenityRepository;
}

export function getListHostAmenityOptionsUseCase(): ListHostAmenityOptionsUseCase {
  if (!listHostAmenityOptionsUseCase) {
    listHostAmenityOptionsUseCase = new ListHostAmenityOptionsUseCase(getHostAmenityRepository());
  }
  return listHostAmenityOptionsUseCase;
}

export function getListPropertyAmenitiesUseCase(): ListPropertyAmenitiesUseCase {
  if (!listPropertyAmenitiesUseCase) {
    listPropertyAmenitiesUseCase = new ListPropertyAmenitiesUseCase(getHostAmenityRepository());
  }
  return listPropertyAmenitiesUseCase;
}

export function getSyncPropertyAmenitiesUseCase(): SyncPropertyAmenitiesUseCase {
  if (!syncPropertyAmenitiesUseCase) {
    syncPropertyAmenitiesUseCase = new SyncPropertyAmenitiesUseCase(getHostAmenityRepository());
  }
  return syncPropertyAmenitiesUseCase;
}

export function getListRoomAmenitiesUseCase(): ListRoomAmenitiesUseCase {
  if (!listRoomAmenitiesUseCase) {
    listRoomAmenitiesUseCase = new ListRoomAmenitiesUseCase(getHostAmenityRepository());
  }
  return listRoomAmenitiesUseCase;
}

export function getSyncRoomAmenitiesUseCase(): SyncRoomAmenitiesUseCase {
  if (!syncRoomAmenitiesUseCase) {
    syncRoomAmenitiesUseCase = new SyncRoomAmenitiesUseCase(getHostAmenityRepository());
  }
  return syncRoomAmenitiesUseCase;
}
