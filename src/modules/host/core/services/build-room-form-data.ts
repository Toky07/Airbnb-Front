import type { RoomFormPayload } from '../types/host.types';

export function buildRoomFormData(payload: RoomFormPayload): FormData {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('description', payload.description);
  form.append('pricePerNight', String(payload.pricePerNight));
  if (payload.weekendPricePerNight != null && payload.weekendPricePerNight > 0) {
    form.append('weekendPricePerNight', String(payload.weekendPricePerNight));
  }
  form.append('maxGuests', String(payload.maxGuests));
  form.append('bedrooms', String(payload.bedrooms));
  form.append('bathrooms', String(payload.bathrooms));
  form.append('beds', String(payload.beds));
  form.append('quantity', String(payload.quantity));
  form.append('size', String(payload.size));
  form.append('status', payload.status);

  if (payload.roomTypeId) {
    form.append('roomTypeId', String(payload.roomTypeId));
  }

  payload.imageFiles?.forEach((file: File) => form.append('images', file));

  if (payload.keptImagePaths) {
    form.append('keptImages', JSON.stringify(payload.keptImagePaths));
  }

  return form;
}
