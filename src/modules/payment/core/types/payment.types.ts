export const PAYMENT_PROVIDER = {
  STRIPE: 'stripe',
} as const;

export type PaymentProvider = (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER];

export type PaymentSessionBase = {
  paymentId: number;
  amount: number;
  currency: string;
  provider: PaymentProvider;
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
