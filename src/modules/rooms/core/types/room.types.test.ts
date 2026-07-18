import { describe, expect, it } from 'vitest';
import { formatPricePerNight, mapRoomListItem } from '../types/room.types';

describe('formatPricePerNight', () => {
  it('formate un prix en euros', () => {
    expect(formatPricePerNight(120)).toMatch(/120/);
  });
});

describe('mapRoomListItem', () => {
  it('mappe les unavailableDates renvoyées par l’API', () => {
    const room = mapRoomListItem({
      id: 1,
      name: 'Suite',
      pricePerNight: 120,
      unavailableDates: [{ startDate: '2026-09-10', endDate: '2026-09-13' }],
    });

    expect(room?.unavailableDates).toEqual([
      { startDate: '2026-09-10', endDate: '2026-09-13' },
    ]);
  });
});
