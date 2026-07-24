import type { RoomFormPayload } from '../../core/types/host.types';
import type { RoomListItem } from '../../../rooms/core/types/room.types';

export const ROOM_MAX_IMAGES = 10;
export const EMPTY_IMAGE_VALUE: string[] = [];

export const emptyRoomForm: RoomFormPayload = {
  name: '',
  description: '',
  pricePerNight: 80,
  weekendPricePerNight: null,
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  quantity: 1,
  size: 20,
  status: 'available',
  roomTypeId: null,
  imageFiles: [],
  keptImagePaths: [],
};

export const ROOM_STATUS_OPTIONS = [
  { value: 'available', label: 'Disponible' },
  { value: 'occupied', label: 'Occupée' },
  { value: 'maintenance', label: 'Maintenance' },
] as const;

export function roomToFormPayload(room: RoomListItem): RoomFormPayload {
  return {
    name: room.name,
    description: room.description,
    pricePerNight: room.pricePerNight,
    weekendPricePerNight: room.weekendPricePerNight ?? null,
    maxGuests: room.maxGuests,
    bedrooms: room.bedrooms,
    bathrooms: room.bathrooms,
    beds: room.beds,
    quantity: room.quantity,
    size: room.size,
    status: room.status,
    roomTypeId: room.roomTypeId,
    imageFiles: [],
    keptImagePaths: room.images,
  };
}
