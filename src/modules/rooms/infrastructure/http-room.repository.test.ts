import { describe, expect, it, vi } from 'vitest';
import { HttpRoomRepository } from './http-room.repository';

const sampleRoomApi = {
  id: 1,
  name: 'Suite vue mer',
  slug: 'suite-vue-mer',
  description: 'Belle chambre',
  pricePerNight: 120,
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  quantity: 1,
  size: 35,
  status: 'available',
  propertyId: 1,
  property: {
    id: 1,
    name: 'Hôtel Azur',
    city: 'Nice',
    country: 'France',
    address: '1 Promenade',
    description: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    propertyType: null,
  },
  roomTypeId: null,
  roomType: null,
  images: [],
};

describe('HttpRoomRepository', () => {
  it('liste les logements via GET /rooms', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [sampleRoomApi],
          meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
        }),
        { status: 200 },
      ),
    );

    const repository = new HttpRoomRepository();
    const result = await repository.list({ page: 1, limit: 12 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.name).toBe('Suite vue mer');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/rooms?page=1&limit=12'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('retourne une liste vide en cas d’erreur API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 }),
    );

    const repository = new HttpRoomRepository();
    const result = await repository.list();

    expect(result).toEqual({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
  });

  it('récupère un logement par slug via GET /rooms/by-slug/:slug', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(sampleRoomApi), { status: 200 }),
    );

    const repository = new HttpRoomRepository();
    const room = await repository.getBySlug('suite-vue-mer');

    expect(room?.slug).toBe('suite-vue-mer');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/rooms/by-slug/suite-vue-mer'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('retourne null si le logement est introuvable', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }),
    );

    const repository = new HttpRoomRepository();
    const room = await repository.getBySlug('inconnu');

    expect(room).toBeNull();
  });
});
