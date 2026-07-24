import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { ListQueryParams } from '../../../../shared/pagination/types';

function parsePositiveInt(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function parseNonNegativeInt(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function parseFloatParam(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseAmenityIds(value: string | null): number[] | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const ids = value
    .split(',')
    .map((entry) => Number.parseInt(entry.trim(), 10))
    .filter((id) => Number.isFinite(id) && id > 0);

  return ids.length > 0 ? ids : undefined;
}

export function useSearchQueryParams() {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const query = searchParams.get('q')?.trim() ?? '';
    const checkIn = searchParams.get('checkIn')?.trim() ?? '';
    const checkOut = searchParams.get('checkOut')?.trim() ?? '';
    const hasDateRange = Boolean(checkIn && checkOut && checkOut > checkIn);
    const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);
    const roomTypeId =
      parsePositiveInt(searchParams.get('roomTypeId'))
      ?? parsePositiveInt(searchParams.get('type'));

    return {
      query,
      checkIn,
      checkOut,
      hasDateRange,
      page,
      roomTypeId,
      minPrice: parseNonNegativeInt(searchParams.get('minPrice')),
      maxPrice: parseNonNegativeInt(searchParams.get('maxPrice')),
      minGuests: parsePositiveInt(searchParams.get('minGuests')),
      city: searchParams.get('city')?.trim() ?? '',
      amenityIds: parseAmenityIds(searchParams.get('amenityIds')),
      lat: parseFloatParam(searchParams.get('lat')),
      lng: parseFloatParam(searchParams.get('lng')),
      radiusKm: parseFloatParam(searchParams.get('radiusKm')),
      searchParams,
    };
  }, [searchParams]);
}

export function buildRoomListParams(
  state: ReturnType<typeof useSearchQueryParams>,
  limit: number,
): ListQueryParams {
  return {
    page: state.page,
    limit: limit as ListQueryParams['limit'],
    search: state.query || undefined,
    checkIn: state.hasDateRange ? state.checkIn : undefined,
    checkOut: state.hasDateRange ? state.checkOut : undefined,
    minPrice: state.minPrice,
    maxPrice: state.maxPrice,
    minGuests: state.minGuests,
    roomTypeId: state.roomTypeId,
    city: state.city || undefined,
    amenityIds: state.amenityIds,
    status: 'available',
    lat: state.lat,
    lng: state.lng,
    radiusKm: state.radiusKm,
  };
}
