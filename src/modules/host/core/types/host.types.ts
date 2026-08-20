import type { CategorySummary } from '../../../rooms/core/types/room.types';

export type { RoomListItem } from '../../../rooms/core/types/room.types';

export type HostUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type HostStripeConnect = {
  onboardingStatus: 'not_started' | 'pending' | 'complete';
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  hasAccount: boolean;
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
  cancellationPolicy: string;
  touristTaxPerGuestNight: number;
  houseRules: string;
  checkInInstructions: string;
  wifiName: string;
  wifiPassword: string;
  emergencyContact: string;
  ownerId: number;
  propertyTypeId: number | null;
  propertyType: CategorySummary | null;
  image: string | null;
  roomCount: number;
};

export type HostProfile = {
  user: HostUser;
  properties: HostProperty[];
  stripe: HostStripeConnect;
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
  cancellationPolicy: string;
  touristTaxPerGuestNight: number;
  propertyTypeId: number | null;
  imageFile?: File | null;
  houseRules: string;
  checkInInstructions: string;
  wifiName: string;
  wifiPassword: string;
  emergencyContact: string;
};

export type RoomFormPayload = {
  name: string;
  description: string;
  pricePerNight: number;
  weekendPricePerNight?: number | null;
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
