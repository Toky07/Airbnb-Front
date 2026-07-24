import type { RoomRateOverride } from '../types/rate-override.types';

export function mapRoomRateOverride(raw: unknown): RoomRateOverride | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as Record<string, unknown>;

  if (
    typeof record.id !== 'number' ||
    typeof record.roomId !== 'number' ||
    typeof record.startDate !== 'string' ||
    typeof record.endDate !== 'string' ||
    typeof record.pricePerNight !== 'number'
  ) {
    return null;
  }

  return {
    id: record.id,
    roomId: record.roomId,
    startDate: record.startDate,
    endDate: record.endDate,
    pricePerNight: record.pricePerNight,
    label: typeof record.label === 'string' ? record.label : null,
  };
}
