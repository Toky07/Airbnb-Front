import type { CategorySummary } from '../../../rooms/core/types/room.types';

export type { RoomListItem } from '../../../rooms/core/types/room.types';

export type HostUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type HostProperty = {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  checkInTime: string;
  checkOutTime: string;
  ownerId: number;
  propertyTypeId: number | null;
  propertyType: CategorySummary | null;
  image: string | null;
  roomCount: number;
};

export type HostProfile = {
  user: HostUser;
  properties: HostProperty[];
};

export type PropertyFormPayload = {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  checkInTime: string;
  checkOutTime: string;
  propertyTypeId: number | null;
  imageFile?: File | null;
};

export type RoomFormPayload = {
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
  roomTypeId: number | null;
  imageFiles?: File[];
  keptImagePaths?: string[];
};
