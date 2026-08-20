import { describe, expect, it, vi } from 'vitest';
import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { HostPropertyService } from './host-property.service';

const samplePropertyApi = {
  id: 1,
  name: 'Hôtel Riviera',
  description: 'Face à la mer',
  address: '12 rue de la Mer',
  city: 'Nice',
  country: 'France',
  latitude: 43.7,
  longitude: 7.26,
  checkInTime: '15:00',
  checkOutTime: '11:00',
  ownerId: 5,
  propertyTypeId: 1,
  propertyType: { id: 1, name: 'Hôtel', slug: 'hotel' },
  image: null,
  roomCount: 4,
  cancellationPolicy: 'moderate',
  touristTaxPerGuestNight: 0,
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

describe('HostPropertyService', () => {
  it('liste les établissements via GET /host/properties', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(new Response(JSON.stringify([samplePropertyApi]), { status: 200 })),
    });
    const service = new HostPropertyService(httpClient);
    const properties = await service.listProperties();

    expect(properties).toHaveLength(1);
    expect(properties[0]?.name).toBe('Hôtel Riviera');
    expect(httpClient.get).toHaveBeenCalledWith('/host/properties');
  });

  it('récupère un établissement via GET /host/properties/:id', async () => {
    const httpClient = createHttpClient({
      get: vi.fn().mockResolvedValue(new Response(JSON.stringify(samplePropertyApi), { status: 200 })),
    });
    const service = new HostPropertyService(httpClient);
    const property = await service.getProperty(1);

    expect(property?.city).toBe('Nice');
    expect(httpClient.get).toHaveBeenCalledWith('/host/properties/1');
  });

  it('crée un établissement via POST /host/properties', async () => {
    const httpClient = createHttpClient({
      postFormData: vi.fn().mockResolvedValue(new Response(JSON.stringify(samplePropertyApi), { status: 201 })),
    });
    const service = new HostPropertyService(httpClient);
    const result = await service.createProperty({
      name: 'Hôtel Riviera',
      description: 'Face à la mer',
      address: '12 rue de la Mer',
      city: 'Nice',
      country: 'France',
      latitude: 43.7,
      longitude: 7.26,
      checkInTime: '15:00',
      checkOutTime: '11:00',
      propertyTypeId: 1,
      cancellationPolicy: 'moderate',
      touristTaxPerGuestNight: 0,
      houseRules: '',
      checkInInstructions: '',
      wifiName: '',
      wifiPassword: '',
      emergencyContact: '',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.property.name).toBe('Hôtel Riviera');
    }
  });

  it('retourne une erreur API lors de la création', async () => {
    const httpClient = createHttpClient({
      postFormData: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Nom déjà utilisé' }), { status: 400 }),
      ),
    });
    const service = new HostPropertyService(httpClient);
    const result = await service.createProperty({
      name: 'Hôtel Riviera',
      description: '',
      address: '',
      city: 'Nice',
      country: 'France',
      latitude: 0,
      longitude: 0,
      checkInTime: '15:00',
      checkOutTime: '11:00',
      propertyTypeId: null,
      cancellationPolicy: 'moderate',
      touristTaxPerGuestNight: 0,
      houseRules: '',
      checkInInstructions: '',
      wifiName: '',
      wifiPassword: '',
      emergencyContact: '',
    });

    expect(result).toEqual({ success: false, error: 'Nom déjà utilisé' });
  });
});
