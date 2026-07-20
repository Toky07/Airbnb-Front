/**
 * Mock léger de @stripe/stripe-js pour éviter le chargement du script Stripe en tests unitaires.
 */
export function loadStripe() {
  return Promise.resolve(null);
}
