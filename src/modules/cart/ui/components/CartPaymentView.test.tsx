import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PaymentSession } from '../../../payment/core/types/payment.types';
import CartPaymentView from './CartPaymentView';

vi.mock('../../../payment/ui/components/PaymentPanel', () => ({
  default: () => <div data-testid="payment-panel">PaymentPanel</div>,
}));

vi.mock('../../../site/ui/components/PublicPageLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function createSession(holdUntil: string | null): PaymentSession {
  return {
    paymentId: 42,
    clientSecret: 'secret',
    publishableKey: 'pk_test',
    amount: 20000,
    currency: 'eur',
    provider: 'stripe',
    holdUntil,
  };
}

describe('CartPaymentView', () => {
  it('affiche le délai de hold et le panneau de paiement tant que le hold est valide', () => {
    render(
      <CartPaymentView
        paymentSession={createSession('2099-01-01T15:30:00.000Z')}
        onSuccess={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText(/réservation garantie jusqu’à/i)).toBeInTheDocument();
    expect(screen.getByTestId('payment-panel')).toBeInTheDocument();
  });

  it('affiche un message d’expiration et masque Stripe lorsque le hold est expiré', () => {
    const onCancel = vi.fn();

    render(
      <CartPaymentView
        paymentSession={createSession('2020-01-01T10:00:00.000Z')}
        onSuccess={vi.fn()}
        onCancel={onCancel}
      />,
    );

    expect(
      screen.getByText(/le délai de réservation a expiré/i),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('payment-panel')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /retour au panier/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
