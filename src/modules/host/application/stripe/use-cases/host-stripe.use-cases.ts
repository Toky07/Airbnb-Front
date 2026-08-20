import type { HostStripeRepository } from '../ports/host-stripe.repository';

export class CreateHostStripeOnboardingLinkUseCase {
  constructor(private readonly repository: HostStripeRepository) {}

  execute() {
    return this.repository.createOnboardingLink();
  }
}

export class CreateHostStripeDashboardLinkUseCase {
  constructor(private readonly repository: HostStripeRepository) {}

  execute() {
    return this.repository.createDashboardLink();
  }
}
