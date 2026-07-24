import type { CategorySummary } from '../../../rooms/core/types/room.types';
import type { HostProfile, HostProperty } from '../types/host.types';

export function mapHostProperty(data: unknown): HostProperty | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (typeof record.id !== 'number' || typeof record.name !== 'string') {
    return null;
  }

  return {
    id: record.id,
    name: record.name,
    description: String(record.description ?? ''),
    address: String(record.address ?? ''),
    city: String(record.city ?? ''),
    country: String(record.country ?? ''),
    latitude: Number(record.latitude ?? 0),
    longitude: Number(record.longitude ?? 0),
    checkInTime: String(record.checkInTime ?? ''),
    checkOutTime: String(record.checkOutTime ?? ''),
    cancellationPolicy: String(record.cancellationPolicy ?? 'moderate'),
    touristTaxPerGuestNight: Number(record.touristTaxPerGuestNight ?? 0),
    ownerId: Number(record.ownerId ?? 0),
    propertyTypeId:
      typeof record.propertyTypeId === 'number' ? record.propertyTypeId : null,
    propertyType:
      record.propertyType &&
      typeof record.propertyType === 'object' &&
      typeof (record.propertyType as Record<string, unknown>).id === 'number'
        ? {
            id: (record.propertyType as Record<string, unknown>).id as number,
            name: String((record.propertyType as Record<string, unknown>).name ?? ''),
            slug: String((record.propertyType as Record<string, unknown>).slug ?? ''),
          }
        : null,
    image: typeof record.image === 'string' ? record.image : null,
    roomCount: Array.isArray(record.rooms)
      ? record.rooms.length
      : Number(record.roomCount ?? 0),
  };
}

export function mapHostProfile(data: unknown): HostProfile | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  const user = record.user;
  if (!user || typeof user !== 'object') {
    return null;
  }

  const userRecord = user as Record<string, unknown>;
  if (typeof userRecord.id !== 'number') {
    return null;
  }

  const properties = Array.isArray(record.properties)
    ? record.properties
        .map(mapHostProperty)
        .filter((property): property is HostProperty => property !== null)
    : record.property
      ? [mapHostProperty(record.property)].filter(
          (property): property is HostProperty => property !== null,
        )
      : [];

  return {
    user: {
      id: userRecord.id,
      firstName: String(userRecord.firstName ?? ''),
      lastName: String(userRecord.lastName ?? ''),
      email: String(userRecord.email ?? ''),
      phoneNumber: String(userRecord.phoneNumber ?? ''),
    },
    properties,
  };
}

export function mapCategoryOption(data: unknown): CategorySummary | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (typeof record.id !== 'number' || typeof record.name !== 'string') {
    return null;
  }

  return {
    id: record.id,
    name: record.name,
    slug: String(record.slug ?? ''),
  };
}
