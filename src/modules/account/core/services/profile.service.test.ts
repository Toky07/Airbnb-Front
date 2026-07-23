import { describe, expect, it, vi } from 'vitest';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  it('met à jour le profil via PUT /auth/profile', async () => {
    const putFormData = vi.fn().mockResolvedValue(
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

    const service = new ProfileService({ putFormData } as never);
    const result = await service.update({
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

    expect(putFormData).toHaveBeenCalledWith(
      '/auth/profile',
      expect.any(FormData),
    );
  });

  it('retourne une erreur API', async () => {
    const putFormData = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Téléphone invalide' }), { status: 400 }),
    );

    const service = new ProfileService({ putFormData } as never);
    const result = await service.update({
      firstName: 'Jean',
      lastName: 'Dupont',
      phoneNumber: 'bad',
    });

    expect(result).toEqual({ success: false, error: 'Téléphone invalide' });
  });
});
