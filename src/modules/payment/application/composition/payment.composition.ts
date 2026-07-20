import { registerStripePaymentPanel } from '../../infrastructure/stripe/register-stripe-payment-panel';
import { InMemoryPaymentPanelRegistry } from '../../infrastructure/in-memory-payment-panel.registry';
import type { PaymentPanelRegistry } from '../ports/payment-panel.registry';

let paymentPanelRegistry: PaymentPanelRegistry | null = null;

function createPaymentPanelRegistry(): PaymentPanelRegistry {
  const registry = new InMemoryPaymentPanelRegistry();
  registerStripePaymentPanel(registry);
  return registry;
}

export function getPaymentPanelRegistry(): PaymentPanelRegistry {
  if (!paymentPanelRegistry) {
    paymentPanelRegistry = createPaymentPanelRegistry();
  }
  return paymentPanelRegistry;
}
