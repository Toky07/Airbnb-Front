import type { ComponentType } from 'react';
import type { PaymentProvider, PaymentSession } from '../../core/types/payment.types';

export type PaymentPanelProps = {
  session: PaymentSession;
  onSuccess: () => void;
  onCancel: () => void;
};

export type PaymentPanelComponent = ComponentType<PaymentPanelProps>;

export interface PaymentPanelRegistry {
  register(provider: PaymentProvider, component: PaymentPanelComponent): void;
  resolve(session: PaymentSession): PaymentPanelComponent | null;
}
