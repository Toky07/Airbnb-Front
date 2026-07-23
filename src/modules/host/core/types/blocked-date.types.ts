export type RoomBlockedDate = {
  id: number;
  roomId: number;
  startDate: string;
  endDate: string;
  reason: string | null;
};

export type CreateRoomBlockedDatePayload = {
  startDate: string;
  endDate: string;
  reason?: string;
};

export type RoomBlockedDateMutationResult =
  | { success: true; blockedDate: RoomBlockedDate }
  | { success: false; error: string };
