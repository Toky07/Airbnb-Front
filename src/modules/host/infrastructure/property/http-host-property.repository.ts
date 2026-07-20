import type { HttpClient } from '../../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../../shared/http/parse-api-error';
import { mapHostProfile, mapHostProperty } from '../../core/mappers/map-host-property';
import type {
  HostPropertyRepository,
  PropertyMutationResult,
} from '../../application/property/ports/host-property.repository';
import type { PropertyFormPayload } from '../../core/types/host.types';
import { buildPropertyFormData } from './build-property-form-data';

async function parsePropertyMutationResponse(
  response: Response,
  errorFallback: string,
): Promise<PropertyMutationResult> {
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return { success: false, error: parseApiError(data, errorFallback) };
  }

  const property = mapHostProperty(data);
  if (!property) {
    return { success: false, error: 'Réponse invalide.' };
  }

  return { success: true, property };
}

export class HttpHostPropertyRepository implements HostPropertyRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async getProfile() {
    const response = await this.httpClient.get('/host/profile');
    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return mapHostProfile(data);
  }

  async listProperties() {
    const response = await this.httpClient.get('/host/properties');
    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    return Array.isArray(data)
      ? data.map(mapHostProperty).filter((item): item is NonNullable<typeof item> => item !== null)
      : [];
  }

  async getProperty(propertyId: number) {
    const response = await this.httpClient.get(`/host/properties/${propertyId}`);
    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return mapHostProperty(data);
  }

  createProperty(payload: PropertyFormPayload): Promise<PropertyMutationResult> {
    return this.httpClient
      .postFormData('/host/properties', buildPropertyFormData(payload))
      .then((response) => parsePropertyMutationResponse(response, 'Création impossible.'));
  }

  updateProperty(
    propertyId: number,
    payload: PropertyFormPayload,
  ): Promise<PropertyMutationResult> {
    return this.httpClient
      .putFormData(`/host/properties/${propertyId}`, buildPropertyFormData(payload))
      .then((response) => parsePropertyMutationResponse(response, 'Modification impossible.'));
  }
}
