import { describe, expect, it, vi } from 'vitest';
import { HttpHostStripeRepository } from './http-host-stripe.repository';

describe('HttpHostStripeRepository', () => {
  it('demande un lien d’onboarding via POST /host/stripe/onboarding-link', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ url: 'https://connect.stripe.com/setup/s/test' }), {
        status: 201,
      }),
    );

    const repository = new HttpHostStripeRepository();
    const result = await repository.createOnboardingLink();

    expect(result).toEqual({
      success: true,
      url: 'https://connect.stripe.com/setup/s/test',
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/host/stripe/onboarding-link'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('demande un login link via POST /host/stripe/dashboard-link', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ url: 'https://connect.stripe.com/express/acct' }), {
        status: 201,
      }),
    );

    const repository = new HttpHostStripeRepository();
    const result = await repository.createDashboardLink();

    expect(result).toEqual({
      success: true,
      url: 'https://connect.stripe.com/express/acct',
    });
  });
});
