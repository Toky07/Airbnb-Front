import { describe, expect, it, vi } from 'vitest';
import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { RoomService } from './room.service';

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

function createHttpClient(overrides: Partial<HttpClient> = {}): HttpClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    postFormData: vi.fn(),
    putFormData: vi.fn(),
    ...overrides,
  };
}

describe('RoomService', () => {
  it('liste les logements via GET /rooms', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [sampleRoomApi],
            meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
          }),
          { status: 200 },
        ),
      ),
    });
    const service = new RoomService(httpClient);
    const result = await service.list({ page: 1, limit: 20 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.name).toBe('Suite vue mer');
    expect(httpClient.get).toHaveBeenCalledWith('/rooms?page=1&limit=20');
  });

  it('retourne une liste vide en cas d’erreur API', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Erreur serveur' }), { status: 500 }),
      ),
    });
    const service = new RoomService(httpClient);
    const result = await service.list();

    expect(result).toEqual({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
  });

  it('récupère un logement par slug via GET /rooms/by-slug/:slug', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(new Response(JSON.stringify(sampleRoomApi), { status: 200 })),
    });
    const service = new RoomService(httpClient);
    const room = await service.getBySlug('suite-vue-mer');

    expect(room?.slug).toBe('suite-vue-mer');
    expect(httpClient.get).toHaveBeenCalledWith('/rooms/by-slug/suite-vue-mer');
  });

  it('retourne null pour un slug vide', async () => {
    const httpClient = createHttpClient({ get: vi.fn() });
    const service = new RoomService(httpClient);

    await expect(service.getBySlug('')).resolves.toBeNull();
    await expect(service.getBySlug('   ')).resolves.toBeNull();
    expect(httpClient.get).not.toHaveBeenCalled();
  });

  it('retourne null si le logement est introuvable', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }),
      ),
    });
    const service = new RoomService(httpClient);
    const room = await service.getBySlug('inconnu');

    expect(room).toBeNull();
  });
});
