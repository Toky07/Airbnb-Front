import type { HostApplicationRepository } from '../ports/host-application.repository';
import type { HostApplicationPayload } from '../../core/types/host-application.types';

export class GetMyHostApplicationUseCase {
  private readonly repository: HostApplicationRepository;

  constructor(repository: HostApplicationRepository) {
    this.repository = repository;
  }

  execute() {
    return this.repository.getMine();
  }
}

export class SubmitHostApplicationUseCase {
  private readonly repository: HostApplicationRepository;

  constructor(repository: HostApplicationRepository) {
    this.repository = repository;
  }

  execute(payload: HostApplicationPayload) {
    return this.repository.submit(payload);
  }
}
