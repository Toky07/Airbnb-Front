import { describe, expect, it, vi } from 'vitest';
import { HttpHostAmenityRepository } from './http-host-amenity.repository';

const sampleAmenityApi = {
  id: 1,
  name: 'Wi-Fi',
  icon: 'wifi',
  scope: 'property',
  isActive: true,
};

describe('HttpHostAmenityRepository', () => {
  it('liste les options property via GET /host/amenities/property/options', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([sampleAmenityApi]), { status: 200 }),
    );

    const repository = new HttpHostAmenityRepository();
    const result = await repository.listOptions('property');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.amenities[0]?.name).toBe('Wi-Fi');
    }
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/host/amenities/property/options'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('synchronise les équipements d’un établissement via PUT', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([sampleAmenityApi]), { status: 200 }),
    );

    const repository = new HttpHostAmenityRepository();
    const result = await repository.syncForProperty(1, [1, 2]);

    expect(result.success).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/host/properties/1/amenities'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('retourne une erreur API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Accès refusé' }), { status: 403 }),
    );

    const repository = new HttpHostAmenityRepository();
    const result = await repository.listForRoom(1, 5);

    expect(result).toEqual({
      success: false,
      error: 'Accès refusé',
    });
  });
});
