export type HostStripeLinkResult =
  | { success: true; url: string }
  | { success: false; error: string };

export interface HostStripeRepository {
  createOnboardingLink(): Promise<HostStripeLinkResult>;
  createDashboardLink(): Promise<HostStripeLinkResult>;
}
