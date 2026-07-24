import { describe, expect, it, vi } from 'vitest';
import { sampleRoomApi } from '../../../test/fixtures/rooms-api.fixtures';
import { HttpFavoriteRepository } from './http-favorite.repository';

const sampleFavoriteApi = {
  id: 1,
  roomId: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  room: sampleRoomApi,
};

describe('HttpFavoriteRepository', () => {
  it('ajoute puis liste un favori', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify(sampleFavoriteApi), { status: 201 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify([sampleFavoriteApi]), { status: 200 }),
      );

    const repository = new HttpFavoriteRepository();
    const added = await repository.add(1);
    expect(added.success).toBe(true);

    const list = await repository.listMine();
    expect(list.success).toBe(true);
    if (list.success) {
      expect(list.favorites).toHaveLength(1);
      expect(list.favorites[0]?.roomId).toBe(1);
    }
  });

  it('vérifie le statut favori par chambre', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify(sampleFavoriteApi), { status: 201 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ favorites: { '1': true, '2': false } }),
          { status: 200 },
        ),
      );

    const repository = new HttpFavoriteRepository();
    await repository.add(1);

    const check = await repository.check([1, 2]);
    expect(check.success).toBe(true);
    if (check.success) {
      expect(check.favorites).toEqual({ '1': true, '2': false });
    }
  });
});
