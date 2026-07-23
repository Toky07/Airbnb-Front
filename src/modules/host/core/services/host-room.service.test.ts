import { describe, expect, it, vi } from 'vitest';
import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { HostRoomService } from './host-room.service';

const sampleRoomApi = {
  id: 5,
  name: 'Suite Deluxe',
  slug: 'suite-deluxe',
  description: 'Grande suite',
  pricePerNight: 180,
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  quantity: 1,
  size: 40,
  status: 'available',
  propertyId: 1,
  property: null,
  roomTypeId: 1,
  roomType: { id: 1, name: 'Suite', slug: 'suite' },
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

describe('HostRoomService', () => {
  it('liste les chambres via GET /host/rooms', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [sampleRoomApi],
            meta: { page: 1, limit: 25, total: 1, totalPages: 1 },
          }),
          { status: 200 },
        ),
      ),
    });
    const service = new HostRoomService(httpClient);
    const result = await service.listRooms(1, { page: 1, limit: 25 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.name).toBe('Suite Deluxe');
    expect(httpClient.get).toHaveBeenCalledWith('/host/rooms?page=1&limit=25&propertyId=1');
  });

  it('crée une chambre via POST /host/rooms', async () => {
    const httpClient = createHttpClient({
      postFormData: vi.fn().mockResolvedValue(new Response(JSON.stringify(sampleRoomApi), { status: 201 })),
    });
    const service = new HostRoomService(httpClient);
    const result = await service.createRoom(1, {
      name: 'Suite Deluxe',
      description: 'Grande suite',
      pricePerNight: 180,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      quantity: 1,
      size: 40,
      status: 'available',
      roomTypeId: 1,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.room.name).toBe('Suite Deluxe');
    }
  });

  it('supprime une chambre via DELETE /host/rooms/:id', async () => {
    const httpClient = createHttpClient({
      delete: vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    });
    const service = new HostRoomService(httpClient);
    const result = await service.deleteRoom(1, 5);

    expect(result).toEqual({ success: true });
    expect(httpClient.delete).toHaveBeenCalledWith('/host/rooms/5?propertyId=1');
  });
});
