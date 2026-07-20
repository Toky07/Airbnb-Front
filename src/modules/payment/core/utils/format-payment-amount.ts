export function formatPaymentAmount(amountInCents: number, currency = 'eur'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}
