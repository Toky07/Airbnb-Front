import type { PropertyFormPayload } from '../types/host.types';

export function buildPropertyFormData(payload: PropertyFormPayload): FormData {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('description', payload.description);
  form.append('address', payload.address);
  form.append('city', payload.city);
  form.append('country', payload.country);
  form.append('latitude', String(payload.latitude));
  form.append('longitude', String(payload.longitude));
  form.append('checkInTime', payload.checkInTime);
  form.append('checkOutTime', payload.checkOutTime);
  if (payload.propertyTypeId) {
    form.append('propertyTypeId', String(payload.propertyTypeId));
  }
  if (payload.imageFile) {
    form.append('image', payload.imageFile);
  }
  return form;
}
