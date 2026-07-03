import { getApiClient } from '../../../../shared/http/api-client';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import { buildPropertyFormData } from '../utils/build-property-form-data';
import { mapHostProfile, mapHostProperty } from '../mappers/map-host-property';
import type { HostProfile, HostProperty, PropertyFormPayload } from '../types/host.types';

export class HostPropertyService {
  async getProfile(): Promise<HostProfile | null> {
    const response = await getApiClient().get('/host/profile');
    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return mapHostProfile(data);
  }

  async listProperties(): Promise<HostProperty[]> {
    const response = await getApiClient().get('/host/properties');
    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    return Array.isArray(data)
      ? data.map(mapHostProperty).filter((item): item is HostProperty => item !== null)
      : [];
  }

  async getProperty(propertyId: number): Promise<HostProperty | null> {
    const response = await getApiClient().get(`/host/properties/${propertyId}`);
    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return mapHostProperty(data);
  }

  async createProperty(
    payload: PropertyFormPayload,
  ): Promise<{ success: boolean; property?: HostProperty; error?: string }> {
    const response = await getApiClient().postFormData(
      '/host/properties',
      buildPropertyFormData(payload),
    );

    if (!response.ok) {
      const data: unknown = await response.json().catch(() => null);
      return {
        success: false,
        error: parseApiError(data, 'Création impossible.'),
      };
    }

    const data: unknown = await response.json();
    const property = mapHostProperty(data);
    return property ? { success: true, property } : { success: false, error: 'Réponse invalide.' };
  }

  async updateProperty(
    propertyId: number,
    payload: PropertyFormPayload,
  ): Promise<{ success: boolean; property?: HostProperty; error?: string }> {
    const response = await getApiClient().putFormData(
      `/host/properties/${propertyId}`,
      buildPropertyFormData(payload),
    );

    if (!response.ok) {
      const data: unknown = await response.json().catch(() => null);
      return {
        success: false,
        error: parseApiError(data, 'Modification impossible.'),
      };
    }

    const data: unknown = await response.json();
    const property = mapHostProperty(data);
    return property ? { success: true, property } : { success: false, error: 'Réponse invalide.' };
  }
}

let propertyService: HostPropertyService | null = null;

export function getHostPropertyService(): HostPropertyService {
  if (!propertyService) {
    propertyService = new HostPropertyService();
  }
  return propertyService;
}
