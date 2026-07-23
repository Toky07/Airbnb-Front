import { describe, expect, it, vi } from 'vitest';
import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { HostAmenityService } from './host-amenity.service';

const sampleAmenityApi = {
  id: 1,
  name: 'Wi-Fi',
  icon: 'wifi',
  scope: 'property',
  isActive: true,
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

describe('HostAmenityService', () => {
  it('liste les options property via GET /host/amenities/property/options', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(new Response(JSON.stringify([sampleAmenityApi]), { status: 200 })),
    });
    const service = new HostAmenityService(httpClient);
    const result = await service.listOptions('property');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.amenities[0]?.name).toBe('Wi-Fi');
    }
    expect(httpClient.get).toHaveBeenCalledWith('/host/amenities/property/options');
  });

  it('synchronise les équipements d’un établissement via PUT', async () => {
    const httpClient = createHttpClient({
      put: vi.fn().mockResolvedValue(new Response(JSON.stringify([sampleAmenityApi]), { status: 200 })),
    });
    const service = new HostAmenityService(httpClient);
    const result = await service.syncForProperty(1, [1, 2]);

    expect(result.success).toBe(true);
    expect(httpClient.put).toHaveBeenCalledWith('/host/properties/1/amenities', { amenityIds: [1, 2] });
  });

  it('retourne une erreur API', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Accès refusé' }), { status: 403 }),
      ),
    });
    const service = new HostAmenityService(httpClient);
    const result = await service.listForRoom(1, 5);

    expect(result).toEqual({
      success: false,
      error: 'Accès refusé',
    });
  });
});
