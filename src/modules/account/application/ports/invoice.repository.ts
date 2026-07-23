import type { Invoice } from '../../core/types/invoice.types';

export type InvoiceListResult =
  | { success: true; invoices: Invoice[] }
  | { success: false; error: string };

export type InvoiceDownloadResult =
  | { success: true }
  | { success: false; error: string };

export interface InvoiceRepository {
  listMine(): Promise<InvoiceListResult>;
  download(invoiceId: number): Promise<InvoiceDownloadResult>;
}
