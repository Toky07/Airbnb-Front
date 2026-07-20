import { mapAmenityItem, type AmenityItem } from '../../core/types/amenity.types';

export function mapAmenityList(data: unknown): AmenityItem[] {
  return Array.isArray(data)
    ? data.map(mapAmenityItem).filter((item): item is AmenityItem => item !== null)
    : [];
}
