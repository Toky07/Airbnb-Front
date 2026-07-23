import type {
  CreateRoomBlockedDatePayload,
  RoomBlockedDate,
  RoomBlockedDateMutationResult,
} from '../../../core/types/blocked-date.types';

export type HostBlockedDateRepository = {
  listBlockedDates(propertyId: number, roomId: number): Promise<RoomBlockedDate[]>;
  createBlockedDate(
    propertyId: number,
    roomId: number,
    payload: CreateRoomBlockedDatePayload,
  ): Promise<RoomBlockedDateMutationResult>;
  deleteBlockedDate(
    propertyId: number,
    roomId: number,
    blockedDateId: number,
  ): Promise<{ success: boolean; error?: string }>;
};
