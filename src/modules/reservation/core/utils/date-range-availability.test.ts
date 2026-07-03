import { describe, expect, it } from 'vitest';
import {
  bookingRangeOverlapsUnavailable,
  isBookingRangeAvailable,
  isDateInUnavailableRange,
} from './date-range-availability';

const unavailable = [{ startDate: '2026-09-10', endDate: '2026-09-13' }];

describe('isDateInUnavailableRange', () => {
  it('marque indisponible une date à l’intérieur d’une plage', () => {
    expect(isDateInUnavailableRange('2026-09-11', unavailable)).toBe(true);
  });

  it('laisse disponible le jour de départ exclusif', () => {
    expect(isDateInUnavailableRange('2026-09-13', unavailable)).toBe(false);
  });
});

describe('bookingRangeOverlapsUnavailable', () => {
  it('détecte un chevauchement partiel', () => {
    expect(bookingRangeOverlapsUnavailable('2026-09-08', '2026-09-14', unavailable[0]!)).toBe(
      true,
    );
  });

  it('ignore une plage entièrement avant', () => {
    expect(bookingRangeOverlapsUnavailable('2026-09-01', '2026-09-03', unavailable[0]!)).toBe(
      false,
    );
  });
});

describe('isBookingRangeAvailable', () => {
  it('accepte une plage sans conflit', () => {
    expect(isBookingRangeAvailable('2026-09-01', '2026-09-03', unavailable)).toBe(true);
  });

  it('refuse une plage en conflit', () => {
    expect(isBookingRangeAvailable('2026-09-08', '2026-09-14', unavailable)).toBe(false);
  });

  it('retourne true si les dates ne sont pas encore choisies', () => {
    expect(isBookingRangeAvailable('', '2026-09-03', unavailable)).toBe(true);
  });
});
