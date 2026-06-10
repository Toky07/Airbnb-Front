import type { HostProperty, PropertyFormPayload } from '../../core/types/host.types';

export const emptyPropertyForm: PropertyFormPayload = {
  name: '',
  description: '',
  address: '',
  city: '',
  country: 'France',
  latitude: 0,
  longitude: 0,
  checkInTime: '15:00',
  checkOutTime: '11:00',
  propertyTypeId: null,
  imageFile: null,
};

export function propertyToFormPayload(property: HostProperty): PropertyFormPayload {
  return {
    name: property.name,
    description: property.description,
    address: property.address,
    city: property.city,
    country: property.country,
    latitude: property.latitude,
    longitude: property.longitude,
    checkInTime: property.checkInTime,
    checkOutTime: property.checkOutTime,
    propertyTypeId: property.propertyTypeId,
    imageFile: null,
  };
}
