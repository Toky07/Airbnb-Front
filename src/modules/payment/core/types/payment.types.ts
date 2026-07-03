export type PaymentIntentResult = {
  paymentId: number;
  clientSecret: string;
  amount: number;
  currency: string;
  publishableKey: string;
};

export function mapPaymentIntent(data: unknown): PaymentIntentResult | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (
    typeof record.paymentId !== 'number' ||
    typeof record.clientSecret !== 'string' ||
    typeof record.publishableKey !== 'string'
  ) {
    return null;
  }

  return {
    paymentId: record.paymentId,
    clientSecret: record.clientSecret,
    amount: Number(record.amount ?? 0),
    currency: String(record.currency ?? 'eur'),
    publishableKey: record.publishableKey,
  };
}

export function formatPaymentAmount(amountInCents: number, currency = 'eur'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}
