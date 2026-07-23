import type { HttpClient } from '../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../shared/http/parse-api-error';
import { mapInvoices } from '../core/types/invoice.types';
import type {
  InvoiceDownloadResult,
  InvoiceListResult,
  InvoiceRepository,
} from '../application/ports/invoice.repository';

function parseFilename(contentDisposition: string | null, fallback: string): string {
  if (!contentDisposition) {
    return fallback;
  }

  const match = /filename="?([^";\n]+)"?/i.exec(contentDisposition);
  return match?.[1]?.trim() || fallback;
}

export class HttpInvoiceRepository implements InvoiceRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async listMine(): Promise<InvoiceListResult> {
    const response = await this.httpClient.get('/invoices/me');
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de charger vos factures.'),
      };
    }

    return { success: true, invoices: mapInvoices(data) };
  }

  async download(invoiceId: number): Promise<InvoiceDownloadResult> {
    const response = await this.httpClient.get(`/invoices/me/${invoiceId}/download`);

    if (!response.ok) {
      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      return {
        success: false,
        error: parseApiError(data, 'Impossible de télécharger la facture.'),
      };
    }

    const blob = await response.blob();
    const filename = parseFilename(
      response.headers.get('Content-Disposition'),
      `facture-${invoiceId}.pdf`,
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);

    return { success: true };
  }
}
