import type { AmenityItem } from './amenity.types';

export type AmenityListResult =
  | { success: true; amenities: AmenityItem[] }
  | { success: false; error: string };
