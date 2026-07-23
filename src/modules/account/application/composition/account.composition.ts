import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import type { ProfileRepository } from '../ports/profile.repository';
import type { InvoiceRepository } from '../ports/invoice.repository';
import { UpdateProfileUseCase } from '../use-cases/update-profile.use-case';
import {
  DownloadInvoiceUseCase,
  ListMyInvoicesUseCase,
} from '../use-cases/invoice.use-cases';
import { HttpProfileRepository } from '../../infrastructure/http-profile.repository';
import { HttpInvoiceRepository } from '../../infrastructure/http-invoice.repository';

let profileRepository: ProfileRepository | null = null;
let invoiceRepository: InvoiceRepository | null = null;
let updateProfileUseCase: UpdateProfileUseCase | null = null;
let listMyInvoicesUseCase: ListMyInvoicesUseCase | null = null;
let downloadInvoiceUseCase: DownloadInvoiceUseCase | null = null;

export function getProfileRepository(): ProfileRepository {
  if (!profileRepository) {
    profileRepository = new HttpProfileRepository(getHttpClient());
  }
  return profileRepository;
}

export function getUpdateProfileUseCase(): UpdateProfileUseCase {
  if (!updateProfileUseCase) {
    updateProfileUseCase = new UpdateProfileUseCase(getProfileRepository());
  }
  return updateProfileUseCase;
}

export function getInvoiceRepository(): InvoiceRepository {
  if (!invoiceRepository) {
    invoiceRepository = new HttpInvoiceRepository(getHttpClient());
  }
  return invoiceRepository;
}

export function getListMyInvoicesUseCase(): ListMyInvoicesUseCase {
  if (!listMyInvoicesUseCase) {
    listMyInvoicesUseCase = new ListMyInvoicesUseCase(getInvoiceRepository());
  }
  return listMyInvoicesUseCase;
}

export function getDownloadInvoiceUseCase(): DownloadInvoiceUseCase {
  if (!downloadInvoiceUseCase) {
    downloadInvoiceUseCase = new DownloadInvoiceUseCase(getInvoiceRepository());
  }
  return downloadInvoiceUseCase;
}
