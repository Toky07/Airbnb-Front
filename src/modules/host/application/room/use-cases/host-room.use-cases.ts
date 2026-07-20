import type { ListQueryParams } from '../../../../../shared/pagination/types';
import type { RoomFormPayload } from '../../../core/types/host.types';
import type { HostRoomRepository } from '../ports/host-room.repository';

export class ListHostRoomsUseCase {
  private readonly hostRoomRepository: HostRoomRepository;

  constructor(hostRoomRepository: HostRoomRepository) {
    this.hostRoomRepository = hostRoomRepository;
  }

  execute(propertyId: number, params: ListQueryParams = {}) {
    return this.hostRoomRepository.listRooms(propertyId, params);
  }
}

export class CreateHostRoomUseCase {
  private readonly hostRoomRepository: HostRoomRepository;

  constructor(hostRoomRepository: HostRoomRepository) {
    this.hostRoomRepository = hostRoomRepository;
  }

  execute(propertyId: number, payload: RoomFormPayload) {
    return this.hostRoomRepository.createRoom(propertyId, payload);
  }
}

export class UpdateHostRoomUseCase {
  private readonly hostRoomRepository: HostRoomRepository;

  constructor(hostRoomRepository: HostRoomRepository) {
    this.hostRoomRepository = hostRoomRepository;
  }

  execute(propertyId: number, roomId: number, payload: RoomFormPayload) {
    return this.hostRoomRepository.updateRoom(propertyId, roomId, payload);
  }
}

export class DeleteHostRoomUseCase {
  private readonly hostRoomRepository: HostRoomRepository;

  constructor(hostRoomRepository: HostRoomRepository) {
    this.hostRoomRepository = hostRoomRepository;
  }

  execute(propertyId: number, roomId: number) {
    return this.hostRoomRepository.deleteRoom(propertyId, roomId);
  }
}

export class ListHostPropertyTypeOptionsUseCase {
  private readonly hostRoomRepository: HostRoomRepository;

  constructor(hostRoomRepository: HostRoomRepository) {
    this.hostRoomRepository = hostRoomRepository;
  }

  execute() {
    return this.hostRoomRepository.listPropertyTypeOptions();
  }
}

export class ListHostRoomTypeOptionsUseCase {
  private readonly hostRoomRepository: HostRoomRepository;

  constructor(hostRoomRepository: HostRoomRepository) {
    this.hostRoomRepository = hostRoomRepository;
  }

  execute() {
    return this.hostRoomRepository.listRoomTypeOptions();
  }
}
