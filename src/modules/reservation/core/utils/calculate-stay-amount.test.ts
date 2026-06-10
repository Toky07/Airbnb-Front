import { describe, expect, it } from 'vitest';
import { calculateStayAmountPreview, getDefaultBookingDates } from './calculate-stay-amount';

describe('calculateStayAmountPreview', () => {
  it('calcule le total pour deux nuits', () => {
    expect(calculateStayAmountPreview('2026-07-01', '2026-07-03', 120)).toEqual({
      nights: 2,
      totalPrice: 240,
    });
  });

  it('retourne null si les dates sont invalides', () => {
    expect(calculateStayAmountPreview('2026-07-03', '2026-07-01', 120)).toBeNull();
  });
});

describe('getDefaultBookingDates', () => {
  it('propose demain en arrivée et le surlendemain en départ', () => {
    expect(getDefaultBookingDates(new Date('2026-06-05T12:00:00'))).toEqual({
      startDate: '2026-06-06',
      endDate: '2026-06-07',
    });
  });
});
