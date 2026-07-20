import type { HttpClient } from '../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../shared/http/parse-api-error';
import { mapAmenityList } from '../core/mappers/map-amenity-list';
import type { AmenityScope } from '../core/types/amenity.types';
import type {
  AmenityListResult,
  HostAmenityRepository,
} from '../application/ports/host-amenity.repository';

function scopePath(scope: AmenityScope): string {
  return scope === 'room' ? 'room' : 'property';
}

async function parseAmenityListResponse(
  response: Response,
  errorFallback: string,
): Promise<AmenityListResult> {
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return { success: false, error: parseApiError(data, errorFallback) };
  }

  return { success: true, amenities: mapAmenityList(data) };
}

export class HttpHostAmenityRepository implements HostAmenityRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  listOptions(scope: AmenityScope): Promise<AmenityListResult> {
    return this.httpClient
      .get(`/host/amenities/${scopePath(scope)}/options`)
      .then((response) =>
        parseAmenityListResponse(response, 'Impossible de charger les équipements.'),
      );
  }

  listForProperty(propertyId: number): Promise<AmenityListResult> {
    return this.httpClient
      .get(`/host/properties/${propertyId}/amenities`)
      .then((response) =>
        parseAmenityListResponse(
          response,
          'Impossible de charger les équipements de l’établissement.',
        ),
      );
  }

  syncForProperty(propertyId: number, amenityIds: number[]): Promise<AmenityListResult> {
    return this.httpClient
      .put(`/host/properties/${propertyId}/amenities`, { amenityIds })
      .then((response) =>
        parseAmenityListResponse(
          response,
          'Impossible de mettre à jour les équipements de l’établissement.',
        ),
      );
  }

  listForRoom(propertyId: number, roomId: number): Promise<AmenityListResult> {
    return this.httpClient
      .get(`/host/rooms/${roomId}/amenities?propertyId=${propertyId}`)
      .then((response) =>
        parseAmenityListResponse(
          response,
          'Impossible de charger les équipements de la chambre.',
        ),
      );
  }

  syncForRoom(
    propertyId: number,
    roomId: number,
    amenityIds: number[],
  ): Promise<AmenityListResult> {
    return this.httpClient
      .put(`/host/rooms/${roomId}/amenities?propertyId=${propertyId}`, { amenityIds })
      .then((response) =>
        parseAmenityListResponse(
          response,
          'Impossible de mettre à jour les équipements de la chambre.',
        ),
      );
  }
}
