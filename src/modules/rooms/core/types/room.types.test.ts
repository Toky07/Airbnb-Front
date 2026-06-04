import { describe, expect, it } from 'vitest';
import { formatPricePerNight } from '../types/room.types';

describe('formatPricePerNight', () => {
  it('formate un prix en euros', () => {
    expect(formatPricePerNight(120)).toMatch(/120/);
  });
});
