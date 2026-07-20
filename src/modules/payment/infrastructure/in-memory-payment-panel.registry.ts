import type {
  PaymentPanelComponent,
  PaymentPanelRegistry,
} from '../application/ports/payment-panel.registry';
import type { PaymentProvider, PaymentSession } from '../core/types/payment.types';

export class InMemoryPaymentPanelRegistry implements PaymentPanelRegistry {
  private readonly panels = new Map<PaymentProvider, PaymentPanelComponent>();

  register(provider: PaymentProvider, component: PaymentPanelComponent): void {
    this.panels.set(provider, component);
  }

  resolve(session: PaymentSession): PaymentPanelComponent | null {
    return this.panels.get(session.provider) ?? null;
  }
}
