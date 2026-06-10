import { describe, expect, it, vi } from 'vitest';
import { formatPaymentAmount, mapPaymentIntent } from '../types/payment.types';
import { getPaymentService } from './payment.service';

describe('payment types', () => {
  it('mappe une réponse de payment intent', () => {
    const intent = mapPaymentIntent({
      paymentId: 4,
      clientSecret: 'secret',
      amount: 24000,
      currency: 'eur',
      publishableKey: 'pk_test',
      nights: 2,
      pricePerNight: 120,
    });

    expect(intent?.paymentId).toBe(4);
    expect(intent?.clientSecret).toBe('secret');
  });

  it('formate un montant en centimes', () => {
    expect(formatPaymentAmount(24000, 'eur')).toContain('240');
  });
});

describe('PaymentService', () => {
  it('crée un payment intent', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          paymentId: 4,
          clientSecret: 'secret',
          amount: 24000,
          currency: 'eur',
          publishableKey: 'pk_test',
          nights: 2,
          pricePerNight: 120,
        }),
        { status: 201 },
      ),
    );

    const result = await getPaymentService().createIntent({ reservationId: 12 });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.intent.clientSecret).toBe('secret');
    }
  });
});
