export type PricingBreakdown = {
  subtotalCents: number;
  vatCents: number;
  touristTaxCents: number;
  serviceFeeCents: number;
  totalCents: number;
};

export function mapPricingBreakdown(data: unknown): PricingBreakdown | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (typeof record.totalCents !== 'number') {
    return null;
  }

  return {
    subtotalCents: Number(record.subtotalCents ?? 0),
    vatCents: Number(record.vatCents ?? 0),
    touristTaxCents: Number(record.touristTaxCents ?? 0),
    serviceFeeCents: Number(record.serviceFeeCents ?? 0),
    totalCents: record.totalCents,
  };
}

export function formatCentsPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}
