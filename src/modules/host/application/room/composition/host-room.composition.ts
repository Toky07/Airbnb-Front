import { getHttpClient } from '../../../../../shared/http/composition/http.composition';
import type { HostRoomRepository } from '../ports/host-room.repository';
import {
  CreateHostRoomUseCase,
  DeleteHostRoomUseCase,
  ListHostPropertyTypeOptionsUseCase,
  ListHostRoomsUseCase,
  ListHostRoomTypeOptionsUseCase,
  UpdateHostRoomUseCase,
} from '../use-cases/host-room.use-cases';
import { HttpHostRoomRepository } from '../../../infrastructure/room/http-host-room.repository';

let hostRoomRepository: HostRoomRepository | null = null;
let listHostRoomsUseCase: ListHostRoomsUseCase | null = null;
let createHostRoomUseCase: CreateHostRoomUseCase | null = null;
let updateHostRoomUseCase: UpdateHostRoomUseCase | null = null;
let deleteHostRoomUseCase: DeleteHostRoomUseCase | null = null;
let listHostPropertyTypeOptionsUseCase: ListHostPropertyTypeOptionsUseCase | null = null;
let listHostRoomTypeOptionsUseCase: ListHostRoomTypeOptionsUseCase | null = null;

export function getHostRoomRepository(): HostRoomRepository {
  if (!hostRoomRepository) {
    hostRoomRepository = new HttpHostRoomRepository(getHttpClient());
  }
  return hostRoomRepository;
}

export function getListHostRoomsUseCase(): ListHostRoomsUseCase {
  if (!listHostRoomsUseCase) {
    listHostRoomsUseCase = new ListHostRoomsUseCase(getHostRoomRepository());
  }
  return listHostRoomsUseCase;
}

export function getCreateHostRoomUseCase(): CreateHostRoomUseCase {
  if (!createHostRoomUseCase) {
    createHostRoomUseCase = new CreateHostRoomUseCase(getHostRoomRepository());
  }
  return createHostRoomUseCase;
}

export function getUpdateHostRoomUseCase(): UpdateHostRoomUseCase {
  if (!updateHostRoomUseCase) {
    updateHostRoomUseCase = new UpdateHostRoomUseCase(getHostRoomRepository());
  }
  return updateHostRoomUseCase;
}

export function getDeleteHostRoomUseCase(): DeleteHostRoomUseCase {
  if (!deleteHostRoomUseCase) {
    deleteHostRoomUseCase = new DeleteHostRoomUseCase(getHostRoomRepository());
  }
  return deleteHostRoomUseCase;
}

export function getListHostPropertyTypeOptionsUseCase(): ListHostPropertyTypeOptionsUseCase {
  if (!listHostPropertyTypeOptionsUseCase) {
    listHostPropertyTypeOptionsUseCase = new ListHostPropertyTypeOptionsUseCase(
      getHostRoomRepository(),
    );
  }
  return listHostPropertyTypeOptionsUseCase;
}

export function getListHostRoomTypeOptionsUseCase(): ListHostRoomTypeOptionsUseCase {
  if (!listHostRoomTypeOptionsUseCase) {
    listHostRoomTypeOptionsUseCase = new ListHostRoomTypeOptionsUseCase(getHostRoomRepository());
  }
  return listHostRoomTypeOptionsUseCase;
}
