import type { ListQueryParams } from '../../../../shared/pagination/types';
import type { CategorySummary } from '../../../rooms/core/types/room.types';
import { getHostPropertyService } from './host-property.service';
import { getHostRoomService } from './host-room.service';
import type { HostProfile, HostProperty, PropertyFormPayload, RoomFormPayload } from '../types/host.types';

export class HostService {
  private readonly properties = getHostPropertyService();
  private readonly rooms = getHostRoomService();

  getProfile(): Promise<HostProfile | null> {
    return this.properties.getProfile();
  }

  listProperties(): Promise<HostProperty[]> {
    return this.properties.listProperties();
  }

  getProperty(propertyId: number): Promise<HostProperty | null> {
    return this.properties.getProperty(propertyId);
  }

  createProperty(payload: PropertyFormPayload) {
    return this.properties.createProperty(payload);
  }

  updateProperty(propertyId: number, payload: PropertyFormPayload) {
    return this.properties.updateProperty(propertyId, payload);
  }

  listRooms(propertyId: number, params: ListQueryParams = {}) {
    return this.rooms.listRooms(propertyId, params);
  }

  createRoom(propertyId: number, payload: RoomFormPayload) {
    return this.rooms.createRoom(propertyId, payload);
  }

  updateRoom(propertyId: number, id: number, payload: RoomFormPayload) {
    return this.rooms.updateRoom(propertyId, id, payload);
  }

  deleteRoom(propertyId: number, id: number) {
    return this.rooms.deleteRoom(propertyId, id);
  }

  listPropertyTypeOptions(): Promise<CategorySummary[]> {
    return this.rooms.listPropertyTypeOptions();
  }

  listRoomTypeOptions(): Promise<CategorySummary[]> {
    return this.rooms.listRoomTypeOptions();
  }
}

let service: HostService | null = null;

export function getHostService(): HostService {
  if (!service) {
    service = new HostService();
  }
  return service;
}

export { getHostReservationService } from './host-reservation.service';
export type { HostBookingOrder, HostReservationStats } from '../types/host-booking.types';
