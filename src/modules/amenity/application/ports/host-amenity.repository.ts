import type { AmenityItem, AmenityScope } from '../../core/types/amenity.types';

export type AmenityListResult =
  | { success: true; amenities: AmenityItem[] }
  | { success: false; error: string };

export interface HostAmenityRepository {
  listOptions(scope: AmenityScope): Promise<AmenityListResult>;
  listForProperty(propertyId: number): Promise<AmenityListResult>;
  syncForProperty(propertyId: number, amenityIds: number[]): Promise<AmenityListResult>;
  listForRoom(propertyId: number, roomId: number): Promise<AmenityListResult>;
  syncForRoom(
    propertyId: number,
    roomId: number,
    amenityIds: number[],
  ): Promise<AmenityListResult>;
}
