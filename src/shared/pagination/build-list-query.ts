import { DEFAULT_PAGE_SIZE, type ListQueryParams } from './types';

function appendPositiveInt(search: URLSearchParams, key: string, value?: number) {
  if (value !== undefined && value > 0) {
    search.set(key, String(value));
  }
}

function appendNonNegativeInt(search: URLSearchParams, key: string, value?: number) {
  if (value !== undefined && value >= 0) {
    search.set(key, String(value));
  }
}

export function buildListQuery(params: ListQueryParams = {}): string {
  const search = new URLSearchParams();
  search.set('page', String(params.page ?? 1));
  search.set('limit', String(params.limit ?? DEFAULT_PAGE_SIZE));

  const trimmed = params.search?.trim();
  if (trimmed) {
    search.set('search', trimmed);
  }

  appendPositiveInt(search, 'propertyId', params.propertyId);
  appendNonNegativeInt(search, 'minPrice', params.minPrice);
  appendNonNegativeInt(search, 'maxPrice', params.maxPrice);
  appendPositiveInt(search, 'minGuests', params.minGuests);
  appendPositiveInt(search, 'roomTypeId', params.roomTypeId);

  const city = params.city?.trim();
  if (city) {
    search.set('city', city);
  }

  const status = params.status?.trim();
  if (status) {
    search.set('status', status);
  }

  if (params.amenityIds && params.amenityIds.length > 0) {
    search.set('amenityIds', params.amenityIds.join(','));
  }

  const checkIn = params.checkIn?.trim();
  const checkOut = params.checkOut?.trim();
  if (checkIn && checkOut) {
    search.set('checkIn', checkIn);
    search.set('checkOut', checkOut);
  }

  if (params.lat !== undefined && params.lng !== undefined) {
    search.set('lat', String(params.lat));
    search.set('lng', String(params.lng));
    if (params.radiusKm !== undefined) {
      search.set('radiusKm', String(params.radiusKm));
    }
  }

  return `?${search.toString()}`;
}
