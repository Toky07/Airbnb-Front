import { PAYMENT_PROVIDER, type PaymentSession } from '../types/payment.types';

export function mapPaymentSession(data: unknown): PaymentSession | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  const provider = normalizeProvider(record.provider);

  if (!provider) {
    return null;
  }

  if (typeof record.paymentId !== 'number') {
    return null;
  }

  const amount = Number(record.amount ?? 0);
  const currency = String(record.currency ?? 'eur');
  const holdUntil =
    typeof record.holdUntil === 'string' && record.holdUntil.trim()
      ? record.holdUntil
      : null;

  if (provider === PAYMENT_PROVIDER.STRIPE) {
    if (
      typeof record.clientSecret !== 'string' ||
      typeof record.publishableKey !== 'string'
    ) {
      return null;
    }

    return {
      paymentId: record.paymentId,
      amount,
      currency,
      provider: PAYMENT_PROVIDER.STRIPE,
      clientSecret: record.clientSecret,
      publishableKey: record.publishableKey,
      holdUntil,
    };
  }

  return null;
}

/** @deprecated Utiliser mapPaymentSession */
export function mapPaymentIntent(data: unknown): PaymentSession | null {
  return mapPaymentSession(data);
}

function normalizeProvider(value: unknown): PaymentSession['provider'] | null {
  if (value === PAYMENT_PROVIDER.STRIPE) {
    return PAYMENT_PROVIDER.STRIPE;
  }

  if (value === undefined || value === null) {
    return PAYMENT_PROVIDER.STRIPE;
  }

  return null;
}
