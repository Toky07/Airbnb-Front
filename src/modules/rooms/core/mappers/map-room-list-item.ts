import { mapAmenityItem, type AmenityItem } from '../../../amenity/core/types/amenity.types';
import type {
  PropertySummary,
  RoomListItem,
  UnavailableDateRange,
} from '../types/room.types';

export function mapRoomListItem(data: unknown): RoomListItem | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (
    typeof record.id !== 'number' ||
    typeof record.name !== 'string' ||
    typeof record.pricePerNight !== 'number'
  ) {
    return null;
  }

  let propertyId = 0;
  let property: PropertySummary | null = null;

  if (record.property && typeof record.property === 'object') {
    const raw = record.property as Record<string, unknown>;
    if (typeof raw.id === 'number') {
      propertyId = raw.id;
    }
    property = {
      id: typeof raw.id === 'number' ? raw.id : 0,
      name: String(raw.name ?? ''),
      city: String(raw.city ?? ''),
      country: String(raw.country ?? ''),
      address: String(raw.address ?? ''),
      description: String(raw.description ?? ''),
      latitude: typeof raw.latitude === 'number' ? raw.latitude : undefined,
      longitude: typeof raw.longitude === 'number' ? raw.longitude : undefined,
      checkInTime: String(raw.checkInTime ?? ''),
      checkOutTime: String(raw.checkOutTime ?? ''),
      cancellationPolicy:
        typeof raw.cancellationPolicy === 'string' ? raw.cancellationPolicy : 'moderate',
      propertyType:
        raw.propertyType &&
        typeof raw.propertyType === 'object' &&
        typeof (raw.propertyType as Record<string, unknown>).id === 'number'
          ? {
              id: (raw.propertyType as Record<string, unknown>).id as number,
              name: String((raw.propertyType as Record<string, unknown>).name ?? ''),
              slug: String((raw.propertyType as Record<string, unknown>).slug ?? ''),
            }
          : null,
    };
  }

  if (typeof record.propertyId === 'number' && record.propertyId > 0) {
    propertyId = record.propertyId;
  }

  const images = Array.isArray(record.images)
    ? record.images.filter((img): img is string => typeof img === 'string')
    : [];

  return {
    id: record.id,
    name: record.name,
    slug: String(record.slug ?? ''),
    description: String(record.description ?? ''),
    pricePerNight: record.pricePerNight,
    weekendPricePerNight:
      typeof record.weekendPricePerNight === 'number'
        ? record.weekendPricePerNight
        : null,
    maxGuests: Number(record.maxGuests ?? 0),
    bedrooms: Number(record.bedrooms ?? 0),
    bathrooms: Number(record.bathrooms ?? 0),
    beds: Number(record.beds ?? 0),
    quantity: Number(record.quantity ?? 0),
    size: Number(record.size ?? 0),
    status: String(record.status ?? 'available'),
    propertyId,
    property,
    roomTypeId: typeof record.roomTypeId === 'number' ? record.roomTypeId : null,
    roomType:
      record.roomType &&
      typeof record.roomType === 'object' &&
      typeof (record.roomType as Record<string, unknown>).id === 'number'
        ? {
            id: (record.roomType as Record<string, unknown>).id as number,
            name: String((record.roomType as Record<string, unknown>).name ?? ''),
            slug: String((record.roomType as Record<string, unknown>).slug ?? ''),
          }
        : null,
    images,
    unavailableDates: Array.isArray(record.unavailableDates)
      ? record.unavailableDates.filter(
          (r): r is UnavailableDateRange =>
            r != null &&
            typeof r === 'object' &&
            typeof (r as Record<string, unknown>).startDate === 'string' &&
            typeof (r as Record<string, unknown>).endDate === 'string',
        )
      : undefined,
    amenities: Array.isArray(record.amenities)
      ? record.amenities
          .map(mapAmenityItem)
          .filter((item): item is AmenityItem => item !== null)
      : undefined,
    propertyAmenities: Array.isArray(record.propertyAmenities)
      ? record.propertyAmenities
          .map(mapAmenityItem)
          .filter((item): item is AmenityItem => item !== null)
      : undefined,
  };
}
