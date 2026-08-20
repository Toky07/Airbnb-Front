import { getHttpClient } from '../../../../../shared/http/composition/http.composition';
import type { HostStripeRepository } from '../ports/host-stripe.repository';
import {
  CreateHostStripeDashboardLinkUseCase,
  CreateHostStripeOnboardingLinkUseCase,
} from '../use-cases/host-stripe.use-cases';
import { HttpHostStripeRepository } from '../../../infrastructure/stripe/http-host-stripe.repository';

let repository: HostStripeRepository | null = null;
let onboardingUseCase: CreateHostStripeOnboardingLinkUseCase | null = null;
let dashboardUseCase: CreateHostStripeDashboardLinkUseCase | null = null;

function getRepository(): HostStripeRepository {
  if (!repository) {
    repository = new HttpHostStripeRepository(getHttpClient());
  }
  return repository;
}

export function getCreateHostStripeOnboardingLinkUseCase(): CreateHostStripeOnboardingLinkUseCase {
  if (!onboardingUseCase) {
    onboardingUseCase = new CreateHostStripeOnboardingLinkUseCase(getRepository());
  }
  return onboardingUseCase;
}

export function getCreateHostStripeDashboardLinkUseCase(): CreateHostStripeDashboardLinkUseCase {
  if (!dashboardUseCase) {
    dashboardUseCase = new CreateHostStripeDashboardLinkUseCase(getRepository());
  }
  return dashboardUseCase;
}
