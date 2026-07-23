import { describe, expect, it } from 'vitest';
import { getPaymentPanelRegistry } from './payment.composition';
import { PAYMENT_PROVIDER } from '../../core/types/payment.types';

describe('payment.composition', () => {
  it('enregistre le panneau Stripe par défaut', () => {
    const registry = getPaymentPanelRegistry();
    const panel = registry.resolve({
      paymentId: 1,
      amount: 1000,
      currency: 'eur',
      provider: PAYMENT_PROVIDER.STRIPE,
      clientSecret: 'secret',
      publishableKey: 'pk_test',
      holdUntil: null,
    });

    expect(panel).not.toBeNull();
  });
});
