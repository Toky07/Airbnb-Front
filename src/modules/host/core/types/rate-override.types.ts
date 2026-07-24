export type RoomRateOverride = {
  id: number;
  roomId: number;
  startDate: string;
  endDate: string;
  pricePerNight: number;
  label: string | null;
};

export type CreateRoomRateOverridePayload = {
  startDate: string;
  endDate: string;
  pricePerNight: number;
  label?: string;
};

export type RoomRateOverrideMutationResult =
  | { success: true; rateOverride: RoomRateOverride }
  | { success: false; error: string };
