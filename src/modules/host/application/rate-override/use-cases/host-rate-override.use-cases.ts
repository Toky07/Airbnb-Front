import type { HostRateOverrideRepository } from '../ports/host-rate-override.repository';
import type {
  CreateRoomRateOverridePayload,
  RoomRateOverrideMutationResult,
} from '../../../core/types/rate-override.types';

export class ListHostRoomRateOverridesUseCase {
  private readonly repository: HostRateOverrideRepository;

  constructor(repository: HostRateOverrideRepository) {
    this.repository = repository;
  }

  execute(propertyId: number, roomId: number) {
    return this.repository.listRateOverrides(propertyId, roomId);
  }
}

export class CreateHostRoomRateOverrideUseCase {
  private readonly repository: HostRateOverrideRepository;

  constructor(repository: HostRateOverrideRepository) {
    this.repository = repository;
  }

  execute(
    propertyId: number,
    roomId: number,
    payload: CreateRoomRateOverridePayload,
  ): Promise<RoomRateOverrideMutationResult> {
    return this.repository.createRateOverride(propertyId, roomId, payload);
  }
}

export class DeleteHostRoomRateOverrideUseCase {
  private readonly repository: HostRateOverrideRepository;

  constructor(repository: HostRateOverrideRepository) {
    this.repository = repository;
  }

  execute(propertyId: number, roomId: number, rateOverrideId: number) {
    return this.repository.deleteRateOverride(propertyId, roomId, rateOverrideId);
  }
}
