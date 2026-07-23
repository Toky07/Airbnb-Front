import type { InvoiceRepository } from '../ports/invoice.repository';

export class ListMyInvoicesUseCase {
  private readonly invoiceRepository: InvoiceRepository;

  constructor(invoiceRepository: InvoiceRepository) {
    this.invoiceRepository = invoiceRepository;
  }

  execute() {
    return this.invoiceRepository.listMine();
  }
}

export class DownloadInvoiceUseCase {
  private readonly invoiceRepository: InvoiceRepository;

  constructor(invoiceRepository: InvoiceRepository) {
    this.invoiceRepository = invoiceRepository;
  }

  execute(invoiceId: number) {
    return this.invoiceRepository.download(invoiceId);
  }
}
