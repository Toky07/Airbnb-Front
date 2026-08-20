import type { HttpClient } from '../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../shared/http/parse-api-error';

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function submitContactMessage(
  payload: ContactPayload,
  httpClient: HttpClient = getHttpClient(),
): Promise<ContactResult> {
  const response = await httpClient.post('/contact', payload);
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      success: false,
      error: parseApiError(data, 'Impossible d’envoyer le message.'),
    };
  }

  const record = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
  return {
    success: true,
    message:
      typeof record.message === 'string'
        ? record.message
        : 'Votre message a bien été envoyé.',
  };
}
