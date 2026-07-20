import { resolveMediaUrl } from '../../../../shared/utils/resolve-media-url';
import type { AmenityItem } from '../../../amenity/core/types/amenity.types';

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
  slug: string;
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
  amenities?: AmenityItem[];
  propertyAmenities?: AmenityItem[];
};

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
