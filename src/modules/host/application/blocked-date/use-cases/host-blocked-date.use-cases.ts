import type { HostBlockedDateRepository } from '../ports/host-blocked-date.repository';
import type { CreateRoomBlockedDatePayload } from '../../../core/types/blocked-date.types';

export class ListHostRoomBlockedDatesUseCase {
  constructor(private readonly repository: HostBlockedDateRepository) {}

  execute(propertyId: number, roomId: number) {
    return this.repository.listBlockedDates(propertyId, roomId);
  }
}

export class CreateHostRoomBlockedDateUseCase {
  constructor(private readonly repository: HostBlockedDateRepository) {}

  execute(propertyId: number, roomId: number, payload: CreateRoomBlockedDatePayload) {
    return this.repository.createBlockedDate(propertyId, roomId, payload);
  }
}

export class DeleteHostRoomBlockedDateUseCase {
  constructor(private readonly repository: HostBlockedDateRepository) {}

  execute(propertyId: number, roomId: number, blockedDateId: number) {
    return this.repository.deleteBlockedDate(propertyId, roomId, blockedDateId);
  }
}
