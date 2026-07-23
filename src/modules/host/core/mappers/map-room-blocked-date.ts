import type { RoomBlockedDate } from '../types/blocked-date.types';

export function mapRoomBlockedDate(raw: unknown): RoomBlockedDate | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const id = Number(record.id);
  const roomId = Number(record.roomId);
  const startDate = String(record.startDate ?? '');
  const endDate = String(record.endDate ?? '');

  if (!Number.isFinite(id) || id <= 0 || !Number.isFinite(roomId) || roomId <= 0) {
    return null;
  }

  if (!startDate || !endDate) {
    return null;
  }

  return {
    id,
    roomId,
    startDate,
    endDate,
    reason: record.reason == null ? null : String(record.reason),
  };
}
