import { describe, expect, it } from 'vitest';
import { mapProfileUpdateResponse } from './map-profile-response';

describe('mapProfileUpdateResponse', () => {
  it('mappe la réponse PUT /auth/profile', () => {
    expect(
      mapProfileUpdateResponse({
        id: 5,
        firstName: 'Jean',
        lastName: 'Dupont',
        phoneNumber: '+33601020304',
        avatar: 'uploads/users/5/avatar.jpg',
      }),
    ).toEqual({
      userId: 5,
      firstName: 'Jean',
      lastName: 'Dupont',
      phoneNumber: '+33601020304',
      avatar: 'uploads/users/5/avatar.jpg',
    });
  });

  it('retourne null pour une réponse invalide', () => {
    expect(mapProfileUpdateResponse(null)).toBeNull();
    expect(mapProfileUpdateResponse({ firstName: 'Jean' })).toBeNull();
  });
});
