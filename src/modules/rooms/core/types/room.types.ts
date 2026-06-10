import { resolveMediaUrl } from '../../../../shared/utils/resolve-media-url';

export type CategorySummary = {
  id: number;
  name: string;
  slug: string;
};

export type PropertySummary = {
  id: number;
  name: string;
  city: string;
  country: string;
  address: string;
  description: string;
  checkInTime: string;
  checkOutTime: string;
  propertyType: CategorySummary | null;
};

export type UnavailableDateRange = {
  startDate: string;
  endDate: string;
};

export type RoomListItem = {
  id: number;
  name: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  quantity: number;
  size: number;
  status: string;
  propertyId: number;
  property: PropertySummary | null;
  roomTypeId: number | null;
  roomType: CategorySummary | null;
  images: string[];
  unavailableDates?: UnavailableDateRange[];
};

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
      checkInTime: String(raw.checkInTime ?? ''),
      checkOutTime: String(raw.checkOutTime ?? ''),
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
    description: String(record.description ?? ''),
    pricePerNight: record.pricePerNight,
    maxGuests: Number(record.maxGuests ?? 0),
    bedrooms: Number(record.bedrooms ?? 0),
    bathrooms: Number(record.bathrooms ?? 0),
    beds: Number(record.beds ?? 0),
    quantity: Number(record.quantity ?? 0),
    size: Number(record.size ?? 0),
    status: String(record.status ?? 'available'),
    propertyId,
    property,
    roomTypeId:
      typeof record.roomTypeId === 'number' ? record.roomTypeId : null,
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
  };
}

export function resolveRoomImageUrls(images: string[]): string[] {
  return images
    .map((path) => resolveMediaUrl(path))
    .filter((url): url is string => url !== null);
}

export function getRoomLocation(room: RoomListItem): string {
  const city = room.property?.city?.trim();
  const country = room.property?.country?.trim();

  if (city && country) {
    return `${city}, ${country}`;
  }

  return city || country || room.property?.name || 'Destination';
}

export function getRoomPrimaryImage(room: RoomListItem): string | null {
  const resolved = resolveRoomImageUrls(room.images);
  return resolved[0] ?? null;
}

export function formatPricePerNight(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function getRoomStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: 'Disponible',
    occupied: 'Occupée',
    maintenance: 'Maintenance',
  };
  return labels[status] ?? status;
}

export function isRoomBookable(room: RoomListItem): boolean {
  return room.status === 'available';
}
