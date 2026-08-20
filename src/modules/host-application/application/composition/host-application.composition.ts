import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import type { HostApplicationRepository } from '../ports/host-application.repository';
import {
  GetMyHostApplicationUseCase,
  SubmitHostApplicationUseCase,
} from '../use-cases/host-application.use-cases';
import { HttpHostApplicationRepository } from '../../infrastructure/http-host-application.repository';

let repository: HostApplicationRepository | null = null;
let getMineUseCase: GetMyHostApplicationUseCase | null = null;
let submitUseCase: SubmitHostApplicationUseCase | null = null;

export function getHostApplicationRepository(): HostApplicationRepository {
  if (!repository) {
    repository = new HttpHostApplicationRepository(getHttpClient());
  }
  return repository;
}

export function getMyHostApplicationUseCase(): GetMyHostApplicationUseCase {
  if (!getMineUseCase) {
    getMineUseCase = new GetMyHostApplicationUseCase(getHostApplicationRepository());
  }
  return getMineUseCase;
}

export function getSubmitHostApplicationUseCase(): SubmitHostApplicationUseCase {
  if (!submitUseCase) {
    submitUseCase = new SubmitHostApplicationUseCase(getHostApplicationRepository());
  }
  return submitUseCase;
}
