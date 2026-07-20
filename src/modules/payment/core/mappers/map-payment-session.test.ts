import { describe, expect, it } from 'vitest';
import { PAYMENT_PROVIDER } from '../types/payment.types';
import { mapPaymentSession } from './map-payment-session';

describe('mapPaymentSession', () => {
  it('mappe une session Stripe complète', () => {
    const session = mapPaymentSession({
      paymentId: 42,
      clientSecret: 'secret',
      publishableKey: 'pk_test',
      amount: 24000,
      currency: 'eur',
      provider: PAYMENT_PROVIDER.STRIPE,
    });

    expect(session).toEqual({
      paymentId: 42,
      clientSecret: 'secret',
      publishableKey: 'pk_test',
      amount: 24000,
      currency: 'eur',
      provider: PAYMENT_PROVIDER.STRIPE,
    });
  });

  it('déduit Stripe lorsque le provider est absent (rétrocompatibilité API)', () => {
    const session = mapPaymentSession({
      paymentId: 1,
      clientSecret: 'secret',
      publishableKey: 'pk_test',
      amount: 1000,
      currency: 'eur',
    });

    expect(session?.provider).toBe(PAYMENT_PROVIDER.STRIPE);
  });

  it('retourne null pour un provider inconnu', () => {
    expect(
      mapPaymentSession({
        paymentId: 1,
        provider: 'paypal',
        amount: 1000,
        currency: 'eur',
      }),
    ).toBeNull();
  });

  it('retourne null lorsque les champs Stripe sont manquants', () => {
    expect(
      mapPaymentSession({
        paymentId: 1,
        provider: PAYMENT_PROVIDER.STRIPE,
        amount: 1000,
        currency: 'eur',
      }),
    ).toBeNull();
  });
});
