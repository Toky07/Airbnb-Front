import { describe, expect, it, vi } from 'vitest';
import type { PaymentPanelProps } from '../application/ports/payment-panel.registry';
import { PAYMENT_PROVIDER } from '../core/types/payment.types';
import { InMemoryPaymentPanelRegistry } from './in-memory-payment-panel.registry';

const MockPanel = vi.fn((_props: PaymentPanelProps) => null);

describe('InMemoryPaymentPanelRegistry', () => {
  it('résout un panneau enregistré par provider', () => {
    const registry = new InMemoryPaymentPanelRegistry();
    registry.register(PAYMENT_PROVIDER.STRIPE, MockPanel);

    const session = {
      paymentId: 1,
      amount: 1000,
      currency: 'eur',
      provider: PAYMENT_PROVIDER.STRIPE,
      clientSecret: 'secret',
      publishableKey: 'pk_test',
    };

    expect(registry.resolve(session)).toBe(MockPanel);
  });

  it('retourne null pour un provider non enregistré', () => {
    const registry = new InMemoryPaymentPanelRegistry();

    expect(
      registry.resolve({
        paymentId: 1,
        amount: 1000,
        currency: 'eur',
        provider: PAYMENT_PROVIDER.STRIPE,
        clientSecret: 'secret',
        publishableKey: 'pk_test',
      }),
    ).toBeNull();
  });
});
