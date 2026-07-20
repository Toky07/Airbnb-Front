import { describe, expect, it, vi } from 'vitest';
import { HttpProfileRepository } from './http-profile.repository';

describe('HttpProfileRepository', () => {
  it('met à jour le profil via PUT /auth/profile', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 5,
          firstName: 'Jean',
          lastName: 'Dupont',
          phoneNumber: '+33601020304',
          avatar: 'uploads/users/5/avatar.jpg',
        }),
        { status: 200 },
      ),
    );

    const repository = new HttpProfileRepository();
    const result = await repository.updateProfile({
      firstName: 'Jean',
      lastName: 'Dupont',
      phoneNumber: '+33601020304',
    });

    expect(result).toEqual({
      success: true,
      profile: {
        userId: 5,
        firstName: 'Jean',
        lastName: 'Dupont',
        phoneNumber: '+33601020304',
        avatar: 'uploads/users/5/avatar.jpg',
      },
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/profile'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('retourne une erreur API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Téléphone invalide' }), { status: 400 }),
    );

    const repository = new HttpProfileRepository();
    const result = await repository.updateProfile({
      firstName: 'Jean',
      lastName: 'Dupont',
      phoneNumber: 'bad',
    });

    expect(result).toEqual({ success: false, error: 'Téléphone invalide' });
  });
});
