import { getApiClient } from '../../../../shared/http/api-client';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import {
  mapPaymentIntent,
  type CreatePaymentIntentPayload,
  type PaymentIntentResult,
} from '../types/payment.types';

export class PaymentService {
  async createIntent(
    payload: CreatePaymentIntentPayload,
  ): Promise<
    { success: true; intent: PaymentIntentResult } | { success: false; error: string }
  > {
    const response = await getApiClient().post('/payments/intents', payload);
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de préparer le paiement.'),
      };
    }

    const intent = mapPaymentIntent(data);
    if (!intent) {
      return { success: false, error: 'Réponse de paiement invalide.' };
    }

    return { success: true, intent };
  }
}

let service: PaymentService | null = null;

export function getPaymentService(): PaymentService {
  if (!service) {
    service = new PaymentService();
  }
  return service;
}
