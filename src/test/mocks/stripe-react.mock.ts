/**
 * Mock léger de @stripe/react-stripe-js pour les tests unitaires.
 */
import type { ReactNode } from 'react';

export function Elements({ children }: { children: ReactNode }) {
  return children;
}

export function PaymentElement() {
  return null;
}

export function useStripe() {
  return null;
}

export function useElements() {
  return null;
}
