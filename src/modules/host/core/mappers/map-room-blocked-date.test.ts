import { describe, expect, it } from 'vitest';
import { mapRoomBlockedDate } from './map-room-blocked-date';

describe('mapRoomBlockedDate', () => {
  it('mappe une période bloquée valide', () => {
    const result = mapRoomBlockedDate({
      id: 1,
      roomId: 10,
      startDate: '2026-08-01',
      endDate: '2026-08-05',
      reason: 'Travaux',
    });

    expect(result).toEqual({
      id: 1,
      roomId: 10,
      startDate: '2026-08-01',
      endDate: '2026-08-05',
      reason: 'Travaux',
    });
  });

  it('retourne null pour une entrée invalide', () => {
    expect(mapRoomBlockedDate(null)).toBeNull();
    expect(mapRoomBlockedDate({ id: 0, roomId: 1 })).toBeNull();
  });
});
