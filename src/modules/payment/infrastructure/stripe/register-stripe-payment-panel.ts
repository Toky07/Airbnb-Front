import type { InMemoryPaymentPanelRegistry } from '../in-memory-payment-panel.registry';
import { PAYMENT_PROVIDER } from '../../core/types/payment.types';
import StripePaymentPanel from './StripePaymentPanel';

export function registerStripePaymentPanel(registry: InMemoryPaymentPanelRegistry): void {
  registry.register(PAYMENT_PROVIDER.STRIPE, StripePaymentPanel);
}
