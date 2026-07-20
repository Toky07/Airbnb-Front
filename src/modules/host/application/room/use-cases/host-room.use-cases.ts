import type { ListQueryParams } from '../../../../shared/pagination/types';
import type { RoomFormPayload } from '../../../core/types/host.types';
import type { HostRoomRepository } from '../ports/host-room.repository';

export class ListHostRoomsUseCase {
  constructor(private readonly hostRoomRepository: HostRoomRepository) {}

  execute(propertyId: number, params: ListQueryParams = {}) {
    return this.hostRoomRepository.listRooms(propertyId, params);
  }
}

export class CreateHostRoomUseCase {
  constructor(private readonly hostRoomRepository: HostRoomRepository) {}

  execute(propertyId: number, payload: RoomFormPayload) {
    return this.hostRoomRepository.createRoom(propertyId, payload);
  }
}

export class UpdateHostRoomUseCase {
  constructor(private readonly hostRoomRepository: HostRoomRepository) {}

  execute(propertyId: number, roomId: number, payload: RoomFormPayload) {
    return this.hostRoomRepository.updateRoom(propertyId, roomId, payload);
  }
}

export class DeleteHostRoomUseCase {
  constructor(private readonly hostRoomRepository: HostRoomRepository) {}

  execute(propertyId: number, roomId: number) {
    return this.hostRoomRepository.deleteRoom(propertyId, roomId);
  }
}

export class ListHostPropertyTypeOptionsUseCase {
  constructor(private readonly hostRoomRepository: HostRoomRepository) {}

  execute() {
    return this.hostRoomRepository.listPropertyTypeOptions();
  }
}

export class ListHostRoomTypeOptionsUseCase {
  constructor(private readonly hostRoomRepository: HostRoomRepository) {}

  execute() {
    return this.hostRoomRepository.listRoomTypeOptions();
  }
}
