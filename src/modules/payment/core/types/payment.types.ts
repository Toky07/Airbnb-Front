export const PAYMENT_PROVIDER = {
  STRIPE: 'stripe',
} as const;

export type PaymentProvider = (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER];

export type PaymentSessionBase = {
  paymentId: number;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  holdUntil: string | null;
};

export type StripePaymentSession = PaymentSessionBase & {
  provider: typeof PAYMENT_PROVIDER.STRIPE;
  clientSecret: string;
  publishableKey: string;
};

export type PaymentSession = StripePaymentSession;

/** @deprecated Utiliser PaymentSession */
export type PaymentIntentResult = PaymentSession;

export function isStripePaymentSession(
  session: PaymentSession,
): session is StripePaymentSession {
  return session.provider === PAYMENT_PROVIDER.STRIPE;
}

export function isPaymentHoldExpired(
  holdUntil: string | null,
  now: Date = new Date(),
): boolean {
  if (!holdUntil) {
    return false;
  }
  const expiry = new Date(holdUntil);
  if (Number.isNaN(expiry.getTime())) {
    return false;
  }
  return expiry.getTime() <= now.getTime();
}

export function formatHoldUntilLabel(holdUntil: string | null): string | null {
  if (!holdUntil) {
    return null;
  }
  const expiry = new Date(holdUntil);
  if (Number.isNaN(expiry.getTime())) {
    return null;
  }
  return expiry.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
