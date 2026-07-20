import { describe, expect, it } from 'vitest';
import { formatPaymentAmount } from './format-payment-amount';

describe('formatPaymentAmount', () => {
  it('formate un montant en centimes en euros', () => {
    expect(formatPaymentAmount(24000, 'eur')).toMatch(/240/);
  });
});
