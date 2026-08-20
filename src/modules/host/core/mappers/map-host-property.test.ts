import { describe, expect, it } from 'vitest';
import { mapHostProfile, mapHostStripeConnect } from './map-host-property';

describe('mapHostStripeConnect', () => {
  it('fournit des valeurs par défaut si le payload est absent', () => {
    expect(mapHostStripeConnect(undefined)).toEqual({
      onboardingStatus: 'not_started',
      chargesEnabled: false,
      payoutsEnabled: false,
      hasAccount: false,
    });
  });

  it('mappe le statut Connect renvoyé par l’API', () => {
    expect(
      mapHostStripeConnect({
        onboardingStatus: 'complete',
        chargesEnabled: true,
        payoutsEnabled: true,
        hasAccount: true,
      }),
    ).toEqual({
      onboardingStatus: 'complete',
      chargesEnabled: true,
      payoutsEnabled: true,
      hasAccount: true,
    });
  });
});

describe('mapHostProfile', () => {
  it('inclut stripe dans le profil hôte', () => {
    const profile = mapHostProfile({
      user: {
        id: 5,
        firstName: 'Jean',
        lastName: 'Hôte',
        email: 'jean@example.com',
        phoneNumber: '+33601020304',
      },
      properties: [],
      stripe: {
        onboardingStatus: 'pending',
        chargesEnabled: false,
        payoutsEnabled: false,
        hasAccount: true,
      },
    });

    expect(profile?.stripe).toEqual({
      onboardingStatus: 'pending',
      chargesEnabled: false,
      payoutsEnabled: false,
      hasAccount: true,
    });
  });
});
