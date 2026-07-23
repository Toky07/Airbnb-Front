import { describe, expect, it, vi } from 'vitest';
import { HttpHostPropertyRepository } from './http-host-property.repository';

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
};

describe('HttpHostPropertyRepository', () => {
  it('liste les établissements via GET /host/properties', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([samplePropertyApi]), { status: 200 }),
    );

    const repository = new HttpHostPropertyRepository();
    const properties = await repository.listProperties();

    expect(properties).toHaveLength(1);
    expect(properties[0]?.name).toBe('Hôtel Riviera');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/host/properties'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('récupère un établissement via GET /host/properties/:id', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(samplePropertyApi), { status: 200 }),
    );

    const repository = new HttpHostPropertyRepository();
    const property = await repository.getProperty(1);

    expect(property?.city).toBe('Nice');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/host/properties/1'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('crée un établissement via POST /host/properties', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(samplePropertyApi), { status: 201 }),
    );

    const repository = new HttpHostPropertyRepository();
    const result = await repository.createProperty({
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
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.property.name).toBe('Hôtel Riviera');
    }
  });

  it('retourne une erreur API lors de la création', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Nom déjà utilisé' }), { status: 400 }),
    );

    const repository = new HttpHostPropertyRepository();
    const result = await repository.createProperty({
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
    });

    expect(result).toEqual({ success: false, error: 'Nom déjà utilisé' });
  });
});
