import { describe, expect, it } from 'vitest';
import {
  formatHoldUntilLabel,
  isPaymentHoldExpired,
} from './payment.types';

describe('payment hold helpers', () => {
  it('détecte un hold expiré', () => {
    expect(
      isPaymentHoldExpired('2026-07-01T10:00:00.000Z', new Date('2026-07-01T10:01:00.000Z')),
    ).toBe(true);
  });

  it('conserve un hold encore valide', () => {
    expect(
      isPaymentHoldExpired('2026-07-01T10:20:00.000Z', new Date('2026-07-01T10:01:00.000Z')),
    ).toBe(false);
  });

  it('formate l’heure de fin de hold', () => {
    const label = formatHoldUntilLabel('2026-07-01T15:30:00.000Z');
    expect(label).toMatch(/\d{2}:\d{2}/);
  });
});
