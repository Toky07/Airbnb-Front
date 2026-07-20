import { describe, expect, it, vi } from 'vitest';
import { HttpHostRoomRepository } from './http-host-room.repository';

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

describe('HttpHostRoomRepository', () => {
  it('liste les chambres via GET /host/rooms', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [sampleRoomApi],
          meta: { page: 1, limit: 25, total: 1, totalPages: 1 },
        }),
        { status: 200 },
      ),
    );

    const repository = new HttpHostRoomRepository();
    const result = await repository.listRooms(1, { page: 1, limit: 25 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.name).toBe('Suite Deluxe');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/host/rooms'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('crée une chambre via POST /host/rooms', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(sampleRoomApi), { status: 201 }),
    );

    const repository = new HttpHostRoomRepository();
    const result = await repository.createRoom(1, {
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
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));

    const repository = new HttpHostRoomRepository();
    const result = await repository.deleteRoom(1, 5);

    expect(result).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/host/rooms/5'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
