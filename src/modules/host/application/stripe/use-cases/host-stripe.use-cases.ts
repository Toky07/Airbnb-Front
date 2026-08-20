import type { HostStripeRepository } from '../ports/host-stripe.repository';

export class CreateHostStripeOnboardingLinkUseCase {
  private readonly repository: HostStripeRepository;

  constructor(repository: HostStripeRepository) {
    this.repository = repository;
  }

  execute() {
    return this.repository.createOnboardingLink();
  }
}

export class CreateHostStripeDashboardLinkUseCase {
  private readonly repository: HostStripeRepository;

  constructor(repository: HostStripeRepository) {
    this.repository = repository;
  }

  execute() {
    return this.repository.createDashboardLink();
  }
}
