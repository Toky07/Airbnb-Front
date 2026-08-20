import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import type {
  HostStripeLinkResult,
  HostStripeRepository,
} from '../../application/stripe/ports/host-stripe.repository';

function parseStripeLinkResponse(
  data: unknown,
  errorFallback: string,
  ok: boolean,
): HostStripeLinkResult {
  if (!ok) {
    return { success: false, error: parseApiError(data, errorFallback) };
  }

  if (
    data &&
    typeof data === 'object' &&
    typeof (data as Record<string, unknown>).url === 'string'
  ) {
    return { success: true, url: (data as Record<string, unknown>).url as string };
  }

  return { success: false, error: 'Réponse invalide.' };
}

export class HttpHostStripeRepository implements HostStripeRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async createOnboardingLink(): Promise<HostStripeLinkResult> {
    const response = await this.httpClient.post('/host/stripe/onboarding-link', {});
    const data: unknown = await response.json().catch(() => null);
    return parseStripeLinkResponse(
      data,
      'Impossible de démarrer l’onboarding Stripe.',
      response.ok,
    );
  }

  async createDashboardLink(): Promise<HostStripeLinkResult> {
    const response = await this.httpClient.post('/host/stripe/dashboard-link', {});
    const data: unknown = await response.json().catch(() => null);
    return parseStripeLinkResponse(
      data,
      'Impossible d’ouvrir le dashboard Stripe.',
      response.ok,
    );
  }
}
