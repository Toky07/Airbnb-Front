import type {
  CreateRoomRateOverridePayload,
  RoomRateOverride,
  RoomRateOverrideMutationResult,
} from '../../../core/types/rate-override.types';

export interface HostRateOverrideRepository {
  listRateOverrides(propertyId: number, roomId: number): Promise<RoomRateOverride[]>;
  createRateOverride(
    propertyId: number,
    roomId: number,
    payload: CreateRoomRateOverridePayload,
  ): Promise<RoomRateOverrideMutationResult>;
  deleteRateOverride(
    propertyId: number,
    roomId: number,
    rateOverrideId: number,
  ): Promise<{ success: boolean; error?: string }>;
}
