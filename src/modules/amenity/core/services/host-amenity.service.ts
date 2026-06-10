import { getApiClient } from '../../../../shared/http/api-client';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import {
  mapAmenityItem,
  type AmenityItem,
  type AmenityScope,
} from '../types/amenity.types';

async function parseError(response: Response, fallback: string): Promise<string> {
  try {
    const data: unknown = await response.json();
    return parseApiError(data, fallback);
  } catch {
    return fallback;
  }
}

function scopePath(scope: AmenityScope): string {
  return scope === 'room' ? 'room' : 'property';
}

function mapAmenityList(data: unknown): AmenityItem[] {
  return Array.isArray(data)
    ? data.map(mapAmenityItem).filter((item): item is AmenityItem => item !== null)
    : [];
}

export class HostAmenityService {
  async listOptions(scope: AmenityScope): Promise<AmenityItem[]> {
    const response = await getApiClient().get(`/host/amenities/${scopePath(scope)}/options`);
    if (!response.ok) {
      throw new Error(await parseError(response, 'Impossible de charger les équipements.'));
    }
    const data: unknown = await response.json();
    return mapAmenityList(data);
  }

  async listForProperty(propertyId: number): Promise<AmenityItem[]> {
    const response = await getApiClient().get(`/host/properties/${propertyId}/amenities`);
    if (!response.ok) {
      throw new Error(
        await parseError(response, 'Impossible de charger les équipements de l’établissement.'),
      );
    }
    const data: unknown = await response.json();
    return mapAmenityList(data);
  }

  async syncForProperty(propertyId: number, amenityIds: number[]): Promise<AmenityItem[]> {
    const response = await getApiClient().put(`/host/properties/${propertyId}/amenities`, {
      amenityIds,
    });
    if (!response.ok) {
      throw new Error(
        await parseError(
          response,
          'Impossible de mettre à jour les équipements de l’établissement.',
        ),
      );
    }
    const data: unknown = await response.json();
    return mapAmenityList(data);
  }

  async listForRoom(propertyId: number, roomId: number): Promise<AmenityItem[]> {
    const response = await getApiClient().get(
      `/host/rooms/${roomId}/amenities?propertyId=${propertyId}`,
    );
    if (!response.ok) {
      throw new Error(
        await parseError(response, 'Impossible de charger les équipements de la chambre.'),
      );
    }
    const data: unknown = await response.json();
    return mapAmenityList(data);
  }

  async syncForRoom(
    propertyId: number,
    roomId: number,
    amenityIds: number[],
  ): Promise<AmenityItem[]> {
    const response = await getApiClient().put(
      `/host/rooms/${roomId}/amenities?propertyId=${propertyId}`,
      { amenityIds },
    );
    if (!response.ok) {
      throw new Error(
        await parseError(response, 'Impossible de mettre à jour les équipements de la chambre.'),
      );
    }
    const data: unknown = await response.json();
    return mapAmenityList(data);
  }
}

let service: HostAmenityService | null = null;

export function getHostAmenityService(): HostAmenityService {
  if (!service) {
    service = new HostAmenityService();
  }
  return service;
}
